/* Power+ v2.0.0 (beta)
(c) 2018 - 2019 jottocraft
https://github.com/jottocraft/dtps */

//Basic global Power+ configuration. All global Power+ variables go under dtps
var dtps = {
    ver: 200,
    readableVer: "v2.0.0 (beta)",
    trackSuffix: " (beta)",
    trackColor: "#ec9b06",
    showLetters: false,
    fullNames: false,
    latestStream: [],
    chromaProfile: {
        title: "Power+",
        description: "Razer Chroma effects for Power+ (beta)",
        author: "jottocraft",
        domain: "dtps.js.org"
    }
};

//Load a better version of jQuery as soon as possible because of Canvas's weird included version of jQuery that breaks a lot of important things
jQuery.getScript("https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js")

//Embedded Status Updates (load this before AND after rendering Power+ just in case something breaks in dtps.render)
//REMOVED 8.13.2019
//jQuery.getScript("https://fnxldqd4m5fr.statuspage.io/embed/script.js")

//Shows the Power+ changelog modal
dtps.changelog = function () {
    fluid.cards.close(".card.focus")
    fluid.modal(".card.changelog");
};

//Logs debugging messags to both the normal JS console and also Power+'s included debugging log
dtps.log = function (msg) {
    console.log("[DTPS" + dtps.trackSuffix + "] ", msg);
    if (typeof msg !== "object") { try { jQuery("span.log").html(`<p>[DTPS` + dtps.trackSuffix + `] ` + msg + `</p>` + jQuery("span.log").html()); } catch (e) { } }
}

//Renders Power+ first run stuff
dtps.firstrun = function () {
    jQuery("body").append(`<div id="dtpsNativeAlert" class="ui-dialog ui-widget ui-widget-content ui-corner-all ui-dialog-buttons" tabindex="-1" aria-hidden="false" style="outline: 0px; z-index: 5000; height: auto; width: 500px; margin-top: 100px; top: 0; margin-left: calc(50% - 250px); display: block;">
<div class="ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix"><span id="ui-id-1" class="ui-dialog-title" role="heading">Welcome to Power+` + dtps.trackSuffix + `</span><button onclick="jQuery('#dtpsNativeAlert').remove();jQuery('#dtpsNativeOverlay').remove();" class="ui-dialog-titlebar-close ui-corner-all"><span class="ui-icon ui-icon-closethick">close</span></button></div>
<form id="new_course_form" class="bootstrap-form form-horizontal ui-dialog-content ui-widget-content" data-turn-into-dialog="{&quot;width&quot;:500,&quot;resizable&quot;:false}" style="width: auto; min-height: 0px; height: auto; display: block;" action="/courses" accept-charset="UTF-8" method="post" aria-expanded="true" scrolltop="0" scrollleft="0">
<h5>` + dtps.readableVer + `</h5>
<p>Things to keep in mind when testing Power+` + dtps.trackSuffix + `</p>
<li>Power+` + dtps.trackSuffix + ` can't fully replace Canvas yet. Many Canvas features are not included in Power+` + dtps.trackSuffix + `.</li>
<li>The Power+ gradebook is being temporarily disabled and will return later this year.</li>
<li style="color: red;"><b>Power+` + dtps.trackSuffix + ` is still in development. There will be a lot of bugs and missing features, especially in the first month of the school year.</b></li>
<li><b>Power+` + dtps.trackSuffix + ` may have bugs that cause it to display inaccurate information. Use Power+` + dtps.trackSuffix + ` at your own risk.</b></li>
</form><div class="ui-dialog-buttonpane ui-widget-content ui-helper-clearfix"><div class="ui-dialog-buttonset"><button onclick="jQuery('#dtpsNativeAlert').remove();jQuery('#dtpsNativeOverlay').remove();" type="button" data-text-while-loading="Cancel" class="btn dialog_closer ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only" role="button" aria-disabled="false"><span class="ui-button-text">Cancel</span></button><button onclick="localStorage.setItem('dtpsInstalled', 'true'); dtps.render();" type="button" data-text-while-loading="Loading Power+..." class="btn btn-primary button_type_submit ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only" role="button" aria-disabled="false"><span class="ui-button-text">Continue</span></button></div></div></div>
<div id="dtpsNativeOverlay" class="ui-widget-overlay" style="width: 100%; height: 100%; z-index: 500;"></div>`)
};

//Displays a native Canvas alert (cannot be used after Power+ is rendered / dtps.render)
dtps.nativeAlert = function (text, sub, loadingSplash) {
    if (text == undefined) var text = "";
    if (sub == undefined) var sub = "";
    if (loadingSplash) {
        jQuery("body").append(`<div id="dtpsNativeOverlay" class="ui-widget-overlay" style="width: 100%;height: 100%;z-index: 500;background: rgba(31, 31, 31, 0.89);">&nbsp;<h1 style="position: fixed;font-size: 125px;background: -webkit-linear-gradient(rgb(255, 167, 0), rgb(255, 244, 0));-webkit-background-clip: text;-webkit-text-fill-color: transparent;font-weight: bolder;font-family: Product sans;text-align: center;top: 200px;width: 100%;">Power+</h1><h5 style="font-family: Product sans;font-size: 30px;color: gray;width: 100%;text-align: center;position: fixed;top: 375px;">` + sub + `</h5><div class="spinner" style="margin-top: 500px;"></div>
<style>@font-face{font-family: 'Product sans'; font-display: auto; font-style: normal; font-weight: 400; src: url(https://fluid.js.org/product-sans.ttf) format('truetype');}.spinner { width: 40px; height: 40px; margin: 100px auto; background-color: gray; border-radius: 100%; -webkit-animation: sk-scaleout 1.0s infinite ease-in-out; animation: sk-scaleout 1.0s infinite ease-in-out; } @-webkit-keyframes sk-scaleout { 0% { -webkit-transform: scale(0) } 100% { -webkit-transform: scale(1.0); opacity: 0; } } @keyframes sk-scaleout { 0% { -webkit-transform: scale(0); transform: scale(0); } 100% { -webkit-transform: scale(1.0); transform: scale(1.0); opacity: 0; } }</style></div>`)
    } else {
        jQuery("body").append(`<div id="dtpsNativeAlert" class="ui-dialog ui-widget ui-widget-content ui-corner-all ui-dialog-buttons" tabindex="-1" aria-hidden="false" style="outline: 0px; z-index: 5000; height: auto; width: 500px; margin-top: 100px; top: 0; margin-left: calc(50% - 250px); display: block;">
<div class="ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix"><span id="ui-id-1" class="ui-dialog-title" role="heading">Power+</span></div>
<form id="new_course_form" class="bootstrap-form form-horizontal ui-dialog-content ui-widget-content" data-turn-into-dialog="{&quot;width&quot;:500,&quot;resizable&quot;:false}" style="width: auto; min-height: 0px; height: auto; display: block;" action="/courses" accept-charset="UTF-8" method="post" aria-expanded="true" scrolltop="0" scrollleft="0">
<h4>` + text + `</h4>
<p>` + sub + `</p>
</form></div>
<div id="dtpsNativeOverlay" class="ui-widget-overlay" style="width: 100%; height: 100%; z-index: 500;"></div>`)
    }
};

//All Canvas & LMS data is sent through dtps.webReq
dtps.requests = {};
dtps.http = {};
dtps.webReq = function (req, url, callback, q) {
    if ((dtps.requests[url] == undefined) || url.includes("|")) {
        //"Canvas" request type for making a GET request to the Canvas API
        if (req == "canvas") {
            dtps.log("Making DTPS web request")
            if (typeof cURLdtps !== "undefined") {
                cURLdtps(url, function (data) {
                    if (callback) callback(data, q);
                    dtps.requests[url] = data;
                });
            } else {
                dtps.http[url] = new XMLHttpRequest();
                dtps.http[url].onreadystatechange = function () {
                    if (this.readyState == 4) {
                        if (this.status == 200) {
                            if (callback) callback(this.responseText, q);
                            dtps.requests[url] = this.responseText;
                            dtps.log("Returning DTPS data")
                        } else {
                            if (callback) callback(JSON.stringify({ error: this.status }), q);
                            dtps.requests[url] = JSON.stringify({ error: this.status });
                            dtps.log("DTPS webReq error" + this.status)
                        }
                    }
                };
                dtps.http[url].open("GET", url, true);
                dtps.http[url].setRequestHeader("Accept", "application/json+canvas-string-ids")
                dtps.http[url].send();
            }
        }
        //"canSUBMIT" request type for submitting assignments using the Canvas API (POST request)
        if (req == "canSUBMIT") {
            console.log("canSUBMIT")
            dtps.http[url] = new XMLHttpRequest();
            dtps.http[url].onreadystatechange = function () {
                if (this.readyState == 4) {
                    if (this.status == 200) {
                        if (callback) callback(this.responseText, q);
                        dtps.requests[url] = this.responseText;
                        dtps.log("Returning DTPS data")
                    } else {
                        if (callback) callback(JSON.stringify({ error: this.status }), q);
                        dtps.requests[url] = JSON.stringify({ error: this.status });
                        dtps.log("DTPS webReq error" + this.status)
                    }
                }
            };
            dtps.http[url].open("POST", url.split("|")[0], true);
            dtps.http[url].setRequestHeader("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3")
            dtps.http[url].setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
            dtps.http[url].setRequestHeader("Cache-Control", "max-age=0")
            dtps.http[url].send(url.split("|")[1]);
        }
    } else {
        if (callback) callback(dtps.requests[url], q);
    }
}

//Calculates the letter grade given the points earned, total points, and grading standard data from the Canvas API
//If using this to calculate letter grades for a class, set total to 1 and earned to the percentage
dtps.computeLetterGrade = function (earned, total, standard) {
    var letter = null
    var percent = earned / total;
    if (standard) {
        for (var i = 0; i < standard.grading_scheme.length; i++) {
            if ((percent >= standard.grading_scheme[i].value) && (letter == null)) letter = standard.grading_scheme[i].name
        }
        return letter;
    } else {
        return String(earned);
    }
}

//Calculates the class grade based on Outcomes (w/ decaying avg support) and other things
dtps.computeClassGrade = function (data) {
    var weights = [];
    var total = 0;
    for (var i = 0; i < data.weights.length; i++) {
        weights.push({ total: 0, earned: 0, weighted: 0, weight: (Number(data.weights[i].weight.match(/\(([^)]+)\)/)[1].replace("%", "")) / 100) })
        if (data.weights[i].assignments) {
            for (var ii = 0; ii < data.weights[i].assignments.length; ii++) {
                var grade = data.stream[data.streamitems.indexOf(data.weights[i].assignments[ii].id)].grade.split("/")
                if (data.stream[data.streamitems.indexOf(data.weights[i].assignments[ii].id)].whatif) grade = data.stream[data.streamitems.indexOf(data.weights[i].assignments[ii].id)].whatif.split("/")
                weights[i].total = weights[i].total + Number(grade[1])
                weights[i].earned = weights[i].earned + Number(grade[0])
            }
        }
        weights[i].weighted = (weights[i].earned / weights[i].total) * weights[i].weight
        total = total + weights[i].weighted
    }
    return total;
}

//Convert default Canvas colors to optimized Power+ filters based on hex values for default colors
//Not all Canvas colors are listed here. Only existing Power+ colors and colors that look bad have optimized filters.  
dtps.filter = function (color) {
    var filter = undefined;
    if (color == "#009606") filter = "filter_3"
    if (color == "#8D9900") filter = "filter_2"
    if ((color == "#D97900") || (color == "#FD5D10")) filter = "filter_1"
    if (color == "#F06291") filter = "filter_6"
    if (color == "#FF2717") filter = "filter_0"
    if (color == "#BD3C14") filter = "filter_7"
    if (color == "#8F3E97") filter = "filter_5"
    return filter;
}

