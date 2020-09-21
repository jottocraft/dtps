/**
 * @file DTPS Core functions and module loader
 * @author jottocraft
 * @version v3.0.4
 * 
 * @copyright Copyright (c) 2018-2020 jottocraft. All rights reserved.
 * @license GPL-2.0-only
 */

//Make sure DTPS isn't already loading
if (typeof dtps !== "undefined") throw "Error: DTPS is already loading";

/**
 * Global DTPS object
 * All global DTPS functions and variables are stored in this object
 * 
 * @global
 * @namespace dtps
 * @property {number} ver Comparable version number
 * @property {string} env DTPS enviornment ("prod" or "dev")
 * @property {string} readableVer Formatted semantic version number
 * @property {Class[]} classes DTPS classes array
 * @property {string} baseURL The base URL that DTPS is being loaded from
 * @property {boolean} unstable This is true if loading an unstable version of DTPS
 * @property {boolean} gradebookExpanded True if gradebook details (Show more...) is open. Used in the generic gradebook and may be used in custom gradebook implementations.
 * @property {string|undefined} popup Popup to show when loaded. Either undefined (no popup), "firstrun", or "changelog". 
 * @property {User} user Current user, fetched with dtps.init
 * @property {number|string} selectedClass The selected class number, or "dash" if the dashboard is selected. Set when the first screen is loaded in dtps.init.
 * @property {string} selectedContent The selected class content/tab. Set when the first class content is loaded. Defaults to "stream".
 * @property {number|undefined} bgTimeout Background transition timeout when switching between classes
 * @property {Array<Assignment|Announcement>} updates Array of up to 10 recently graded assignments or announcements. 
 * @property {DashboardItem[]} dashboardItems Array of items that can be shown on the dashboard
 * @property {DashboardItem[]} leftDashboard Items on the left side of the dashboard based on dtps.dashboardItems and user prefrences. Set in dtps.loadDashboardPrefs.
 * @property {DashboardItem[]} rightDashboard Items on the right side of the dashboard based on dtps.dashboardItems and user prefrences. Set in dtps.loadDashboardPrefs.
 */
var dtps = {
    ver: 304,
    readableVer: "v3.0.4",
    env: window.jottocraftSatEnv || "prod",
    classes: [],
    baseURL: document.currentScript.src ? (String(document.currentScript.src).split('/')[0] + "//" + String(document.currentScript.src).split('/')[2]) : "https://powerplus.app",
    unstable: window.localStorage.dtpsLoaderPref == "canary" || window.localStorage.dtpsLoaderPref == "debugging" || String(document.currentScript.src).includes("http://localhost"),
    gradebookExpanded: false,
    updates: [],
    dashboardItems: [
        {
            name: "Calendar",
            id: "dtps.calendar",
            icon: "event",
            size: 100,
            defaultSide: "left"
        }, {
            name: "Updates",
            id: "dtps.updates",
            icon: "calendar_view_day",
            size: 170,
            defaultSide: "left"
        }, {
            name: "Due Today",
            id: "dtps.dueToday",
            icon: "check_circle_outline",
            size: 20,
            defaultSide: "right"
        }, {
            name: "Upcoming Assignments",
            id: "dtps.upcoming",
            icon: "view_stream",
            size: 250,
            defaultSide: "right"
        }
    ]
};

//Load jQuery ASAP
jQuery.getScript("https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js");

//Fluid UI theme listener (for changing background color)
document.addEventListener("fluidTheme", function (data) {
    if (dtps.oldTheme !== data.detail) {
        //Theme has changed
        dtps.oldTheme = data.detail;

        //Update background gradient
        var next = window.getComputedStyle(document.getElementsByClassName("background")[0]).getPropertyValue("--grad")
        if (dtps.selectedClass !== "dash") next = "linear-gradient(to bottom right, " + (dtps.classes[dtps.selectedClass] && dtps.classes[dtps.selectedClass].color) + ", var(--background))"
        if (dtps.selectedClass !== "dash") $('body').removeClass('dashboard');
        $(".background").css("background", next);

        //Re-run chroma
        dtps.chroma();
    }
});

/**
 * Debugging shortcut for getting the selected class. This should only be used in the web inspector and not in actual code.
 * 
 * @return {object|undefined} The selected class 
 */
dtps.class = function () {
    return dtps.classes[dtps.selectedClass]
}

/**
 * Checks if a Date is today
 * 
 * @param {Date} date Date string to check 
 */
dtps.isToday = function (date) {
    var today = new Date();
    var d1 = new Date(date);

    return d1.getFullYear() === today.getFullYear() &&
        d1.getMonth() === today.getMonth() &&
        d1.getDate() === today.getDate();
}

/**
 * Fetches and displays the DTPS changelog modal
 * 
 * @param onlyIfNewVersion True if the changelog should only show if this is a new version
 */
dtps.changelog = function (onlyIfNewVersion) {
    //Fetch latest changelog from GitHub releases
    jQuery.getScript("https://cdnjs.cloudflare.com/ajax/libs/showdown/1.8.6/showdown.min.js", function () {
        markdown = new showdown.Converter();
        jQuery.getJSON("https://api.github.com/repos/jottocraft/dtps/releases/latest", function (data) {
            //Convert changelog to HTML and render in the changelog card
            var changelogHTML = markdown.makeHtml(data.body);
            jQuery(".card.changelog").html(`<i onclick="fluid.cards.close('.card.changelog')" class="material-icons close">close</i>` + changelogHTML);

            if (!onlyIfNewVersion) {
                //Show changelog
                fluid.cards.close(".card.focus");
                fluid.cards(".card.changelog");
            } else if (Number(data.tag_name.replace(/[^0-9]/g, '')) > Number(window.localStorage.dtps)) {
                //Show changelog if this is a new(er) version
                localStorage.setItem('dtps', data.tag_name.replace(/[^0-9]/g, ''));

                if (!data.tag_name.includes("s")) {
                    //s in tag_name means a silent release
                    fluid.cards.close(".card.focus");
                    fluid.cards(".card.changelog");
                }
            }
        });
    });
};

/**
 * Logs debugging messages
 * 
 * @param {string} msg The debugging message to log
 */
dtps.log = function (msg) {
    if (dtps.env == "dev") console.log("[DTPS]", msg);
}


/**
 * Shows an error message alert and logs to console
 * 
 * @param {string} msg The error to display
 * @param {string} [devNotes] Technical error details displayed in a smaller font
 * @param {Error} [err] An error object to log to the console. If this is null, DTPS will assume the error has been handled elsewhere.
 */
dtps.error = function (msg, devNotes, err) {
    if (err !== null) {
        var formattedDevNotes = "";
        if (devNotes) {
            formattedDevNotes = '<div style="font-size: 12px; color: var(--secText, gray); margin-top: 10px;">' + devNotes + '</div>';
        }
        console.error("[DTPS !!ERROR!!]", devNotes + ": ", err);
        fluid.alert("Error", msg + formattedDevNotes, "error");
    }
}

/**
 * Renders "Welcome to Project DTPS" screen on the first run
 */
dtps.firstrun = function () {
    //Set latest changelog version to current version
    window.localStorage.setItem('dtps', dtps.ver);

    //Welcome to DTPS screen HTML
    jQuery(".card.changelog").html(/*html*/`
        <h3 style="margin-bottom: 0px;">Welcome to Power+</h3>
        <h5 style="color: var(--secText); font-weight: bold; font-size: 22px;">${dtps.readableVer}</h5>

        <div class="welcomeSection">
            <i class="material-icons">dashboard</i>
            <h5>${dtpsLMS.gradebook ? "Manage your coursework and grades" : "Manage your coursework"}</h5>
            <p>Power+ organizes all of your coursework so you can easily see what you need to do next. The dashboard shows upcoming assignments, recent grades, and announcements.
            ${dtpsLMS.gradebook ? `Power+ includes a gradebook designed for ${dtpsLMS.name} to help you understand your grades.` : ``}</p>
        </div>

        ${dtpsLMS.isDemoLMS ? /*html*/`
            <div class="welcomeSection">
                <i class="material-icons">priority_high</i>
                <h5>This is a demo</h5>
                <p>Assignment information, grades, and other content displayed is not real and is for demonstration purposes only. This demo does not retrieve or collect any data.</p>
            </div>
        ` : /*html*/`
            <div class="welcomeSection">
                <i class="material-icons">security</i>
                <h5>Privacy</h5>
                <p>Power+ does not collect any information. All of the data used in Power+ is fetched directly from ${dtpsLMS.shortName} and is never sent anywhere else. 
                 User preferences, grade history, and other Power+ data is stored locally on your computer and is not associated with your ${dtpsLMS.shortName} account.</p>
            </div>
            <div class="welcomeSection">
                <i class="material-icons">priority_high</i>
                <h5>Power+ is not official</h5>
                <p>Assignment information, grades, and other content displayed in Power+ are not official. Power+ is neither created nor endorsed by ${dtpsLMS.legalName}.
                 Power+ may have bugs that could cause it to display inaccurate information. Use Power+ at your own risk.</p>
            </div>
        `}
        
        <br />
        <div onclick="window.localStorage.setItem('dtpsInstalled', 'true'); fluid.cards.close('.card.changelog');" class="btn">
            <i class="material-icons">arrow_forward</i> Continue
        </div>
    `);

    //Show Welcome to DTPS card
    fluid.cards.close(".card.focus");
    fluid.cards(".card.changelog", "stayOpen");
};

