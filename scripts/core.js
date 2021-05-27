/**
 * @file DTPS Core functions and module loader
 * @author jottocraft
 * @version v3.1.4
 * 
 * @copyright Copyright (c) 2018-2021 jottocraft
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
 * @property {Class[]} classes Array of classes the current user is in
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
 * @property {object} remoteConfig Configuration variables that can be remotely changed
 * @property {boolean} searchScrollListener True if the search scroll listener has been added
 * @property {object} gtag The {@link https://developers.google.com/analytics/devguides/collection/ga4|gtag} object for Google Analytics configuration
 */
var dtps = {
    ver: 314,
    readableVer: "v3.1.4",
    env: new URL(window.dtpsBaseURL || "https://powerplus.app").hostname == "localhost" ? "dev" : window.jottocraftSatEnv || "prod",
    classes: [],
    baseURL: window.dtpsBaseURL || "https://powerplus.app",
    unstable: window.dtpsBaseURL !== "https://powerplus.app",
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
    ],
    remoteConfig: {
        canvasRequestSpacing: 25,
        gradeCalculationEnabled: true,
        allowWhatIfGrades: true,
        showVideoMeetingButton: true,
        dtechCurrentTerm: "S2",
        debugClassID: "1098",
        topSneaky: false,
        topSneakyUI: false,
        useV5ThemeSelectionUI: false,
        loadingAlert: false,
        remoteUpdate: {
            title: null,
            html: null,
            active: false
        }
    }
};

//Load jQuery ASAP
jQuery.getScript("https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js");

//Fluid UI screen change listener
document.addEventListener("fluidScreen", function (data) {
    dtps.gtag('event', 'screen_view', {
        'screen_name': data.detail
    });
});

/**
 * Debugging shortcut for getting the selected class. This should only be used in the web inspector and not in actual code.
 * 
 * @return {object|undefined} The selected class 
 */
dtps.class = function () {
    return dtps.classes[dtps.selectedClass];
};

//Detect debug info shortcut
document.onkeydown = function (event) {
    if (event.ctrlKey && event.altKey && (event.code == "KeyD")) {
        var replacer = function (key, value) {
            //Truncate long properties
            if (["assignments", "people", "modules", "discussions", "pages", "outcomes"].includes(key)) {
                if (value instanceof Array) return "[truncated] (array, length " + value.length + ")";
                if (typeof value == "object") return "[truncated] (object, keys " + Object.keys(value).length + ")";
                return value;
            }

            //Remove sensitive properties/PII
            if (["letter", "number75", "grade", "lowestScore"].includes(key)) return "[redacted] (" + (typeof value) + ")";

            return value;
        };

        $(".card.details").html(/*html*/`
            <i onclick="fluid.cards.close('.card.details'); $('.card.details').html('');" class="fluid-icon close">close</i>

            <h4 style="font-weight: bold;">Debug</h4>

            <div style="margin: 40px 0px;">
                <h5>User</h5>
                <pre><code class="prettyprint">${JSON.stringify(dtps.user, null, '\t')}</code></pre>
            </div>

            ${dtps.classes[dtps.selectedClass] ? /*html*/`
                    <div style="margin: 40px 0px;">
                        <h5>Selected class</h5>
                        <pre><code class="prettyprint">${JSON.stringify(dtps.classes[dtps.selectedClass], replacer, '\t')}</code></pre>
                    </div>
                ` : ``
            }
        `);

        if (!window.PR) {
            $.getScript("https://cdn.jsdelivr.net/gh/google/code-prettify@master/loader/run_prettify.js?lang=json");
        } else {
            PR.prettyPrint();
        }

        //Close other active cards and open the assignment details card
        fluid.cards.close(".card.focus");
        fluid.cards(".card.details");
    }
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
            jQuery(".card.changelog").html(`<i onclick="fluid.cards.close('.card.changelog')" class="fluid-icon close">close</i>` + changelogHTML);

            if (!onlyIfNewVersion) {
                //Show changelog
                fluid.cards.close(".card.focus");
                fluid.cards(".card.changelog");
                dtps.gtag('event', 'changelog', { forNewVersion: false });
            } else if (Number(data.tag_name.replace(/[^0-9]/g, '')) > Number(window.localStorage.dtps)) {
                //Show changelog if this is a new(er) version
                localStorage.setItem('dtps', data.tag_name.replace(/[^0-9]/g, ''));

                if (!data.tag_name.includes("s")) {
                    //s in tag_name means a silent release
                    fluid.cards.close(".card.focus");
                    fluid.cards(".card.changelog");
                    dtps.gtag('event', 'changelog', { forNewVersion: true });
                }
            }
        });
    });
};

/**
 * Logs debugging messages
 * 
 * @param {...*} msg The debugging messages to log
 */