//Starts Power+
dtps.init = function () {
    dtps.log("Starting DTPS " + dtps.readableVer + "...");
    dtps.webReq("canvas", "/api/v1/users/self", function (user) {
        fluidThemes = [["rainbow"]];
        dtps.user = JSON.parse(user);
        //TEMPORARY
        //jQuery("body").addClass("sudo");

        sudoers = ["669", "672"]
        if (sudoers.includes(dtps.user.id)) { jQuery("body").addClass("sudo"); dtps.log("Sudo mode enabled"); }
        og = ["669"]
        if (og.includes(dtps.user.id)) { jQuery("body").addClass("og"); }
        contributors = ["669"]
        if (contributors.includes(dtps.user.id)) { jQuery("body").addClass("contributor"); }
        if (dtps.user.id == "669") { jQuery("body").addClass("dev"); dtps.log("Dev mode enabled"); }
        if ((dtps.trackSuffix !== "") && (dtps.trackSuffix !== "GM")) jQuery("body").addClass("prerelease");
        if (sudoers.includes(dtps.user.id)) jQuery("body").addClass("prerelease");
        $ = jQuery;
        var min = new Date().getMinutes();
        if (String(min).length < 2) min = Number("0" + String(min))
        var time = Number(String(new Date().getHours()) + String(min))
        dtps.period = null;
        if ((new Date().getDay() > 0) && (new Date().getDay() < 6)) {
            //Weekday
            if (new Date().getDay() == 3) {
                //Wednesday
                if ((time > 0929) && (time < 1018)) dtps.period = 1;
                if ((time > 1019) && (time < 1108)) dtps.period = 2;
                if ((time > 1109) && (time < 1158)) dtps.period = 3;
                if ((time > 1229) && (time < 1318)) dtps.period = 4;
                if ((time > 1319) && (time < 1408)) dtps.period = 5;
                if ((time > 1409) && (time < 1458)) dtps.period = 6;
            } else {
                if (new Date().getDay() !== 4) {
                    //M, TU, F
                    if ((time > 0917) && (time < 1013)) dtps.period = 1;
                    if ((time > 1022) && (time < 1118)) dtps.period = 2;
                    if ((time > 1119) && (time < 1215)) dtps.period = 3;
                    if ((time > 1246) && (time < 1342)) dtps.period = 4;
                    if ((time > 1343) && (time < 1439)) dtps.period = 5;
                    if ((time > 1440) && (time < 1536)) dtps.period = 6;
                }
            }
        }
        if (dtps.period && (String(localStorage.dtpsSchedule).startsWith("{"))) { dtps.currentClass = JSON.parse(localStorage.dtpsSchedule)[dtps.period]; }
        jQuery.getScript('https://dtps.js.org/fluid.js', function () {
            fluid.init();
            document.addEventListener("fluidTheme", function () {
                var next = window.getComputedStyle(document.getElementsByClassName("background")[0]).getPropertyValue("--grad")
                if (dtps.selectedClass !== "dash") next = "linear-gradient(to bottom right, " + window.getComputedStyle(document.getElementsByClassName("background")[0]).getPropertyValue($("body").hasClass("midnight") ? "--dark" : "--light") + ", " + ($("body").hasClass("dark") ? "var(--background, #252525)" : "var(--background, white)") + ")"
                if (dtps.selectedClass !== "dash") $('body').removeClass('dashboard');
                $(".background").css("background", next)
                dtps.chroma();
            })
        });
        jQuery.getScript("https://unpkg.com/sweetalert/dist/sweetalert.min.js")
        jQuery.getScript("https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.22.2/moment.min.js", function () {
            jQuery.getScript("https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/3.9.0/fullcalendar.min.js")
        })
        jQuery.getScript('https://cdnjs.cloudflare.com/ajax/libs/fuse.js/3.3.0/fuse.min.js');
        jQuery.getScript("https://www.googletagmanager.com/gtag/js?id=UA-105685403-3", function () {
            window.dataLayer = window.dataLayer || [];
            function gtag() { dataLayer.push(arguments); }
            var configTmp = {
                'page_title': 'portal',
                'page_path': '/portal',
                'anonymize_ip': true
            }
            if (dtps.trackSuffix !== "") {
                configTmp = {
                    //'page_title' : 'prerelease',
                    //'page_path': '/prerelease',
                    'page_title': 'canvasdp',
                    'page_path': '/canvasdp',
                    'anonymize_ip': true
                }
            }
            gtag('config', 'UA-105685403-3', configTmp);

        });
        dtps.shouldRender = true;
        dtps.showChangelog = false;
        dtps.first = false;
        if (window.localStorage.dtpsInstalled !== "true") {
            dtps.shouldRender = false;
            dtps.first = true;
        }
        if (Number(window.localStorage.dtps) < dtps.ver) {
            dtps.log("New release")
            dtps.showChangelog = true;
            if (dtps.shouldRender) dtps.nativeAlert("Loading...", "Updating to Power+ " + dtps.readableVer, true);
        }
        if (dtps.shouldRender && !dtps.showChangelog) {
            dtps.nativeAlert("Loading...", undefined, true);
        }
        jQuery.getScript("https://cdn.jottocraft.com/tinycolor.js", function () {
            dtps.webReq("canvas", "/api/v1/users/self/colors", function (colorsResp) {
                dtps.webReq("canvas", "/api/v1/users/self/dashboard_positions", function (dashboardResp) {
                    dtps.webReq("canvas", "/api/v1/courses?include[]=total_scores&include[]=public_description&include[]=favorites&include[]=total_students&include[]=account&include[]=teachers&include[]=course_image", function (resp) {
                        dtps.classes = [];
                        dtps.classesReady = 0;
                        dtps.colorCSS = [];
                        dtps.gpa = null;
                        var colors = JSON.parse(colorsResp);
                        var dashboard = JSON.parse(dashboardResp);
                        var data = JSON.parse(resp);
                        dtps.gradeHTML = [];
                        var gpa = [];
                        data.sort(function (a, b) {
                            var keyA = dashboard.dashboard_positions["course_" + a.id],
                                keyB = dashboard.dashboard_positions["course_" + b.id];
                            if (keyA < keyB) return -1;
                            if (keyA > keyB) return 1;
                            return 0;
                        });
                        for (var i = 0; i < data.length; i++) {
                            var name = data[i].name;
                            var subject = null;
                            var icon = null;
                            if (name.includes("Physics")) { var subject = "Physics"; var icon = "experiment"; }; if (name.includes("English")) { var subject = "English"; var icon = "library_books" }; if (name.includes("Physical Education")) { var subject = "PE"; var icon = "directions_run"; };
                            if (name.includes("Prototyping")) { var subject = "Prototyping"; var icon = "drive_file_rename_outline"; }; if (name.includes("Algebra")) { var subject = "Algebra"; }; if (name.includes("Algebra 2")) { var subject = "Algebra 2"; };
                            if (name.includes("Spanish")) { var subject = "Spanish" }; if (name.includes("@") || name.includes("dtech")) { var subject = "@d.tech" }; if (name.includes("Environmental")) { var subject = "Environmental Science" };
                            if (name.includes("Robotics")) { var subject = "Robotics" }; if (name.includes("Chemistry")) { var subject = "Chemistry" }; if (name.includes("Biology")) { var subject = "Biology" }; if (name.includes("Engineering")) { var subject = "Engineering" }; if (name.includes("Geometry")) { var subject = "Geometry" };
                            if (name.includes("Photography")) { var subject = "Photography" }; if (name.includes("World History")) { var subject = "World History" }; if (name.includes("U.S. History")) { var subject = "US History" };
                            if (name.includes("Calculus")) { var subject = "Calculus" }; if (name.toUpperCase().includes("CALCULUS") && name.toUpperCase().includes("PRE")) { var subject = "Precalculus" }; if (name.includes("Statistics")) { var subject = "Advanced Statistics" };
                            if (name.includes("Model United Nations")) { var subject = "Model UN" }; if (name.includes("Government")) { var subject = "Government" }; if (name.includes("Economics")) { var subject = "Economics" };
                            if (subject == null) var subject = name;
                            var filter = "filter_" + colors.custom_colors["course_" + data[i].id].toLowerCase().replace("#", "");
                            //Suport Power+ v1.x.x Colors by detecting if the user selects a native canvas color
                            if (dtps.filter(colors.custom_colors["course_" + data[i].id])) filter = dtps.filter(colors.custom_colors["course_" + data[i].id]);
                            dtps.classes.push({
                                name: name,
                                subject: subject,
                                icon: icon,
                                col: filter,
                                norm: colors.custom_colors["course_" + data[i].id],
                                light: tinycolor(colors.custom_colors["course_" + data[i].id]).brighten(20).toHexString(),
                                dark: tinycolor(colors.custom_colors["course_" + data[i].id]).darken(20).toHexString(),
                                isBright: (dtps.filter(colors.custom_colors["course_" + data[i].id]) ? false : !tinycolor(colors.custom_colors["course_" + data[i].id]).isDark()),
                                id: data[i].id,
                                grade: (data[i].enrollments[0].computed_current_score ? data[i].enrollments[0].computed_current_score : "--"),
                                letter: (data[i].enrollments[0].computed_current_grade ? data[i].enrollments[0].computed_current_grade : "--"),
                                num: i,
				image: data[i].image_download_url,
				teacher: {
					name: data[i].teachers[0].display_name,
					prof: data[i].teachers[0].avatar_image_url
				}
                            })
                            if (!dtps.filter(colors.custom_colors["course_" + data[i].id])) {
                                dtps.colorCSS.push(`\n.` + dtps.classes[i].col + ` {
	--light: ` + dtps.classes[i].light + `;
	--norm: ` + dtps.classes[i].norm + `;
 	--dark: ` + dtps.classes[i].dark + `;
  --filterText: ` + (dtps.classes[i].isBright ? dtps.classes[i].dark : "white") + `;
	--grad: linear-gradient(to bottom right, ` + dtps.classes[i].light + `, ` + dtps.classes[i].dark + `);;
}`);
                            }
                            dtps.classStream(i, true);
                            if (data[i].enrollments[0].computed_current_score) {
                                dtps.gradeHTML.push(`<div style="cursor: auto; background-color: var(--norm);" class="progressBar big ` + filter + `"><div style="color: var(--dark);" class="progressLabel">` + subject + `</div><div class="progress" style="background-color: var(--light); width: calc(` + data[i].enrollments[0].computed_current_score + `% - 300px);"></div></div>`)
                            }
                            if (data[i].enrollments[0].computed_current_grade) {
                                if (data[i].enrollments[0].computed_current_grade.includes("A")) gpa.push(4)
                                if (data[i].enrollments[0].computed_current_grade.includes("B")) gpa.push(3)
                                if (data[i].enrollments[0].computed_current_grade.includes("C")) gpa.push(2)
                                if (data[i].enrollments[0].computed_current_grade.includes("DV")) gpa.push(0)
                            }
                            if (dtps.currentClass == data[i].id) {
                                dtps.selectedClass = i;
                                dtps.selectedContent = "stream";
                                dtps.chroma();
                                dtps.classStream(i);
                            }
                        }
                        dtps.log("Grades loaded: ", dtps.classes);
                        var total = 0;
                        for (var i = 0; i < gpa.length; i++) {
                            total += gpa[i];
                        }
                        dtps.gpa = total / gpa.length;
                        if (dtps.shouldRender) dtps.render();
                        if (dtps.first) dtps.firstrun();
                    });
                });
            });
        });
    });

}

//Checks if all classes have loaded to determine if the dashboard is still loading
dtps.readyInterval = "n/a";
dtps.checkReady = function (num) {
    dtps.log(num + " reporting as READY total of " + dtps.classesReady);
    if ((dtps.selectedClass == "dash") && (dtps.classesReady == dtps.classes.length)) {
        dtps.log("All classes ready, loading master stream");
        dtps.masterStream(true);
    } else {
        if ((dtps.selectedClass == "dash") && (dtps.classesReady < dtps.classes.length)) {
            dtps.masterStream();
        }
    }
}

//Loads the list of pages for a class
dtps.loadPages = function (num) {
    if ((dtps.selectedClass == num) && (dtps.selectedContent == "pages")) {
        jQuery(".sidebar").html(`
<div class="classDivider"></div>
<div class="spinner"></div>
`);
        jQuery(".classContent").html("");
    }
    dtps.webReq("canvas", "/api/v1/courses/" + dtps.classes[num].id + "/pages", function (resp) {
        var data = JSON.parse(resp);
        if (data.error) {
            jQuery(".sidebar").html(`<div onclick="dtps.selectedContent = 'stream'; dtps.chroma(); dtps.classStream(dtps.selectedClass);" class="class back">
    <div class="name">Classes</div>
    <div class="grade"><i class="material-icons">keyboard_arrow_left</i></div>
    </div>
    <div class="classDivider"></div>
  <h5 style="text-align: center; font-weight: bold;">No pages found</h5><p style="text-align: center;">This class doesn't have any pages</p>`)
        } else {
            dtps.classes[num].pages = [];
            dtps.classes[num].pagelist = [];
            for (var i = 0; i < data.length; i++) {
                dtps.classes[num].pages.push({
                    id: data[i].page_id,
                    title: data[i].title,
                    content: "",
                    num: i
                });
                dtps.classes[num].pagelist.push(`
      <div onclick="dtps.selectedPage = ` + data[i].page_id + `" class="class ` + data[i].page_id + `">
      <div class="name">` + data[i].title + `</div>
      <div class="grade"><i class="material-icons">notes</i></div>
      </div>
      `);
            }
            if ((dtps.selectedClass == num) && (dtps.selectedContent == "pages")) {
                jQuery(".sidebar").html(`<div onclick="dtps.selectedContent = 'stream'; dtps.chroma(); dtps.classStream(dtps.selectedClass);" class="class back">
      <div class="name">Classes</div>
      <div class="grade"><i class="material-icons">keyboard_arrow_left</i></div>
      </div>
      <div class="classDivider"></div>
    ` + dtps.classes[num].pagelist.join(""))
            }

            $(".class").click(function (event) {
                if (!$(this).hasClass("back")) {
                    $(this).siblings().removeClass("active")
                    $(this).addClass("active")
                    dtps.getPage(dtps.classes[dtps.selectedClass].id, dtps.selectedPage);
                }
            });
        }
    });
}