/**
 * Renders the DTPS loading screen
 */
dtps.renderLoadingScreen = function () {
    if (!window.dtpsPreLoader || dtps.user) {
        //Only show the loader if the extension hasn't already shown it
        jQuery("body").append(/*html*/`
            <div id="dtpsNativeOverlay" style="position: fixed; top: 0px; left: 0px; width: 100vw; height: 100vh; z-index: 999; background: #191919; text-align: center; z-index: 999; transition: opacity 0.2s;">
                &nbsp;
                <img style="height: 100px; margin-top: 132px;" src="https://i.imgur.com/eiTE2sW.png" />
                <div class="spinner" style="margin-top: 300px;"></div>
                <style>body { overflow: hidden !important; } .spinner { width: 40px; height: 40px; margin: 40px auto; background-color: gray; border-radius: 100%; -webkit-animation: sk-scaleout 1.0s infinite ease-in-out; animation: sk-scaleout 1.0s infinite ease-in-out; } @-webkit-keyframes sk-scaleout { 0% { -webkit-transform: scale(0) } 100% { -webkit-transform: scale(1.0); opacity: 0; } } @keyframes sk-scaleout { 0% { -webkit-transform: scale(0); transform: scale(0); } 100% { -webkit-transform: scale(1.0); transform: scale(1.0); opacity: 0; } }</style>
            </div>
        `);
    }
}

/**
 * Load all external JavaScript libraries
 * 
 * @param {function} cb Callback function
 */
dtps.JS = function (cb) {
    //Moment & Fullcalendar are used for the calendar on the dashboard
    jQuery.getScript("https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.22.2/moment.min.js", function () {
        jQuery.getScript("https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/3.9.0/fullcalendar.min.js")
    });

    //Fuse.js is used for search
    jQuery.getScript('https://cdnjs.cloudflare.com/ajax/libs/fuse.js/3.3.0/fuse.min.js');

    //jQuery UI for dashboard settings page
    jQuery.getScript('https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js');

    //Tinycolor used for Fluid UI acrylic & color manipulation
    jQuery.getScript("https://cdn.jottocraft.com/tinycolor.js", () => {
        //dtao/nearest-color is used for finding the nearest class color
        jQuery.getScript("https://cdn.jottocraft.com/nearest-color.dtao.js", () => {
            //Fluid UI for core UI elements
            jQuery.getScript('https://cdn.jottocraft.com/fluid/v4.min.js', cb);
        })
    });
}

/**
 * Load all DTPS CSS files
 */
dtps.CSS = function () {
    jQuery("<link/>", {
        rel: "stylesheet",
        type: "text/css",
        href: "https://cdn.jottocraft.com/fluid/v4.min.css",
        class: "dtpsHeadItem"
    }).appendTo("head");

    jQuery("<link/>", {
        rel: "stylesheet",
        type: "text/css",
        href: dtps.baseURL + "/dtps.css",
        class: "dtpsHeadItem"
    }).appendTo("head");

    jQuery("<link/>", {
        rel: "stylesheet",
        type: "text/css",
        href: "https://fonts.googleapis.com/css?family=Material+Icons+Outlined",
        class: "dtpsHeadItem"
    }).appendTo("head");

    jQuery("<link/>", {
        rel: "stylesheet",
        type: "text/css",
        href: "https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/3.9.0/fullcalendar.min.css",
        class: "dtpsHeadItem"
    }).appendTo("head");

    jQuery("<link/>", {
        rel: "stylesheet",
        type: "text/css",
        href: "https://fonts.googleapis.com/icon?family=Material+Icons+Extended",
        class: "dtpsHeadItem"
    }).appendTo("head");

    jQuery("<link/>", {
        rel: "stylesheet",
        type: "text/css",
        href: "https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/smoothness/jquery-ui.css",
        class: "dtpsHeadItem"
    }).appendTo("head");
}

/**
 * Starts DTPS (entrypoint function)
 */
