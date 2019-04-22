/* Power+ for Canvas v2.0.0 [CANARY]
(c) 2018 - 2019 jottocraft
https://github.com/jottocraft/dtps
Flight 04102019
Email: canary@jottocraft.com */

//Basic global Power+ configuration. All global Power+ variables go under dtps
var dtps = {
    ver: 200,
    readableVer: "v2.0.0 (web)",
    trackSuffix: " (web)",
    trackColor: "#0084dc",
    showLetters: false,
    fullNames: false,
    oauth: {
        clientID: "10000000000003",
        clientSecret: "crCLyaH4vT8hXaRBLe80kJ6RoHCJPcZXXGnnpEDe7ypnnXBu7KuPHcEzPqygyhZS",
        redirectURI: "https://dtps.js.org/app",
        logout: function () {
            $.ajax({ url: 'https://cors-anywhere.herokuapp.com/http://lms.jottocraft.com/login/oauth2/token?access_token=' + dtps.oauth.token, type: 'DELETE', success: function() { window.localStorage.removeItem("dtpsRefresh"); window.localStorage.removeItem("dtpsUser"); window.location.href = "https://dtps.js.org?logout=true" } });
        }
    },
    latestStream: []
};

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
<li style="color: red;"><b>Power+` + dtps.trackSuffix + ` is still in early stages of development and hasn't been publicly released yet. Things will break.</b></li>
<li><b>Power+` + dtps.trackSuffix + ` may have bugs that cause it to display an inaccurate representation of your grades and assignments. Use Power+` + dtps.trackSuffix + ` at your own risk.</b></li>
</form><div class="ui-dialog-buttonpane ui-widget-content ui-helper-clearfix"><div class="ui-dialog-buttonset"><button onclick="jQuery('#dtpsNativeAlert').remove();jQuery('#dtpsNativeOverlay').remove();" type="button" data-text-while-loading="Cancel" class="btn dialog_closer ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only" role="button" aria-disabled="false"><span class="ui-button-text">Cancel</span></button><button onclick="localStorage.setItem('dtpsInstalled', 'true'); dtps.render();" type="button" data-text-while-loading="Loading Power+..." class="btn btn-primary button_type_submit ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only" role="button" aria-disabled="false"><span class="ui-button-text">Continue</span></button></div></div></div>
<div id="dtpsNativeOverlay" class="ui-widget-overlay" style="width: 100%; height: 100%; z-index: 500;"></div>`)
};

//Displays a native Canvas alert (cannot be used after Power+ is rendered / dtps.render)
dtps.nativeAlert = function (text, sub, loadingSplash) {
    if (text == undefined) var text = "";
    if (sub == undefined) var sub = "";
    if (loadingSplash) {
        jQuery("body").append(`<div id="dtpsNativeOverlay" class="ui-widget-overlay" style="width: 100%;height: 100%;z-index: 500;background: rgba(31, 31, 31, 0.89);">&nbsp;<h1 style="position: fixed;font-size: 125px;background: -webkit-linear-gradient(rgb(255, 167, 0), rgb(255, 244, 0));-webkit-background-clip: text;-webkit-text-fill-color: transparent;font-weight: bolder;font-family: Product sans;text-align: center;top: 200px;width: 100%;">Power+</h1><h5 style="font-family: Product sans;font-size: 30px;color: gray;width: 100%;text-align: center;position: fixed;top: 375px;">` + sub + `</h5><div class="spinner" style="margin-top: 500px;"> <div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>