//12 hour time formatter from stackoverflow
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

//Fetches assignment data for a class
dtps.classStream = function (num, renderOv) {
    dtps.log("Fetching assignments for class " + num)
    if (!renderOv) dtps.showClasses();
    if ((dtps.selectedClass == num) && (dtps.selectedContent == "stream")) {
        if (!renderOv) {
            jQuery(".classContent").html(`
    <div class="spinner"></div>
  `);
        }
    }
    var allData = [];
    var total = null;
    dtps.webReq("canvas", "/api/v1/courses/" + dtps.classes[num].id + "/grading_standards", function (respp) {
        dtps.webReq("canvas", "/api/v1/courses/" + dtps.classes[num].id + "/assignment_groups?include[]=assignments&include[]=submissions&include[]=submission", function (resp) {
            var data = JSON.parse(resp);
            var standards = JSON.parse(respp);
            dtps.classes[num].stream = [];
            dtps.classes[num].rawStream = data;
            dtps.classes[num].streamitems = [];
            dtps.classes[num].weights = [];
            dtps.classes[num].standards = standards;
            for (var i = 0; i < data.length; i++) {
                dtps.classes[num].weights.push({ weight: data[i].name + " (" + ((data.length == 1) && (data[i].group_weight == 0) ? 100 : data[i].group_weight) + "%)", assignments: [], possiblePoints: 0, earnedPoints: 0, icon: `<i class="material-icons">category</i> ` });
                if (dtps.classes[num].weights[i].weight.toUpperCase().includes("SUCCESS") || dtps.classes[num].weights[i].weight.includes("SS")) { dtps.classes[num].weights[i].icon = `<i class="material-icons">star_border</i> `; dtps.classes[num].weights[i].weight = "Success Skills (" + dtps.classes[num].weights[i].weight.match(/\(([^)]+)\)/)[1] + ")"; }
                if (dtps.classes[num].weights[i].weight.toUpperCase().includes("COMPREHENSION") || dtps.classes[num].weights[i].weight.includes("CC")) { dtps.classes[num].weights[i].icon = `<i class="material-icons">done</i> `; dtps.classes[num].weights[i].weight = "Comprehension Checks (" + dtps.classes[num].weights[i].weight.match(/\(([^)]+)\)/)[1] + ")"; }
                if (dtps.classes[num].weights[i].weight.toUpperCase().includes("PERFORMANCE") || dtps.classes[num].weights[i].weight.includes("PT") || dtps.classes[num].weights[i].weight.includes("UE") || dtps.classes[num].weights[i].weight.includes("Exam")) { dtps.classes[num].weights[i].icon = `<i class="material-icons">assessment</i> `; dtps.classes[num].weights[i].weight = "Performance Tasks (" + dtps.classes[num].weights[i].weight.match(/\(([^)]+)\)/)[1] + ")"; }
                for (var ii = 0; ii < data[i].assignments.length; ii++) {
                    dtps.classes[num].stream.push({
                        id: data[i].assignments[ii].id,
                        title: data[i].assignments[ii].name,
                        due: (data[i].assignments[ii].due_at ? new Date(data[i].assignments[ii].due_at).toDateString().slice(0, -5) + ", " + dtps.ampm(new Date(data[i].assignments[ii].due_at)) : ""),
                        dueDate: data[i].assignments[ii].due_at,
                        url: data[i].assignments[ii].html_url,
                        types: data[i].assignments[ii].submission_types,
                        col: dtps.classes[num].col,
                        turnedIn: (data[i].assignments[ii].submission !== undefined ? (data[i].assignments[ii].submission.submission_type !== null) : false),
                        hasSubmissions: data[i].assignments[ii].has_submitted_submissions,
                        class: num,
                        subject: dtps.classes[num].subject,
                        streamItem: dtps.classes[num].stream.length - 1,
                        weight: dtps.classes[num].weights[i].weight.replace(/ *\([^)]*\) */g, ""),
                        weightIcon: dtps.classes[num].weights[i].icon,
                        uniqueWeight: data.length > 1,
                        published: new Date(data[i].assignments[ii].created_at).toDateString(),
                        outcome: (data[i].assignments[ii].rubric ? data[i].assignments[ii].rubric[0].description : undefined),
                        outcomeID: (data[i].assignments[ii].rubric ? data[i].assignments[ii].rubric[0].outcome_id : undefined),
                        locksAt: data[i].assignments[ii].lock_at,
                        unlocksAt: data[i].assignments[ii].unlock_at,
                        locked: data[i].assignments[ii].locked_for_user,
                        lockedReason: data[i].assignments[ii].lock_explanation,
                        submissions: data[i].assignments[ii].submission.preview_url,
                        body: data[i].assignments[ii].description,
                        worth: data[i].assignments[ii].points_possible
                    });
                    dtps.classes[num].streamitems.push(data[i].assignments[ii].id);
                    if ((data[i].assignments[ii].submission.score !== null) && (data[i].assignments[ii].submission.score !== undefined)) {
                        dtps.classes[num].stream[dtps.classes[num].stream.length - 1].grade = data[i].assignments[ii].submission.score + "/" + data[i].assignments[ii].points_possible;
                        dtps.classes[num].stream[dtps.classes[num].stream.length - 1].status = data[i].assignments[ii].submission.workflow_state;
                        dtps.classes[num].stream[dtps.classes[num].stream.length - 1].late = data[i].assignments[ii].submission.late;
                        dtps.classes[num].stream[dtps.classes[num].stream.length - 1].letter = (data[i].assignments[ii].submission.grade.match(/[a-z]/i) ? data[i].assignments[ii].submission.grade : dtps.computeLetterGrade(data[i].assignments[ii].submission.score, data[i].assignments[ii].points_possible, standards[0]));
                        //Only treat assignment as graded in the gradebook if the assignment status says the grades are published. Scores are still shown with a pending review icon. This is to match native Canvas behavior.
                        if (data[i].assignments[ii].submission.workflow_state == "graded") {
                            dtps.classes[num].weights[i].possiblePoints = dtps.classes[num].weights[i].possiblePoints + data[i].assignments[ii].points_possible;
                            dtps.classes[num].weights[i].earnedPoints = dtps.classes[num].weights[i].earnedPoints + data[i].assignments[ii].submission.score;
                            dtps.classes[num].weights[i].assignments.push({ id: data[i].assignments[ii].id, disp: data[i].assignments[ii].name + ": " + data[i].assignments[ii].submission.score + "/" + data[i].assignments[ii].points_possible, percentage: (data[i].assignments[ii].submission.score / data[i].assignments[ii].points_possible).toFixed(2), possible: data[i].assignments[ii].points_possible, earned: data[i].assignments[ii].submission.score });
                        }
                    }
                }
                if (dtps.classes[num].weights[i].possiblePoints !== 0) { dtps.classes[num].weights[i].grade = ((dtps.classes[num].weights[i].earnedPoints / dtps.classes[num].weights[i].possiblePoints) * 100).toFixed(2) + "%" } else { dtps.classes[num].weights[i].grade = "" }
            }
            if ((dtps.selectedClass == num) && (dtps.selectedContent == "stream")) { if (!renderOv) { jQuery(".classContent").html(dtps.renderStream(dtps.classes[num].stream)); } }
            if (dtps.selectedClass == num) { if (dtps.classes[dtps.selectedClass].weights.length) { $(".btns .btn.grades").show(); } }
            dtps.classesReady++;
            dtps.checkReady(num);
        });
    });
}

//Fetches module stream for a class
dtps.moduleStream = function(num) {
	var moduleRootHTML = `
<div class="acrylicMaterial" style="position: absolute;display:  inline-block;border-radius: 20px;margin: 82px;">
<img src="` + dtps.classes[dtps.selectedClass].teacher.prof + `" style="width: 40px; height: 40px; border-radius: 50%;vertical-align: middle;"> <div style="font-size: 16px;display: inline-block;vertical-align: middle;margin: 0px 10px;">` + dtps.classes[dtps.selectedClass].teacher.name + `</div></div>
<div style="text-align: right;">
<br />
<div class="btns row small acrylicMaterial assignmentPicker" style="margin: 63px 80px 20px 0px !important;">
  <button class="btn" onclick="dtps.classStream(dtps.selectedClass);"><i class="material-icons">assignment</i>Assignments</button>
  <button class="btn active" onclick="dtps.moduleStream(dtps.selectedClass);"><i class="material-icons">view_module</i>Modules</button>
</div><script>fluid.init();</script>
</div>
</div>`
	jQuery(".classContent").html(moduleRootHTML + `<div class="spinner"></div>`);
	streamData = [];
	dtps.webReq("canvas", "/api/v1/courses/" + dtps.classes[num].id + "/modules?include[]=items&include[]=content_details", function (resp) {
		var data = JSON.parse(resp);
		for (var i = 0; i < data.length; i++) {
			var subsetData = [];
			for (var ii = 0; ii < data[i].items.length; ii++) {
				var icon = "star_border";
				if (data[i].items[ii].type == "ExternalTool") icon = "insert_link";
				if (data[i].items[ii].type == "ExternalUrl") icon = "open_in_new";
				if (data[i].items[ii].type == "Assignment") icon = "assignment";
				if (data[i].items[ii].type == "Page") icon = "insert_drive_file";
				if (data[i].items[ii].type == "Discussion") icon = "chat";
				if (data[i].items[ii].type == "Quiz") icon = "assessment";
				if (data[i].items[ii].type == "SubHeader") icon = "format_size";
				var open = `window.open('` + data[i].items[ii].html_url + `')`;
				if (data[i].items[ii].type == "ExternalTool") open = `$('#moduleIFrame').attr('src', ''); fluid.cards('.card.moduleURL'); $.getJSON('` + data[i].items[ii].url + `', function (data) { $('#moduleIFrame').attr('src', data.url); });`
				if (data[i].items[ii].type == "Assignment") open = `dtps.assignment(` + data[i].items[ii].content_id + `, dtps.selectedClass);`
				subsetData.push(`<div onclick="` + open + `" style="background-color:var(--dark);padding:20px;font-size:17px;border-radius:15px;margin:15px 0; cursor: pointer;">
<i class="material-icons" style="vertical-align: middle; margin-right: 10px;">` + icon + `</i>` + data[i].items[ii].title + `</div>`);
			}
			streamData.push(`<div class="card">
<h4 style="margin-top: 5px;">` + data[i].name + `</h4>
` + subsetData.join("") + `
</div>`)
		}
		jQuery(".classContent").html(moduleRootHTML + streamData.join(""));
		
	});
}

//Asks the user when they have each class to load the class automatically
dtps.schedule = function () {
    var schedule = {}
    if (confirm("Type in which period you have each class as a number (1-6). If the class is from a different semester or you don't have that class for a class period, leave the box blank")) {
        for (var i = 0; i < dtps.classes.length; i++) {
            var num = prompt("Which class period do you have '" + dtps.classes[i].name + "'? (Number 1-6 or leave blank)");
            if ((Number(num) > 0) && (Number(num) < 7)) schedule[num] = dtps.classes[i].id;
        }
        localStorage.setItem("dtpsSchedule", JSON.stringify(schedule));
        alert("Your schedule has been saved. When loading Power+, Power+ will try to load the class that you are in instead of the dashboard, if you are visiting during school hours.")
    }
}