dtps.init = function () {
    //Initial log
    dtps.log("Starting DTPS " + dtps.readableVer + "...");

    //Check for LMS config
    if (!window.dtpsLMS) {
        throw "Error: No DTPS LMS configuration found";
    }

    //Determine if changelog should be shown
    if (Number(window.localStorage.dtps) < dtps.ver) {
        dtps.log("New release");
        dtps.popup = "changelog";
    }

    //Determine if this is the first time loading DTPS
    if (window.localStorage.dtpsInstalled !== "true") {
        dtps.popup = "firstrun";
    }

    //Render loading screen
    dtps.renderLoadingScreen();

    //Fluid UI settings
    fluidThemes = [["midnight", "tome"], ["rainbow"]];
    fluidAutoLoad = false;

    //Set env discovery
    window.localStorage.setItem("jottocraftEnv", true);

    //Default selected content
    dtps.selectedContent = "stream";

    //Begin loading CSS
    dtps.CSS();

    //Begin loading static DTPS HTML
    dtps.render();

    //Fetch user and class data
    dtpsLMS.fetchUser().then(data => {
        //Prevent resetting the user if the user is already set (for parent accounts)
        if (!dtps.user) {
            dtps.user = data;

            //Set lmsID as current user ID by default
            dtps.user.lmsID = dtps.user.id;

            //If this is a parent account, show the parent UI
            if (dtps.user.children && dtps.user.children.length) {
                dtps.user.lmsID = dtps.user.children[0].id;
                dtps.user.parent = true;
            }
        }

        return dtpsLMS.fetchClasses();
    }).then((rawClasses) => {
        return new Promise(resolve => {
            if (dtpsLMS.institutionSpecific && dtpsLMS.updateClasses) {
                //Using an institution-specific script, make any nessasary changes and return updated classes
                dtpsLMS.updateClasses(rawClasses).then((updatedClasses) => {
                    resolve(updatedClasses);
                }).catch((e) => {
                    reject(e);
                });
            } else {
                //No institution-specific script, return classes as-is
                resolve(rawClasses);
            }
        });
    }).then(classData => {
        //Store classData to dtps.classes
        dtps.classes = classData;

        //Add course num props
        dtps.classes.forEach((course, index) => course.num = index);

        //Fetch JavaScript modules
        dtps.JS(() => {
            //Define DTPS class color pallete
            var nearestCourseColor = nearestColor.from({
                //Primary color shades
                red: "#cc4747",
                brown: "#9a4429",
                orange: "#ce734e",
                pumpkin: "#c58535",
                yellow: "#b58f38",
                yellowGreen: "#7c9630",
                green: "#439a47",
                oceanGreen: "#339a70",
                keppel: "#40b5c3",
                skyBlue: "#40a4d6",
                blue: "#2d72a0",
                purple: "#985cab",
                magenta: "#bd3e69",
                pink: "#ec7ca5",
                gray: "#888888",
                //Dark color shades
                gold: "#94652a",
                darkRed: "#943f3f",
                darkBlue: "#485182",
                darkPurple: "#6f4882",
                darkGreen: "#3d7358",
                //Light color shades
                lightOrange: "#ea7a44",
                lightRed: "#e07f7f",
                lightBlue: "#76c1e6",
                lightPurple: "#978fd6",
                lightGreen: "#7ebb95",
                lightBrown: "#928871"
            });

            //Loop over each class to update the color and check for grade calculation
            dtps.classes.forEach(course => {
                course.color = course.color ? nearestCourseColor(course.color).value : "gray";

                if (dtpsLMS.calculateGrade) {
                    //This LMS/Institution supports grade calculation, show loading indicator for grade
                    //Grade will be calculated once assignments are fetched

                    course.letter = "..."; //Setting this to ... shows the loading indicator
                    course.grade = undefined;
                }
            });

            //Fluid UI screens
            fluid.defaultScreen = "dashboard";
            fluid.screens.dashboard = dtps.baseURL + "/scripts/assignments.js";
            fluid.screens.stream = dtps.baseURL + "/scripts/assignments.js";
            fluid.screens.moduleStream = dtps.baseURL + "/scripts/assignments.js";
            fluid.screens.pages = dtps.baseURL + "/scripts/pages-discussions.js";
            fluid.screens.discussions = dtps.baseURL + "/scripts/pages-discussions.js";

            if (dtpsLMS.gradebook) {
                //Handle LMS gradebook
                fluid.screens.gradebook = dtps.showLMSGradebook;
            } else if (dtpsLMS.genericGradebook) {
                //Generic gradebook script
                fluid.screens.gradebook = dtps.baseURL + "/scripts/assignments.js";
            }

            //Begin fetching class assignments
            dtps.classes.forEach((course, courseIndex) => {
                dtpsLMS.fetchAssignments(course.id).then((rawAssignments) => {
                    return new Promise(resolve => {
                        if (dtpsLMS.institutionSpecific && dtpsLMS.updateAssignments) {
                            //Using an institution-specific script, make any nessasary changes and return updated assignments
                            dtpsLMS.updateAssignments(rawAssignments).then(updatedAssignments => {
                                resolve(updatedAssignments);
                            }).catch(e => {
                                reject(e);
                            });
                        } else {
                            //No institution-specific script, return assignments as-is
                            resolve(rawAssignments);
                        }
                    });
                }).then(assignments => {
                    //Store assignments in the class
                    course.assignments = assignments;

                    //Add class props to assignments and add recent assignments to updates array 
                    course.assignments.forEach(assignment => {
                        assignment.class = courseIndex;

                        if (assignment.gradedAt && assignment.grade) {
                            //Add class number and type to object
                            dtps.updates.push({
                                class: course.num,
                                type: "assignment",
                                ...assignment
                            })
                        }
                    });

                    //Sort updates array from newest -> oldest
                    dtps.updates.sort(function (a, b) {
                        //Sort by postedAt (announcements) or gradedAt (assignments)
                        return new Date(b.gradedAt || b.postedAt).getTime() - new Date(a.gradedAt || a.postedAt).getTime()
                    });

                    //Keep only the 15 most recent updates
                    if (dtps.updates.length > 15) dtps.updates.length = 15;

                    //Calculate class grade if supported
                    if (dtpsLMS.calculateGrade) {
                        let gradeCalcResults = dtpsLMS.calculateGrade(course, assignments);

                        if (gradeCalcResults) {
                            //This class has a grade

                            //Set course letter and grade to grade calc results
                            course.letter = gradeCalcResults.letter;
                            course.grade = gradeCalcResults.grade;

                            //Save raw results object to the course so it can be accessed by the gradebook
                            course.gradeCalculation = gradeCalcResults;
                        } else {
                            //No grade for this class
                            course.letter = null;
                            course.grade = null;
                        }

                        //Force re-render sidebar to show grades only if the user isn't on pages or discussions
                        if ((dtps.selectedContent !== "pages") && (dtps.selectedContent !== "discuss")) {
                            dtps.showClasses(true);
                        }
                    }

                    //Grade history and gradebook
                    if (course.letter && (course.letter !== "...")) {
                        //Enable gradebook for this class
                        course.hasGradebook = true;

                        //Save grade history
                        dtps.logGrades(courseIndex);

                        //If the class is selected, call dtps.presentClass again to show the grades tab
                        if (courseIndex == dtps.selectedClass) {
                            dtps.presentClass(courseIndex);

                            //If the gradebook is selected, reload the gradebook
                            if (dtps.selectedContent == "grades") {
                                fluid.screen('gradebook', dtps.classes[courseIndex].id);
                            }
                        }
                    } else {
                        //This class doesn't have a gradebook, exit gradebook if selected
                        if ((courseIndex == dtps.selectedClass) && (dtps.selectedContent == "grades")) {
                            fluid.screen('stream', dtps.classes[courseIndex].id);
                        }
                    }

                    //Re-render screen if the dashboard or stream is selected
                    if ((dtps.selectedClass == "dash") || (dtps.selectedContent == "stream")) {
                        fluid.screen();
                    }
                });

                dtpsLMS.fetchAnnouncements(course.id).then(announcements => {
                    //Add announcements to updates array
                    announcements.forEach(announcement => {
                        //Add class number and type to object
                        dtps.updates.push({
                            class: course.num,
                            type: "announcement",
                            ...announcement
                        })
                    });

                    //Sort updates array from newest -> oldest
                    dtps.updates.sort(function (a, b) {
                        //Sort by postedAt (announcements) or gradedAt (assignments)
                        return new Date(b.gradedAt || b.postedAt).getTime() - new Date(a.gradedAt || a.postedAt).getTime()
                    });

                    //Keep only the 15 most recent updates
                    if (dtps.updates.length > 15) dtps.updates.length = 15;

                    if (dtps.selectedClass == "dash") {
                        fluid.screen();
                    }

                });
            });

            //Render remaining HTML
            dtps.renderLite();

            //Render initial screen
            fluid.screen();

            //Load popup if needed
            if (dtps.popup == "firstrun") {
                dtps.firstrun();
            } else if (dtps.popup == "changelog") {
                //Changelog will only show if the release notes are on GitHub
                dtps.changelog(true);
            }
        });
    }).catch(function (err) {
        //Web request error
        console.error("[DTPS] Error fetching user and classes at dtps.init", err);

        //404 Error means the user isn't logged in
        if (err.status == 404) {
            //Redirect to login page
            window.location.href = "/?dtpsLogin=true";
        } else {
            dtps.error("Failed to get user and/or course data", "Exception in promise @ dtps.init");
        }
    });

    //Load dashboard prefrences
    dtps.loadDashboardPrefs();
}

/**
 * 12 hour time formatter
 * 
 * @param {Date} date The date to format
 * @return {string} Formatted time string in 12hr format
 */
dtps.ampm = function (date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}

/**
 * Formats a date to a readable date string
 * 
 * @param {Date} date The date to format
 * @return {string} Formatted date string in DAY MONTH DATE, HH:MM AMPM format
 */
dtps.formatDate = function (date) {
    if (date) {
        return new Date(date).toDateString().slice(0, -5) + ", " + dtps.ampm(new Date(date));
    } else {
        return "";
    }
}

/**
 * Switches the current child account being observed
 * 
 * @param {Element} ele The dropdown element used to switch accounts
 */
dtps.obsSwitch = function (ele) {
    //Reset URL state
    history.replaceState(null, null, ' ');

    //Change user LMS id based on dropdown value
    dtps.user.lmsID = $(ele).val();

    //Clear data
    dtps.classes = [];
    dtps.updates = [];

    //Reload Power+
    dtps.init();
}

/**
 * Adjusts the height of an iFrame to match its content
 * 
 * @param {string} iframeID The ID of the iFrame element to adjust
 */
dtps.iframeLoad = function (iframeID) {
    var iFrame = document.getElementById(iframeID);
    if (iFrame) {
        iFrame.height = "";
        iFrame.height = iFrame.contentWindow.document.body.scrollHeight + "px";
    }
}

/**
 * Clears all DTPS data
 */
dtps.clearData = function () {
    if (window.confirm("Clearing Power+ data will clear all local user data stored by Power+. This should be done if it is a new semester / school year or if you are having issues with Power+. Are you sure you want to clear all your Power+ data?")) {
        window.localStorage.clear()
        window.alert("Power+ data cleared")
    }
}

/**
 * Runs Razer Chroma RGB effects for the selected content
 * 
 * @todo Pending v3 rewrite
 */
dtps.chroma = function () {
    if (fluid.chroma) {
        if (fluid.chroma.on) {
            var classVar = "--light"
            if ($("body").hasClass("dark")) classVar = "--norm"
            if ($("body").hasClass("midnight")) classVar = "--dark"
            if (dtps.selectedClass !== "dash") {
                var dark = "white";
                var lighting = JSON.parse(`[
        [null,null,null,` + (dtps.selectedContent == "stream" ? '"white","white","white","white"' : "null,null,null,null") + `,` + (dtps.selectedContent == "pages" ? '"white","white","white","white"' : "null,null,null,null") + `,` + (dtps.selectedContent == "grades" ? '"white","white","white","white"' : "null,null,null,null") + `,null,null,null,null,null,null,null],
        [null,null,` + (dtps.classes[dtps.selectedClass].grade >= 10 ? `"` + dark + `"` : 0) + `,` + (dtps.classes[dtps.selectedClass].grade >= 20 ? `"` + dark + `"` : 0) + `,` + (dtps.classes[dtps.selectedClass].grade >= 30 ? `"` + dark + `"` : 0) + `,` + (dtps.classes[dtps.selectedClass].grade >= 40 ? `"` + dark + `"` : 0) + `,` + (dtps.classes[dtps.selectedClass].grade >= 50 ? `"` + dark + `"` : 0) + `,
        ` + (dtps.classes[dtps.selectedClass].grade >= 60 ? `"` + dark + `"` : 0) + `,` + (dtps.classes[dtps.selectedClass].grade >= 70 ? `"` + dark + `"` : 0) + `,` + (dtps.classes[dtps.selectedClass].grade >= 80 ? `"` + dark + `"` : 0) + `,` + (dtps.classes[dtps.selectedClass].grade >= 90 ? `"` + dark + `"` : 0) + `,` + (dtps.classes[dtps.selectedClass].grade >= 100 ? `"` + dark + `"` : 0) + `,null,null,null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null]]`)
                var ele = $(".background")[0];
                if ($(".class." + dtps.selectedClass)[0] !== undefined) ele = $(".class." + dtps.selectedClass)[0];
                fluid.chroma.effect(tinycolor(getComputedStyle(ele).getPropertyValue(classVar)).saturate(70).toHexString(), lighting);
            } else {
                var ele = $(".background")[0];
                if ($(".class.dash")[0] !== undefined) ele = $(".class.dash")[0];
                fluid.chroma.static(getComputedStyle(ele).getPropertyValue(classVar));
            }
        }
    }
}