dtps.log = function () {
    if (dtps.env == "dev") console.log("[DTPS]", ...arguments);
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
        dtps.gtag('event', 'exception', {
            description: msg,
            devNotes: devNotes
        });
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
            <i class="fluid-icon">dashboard</i>
            <h5>${dtpsLMS.gradebook ? "Manage your coursework and grades" : "Manage your coursework"}</h5>
            <p>Power+ organizes all of your coursework so you can easily see what you need to do next. The dashboard shows upcoming assignments, recent grades, and announcements.
            ${dtpsLMS.gradebook ? `Power+ includes a gradebook designed for ${dtpsLMS.name} to help you understand your grades.` : ``}</p>
        </div>

        ${dtpsLMS.isDemoLMS ? /*html*/`
            <div class="welcomeSection">
                <i class="fluid-icon">priority_high</i>
                <h5>This is a demo</h5>
                <p>Assignment information, grades, and other content displayed is not real and is for demonstration purposes only. This demo does not retrieve or collect any data.</p>
            </div>
        ` : /*html*/`
            <div class="welcomeSection">
                <i class="fluid-icon">security</i>
                <h5>Privacy</h5>
                <p>Power+ uses Google Analytics to collect basic non-personally identifiable information to understand how people use Power+.
                 Data collected does not use Google account signals, is not used for ad personalization, and is not shared with Google or other third parties.
                 Power+ does <b>not</b> and will <b>never</b> collect any personal information, such as names, classes, or grades.
                 To learn more about your privacy on Power+ and how to opt-out of analytics, check the privacy section at <a href="https://powerplus.app">powerplus.app</a> or contact <a href="mailto:privacy@jottocraft.com">privacy@jottocraft.com</a> with any questions.</p>
            </div>
            <div class="welcomeSection">
                <i class="fluid-icon">priority_high</i>
                <h5>Power+ is not official</h5>
                <p>Assignment information, grades, and other content displayed in Power+ are not official. Power+ is neither created nor endorsed by ${dtpsLMS.legalName}.
                 Power+ may have bugs that could cause it to display inaccurate information. Use Power+ at your own risk.</p>
            </div>
        `}
        
        <br />
        <button onclick="window.localStorage.setItem('dtpsInstalled', 'true'); fluid.cards.close('.card.changelog');" class="btn">
            <i class="fluid-icon">arrow_forward</i> Continue
        </button>
    `);

    //Show Welcome to DTPS card
    fluid.cards.close(".card.focus");
    fluid.cards(".card.changelog", "stayOpen");

    dtps.gtag('event', 'firstrun');
};

/**
 * Renders the DTPS loading screen
 */
dtps.renderLoadingScreen = function () {
    if (!window.dtpsPreLoader || dtps.user) {
        //Only show the loader if the extension hasn't already shown it
        jQuery("body").append(/*html*/`
            <div id="dtpsNativeOverlay" style="background-color: #151515; position: fixed; top: 0px; left: 0px; width: 100%; height: 100vh; z-index: 99;text-align: center;z-index: 999;transition: opacity 0.2s;">
                <img style="height: 100px; margin-top: 132px;" src="https://i.imgur.com/7dDUVh2.png" />
			    <br />
                <div class="progress"><div class="indeterminate"></div></div>
                <style>body {background-color: #151515; overflow: hidden;}*,:after,:before{box-sizing:border-box}.progress{position:relative;width:600px;height:5px;overflow:hidden;border-radius:12px;background:#262626;backdrop-filter:opacity(.4);display:inline-block;margin-top:75px}.progress .indeterminate{position:absolute;background:#e3ba4b;height:5px;animation:indeterminate 1.4s infinite;animation-timing-function:linear}@keyframes indeterminate{0%{width:5%;left:-15%}to{width:100%;left:110%}}</style>
            </div>
        `);
    }
}

/**
 * Load all external JavaScript libraries
 * 
 * @param {function} cb Callback function
 */
dtps.JS = function () {
    return new Promise((resolve, reject) => {
        //Moment & Fullcalendar are used for the calendar on the dashboard
        jQuery.getScript("https://cdn.jsdelivr.net/npm/fullcalendar@5.3.2/main.min.js", function () {
            jQuery.getScript("https://cdn.jsdelivr.net/npm/fullcalendar@5.3.2/locales-all.min.js");
        });

        //Lunr is used for search
        jQuery.getScript('https://unpkg.com/lunr@2.3.9/lunr.min.js');

        //jQuery UI for dashboard settings page
        jQuery.getScript('https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js');

        //Tinycolor used for better dark mode support
        jQuery.getScript("https://cdn.jottocraft.com/tinycolor.js");

        //Google Analytics
        jQuery.getScript("https://www.googletagmanager.com/gtag/js?id=G-EH9P54G4CC");

        //Check for analytics opt-out
        if (window.localStorage.dtpsAnalyticsOptOut == "true") {
            window['ga-disable-G-EH9P54G4CC'] = true;
        }

        //Firebase modules
        jQuery.getScript("https://www.gstatic.com/firebasejs/8.2.4/firebase-app.js", () => {
            // Your web app's Firebase configuration
            var firebaseConfig = {
                apiKey: "AIzaSyB7Oek4HHBvazM5e0RppZMbZ8qg6RjSDdU",
                authDomain: "project-dtps.firebaseapp.com",
                databaseURL: "https://project-dtps.firebaseio.com",
                projectId: "project-dtps",
                storageBucket: "project-dtps.appspot.com",
                messagingSenderId: "117676227556",
                appId: "1:117676227556:web:b0bafbea651245207ce5f1"
            };
            // Initialize Firebase
            firebase.initializeApp(firebaseConfig);

            //dtao/nearest-color is used for finding the nearest class color
            jQuery.getScript("https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/rollups/sha1.js", () => {
                jQuery.getScript("https://cdn.jottocraft.com/nearest-color.dtao.js", () => {
                    //Fluid UI for core UI elements
                    if (window.localStorage.getItem("pref-debuggingLocalFluidUI") == "true") {
                        jQuery.getScript('http://localhost:1222/dev/fluid.js', resolve);
                    } else {
                        jQuery.getScript('https://cdn.jottocraft.com/fluid/build/v5/latest/fluid.js', resolve);
                    }
                });
            });
        });
    });
}

/**
 * Load all DTPS CSS files
 */
dtps.CSS = function () {
    jQuery("<link/>", {
        rel: "stylesheet",
        type: "text/css",
        href: window.localStorage.getItem("pref-debuggingLocalFluidUI") == "true" ? "http://localhost:1222/dev/fluid.css" : "https://cdn.jottocraft.com/fluid/build/v5/latest/fluid.css",
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
        href: "https://fonts.googleapis.com/css?family=Material+Icons+Round",
        class: "dtpsHeadItem"
    }).appendTo("head");

    jQuery("<link/>", {
        rel: "stylesheet",
        type: "text/css",
        href: "https://cdn.jsdelivr.net/npm/fullcalendar@5.3.2/main.min.css",
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

    //Disable dev version
    if (window.localStorage.getItem('dtpsLoaderPref') == "dev") {
        window.localStorage.removeItem('dtpsLoaderPref');
    }

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

    //Get URL parameters
    var urlParams = new URLSearchParams(window.location.search);
    if (Array.from(urlParams).length) window.history.replaceState(null, null, window.location.pathname);

    //Fluid UI settings
    window.fluidConfig = {
        config: {
            autoLoad: false,
            allowThemeMenu: false //This is false because Power+ uses its own theme settings UI
        }
    };

    //Set env discovery
    window.localStorage.setItem("jottocraftEnv", true);

    //Default selected content
    dtps.selectedContent = "stream";

    //Begin loading CSS
    dtps.CSS();

    //Begin loading static DTPS HTML
    dtps.render();

    //Fetch remote config and JavaScript modules
    Promise.all([
        new Promise((r) => {
            jQuery.getJSON('https://project-dtps.firebaseio.com/config.json', (remoteConfig) => {
                if (remoteConfig) {
                    Object.keys(remoteConfig).forEach(k => {
                        var val = remoteConfig[k];

                        dtps.remoteConfig[k] = val;
                    });
                }
                r();
            }).fail(() => r());
        }),
        dtps.JS()
    ]).then(() => {
        //dev env remote config overrides
        if (dtps.env == "dev") {
            Object.keys(dtps.remoteConfig).forEach(k => {
                if (window.localStorage.getItem("dtpsRemoteConfig-" + k)) {
                    val = window.localStorage.getItem("dtpsRemoteConfig-" + k);

                    if (val == "true") val = true;
                    if (val == "false") val = false;

                    dtps.remoteConfig[k] = val;
                }
            });
        }

        //Fetch user and class data
        return dtpsLMS.fetchUser();
    }).then(data => {
        if (dtps.remoteConfig.loadingAlert) window.alert(dtps.remoteConfig.loadingAlert);

        //Prevent resetting the user if the user is already set (for parent accounts)
        dtps.user = data;

        //If this is a parent account, show the parent UI
        if (dtps.user.children && dtps.user.children.length) {
            dtps.user.parent = true;

            //Fetch classes for all students
            return new Promise((resolve, reject) => {
                var allClasses = [];
                var promises = [];

                dtps.user.children.forEach(child => {
                    promises.push(new Promise(function (resolve, reject) {
                        dtpsLMS.fetchClasses(child.id).then((data) => {
                            //Prepend child ID to class ID
                            data.forEach(course => {
                                course.id = child.id + "-" + course.id;
                                course.group = child.name;
                            });

                            allClasses = allClasses.concat(data);
                            resolve();
                        }).catch(reject);
                    }));
                });

                Promise.all(promises).then(() => {
                    resolve(allClasses);
                });
            });
        } else {
            return dtpsLMS.fetchClasses(dtps.user.id);
        }
    }).then((rawClasses) => {
        return new Promise((resolve, reject) => {
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

        //Create gtag
        window.dataLayer = window.dataLayer || [];
        dtps.gtag = function () { dataLayer.push(arguments); }
        dtps.gtag('js', new Date());

        //Set gtag settings
        dtps.gtag('set', {
            'page_title': "Power+",
            'page_location': window.location.protocol + '//' + window.location.host + window.location.pathname,
            'appVersion': dtps.ver,
            'env': dtps.env,
            'releaseChannel': window.localStorage.dtpsLoaderPref || "prod",
            'allow_google_signals': false,
            'allow_ad_personalization_signals': false
        });

        //Set user ID and properties
        dtps.gtag('set', 'user_properties', {
            user_id: CryptoJS.SHA1(window.location.host + "/" + dtps.user.id).toString(),
            dtpsEnv: dtps.env,
            dtpsLoader: window.dtpsPreLoader ? "preloader" : window.dtpsLoader,
            isParent: dtps.user.parent || false,
            numClasses: dtps.classes.length,
            host: window.location.host,
            hideGrades: fluid.get("pref-hideGrades") == "true",
            alternateFont: fluid.get("pref-alternateFont") == "true",
            autoGroupClasses: fluid.get("pref-autoGroupClasses") !== "false",
            fullNames: fluid.get("pref-fullNames") == "true",
            hideClassImages: fluid.get("pref-hideClassImages") == "true",
            fluidTheme: document.documentElement.dataset.theme,
            fluidThemeImage: document.documentElement.dataset.themeImage !== undefined
        });
        
        //Start gtag
        dtps.gtag('config', 'G-EH9P54G4CC');

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

            if (dtpsLMS.calculateGrade && dtps.remoteConfig.gradeCalculationEnabled) {
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
        fluid.screens.people = dtps.baseURL + "/scripts/people.js";
        fluid.screens.search = dtps.baseURL + "/scripts/search.js";
        fluid.screens.pages = dtps.baseURL + "/scripts/pages-discussions.js";
        fluid.screens.discussions = dtps.baseURL + "/scripts/pages-discussions.js";

        if (dtpsLMS.gradebook && !((dtps.env == "dev") && (fluid.get("pref-debuggingGenericGradebook") == "true"))) {
            //Handle LMS gradebook
            fluid.screens.gradebook = dtps.showLMSGradebook;
        } else if (dtpsLMS.genericGradebook || ((dtps.env == "dev") && (fluid.get("pref-debuggingGenericGradebook") == "true"))) {
            //Generic gradebook script
            fluid.screens.gradebook = dtps.baseURL + "/scripts/assignments.js";
        }

        //Begin fetching class assignments
        var fetchedAnnouncements = [];
        dtps.classes.forEach((course, courseIndex) => {
            dtpsLMS.fetchAssignments(course.userID, course.lmsID).then((rawAssignments) => {
                return new Promise((resolve, reject) => {
                    if (dtpsLMS.institutionSpecific && dtpsLMS.updateAssignments) {
                        //Using an institution-specific script, make any nessasary changes and return updated assignments
                        dtpsLMS.updateAssignments(rawAssignments).then(updatedAssignments => {
                            resolve(updatedAssignments);
                        }).catch(reject);
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
                if (dtpsLMS.calculateGrade && dtps.remoteConfig.gradeCalculationEnabled) {
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
                if ((course.letter || course.grade) && (course.letter !== "...")) {
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

                //Render grades tab in settings
                dtps.renderGradesInSettings();

                //Re-render screen if the dashboard or stream is selected
                if ((dtps.selectedClass == "dash") || ((dtps.selectedContent == "stream") && (dtps.selectedClass == course.num))) {
                    fluid.screen();
                }
            });

            if (!fetchedAnnouncements.includes(course.lmsID)) {
                //Add lmsID to list of fetched announcements to prevent duplicates
                fetchedAnnouncements.push(course.lmsID);

                dtpsLMS.fetchAnnouncements(course.lmsID).then(announcements => {
                    //Add announcements to updates array
                    announcements.forEach(announcement => {
                        //Add class number and type to object
                        dtps.updates.push({
                            class: course.num,
                            type: "announcement",
                            ...announcement
                        });
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
            }
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
    }).catch(function (err) {
        //Web request error
        console.error("[DTPS] Error fetching user and classes at dtps.init", err);

        //Check for login redirect
        if ((err.action == "login") && err.redirectURL) {
            //Redirect to login page
            window.location.href = err.redirectURL;
        } else {
            dtps.error("Failed to get user and/or course data", "Exception in promise @ dtps.init");
        }
    });

    //Load dashboard prefrences
    dtps.loadDashboardPrefs();
}

/**
 * Formats a date to a readable date string
 * 
 * @param {Date} date The date to format
 * @return {string} Formatted date and time string
 */
dtps.formatDate = function (date) {
    if (date) {
        return new Date(date).toLocaleString("en", { weekday: 'short', month: 'short', day: 'numeric', hour: "numeric", minute: "numeric" });
    } else {
        return "";
    }
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
 * Renders the class list in the sidebar
 * 
 * @param {boolean} [override] True if the sidebar should be forcefully re-rendered
 */
dtps.showClasses = function (override) {
    //Array of class HTML for the sidebar
    dtps.classlist = [];

    var previousClassGroup = null;
    for (var i = 0; i < dtps.classes.length; i++) {
        //Determine letter grade HTML
        var letterGradeHTML = "";
        if (dtps.classes[i].letter) letterGradeHTML = dtps.classes[i].letter;
        if (dtps.classes[i].letter == null) letterGradeHTML = "--";
        if (dtps.classes[i].letter == "...") letterGradeHTML = `<div class="shimmer" style="vertical-align:middle;display: inline-block;width: 22px;height: 22px;border-radius: 8px;"></div>`; //Show loading indicator for ...

        if (dtps.classes[i].group && (dtps.classes[i].group !== previousClassGroup)) {
            if (previousClassGroup) dtps.classlist.push(`</div></div>`);
            dtps.classlist.push(/*html*/`
                <div id="dtpsClassListGroup-${dtps.classes[i].group}" class="group open">
                  <div class="name item">
                    <i class="fluid-icon"></i> <span class="label">${dtps.classes[i].group}</span>
                  </div>

                  <div class="items">
            `);
        } else if (!dtps.classes[i].group && previousClassGroup) {
            dtps.classlist.push(`</div></div>`);
        }

        //Add class HTML to array
        dtps.classlist.push(/*html*/`
            <div 
                onclick="${'dtps.selectedClass = ' + i}" 
                class="${'class item ' + i + ' ' + (dtps.selectedClass == i ? " active" : "")}"
                style="${'--classColor: ' + dtps.classes[i].color}"
            >
                ${dtps.classes[i].grade && dtps.classes[i].letter ? /*html*/`
                    <i class="fluid-icon grade">
                        <span class="letter">${letterGradeHTML}</span>
                        <span class="percentage ${Math.round(dtps.classes[i].grade) >= 100 ? "large" : ""}">${Math.round(dtps.classes[i].grade)}<span class="percentSymbol">%</span></span>
                    </i>
                ` : dtps.classes[i].grade ? /*html*/`
                    <i class="fluid-icon grade percentage ${Math.round(dtps.classes[i].grade) >= 100 ? "large" : ""}">
                        ${Math.round(dtps.classes[i].grade)}<span class="percentSymbol">%</span>
                    </i>
                ` : /*html*/`
                    <i class="fluid-icon grade letter">
                        ${letterGradeHTML}
                    </i>
                `}
                
                <span class="label">${dtps.classes[i].subject}</span>
            </div>
        `);

        previousClassGroup = dtps.classes[i].group;
    }

    if (previousClassGroup) dtps.classlist.push(`</div></div>`);

    //Only render HTML if the sidebar doesn't already have the classes rendered, or if override is true
    if (!jQuery(".sidebar .class.dash")[0] || override) {
        jQuery(".sidebar").html(/*html*/`
            <div class="title">
                <img src="${dtps.baseURL + "/icon.svg"}" />
                <h4>Power+</h4>
            </div>
            
            <div class="items">
                <div onclick="dtps.selectedClass = 'dash';" class="class item main dash ${dtps.selectedClass == "dash" ? "active" : ""}">
                    <i class="fluid-icon">dashboard</i>    
                    <span class="label">Dashboard</span>
                </div>

                <div class="divider"></div>

                ${dtps.classlist.join("")}
            </div>

            <div class="collapse">
                <i class="fluid-icon"></i>
            </div>
        `);
        fluid.init();

        //Change view to stream if coming from pages or discussions, since those tabs change the sidebar
        if ((dtps.selectedContent == "pages") || (dtps.selectedContent == "discuss")) {
            //Show stream
            if (dtps.classes[dtps.selectedClass]) fluid.screen('stream', dtps.classes[dtps.selectedClass].id);
        }

        //Class onclick listener
        $(".class").click(function (event) {
            //Load class content based on what's selected
            if (((dtps.selectedContent == "stream") || (dtps.selectedContent == "moduleStream")) && dtps.classes[dtps.selectedClass]) {
                if (dtps.classes[dtps.selectedClass].modules && (window.localStorage.getItem("courseworkPref-" + dtps.classes[dtps.selectedClass].id) == "moduleStream")) {
                    fluid.screen("moduleStream", dtps.classes[dtps.selectedClass].id);
                } else {
                    fluid.screen("stream", dtps.classes[dtps.selectedClass].id);
                }
            }

            if ((dtps.selectedContent == "people") && dtps.classes[dtps.selectedClass]) {
                fluid.screen("people", dtps.classes[dtps.selectedClass].id);
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

    //Set the class image
    if ((fluid.get("pref-showClassImages") !== "false") && dtps.classes[classNum] && dtps.classes[classNum].image) {
        $(".headerArea").addClass("classImage");
        $(".headerArea img").attr("src", dtps.classes[classNum].image);
        $(".headerArea img").show();
    } else {
        $(".headerArea").removeClass("classImage");
        $(".headerArea img").hide();
    }

    //Remove active class from other classes in the sidebar, add the active class to the selected class
    $(".sidebar .class").removeClass("active");
    $(".class." + classNum).addClass("active");

    //Update title to show class name
    //If the dashboard is selected, this is just "Dashboard". Otherwise, this is Class.subject
    $("#headText span").text(classNum == "dash" ? "Dashboard" : classNum == "search" ? "Search Results" : dtps.classes[classNum] && dtps.classes[classNum].subject);
    var icon = classNum == "dash" ? "dashboard" : classNum == "search" ? "search" : dtps.classes[classNum] && dtps.classes[classNum].icon
    if (icon) {
        $("#headText i").text(icon);
        $("#headText i").show();
    } else {
        $("#headText i").hide();
    }
    $("#headText").css("color", (classNum == "dash") || (classNum == "search") ? "var(--text)" : dtps.classes[classNum] && dtps.classes[classNum].color);

    //If the class doesn't exist, hide the tabs
    //Otherwise, show the tabs
    if (!dtps.classes[classNum]) {
        $("#dtpsTabBar").hide();
        $("#classInfo p").hide();
    } else {
        $("#dtpsTabBar").show();
    }

    //Hide dashboard start date
    if (classNum !== "search") $(".headerArea .contentLabel").hide();

    //Clear search box if not on the search tab
    if ((classNum !== "search") && !$("#dtpsMainSearchBox").is(":focus")) {
        $("#dtpsMainSearchBox").val("");
    }

    //Set search box content
    dtps.setSearchBox();

    if (dtps.classes[classNum]) {
        //Show pages tab if the class supports it, otherwise, hide it
        if (dtps.classes[classNum].pages) {
            $(".btns .btn.pages").show();
        } else {
            $(".btns .btn.pages").hide();
        }

        //Show people tab if the LMS supports it, otherwise, hide it
        if (dtps.classes[classNum].people) {
            $(".btns .btn.people").show();
        } else {
            $(".btns .btn.people").hide();
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

        //Show teacher
        if (dtps.classes[classNum].teacher) {
            $("#classInfo .teacher .teacherName").text(dtps.classes[classNum].teacher.name);
            $("#classInfo .teacher .teacherImage").css("background-image", "url('" + dtps.classes[classNum].teacher.photoURL + "')");
            $("#classInfo .teacher").show();
        } else {
            $("#classInfo .teacher").hide();
        }

        if (dtps.classes[classNum].homepage) {
            $("#classInfo .homepage").show();
        } else {
            $("#classInfo .homepage").hide();
        }

        if (dtps.classes[classNum].videoMeetingURL) {
            $("#classInfo .videoMeeting").attr("onclick", "window.open('" + dtps.classes[classNum].videoMeetingURL + "'); dtps.gtag('event', 'select_content', { content_type: 'videoMeeting', from: 'classInfo' });");
            $("#classInfo .videoMeeting").removeClass("shimmerParent");
            $("#classInfo .videoMeeting").show();
        } else if ((dtps.classes[classNum].videoMeetingURL !== null) && dtpsLMS.fetchMeetingURL) {
            $("#classInfo .videoMeeting").attr("onclick", "");
            $("#classInfo .videoMeeting").addClass("shimmerParent");
            $("#classInfo .videoMeeting").show();

            dtpsLMS.fetchMeetingURL(dtps.classes[classNum].lmsID).then(url => {
                dtps.classes[classNum].videoMeetingURL = url;

                if (dtps.selectedClass == classNum) {
                    if (url) {
                        $("#classInfo .videoMeeting").attr("onclick", "window.open('" + dtps.classes[classNum].videoMeetingURL + "'); dtps.gtag('event', 'select_content', { content_type: 'videoMeeting', from: 'classInfo' });");
                        $("#classInfo .videoMeeting").removeClass("shimmerParent");
                        $("#classInfo .videoMeeting").show();
                    } else {
                        $("#classInfo .videoMeeting").hide();
                    }
                }
            });
        } else {
            $("#classInfo .videoMeeting").hide();
        }
    }

    if (dtps.selectedContent !== "grades") $(".classContent").removeClass("fixedGradeSummary");
}

/**
 * Displays the class homepage
 * 
 * @param {number} num Class number to show the homepage for
 */
dtps.classHome = function (num) {
    //Render loading screen
    $(".card.details").html(/*html*/`
        <i onclick="fluid.cards.close('.card.details')" class="fluid-icon close">close</i>
        <h3 style="font-weight: bold;">${dtps.classes[num].subject} Homepage</h3>

        <br />
        <p>Loading...</p>
    `);

    //Fetch homepage from the LMS
    dtpsLMS.fetchHomepage(dtps.classes[num].lmsID).then(homepage => {
        if (homepage) {
            //Get computed background and text color to style the iFrame with
            var computedBackgroundColor = getComputedStyle($(".card.details")[0]).getPropertyValue("--cards");
            var computedTextColor = getComputedStyle($(".card.details")[0]).getPropertyValue("--text");

            if ($("body").hasClass("dark")) {
                homepage = dtps.brightenTextForDarkMode(homepage, computedBackgroundColor);
            }

            //Generate a blob with the assignment body and get its data URL
            var blob = new Blob([`
                    <base target="_blank" /> 
                    <link type="text/css" rel="stylesheet" href="https://cdn.jottocraft.com/CanvasCSS.css" media="screen,projection"/>
                    <style>body {background-color: ${computedBackgroundColor}; color: ${computedTextColor};</style>
                    ${homepage}
                `], { type: 'text/html' });
            var homepageURL = window.URL.createObjectURL(blob);

            $(".card.details").html(/*html*/`
                <i onclick="fluid.cards.close('.card.details')" class="fluid-icon close">close</i>

                <h4 style="font-weight: bold;">${dtps.classes[num].subject} Homepage</h4>

                <br />
                <div style="margin-top: 20px;" class="homepageBody">
                    <iframe id="homepageIframe" onload="dtps.iframeLoad('homepageIframe')" style="margin: 10px 0px; width: 100%; border: none; outline: none;" src="${homepageURL}" />
                </div>
            `);

            fluid.cards(".card.details");

            dtps.gtag('event', 'select_content', {
                content_type: 'homepage'
            });
        } else {
            fluid.cards.close('.card.details');
            dtps.error("Homepage unavailable", "homepage is either empty or undefined @ dtps.classHome");
        }
    }).catch(e => {
        dtps.error("Couldn't load homepage", "Caught a promise rejection @ dtps.classHome", e);
    })
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
 * Brightens text in an HTML string for dark mode
 * 
 * @param {string} html The HTML to brighten text for
 * @param {string} [bg] The background color that the HTML will be displayed on
 * @returns {string} HTML string with brightened colors 
 */
dtps.brightenTextForDarkMode = function (html, bg) {
    //Use dark mode algorithm
    if (!bg) bg = "black";
    var fakeRoot = $('<div></div>').append(html);

    //Reset text color to black if there is a background color set and no other color set
    fakeRoot.find("*").filter(function () {
        return ($(this).css("background-color") || $(this).css("background")) && !$(this).css("color") && !$(this).parents().filter(function () {
            return $(this).css("color");
        }).length;
    }).toArray().forEach(element => {
        //Reset to black
        $(element).css("color", "#2D3B45");
    });

    //Brighten text colors
    fakeRoot.find("span").filter(function () {
        return $(this).css("color") && !($(this).css("background-color") || $(this).css("background")) && !$(this).parents().filter(function () {
            return $(this).css("background-color") || $(this).css("background");
        }).length;
    }).toArray().forEach(element => {
        //Brighten color
        var brightness = tinycolor($(element).css("color")).getBrightness() / 255 * 100;
        var targetBrightness = (100 - (tinycolor(bg).getBrightness() / 255 * 100)) - brightness;
        var brightnessDiff = targetBrightness - brightness;

        if (brightnessDiff > 0) {
            $(element).css("color", "#" + tinycolor($(element).css("color")).brighten(Math.abs(brightnessDiff)).toHex());
        } else {
            $(element).css("color", "#" + tinycolor($(element).css("color")).darken(Math.abs(brightnessDiff)).toHex());
        }
    });

    return fakeRoot.html();
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
    if (!dtps.classes[classNum].letter) return;
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
 * 
 * @param {boolean} [forceRerenderDashboard] If this is true, the dashboard settings will be re-rendered
 */
dtps.settings = function (forceRerenderDashboard) {
    //Render dashboard HTML if not already loaded
    if (forceRerenderDashboard || ($("#leftDashboardColumn").attr("loaded") !== "true")) {
        //Returns dashboard item HTML from a dashboard item array
        function dashboardHTML(dashboardArray) {
            return dashboardArray.map(dashboardItem => {
                return /*html*/`
                <div dashboardItem-id="${dashboardItem.id}" style="height: ${dashboardItem.size * 1.7 + 50}px" class="dashboardItem">
                    <h5>
                        <i class="fluid-icon">${dashboardItem.icon}</i>
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

    //Render grades tab in settings
    dtps.renderGradesInSettings();

    fluid.cards('.settingsCard');

    dtps.gtag('event', 'select_content', {
        content_type: 'settings'
    });
}

/**
 * Shows a warning telling the user that they must reload for setting changes to take effect
 */
dtps.settingsReloadWarning = function () {
    $("#settingsReloadWarning").show();
}

/**
 * Renders the grades tab in settings
 */
dtps.renderGradesInSettings = function () {
    //Render class grade bars
    $("#classGradeBars").html(dtps.classes.map(course => {
        //Percentages below are for visualization purposes only
        var percentage = 0;
        if (course.letter == "A") percentage = 100;
        if (course.letter == "A-") percentage = 91;
        if (course.letter == "B+") percentage = 88;
        if (course.letter == "B") percentage = 85;
        if (course.letter == "B-") percentage = 81;
        if (course.letter == "C+") percentage = 78;
        if (course.letter == "C") percentage = 75;

        return (
            course.letter ? `<div style="cursor: auto; background-color: var(--elements);" class="progressBar big">
        <div style="color: white;" class="progressLabel">${course.subject} (${course.letter})</div>
        <div class="progress" style="background-color: ${course.color}; width: calc(${percentage}% - 300px);"></div></div>` : ""
        )
    }));

    //Calculate GPA
    var sum = 0;
    var values = 0;

    dtps.classes.forEach(course => {
        if (course.letter == "...") {
            sum = null;
        } else if (course.letter && (sum !== null)) {
            var points = 0;
            if (course.letter == "A") points = 4;
            if (course.letter == "A-") points = 3.7;
            if (course.letter == "B+") points = 3.3;
            if (course.letter == "B") points = 3;
            if (course.letter == "B-") points = 2.7;
            if (course.letter == "C+") points = 2.3;
            if (course.letter == "C") points = 2.0;
            if (course.letter == "I") points = 0;

            sum += points;
            values++;
        }
    })

    if (sum == null) {
        $("#dtpsGpaText").text("...");
    } else {
        $("#dtpsGpaText").text((sum / values).toFixed(1));
    }
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
 * Resets dashboard prefrences
 */
dtps.resetDashboardPrefs = function () {
    //Remove dashboard pref from localStorage
    window.localStorage.removeItem("dtpsDashboardItems");

    //Reload dashboard items
    dtps.loadDashboardPrefs();

    //Re-render dashboard
    dtps.settings(true);
}

/**
 * Redirects to DTPS classic edition
 */
dtps.classicEntry = function () {
    var classicName = ["P", "r", "o", "j", "e", "c", "t", " ", "D", "T", "P", "S"];
    var overwrittenHTML = ["P", "o", "w", "e", "r", "+"];
    if (dtps.classicStep == undefined) dtps.classicStep = -10;
    dtps.classicStep++;

    if (dtps.classicStep == 12) window.location.href = "/power+?classicEdition=true";

    for (var i = 0; i < dtps.classicStep; i++) {
        overwrittenHTML[i] = classicName[i];
    }

    $("#dtpsAboutName").html(overwrittenHTML.join(""));
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
    if (!dtpsLMS.isDemoLMS) {
        $("link:not(.dtpsHeadItem)").remove();
        $("head *:not(.dtpsHeadItem)").remove();
    }

    //Set default body classes
    $("body").attr("class", "dark showThemeWindows hasSidebar hasNavbar dashboard");

    //Set document title and favicon
    document.title = "Power+";
    jQuery("<link/>", {
        rel: "shortcut icon",
        type: "image/png",
        href: dtps.baseURL + "/favicon.png"
    }).appendTo("head");

    //Remove existing LMS HTML (excluding DTPS loading screen HTML)
    jQuery("body *:not(#dtpsNativeOverlay):not(#dtpsNativeOverlay *)").remove();

    //Render HTML
    jQuery("body").append(/*html*/`
        <div class="sidebar"></div>        

        <div class="navbar">
          <div class="logo">
            <img src="${dtps.baseURL + "/icon.svg"}" />
            <h4>${dtps.baseURL == "https://dev.dtps.jottocraft.com" ? "Power+ (dev)" : "Power+"}</h4>
          </div>
        
          ${dtps.unstable && !dtpsLMS.isDemoLMS ? `
            <div id="dtpsUnstable" class="navitem">
              <i style="font-size: 16px;" class="fluid-icon">warning</i>
              <span style="font-weight: bold; font-size: 10px;">THIS IS AN UNSTABLE VERSION OF POWER+. USE AT YOUR OWN RISK.</span>
            </div>
          ` : ""}
          
          <div class="items" id="dtpsFixedSearch">
            <i class="inputIcon fluid-icon">search</i>
            <input id="dtpsMainSearchBox" style="margin: 0px; width: 500px;" type="search" class="inputIcon filled" placeholder="Search" />
          </div>

          <div class="items" style="float: right;">
            <div class="navitem" onclick="dtps.settings();">
                <i class="fluid-icon">settings</i>
                <span>Settings</span>
            </div>
          </div>
        </div>

        <div id="dtpsSearchResults" class="card acrylicMaterial" style="display: none;">
            <h5 id="dtpsSearchStatus"><i class="fluid-icon">search</i> <span>Search</span></h5>
            <div id="dtpsSearchData" style="display: none;"></div>
            <div id="dtpsSearchInfo">
                <p>By defualt, Power+ will search based on the page you're on. You can use the keywords below for more advanced searches:</p>
                <div class="grid samesize">
                    <div class="item">
                        <p><i class="fluid-icon">library_books</i> type:coursework</p>
                        <p><i class="fluid-icon">view_module</i> type:module</p>
                        <p><i class="fluid-icon">assignment</i> type:assignment</p>
                        <p><i class="fluid-icon">assessment</i> type:grade</p>
                        <p><i class="fluid-icon">announcement</i> type:announcement</p>
                    </div>
                    <div class="item">
                        <p><i class="fluid-icon">home</i> type:homepage</p>
                        <p><i class="fluid-icon">insert_drive_file</i> type:page</p>
                        <p><i class="fluid-icon">forum</i> type:discussion</p>
                        <p><i class="fluid-icon">people</i> type:person</p>
                        <div class="divider"></div>
                        <p><i class="fluid-icon">class</i> class:English</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="headerArea classImage">
          <img style="display: none;" />
          <div class="content">
            <h1 id="headText"><i class="fluid-icon">dashboard</i> <span>Dashboard</span></h1>
            <div id="classInfo" style="min-height: 18px;">
              <p class="teacher" style="display: none;">
                <span class="teacherImage"></span> <span class="teacherName"></span>
              </p>
              <p onclick="dtps.classHome(dtps.selectedClass);" class="homepage" style="cursor: pointer; display: none;">
                <i class="fluid-icon">home</i> <span>Homepage</span>
              </p>
              <p class="videoMeeting" style="cursor: pointer; display: none;">
                <i class="fluid-icon">videocam</i> <span>Meeting</span>
              </p>
              <p class="contentLabel" style="display: none;">
                <i class="fluid-icon"></i> <span></span>
              </p>
            </div>
            <div style="display: none;" id="dtpsTabBar" class="btns">
                <button init="true" onclick="if (dtps.classes[dtps.selectedClass].modules && (window.localStorage.getItem('courseworkPref-' + dtps.classes[dtps.selectedClass].id) == 'moduleStream')) { fluid.screen('moduleStream', dtps.classes[dtps.selectedClass].id); } else { fluid.screen('stream', dtps.classes[dtps.selectedClass].id); }" class="btn stream">
                    <i class="fluid-icon">library_books</i>
                    Coursework
                </button>
                <button init="true" onclick="fluid.screen('people', dtps.classes[dtps.selectedClass].id);" class="btn people">
                    <i class="fluid-icon">people</i>
                    People
                </button>
                <button init="true" onclick="fluid.screen('discussions', dtps.classes[dtps.selectedClass].id);" class="btn discuss">
                    <i class="fluid-icon">forum</i>
                    Discussions
                </button>
                <button init="true" onclick="fluid.screen('pages', dtps.classes[dtps.selectedClass].id);" class="btn pages">
                    <i class="fluid-icon">insert_drive_file</i>
                    Pages
                </button>
                <button init="true" onclick="fluid.screen('gradebook', dtps.classes[dtps.selectedClass].id);" class="btn grades">
                    <i class="fluid-icon">assessment</i>
                    ${dtpsLMS.gradebook ? "Grades" : "Gradebook"}
                </button>
            </div>
          </div>
        </div>

        <!-- Class content area -->
        <div class="classContent">
            <div class="spinner"></div>
        </div>

        <!-- Settings card (its inner HTML is added later) -->
        <div style="height: 100%; overflow: auto !important;" class="card withnav focus close container settingsCard"></div>

        <!-- Changelog card -->
        <div style="border-radius: 30px;" class="card focus changelog close container">
            <i onclick="fluid.cards.close('.card.changelog')" class="fluid-icon close">close</i>
            <h3>What's new in Power+</h3>
            <h5>Loading...</h5>
        </div>

        <!-- General details card for assignments, outcomes, class info, etc. -->
        <div style="border-radius: 30px;" class="card focus details close container">
            <i onclick="fluid.cards.close('.card.details')" class="fluid-icon close">close</i>
            <p>An error occured</p>
        </div>

        <!-- General iFrame card (with white background) -->
        <div style="border-radius: 30px; top: 50px; background-color: white; color: black;" class="card focus close iFrameCard container">
            <i style="color: black !important;" onclick="fluid.cards.close('.card.iFrameCard'); $('#CardIFrame').attr('src', '');" class="fluid-icon close">close</i>
            <br /><br />
            <iframe style="width: 100%; height: calc(100vh - 175px); border: none;" id="CardIFrame"></iframe>
        </div>
    `);

    $("#dtpsMainSearchBox").on("focus", function () {
        $("#dtpsSearchResults").show();
    });

    $("#dtpsMainSearchBox").on("blur", function () {
        $("#dtpsSearchResults").hide();
    });

    $("#dtpsMainSearchBox").on("input", function () {
        dtps.setSearchBox();
    });

    $(document).on("keydown", "#dtpsMainSearchBox", function (e) {
        if (e.key == "Enter") {
            //Validate input and tags
            var term = $("#dtpsMainSearchBox").val().replace(/(type|class):[a-z]*/gi, "").trim();
            if ($("#dtpsMainSearchBox").attr("data-search-type") && $("#dtpsMainSearchBox").attr("data-dtps-course")) {
                fluid.screen("search", {
                    term: term,
                    type: $("#dtpsMainSearchBox").attr("data-search-type"),
                    course: $("#dtpsMainSearchBox").attr("data-dtps-course"),
                    ctxType: $("#dtpsMainSearchBox").attr("data-ctx-type"),
                    ctxCourse: $("#dtpsMainSearchBox").attr("data-ctx-course")
                });
                $("#dtpsMainSearchBox").blur();
            }

            dtps.gtag('event', 'search', {
                search_term: term,
                type: $("#dtpsMainSearchBox").attr("data-search-type"),
                typeOverridden: $("#dtpsMainSearchBox").attr("data-search-type") !== $("#dtpsMainSearchBox").attr("data-ctx-type"),
                courseOverridden: $("#dtpsMainSearchBox").attr("data-dtps-course") !== $("#dtpsMainSearchBox").attr("data-ctx-course")
            });
        }
    });
}

/**
 * Sets the search box text based on the current page or keywords
 */
dtps.setSearchBox = function () {
    var value = $("#dtpsMainSearchBox").val() || "";

    var type = null;
    var course = dtps.selectedClass == "dash" ? "dash" : dtps.classes[dtps.selectedClass];
    var icon = null;
    var error = false;
    var autoType = null;
    var autoCourse = dtps.selectedClass == "dash" ? "dash" : dtps.classes[dtps.selectedClass];

    //Get automatic type from selected content
    if (dtps.selectedContent == "people") type = "people";
    if (dtps.selectedContent == "discuss") type = "discussions";
    if (dtps.selectedContent == "pages") type = "pages";
    if (dtps.selectedContent == "grades") type = "grades";
    if ((dtps.selectedClass == "dash") || (dtps.selectedContent == "stream") || (dtps.selectedContent == "moduleStream")) type = "coursework";
    autoType = type;

    //Reuse auto type if on search
    if (dtps.selectedClass == "search") {
        type = $("#dtpsMainSearchBox").attr("data-ctx-type");
        course = $("#dtpsMainSearchBox").attr("data-ctx-course");
        if (!isNaN(Number(course))) course = dtps.classes[course];
    }

    //Check for type override from search box
    if (value.split(" ").includes("type:coursework")) type = "coursework";
    if (value.split(" ").includes("type:homepage")) type = "homepages";
    if (value.split(" ").includes("type:page")) type = "pages";
    if (value.split(" ").includes("type:discussion")) type = "discussions";
    if (value.split(" ").includes("type:grade")) type = "grades";
    if (value.split(" ").includes("type:person")) type = "people";
    if (value.split(" ").includes("type:assignment")) type = "assignments";
    if (value.split(" ").includes("type:module")) type = "modules";
    if (value.split(" ").includes("type:announcement")) type = "announcements";
    if (value.split(" ").includes("type:all")) type = "everything";

    //Get icon from final type
    if (type == "coursework") icon = "library_books";
    if (type == "people") icon = "people";
    if (type == "discussions") icon = "forum";
    if (type == "pages") icon = "insert_drive_file";
    if (type == "grades") icon = "assessment";
    if (type == "assignments") icon = "assignment";
    if (type == "modules") icon = "view_module";
    if (type == "homepages") icon = "home";
    if (type == "announcements") icon = "announcement";
    if (type == "everything") icon = "warning";

    //Check for course override from search box
    if (value.includes("class:")) {
        var partialSubject = value.split("class:")[1].split(" ")[0].toLowerCase();
        if (partialSubject == "all") {
            course = "all";
        } else if (partialSubject) {
            dtps.classes.forEach(c => {
                if (c.subject.toLowerCase().includes(partialSubject)) {
                    course = c;
                }
            });
        }
    }

    //Check if the course supports the type
    if ((course !== "dash") && (course !== "all")) {
        if ((type == "pages") && !course.pages) error = true;
        if ((type == "discussions") && !course.discussions) error = true;
        if ((type == "modules") && !course.modules) error = true;
        if ((type == "homepages") && !course.homepage) error = true;
        if ((type == "people") && !course.people) error = true;
    }

    if ((course == "dash") || (course == "all")) {
        $("#dtpsSearchStatus i").text(icon);
        $("#dtpsSearchStatus span").text("Search " + (type == "everything" ? type : "all " + type));
        $("#dtpsMainSearchBox").attr("placeholder", "Search " + (type == "everything" ? type : "all " + type));
        $("#dtpsMainSearchBox").attr("data-dtps-course", "all");
        $("#dtpsMainSearchBox").attr("data-search-type", type);
    } else if (error) {
        $("#dtpsSearchStatus i").text("error");
        $("#dtpsSearchStatus span").html(`Cannot search for ${type} in <b style="color: ${course.color};">${course.subject}</b>`);
        $("#dtpsMainSearchBox").attr("placeholder", "Cannot search for " + type + " in " + course.subject);
        $("#dtpsMainSearchBox").attr("data-dtps-course", "");
        $("#dtpsMainSearchBox").attr("data-search-type", "");
    } else if (course || true) {
        $("#dtpsSearchStatus i").text(icon);
        $("#dtpsSearchStatus span").html(`Search ${type} in <b style="color: ${course.color};">${course.subject}</b>`);
        $("#dtpsMainSearchBox").attr("placeholder", "Search " + type + " in " + course.subject);
        $("#dtpsMainSearchBox").attr("data-dtps-course", course.num);
        $("#dtpsMainSearchBox").attr("data-search-type", type);
    }

    //Set auto type
    if (dtps.selectedClass !== "search") {
        $("#dtpsMainSearchBox").attr("data-ctx-type", autoType);
        $("#dtpsMainSearchBox").attr("data-ctx-course", autoCourse == "dash" ? "dash" : autoCourse.num);
    }
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

    //Add alternateFont body class if enabled and preference listener
    if (fluid.get("pref-alternateFont") == "true") { jQuery('body').addClass('alternateFont'); }
    document.addEventListener("pref-alternateFont", function (e) {
        if ((e.detail == "true") || (e.detail == true)) {
            //alternateFont has been enabled, add class to body to change font
            jQuery('body').addClass('alternateFont');
        } else {
            //alternateFont has been disabled, remove class from body to revert font change
            jQuery('body').removeClass('alternateFont');
        }
    });

    //Render settings card
    var baseHost = new URL(dtps.baseURL).hostname;
    jQuery(".card.settingsCard").html(/*html*/`
        <i onclick="fluid.cards.close('.card.settingsCard')" class="fluid-icon close">close</i>

        <div style="position: fixed; height: calc(100% - 100px);" class="sidenav">
            <div class="title">
	            <img src="${dtps.baseURL + "/icon.svg"}" style="width: 50px;vertical-align: middle;padding: 7px; padding-top: 14px;" />
	            <div style="vertical-align: middle; display: inline-block;">
                    <h5 style="font-weight: bold;display: inline-block;vertical-align: middle;">Power+</h5>
                    <p>${dtps.readableVer + (dtps.unstable ? ` <span style="font-size: 12px; color: red;">(unstable)</span>` : "")}</p>
	            </div>
            </div>

            <div onclick="$('.abtpage').hide();$('.abtpage.settings').show();dtps.gtag('event', 'select_content', { content_type: 'settings', tab: 'settings' });" class="item active">
                <i class="fluid-icon">settings</i> Settings
            </div>
            <div onclick="$('.abtpage').hide();$('.abtpage.theme').show();dtps.gtag('event', 'select_content', { content_type: 'settings', tab: 'theme' });" class="item">
                <i class="fluid-icon">format_paint</i> Theme
            </div>
            <div onclick="$('.abtpage').hide();$('.abtpage.grades').show();dtps.gtag('event', 'select_content', { content_type: 'settings', tab: 'grades' });" class="item">
                <i class="fluid-icon">assessment</i> GPA
            </div>
            <div onclick="$('.abtpage').hide();$('.abtpage.dashboard').show();dtps.gtag('event', 'select_content', { content_type: 'settings', tab: 'dashboard' });" class="item">
                <i class="fluid-icon">dashboard</i> Dashboard
            </div>
            ${dtps.env == "dev" ? /*html*/`
                <div onclick="$('.abtpage').hide();$('.abtpage.debugging').show();dtps.gtag('event', 'select_content', { content_type: 'settings', tab: 'debugging' });" class="item">
                    <i class="fluid-icon">bug_report</i> Debugging
                </div>
                <div onclick="$('.abtpage').hide();$('.abtpage.experiments').show();dtps.gtag('event', 'select_content', { content_type: 'settings', tab: 'experiments' });" class="item">
                    <i class="fluid-icon">science</i> Experiments
                </div>
            ` : ``}
            <div onclick="$('.abtpage').hide();$('.abtpage.about').show();dtps.gtag('event', 'select_content', { content_type: 'settings', tab: 'about' });" class="item abt">
                <i class="fluid-icon">info</i> About
            </div>
        </div>

        <div style="min-height: 100%" class="content">
            <div class="abtpage settings">
                <h5><b>Settings</b></h5>

                <p style="display: none;" id="settingsReloadWarning">You need to reload for the changes you've made to take effect</p>
                
                <br />
                <p>Sidebar</p>

                <div onclick="fluid.set('pref-hideGrades');" class="switch pref-hideGrades"><span class="head"></span></div>
                <div class="label"><i class="fluid-icon">visibility_off</i> Hide class grades</div>

                ${dtpsLMS.dtech && !dtps.user.parent ? /*html*/`
                        <br /><br />
                        <div onclick="fluid.set('pref-autoGroupClasses'); dtps.settingsReloadWarning();" class="switch pref-autoGroupClasses active"><span class="head"></span></div>
                        <div class="label"><i class="fluid-icon">sort</i> Automatically group and sort classes</div>
                    ` : ""
        }

                <br /><br />
                <p>Classes</p>

                <div onclick="fluid.set('pref-fullNames'); dtps.settingsReloadWarning();" class="switch pref-fullNames"><span class="head"></span></div>
                <div class="label"><i class="fluid-icon">title</i> Show full class names</div>
                    
                <br /><br />
                <div onclick="fluid.set('pref-hideClassImages')" class="switch pref-hideClassImages"><span class="head"></span></div>
                <div class="label"><i class="fluid-icon">image</i> Hide class images</div>

                <div id="dtpsPrereleaseTesting" style="${window.localStorage.prereleaseEnabled || (dtps.env == "dev") || window.localStorage.githubRepo || window.localStorage.externalReleaseURL ? "" : "display: none;"}">
                    <br /><br />
                    <p>Prerelease testing</p>

                    <div>
                        <div class="btns row small">
                            <button 
                                onclick="window.localStorage.setItem('dtpsLoaderPref', 'prod')" 
                                class="btn ${!["dev", "github", "external", "local"].includes(window.localStorage.dtpsLoaderPref) ? "active" : ""}">
                                <i class="fluid-icon">label</i> Production
                            </button>
                            <!-- check dtps.init before uncommenting <button 
                                onclick="window.localStorage.setItem('dtpsLoaderPref', 'dev')" 
                                class="btn ${window.localStorage.dtpsLoaderPref == "dev" ? "active" : ""}">
                                <i class="fluid-icon">feedback</i> Dev
                            </button>-->
                            ${window.localStorage.githubRepo ? /*html*/`
                                <button 
                                    onclick="window.localStorage.setItem('dtpsLoaderPref', 'github')" 
                                    class="btn ${window.localStorage.dtpsLoaderPref == "github" ? "active" : ""}">
                                    <i class="fluid-icon">account_tree</i> Branch
                                </button>
                            ` : ``}
                            ${window.localStorage.externalReleaseURL ? /*html*/`
                                <button 
                                    onclick="window.localStorage.setItem('dtpsLoaderPref', 'external')" 
                                    class="btn ${window.localStorage.dtpsLoaderPref == "external" ? "active" : ""}">
                                    <i class="fluid-icon">public</i> External
                                </button>
                            ` : ``}
                            <button
                                onclick="window.localStorage.setItem('dtpsLoaderPref', 'local')" 
                                class="btn ${window.localStorage.dtpsLoaderPref == "local" ? "active" : ""}">
                                <i class="fluid-icon">developer_board</i> Local
                            </button>
                        </div>
                    </div>
                </div>

            </div>

            <div style="display: none;" class="abtpage theme">
                <h5><b>Theme</b></h5>
                <br />
                <div class="themeSelectionUI flat"></div>
            </div>

            <div style="display: none;" class="abtpage grades">
                <h5><b>GPA</b></h5>
                
                <br />

                <div>
                <h6>Unweighted GPA: <b id="dtpsGpaText">...</b></h6>
                <p style="color: var(--secText);"><i>This GPA calculation is based on the letter grades shown below and is not official</i></p>
                </div>
                
                <br />

                <div id="classGradeBars"></div>
            </div>

            <div style="display: none;" class="abtpage dashboard">
                <h5><b>Dashboard</b></h5>
                <p>You can rearrange the items shown on the dashboard by dragging them below. You might have to reload Power+ for changes to take effect.</p>

                <button onclick="dtps.resetDashboardPrefs();" class="btn small"><i class="fluid-icon">refresh</i> Reset dashboard layout</button>

                <br />
                
                <div id="leftDashboardColumn" class="dashboardColumn"></div>

                <div id="rightDashboardColumn" class="dashboardColumn"></div>
            </div>

            ${dtps.env == "dev" ? /*html*/`
                <div style="display: none;" class="abtpage debugging">
                   <h5><b>Debugging</b></h5>
                   <p>These settings are for development only and might break Power+. Use at your own risk.</p>

                   <div>
                    <button onclick="dtps.firstrun()" class="btn small"><i class="fluid-icon">web_asset</i> Show firstrun screen</button>
                   </div>

                   <br /><br />

                   <h5>Release configuration</h5>

                   <button onclick="['dtpsLoaderPref', 'prereleaseEnabled', 'githubRepo', 'externalReleaseURL', 'dtpsLMSOverride'].forEach(k => window.localStorage.removeItem(k)); window.location.reload();" class="btn small"><i class="fluid-icon">cancel</i> Clear release configurations</button>
                   <br /><br />

                   <div>
                       <input id="dtpsGithubRepo" value="${window.localStorage.githubRepo || ""}" placeholder="Branch GitHub repo" />
                       <button class="btn small" onclick="window.localStorage.setItem('githubRepo', $('#dtpsGithubRepo').val())"><i class="fluid-icon">save</i> Save</button>
                   </div>

                   <div>
                       <input id="dtpsExternalReleaseURL" value="${window.localStorage.externalReleaseURL || ""}" placeholder="External release URL" />
                       <button class="btn small" onclick="window.localStorage.setItem('externalReleaseURL', $('#dtpsExternalReleaseURL').val())"><i class="fluid-icon">save</i> Save</button>
                   </div>

                   <div>
                       <input id="dtpsLMSOverride" value="${window.localStorage.dtpsLMSOverride || ""}" placeholder="LMS override" />
                       <button class="btn small" onclick="window.localStorage.setItem('dtpsLMSOverride', $('#dtpsLMSOverride').val())"><i class="fluid-icon">save</i> Save</button>
                   </div>

                   <br />

                   <h5>Behavior Overrides</h5>

                   <br />
                   <div onclick="fluid.set('pref-debuggingGenericGradebook')" class="switch pref-debuggingGenericGradebook"><span class="head"></span></div>
                   <div class="label">Always use the generic gradebook</div>

                   <br /><br />
                   <div onclick="fluid.set('pref-debuggingLocalFluidUI')" class="switch pref-debuggingLocalFluidUI"><span class="head"></span></div>
                   <div class="label">Use local Fluid UI</div>

                   <br /><br />

                   <br /><br />
                   <input type="date" />
                   <br /><br />
                   <input type="color" />
                </div>
                <div style="display: none;" class="abtpage experiments">
                    <h5><b>Experiments</b></h5>
                    <p>These settings control how Power+ behaves. Changing these settings may enable unsupported and/or unfinished features that can break Power+. Use at your own risk.</p>

                    <button onclick="Object.keys(dtps.remoteConfig).forEach(k => window.localStorage.removeItem('dtpsRemoteConfig-' + k));" class="btn small"><i class="fluid-icon">cancel</i> Clear Overrides</button>
                    <br /><br />
                   ${Object.keys(dtps.remoteConfig).map(k => (`
                        <div>
                            <p>${k} ${window.localStorage.getItem("dtpsRemoteConfig-" + k) ? " <b>(overridden)</b>" : ""}</p>
                            <input value="${dtps.remoteConfig[k]}" placeholder="Value" />
                            <button class="btn small" onclick="window.localStorage.setItem('dtpsRemoteConfig-${k}', $(this).siblings('input').val())"><i class="fluid-icon">save</i> Save</button>
                        </div>
                    `)).join("")}
                </div>
            ` : ``}

            <div style="display: none;" class="abtpage about">
                <h5><b>About</b></h5>

                <div class="card" style="padding: 10px 20px; box-shadow: none !important; border: 2px solid var(--elements); margin-top: 20px;">
                    <img src="${dtps.baseURL + "/icon.svg"}" style="height: 50px; margin-right: 10px; vertical-align: middle; margin-top: 20px;" />
                    
                    <div style="display: inline-block; vertical-align: middle;">
                        <h4 id="dtpsAboutName" onclick="dtps.classicEntry()" style="font-weight: bold; font-size: 32px; margin-bottom: 0px; user-select: none;">${dtps.baseURL == "https://dev.dtps.jottocraft.com" ? "Power+ (dev)" : "Power+"}</h4>
                        <div style="font-size: 16px; margin-top: 5px;">
                            ${dtps.readableVer}
                            <div style="display: inline-block;margin: 0px 5px;font-size: 12px;">${baseHost !== "powerplus.app" ? `(from ${baseHost})` : ""}</div>
                        </div>
                    </div>

                    <div style="margin-top: 15px; margin-bottom: 7px;"><a onclick="dtps.changelog();" style="color: var(--lightText); margin: 0px 5px;" href="#"><i class="fluid-icon" style="vertical-align: middle">update</i> Changelog</a>
                        <a onclick="if (window.confirm('Are you sure you want to uninstall Power+? The extension will be removed and all of your Power+ data will be erased. If you use the Power+ bookmarklet, you will have to remove that yourself.')) { document.dispatchEvent(new CustomEvent('extensionData', { detail: 'extensionUninstall' })); window.localStorage.clear(); window.alert('Power+ has been uninstalled. Reload the page to go back to ${dtpsLMS.shortName}.') }" style="color: var(--lightText); margin: 0px 5px; cursor: pointer;"><i class="fluid-icon" style="vertical-align: middle">delete_outline</i> Uninstall</a>
                        <a style="color: var(--lightText); margin: 0px 5px;" href="mailto:hello@jottocraft.com"><i class="fluid-icon" style="vertical-align: middle">email</i> hello@jottocraft.com</a>
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
                        <a style="color: var(--lightText); margin: 0px 5px;" href="/logout"><i class="fluid-icon" style="vertical-align: middle">exit_to_app</i> Logout</a>
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
                        <a style="color: var(--lightText); margin: 0px 5px;" href="${dtpsLMS.source}"><i class="fluid-icon" style="vertical-align: middle">code</i> LMS integration source code</a>
                    </div>
                </div>

                <div class="card advancedOptions" style="padding: 8px 16px; box-shadow: none !important; border: 2px solid var(--elements); margin-top: 20px; ${dtps.env == "dev" ? `` : `display: none;`}">
                    <div style="display: inline-block; vertical-align: middle;">
                        <h4 style="font-weight: bold; font-size: 28px; margin-bottom: 0px;">Advanced Options</h4>
                    </div>

                    <br /><br />
                    <div onclick="fluid.set('pref-alternateFont')" class="switch pref-alternateFont"><span class="head"></span></div>
                    <div class="label"><i class="fluid-icon">font_download</i> Use Alternate Font</div>
                    <br /><br />

                    <div style="margin-top: 15px; margin-bottom: 7px;">
                        <a style="color: var(--lightText); margin: 0px 5px; cursor: pointer;" onclick="dtps.clearData();"><i class="fluid-icon" style="vertical-align: middle">refresh</i> Reset Power+</a>
                        <a style="color: var(--lightText); margin: 0px 5px; cursor: pointer;" onclick="if (confirm('Prerelease versions of Power+ are often untested and can break or display incorrect information. Are you sure you want to continue?')) {window.localStorage.prereleaseEnabled = 'true'; $('#dtpsPrereleaseTesting').show(); alert('Prerelease versions can be enabled by going to Settings -> Prerelease testing');}"><i class="fluid-icon" style="vertical-align: middle">feedback</i> Test prerelease versions</a>
                        ${window.localStorage.dtpsAnalyticsOptOut == "true" ? `<a style="color: var(--secText); margin: 0px 5px;">Analytics disabled</a>` : `<a style="color: var(--lightText); margin: 0px 5px; cursor: pointer;" onclick="window.localStorage.dtpsAnalyticsOptOut = 'true'; window.alert('Analytics have been disabled on this device. The page will now reload.'); window.location.reload();"><i class="fluid-icon" style="vertical-align: middle">analytics</i> Analytics opt-out</a>`}
                    </div>
                </div>

                <br />
                ${dtps.env == "dev" ? `` : `<p style="cursor: pointer; color: var(--secText, gray)" onclick="$('.advancedOptions').show(); $(this).hide();" class="advOp">Show advanced options</p>`}

                <div style="text-align: center; padding: 50px 0px;">
                    <img style="height: 45px; margin-right: 20px; vertical-align: middle;" src="https://cdn.jottocraft.com/images/footerImage.png" />
                    <h5 style="display: inline-block; vertical-align: middle;">jottocraft</h5>
                    <p>(c) jottocraft 2018-2021 &nbsp;&nbsp;<a href="https://github.com/jottocraft/dtps">source code</a>&nbsp;&nbsp;<a href="https://github.com/jottocraft/dtps/blob/main/LICENSE">license</a></p>
                </div>
            </div>
        </div>
    `);

    //Load Fluid UI
    fluid.onLoad();

    //Render sidebar
    dtps.showClasses();

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
 * @property {boolean} [dtech] True if this LMS is d.tech
 * @property {boolean} [institutionSpecific] True if the LMS is designed for a specific institution instead of a broader LMS
 * @property {boolean} [preferRubricGrades] True if DTPS should prefer rubric grades for assignments
 * @property {boolean} [genericGradebook] True if DTPS should show the generic gradebook. Ignored if dtpsLMS.gradebook defined.
 */

/**
 * @name dtpsLMS.fetchUser
 * @description [REQUIRED] Fetches data for the current user from the LMS. If the user is not signed in, reject with an object that looks like {action: "login", redirectURL: "..."} to login the user.
 * @kind function
 * @return {Promise<User>} A promise which resolves to a User object
 */

/**
* @name dtpsLMS.fetchClasses
* @description [REQUIRED] Fetches class data from the LMS
* @kind function
* @param {string} userID The user ID to fetch classes for
* @return {Promise<Class[]>} A promise which resolves to an array of Class objects
*/

/**
* @name dtpsLMS.fetchAssignments
* @description [REQUIRED] Fetches assignment data for a course from the LMS
* @kind function
* @param {string} userID The user ID to fetch assignments for
* @param {string} classID The class ID to fetch assignments for
* @return {Promise<Assignment[]>} A promise which resolves to an array of Assignment objects
*/

/**
* @name dtpsLMS.fetchModules
* @description [OPTIONAL] Fetches module data for a course from the LMS
* @kind function
* @param {string} userID The user ID to fetch modules for
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
* @name dtpsLMS.collapseAllModules
* @description [OPTIONAL] Collapses all modules in the LMS
* @kind function
* @param {string} classID The ID of the class
* @param {boolean} collapsed True if all modules should be collapsed, false otherwise
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
* @name dtpsLMS.fetchMeetingURL
* @description [OPTIONAL] Fetches the videoMeetingURL for a class
* @kind function
* @param {string} classID The class ID to get the videoMeetingURL for
* @return {Promise<string>} A promise which resolves to the videoMeetingURL for the class, or null if the class does not have a videoMeetingURL
*/

/**
* @name dtpsLMS.fetchHomepage
* @description [OPTIONAL] Fetches homepage HTML for a course from the LMS
* @kind function
* @param {string} classID The class ID to get the homepage for
* @return {Promise<string>} A promise which resolves to the HTML for the class homepage
*/

/**
* @name dtpsLMS.fetchUsers
* @description [OPTIONAL] Fetches the users for a course from the LMS
* @kind function
* @param {string} classID The class ID to fetch users for
* @return {Promise<ClassSection[]>} A promise which resolves to an array of sections in this class
*/

/**
* @name dtpsLMS.fetchDiscussionThreads
* @description [OPTIONAL] Fetches discussion threads for a course from the LMS
* @kind function
* @param {string} classID The class ID to fetch discussion threads for
* @return {Promise<PartialDiscussionThread[]>} A promise which resolves to an array of partial Discussion Thread objects
*/

/**
* @name dtpsLMS.fetchDiscussionPosts
* @description [REQUIRED IF dtpsLMS.fetchDiscussionThreads IS IMPLEMENTED] Fetches discussion posts in a thread from the LMS
* @kind function
* @param {string} classID The class ID to fetch discussion posts for
* @param {string} threadID The discussion thread ID to fetch discussion posts for
* @return {Promise<DiscussionThread>} A promise which resolves to a full discussion thread object
*/

/**
* @name dtpsLMS.fetchPages
* @description [OPTIONAL] Fetches pages for a course from the LMS
* @kind function
* @param {string} classID The class ID to fetch pages for
* @return {Promise<PartialPage[]>} A promise which resolves to an array of partial page objects
*/

/**
* @name dtpsLMS.fetchPageContent
* @description [REQUIRED IF dtpsLMS.fetchPages IS IMPLEMENTED] Fetches content for a page from the LMS
* @kind function
* @param {string} classID The class ID to fetch page content for
* @param {string} pageID The page ID to fetch page content for
* @return {Promise<Page>} A promise which resolves to a full DTPS page object
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
* @name dtpsLMS.isUsualDueDate
* @description [OPTIONAL, INSTITUTION ONLY] This function returns true if the due date provided is usual/expected and false if the due date is unusual/expected. If the due date is unusual, it is shown in bold in the UI. For institutions where there is a pattern/standard for due dates between classes.
* @kind function
* @param {Date} date The due date to check
* @return {boolean} True if the due date is usual, false if the due date is unusual/unexpected.
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
 * @typedef {string|Date} Date
 * @description A date string recognized by {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse|Date.parse} or an actual {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date|Date} object
 */

/**
 * @typedef {Object} User
 * @description Defines user objects in DTPS
 * @property {string} name User name
 * @property {string} id User ID
 * @property {string} photoURL User photo URL
 * @property {string} url [ONLY FOR DTPSLMS.FETCHUSERS] The URL to this user's profile. Only used when displaying users in the people tab.
 * @property {User[]} [children] [ONLY FOR DTPS.USER] Array of child users. If this is defined, the user is treated as a parent account. Sub-children are not allowed.
 * @property {boolean} parent [ONLY FOR DTPS.USER] Automatically managed by DTPS. True if the user is a parent account.
 */

/**
* @typedef {Object} Class
* @description Defines class objects in DTPS
* @property {string} name Name of the class
* @property {string} id Class ID used by Power+
* @property {string} lmsID Class ID used for LMS API calls
* @property {string} userID The ID of the user this class is associated with (from the parameter of dtpsLMS.fetchClasses)
* @property {number} num Index of the class in the dtps.classes array
* @property {string} subject Class subject
* @property {ClassSection[]|boolean} [people] Users in this class. True if the class supports the "People" tab, but not yet loaded. If this is true dtpsLMS.fetchUsers must be implemented.
* @property {string} [icon] The icon to show with this class
* @property {string} [group] The name of the group that this class is in
* @property {number|string} [period] The period or section the user has this class at
* @property {Date} [endDate] The end date for this course
* @property {Assignment[]} assignments Class assignments. Assume assignments are still loading if this is undefined. The class has no assignments if this is an empty array. Loaded in dtps.init.
* @property {Module[]|boolean} [modules] Class modules. Assume this class supports the modules feature, but is not yet loaded, if this is true and that the class has no modules if this is an empty array. For LMSs that do not support modules, either keep it undefined or set it to false.
* @property {DiscussionThread[]|boolean} [discussions] Class discussion threads. Assume this class supports discussions, but not yet loaded, if this is true and that the class has no threads if this is an empty array. For LMSs that do not support discussions, either keep it undefined or set it to false.
* @property {Page[]|boolean} [pages] Class pages. Assume this class supports the pages feature, but not yet loaded, if true and that the class has no pages if this is an empty array. For LMSs that do not support pages, either keep it undefined or set it to false.
* @property {string} [newDiscussionThreadURL] A URL the user can visit to create a new discussion thread in this class
* @property {boolean} [homepage] True if the class has a homepage. If a class has a homepage, dtpsLMS.fetchHomepage must be implemented.
* @property {string} [term] Class term
* @property {string} [color] Class color
* @property {number} [grade] Current percentage grade in the class (a number from 0 to 100)
* @property {string} [letter] Current letter grade in the class
* @property {string} [previousLetter] Automatically managed by DTPS. The previous letter grade in this class, based on local grade history.
* @property {string} [image] URL to the class background image
* @property {User} [teacher] Class teacher. If the class has multiple teachers, this is the primary teacher.
* @property {boolean} [hasGradebook] Automatically managed by DTPS. True if the class should show the gradebook tab.
* @property {object} [gradeCalculation] Automatically managed by DTPS. If custom grade calculation is implemented, this will be the results from custom grade calculation returned by dtpsLMS.calculateGrade.
* @property {string} [videoMeetingURL] The URL used to join this class' online meeting. If dtpsLMS.fetchMeetingURL is implemented, DTPS will use it to get the meeting URL if this property is undefined. If this property is null, DTPS will not call dtpsLMS.fetchMeeting URL for the class.
*/