//Converts a Power+ stream array into HTML for displaying the assignment list
dtps.renderStream = function (stream, searchRes) {
    var streamlist = [];
    for (var i = 0; i < stream.length; i++) {
        streamlist.push(`
        <div onclick="` + (stream[i].google ? `window.open('` + stream[i].url + `')` : `dtps.assignment(` + stream[i].id + `, ` + stream[i].class + `)`) + `" class="card graded assignment ` + stream[i].col + `">
        ` + (stream[i].turnedIn && (stream[i].status !== "unsubmitted") ? `<i title="Assignment submitted" class="material-icons floatingIcon" style="color: #0bb75b;">assignment_turned_in</i>` : ``) + `
        ` + (stream[i].status == "unsubmitted" ? `<i title="Assignment unsubmitted" class="material-icons floatingIcon" style="color: #b3b70b;">warning</i>` : ``) + `
        ` + (stream[i].late ? `<i title="Assignment is late" class="material-icons floatingIcon" style="color: #c44848;">assignment_late</i>` : ``) + `
        ` + (stream[i].locked ? `<i title="Assignment submissions are locked" class="material-icons floatingIcon" style="font-family: 'Material Icons Extended'; color: var(--secText, gray);">lock_outline</i>` : ``) + `
        ` + (stream[i].status == "pending_review" ? `<i title="Grade is unpublished and is pending review" class="material-icons floatingIcon" style="color: #b3b70b;">rate_review</i>` : ``) + `
        <div class="points">
        <div class="earned numbers">` + (stream[i].letter ? stream[i].grade.split("/")[0] : "") + `</div>
	<div class="earned letters">` + stream[i].letter + `</div>
        ` + (stream[i].grade ? (stream[i].grade.split("/")[1] !== undefined ? `<div class="total possible">/` + stream[i].grade.split("/")[1] + `</div>` : "") : "") + `
	` + (stream[i].grade ? (stream[i].grade.split("/")[1] !== undefined ? `<div class="total percentage">` + ((Number(stream[i].grade.split("/")[0]) / Number(stream[i].grade.split("/")[1])) * 100).toFixed(2) + `%</div>` : "") : "") + `
        </div>
        <h4>` + stream[i].title + `</h4>
      	<h5>
         ` + (stream[i].due ? `<div class="infoChip"><i style="margin-top: -4px;" class="material-icons">alarm</i> Due ` + stream[i].due + `</div>` : "") + ` 
        ` + ((stream[i].weight !== undefined) && stream[i].uniqueWeight ? `<div class="infoChip weighted">` + stream[i].weightIcon + stream[i].weight.replace("Comprehension Checks", "CC").replace("Success Skills", "SS").replace("Performance Tasks", "PT") + `</div>` : "") + `
        ` + (stream[i].outcome !== undefined ? `<div class="infoChip weighted"><i class="material-icons">adjust</i>` + stream[i].outcome + `</div>` : "") + `
        </h5>
        </div>
      `);
    }
    if (typeof Fuse !== "undefined") {
        if (searchRes == undefined) {
            dtps.latestStream = stream;
            dtps.fuse = new Fuse(stream, {
                shouldSort: true,
                threshold: 0.6,
                keys: ["title", "id", "due", "subject"]
            });
            searchRes = "";
        }
    }
    return ((streamlist.length == 0) && (dtps.selectedClass !== "dash")) ?
    (searchRes !== "" ? `<div style="text-align: right;"><i class="inputIcon material-icons">search</i><input value="` + searchRes + `" onchange="dtps.search()" class="search inputIcon shadow" placeholder="Search assignments" type="search" /></div>` : "") + `<div style="cursor: auto;" class="card assignment"><h4>No ` + (searchRes == "" ? "assignments" : "results found") + `</h4><p>` + (searchRes == "" ? "There aren't any assignments in this class yet" : "There aren't any search results") + `</p></div>`
    : ((typeof Fuse !== "undefined" ? `

` + ((dtps.selectedClass !== "dash") && (searchRes == "") ? `<div class="acrylicMaterial" style="position: absolute;display:  inline-block;border-radius: 20px;margin: 82px;">
<img src="` + dtps.classes[dtps.selectedClass].teacher.prof + `" style="width: 40px; height: 40px; border-radius: 50%;vertical-align: middle;"> <div style="font-size: 16px;display: inline-block;vertical-align: middle;margin: 0px 10px;">` + dtps.classes[dtps.selectedClass].teacher.name + `</div></div>` : "" ) + `

<div style="text-align: right;"><i class="inputIcon material-icons">search</i><input value="` + searchRes + `" onchange="dtps.search()" class="search inputIcon shadow" placeholder="Search assignments" type="search" />
` + ((dtps.selectedClass !== "dash") && (searchRes == "") ? `<br />
<div class="btns row small acrylicMaterial assignmentPicker" style="margin: 20px 80px 20px 0px !important;">
  <button class="btn active" onclick="dtps.classStream(dtps.selectedClass);"><i class="material-icons">assignment</i>Assignments</button>
  <button class="btn" onclick="dtps.moduleStream(dtps.selectedClass);"><i class="material-icons">view_module</i>Modules</button>
</div><script>fluid.init();</script>` : "") + `
</div>` : "") + streamlist.join(""));
    //return streamlist.join("");
}

//Searches the assignment stream for a keyword using Fuse.js
dtps.search = function () {
    if (dtps.selectedClass == "dash") {
        if ($("input.search").val() == "") {
            jQuery(".classContent .stream").html(dtps.renderStream(dtps.latestStream, ""))
        } else {
            jQuery(".classContent .stream").html(dtps.renderStream(dtps.fuse.search($("input.search").val()), $("input.search").val()))
        }
        $(".card.assignment").addClass("color");
    } else {
        if ($("input.search").val() == "") {
            jQuery(".classContent").html(dtps.renderStream(dtps.latestStream, ""))
        } else {
            jQuery(".classContent").html(dtps.renderStream(dtps.fuse.search($("input.search").val()), $("input.search").val()))
        }
    }
}

//Renders the Power+ master stream / dashboard showing an overview of all classes
dtps.masterStream = function (doneLoading) {
    dtps.log("RENDERING DASHBOARD")
    dtps.showClasses();
    if ((dtps.selectedClass == "dash") && (dtps.masterContent == "assignments")) {
        jQuery(".classContent").html(`
    <div class="spinner"></div>
  `);
    }
    var buffer = [];
    if (dtps.classes) {
        for (var i = 0; i < dtps.classes.length; i++) {
            if (dtps.classes[i].stream) {
                buffer = buffer.concat(dtps.classes[i].stream)
            }
        }
    }
    var loadingDom = "";
    if (!doneLoading) {
        loadingDom = `<div class="spinner"></div>`;
    } else {
        dtps.logGrades();
    }
    if ((dtps.selectedClass == "dash") && (dtps.masterContent == "assignments")) {
        jQuery(".classContent").html(`
<div class="dash cal" style="width: 40%;display: inline-block; vertical-align: top;">
` + ($.fullCalendar !== undefined ? `<div id="calendar" class="card" style="padding: 20px;"></div>` : ``) + `
<div class="announcements"></div>
</div>
<div style="width: 59%; display: inline-block;" class="dash stream">
` + loadingDom + `
<div class="assignmentStream"></div>
</div>
`)
    }

    dtps.announcements();
    jQuery(".classContent .dash .assignmentStream").html(dtps.renderStream(buffer.sort(function (a, b) {
        var keyA = new Date(a.dueDate),
            keyB = new Date(b.dueDate);
	if (a.dueDate == null) keyA = 999999999999999999;
	if (b.dueDate == null) keyB = 999999999999999999;
        // Compare the 2 dates
        if (keyA > keyB) return 1;
        if (keyA < keyB) return -1;
        return 0;
    })));
    $(".card.assignment").addClass("color");
    dtps.calendar(doneLoading);
}

//Loads Google APIs for Classroom integration
dtps.gapis = function () {
    //these 2 lines are temporary. remove them when uncommenting the rest of dtps.gapis
    jQuery(".googleClassroom").hide();
    jQuery(".googleSetup").show();
	/*jQuery.getScript("https://apis.google.com/js/api.js", function() {
		gapi.load('client:auth2', function() {
gapi.client.init({
          apiKey: 'AIzaSyB3l_RWC3UMgNDAjZ4wD_HD2NyrneL9H9g',
          clientId: '117676227556-lrt444o80hgrli1nlcl4ij6cm2dbop8v.apps.googleusercontent.com',
          discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/classroom/v1/rest"],
          scope: "https://www.googleapis.com/auth/classroom.courses.readonly https://www.googleapis.com/auth/classroom.coursework.me.readonly"
        }).then(function () {
          gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
          updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        }, function(error) {
          dtps.log(JSON.stringify(error));
	console.error(error);
        });
		function updateSigninStatus(isSignedIn) {
        if (isSignedIn) {
          jQuery(".googleClassroom").show();
	  jQuery(".googleSetup").hide();
	  if (dtps.googleSetup !== undefined) {
	  window.alert("Google account linked. You have to sign in to Canvas again to finish setup.")
	  window.location.reload();
	  } else {
          dtps.googleAuth();
	  }
        } else {
         jQuery(".googleClassroom").hide();
	 jQuery(".googleSetup").show();
        }
      }
		});
});*/
}

//Loads a page
dtps.getPage = function (classID, id) {
    if (id == undefined) var id = dtps.selectedPage;
    if ((dtps.classes[dtps.selectedClass].id == classID) && (dtps.selectedContent == "pages")) {
        jQuery(".classContent").html(`<div class="spinner"></div>`);
    }
    var spinnerTmp = true;
    dtps.webReq("canvas", "/api/v1/courses/" + classID + "/pages/" + id, function (resp) {
        var data = JSON.parse(resp);
        if ((dtps.classes[dtps.selectedClass].id == classID) && (dtps.selectedContent == "pages")) {
            $(".cacaoBar .tab.active span").html(data.title)
            jQuery(".classContent").html(`
        <div class="card">
       <h4>` + data.title + `</h4>
        ` + data.body + `
        </div>
      `);
        }
    });
}

//Loads the gradebook for a class. The type paramater specifies if it should load the mastery gradebook or not
dtps.gradebook = function (num, type) {
    dtps.showClasses();
    var underConstruction = false;
    if (underConstruction) {
        jQuery(".classContent").html(`
<div class="card">
<h4>Under Construction</h4>
<p>d.tech is switching to a new objective mastery based grading. Because of these changes, the Power+ gradebook is being completely rewritten. I want to make sure the gradebook is 100% accurate before releasing it, so it may take some time before it is released. For the latest features, try the Power+ dev release channel.</p>
</div>
`)
    } else {
        if (dtps.classes[num].weights) {
            if (dtps.classes[num].weights.length) {
                $(".btns .btn.grades").show();
                var weightsTmp = [];
                var weightOverview = [];
                var revisable = [];
                var DVs = 0;
                for (var i = 0; i < dtps.classes[num].weights.length; i++) {
                    var assignTmp = [];
                    for (var ii = 0; ii < dtps.classes[num].weights[i].assignments.length; ii++) {
                        assignTmp.push(`<div onclick="dtps.assignment(` + dtps.classes[num].weights[i].assignments[ii].id + `, ` + num + `)" class="progressBar">
<div class="progressLabel">` + dtps.classes[num].weights[i].assignments[ii].disp + `</div><div style="width: calc(` + (dtps.classes[num].weights[i].assignments[ii].percentage * 100) + `% - 280px);" class="progress"></div></div>`)
                        //var reviseBy = (((Number(dtps.classes[num].weights[i].weight.match(/\(([^)]+)\)/)[1].slice(0, -1)) / 100) * (dtps.classes[num].weights[i].assignments[ii].percentage * ((dtps.classes[num].weights[i].assignments[ii].possible - dtps.classes[num].weights[i].assignments[ii].earned) / dtps.classes[num].weights[i].possiblePoints))) * 100).toFixed(2)
                        var reviseBy = (((Number(dtps.classes[num].weights[i].weight.match(/\(([^)]+)\)/)[1].slice(0, -1)) / 100) * ((dtps.classes[num].weights[i].assignments[ii].possible - dtps.classes[num].weights[i].assignments[ii].earned) / dtps.classes[num].weights[i].possiblePoints)) * 100).toFixed(2)
                        if (reviseBy > 1) { revisable.push({ dom: `<p>Revising ` + dtps.classes[num].weights[i].assignments[ii].disp + ` could boost your grade by up to ` + reviseBy + `%</p>`, rv: Number(reviseBy) }) }
                        revisable.sort(function (a, b) {
                            var keyA = a.rv,
                                keyB = b.rv;
                            if (keyA < keyB) return -1;
                            if (keyA > keyB) return 1;
                            return 0;
                        });
                        if (!((dtps.classes[num].weights[i].weight.toUpperCase().includes("SUCCESS")) || (dtps.classes[num].weights[i].weight.toUpperCase().includes("SS")))) {
                            var parts = dtps.classes[num].weights[i].assignments[ii].disp.split(":");
                            if (parts[parts.length - 1].includes("DV")) DVs++;
                            if (parts[parts.length - 1].includes("M")) DVs++;
                            if (parts[parts.length - 1].includes("INC")) DVs++;
                        }
                    }
                    weightsTmp.push(`<div style="display: none;" class="weight ` + i + `"><h4>` + dtps.classes[num].weights[i].weight + `<div style="color: var(--secText, gray); text-align: right; font-size: 24px; float: right; display: inline-block;">` + dtps.classes[num].weights[i].grade + `</div></h4>` + assignTmp.join("") + `</div>`);
                    weightOverview.push(`<div onclick="$('.weight').hide(); $('.weight.` + i + `').show();" class="progressBar big"><div class="progressLabel">` + dtps.classes[num].weights[i].weight + `</div><div class="progress" style="width: calc(` + dtps.classes[num].weights[i].grade + ` - 300px);"></div></div>`)
                }
                var headsUp = `<div class="card" style="background-color: #3cc15b;color: white;padding: 10px 20px;"><i class="material-icons" style="margin-right: 10px;font-size: 32px;display: inline-block;vertical-align: middle;">check_circle_outline</i><h5 style="display: inline-block;vertical-align: middle;margin-right: 5px;">On track to pass&nbsp;&nbsp;<span style="font-size: 18px;">Power+ didn't detect any DVs in any of your CCs or PTs</span></h5></div>`
                if (DVs > 0) {
                    headsUp = `<div class="card" style="background-color: #c14d3c;color: white;padding: 10px 20px;"><i class="material-icons" style="margin-right: 10px;font-size: 32px;display: inline-block;vertical-align: middle;">cancel</i><h5 style="display: inline-block;vertical-align: middle;margin-right: 5px;">You're at risk of failing this class&nbsp;&nbsp;<span style="font-size: 18px;">Power+ detected ` + DVs + ` DV(s) in your CCs/PTs</span></h5></div>`
                }
                headsUp = `<div class="card" style="background-color: #e5bf27;color: white;padding: 10px 20px;"><i class="material-icons" style="margin-right: 10px;font-size: 32px;display: inline-block;vertical-align: middle;">build</i><h5 style="display: inline-block;vertical-align: middle;margin-right: 5px;">Under construction&nbsp;&nbsp;<span style="font-size: 18px;">The Power+ gradebook is still being developed. Use at your own risk.</span></h5></div>`
                if (String(window.localStorage.dtpsGradeTrend).startsWith("{") && (dtps.classes[dtps.selectedClass].grade !== "--")) var gradeDiff = Number((dtps.classes[dtps.selectedClass].grade - Number(JSON.parse(window.localStorage.dtpsGradeTrend)[dtps.classes[dtps.selectedClass].id].oldGrade)).toFixed(2));
                jQuery(".classContent").html(headsUp + `
`+ (dtps.classes[dtps.selectedClass].grade !== "--" ? (String(window.localStorage.dtpsGradeTrend).startsWith("{") ? (gradeDiff !== 0 ? `<div class="card" style="background-color: #4e4e4e;color: white;padding: 10px 20px;">
<i class="material-icons" style="margin-right: 10px;font-size: 32px;display: inline-block;vertical-align: middle;">` + (gradeDiff > 0 ? "arrow_upward" : "arrow_downward") + `</i><span style="font-size: 18px; vertical-align: middle;">Your grade in this class has ` + (gradeDiff > 0 ? "increased" : "decreased") + ` by ` + String(gradeDiff).replace("-", "") + `%</span></h5></div>` : "") : "") : "") + `
<div style="height: 1000px;" class="card withnav">
  <div class="sidenav">
    <div class="title">
      <h5>` + (type == "mastery" ? "Mastery" : "Gradebook") + `</h5>
      <p>` + dtps.classes[num].name + `</p>
    </div>
<div onclick="$(this).siblings().removeClass('active'); $(this).addClass('active'); $('.weight').hide(); $('.weight.overview').show();" style="margin-top: -15px;" class="item active"><i class="material-icons">dashboard</i> Overview</div>
<div style="margin-bottom: 20px;" onclick="dtps.gradebook(` + num + `, '` + (type == "mastery" ? "gradebook" : "mastery") + `')" class="item"><i class="material-icons">compare_arrows</i> Show ` + (type == "mastery" ? "gradebook" : "mastery") + `</div>
    ` + dtps.classes[num].weights.map(function (key, i) {
                    return `<div onclick="$(this).siblings().removeClass('active'); $(this).addClass('active'); $('.weight').hide(); $('.weight.` + i + `').show();" class="item">
       ` + key.icon + key.weight.replace("Comprehension Check", "CC").replace("Success Skills", "SS").replace("Performance Task", "PT") + `
    </div>` }).join("") + `
  </div>
  <div class="content">
    ` + weightsTmp.join("") + `
    <div class="weight overview">
<h4>` + dtps.classes[num].name + `</h4>
` + weightOverview.join("") + `
<br />
<h5><i class="material-icons" style="vertical-align: middle; margin-right: 10px;">trending_up</i>Boost your grade <div class="badge">beta</div></h5>
<p>` + revisable.map((key) => key.dom).join("") + `</p>
</div>
  </div>
</div>
  `);
            } else {
                $(".btns .btn.grades").hide();
                $(".btns .btn").removeClass("active");
                $(".btns .btn.stream").addClass("active");
                dtps.selectedContent = "stream";
                dtps.chroma();
                dtps.classStream(num);
            }
        }
    }
}