/**
 * Renders the class list in the sidebar
 * 
 * @param {boolean} [override] True if the sidebar should be forcefully re-rendered
 */
dtps.showClasses = function (override) {
    //Array of class HTML for the sidebar
    dtps.classlist = [];

    for (var i = 0; i < dtps.classes.length; i++) {
        //Determine letter grade HTML
        var letterGradeHTML = "";
        if (dtps.classes[i].letter) letterGradeHTML = dtps.classes[i].letter;
        if (dtps.classes[i].letter == null) letterGradeHTML = "--";
        if (dtps.classes[i].letter == "...") letterGradeHTML = `<div class="spinner" style="background-color: var(--norm); margin: -8px -10px;"></div>`; //Show loading indicator for ...

        //Add class HTML to array
        dtps.classlist.push(/*html*/`
            <div 
                onclick="${'dtps.selectedClass = ' + i}" 
                class="${'class item ' + i + ' ' + (dtps.selectedClass == i ? " active" : "")}"
                style="${'--classColor: ' + dtps.classes[i].color}"
            >
                <span class="label name">${dtps.classes[i].subject}</span>
                <div ${dtps.classes[i].letter == null ? `style="letter-spacing:2px;"` : ""} class="icon grade val">
                    ${letterGradeHTML}
                </div>
            </div>
        `);
    }

    //Only render HTML if the sidebar doesn't already have the classes rendered, or if override is true
    if (!jQuery(".sidebar .class.dash")[0] || override) {
        jQuery(".sidebar").html(/*html*/`
            <div class="bigLogo" style="text-align: center; margin: 10px 0 20px; white-space: nowrap; overflow: hidden;">
                <img style="width: 28px; margin-right: 7px; vertical-align: middle;" src="https://powerplus.app/icon.svg" />
                <h4 style="color: var(--text); display: inline-block; font-size: 28px; vertical-align: middle; margin: 0px;">Power+</h4>
            </div>
            
            <img class="logo" src="https://powerplus.app/favicon.png" />

            <div class="items">

                <div onclick="dtps.selectedClass = 'dash';" class="class item main dash ${dtps.selectedClass == "dash" ? "active" : ""}">
                    <span class="label name">Dashboard</span>
                    <div class="icon"><i class="material-icons">dashboard</i></div>
                </div>

                <div class="divider"></div>

                ${dtps.classlist.join("")}
            </div>

            <div onclick="$('body').toggleClass('collapsedSidebar'); if ($('body').hasClass('collapsedSidebar')) { $(this).children('i').html('keyboard_arrow_right'); } else {$(this).children('i').html('keyboard_arrow_left');}" init="true" class="collapse">
                <i class="material-icons">keyboard_arrow_left</i>
            </div>
        `);

        //Change view to stream if coming from pages or discussions, since those tabs change the sidebar
        if ((dtps.selectedContent == "pages") || (dtps.selectedContent == "discuss")) {
            //Show stream
            fluid.screen('stream', dtps.classes[dtps.selectedClass].id);
        }

        //Class onclick listener
        $(".class:not(.overrideClass)").click(function (event) {
            dtps.presentClass(dtps.selectedClass);

            //Load class content based on what's selected
            if ((dtps.selectedContent == "stream") && dtps.classes[dtps.selectedClass]) {
                fluid.screen("stream", dtps.classes[dtps.selectedClass].id);
            }

            if ((dtps.selectedContent == "moduleStream") && dtps.classes[dtps.selectedClass]) {
                fluid.screen("moduleStream", dtps.classes[dtps.selectedClass].id);
            }

            if ((dtps.selectedContent == "grades") && dtps.classes[dtps.selectedClass]) {
                if (dtps.classes[dtps.selectedClass].hasGradebook) {
                    fluid.screen("gradebook", dtps.classes[dtps.selectedClass].id);
                } else {
                    fluid.screen("stream", dtps.classes[dtps.selectedClass].id);
                }
            }

            if (dtps.selectedClass == "dash") {
                fluid.screen("dashboard");
            }
        });
    }
}

/**
 * Renders the class header (color, name, tabs, etc.) and sets the class as the selected class
 * 
 * @param {number|string} classNum The class number to load or "dash" if loading the dashboard
 */
dtps.presentClass = function (classNum) {
    //Set classNum as selected class
    dtps.selectedClass = classNum;

    //Update document title with class name
    if (dtps.classes[classNum]) {
        document.title = dtps.classes[classNum].subject + " | Power+";
    } else {
        document.title = "Power+";
    }

    //Set dashboard body class for CSS styles
    if (classNum == "dash") {
        $('body').addClass('dashboard');
    } else {
        $('body').removeClass('dashboard');
    }

    //Update RGB keyboard lighting effects
    dtps.chroma();

    //Set the default imageURL to an empty PNG to make the CSS transition work
    var imageURL = "https://i.imgur.com/SpqHCNo.png";

    if (fluid.get("pref-hideClassImages") !== "true") {
        //Class images are not disabled
        if (dtps.classes[classNum] && dtps.classes[classNum].image) {
            //Class has image
            imageURL = dtps.classes[classNum].image;
        }
    }

    //Run CSS animation for class transition
    $(".background").addClass("trans");
    $(".cover.image").css("background-image", 'url("' + imageURL + '")');
    $(".background").css("opacity", '0.90');
    $(".background").css("filter", 'none');

    //Clear any existing background animation timeout
    clearTimeout(dtps.bgTimeout);

    //Set 500ms transition
    dtps.bgTimeout = setTimeout(function () {
        //Set theme to something random to force the theme change listener to update
        dtps.oldTheme = "squidward theme park";
        document.dispatchEvent(new CustomEvent('fluidTheme'));

        //Remove transition
        $(".background").removeClass("trans");
    }, 500);

    //Set background color
    if (dtps.classes[classNum]) {
        $(".background").css("--classColor", dtps.classes[classNum].color);
    }

    //Remove active class from other classes in the sidebar, add the active class to the selected class
    $(".class." + classNum).siblings().removeClass("active");
    $(".class." + classNum).addClass("active");

    //Update title to show class name
    //If the dashboard is selected, this is just "Dashboard". Otherwise, this is Class.subject
    $("#headText").html(classNum == "dash" ? "Dashboard" : dtps.classes[classNum] && dtps.classes[classNum].subject);

    //If the class doesn't exist, hide the tabs
    //Otherwise, show the tabs
    if (!dtps.classes[classNum]) {
        $(".header .btns").hide();
    } else {
        $(".header .btns").show();
    }

    if (dtps.classes[classNum]) {
        //Show pages tab if the class supports it, otherwise, hide it
        if (dtps.classes[classNum].pages) {
            $(".btns .btn.pages").show();
        } else {
            $(".btns .btn.pages").hide();
        }

        //Show pages tab if the class supports it, otherwise, hide it
        if (dtps.classes[classNum].discussions) {
            $(".btns .btn.discuss").show();
        } else {
            $(".btns .btn.discuss").hide();
        }

        //Show gradebook if the LMS and the class supports it, otherwise, hide it
        if ((dtpsLMS.genericGradebook || dtpsLMS.gradebook) && dtps.classes[classNum].hasGradebook) {
            $(".btns .btn.grades").show();
        } else {
            $(".btns .btn.grades").hide();
        }

        //Hide tabs if only one tab is visible
        if ($("#dtpsTabBar .btn:visible").length < 2) {
            $("#dtpsTabBar").hide();
        }
    }
}

/**
 * Shows the gradebook using HTML from dtpsLMS.gradebook
 * 
 * @param {string} classID Class ID
 */