<style>@font-face{font-family: 'Product sans'; font-display: auto; font-style: normal; font-weight: 400; src: url(https://fluid.js.org/product-sans.ttf) format('truetype');}.spinner{margin: 100px auto 0; width: 70px; text-align: center;}.spinner > div{width: 18px; height: 18px; background-color: gray; border-radius: 100%; display: inline-block; -webkit-animation: sk-bouncedelay 1.4s infinite ease-in-out both; animation: sk-bouncedelay 1.4s infinite ease-in-out both;}.spinner .bounce1{-webkit-animation-delay: -0.32s; animation-delay: -0.32s;}.spinner .bounce2{-webkit-animation-delay: -0.16s; animation-delay: -0.16s;}@-webkit-keyframes sk-bouncedelay{0%, 80%, 100%{-webkit-transform: scale(0)}40%{-webkit-transform: scale(1.0)}}@keyframes sk-bouncedelay{0%, 80%, 100%{-webkit-transform: scale(0); transform: scale(0);}40%{-webkit-transform: scale(1.0); transform: scale(1.0);}}</style></div>`)
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

//Sends a copy of error messages and logs without grade data for debugging
dtps.bugReport = function () {
    if (window.confirm("If the issue is related to a class in any way, make sure you have that class selected before sending this bug report. By sending a bug report, logs and usage information will be sent for debugging purposes (grades will never be sent in a bug report).")) {
        Sentry.configureScope((scope) => {
            scope.setExtra("class-selected", dtps.selectedClass + (dtps.selectedClass !== "dash" ? "-" + dtps.classes[dtps.selectedClass].id : ""));
            if (dtps.selectedClass !== "dash") {
                var streamTmp = JSON.parse(JSON.stringify(dtps.classes[dtps.selectedClass].stream));
                streamTmp.forEach(function (v) { if (v.grade) { v.grade = v.grade.replace(v.grade.split("/")[0], "X") }; if (v.letter) { v.letter = "X" }; })
                scope.setExtra("selected-stream", JSON.stringify(streamTmp));
            }
        });
        window.alert("Thanks for sending a bug report. Report ID: " + Sentry.captureMessage("BUG REPORT (BUILD " + $(".buildInfo").html().replace("build ", "") + "): " + window.prompt('Please describe the issue:')));
    }
}

//Crash report is exactly the same as bug report but it sends less information so it can send data before Power+ can fully load
dtps.crashReport = function () {
    if (window.confirm("If the issue is related to a class in any way, make sure you have that class selected before sending this bug report. By sending a bug report, logs and usage information will be sent for debugging purposes (grades will never be sent in a bug report).")) {
        try {
            Sentry.configureScope((scope) => {
                scope.setExtra("class-selected", dtps.selectedClass + (dtps.selectedClass !== "dash" ? "-" + dtps.classes[dtps.selectedClass].id : ""));
            });
        } catch (e) { }
        window.alert("Thanks for sending a crash report. Report ID: " + Sentry.captureMessage("CRASH REPORT: " + window.prompt('Please describe the issue:')));
    }
}

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
                dtps.http[url].open("GET", "https://cors-anywhere.herokuapp.com/" + "http://lms.jottocraft.com" + url + (url.indexOf('?') != -1 ? "&access_token=" : "?access_token=") + dtps.oauth.token, true);
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

//Calculates the class grade as a percentage based on weights and assignment grades
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

dtps.getUrlVars = function () {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return vars;
}

//Starts Power+
dtps.init = function () {
    dtps.log("Starting DTPS " + dtps.readableVer + "...");
    dtps.param = dtps.getUrlVars();
    window.history.replaceState(null, null, window.location.pathname);
    document.title = "Power+" + dtps.trackSuffix;
    if (window.localStorage.dtpsRefresh) {
        $.post("https://cors-anywhere.herokuapp.com/http://lms.jottocraft.com/login/oauth2/token", { grant_type: "refresh_token", refresh_token: window.localStorage.dtpsRefresh, client_id: dtps.oauth.clientID, client_secret: dtps.oauth.clientSecret }).done(function (data) {
            window.localStorage.setItem("dtpsUser", JSON.stringify(data.user))
            dtps.oauth.token = data.access_token
            dtps.webReq("canvas", "/api/v1/users/self", function (user) {
                dtps.user = JSON.parse(user);
                //TEMPORARY
                jQuery("body").addClass("sudo");
                sudoers = ["10837719", "10838212", "10894474", "10463823"]
                if (sudoers.includes(dtps.user.id)) { jQuery("body").addClass("sudo"); dtps.log("Sudo mode enabled"); }
                og = ["10894474", "10837719"]
                if (og.includes(dtps.user.id)) { jQuery("body").addClass("og"); }
                highFlyers = ["10894474", "10837719"]
                if (highFlyers.includes(dtps.user.id)) { jQuery("body").addClass("highFlyer"); }
                contributors = ["10837719", "10463823", "10894474"]
                if (contributors.includes(dtps.user.id)) { jQuery("body").addClass("contributor"); }
                if (/*dtps.user.id == "10837719"*/true) { jQuery("body").addClass("dev"); dtps.log("Dev mode enabled"); }
                if ((dtps.trackSuffix !== "") && (dtps.trackSuffix !== "GM")) jQuery("body").addClass("prerelease");
                if (sudoers.includes(dtps.user.id)) jQuery("body").addClass("prerelease");
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
                dtps.showChangelog = false;
                dtps.webReq("canvas", "/api/v1/users/self/colors", function (colorsResp) {
                    dtps.webReq("canvas", "/api/v1/users/self/dashboard_positions", function (dashboardResp) {
                        dtps.webReq("canvas", "/api/v1/courses?include[]=total_scores&include[]=public_description&include[]=favorites&include[]=total_students&include[]=account&include[]=teachers", function (resp) {
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
                                if (name.includes("Prototyping")) { var subject = "Prototyping"; var icon = "drive_file_rename_outline"; }; if (name.includes("Algebra")) { var subject = "Algebra"; }; if (name.includes("Algebra 2")) { var subject = "Algebra 2"; if (highFlyers.includes(dtps.user.id)) { subject = "Algebra 2 High Flyers" } };
                                if (name.includes("Spanish")) { var subject = "Spanish" }; if (name.includes("@") || name.includes("dtech")) { var subject = "@d.tech" }; if (name.includes("Environmental")) { var subject = "Environmental Science" };
                                if (name.includes("Robotics")) { var subject = "Robotics" }; if (name.includes("Biology")) { var subject = "Biology" }; if (name.includes("Engineering")) { var subject = "Engineering" }; if (name.includes("Geometry")) { var subject = "Geometry" };
                                if (name.includes("Photography")) { var subject = "Photography" }; if (name.includes("World History")) { var subject = "World History" }; if (name.includes("U.S. History")) { var subject = "US History" };
                                if (name.includes("Calculus")) { var subject = "Calculus" }; if (name.includes("Precalculus")) { var subject = "Precalculus" }; if (name.includes("Statistics")) { var subject = "Advanced Statistics" };
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
                                    num: i
                                })
                                if (!dtps.filter(colors.custom_colors["course_" + data[i].id])) {
                                    dtps.colorCSS.push(`\n.` + dtps.classes[i].col + ` {
	--light: ` + dtps.classes[i].light + `;
	--norm: ` + dtps.classes[i].norm + `;
 	--dark: ` + dtps.classes[i].dark + `;
  --text: ` + (dtps.classes[i].isBright ? dtps.classes[i].dark : "white") + `;
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
                                    dtps.classStream(i);
                                }
                            }
                            dtps.log("Grades loaded: ", dtps.classes);
                            var total = 0;
                            for (var i = 0; i < gpa.length; i++) {
                                total += gpa[i];
                            }
                            dtps.gpa = total / gpa.length;
                            dtps.render();
                        });
                    });
                });
            });
        }).fail(() => { window.localStorage.removeItem("dtpsRefresh"); window.localStorage.removeItem("dtpsUser"); dtps.init(); });
    } else {
        if (dtps.param.code && (dtps.param.state == "dtps-login")) {
            $.post("https://cors-anywhere.herokuapp.com/http://lms.jottocraft.com/login/oauth2/token", { grant_type: "authorization_code", code: dtps.param.code, client_id: dtps.oauth.clientID, client_secret: dtps.oauth.clientSecret, redirect_uri: dtps.oauth.redirectURI }).done(function (data) {
                window.localStorage.setItem("dtpsRefresh", data.refresh_token)
                window.localStorage.setItem("dtpsUser", JSON.stringify(data.user))
                dtps.oauth.token = data.access_token
                dtps.init();
            }).fail(() => { alert("An login error occured"); window.location.href = "https://dtps.js.org"; });
        } else {
            window.location.href = 'http://lms.jottocraft.com/login/oauth2/auth?client_id=' + dtps.oauth.clientID + '&response_type=code&state=dtps-login&redirect_uri=' + dtps.oauth.redirectURI;
        }
    }
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
<div class="spinner">
  <div class="bounce1"></div>
  <div class="bounce2"></div>
  <div class="bounce3"></div>
</div>
`);
        jQuery(".classContent").html("");
    }
    dtps.webReq("canvas", "/api/v1/courses/" + dtps.classes[num].id + "/pages", function (resp) {
        var data = JSON.parse(resp);
        if (data.error) {
            jQuery(".sidebar").html(`<div onclick="dtps.selectedContent = 'stream'; dtps.classStream(dtps.selectedClass);" class="class back">
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
      <div onclick="dtps.selectedPage = ` + data[i].page_id + `" class="class">
      <div class="name">` + data[i].title + `</div>
      <div class="grade"><i class="material-icons">notes</i></div>
      </div>
      `);
            }
            if ((dtps.selectedClass == num) && (dtps.selectedContent == "pages")) {
                jQuery(".sidebar").html(`<div onclick="dtps.selectedContent = 'stream'; dtps.classStream(dtps.selectedClass);" class="class back">
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
    <div class="spinner">
    <div class="bounce1"></div>
    <div class="bounce2"></div>
    <div class="bounce3"></div>
    </div>
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
                        url: data[i].assignments[ii].submission.preview_url,
                        body: data[i].assignments[ii].description,
                        worth: data[i].assignments[ii].points_possible
                    });
                    dtps.classes[num].streamitems.push(data[i].assignments[ii].id);
                    if (data[i].assignments[ii].submission.score !== null) {
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
        ` + (stream[i].locked ? `<i title="Assignment submissions are locked" class="material-icons floatingIcon" style="font-family: 'Material Icons Extended'; color: var(--flex-sectext, gray);">lock_outline</i>` : ``) + `
        ` + (stream[i].status == "pending_review" ? `<i title="Grade is unpublished and is pending review" class="material-icons floatingIcon" style="color: #b3b70b;">rate_review</i>` : ``) + `
        <div class="points">
        <div class="earned numbers">` + (stream[i].letter ? (!"ABC0123456789".includes(stream[i].letter.split("")[0]) ? stream[i].letter : stream[i].grade.split("/")[0]) : "") + `</div>
	<div class="earned letters">` + stream[i].letter + `</div>
        ` + (stream[i].grade ? (stream[i].grade.split("/")[1] !== undefined ? `<div class="total possible">/` + stream[i].grade.split("/")[1] + `</div>` : "") : "") + `
	` + (stream[i].grade ? (stream[i].grade.split("/")[1] !== undefined ? `<div class="total percentage">` + ((Number(stream[i].grade.split("/")[0]) / Number(stream[i].grade.split("/")[1])) * 100).toFixed(2) + `%</div>` : "") : "") + `
        </div>
        <h4>` + stream[i].title + `</h4>
      	<h5>
         ` + (stream[i].due ? `<div class="infoChip"><i style="margin-top: -4px;" class="material-icons">alarm</i> Due ` + stream[i].due + `</div>` : "") + ` 
        ` + ((stream[i].weight !== undefined) && stream[i].uniqueWeight ? `<div class="infoChip weighted">` + stream[i].weightIcon + stream[i].weight.replace("Comprehension Checks", "CC").replace("Success Skills", "SS").replace("Performance Tasks", "PT") + `</div>` : "") + `
        ` + (stream[i].outcome !== undefined ? `<div class="infoChip weighted"><i class="material-icons">star_border</i>` + stream[i].outcome + `</div>` : "") + `
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
    return ((streamlist.length == 0) && (dtps.selectedClass !== "dash")) ? (searchRes !== "" ? `<div style="text-align: right;"><i class="inputIcon material-icons">search</i><input value="` + searchRes + `" onchange="dtps.search()" class="search inputIcon shadow" placeholder="Search assignments" type="search" /></div>` : "") + `<div style="cursor: auto;" class="card assignment"><h4>No ` + (searchRes == "" ? "assignments" : "results found") + `</h4><p>` + (searchRes == "" ? "There aren't any assignments in this class yet" : "There aren't any search results") + `</p></div>` : ((typeof Fuse !== "undefined" ? `<div style="text-align: right;"><i class="inputIcon material-icons">search</i><input value="` + searchRes + `" onchange="dtps.search()" class="search inputIcon shadow" placeholder="Search assignments" type="search" /></div>` : "") + streamlist.join(""));
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
    for (var i = 0; i < dtps.classes.length; i++) {
        if (dtps.classes[i].subject.includes("Algebra 2")) {
            if (highFlyers.includes(dtps.user.id)) {
                $(".badge.highFlyer").css("background-color", window.getComputedStyle(jQuery(".sidebar .class." + i)[0]).getPropertyValue("--dark"));
            }
        }
    }
    if (dtps.selectedClass == "dash") {
        jQuery(".classContent").html(`
    <div class="spinner">
    <div class="bounce1"></div>
    <div class="bounce2"></div>
    <div class="bounce3"></div>
    </div>
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
        loadingDom = `<div class="spinner">
    <div class="bounce1"></div>
    <div class="bounce2"></div>
    <div class="bounce3"></div>
    </div>`;
    } else {
        dtps.logGrades();
    }
    if (dtps.selectedClass == "dash") {
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
        // Compare the 2 dates
        if (keyA < keyB) return 1;
        if (keyA > keyB) return -1;
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
        jQuery(".classContent").html(`
    <div class="spinner">
    <div class="bounce1"></div>
    <div class="bounce2"></div>
    <div class="bounce3"></div>
    </div>
  `);
    }
    var spinnerTmp = true;
    dtps.webReq("canvas", "/api/v1/courses/" + classID + "/pages/" + id, function (resp) {
        var data = JSON.parse(resp);
        if ((dtps.classes[dtps.selectedClass].id == classID) && (dtps.selectedContent == "pages")) {
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
                    weightsTmp.push(`<div style="display: none;" class="weight ` + i + `"><h4>` + dtps.classes[num].weights[i].weight + `<div style="color: var(--flex-sectext, gray); text-align: right; font-size: 24px; float: right; display: inline-block;">` + dtps.classes[num].weights[i].grade + `</div></h4>` + assignTmp.join("") + `</div>`);
                    weightOverview.push(`<div onclick="$('.weight').hide(); $('.weight.` + i + `').show();" class="progressBar big"><div class="progressLabel">` + dtps.classes[num].weights[i].weight + `</div><div class="progress" style="width: calc(` + dtps.classes[num].weights[i].grade + ` - 300px);"></div></div>`)
                }
                var headsUp = `<div class="card" style="background-color: #3cc15b;color: white;padding: 10px 20px;"><i class="material-icons" style="margin-right: 10px;font-size: 32px;display: inline-block;vertical-align: middle;">check_circle_outline</i><h5 style="display: inline-block;vertical-align: middle;margin-right: 5px;">On track to pass&nbsp;&nbsp;<span style="font-size: 18px;">Power+ didn't detect any DVs in any of your CCs or PTs</span></h5></div>`
                if (DVs > 0) {
                    headsUp = `<div class="card" style="background-color: #c14d3c;color: white;padding: 10px 20px;"><i class="material-icons" style="margin-right: 10px;font-size: 32px;display: inline-block;vertical-align: middle;">cancel</i><h5 style="display: inline-block;vertical-align: middle;margin-right: 5px;">You're at risk of failing this class&nbsp;&nbsp;<span style="font-size: 18px;">Power+ detected ` + DVs + ` DV(s) in your CCs/PTs</span></h5></div>`
                }
                headsUp = `<div class="card" style="background-color: #e5bf27;color: white;padding: 10px 20px;"><i class="material-icons" style="margin-right: 10px;font-size: 32px;display: inline-block;vertical-align: middle;">build</i><h5 style="display: inline-block;vertical-align: middle;margin-right: 5px;">Under construction&nbsp;&nbsp;<span style="font-size: 18px;">The Power+ for Canvas gradebook is still being developed. Use at your own risk.</span></h5></div>`
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
<h5><i class="material-icons" style="vertical-align: middle; margin-right: 10px;">trending_up</i>Boost your grade (beta)</h5>
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
        $.get("/courses/" + dtps.classes[classNum].id + "/assignments/" + id, function (data) {
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
<iframe style="width: 100%; height: calc(100vh - 175px); border: none;" src="` + assignment.url + `"></iframe>`);
            } else {
                $(".card.details").css("background-color", "")
                $(".card.details").css("color", "")
                $(".card.details").html(`<i onclick="fluid.cards.close('.card.details')" class="material-icons close">close</i><h3>` + assignment.title + `</h3><br /><div class="list">` + `
<div style="cursor: auto;margin: 0px; padding: 10px 15px;" class="item"><i class="material-icons">add_box</i><b>Posted</b>:  ` + assignment.published + `</div>
` + (assignment.due ? `<div style="cursor: auto;margin: 0px; padding: 10px 15px;" class="item"><i class="material-icons">access_time</i><b>Due</b>:  ` + assignment.due + `</div>` : "") + `
` + (assignment.locksAt ? `<div style="cursor: auto;margin: 0px; padding: 10px 15px;" class="item"><i class="material-icons" style="font-family: 'Material Icons Extended'">lock_outline</i><b>Locks</b>:  ` + new Date(assignment.locksAt).toDateString().slice(0, -5) + ", " + dtps.ampm(new Date(assignment.locksAt)) + `</div>` : "") + `
` + (assignment.unlocksAt ? `<div style="cursor: auto;margin: 0px; padding: 10px 15px;" class="item"><i class="material-icons">lock_open</i><b>Unlocks</b>:  ` + new Date(assignment.unlocksAt).toDateString().slice(0, -5) + ", " + dtps.ampm(new Date(assignment.unlocksAt)) + `</div>` : "") + `
` + (assignment.status ? `<div style="cursor: auto;margin: 0px; padding: 10px 15px;" class="item"><i class="material-icons">assignment_return</i><b>Status</b>:  ` + (assignment.status == "submitted" ? "Submitted" : (assignment.status == "unsubmitted" ? "Unsubmitted" : (assignment.status == "graded" ? "Graded" : (assignment.status == "pending_review" ? "Pending Review" : assignment.status)))) + `</div>` : "") + `
<div style="cursor: auto;margin: 0px; padding: 10px 15px;" class="item"><i class="material-icons">assessment</i><b>Total Points</b>:  ` + assignment.worth + `</div>
` + (assignment.grade ? `<div style="cursor: auto;margin: 0px; padding: 10px 15px;" class="item"><i class="material-icons">assessment</i><b>Points earned</b>:  ` + assignment.grade + ` (` + assignment.letter + `)</div>` : "") + `
<div style="cursor: auto;margin: 0px; padding: 10px 15px;" class="item"><i class="material-icons">category</i><b>Group</b>:  ` + assignment.weight + `</div>
` + (assignment.outcome ? `<div style="cursor: auto;margin: 0px; padding: 10px 15px;" class="item"><i class="material-icons">star_border</i><b>Outcome</b>:  ` + assignment.outcome + `</div>` : "") + `
<div style="cursor: auto;margin: 0px; padding: 10px 15px;" class="item"><i class="material-icons">class</i><b>Class</b>:  ` + assignment.subject + `</div>
` + (contributors.includes(dtps.user.id) ? `<div style="cursor: auto;margin: 0px; padding: 10px 15px;" class="item"><i class="material-icons">bug_report</i><b>Debugging</b>:  Coming soon</div>` : "") + `
` + `</div><br /><br />` + (assignment.body ? assignment.body : "") + `<br /><br />
` + (assignment.types.includes("online_text_entry") ? (assignment.turnedIn ? `<div class="btn" onclick="dtps.assignment(` + id + `, ` + classNum + `, 'handIN')"><i class="material-icons">assignment_returned</i> Resubmit</div>` : `<div class="btn" onclick="dtps.assignment(` + id + `, ` + classNum + `, 'handIN')"><i class="material-icons">assignment</i> Hand In</div>`) : ``) + `
<div class="btn" onclick="dtps.assignment(` + id + `, ` + classNum + `, true)"><i class="material-icons" style="font-family: 'Material Icons Extended'">description</i> Submissions</div>
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
        if (dtps.selectedClass == "dash") {
            jQuery(".dash .announcements").html(announcements.join(""));
        }
    });
};

//Compiles and displays assignment due dates in the calendar
dtps.calendar = function (doneLoading) {
    dtps.log("BUILDING CAL")
    if (dtps.selectedClass == "dash") {
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
        for (var i = 0; i < dtps.classes.length; i++) {
            if (dtps.classes[i].subject.includes("Algebra 2")) {
                if (highFlyers.includes(dtps.user.id)) {
                    $(".badge.highFlyer").css("background-color", window.getComputedStyle(jQuery(".sidebar .class." + i)[0]).getPropertyValue("--dark"));
                }
            }
        }
        if (dtps.selectedClass !== "dash") $(".class." + dtps.selectedClass).addClass("active");
        if ($(".btn.pages").hasClass("active")) { $(".btn.pages").removeClass("active"); $(".btn.stream").addClass("active"); dtps.classStream(dtps.selectedClass); dtps.selectedContent = "stream"; }
        $(".class:not(.google)").click(function (event) {
            if (dtps.selectedClass == "dash") $('body').addClass('dashboard');
            if (dtps.selectedClass !== "dash") $('body').removeClass('dashboard');
            $('body').removeClass('isolatedGoogleClass');
            $(".btn.google").hide();
            $(".background").addClass("trans");
            clearTimeout(dtps.bgTimeout);
            dtps.bgTimeout = setTimeout(function () {
                fluid.onThemeChange();
                $(".background").removeClass("trans");
            }, 500);
            $(".background").removeClass(jQuery.grep($(".background").attr("class").split(" "), function (item, index) {
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
                $(".header").addClass(dtps.classes[dtps.selectedClass].col)
            }
            $(this).siblings().removeClass("active")
            $(this).addClass("active")
            $(".header h1").html($(this).children(".name").text())
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

//Renders Power+
dtps.render = function () {
    
    if (window.localStorage.dtpsLetterGrades == "true") { $("body").addClass("letterGrades"); }
    if (window.localStorage.dtpsFullNames == "true") { dtps.fullNames = true; }
    if (!dtps.currentClass) {
        dtps.selectedClass = "dash";
        dtps.selectedContent = "stream";
    }
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

    $("#colorCSS").html(dtps.colorCSS.join(""));

    $(".card.settings").html(`<i onclick="fluid.cards.close('.card.settings')" class="material-icons close">close</i>
    <div class="sidenav" style="position: fixed; height: calc(100% - 50px); border-radius: 20px 0px 0px 20px;">
      <div class="title">
        <img src="https://dtps.js.org/outline.png" style="width: 50px;vertical-align: middle;padding: 7px; padding-top: 14px;" />
        <div style="vertical-align: middle; display: inline-block;">
        <h5 style="font-weight: bold;display: inline-block;vertical-align: middle;">Power+</h5>` + trackDom + `
        <p style="font-weight: bold;">` + verDom + `</p>
        </div>
      </div>
      <div onclick="$('.abtpage').hide();$('.abtpage.display').show();" class="item active">
        <i class="material-icons">aspect_ratio</i> Display
      </div>
      <div onclick="$('.abtpage').hide();$('.abtpage.classes').show();" class="item">
        <i class="material-icons">book</i> Classes
      </div>
      <div onclick="$('.abtpage').hide();$('.abtpage.grades').show();" class="item">
        <i class="material-icons">account_circle</i> Profile
      </div>
      <div onclick="$('.abtpage').hide();$('.abtpage.debug').show();" class="item dev">
        <i class="material-icons">bug_report</i> Debugging
      </div>
      <div onclick="$('.abtpage').hide();$('.abtpage.about').show(); $('.advancedOptions').hide(); $('.advOp').show();" class="item">
        <i class="material-icons">info</i> About
      </div>
    </div>
    <div class="content">
  <div class="abtpage display">
      <h5>Display</h5>
      <br />
      <p>Theme</p>
      <div class="btns row themeSelector"></div>
      <br /><br />
      <div onclick="jQuery('body').toggleClass('hidegrades')" class="switch"><span class="head"></span></div>
      <div class="label"><i class="material-icons">visibility_off</i> Hide class grades</div>
      <br /><br />
      <div onclick="dtps.gradeTrend(this);" class="switch` + (String(window.localStorage.dtpsGradeTrend).startsWith("{") ? " active" : "") + `"><span class="head"></span></div>
      <div class="label"><i class="material-icons">timeline</i> Show grade trend</div>
      <br /><br />
      <div onclick="$('body').toggleClass('letterGrades'); localStorage.setItem('dtpsLetterGrades', $('body').hasClass('letterGrades'));" class="switch` + (window.localStorage.dtpsLetterGrades == "true" ? " active" : "") + `"><span class="head"></span></div>
      <div class="label"><i class="material-icons">font_download</i> Prefer letter grades on assignments</div>
      <br /><br />
      <div onclick="dtps.fullNames = !dtps.fullNames; localStorage.setItem('dtpsFullNames', dtps.fullNames); dtps.showClasses(true);" class="switch` + (window.localStorage.dtpsFullNames == "true" ? " active" : "") + `"><span class="head"></span></div>
      <div class="label"><i class="material-icons">title</i> Show full class names</div>
  </div>
  <div style="display: none;" class="abtpage classes">
  <h5>Classes</h5>
  <button onclick="dtps.schedule()" class="btn"><i class="material-icons">access_time</i>Schedule classes</button>
  <br /><br />
  <div class="googleClassroom prerelease">
      <h5>google_logo Classes</h5>
      <button class="btn" onclick="window.alert('On the page that opens, select Project DTPS, and click Remove Access.'); window.open('https://myaccount.google.com/permissions?authuser=' + dtps.user.google.getEmail());"><i class="material-icons">link_off</i>Unlink Google Classroom</button>
      <br /><br />
      <p>Classes listed below could not be associated with a Canvas class. You can choose which classes to show in the sidebar.</p>
      <div class="isolatedGClassList"><p>Loading...</p></div>
  </div>
  <div class="googleSetup prerelease">
      <h5>google_logo Classroom</h5>
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
  <div style="display: none;" class="abtpage debug">
  <div class="dev">
      <h5>Debugging</h5>
      <br>
          <div id="dtpsLocal" onclick="if (window.localStorage.dtpsLocal == 'false') {localStorage.setItem('dtpsLocal', true);} else {localStorage.setItem('dtpsLocal', false);}" class="switch"><span class="head"></span></div>
          <div class="label"><i class="material-icons">extension</i> Use local copy of Project DTPS</div>
      <br /><br>
  <span class="log">
  </span>
  </div>
  </div>
  <div style="display: none;" class="abtpage about">
      <h5>Power+ ` + dtps.readableVer + ` <div class="buildInfo" style="display: inline-block;margin: 0px 5px;font-size: 12px;cursor: pointer;"></div></h5>
      <p>Made by <a href="https://github.com/jottocraft">jottocraft</a></p>
      <button onclick="dtps.changelog();" style="display:none;" class="btn changelog"><i class="material-icons">update</i>Changelog</button>
       <br /><br />
     <h5>Logged in as ` + dtps.user.name + ` <span style="font-size: 12px;">` + dtps.user.id + `</span></h5>
  <div style="display:inline-block;" class="beta badge notice highFlyer">high flyer&nbsp;<i style="vertical-align: middle;" class="material-icons highFlyer">school</i></div>
  <div style="display:inline-block;" class="beta badge notice sudo">tester&nbsp;<i style="vertical-align: middle;" class="material-icons sudo">bug_report</i></div>
  <div style="display:inline-block;" class="beta badge notice contributor">contributor&nbsp;<i style="vertical-align: middle;" class="material-icons contributor">group</i></div>
  <div style="display:inline-block;" class="beta badge notice og">OG&nbsp;<i style="vertical-align: middle;" class="material-icons og">star_border</i></div>
  <!-- <div style="display:inline-block;" class="beta badge notice dev">developer&nbsp;<i style="vertical-align: middle;" class="material-icons dev">code</i></div> -->
  <br /><br />
      <h5>Credits</h5>
  <ul>
      <li>Calendar made with <a href="https://fullcalendar.io/">FullCalendar</a></li>
      <li>Logo made with logomakr.com</li>
  </ul>
  <br />
  <p style="cursor: pointer; color: var(--flex-sectext, gray)" onclick="$('.advancedOptions').toggle(); $(this).hide();" class="advOp">Show advanced options</p>
  <div class="advancedOptions" style="display: none;">
  <p style="cursor: pointer; color: var(--flex-sectext, gray)" onclick="dtps.bugReport();">Send a bug report</p>
  <p style="cursor: pointer; color: var(--flex-sectext, gray)" onclick="dtps.clearData();">Reset Power+ (Clear all user data)</p>
  <p style="cursor: pointer; color: var(--flex-sectext, gray)" onclick="dtps.render();">Re-render Power+</p>
  </div>
  <p><span onclick="dtps.bugReport()">(c)</span> 2018-2019 jottocraft (<a href="https://github.com/jottocraft/dtps/blob/master/LICENSE">license</a>)</p>
  </div>
    </div>
  </div>`)

    $(".items").html(` <h4>` + dtps.user.name + `</h4>
    <img src="` + dtps.user.avatar_url + `" style="width: 50px; height: 50px; margin: 0px 5px; border-radius: 50%; vertical-align: middle;box-shadow: 0 5px 5px rgba(0, 0, 0, 0.17);" />
    <i title="Send feedback" onclick="window.location.href = 'mailto:canary@jottocraft.com'" class="material-icons">feedback</i>
    <i title="Logout" onclick="dtps.oauth.logout();" class="material-icons">exit_to_app</i>
    <i title="Settings" onclick="$('.gradeDom').html(dtps.gradeHTML.join('')); fluid.modal('.card.settings')" class="material-icons">settings</i>`)

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
    jQuery.getJSON((dtps.trackSuffix !== "" ? "https://api.github.com/repos/jottocraft/dtps/commits?path=dev.js" : "https://api.github.com/repos/jottocraft/dtps/commits?path=init.js"), function (data) {
        jQuery(".buildInfo").html("build " + data[0].sha.substring(7, 0));
        Sentry.configureScope((scope) => {
            scope.setTag("build", data[0].sha.substring(7, 0) + dtps.trackSuffix);
        });
        jQuery(".buildInfo").click(function () {
            window.open("https://github.com/jottocraft/dtps/commit/" + data[0].sha)
        });
    })

    markdown = new showdown.Converter();
    jQuery.getJSON("https://api.github.com/repos/jottocraft/dtps/releases", function (data) {
        jQuery(".card.changelog").html(`<i onclick="fluid.cards.close('.card.changelog')" class="material-icons close">close</i>` + markdown.makeHtml(data[0].body));
        if (data[0].tag_name == dtps.readableVer.replace(dtps.trackSuffix, "")) {
            localStorage.setItem('dtps', dtps.ver);
            if (dtps.showChangelog) dtps.changelog();
        }
        $(".btn.changelog").show();
    });


    dtps.showClasses("first");
    $("body").removeClass("noSidebar")
    dtps.gapis();
    jQuery('.classContent').bind('heightChange', function () {
        jQuery(".sidebar").css("height", Number(jQuery(".classContent").css("height").slice(0, -2)))
    });

    fluid.onThemeChange = function () {
        var next = window.getComputedStyle(document.getElementsByClassName("background")[0]).getPropertyValue("--grad")
        if (dtps.selectedClass !== "dash") next = "linear-gradient(to bottom right, " + window.getComputedStyle(document.getElementsByClassName("background")[0]).getPropertyValue($("body").hasClass("midnight") ? "--dark" : "--light") + ", " + ($("body").hasClass("dark") ? "var(--flex-bg, #252525)" : "var(--flex-bg, white)") + ")"
        if (dtps.selectedClass !== "dash") $('body').removeClass('dashboard');
        $(".background").css("background", next)
    }

    fluid.init();
}

dtps.init();