//Shows details for an assignment given the assignment ID and class number
dtps.assignment = function (id, classNum, submissions) {
    var streamNum = dtps.classes[classNum].streamitems.indexOf(id.toString());
    var assignment = dtps.classes[classNum].stream[streamNum];
    if (submissions == "handIN") {
        $(".card.details").html(`<i onclick="fluid.cards.close('.card.details')" class="material-icons close">close</i>
<i style="left: 0; right: auto;" onclick="dtps.assignment(` + id + `, ` + classNum + `)" class="material-icons close">arrow_back</i>
<br /><h4>Loading...</h4>`);
        $.get("https://canvas.instructure.com/courses/" + dtps.classes[classNum].id + "/assignments/" + id, function (data) {
            dtps.submissionToken = $(data).find("input[name=authenticity_token]").attr("value");
            $(".card.details").html(`<i onclick="fluid.cards.close('.card.details')" class="material-icons close">close</i>
<i style="left: 0; right: auto;" onclick="dtps.assignment(` + id + `, ` + classNum + `)" class="material-icons close">arrow_back</i>
<br /><h4>Submit assignment (beta)</h4>
<p>Submitting assignments in Power+ is a beta feature. Use at your own risk and double check the Canvas submission to ensure it worked properly.
Power+ currently only supports assignments that use online text entry. Other assignment types will be added in the future.</p>
<br />
<textarea class="submissionText" placeholder="Submission"></textarea>
<br /><br />
<button class="btn" onclick="dtps.assignment(` + id + `, ` + classNum + `, 'submitText')"><i class="material-icons">public</i>Submit</button>`);
        });
    } else {
        if (String(submissions).startsWith("submit")) {
            if (submissions == "submitText") {
                dtps.webReq('canSUBMIT', "/api/v1/courses/" + dtps.classes[classNum].id + "/assignments/" + id + "/submissions?submission[submission_type]=online_text_entry&submission[body]=" + $('.submissionText').val() + "&authenticity_token=" + dtps.submissionToken, function () {
                    window.alert('Assignment submitted')
                })
            }
        } else {
            if (submissions) {
                $(".card.details").css("background-color", "white");
                $(".card.details").css("color", "black")
                $(".card.details").html(`<i style="color: black !important;" onclick="fluid.cards.close('.card.details')" class="material-icons close">close</i>
<i style="left: 0; right: auto; color: black !important;" onclick="dtps.assignment(` + id + `, ` + classNum + `)" class="material-icons close">arrow_back</i>
<br /><br />
<iframe style="width: 100%; height: calc(100vh - 175px); border: none;" src="` + assignment.submissions + `"></iframe>`);
            } else {
                $(".card.details").css("background-color", "")
                $(".card.details").css("color", "")
                $(".card.details").html(`<i onclick="fluid.cards.close('.card.details')" class="material-icons close">close</i><h3>` + assignment.title + `</h3><br /><div class="list">` + `
<div style="cursor: auto;margin: 0px; padding: 10px 15px;" class="item"><i class="material-icons">add_box</i><b>Posted</b>:  ` + assignment.published + `</div>
` + (assignment.due ? `<div style="cursor: auto;margin: 0px; padding: 10px 15px;" class="item"><i class="material-icons">access_time</i><b>Due</b>:  ` + assignment.due + `</div>` : "") + `
` + (assignment.locksAt ? `<div style="cursor: auto;margin: 0px; padding: 10px 15px;" class="item"><i class="material-icons" style="font-family: 'Material Icons Extended'">lock_outline</i><b>Locks</b>:  ` + new Date(assignment.locksAt).toDateString().slice(0, -5) + ", " + dtps.ampm(new Date(assignment.locksAt)) + `</div>` : "") + `
` + (assignment.unlocksAt ? `<div style="cursor: auto;margin: 0px; padding: 10px 15px;" class="item"><i class="material-icons">lock_open</i><b>Unlocks</b>:  ` + new Date(assignment.unlocksAt).toDateString().slice(0, -5) + ", " + dtps.ampm(new Date(assignment.unlocksAt)) + `</div>` : "") + `
` + (assignment.status ? `<div style="cursor: auto;margin: 0px; padding: 10px 15px;" class="item"><i class="material-icons">assignment_return</i><b>Status</b>:  ` + (assignment.status == "submitted" ? "Submitted" : (assignment.status == "unsubmitted" ? "Unsubmitted" : (assignment.status == "graded" ? "Graded" : (assignment.status == "pending_review" ? "Pending Review" : assignment.status)))) + `</div>` : "") + `
<div style="cursor: auto;margin: 0px; padding: 10px 15px;" class="item"><i class="material-icons">bar_chart</i><b>Total Points</b>:  ` + assignment.worth + `</div>
` + (assignment.grade ? `<div style="cursor: auto;margin: 0px; padding: 10px 15px;" class="item"><i class="material-icons">assessment</i><b>Points earned</b>:  ` + assignment.grade + ` (` + assignment.letter + `)</div>` : "") + `
<div style="cursor: auto;margin: 0px; padding: 10px 15px;" class="item"><i class="material-icons">category</i><b>Group</b>:  ` + assignment.weight + `</div>
` + (assignment.outcome ? `<div style="cursor: auto;margin: 0px; padding: 10px 15px;" class="item"><i class="material-icons">adjust</i><b>Outcome</b>:  ` + assignment.outcome + `</div>` : "") + `
` + (assignment.locked && assignment.lockedReason ? `<div style="cursor: auto;margin: 0px; padding: 10px 15px;" class="item"><i style="font-family: 'Material Icons Extended';" class="material-icons">lock_outline</i>` + assignment.lockedReason + `</div>` : "") + `
<div style="cursor: auto;margin: 0px; padding: 10px 15px;" class="item"><i class="material-icons">class</i><b>Class</b>:  ` + assignment.subject + `</div>
` + `</div><br /><br /><div>` + (assignment.body ? assignment.body : "") + `</div><br /><br />
` + (assignment.types.includes("online_text_entry") ? (assignment.turnedIn ? `<div class="btn" onclick="dtps.assignment(` + id + `, ` + classNum + `, 'handIN')"><i class="material-icons">assignment_returned</i> Resubmit</div>` : `<div class="btn" onclick="dtps.assignment(` + id + `, ` + classNum + `, 'handIN')"><i class="material-icons">assignment</i> Hand In</div>`) : ``) + `
<div class="btn" onclick="dtps.assignment(` + id + `, ` + classNum + `, true)"><i class="material-icons">assignment</i> Submissions</div>
<div class="btn" onclick="window.open('` + assignment.url + `')"><i class="material-icons">link</i> View on Canvas</div>
` + (fluid.get("pref-canvasRAW") == "true" ? `<div class="btn" onclick="alert('Coming soon')"><i class="material-icons">description</i> Raw Data</div>` : ``) + `
`);
            }
        }
    }
    fluid.cards.close(".card.focus");
    fluid.modal(".card.details");
}

//Fetches and displays announcements
dtps.announcements = function () {
    var context = [];
    for (var i = 0; i < dtps.classes.length; i++) {
        if (i == 0) { context.push("?context_codes[]=course_" + dtps.classes[i].id) } else { context.push("&context_codes[]=course_" + dtps.classes[i].id) }
    }
    dtps.webReq("canvas", "/api/v1/announcements" + context.join(""), function (resp) {
        var ann = JSON.parse(resp);
        var announcements = [];
        for (var i = 0; i < ann.length; i++) {
            var dtpsClass = null;
            for (var ii = 0; ii < dtps.classes.length; ii++) {
                if (dtps.classes[ii].id == ann[i].context_code.split("_")[1]) {
                    dtpsClass = ii;
                }
            }
            announcements.push(`<div onclick="$(this).toggleClass('open');" style="cursor: pointer;" class="announcement card color ` + dtps.classes[dtpsClass].col + `">
<div class="label">` + dtps.classes[dtpsClass].subject + `</div>` + ann[i].message + `
</div>
`);
        }
        if ((dtps.selectedClass == "dash") && (dtps.masterContent == "assignments")) {
            jQuery(".dash .announcements").html(announcements.join(""));
        }
    });
};

//Compiles and displays assignment due dates in the calendar
dtps.calendar = function (doneLoading) {
    dtps.log("BUILDING CAL")
    if ((dtps.selectedClass == "dash") && (dtps.masterContent == "assignments")) {
        calEvents = [];
        for (var i = 0; i < dtps.classes.length; i++) {
            if (dtps.classes[i].stream) {
                for (var ii = 0; ii < dtps.classes[i].stream.length; ii++) {
                    if (dtps.classes[i].stream[ii].dueDate) {
                        var styles = window.getComputedStyle($(".class." + i)[0]);
                        calEvents.push({
                            title: dtps.classes[i].stream[ii].title,
                            start: moment(new Date(dtps.classes[i].stream[ii].dueDate)).toISOString(true),
                            allDay: false,
                            color: styles.getPropertyValue('--norm'),
                            classNum: i,
                            assignmentID: dtps.classes[i].stream[ii].id
                        })
                    }
                }
            }
        }
        if ($.fullCalendar !== undefined) {
            $('#calendar').fullCalendar({
                events: calEvents,
                header: {
                    left: 'title',
                    right: 'prev,next'
                },
                eventClick: function (calEvent, jsEvent, view) {
                    dtps.assignment(calEvent.assignmentID, calEvent.classNum);
                },
                eventAfterAllRender: function () {
                    $(".fc-prev-button").html(`<i class="material-icons">keyboard_arrow_left</i>`);
                    $(".fc-next-button").html(`<i class="material-icons">keyboard_arrow_right</i>`);
                }
            });
        }
        $(".fc-prev-button").html(`<i class="material-icons">keyboard_arrow_left</i>`);
        $(".fc-next-button").html(`<i class="material-icons">keyboard_arrow_right</i>`);

    }
}