dtps.showLMSGradebook = function (classID) {
    //Get class index and set as selected class
    var classNum = dtps.classes.map(course => course.id).indexOf(classID);
    dtps.selectedClass = classNum;

    //Set stream as the selected content
    dtps.selectedContent = "grades";
    $("#dtpsTabBar .btn").removeClass("active");
    $("#dtpsTabBar .btn.grades").addClass("active");

    //Load class color, name, etc.
    dtps.presentClass(classNum);

    //Ensure classes are shown in the sidebar
    dtps.showClasses();

    if (classNum == -1) {
        //Class does not exist
        dtps.error("The selected class doesn't exist", "classNum check failed @ dtps.showLMSGradebook");
    }

    //Show loading indicator
    if ((dtps.selectedContent == "grades") && (dtps.selectedClass == classNum)) {
        jQuery(".classContent").html(`<div class="spinner"></div>`);
    }

    //Function to load gradebook HTML
    function renderGradebook() {
        dtpsLMS.gradebook(dtps.classes[classNum]).then(html => {
            if (html && (dtps.selectedClass == classNum) && (dtps.selectedContent == "grades")) {
                $(".classContent").html(html);
                if (dtpsLMS.gradebookDidRender) dtpsLMS.gradebookDidRender(dtps.classes[classNum]);
            }
        }).catch(function (err) {
            dtps.error("Could not load the gradebook", "Caught promise rejection @ dtps.showLMSGradebook", err);
        });
    }

    if (!fluid.externalScreens.stream) {
        //Load assignment functions first
        jQuery.getScript(dtps.baseURL + "/scripts/assignments.js", () => {
            renderGradebook();
        })
    } else {
        renderGradebook();
    }
}

/**
 * Shows a URL in the iFrame card
 * 
 * @param {string} url The URL to load
 */
dtps.showIFrameCard = function (url) {
    //Remove any previous URLs
    $('#CardIFrame').attr('src', '');

    //Show iFrame card
    fluid.cards('.card.iFrameCard');

    //Load new URL
    $('#CardIFrame').attr('src', url);
}

/**
 * Stores grade data locally for the previous grade feature
 * 
 * @param classNum Class number to log grade
 */
dtps.logGrades = function (classNum) {
    /*
        Grade change vars:
        gradeHistory-ID: current|previous (e.g. "A|B+" represents a change of B+ -> A)
        if there is only one grade, it is the current one
    */
    if (window.localStorage.getItem("gradeHistory-" + dtps.classes[classNum].id)) {
        var savedCurrent = window.localStorage.getItem("gradeHistory-" + dtps.classes[classNum].id).split("|")[0];
        var savedPrevious = window.localStorage.getItem("gradeHistory-" + dtps.classes[classNum].id).split("|")[1];

        if (savedCurrent !== dtps.classes[classNum].letter) {
            //Grade change
            window.localStorage.setItem("gradeHistory-" + dtps.classes[classNum].id, dtps.classes[classNum].letter + "|" + savedCurrent);
            dtps.classes[classNum].previousLetter = savedCurrent;
        }

        if ((savedCurrent == dtps.classes[classNum].letter) && savedPrevious) {
            //Previous grade is already saved
            dtps.classes[classNum].previousLetter = savedPrevious;
        }
    } else {
        //No history yet, store current grade
        window.localStorage.setItem("gradeHistory-" + dtps.classes[classNum].id, dtps.classes[classNum].letter);
    }
}

/**
 * Opens the settings page
 */
dtps.settings = function () {
    //Render dashboard HTML if not already loaded
    if ($("#leftDashboardColumn").attr("loaded") !== "true") {
        //Returns dashboard item HTML from a dashboard item array
        function dashboardHTML(dashboardArray) {
            return dashboardArray.map(dashboardItem => {
                return /*html*/`
                <div dashboardItem-id="${dashboardItem.id}" style="height: ${dashboardItem.size * 1.7 + 50}px" class="dashboardItem">
                    <h5>
                        <i class="material-icons">${dashboardItem.icon}</i>
                        <span>${dashboardItem.name}</span>
                    </h5>
                </div>
            `;
            }).join("");
        }

        //Render dashboard items
        $("#leftDashboardColumn").html(dashboardHTML(dtps.leftDashboard));
        $("#rightDashboardColumn").html(dashboardHTML(dtps.rightDashboard));

        //Make dashboard items sortable
        $(".dashboardColumn").sortable({
            connectWith: ".dashboardColumn",
            update: function (e, ui) {
                dtps.saveDashboardPrefs();
            }
        });

        //Store loaded state to prevent reloading dashboard items
        $("#leftDashboardColumn").attr("loaded", "true");
    }

    fluid.modal('.settingsCard');
}

/**
 * Saves dashboard prefrences
 */
dtps.saveDashboardPrefs = function () {
    var dashboardPrefs = [];

    //Add dashboard items
    for (var i = 0; i < $(".dashboardColumn").children().length; i++) {
        //Get HTML item
        var child = $($(".dashboardColumn").children()[i]);

        //Add item to dashboardPrefs array
        dashboardPrefs.push({
            id: child.attr("dashboardItem-id"),
            side: child.parent().attr("id").includes("left") ? "left" : "right"
        });
    }

    //Save to local storage
    window.localStorage.setItem("dtpsDashboardItems", JSON.stringify(dashboardPrefs));

    //Reload dashboard items
    dtps.loadDashboardPrefs();
}

/**
 * Loads dashboard prefrences
 */
dtps.loadDashboardPrefs = function () {
    //Define left and right dashboard columns
    dtps.leftDashboard = [];
    dtps.rightDashboard = [];

    //Add items to dashboard columns
    if (window.localStorage.dtpsDashboardItems) {
        //Add from user prefs

        //Parse JSON
        var dashboardPref = JSON.parse(window.localStorage.dtpsDashboardItems);

        //Generate arrays of dashboard item IDs
        var dashboardIDs = dtps.dashboardItems.map(item => item.id);

        //Add items to dashboard according to prefs
        dashboardPref.forEach(dashboardItemPref => {
            if (dashboardIDs.includes(dashboardItemPref.id)) {
                //Get item index based on dashboardIDs array
                var itemIndex = dashboardIDs.indexOf(dashboardItemPref.id);

                //Get item from dtps.dashboardItems array
                var dashboardItem = dtps.dashboardItems[itemIndex];

                //Add item to dashboard
                if (dashboardItemPref.side == "left") {
                    dtps.leftDashboard.push(dashboardItem);
                } else if (dashboardItemPref.side == "right") {
                    dtps.rightDashboard.push(dashboardItem);
                }
            }
        });
    } else {
        //Add from defaults
        dtps.dashboardItems.forEach(dashboardItem => {
            if (dashboardItem.defaultSide == "left") {
                dtps.leftDashboard.push(dashboardItem);
            } else if (dashboardItem.defaultSide == "right") {
                dtps.rightDashboard.push(dashboardItem);
            }
        })
    }
}

/**
 * Renders initial static DTPS HTML
 */
dtps.render = function () {
    //Remove all existing link tags and LMS head content
    $("link:not(.dtpsHeadItem)").remove();
    $("head *:not(.dtpsHeadItem)").remove();

    //Set default body classes
    $("body").attr("class", "dark showThemeWindows hasSidebar dashboard");

    //Set document title and favicon
    document.title = "Power+";
    jQuery("<link/>", {
        rel: "shortcut icon",
        type: "image/png",
        href: "https://powerplus.app/favicon.png"
    }).appendTo("head");

    //Remove existing LMS HTML (excluding DTPS loading screen HTML)
    jQuery("body *:not(#dtpsNativeOverlay):not(#dtpsNativeOverlay *)").remove();

    //Render HTML
    jQuery("body").append(/*html*/`
        <div style="line-height: 0;" class="sidebar acrylicMaterial"></div>

        <!-- Header background elements -->
        <div class="cover image"></div>
        <div class="background"></div>

        <!-- Header with class name and tabs -->
        <div class="header">
            <p id="timeRemaining" style="position: absolute;top:${dtps.unstable ? "2px" : "14px"};margin-left: 20px;"></p>
            ${dtps.unstable ? `<p style="position: absolute;top: 45px;margin-left: 20px; color: #ff6e6e; background-color: black; font-size: 12px;">THIS IS AN UNSTABLE VERSION OF POWER+. USE AT YOUR OWN RISK.</p>` : ""}
        
            <h2 id="headText">Dashboard</h2>
        
            <!-- Class tabs. Each button has init=true to prevent Fluid UI from automatically managing their states -->
            <div style="display: none;" id="dtpsTabBar" class="btns row tabs">
                <button init="true" onclick="fluid.screen('stream', dtps.classes[dtps.selectedClass].id);" class="btn stream">
                    <i class="material-icons">library_books</i>
                    Coursework
                </button>
                <button init="true" onclick="fluid.screen('discussions', dtps.classes[dtps.selectedClass].id);" class="btn discuss">
                    <i class="material-icons">forum</i>
                    Discussions
                </button>
                <button init="true" onclick="fluid.screen('pages', dtps.classes[dtps.selectedClass].id);" class="btn pages">
                    <i class="material-icons">insert_drive_file</i>
                    Pages
                </button>
                <button init="true" onclick="fluid.screen('gradebook', dtps.classes[dtps.selectedClass].id);" class="btn grades">
                    <i class="material-icons">assessment</i>
                    ${dtpsLMS.gradebook ? "Grades" : "Gradebook"}
                </button>
            </div>
        </div>

        <!-- Class content area -->
        <div class="classContent">
            <div class="spinner"></div>
        </div>

        <!-- Settings card (its inner HTML is added later) -->
        <div style="height: calc(100vh - 50px); overflow: auto !important;" class="card withnav focus close container settingsCard"></div>

        <!-- Toolbar (the thing at the top-right with your name, profile picture, and buttons. its inner HTML is also added later) -->
        <div class="toolbar items"></div>

        <!-- Changelog card -->
        <div style="border-radius: 30px;" class="card focus changelog close container">
            <i onclick="fluid.cards.close('.card.changelog')" class="material-icons close">close</i>
            <h3>What's new in Power+</h3>
            <h5>Loading...</h5>
        </div>

        <!-- General details card for assignments, outcomes, class info, etc. -->
        <div style="border-radius: 30px;" class="card focus details close container">
            <i onclick="fluid.cards.close('.card.details')" class="material-icons close">close</i>
            <p>An error occured</p>
        </div>

        <!-- General iFrame card (with white background) -->
        <div style="border-radius: 30px; top: 50px; background-color: white; color: black;" class="card focus close iFrameCard container">
            <i style="color: black !important;" onclick="fluid.cards.close('.card.iFrameCard'); $('#CardIFrame').attr('src', '');" class="material-icons close">close</i>
            <br /><br />
            <iframe style="width: 100%; height: calc(100vh - 175px); border: none;" id="CardIFrame"></iframe>
        </div>
    `);
}