//Clears all Power+ data
dtps.clearData = function () {
    if (window.confirm("Clearing Power+ data will clear all local user data stored by Power+. This should be done if it is a new semester / school year or if you are having issues with Power+. Are you sure you want to clear all your Power+ data?")) {
        window.localStorage.clear()
        window.alert("Power+ data cleared. Reload the page to begin repopulating your userdata.")
    }
}

//Renders chroma effect for selected class
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
                if ($(".class.masterStream")[0] !== undefined) ele = $(".class.masterStream")[0];
                fluid.chroma.static(getComputedStyle(ele).getPropertyValue(classVar));
            }
        }
    }
}

//Renders the class list in the sidebar
dtps.showClasses = function (override) {
    var streamClass = "active"
    if (dtps.selectedClass !== "dash") var streamClass = "";
    dtps.classlist = [];
    for (var i = 0; i < dtps.classes.length; i++) {
        var name = dtps.classes[i].subject
        if (dtps.fullNames) name = dtps.classes[i].name
        dtps.classlist.push(`
      <div onclick="dtps.selectedClass = ` + i + `" class="class ` + i + ` ` + dtps.classes[i].col + `">
      <div class="name">` + name + `</div>
      <div class="grade val"><span class="letter">` + dtps.classes[i].letter + `</span><span class="points">` + dtps.classes[i].grade + `%</span></div>
      </div>
    `);
    }
    var googleClassDom = ""
    if (dtps.isolatedGoogleClasses) {
        dtps.classlist.push(`<div class="classDivider"></div>`)
        for (var i = 0; i < dtps.isolatedGoogleClasses.length; i++) {
            dtps.classlist.push(`<div style="display: none;" onclick="$('.sidebar .class').removeClass('active'); $(this).addClass('active'); $('body').addClass('isolatedGoogleClass'); dtps.selectedClass = 'isolatedGoogleClass'; $('.classContent').html(dtps.renderStream(dtps.googleClasses[` + dtps.isolatedGoogleClasses[i] + `].stream)); $('#headText').html('` + dtps.googleClasses[dtps.isolatedGoogleClasses[i]].name + `')" class="class isolated google ` + dtps.googleClasses[dtps.isolatedGoogleClasses[i]].id + `">
      <div style="width: 100%; padding-right: 10px;" class="name">` + dtps.googleClasses[dtps.isolatedGoogleClasses[i]].name + `</div>
      </div>`)
        }
    }
    if ((!Boolean(jQuery(".sidebar .class.masterStream")[0])) || override) {
        jQuery(".sidebar").html(`<h5 style="margin: 10px 0px 25px 0px; font-weight: 600; font-size: 27px; text-align: center;">Power+</h5>
<div onclick="dtps.selectedClass = 'dash';" class="class masterStream ` + streamClass + `">
    <div class="name">Dashboard</div>
    <div class="grade"><i class="material-icons">dashboard</i></div>
    </div>
    <div class="classDivider"></div>
  ` + dtps.classlist.join(""));
        if (dtps.selectedClass !== "dash") $(".class." + dtps.selectedClass).addClass("active");
        if ($(".btn.pages").hasClass("active")) { $(".btn.pages").removeClass("active"); $(".btn.stream").addClass("active"); dtps.classStream(dtps.selectedClass); dtps.selectedContent = "stream"; }
        $(".class:not(.google)").click(function (event) {
            if (dtps.selectedClass == "dash") $('body').addClass('dashboard');
            if (dtps.selectedClass !== "dash") $('body').removeClass('dashboard');
            dtps.chroma();
            $('body').removeClass('isolatedGoogleClass');
            $(".btn.google").hide();
            $(".background").addClass("trans");
	    if (dtps.classes[dtps.selectedClass]) {
		    if (dtps.classes[dtps.selectedClass].image && (fluid.get("pref-classImages") !== "true")) {
			    $(".cover.image").css("background-image", 'url("' + dtps.classes[dtps.selectedClass].image + '")');
			    $(".background").css("opacity", '0.90');
			    $(".background").css("filter", 'none');
		    } else {
			    $(".cover.image").css("background-image", 'none');
			    $(".background").css("opacity", '1');
			    $(".background").css("filter", 'blur(10px)');
		    }
	    }
            clearTimeout(dtps.bgTimeout);
            dtps.bgTimeout = setTimeout(function () {
                document.dispatchEvent(new CustomEvent('fluidTheme'))
                $(".background").removeClass("trans");
            }, 500);
            $(".background").removeClass(jQuery.grep($(".background").attr("class").split(" "), function (item, index) {
                return item.trim().match(/^filter_/);
            })[0]);
            $(".cacaoBar .tab.active").removeClass(jQuery.grep($(".cacaoBar .tab.active").attr("class").split(" "), function (item, index) {
                return item.trim().match(/^filter_/);
            })[0]);
            $(".header").removeClass(jQuery.grep($(".header").attr("class").split(" "), function (item, index) {
                return item.trim().match(/^filter_/);
            })[0]);
            if (dtps.classes[dtps.selectedClass]) {
                if (dtps.classes[dtps.selectedClass].google) {
                    $(".btn.google").show();
                };
                $(".background").addClass(dtps.classes[dtps.selectedClass].col);
                $(".cacaoBar .tab.active").addClass(dtps.classes[dtps.selectedClass].col);
                $(".header").addClass(dtps.classes[dtps.selectedClass].col)
            }
            $(this).siblings().removeClass("active")
            $(this).addClass("active")
            $(".header h1").html($(this).children(".name").text())
            $(".cacaoBar .tab.active span").html($(this).children(".name").text())
            if (dtps.selectedClass == "dash") {
                $(".cacaoBar .tab.active i").html("dashboard")
            } else {
                $(".cacaoBar .tab.active i").html(($(".btn." + dtps.selectedContent + " i").html() ? $(".btn." + dtps.selectedContent + " i").html() : "dashboard"))
            }
            if (!dtps.classes[dtps.selectedClass]) {
                $(".header .btns").hide();
            } else {
                $(".header .btns:not(.master)").show();
            }
            if ((dtps.selectedContent == "stream") && (dtps.classes[dtps.selectedClass])) dtps.classStream(dtps.selectedClass)
            if ((dtps.selectedContent == "grades") && (dtps.classes[dtps.selectedClass])) dtps.gradebook(dtps.selectedClass)
            if (dtps.selectedClass == "dash") dtps.masterStream(true);
            if (dtps.selectedClass == "announcements") dtps.announcements();
            if (dtps.classes[dtps.selectedClass]) { if (dtps.classes[dtps.selectedClass].weights) { if (dtps.classes[dtps.selectedClass].weights.length) { $(".btns .btn.grades").show(); } else { $(".btns .btn.grades").hide(); } } else { $(".btns .btn.grades").hide(); } }
        });
    }
    if (override == "first") {
        if (dtps.currentClass) {
            $(".class." + dtps.selectedClass).click();
        }
    }
}

//Fetches Google Classroom assignment data for all Google Classes
dtps.googleStream = function () {
    dtps.log("FETCHING GOOGLE ASSIGNMENTS")
    function googleStream(i) {
        if (dtps.googleClasses[i]) {
            gapi.client.classroom.courses.courseWork.list({ courseId: dtps.googleClasses[i].id }).then(function (resp) {
                dtps.googleClasses[i].rawData = resp.result;
                dtps.googleClasses[i].stream = [];
                for (var ii = 0; ii < resp.result.courseWork.length; ii++) {
                    if (resp.result.courseWork[ii].dueDate) {
                        var due = new Date(resp.result.courseWork[ii].dueDate.year, resp.result.courseWork[ii].dueDate.month - 1, resp.result.courseWork[ii].dueDate.day - 1);
                    } else {
                        var due = new Date();
                    }
                    dtps.googleClasses[i].stream.push({
                        title: resp.result.courseWork[ii].title,
                        due: due.toHumanString(),
                        dueDate: due.toISOString(),
                        turnedIn: false,
                        google: true,
                        url: resp.result.courseWork[ii].alternateLink + "?authuser=" + dtps.user.google.getEmail(),
                        letter: "--",
                        grade: "/" + resp.result.courseWork[ii].maxPoints
                    })
                    if (dtps.googleClasses[i].psClass !== undefined) {
                        dtps.googleClasses[i].stream[ii].class = dtps.googleClasses[i].psClass;
                        dtps.googleClasses[i].stream[ii].subject = dtps.classes[dtps.googleClasses[i].psClass].subject;
                    }
                }
                if (i < (dtps.googleClasses.length - 1)) googleStream(i + 1);
            });
        } else {
            if (i < (dtps.googleClasses.length - 1)) googleStream(i + 1);
        }
    }
    googleStream(0);
}

//Authenticates the user for Google Classroom integration
dtps.googleAuth = function () {
    dtps.log("GOOGLE AUTH")
    dtps.user.google = gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile();
    $(".items img").attr("src", dtps.user.google.getImageUrl())
    gapi.client.classroom.courses.list({ pageSize: 40 }).then(function (resp) {
        dtps.googleClasses = resp.result.courses;
        if (dtps.googleClasses == undefined) {
            dtps.gapis();
        } else {
            for (var i = 0; i < dtps.googleClasses.length; i++) {
                if (dtps.googleClasses[i].courseState == "ACTIVE") {
                    var match = null;
                    for (var ii = 0; ii < dtps.classes.length; ii++) {
                        if (dtps.googleClasses[i].name.includes(dtps.classes[ii].subject)) match = ii;
                    }
                    if (match !== null) {
                        if (dtps.classes[match].google == undefined) {
                            dtps.classes[match].google = dtps.googleClasses[i]
                            dtps.googleClasses[i].psClass = match
                        }
                    }
                }
            }
            dtps.isolatedGoogleClasses = [];
            var isolatedDom = [];
            for (var i = 0; i < dtps.googleClasses.length; i++) {
                if ((dtps.googleClasses[i].psClass == undefined) && (dtps.googleClasses[i].courseState == "ACTIVE")) {
                    dtps.isolatedGoogleClasses.push(i)
                    isolatedDom.push(`<br /><br />
    <div onclick="jQuery('.google.isolated.class.` + dtps.googleClasses[i].id + `').toggle()" class="switch"><span class="head"></span></div>
    <div class="label">` + dtps.googleClasses[i].name + `</div>`)
                }
            }
            $(".isolatedGClassList").html(isolatedDom.join("").slice(12));
            dtps.showClasses(true);
            dtps.googleStream();
            fluid.init();
        }
    });
}

//Saves grade data locally for grade trend 
dtps.logGrades = function () {
    if ((window.localStorage.dtpsGradeTrend !== "false") && (window.localStorage.dtpsGradeTrend !== undefined)) {
        if (window.localStorage.dtpsGradeTrend.startsWith("{")) {
            dtps.log("LOGGING GRADES")
            var now = new Date();
            var start = new Date(now.getFullYear(), 0, 0);
            var diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
            var oneDay = 1000 * 60 * 60 * 24;
            var day = Math.floor(diff / oneDay);
            var gradeData = JSON.parse(window.localStorage.dtpsGradeTrend);
            for (var i = 0; i < dtps.classes.length; i++) {
                if (dtps.classes[i].grade !== "--") {
                    if (!gradeData[dtps.classes[i].id]) gradeData[dtps.classes[i].id] = { oldGrade: dtps.classes[i].grade, lastUpdated: new Date(), currentGrade: dtps.classes[i].grade }
                    if (dtps.classes[i].grade !== gradeData[dtps.classes[i].id].currentGrade) {
                        gradeData[dtps.classes[i].id].oldGrade = gradeData[dtps.classes[i].id].currentGrade
                        gradeData[dtps.classes[i].id].currentGrade = dtps.classes[i].grade
                        gradeData[dtps.classes[i].id].lastUpdated = new Date();
                    }
                }
            }
            window.localStorage.setItem("dtpsGradeTrend", JSON.stringify(gradeData));
        }
    }
}