/**
 * Renders basic content after the user has been loaded
 */
dtps.renderLite = function () {
    //Add hideGrades body class if enabled and preference listener
    if (fluid.get("pref-hideGrades") == "true") { jQuery('body').addClass('hidegrades'); }
    document.addEventListener("pref-hideGrades", function (e) {
        if ((e.detail == "true") || (e.detail == true)) {
            //hideGrades has been enabled, add class to body to hide grades via CSS
            jQuery('body').addClass('hidegrades');
        } else {
            //hideGrades has been disabled, remove class from body to show grades
            jQuery('body').removeClass('hidegrades');
        }
    });

    //Render settings card
    jQuery(".card.settingsCard").html(/*html*/`
        <i onclick="fluid.cards.close('.card.settingsCard')" class="material-icons close">close</i>

        <div class="sidenav" style="position: fixed; height: calc(100% - 50px); border-radius: 20px 0px 0px 20px;">
            <div class="title">
	            <img src="https://powerplus.app/icon.svg" style="width: 50px;vertical-align: middle;padding: 7px; padding-top: 14px;" />
	            <div style="vertical-align: middle; display: inline-block;">
                    <h5 style="font-weight: bold;display: inline-block;vertical-align: middle;">Power+</h5>
                    <p>${dtps.readableVer + (window.localStorage.dtpsLoaderPref ? ` <span style="font-size: 12px;">(${window.localStorage.dtpsLoaderPref})</span>` : "")}</p>
	            </div>
            </div>

            <div onclick="$('.abtpage').hide();$('.abtpage.settings').show();" class="item active">
                <i class="material-icons">settings</i> Settings
            </div>
            <div onclick="$('.abtpage').hide();$('.abtpage.dashboard').show();" class="item">
                <i class="material-icons">dashboard</i> Dashboard
            </div>
            ${dtps.env == "dev" ? /*html*/`
                <div onclick="$('.abtpage').hide();$('.abtpage.debugging').show();" class="item">
                    <i class="material-icons">bug_report</i> Debugging
                </div>
            ` : ``}
            <div onclick="$('.abtpage').hide();$('.abtpage.about').show(); if ($('body').hasClass('sudo')) { $('.advancedOptions').show(); $('.advOp').hide(); } else { $('.advancedOptions').hide(); $('.advOp').show(); }" class="item abt">
                <i class="material-icons">info</i> About
            </div>
        </div>

        <div style="min-height: 100%" class="content">
            <div class="abtpage settings">
                <h5>Settings</h5>
                
                <br />
                <p>Theme</p>

                <div>
                    <div class="btns row themeSelector"></div>
                    
                    <br /><br />
                    <p>Grades</p>

                    <div onclick="fluid.set('pref-hideGrades')" class="switch pref-hideGrades"><span class="head"></span></div>
                    <div class="label"><i class="material-icons">visibility_off</i> Hide class grades</div>
                </div>

                <br /><br />
                <p>Classes</p>

                <div>
                    <div onclick="fluid.set('pref-fullNames')" class="switch pref-fullNames"><span class="head"></span></div>
                    <div class="label"><i class="material-icons">title</i> Show full class names (requires reload)</div>
                    
                    <br /><br />
                    <div onclick="fluid.set('pref-hideClassImages')" class="switch pref-hideClassImages"><span class="head"></span></div>
                    <div class="label"><i class="material-icons">image</i> Hide class images</div>

                    <div class="razerChroma" style="display: none;">
                        <br /><br />
                        <div onclick="fluid.set('pref-chromaEffects')" class="switch pref-chromaEffects"><span class="head"></span></div>
                        <div class="label"><img style="width: 26px;vertical-align: middle;margin-right: 2px;" src="https://i.imgur.com/FLwviAM.png" class="material-icons" /> Razer Chroma Effects (beta)</div>
                    </div>
                </div>

                ${window.localStorage.githubCanary || window.localStorage.dtpsDebuggingPort ? /*html*/`
                    <br /><br />
                    <p>Prerelease testing</p>

                    <div>
                        <div class="btns row small">
                            <button 
                                onclick="window.localStorage.setItem('dtpsLoaderPref', 'prod')" 
                                class="btn ${window.localStorage.dtpsLoaderPref != "canary" && window.localStorage.dtpsLoaderPref != "debugging" ? "active" : ""}">
                                <i class="material-icons">label</i> Production
                            </button>
                            ${window.localStorage.githubCanary ? /*html*/`
                                <button 
                                    onclick="window.localStorage.setItem('dtpsLoaderPref', 'canary')" 
                                    class="btn ${window.localStorage.dtpsLoaderPref == "canary" ? "active" : ""}">
                                    <i class="material-icons">build_circle</i> Canary
                                </button>
                            ` : ``}
                            ${window.localStorage.dtpsDebuggingPort ? /*html*/`
                                <button 
                                    onclick="window.localStorage.setItem('dtpsLoaderPref', 'debugging')" 
                                    class="btn ${window.localStorage.dtpsLoaderPref == "debugging" ? "active" : ""}">
                                    <i class="material-icons">bug_report</i> Debugging
                                </button>
                            ` : ``}
                        </div>
                    </div>
                ` : ``}

            </div>

            <div style="display: none;" class="abtpage dashboard">
                <h5>Dashboard</h5>
                <p>You can rearrange the items shown on the dashboard by dragging them below. You might have to reload Power+ for changes to take effect.</p>

                <br />
                
                <div id="leftDashboardColumn" class="dashboardColumn"></div>

                <div id="rightDashboardColumn" class="dashboardColumn"></div>

            </div>

            ${dtps.env == "dev" ? /*html*/`
                <div style="display: none;" class="abtpage debugging">
                   <h5>Debugging</h5>
                   <p>These settings are for development only and might break Power+. Use at your own risk.</p>

                   <br />

                   <div>
                       <input id="dtpsDebuggingPort" value="${window.localStorage.dtpsDebuggingPort || ""}" placeholder="Debugging Port" />
                       <button class="btn small" onclick="window.localStorage.setItem('dtpsDebuggingPort', $('#dtpsDebuggingPort').val())"><i class="material-icons">save</i> Save</button>
                   </div>

                   <br />

                   <div>
                       <input id="dtpsLMSOverride" value="${window.localStorage.dtpsLMSOverride || ""}" placeholder="LMS override" />
                       <button class="btn small" onclick="window.localStorage.setItem('dtpsLMSOverride', $('#dtpsLMSOverride').val())"><i class="material-icons">save</i> Save</button>
                   </div>
                </div>
            ` : ``}

            <div style="display: none;" class="abtpage about">
                <h5>About</h5>

                <div class="card" style="padding: 10px 20px; box-shadow: none !important; border: 2px solid var(--elements); margin-top: 20px;">
                    <img src="https://powerplus.app/icon.svg" style="height: 50px; margin-right: 10px; vertical-align: middle; margin-top: 20px;" />
                    
                    <div style="display: inline-block; vertical-align: middle;">
                        <h4 style="font-weight: bold; font-size: 32px; margin-bottom: 0px;">Power+</h4>
                        <div style="font-size: 16px; margin-top: 5px;">
                            ${dtps.readableVer}
                            <div class="buildInfo" style="display: inline-block;margin: 0px 5px;font-size: 12px;cursor: pointer;"></div>
                        </div>
                    </div>

                    <div style="margin-top: 15px; margin-bottom: 7px;"><a onclick="dtps.changelog();" style="color: var(--lightText); margin: 0px 5px;" href="#"><i class="material-icons" style="vertical-align: middle">update</i> Changelog</a>
                        <a onclick="if (window.confirm('Are you sure you want to uninstall Power+? The extension will be removed and all of your Power+ data will be erased. If you use the Power+ bookmarklet, you will have to remove that yourself.')) { document.dispatchEvent(new CustomEvent('extensionData', { detail: 'extensionUninstall' })); window.localStorage.clear(); window.alert('Power+ has been uninstalled. Reload the page to go back to ${dtpsLMS.shortName}.') }" style="color: var(--lightText); margin: 0px 5px;" href="#"><i class="material-icons" style="vertical-align: middle">delete_outline</i> Uninstall</a>
                        <a style="color: var(--lightText); margin: 0px 5px;" href="https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=***REMOVED***&item_name=Donate+to+Power%2B&currency_code=USD&source=url"><i class="material-icons" style="vertical-align: middle">attach_money</i> Donate</a>
                        <a style="color: var(--lightText); margin: 0px 5px;" href="mailto:hello@jottocraft.com"><i class="material-icons" style="vertical-align: middle">email</i> Contact</a>
                    </div>
                </div>

                <div class="card" style="padding: 10px 20px; box-shadow: none !important; border: 2px solid var(--elements); margin-top: 20px;">
                    <div style="margin-top: 12px;">
                        <img src="${dtps.user.photoURL}" style="height: 50px; margin-right: 10px; vertical-align: middle; border-radius: 50%;" />

                        <div style="display: inline-block; vertical-align: middle;">
                            <h4 style="font-weight: bold; font-size: 32px; margin: 0px;">${dtps.user.name} <span style="font-size: 12px; line-height: 0px;">${dtps.user.id}</span></h4>
                        </div>
                    </div>

                    <div style="margin-top: 15px; margin-bottom: 7px;">
                        <a style="color: var(--lightText); margin: 0px 5px;" href="/logout"><i class="material-icons" style="vertical-align: middle">exit_to_app</i> Logout</a>
                    </div>
                </div>

                <div class="card" style="padding: 10px 20px; box-shadow: none !important; border: 2px solid var(--elements); margin-top: 20px;">
                    <img src="${dtpsLMS.logo}" style="height: 50px; margin-right: 10px; vertical-align: middle; margin-top: 20px; border-radius: 50%; background: #ee5034;" />

                    <div style="display: inline-block; vertical-align: middle;">
                        <h4 style="font-weight: bold; font-size: 32px; margin-bottom: 0px;">${dtpsLMS.name}</h4>
                        ${dtpsLMS.description ? `
                            <div style="font-size: 16px; margin-top: 5px;">${dtpsLMS.description}</div>
                        ` : ``}
                    </div>

                    <div style="margin-top: 15px; margin-bottom: 7px;">
                        <a style="color: var(--lightText); margin: 0px 5px;" href="${dtpsLMS.source}"><i class="material-icons" style="vertical-align: middle">code</i> LMS integration source code</a>
                    </div>
                </div>

                <div class="card advancedOptions" style="padding: 8px 16px; box-shadow: none !important; border: 2px solid var(--elements); margin-top: 20px; display: none;">
                    <div style="display: inline-block; vertical-align: middle;">
                        <h4 style="font-weight: bold; font-size: 28px; margin-bottom: 0px;">Advanced Options</h4>
                    </div>

                    <div style="margin-top: 15px; margin-bottom: 7px;">
                        <a style="color: var(--lightText); margin: 0px 5px;" onclick="dtps.clearData();" href="#"><i class="material-icons" style="vertical-align: middle">refresh</i> Reset Power+</a>
                        <a style="color: var(--lightText); margin: 0px 5px;" href="https://github.com/jottocraft/dtps/issues/new/choose"><i class="material-icons" style="vertical-align: middle">bug_report</i> Bug Report / Feedback</a>
                    </div>
                </div>

                <br />
                <p style="cursor: pointer; color: var(--secText, gray)" onclick="$('.advancedOptions').show(); $(this).hide();" class="advOp">Show advanced options</p>

                <div style="text-align: center; padding: 50px 0px;">
                    <img style="height: 45px; margin-right: 20px; vertical-align: middle;" src="https://cdn.jottocraft.com/images/footerImage.png" />
                    <h5 style="display: inline-block; vertical-align: middle;">jottocraft</h5>
                    <p>(c) jottocraft 2018-2020. All rights reserved.&nbsp;&nbsp;<a href="https://github.com/jottocraft/dtps">source code</a>&nbsp;&nbsp;<a href="https://github.com/jottocraft/dtps/blob/master/LICENSE">license</a></p>
                </div>
            </div>
        </div>
    `);

    //Render toolbar (the thing with the name and settings button at the top-right)
    jQuery(".toolbar.items").html(/*html*/`
        <div style="text-align: right;">
            ${dtps.user.parent ? /*html*/`
                <select onchange="dtps.obsSwitch(this)">
                    ${dtps.user.children.map(child => {
        return `<option ${dtps.user.lmsID == child.id ? "selected" : ""} value = "${child.id}">${child.name}</option>`;
    }).join("")}
                </select>
            ` : /*html*/`
                <h4 style="font-size: 22px;">${dtps.user.name}</h4>
            `}
            <img src="${dtps.user.photoURL}" style="height: 34px; margin: 0px; margin-right: 10px; border-radius: 50%; vertical-align: middle;" />
        </div>

        <div style="margin-top: 5px; display: inline-block; text-align: right; float: right;">
            <a href="/" class="itemButton"><i class="material-icons">exit_to_app</i> ${dtpsLMS.isDemoLMS ? "Exit demo" : "Go to " + (dtpsLMS.shortName || dtpsLMS.name)}</a>
            ${dtps.unstable ? `<div onclick="window.open('https://github.com/jottocraft/dtps/issues/new/choose')" class="itemButton"><i class="material-icons">feedback</i> Feedback</div>` : ""}
            <div onclick="dtps.settings();" class="itemButton"><i class="material-icons">settings</i> Settings</div>
        </div>
    `);

    //Begin loading chroma effects
    if (fluid.chroma) {
        dtps.chromaProfile = {
            title: "Power+",
            description: "Razer Chroma effects for Power+ (beta)",
            author: "jottocraft",
            domain: "powerplus.app"
        }
        fluid.chroma.supported(function (res) {
            if (res) {
                //Razer Synapse installed
                $(".razerChroma").show();

                //Razer Chroma pref
                if (fluid.get("pref-chromaEffects") == "true") { if (!fluid.chroma.on) { fluid.chroma.init(dtps.chromaProfile, () => fluid.chroma.static(getComputedStyle($(".background")[0]).getPropertyValue("--dark"))); } }
                document.addEventListener("pref-chromaEffects", function (e) {
                    if (String(e.detail) == "true") { if (!fluid.chroma.on) { fluid.chroma.init(dtps.chromaProfile, () => fluid.chroma.static(getComputedStyle($(".background")[0]).getPropertyValue("--dark"))); } } else { fluid.chroma.disable(); }
                })
            }
        })
    }

    //Load Fluid UI
    fluid.onLoad();

    //Render sidebar
    dtps.showClasses();

    //Load header background gradient
    document.dispatchEvent(new CustomEvent('fluidTheme'));

    //Remove loading screen styles
    jQuery("#dtpsNativeOverlay style").remove();

    //Fade out loading screen
    jQuery("#dtpsNativeOverlay").css("opacity", "0");

    //Remove loading screen after the animation is complete
    setTimeout(() => jQuery("#dtpsNativeOverlay").remove(), 200);
}