//Enables/Disables grade trend
dtps.gradeTrend = function (ele) {
    var temp = ele;
    if ($(temp).hasClass('head')) { temp = $(ele).parent()[0] };
    if (!$(temp).hasClass('active')) {
        window.localStorage.setItem('dtpsGradeTrend', 'false');
        swal('Grade trend is disabled. All data stored on your computer by grade trend has been deleted.', { icon: 'success', });
    } else {
        swal({ title: 'Enable grade trend', text: 'By enabling grade trend, Power+ will store a copy of your grades locally on your computer every time you use Power+. When a grade for one of your classes changes, Power+ will tell you how much it changed in the grades tab of the class. The grade trend setting applies to all classes.', buttons: true }).then((enable) => {
            if (enable) {
                window.localStorage.setItem('dtpsGradeTrend', '{}'); swal('Grade trend is enabled', { icon: 'success', });
            } else {
                $(temp).removeClass('active')
            }
        });
    }
}

//cacao variables
dtps.states = {};
letters = 'abcdefghijklmnopqrstuvwxyz'.split('')
letter = 1;

//Tab click handler (cacao)
dtps.cacao = function (state) {
    if (String(fluid.get("pref-cacao")) == "true") {
        if (state == "new") {
            $(".cacaoBar .tab.new").before(`<div onclick="dtps.cacao('` + letters[letter] + `');" state="` + letters[letter] + `" class="tab ` + letters[letter] + `"><i class="material-icons">dashboard</i><span>Dashboard</span></div>`)
            letter++;
        } else {
            dtps.saveState($(".cacaoBar .tab.active").attr("state"));
            $(".cacaoBar .tab." + state).siblings().removeClass("active")
            $(".cacaoBar .tab." + state).addClass("active")
            dtps.loadState(state);
        }
    }
}

//Save state (cacao)
dtps.saveState = function (state) {
    if (String(fluid.get("pref-cacao")) == "true") {
        dtps.states[state] = {
            class: dtps.selectedClass,
            content: dtps.selectedContent,
            page: dtps.selectedPage,
            classContent: $(".classContent").html(),
            scrollTop: document.documentElement.scrollTop,
            scrollLeft: document.documentElement.scrollLeft
        }
    }
}

//Load state (cacao)
dtps.loadState = function (stateKey) {
    if (String(fluid.get("pref-cacao")) == "true") {
        var state = dtps.states[stateKey]
        if (state) {
            dtps.selectedClass = state.class;
            dtps.selectedContent = state.content;
            dtps.selectedPage = state.page;
            dtps.showClasses(true);
            $(".class." + (state.class == "dash" ? "masterStream" : state.class)).click();
            if (state.content == "pages") {
                $(".header .btn.pages").click();
                $(".sidebar .btn." + dtps.selectedPage).click();
            }
            $(".classContent").html(state.classContent);
            document.documentElement.scrollTop = state.scrollTop;
            document.documentElement.scrollLeft = state.scrollLeft;
        } else {
            //no state present, load default dashboard state
            dtps.selectedClass = "dash"
            dtps.selectedContent = "stream"
            document.documentElement.scrollTop = 0;
            document.documentElement.scrollLeft = 0;
            dtps.showClasses(true);
            $(".class.masterStream").click();
            dtps.saveState(stateKey)
        }
    }
}

//Renders Power+ and removes all Canvas HTML
dtps.render = function () {
    jQuery("head").html("");
    document.title = "Power+" + dtps.trackSuffix;

    //Cacao pref
    if (fluid.get("pref-cacao") == "true") { $("body").addClass("cacao"); $('.sidebar').addClass("acrylicMaterial"); }
    document.addEventListener("pref-cacao", function (e) {
        console.log(e)
        if (String(e.detail) == "true") {
            $("body").addClass("cacao");
            $('.sidebar').addClass("acrylicMaterial");
        } else {
            $("body").removeClass("cacao");
            $('.sidebar').removeClass("acrylicMaterial");
        }
    })

    //Full names pref
    if (fluid.get("pref-fullNames") == "true") { dtps.fullNames = true; }
    document.addEventListener("pref-fullNames", function (e) {
        console.log(e)
        if (String(e.detail) == "true") { dtps.fullNames = true; } else { dtps.fullNames = false; }
        dtps.showClasses(true);
    })

    if (fluid.chroma) {
        fluid.chroma.supported(function (res) {
            if (res) {
                //Razer Synapse installed
                $(".razerChroma").show();

                //Razer Chroma pref
                if (fluid.get("pref-chromaEffects") == "true") { if (!fluid.chroma.on) { fluid.chroma.init(dtps.chromaProfile, () => fluid.chroma.static(getComputedStyle($(".background")[0]).getPropertyValue("--dark"))); } }
                document.addEventListener("pref-chromaEffects", function (e) {
                    console.log(e)
                    if (String(e.detail) == "true") { if (!fluid.chroma.on) { fluid.chroma.init(dtps.chromaProfile, () => fluid.chroma.static(getComputedStyle($(".background")[0]).getPropertyValue("--dark"))); } } else { fluid.chroma.disable(); }
                })
            }
        })
    }

    //Hide grades pref
    if (fluid.get("pref-hideGrades") == "true") { jQuery('body').addClass('hidegrades'); }
    document.addEventListener("pref-hideGrades", function (e) {
        console.log(e)
        if (String(e.detail) == "true") { jQuery('body').addClass('hidegrades'); } else { jQuery('body').removeClass('hidegrades'); }
        dtps.showClasses(true);
    })

    $("body").addClass("dashboard");
    if (!dtps.currentClass) {
        dtps.selectedClass = "dash";
        dtps.selectedContent = "stream";
    }
    dtps.masterContent = "assignments";
    var trackDom = "";
    if (dtps.trackSuffix !== "") {
        trackDom = `<div style="display:inline-block;font-size: 16px; padding: 3px 4px;background-color: ` + dtps.trackColor + `" class="beta badge notice">` + dtps.trackSuffix.replace(" (", "").replace(")", "") + `</div>`
    } else {
        trackDom = ``;
    }
    var verDom = dtps.readableVer.replace(dtps.trackSuffix, "");
    if (dtps.trackSuffix !== "") {
        verDom = `<div class="buildInfo" style="display: inline-block;font-size: 12px;cursor: pointer;"></div>`
    } else {
        verDom = dtps.readableVer.replace(dtps.trackSuffix, "");
    }
    /*document.addEventListener('extensionData', function (e) {
        if (e.detail == "extensionInstalled") {
            var extensionDom = "";
            jQuery(".extensionDom").html(`<br />
<div id="extensionAutoLoad" onclick="$(this).toggleClass('active'); if (window.localStorage.disableAutoLoad == 'false') {localStorage.setItem('disableAutoLoad', true); } else {localStorage.setItem('disableAutoLoad', false); }" class="switch"><span class="head"></span></div>
    <div class="label"><i class="material-icons">extension</i> Automatically load Power+</div>
<br /><br />
<div class="extensionDevMode switch" id="extensionDevMode" onclick="$(this).toggleClass('active'); if (window.localStorage.devAutoLoad == 'true') {localStorage.setItem('devAutoLoad', false);} else {localStorage.setItem('devAutoLoad', true); window.alert('The dev version of Power+ is often untested and may contain several bugs. Continue at your own risk.'); }"><span class="head"></span></div>
    <div class="extensionDevMode label"><i class="material-icons">extension</i> Load the unstable (dev) version of Power+</div>`)
            jQuery(".extTab").show();
            if (window.localStorage.disableAutoLoad == "false") { jQuery("#extensionAutoLoad").addClass("active"); }
            if (window.localStorage.devAutoLoad == "true") { jQuery("#extensionDevMode").addClass("active"); }
            if (window.localStorage.dtpsLocal) { jQuery("#dtpsLocal").addClass("active"); }
        }
    });*/
    jQuery("body").html(`
    <div style="line-height: 0;" class="sidebar">
    </div>
    <div class="cover image"></div>
    <div class="background trans"></div>
<div class="header">
    <h1 id="headText">Dashboard</h1>
    <div style="display: none;" class="btns row tabs">
    <button onclick="dtps.selectedContent = 'stream'; dtps.chroma(); $('.cacaoBar .tab.active i').html('assignment'); dtps.classStream(dtps.selectedClass);" class="btn active stream">
    <i class="material-icons">library_books</i>
    Coursework
    </button>
    <button onclick="dtps.selectedContent = 'google'; dtps.chroma(); $('.cacaoBar .tab.active i').html('class'); $('.classContent').html(dtps.renderStream(dtps.classes[dtps.selectedClass].google.stream))" class="btn google">
    <i class="material-icons">class</i>
    google_logo Classroom
    </button>
    <button onclick="dtps.selectedContent = 'pages'; dtps.chroma(); $('.cacaoBar .tab.active i').html('insert_drive_file'); dtps.loadPages(dtps.selectedClass);" class="btn pages">
    <i class="material-icons">insert_drive_file</i>
    Pages
    </button>
    <button onclick="dtps.selectedContent = 'grades'; dtps.chroma(); $('.cacaoBar .tab.active i').html('assessment'); dtps.gradebook(dtps.selectedClass);" class="btn grades sudo">
    <i class="material-icons">assessment</i>
    Grades
    </button>
    </div>
    </div>
	<div class="classContent">
    <div class="spinner"></div>
    </div>
<div style="height: calc(100vh - 50px); overflow: auto !important;" class="card withnav focus close container abt-new">
<i onclick="fluid.cards.close('.card.abt-new')" class="material-icons close">close</i>
  <div class="sidenav" style="position: fixed; height: calc(100% - 50px); border-radius: 20px 0px 0px 20px;">
    <div class="title">
	  <img src="https://dtps.js.org/outline.png" style="width: 50px;vertical-align: middle;padding: 7px; padding-top: 14px;" />
	  <div style="vertical-align: middle; display: inline-block;">
      <h5 style="font-weight: bold;display: inline-block;vertical-align: middle;">Power+</h5>` + trackDom + `
      <p style="font-weight: bold;">` + verDom + `</p>
	  </div>
    </div>
    <div onclick="$('.abtpage').hide();$('.abtpage.settings').show();" class="item active">
      <i class="material-icons">settings</i> Settings
    </div>
    <div onclick="$('.abtpage').hide();$('.abtpage.classes').show();" class="item">
      <i class="material-icons">book</i> Classes
    </div>
    <div onclick="$('.abtpage').hide();$('.abtpage.grades').show();" class="item gradesTab">
      <i class="material-icons">assessment</i> Grades
    </div>
    <div onclick="$('.abtpage').hide();$('.abtpage.experiments').show();" style="/*display: none !important;*/" class="item sudo">
      <i class="material-icons" style="font-family: 'Material Icons Extended'">experiment</i> Experiments
    </div>
    <div onclick="$('.abtpage').hide();$('.abtpage.debug').show();" class="item dev">
      <i class="material-icons">bug_report</i> Debugging
    </div>
    <div onclick="$('.abtpage').hide();$('.abtpage.about').show(); if ($('body').hasClass('sudo')) { $('.advancedOptions').show(); $('.advOp').hide(); } else { $('.advancedOptions').hide(); $('.advOp').show(); }" class="item">
      <i class="material-icons">info</i> About
    </div>
  </div>
  <div style="min-height: 100%" class="content">
<div class="abtpage settings">
    <h5>Settings</h5>
    <br />
    <p>Theme</p>
    <div class="btns row themeSelector"></div>
    <br />
    <p>Grades</p>
    <div onclick="fluid.set('pref-hideGrades')" class="switch pref-hideGrades"><span class="head"></span></div>
    <div class="label"><i class="material-icons">visibility_off</i> Hide class grades</div>
    <!-- <br /><br />
    <div onclick="dtps.gradeTrend(this);" class="switch` + (String(window.localStorage.dtpsGradeTrend).startsWith("{") ? " active" : "") + `"><span class="head"></span></div>
    <div class="label"><i class="material-icons">timeline</i> Show grade trend</div> -->
    <br /><br />
    <p>Classes</p>
    <div onclick="fluid.set('pref-fullNames')" class="switch pref-fullNames"><span class="head"></span></div>
    <div class="label"><i class="material-icons">title</i> Show full class names</div>
	<br /><br />
    <div onclick="fluid.set('pref-classImages')" class="switch pref-classImages"><span class="head"></span></div>
    <div class="label"><i class="material-icons">image</i> Hide class images</div>
	<br style="display: none;" class="razerChroma" /><br style="display: none;" class="razerChroma" />
    <div style="display: none" onclick="fluid.set('pref-chromaEffects')" class="switch pref-chromaEffects razerChroma"><span class="head"></span></div>
    <div class="label razerChroma" style="display: none;"><img style="width: 26px;vertical-align: middle;margin-right: 2px;" src="https://i.imgur.com/FLwviAM.png" class="material-icons" /img> Razer Chroma Effects (beta)</div>
    <br /><br />
    <p>Power+</p>
    <div onclick="fluid.set('pref-autoLoad')" class="switch pref-autoLoad"><span class="head"></span></div>
    <div class="label"><i class="material-icons">code</i> Automatically load Power+</div>
    <!-- <br /><br />
    <div onclick="fluid.set('pref-devChannel')" class="switch pref-devChannel"><span class="head"></span></div>
    <div class="label"><i class="material-icons">bug_report</i> Use the unstable (dev) version of Power+</div> -->
</div>
<div style="display: none;" class="abtpage classes">
<h5>Canvas Classes</h5>
<button onclick="dtps.schedule()" class="btn"><i class="material-icons">access_time</i>Schedule classes</button>
<br /><br />
<div class="googleClassroom sudo">
    <h5>google_logo Classes</h5>
    <button class="btn" onclick="window.alert('On the page that opens, select Project DTPS, and click Remove Access.'); window.open('https://myaccount.google.com/permissions?authuser=' + dtps.user.google.getEmail());"><i class="material-icons">link_off</i>Unlink Google Classroom</button>
    <br /><br />
    <p>Classes listed below could not be associated with a Canvas class. You can choose which classes to show in the sidebar.</p>
    <div class="isolatedGClassList"><p>Loading...</p></div>
</div>
<div class="googleSetup sudo">
    <h5>google_logo Classroom <div class="badge">beta</div></h5>
    <p>Link google_logo Classroom to see assignments and classes from both Canvas and Google.</p>
    <p>If Power+ thinks one of your Canvas classes also has a Google Classroom, it'll add a Google Classroom tab to that class. You can choose which extra classes to show in the sidebar.</p>
    <button onclick="if (window.confirm('EXPERIMENTAL FEATURE: Google Classroom features are still in development. Continue at your own risk. Please leave feedback by clicking the feedback button at the top right corner of Power+.')) { dtps.googleSetup = true; dtps.webReq('psGET', 'https://dtechhs.learning.powerschool.com/do/account/logout', function() { gapi.auth2.getAuthInstance().signIn().catch(function(err) { /*window.location.reload()*/ console.warn(err); }); })}" class="btn sudo"><i class="material-icons">link</i>Link Google Classroom</button>
</div>
</div>
<div style="display: none;" class="abtpage grades">
<h5>Grades</h5>
<div class="gradeDom">
<p>Loading...</p>
</div>
</div>
<div style="display: none;" class="abtpage extension">
    <h5>Extension</h5>
    <div class="extensionDom" ></div>
</div>
<div style="display: none;" class="abtpage experiments">
<div class="sudo">
    <h5>Experiments</h5>
    <p>WARNING: Features listed below are not officially supported and can break Power+. Use at your own risk.</p>
    <p>Want to test out new features as they are developed? <a href="https://dtps.js.org/devbookmark.txt">Try the dev version of Power+</a>.</p>
<br />
<div onclick="fluid.set('pref-cacao')" class="switch pref-cacao"><span class="head"></span></div>
<div class="label"><i class="material-icons">view_carousel</i> Project Cacao</div>
<br /><br />
</div>
</div>
<div style="display: none;" class="abtpage debug">
<div class="dev">
    <h5>Debugging</h5>
    <br>
        <div id="dtpsLocal" onclick="fluid.set('pref-localDtps')" class="switch pref-localDtps"><span class="head"></span></div>
        <div class="label"><i class="material-icons">public</i> Use local copy of Project DTPS</div>
<br /><br>
<button onclick="$('body').removeClass('sudo');$('body').removeClass('contributor');$('body').removeClass('og');$('body').removeClass('dev');">Remove badges</button>
    <br /><br>
<span class="log">
</span>
</div>
</div>
<div style="display: none;" class="abtpage about">
<h5>About</h5>
<div class="card" style="padding: 10px 20px; box-shadow: none !important; border: 2px solid var(--elements); margin-top: 20px;">
<img src="https://dtps.js.org/outline.png" style="height: 50px; margin-right: 10px; vertical-align: middle; margin-top: 20px;" />
<div style="display: inline-block; vertical-align: middle;">
<h4 style="font-weight: bold; font-size: 32px; margin-bottom: 0px;">Power+</h4>
<div style="font-size: 16px; margin-top: 5px;">` + dtps.readableVer + ` <div class="buildInfo" style="display: inline-block;margin: 0px 5px;font-size: 12px;cursor: pointer;"></div></div>
</div>
<div style="margin-top: 15px; margin-bottom: 7px;"><a onclick="dtps.changelog();" style="color: var(--lightText); margin: 0px 5px;" href="#"><i class="material-icons" style="vertical-align: middle">update</i> Changelog</a>
<a onclick="if (window.confirm('Are you sure you want to uninstall Power+? The extension will be removed and all of your Power+ data will be erased.')) { document.dispatchEvent(new CustomEvent('extensionData', { detail: 'extensionUninstall' })); window.localStorage.clear(); window.alert('Power+ has been uninstalled. Reload the page to go back to Canvas.') }" style="color: var(--lightText); margin: 0px 5px;" href="#"><i class="material-icons" style="vertical-align: middle">delete_outline</i> Uninstall</a>
<a style="color: var(--lightText); margin: 0px 5px;" href="https://github.com/jottocraft/dtps"><i class="material-icons" style="vertical-align: middle">code</i> GitHub</a></div>
</div>
     <div class="card" style="padding: 10px 20px; box-shadow: none !important; border: 2px solid var(--elements); margin-top: 20px;">
<img src="` + dtps.user.avatar_url + `" style="height: 50px; margin-right: 10px; vertical-align: middle; margin-top: 20px; border-radius: 50%;" />
<div style="display: inline-block; vertical-align: middle;">
<h4 style="font-weight: bold; font-size: 32px; margin-bottom: 0px;">` + dtps.user.name + ` <span style="font-size: 12px;">` + dtps.user.id + `</span></h4>

<div style="display:inline-block;" class="badge sudo">tester<i style="vertical-align: middle;" class="material-icons sudo">bug_report</i></div>
<div style="display:inline-block;" class="badge contributor">contributor<i style="vertical-align: middle;" class="material-icons contributor">group</i></div>
<div style="display:inline-block;" class="badge og">OG<i style="vertical-align: middle;" class="material-icons og">star_border</i></div>
<div style="display:inline-block;" class="badge dev">developer<i style="vertical-align: middle;" class="material-icons dev">code</i></div>
</div>
<div style="margin-top: 15px; margin-bottom: 7px;"><a style="color: var(--lightText); margin: 0px 5px;" href="/logout"><i class="material-icons" style="vertical-align: middle">exit_to_app</i> Logout</a></div>
</div>
<div class="card advancedOptions" style="padding: 8px 16px; box-shadow: none !important; border: 2px solid var(--elements); margin-top: 20px; display: none;">
<div style="display: inline-block; vertical-align: middle;">
<h4 style="font-weight: bold; font-size: 28px; margin-bottom: 0px;">Advanced Options</h4>
    <br />
    <div onclick="fluid.set('pref-canvasRAW')" class="switch pref-canvasRAW"><span class="head"></span></div>
    <div class="label"><i class="material-icons">description</i> Show raw Canvas data for assignments</div>
</div>
<div style="margin-top: 15px; margin-bottom: 7px;">
<a style="color: var(--lightText); margin: 0px 5px;" onclick="dtps.clearData();" href="#"><i class="material-icons" style="vertical-align: middle">refresh</i> Reset Power+</a>
<a style="color: var(--lightText); margin: 0px 5px;" onclick="dtps.render();" href="#"><i class="material-icons" style="vertical-align: middle">aspect_ratio</i> Re-render Power+</a>
<a style="color: var(--lightText); margin: 0px 5px;" href="https://github.com/jottocraft/dtps/issues/new/choose"><i class="material-icons" style="vertical-align: middle">feedback</i> Send feedback</a></div>
</div>
<br />
<p style="cursor: pointer; color: var(--secText, gray)" onclick="$('.advancedOptions').toggle(); $(this).hide();" class="advOp">Show advanced options</p>
<p>(c) 2018-2019 jottocraft (<a href="https://github.com/jottocraft/dtps/blob/master/LICENSE">license</a>)</p>
</div>
  </div>
</div>

<div style="display: none;" class="cacaoBar acrylicMaterial">
    <div onclick="dtps.cacao('a')" state="a" class="tab a active"><i class="material-icons">dashboard</i><span>Dashboard</span></div>
    <div onclick="dtps.cacao('new')" class="tab icon new"><i class="material-icons">add</i></div>
</div>
    <div class="items">
    <h4>` + dtps.user.name + `</h4>
    <img src="` + dtps.user.avatar_url + `" style="width: 50px; height: 50px; margin: 0px 5px; border-radius: 50%; vertical-align: middle;box-shadow: 0 5px 5px rgba(0, 0, 0, 0.17);" />
    <i onclick="window.open('https://github.com/jottocraft/dtps/issues/new/choose')" class="material-icons prerelease">feedback</i>
    <i onclick="$('.gradeDom').html(dtps.gradeHTML.join('')); if (dtps.gradeHTML.length == 0) { $('.sidenav .item.gradesTab').hide(); }; fluid.modal('.abt-new')" class="material-icons">settings</i>
    </div>
<div  style="width: calc(80%);border-radius: 30px;" class="card focus changelog close">
<i onclick="fluid.cards.close('.card.changelog')" class="material-icons close">close</i>
<h3>What's new in Power+</h3>
<h5>There was an error loading the changelog. Try again later.</h5>
</div>
<div  style="width: calc(80%);border-radius: 30px;" class="card focus details close">
<i onclick="fluid.cards.close('.card.details')" class="material-icons close">close</i>
<p>An error occured</p>
</div>

<div style="width: calc(80%); border-radius: 30px; top: 50px; background-color: white; color: black;" class="card focus close moduleURL">
<i style="color: black !important;" onclick="fluid.cards.close('.card.moduleURL')" class="material-icons close">close</i>
<br /><br />
<iframe style="width: 100%; height: calc(100vh - 175px); border: none;" id="moduleIFrame"></iframe>
</div>

<style id="colorCSS">` + (dtps.colorCSS ? dtps.colorCSS.join("") : "") + `</style>
<script>fluid.init();</script>
  `);
    var idleTime = 0;
    $(document).ready(function () {
        //Increment the idle time counter every minute.
        var idleInterval = setInterval(timerIncrement, 60000); // 1 minute

        //Zero the idle timer on mouse movement.
        $(this).mousemove(function (e) {
            idleTime = 0;
        });
        $(this).keypress(function (e) {
            idleTime = 0;
        });
    });

    function timerIncrement() {
        idleTime = idleTime + 1;
        if (idleTime > 60) { // Clear all saved assignment data to get the latest info
            dtps.requests = {};
            dtps.http = {};
            dtps.classesReady = 0;
            for (var i = 0; i < dtps.classes.length; i++) {
                dtps.classStream(i, true);
            }
        }
    }
    var getURL = "https://api.github.com/repos/jottocraft/dtps/commits?path=init.js";
    //if (dtps.trackSuffix !== "") var getURL = "https://api.github.com/repos/jottocraft/dtps/commits?path=dev.js";
    jQuery.getJSON(getURL, function (data) {
        jQuery(".buildInfo").html("build " + data[0].sha.substring(7, 0));
        jQuery(".buildInfo").click(function () {
            window.open("https://github.com/jottocraft/dtps/commit/" + data[0].sha)
        });
    })
    jQuery.getScript("https://cdnjs.cloudflare.com/ajax/libs/showdown/1.8.6/showdown.min.js", function () {
        markdown = new showdown.Converter();
        jQuery.getJSON("https://api.github.com/repos/jottocraft/dtps/releases", function (data) {
            jQuery(".card.changelog").html(`<i onclick="fluid.cards.close('.card.changelog')" class="material-icons close">close</i>` + markdown.makeHtml(data[0].body));
            if (data[0].tag_name == dtps.readableVer.replace(dtps.trackSuffix, "")) {
                localStorage.setItem('dtps', dtps.ver);
                if (dtps.showChangelog) dtps.changelog();
            }
            $(".btn.changelog").show();
        });
    });

    fluid.theme();
    dtps.showClasses("first");
    dtps.gapis();
    $("link").remove();
    jQuery("<link/>", {
        rel: "shortcut icon",
        type: "image/png",
        href: "https://dtps.js.org/favicon.png"
    }).appendTo("head");
    jQuery("<link/>", {
        rel: "stylesheet",
        type: "text/css",
        href: "https://dtps.js.org/fluid.css"
    }).appendTo("head");
    jQuery("<link/>", {
        rel: "stylesheet",
        type: "text/css",
        href: "https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/3.9.0/fullcalendar.min.css"
    }).appendTo("head");
    if (dtps.trackSuffix !== "") {
        jQuery("<link/>", {
            rel: "stylesheet",
            type: "text/css",
            href: "https://dtps.js.org/dev.css"
        }).appendTo("head");
    } else {
        jQuery("<link/>", {
            rel: "stylesheet",
            type: "text/css",
            href: "https://dtps.js.org/dtps.css"
        }).appendTo("head");
    }
    jQuery("<link/>", {
        rel: "stylesheet",
        type: "text/css",
        href: "https://fonts.googleapis.com/icon?family=Material+Icons+Extended"
    }).appendTo("head");
    jQuery('.classContent').bind('heightChange', function () {
        jQuery(".sidebar").css("height", Number(jQuery(".classContent").css("height").slice(0, -2)))
    });

    fluid.init();
}

dtps.init();