//Start loading DTPS
dtps.init();

//LMS Integration documentation           -------------------------------------------------------------------------------------

/**
 * @namespace dtpsLMS
 * @description Global DTPS LMS integration object. All LMS-related tasks, such as fetching data, are handled by this object. This is always loaded first.
 * @global
 * @property {string} name Full LMS name
 * @property {string} [shortName] Short LMS name
 * @property {string} legalName Legal name (or names) to show in the "Welcome to Power+" disclaimer
 * @property {string} [description] A short description of the LMS integration provided
 * @property {string} logo LMS logo image URL
 * @property {string} url URL to the LMS' website
 * @property {string} source URL to the LMS integration's source code
 * @property {boolean} [institutionSpecific] True if the LMS is designed for a specific institution instead of a broader LMS
 * @property {boolean} [preferRubricGrades] True if DTPS should prefer rubric grades for assignments
 * @property {boolean} [genericGradebook] True if DTPS should show the generic gradebook. Ignored if dtpsLMS.gradebook defined.
 */

/**
 * @name dtpsLMS.fetchUser
 * @description [REQUIRED] Fetches user data from the LMS
 * @kind function
 * @return {Promise<User>} A promise which resolves to a User object
 */

/**
* @name dtpsLMS.fetchClasses
* @description [REQUIRED] Fetches class data from the LMS
* @kind function
* @return {Promise<Class[]>} A promise which resolves to an array of Class objects
*/

/**
* @name dtpsLMS.fetchAssignments
* @description [REQUIRED] Fetches assignment data for a course from the LMS
* @kind function
* @param {string} classID The class ID to fetch assignments for
* @return {Promise<Assignment[]>} A promise which resolves to an array of Assignment objects
*/

/**
* @name dtpsLMS.fetchModules
* @description [OPTIONAL] Fetches module data for a course from the LMS
* @kind function
* @param {string} classID The class ID to fetch modules for
* @return {Promise<Module[]>} A promise which resolves to an array of Module objects
*/

/**
* @name dtpsLMS.collapseModule
* @description [OPTIONAL] Collapses a module in the LMS
* @kind function
* @param {string} classID The ID of the class
* @param {string} moduleID The ID of the module to collapse
* @param {boolean} collapsed True if the module is collapsed, false otherwise
* @return {Promise} A promise which resolves when the operation is completed
*/

/**
* @name dtpsLMS.fetchAnnouncements
* @description [OPTIONAL] Fetches recent announcements for a course from the LMS
* @kind function
* @param {string} classID The class ID to fetch announcements for
* @return {Promise<Announcement[]>} A promise which resolves to an array of Announcement objects
*/

/**
* @name dtpsLMS.fetchHomepage
* @description [OPTIONAL] Fetches homepage HTML for a course from the LMS
* @kind function
* @param {string} classID The class ID to get the homepage for
* @return {Promise<string>} A promise which resolves to the HTML for the class homepage
*/

/**
* @name dtpsLMS.fetchDiscussionThreads
* @description [OPTIONAL] Fetches discussion threads for a course from the LMS
* @kind function
* @param {string} classID The class ID to fetch discussion threads for
* @return {Promise<DiscussionThread[]>} A promise which resolves to an array of Discussion Thread objects
*/

/**
* @name dtpsLMS.fetchDiscussionPosts
* @description [REQUIRED IF dtpsLMS.fetchDiscussionThreads IS IMPLEMENTED] Fetches discussion posts in a thread from the LMS
* @kind function
* @param {string} classID The class ID to fetch discussion posts for
* @param {string} threadID The discussion thread ID to fetch discussion posts for
* @return {Promise<DiscussionPost[]>} A promise which resolves to an array of Discussion Post objects
*/

/**
* @name dtpsLMS.fetchPages
* @description [OPTIONAL] Fetches pages for a course from the LMS
* @kind function
* @param {string} classID The class ID to fetch pages for
* @return {Promise<Page[]>} A promise which resolves to an array of Page objects
*/

/**
* @name dtpsLMS.fetchPageContent
* @description [REQUIRED IF dtpsLMS.fetchPages IS IMPLEMENTED] Fetches content for a page from the LMS
* @kind function
* @param {string} classID The class ID to fetch page content for
* @param {string} pageID The page ID to fetch page content for
* @return {Promise<string>} A promise which resolves to the page's content as HTML
*/

/**
* @name dtpsLMS.gradebook
* @description [OPTIONAL] Renders custom gradebook HTML for unique grading systems or for a more tailored experience. The gradebook only shows for classes with a grade and with at least 1 assignment.
* @kind function
* @param {Class} course Class to render the gradebook for. If custom grade calculation is enabled (dtpsLMS.calculateGrade), those results can be accessed at course.gradeCalculation.
* @return {Promise<string>} A promise which resolves to HTML to render for the class gradebook
*/

/**
* @name dtpsLMS.gradebookDidRender
* @description [OPTIONAL] Called after the HTML returned by dtpsLMS.gradebook has rendered. Runs any initialization needed for the gradebook, such as enabling interactive elements or what-if grades.
* @kind function
* @param {Class} course Class the gradebook was rendered for
*/

/**
* @name dtpsLMS.calculateGrade
* @description [OPTIONAL] Calculates class grades with a custom grade calculation formula. Used for unique grading systems.
* @kind function
* @param {Class} course Class to calculate grades for [DO NOT USE COURSE.ASSIGNMENTS to access assignments for grade calculation. Use the assignments parameter instead.]
* @param {Assignment[]} assignments Assignments used for grade calculation. Use this instead of course.assignments for hypothetical/what-if grade calculation.
* @return {undefined|object} The letter grade should be returned in the "letter" property as a string and the percentage in the "grade" property as a number. Other custom properties can be set if they need to be accessed by dtpsLMS.gradebook. Return undefined if there is no grade for the class.
*/

/**
* @name dtpsLMS.updateAssignments
* @description [OPTIONAL, INSTITUTION ONLY] This function can be implemented by institution-specific scripts to loop through and override assignment data returned by the LMS.
* @kind function
* @param {Assignment[]} assignments Original assignments array
* @return {Promise<Assignment[]>} A promise that resolves to the updated assignments array
*/

/**
* @name dtpsLMS.updateClasses
* @description [OPTIONAL, INSTITUTION ONLY] This function can be implemented by institution-specific scripts to loop through and override class data returned by the LMS.
* @kind function
* @param {Class[]} classes Original classes array
* @return {Promise<Class[]>} A promise that resolves to the updated classes array
*/

//Type definitions                        -------------------------------------------------------------------------------------

/**
 * @typedef {string} Date
 * @description A date string recognized by {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse|Date.parse}
 */

/**
 * @typedef {Object} User
 * @description Defines user objects in DTPS
 * @property {string} name User name
 * @property {string} id User ID
 * @property {string} photoURL User photo URL
 * @property {User[]} [children] [ONLY FOR DTPS.USER] Array of child users. If this is defined, the user is treated as a parent account. Sub-children are not allowed.
 * @property {boolean} parent [ONLY FOR DTPS.USER] Automatically managed by DTPS. True if the user is a parent account.
 * @property {string} lmsID [ONLY FOR DTPS.USER] Automatically managed by DTPS. This is the user ID that all LMS web requests should use. Can change when a parent account changes the selected child.
 */

/**
* @typedef {Object} Class
* @description Defines class objects in DTPS
* @property {string} name Name of the class
* @property {string} id Class ID
* @property {number} num Index of the class in the dtps.classes array
* @property {string} subject Class subject
* @property {Assignment[]} assignments Class assignments. Assume assignments are still loading if this is undefined. The class has no assignments if this is an empty array. Loaded in dtps.init.
* @property {Module[]|boolean} [modules] Class modules. Assume this class supports the modules feature, but is not yet loaded, if this is true and that the class has no modules if this is an empty array. For LMSs that do not support modules, either keep it undefined or set it to false.
* @property {DiscussionThread[]|boolean} [discussions] Class discussion threads. Assume this class supports discussions, but not yet loaded, if this is true and that the class has no threads if this is an empty array. For LMSs that do not support discussions, either keep it undefined or set it to false.
* @property {Page[]|boolean} [pages] Class pages. Assume this class supports the pages feature, but not yet loaded, if true and that the class has no pages if this is an empty array. For LMSs that do not support pages, either keep it undefined or set it to false.
* @property {string} [newDiscussionThreadURL] A URL the user can visit to create a new discussion thread in this class
* @property {string} [syllabus] Class syllabus HTML
* @property {boolean} [homepage] True if the class has a homepage. If a class has a homepage, dtpsLMS.fetchHomepage must be implemented.
* @property {string} [description] Class description HTML
* @property {number} [numStudents] Number of students in the class
* @property {string} [term] Class term
* @property {string} [color] Class color
* @property {number} [grade] Current percentage grade in the class
* @property {string} [letter] Current letter grade in the class
* @property {string} [previousLetter] Automatically managed by DTPS. The previous letter grade in this class, based on local grade history.
* @property {string} [image] URL to the class background image
* @property {User} [teacher] Class teacher
* @property {boolean} [hasGradebook] Automatically managed by DTPS. True if the class should show the gradebook tab.
* @property {object} [gradeCalculation] Automatically managed by DTPS. If custom grade calculation is implemented, this will be the results from custom grade calculation returned by dtpsLMS.calculateGrade.
* @property {string} [videoMeetingURL] The URL used to join this class' online meeting
*/