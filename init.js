/* Power+ v2.1.1
(c) 2018 - 2019 jottocraft
https://github.com/jottocraft/dtps */

//prevent Power+ from breaking when the button is clicked multiple times
if (typeof dtps !== "undefined") throw "Error: DTPS is already loading"

//Basic global Power+ configuration. All global Power+ variables go under dtps
var dtps = {
    ver: 211,
    readableVer: "v2.1.1",
    trackSuffix: "",
    fullTrackSuffix: "",
    trackColor: "#ffa500",
    showLetters: false,
    fullNames: false,
    classes: [],
    latestStream: [],
    explorer: [],
    embedded: window.location.href.includes("instructure.com"),
    auth: {
        accessToken: window.localStorage.accessToken ? window.localStorage.accessToken : undefined,
        canvasURL: "https://dtechhs.instructure.com",
        client_id: "146080000000000005",
        uri: "https://powerplus.app/app",
        scope: [
            "url:GET|/api/v1/courses/:course_id/outcome_rollups",
            "url:GET|/api/v1/users/:id",
            "url:GET|/api/v1/users/:id/colors",
            "url:GET|/api/v1/users/:id/dashboard_positions",
            "url:GET|/api/v1/courses",
            "url:GET|/api/v1/courses/:course_id/pages",
            "url:GET|/api/v1/courses/:course_id/discussion_topics",
            "url:GET|/api/v1/courses/:course_id/discussion_topics/:topic_id/view",
            "url:GET|/api/v1/courses/:course_id/outcome_results",
            "url:GET|/api/v1/courses/:course_id/assignment_groups",
            "url:GET|/api/v1/courses/:course_id/modules",
            "url:GET|/api/v1/courses/:course_id/front_page",
            "url:GET|/api/v1/courses/:course_id/pages/:url",
            "url:GET|/api/v1/outcomes/:id",
            "url:GET|/api/v1/courses/:course_id/outcome_alignments",
            "url:GET|/api/v1/announcements",
            //not currently used in dtps, might be used later on
            "url:GET|/api/v1/courses/:course_id/assignments",
            "url:GET|/api/v1/courses/:course_id/assignment_groups/:assignment_group_id/assignments"
        ]
    },
    chromaProfile: {
        title: "Power+",
        description: "Razer Chroma effects for Power+ (beta)",
        author: "jottocraft",
        domain: "powerplus.app"
    }
};

if (dtps.trackSuffix !== "") dtps.auth.uri = "https://powerplus.app/dev"

//alert all errors if dtpsDebug enabled (for chromebooks w/o devtools)
window.onerror = function myErrorHandler(errorMsg, url, lineNumber) {
    if (window.localStorage.dtpsDebug == "true") alert("[DTPS] ERROR: " + errorMsg + "\n\n" + url + ":" + lineNumber);
    return false;
}

//Load a better version of jQuery as soon as possible because of Canvas's weird included version of jQuery that breaks a lot of important things
if (dtps.embedded) jQuery.getScript("https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js")

//Embedded Status Updates (load this before AND after rendering Power+ just in case something breaks in dtps.render)
//REMOVED 8.13.2019
//jQuery.getScript("https://fnxldqd4m5fr.statuspage.io/embed/script.js")

//Shortcut for dtps.classes[dtps.selectedClass] for debugging only
dtps.class = function () {
    return dtps.classes[dtps.selectedClass]
}

//Shows the Power+ changelog modal
dtps.changelog = function () {
    fluid.cards.close(".card.focus")
    fluid.modal(".card.changelog");
};

//Get CBL color
dtps.cblColor = function (score) {
    var col = "#808080";
    if (score >= 1) col = "#c4474e";
    if (score >= 1.5) col = "#c45847";
    if (score >= 2) col = "#c26d44";
    if (score >= 2.5) col = "#b59b53";
    if (score >= 3) col = "#a1b553";
    if (score >= 3.5) col = "#89b553";
    if (score >= 4) col = "#4f9e59";
    return col;
}

//Get CBL name
dtps.cblName = function (rating) {
    var name = "";
    if (String(rating).toUpperCase().includes("EMERGING")) name = "Emerging";
    if (String(rating).toUpperCase().includes("DEVELOPING")) name = "Developing";
    if (String(rating).toUpperCase().includes("PROFICIENT")) name = "Proficient";
    if (String(rating).toUpperCase().includes("PIONEERING")) name = "Pioneering";
    return name;
}

//get url paramaters
dtps.getParams = function () {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return vars;
}

//dtps.authenticate and dtps.webReq work together to ensure the user is authenticated
//the dtps client must not be embedded for dtps.authenticate to work
dtps.authenticate = function (cb) {
    /*if (window.localStorage.accessToken) {
        //manually defined access token
        cb();
    } else {
        var params = dtps.getParams();
        window.history.replaceState(null, null, window.location.pathname);
        if (params.code && (params.state == window.localStorage.authState)) {
            //get tokens
            dtps.webReq("backend", "/login/oauth2/token?client_id=" + dtps.auth.client_id + "&redirect_uri=" + dtps.auth.uri + "&grant_type=authorization_code&code=" + params.code, function (res) {
                var data = JSON.parse(res);
                window.localStorage.setItem("access_token", data.access_token);
                window.localStorage.setItem("refresh_token", data.refresh_token);
                window.localStorage.setItem("expires_at", new Date(new Date().getTime() + (1000 * data.expires_in)));
                dtps.accessToken = data.access_token;
                cb();
            });
        } else {
            if (window.localStorage.refresh_token) {
                //refresh token exists
                if (window.localStorage.expires_at > new Date().getTime()) {
                    //access token not expired
                    dtps.auth.accessToken = window.localStorage.access_token;
                } else {
                    //get new access token
                    //COMING SOON
                }
            } else {
                //show login screen
                var state = "WinterCreek" + Math.floor(1000 + Math.random() * 9000);
                window.localStorage.authState = state;
                window.location.href = dtps.auth.canvasURL + "/login/oauth2/auth?client_id=" + dtps.auth.client_id + "&scope=" + dtps.auth.scope.join(" ") + "&purpose=" + encodeURI(navigator.platform) + "&response_type=code&state=" + state + "&redirect_uri=" + dtps.auth.uri

            }
        }
    }*/

    //authentication disabled
    console.error("Authentication disabled");
    cb();
}

//Logs debugging messags to both the normal JS console and also Power+'s included debugging log
dtps.log = function (msg) {
    console.log("[DTPS" + dtps.trackSuffix + "] ", msg);
    if (typeof msg !== "object") { try { jQuery("span.log").html(`<p>[DTPS` + dtps.trackSuffix + `] ` + msg + `</p>` + jQuery("span.log").html()); } catch (e) { } }
}

//Renders Power+ first run stuff
dtps.firstrun = function () {
    if (dtps.embedded) {
        jQuery("body").append(`<div id="dtpsNativeAlert" class="ui-dialog ui-widget ui-widget-content ui-corner-all ui-dialog-buttons" tabindex="-1" aria-hidden="false" style="outline: 0px; z-index: 5000; height: auto; width: 500px; position: fixed; top: 100px; margin-left: calc(50% - 250px); display: block;">
<div class="ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix"><span id="ui-id-1" class="ui-dialog-title" role="heading">Welcome to Power+` + dtps.trackSuffix + `</span><button onclick="jQuery('#dtpsNativeAlert').remove();jQuery('#dtpsNativeOverlay').remove();" class="ui-dialog-titlebar-close ui-corner-all"><span class="ui-icon ui-icon-closethick">close</span></button></div>
<form id="new_course_form" class="bootstrap-form form-horizontal ui-dialog-content ui-widget-content" data-turn-into-dialog="{&quot;width&quot;:500,&quot;resizable&quot;:false}" style="width: auto; min-height: 0px; height: auto; display: block;" action="/courses" accept-charset="UTF-8" method="post" aria-expanded="true" scrolltop="0" scrollleft="0">
<h5>` + dtps.readableVer + `</h5>
<li>Class grade calculations, what-if grades, recent grade changes, minimum score, and other gradebook features in Power+` + dtps.trackSuffix + ` are not official. If you want to see class grades from Canvas, you can disable class grade calculations in the settings menu.</li>
<li><b>Power+` + dtps.trackSuffix + ` may have bugs that cause it to display inaccurate information. Use Power+` + dtps.trackSuffix + ` at your own risk.</b></li>
<li><b>Power+` + dtps.trackSuffix + ` is neither created nor endorsed by Canvas LMS and Instructure Inc.</b></li>
</form><div class="ui-dialog-buttonpane ui-widget-content ui-helper-clearfix"><div class="ui-dialog-buttonset"><button onclick="jQuery('#dtpsNativeAlert').remove();jQuery('#dtpsNativeOverlay').remove();" type="button" data-text-while-loading="Cancel" class="btn dialog_closer ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only" role="button" aria-disabled="false"><span class="ui-button-text">Cancel</span></button>
<button onclick="localStorage.setItem('dtpsInstalled', 'true'); dtps.shouldRender = true; dtps.render(); dtps.masterStream(true);" type="button" data-text-while-loading="Loading Power+..." class="btn btn-primary button_type_submit ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only" role="button" aria-disabled="false"><span class="ui-button-text">Continue</span></button></div></div></div>
<div id="dtpsNativeOverlay" class="ui-widget-overlay" style="position: fixed; top: 0px; left: 0px; width: 100%; height: 100%; z-index: 500;"></div>`)
    } else {
        $("#welcomeVer").html(dtps.readableVer)
        fluid.splash("#welcomeToDtps")
    }
};

//Displays a native Canvas alert (cannot be used after Power+ is rendered / dtps.render)
//On non-embedded clients, this displays a Fluid UI Alert
dtps.nativeAlert = function (text, sub, loadingSplash) {
    if (text == undefined) var text = "";
    if (sub == undefined) var sub = "";
    if (loadingSplash) {
        if (dtps.embedded) {
            jQuery("body").append(`<div id="dtpsNativeOverlay" class="ui-widget-overlay" style="position: fixed; top: 0px; left: 0px; width: 100%;height: 100%;z-index: 500;background: rgba(31, 31, 31, 0.89);">&nbsp;<h1 style="position: fixed;font-size: 125px;background: -webkit-linear-gradient(rgb(255, 167, 0), rgb(255, 244, 0));-webkit-background-clip: text;-webkit-text-fill-color: transparent;font-weight: bolder;font-family: Product sans;text-align: center;top: 200px;width: 100%;">Power+</h1><h5 style="font-family: Product sans;font-size: 30px;color: gray;width: 100%;text-align: center;position: fixed;top: 375px;">` + sub + `</h5><div class="spinner" style="margin-top: 500px;"></div>
<style>@font-face{font-family: 'Product sans'; font-display: auto; font-style: normal; font-weight: 400; src: url(https://fluid.js.org/product-sans.ttf) format('truetype');}.spinner { width: 40px; height: 40px; margin: 40px auto; background-color: gray; border-radius: 100%; -webkit-animation: sk-scaleout 1.0s infinite ease-in-out; animation: sk-scaleout 1.0s infinite ease-in-out; } @-webkit-keyframes sk-scaleout { 0% { -webkit-transform: scale(0) } 100% { -webkit-transform: scale(1.0); opacity: 0; } } @keyframes sk-scaleout { 0% { -webkit-transform: scale(0); transform: scale(0); } 100% { -webkit-transform: scale(1.0); transform: scale(1.0); opacity: 0; } }</style></div>`)
        }
    } else {
        jQuery("body").append(`<div id="dtpsNativeAlert" class="ui-dialog ui-widget ui-widget-content ui-corner-all ui-dialog-buttons" tabindex="-1" aria-hidden="false" style="outline: 0px; z-index: 5000; height: auto; width: 500px; margin-top: 100px; top: 0; margin-left: calc(50% - 250px); display: block;">
<div class="ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix"><span id="ui-id-1" class="ui-dialog-title" role="heading">Power+</span></div>
<form id="new_course_form" class="bootstrap-form form-horizontal ui-dialog-content ui-widget-content" data-turn-into-dialog="{&quot;width&quot;:500,&quot;resizable&quot;:false}" style="width: auto; min-height: 0px; height: auto; display: block;" action="/courses" accept-charset="UTF-8" method="post" aria-expanded="true" scrolltop="0" scrollleft="0">
<h4>` + text + `</h4>
<p>` + sub + `</p>
</form>
<div class="ui-dialog-buttonpane ui-widget-content ui-helper-clearfix"><div class="ui-dialog-buttonset">
<button onclick="jQuery('#dtpsNativeAlert').remove();jQuery('#dtpsNativeOverlay').remove();" type="button" data-text-while-loading="Cancel" class="btn dialog_closer ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only" role="button" aria-disabled="false"><span class="ui-button-text">OK</span></button>
</div></div></div>
<div id="dtpsNativeOverlay" class="ui-widget-overlay" style="position: fixed; top: 0px; left: 0px; width: 100%; height: 100%; z-index: 500;"></div>`)
    }
};

//All Canvas & LMS data is sent through dtps.webReq
dtps.requests = {};
dtps.http = {};
dtps.webReq = function (req, url, callback, q) {
    if ((dtps.requests[url] == undefined) || url.includes("|") || (q && q.forceLoad)) {
        //Use backend request instead of canvas request for standalone Power+
        if ((req == "canvas") && !dtps.embedded) req = "backend"
        //"Canvas" request type for making a GET request to the Canvas API
        if (req == "canvas") {
            dtps.log("Making DTPS Canvas web request")
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
            dtps.http[url].setRequestHeader("Accept", "application/json+canvas-string-ids, application/json")
            dtps.http[url].send();
        }
        //"canCOLLAPSE" request type for collapsing modules through an unofficial Canvas API
        if (req == "canCOLLAPSE") {
            dtps.log("Making DTPS Canvas web request")
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
            dtps.http[url].open("POST", url, true);
            dtps.http[url].setRequestHeader("Accept", "application/json, text/javascript, application/json+canvas-string-ids, */*; q=0.01")
            dtps.http[url].setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8")
            dtps.http[url].setRequestHeader("X-Requested-With", "XMLHttpRequest")
            dtps.http[url].setRequestHeader("X-CSRF-Token", decodeURIComponent(document.cookie).split("_csrf_token=")[1].split(";")[0])
            dtps.http[url].send("_method=POST&collapse=" + q.collapse + "&authenticity_token=" + decodeURIComponent(document.cookie).split("_csrf_token=")[1].split(";")[0]);
        }
        //"backend" request type for making a GET request to the Canvas API w/ jottocraft.com backend
        if (req == "backend") {
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
            dtps.http[url].open("GET", "https://lms.jottocraft.com:2755" + url, true);
            dtps.http[url].setRequestHeader("Accept", "application/json+canvas-string-ids");
            dtps.http[url].setRequestHeader("dtps", "WinterCreek/" + dtps.ver);
            dtps.http[url].setRequestHeader("Authorization", "Bearer " + dtps.auth.accessToken);
            dtps.http[url].send();
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

//Calculates the class grade based on Outcomes results from Canvas
dtps.computeClassGrade = function (num, renderSidebar, rollupScoreOverride, cb) {
    dtps.webReq("canvas", "/api/v1/courses/" + dtps.classes[num ? num : 0].id + "/outcome_rollups?user_ids[]=" + dtps.user.id + "&include[]=outcomes", function (resp, classNum) {
        var data = JSON.parse(resp);
        var rollups = data.rollups[0];

        //array of outcome averages sorted from highest to lowest. rollupscoreoverride is optional for whatif grades
        var rollupScores = rollupScoreOverride || rollups.scores.map(function (score) { return score.score; });
        rollupScores.sort((a, b) => b - a);

        //the highest value 75% of outcomes are greater than or equal to
        //number75thresh is the percentage of assignments >= number75. number75thresh is always >= 0.75 && <= 1
        //number75length is the amount of outcomes needed to satisfy 75% criteria thing
        //number75lengthA is amount of outcomes satisfying the A requirement for the 75% criteria thing
        //moreA is how many more outcomes are not at least 3
        //number75per is the percentage used
        var number75per = 0.75;
        var number75 = null;
        var number75thresh = null;
        var number75Length = Math.ceil(rollupScores.length * number75per);
        var number75LengthA = 0;
        var moreA = 0;
        rollupScores.map((s) => {
            if (s >= 3.5) {
                number75LengthA++;
            }
            if (s < 3) {
                moreA++;
            }
        })

        //test values
        var testValues = [3.5, 3.3, 3, 2.6, 2.2]

        for (var i = 0; i < testValues.length; i++) {
            //make sure a higher number for number75 isn't already found
            if (number75 == null) {
                //array of numbers equal to or greater than the testing value
                var equalOrGreater = [];

                //check every score to see if it is >= the test value
                for (var ii = 0; ii < rollupScores.length; ii++) {
                    if (rollupScores[ii] >= testValues[i]) equalOrGreater.push(rollupScores[ii]);
                }

                //if at least 75% of the outcomes are >= test value, number75 is the test value
                if ((equalOrGreater.length / rollupScores.length) >= number75per) {
                    number75 = testValues[i];
                    number75thresh = (equalOrGreater.length / rollupScores.length);
                }
            }
        }

        //since rollupScores is sorted greatest to least, the last value is the smallest
        var lowestValue = rollupScores[rollupScores.length - 1];

        //get letter grade
        var letter = "I";
        if (rollupScores.length == 0) letter = "--";
        if ((number75 >= 2.2) && (lowestValue >= 0)) letter = "C";
        if ((number75 >= 2.6) && (lowestValue >= 2)) letter = "B-";
        if ((number75 >= 3) && (lowestValue >= 2.25)) letter = "B";
        if ((number75 >= 3) && (lowestValue >= 2.5)) letter = "B+";
        if ((number75 >= 3.3) && (lowestValue >= 2.5)) letter = "A-";
        if ((number75 >= 3.5) && (lowestValue >= 3)) letter = "A";

        if ((classNum == undefined) && cb) {
            cb(letter);
            return;
        }

        if (fluid.get('pref-calcGrades') !== "false") dtps.classes[classNum].letter = letter;

        //store grade calculation variables to show them in the gradebook
        dtps.classes[classNum].gradeCalc = {
            lowestValue: lowestValue,
            number75: (number75 !== null ? number75 : ""),
            number75thresh: number75thresh,
            number75Length: number75Length,
            number75LengthA: number75LengthA,
            moreA: moreA
            //number75percent: (number75thresh-0.75)/(1-0.75),
            //lowestValuePercent: (),
        }

        //if there are no outcomes, remember this so the grades tab can be hidden
        if (!data.linked.outcomes.length) dtps.classes[classNum].noOutcomes = true;

        dtps.computedClassGrades++;
        if (renderSidebar) {
            if (letter !== "--") {
                if (letter.includes("A")) gpa.push(4)
                if (letter.includes("B")) gpa.push(3)
                if (letter.includes("C")) gpa.push(2)
                if (letter.includes("I")) gpa.push(0)
                if (letter == "I") score = 0;
                if (letter == "C") score = 75;
                if (letter == "B-") score = 80;
                if (letter == "B") score = 85;
                if (letter == "B+") score = 88;
                if (letter == "A-") score = 92;
                if (letter == "A") score = 100;
                dtps.gradeHTML.push(`<div style="cursor: auto; background-color: var(--norm);" class="progressBar big ` + dtps.classes[classNum].col + `">
            <div style="color: var(--dark);" class="progressLabel">` + dtps.classes[classNum].subject + ` (` + letter + `)</div>
            <div class="progress" style="background-color: var(--light); width: calc(` + score + `% - 300px);"></div></div>`)
            }
        }
        if ((dtps.computedClassGrades == dtps.classes.length) && renderSidebar) {
            dtps.showClasses(true);
            var total = 0;
            for (var i = 0; i < gpa.length; i++) {
                total += gpa[i];
            }
            dtps.gpa = (total / gpa.length).toFixed(2);
        }
    }, num);
}

dtps.explore = function (path) {
    dtps.webReq("canvas", path, function (resp) {
        var data = JSON.parse(resp);
        $("#explorerData").html(JSON.stringify(data, null, "\t"))
    });
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

//Get all JavaScript libraries
dtps.JS = function (cb) {
    if (dtps.embedded) {
        jQuery.getScript('https://powerplus.app/fluid.js');
        jQuery.getScript("https://unpkg.com/sweetalert/dist/sweetalert.min.js")
        jQuery.getScript("https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.22.2/moment.min.js", function () {
            jQuery.getScript("https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/3.9.0/fullcalendar.min.js")
        })
        jQuery.getScript('https://cdnjs.cloudflare.com/ajax/libs/fuse.js/3.3.0/fuse.min.js');

        jQuery.getScript("https://www.googletagmanager.com/gtag/js?id=UA-105685403-3");

        jQuery.getScript("https://cdn.jottocraft.com/tinycolor.js", cb);
    } else {
        cb();
    }
}

//Starts Power+, and renders if running a non-embedded client
dtps.init = function () {
    dtps.log("Starting DTPS " + dtps.readableVer + "...");

    //add basic explorer items
    dtps.explorer.push({ name: "/users/self", path: "/api/v1/users/self" });
    dtps.explorer.push({ name: "/users/self/dashboard_positions", path: "/api/v1/users/self/dashboard_positions" });
    dtps.explorer.push({ name: "/users/self/colors", path: "/api/v1/users/self/colors" });
    dtps.explorer.push({ name: "/courses", path: "/api/v1/courses?include[]=total_scores&include[]=public_description&include[]=favorites&include[]=total_students&include[]=account&include[]=teachers&include[]=course_image&include[]=syllabus_body&include[]=tabs" });

    dtps.webReq("canvas", "/api/v1/users/self", function (user) {
        fluidThemes = [["midnight", { name: "Tome", id: "tome", icon: "link" }], ["rainbow"]];
        fluidAutoLoad = false;

        document.addEventListener("fluidTheme", function (data) {
            if (dtps.oldTheme !== data.detail) {
                //theme change
                console.log("[DTPS] Fluid UI Theme Change")
                dtps.oldTheme = data.detail;
                var next = window.getComputedStyle(document.getElementsByClassName("background")[0]).getPropertyValue("--grad")
                if (dtps.selectedClass !== "dash") next = "linear-gradient(to bottom right, " + window.getComputedStyle(document.getElementsByClassName("background")[0]).getPropertyValue($("body").hasClass("midnight") ? "--dark" : "--light") + ", " + ($("body").hasClass("dark") ? "var(--background, #252525)" : "var(--background, white)") + ")"
                if (dtps.selectedClass !== "dash") $('body').removeClass('dashboard');
                $(".background").css("background", next)
                dtps.chroma();
            }
        })

        dtps.user = JSON.parse(user);
        sudoers = ["669", "672", "209", "560"]
        if (sudoers.includes(dtps.user.id)) { jQuery("body").addClass("sudo"); dtps.log("Sudo mode enabled"); }
        contributors = ["669", "672", "560"]
        if (contributors.includes(dtps.user.id)) { jQuery("body").addClass("contributor"); }
        if (dtps.user.id == "669") { jQuery("body").addClass("dev"); dtps.log("Dev mode enabled"); }
        if ((dtps.trackSuffix !== "") && (!dtps.trackSuffix.includes("GM"))) jQuery("body").addClass("prerelease");
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
                if ((time > 0844) && (time < 0911)) dtps.period = 7;
                if ((time > 0912) && (time < 1003)) dtps.period = 1;
                if ((time > 1004) && (time < 1056)) dtps.period = 2;
                if ((time > 1057) && (time < 1149)) dtps.period = 3;
                if ((time > 1220) && (time < 1312)) dtps.period = 4;
                if ((time > 1313) && (time < 1405)) dtps.period = 5;
                if ((time > 1406) && (time < 1458)) dtps.period = 6;
            } else {
                if (new Date().getDay() !== 4) {
                    //M, TU, F
                    if ((time > 0844) && (time < 0916)) dtps.period = 7;
                    if ((time > 0917) && (time < 1013)) dtps.period = 1;
                    if ((time > 1022) && (time < 1118)) dtps.period = 2;
                    if ((time > 1119) && (time < 1215)) dtps.period = 3;
                    if ((time > 1246) && (time < 1342)) dtps.period = 4;
                    if ((time > 1343) && (time < 1439)) dtps.period = 5;
                    if ((time > 1440) && (time < 1536)) dtps.period = 6;
                }
            }
        }
        if (dtps.period && (String(localStorage.dtpsSchedule).startsWith("{"))) {
            dtps.currentClass = JSON.parse(localStorage.dtpsSchedule)[dtps.period];
            if (dtps.currentClass) {
                $("#headText").html(("Period " + dtps.period).replace("Period 7", "@d.tech"));
            }
        }
        if (!dtps.currentClass) {
            dtps.selectedClass = "dash";
            dtps.selectedContent = "stream";
        }
        dtps.masterContent = "assignments";
        if (!dtps.embedded) { dtps.renderLite(); dtps.showClasses(); }

        dtps.shouldRender = true;
        dtps.showChangelog = false;
        dtps.first = false;
        if (window.localStorage.dtpsInstalled !== "true") {
            if (dtps.embedded) dtps.shouldRender = false;
            dtps.first = true;
        }
        if (dtps.first && !dtps.embedded) dtps.firstrun();
        if (Number(window.localStorage.dtps) < dtps.ver) {
            dtps.log("New release")
            dtps.showChangelog = true;
            if (dtps.shouldRender) dtps.nativeAlert("Loading...", "Updating to Power+ " + dtps.readableVer, true);
        }
        if (dtps.shouldRender && !dtps.showChangelog) {
            dtps.nativeAlert("Loading...", undefined, true);
        }
        dtps.JS(function () {

            window.dataLayer = window.dataLayer || [];
            function gtag() { dataLayer.push(arguments); }
            var configTmp = {
                'page_title': 'canvas',
                'page_path': '/canvas',
                'anonymize_ip': true
            }
            if (dtps.trackSuffix !== "") {
                configTmp = {
                    'page_title': 'prerelease',
                    'page_path': '/prerelease',
                    'anonymize_ip': true
                }
            }
            gtag('config', 'UA-105685403-3', configTmp);

            dtps.webReq("canvas", "/api/v1/users/self/colors", function (colorsResp) {
                dtps.webReq("canvas", "/api/v1/users/self/dashboard_positions", function (dashboardResp) {
                    dtps.webReq("canvas", "/api/v1/courses?include[]=total_scores&include[]=public_description&include[]=favorites&include[]=total_students&include[]=account&include[]=teachers&include[]=course_image&include[]=syllabus_body&include[]=tabs", function (resp) {
                        dtps.classesReady = 0;
                        dtps.colorCSS = [];
                        //this object is for keeping track of when each assignment was graded
                        //because submitted_or_assessed at key for outcome results api is not good :(
                        dtps.assignmentGradeTimes = {};
                        dtps.gpa = null;
                        gpa = [];
                        var colors = JSON.parse(colorsResp);
                        var dashboard = JSON.parse(dashboardResp);
                        var data = JSON.parse(resp);
                        dtps.gradeHTML = [];
                        data.sort(function (a, b) {
                            var keyA = dashboard.dashboard_positions["course_" + a.id],
                                keyB = dashboard.dashboard_positions["course_" + b.id];
                            if (keyA < keyB) return -1;
                            if (keyA > keyB) return 1;
                            return 0;
                        });
                        for (var i = 0; i < data.length; i++) {
                            var name = data[i].name;
                            var subject = name.split(" - ")[0];
                            var icon = null;
                            if (data[i].name !== data[i].course_code) {
                                //Canvas class manually renamed
                                subject = null;
                            }
                            if (subject == null) var subject = name.split(" - ")[0];
                            if (colors.custom_colors["course_" + data[i].id]) {
                                var filter = "filter_" + colors.custom_colors["course_" + data[i].id].toLowerCase().replace("#", "");
                                //Suport Power+ v1.x.x Colors by detecting if the user selects a native canvas color
                                if (dtps.filter(colors.custom_colors["course_" + data[i].id])) filter = dtps.filter(colors.custom_colors["course_" + data[i].id]);
                            } else {
                                var filter = ""
                            }
                            pagesTab = false;
                            for (var ii = 0; ii < data[i].tabs.length; ii++) {
                                if (data[i].tabs[ii].id == "pages") pagesTab = true;
                            }
                            dtps.classes.push({
                                name: name,
                                subject: subject,
                                description: data[i].public_description,
                                totalStudents: data[i].total_students,
                                favorite: data[i].is_favorite,
                                defaultView: data[i].default_view,
                                icon: icon,
                                col: filter,
                                pagesTab: pagesTab,
                                syllabus: data[i].syllabus_body,
                                norm: colors.custom_colors["course_" + data[i].id],
                                light: tinycolor(colors.custom_colors["course_" + data[i].id]).brighten(20).toHexString(),
                                dark: tinycolor(colors.custom_colors["course_" + data[i].id]).darken(20).toHexString(),
                                isBright: (dtps.filter(colors.custom_colors["course_" + data[i].id]) ? false : !tinycolor(colors.custom_colors["course_" + data[i].id]).isDark()),
                                id: data[i].id,
                                //collection of data used to calculate a letter grade
                                grades: {},
                                grade: (data[i].enrollments[0].computed_current_score ? data[i].enrollments[0].computed_current_score : "--"),
                                letter: (data[i].enrollments[0].computed_current_grade ? data[i].enrollments[0].computed_current_grade : (fluid.get("pref-calcGrades") !== "false" ? false : "--")),
                                num: i,
                                tmp: {},
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
                            dtps.computedClassGrades = 0;
                            if (fluid.get("pref-calcGrades") !== "false") dtps.computeClassGrade(i, true);
                            if (dtps.currentClass == data[i].id) {
                                dtps.selectedClass = i;
                                dtps.selectedContent = "stream";
                                dtps.chroma();
                            }
                            dtps.classStream(i, true);
                        }
                        dtps.log("Grades loaded: ", dtps.classes);

                        if (dtps.shouldRender) dtps.render();
                        if (dtps.first && dtps.embedded) dtps.firstrun();
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
    if ((dtps.selectedClass == "dash") && (dtps.classesReady == dtps.classes.length) && dtps.shouldRender) {
        dtps.log("All classes ready, loading master stream");
        dtps.masterStream(true);
    } else {
        if ((dtps.selectedClass == "dash") && (dtps.classesReady < dtps.classes.length) && dtps.shouldRender) {
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
            jQuery(".sidebar").html(`<div onclick="dtps.selectedContent = 'stream'; dtps.chroma(); dtps.classStream(dtps.selectedClass);" class="class item main back">
            <span class="label">Classes</span>
            <div class="icon"><i class="material-icons">keyboard_arrow_left</i></div>
            </div>
    <div class="divider"></div>
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
      <div onclick="dtps.selectedPage = ` + data[i].page_id + `" class="class item ` + data[i].page_id + `">
      <span class="label">` + data[i].title + `</span>
      <div class="icon"><i class="material-icons">notes</i></div>
      </div>
      `);
            }
            if ((dtps.selectedClass == num) && (dtps.selectedContent == "pages")) {
                jQuery(".sidebar").html(`<div onclick="dtps.selectedContent = 'stream'; dtps.chroma(); dtps.classStream(dtps.selectedClass);" class="class item main back">
      <span class="label">Classes</span>
      <div class="icon"><i class="material-icons">keyboard_arrow_left</i></div>
      </div>
      <div class="divider"></div>
    ` + dtps.classes[num].pagelist.join(""))
            }

            $(".class:not(.back)").click(function (event) {
                $(this).siblings().removeClass("active")
                $(this).addClass("active")
                dtps.getPage(dtps.classes[dtps.selectedClass].id, dtps.selectedPage);
            });
        }
    });
}

//Loads the list of discussion topics for a class
dtps.loadTopics = function (num) {
    if ((dtps.selectedClass == num) && (dtps.selectedContent == "discuss")) {
        jQuery(".sidebar").html(`
<div class="classDivider"></div>
<div class="spinner"></div>
`);
        jQuery(".classContent").html("");
    }
    dtps.webReq("canvas", "/api/v1/courses/" + dtps.classes[num].id + "/discussion_topics", function (resp) {
        var data = JSON.parse(resp);
        if (data.error || (data.length == 0)) {
            jQuery(".sidebar").html(`<div onclick="dtps.selectedContent = 'stream'; dtps.chroma(); dtps.classStream(dtps.selectedClass);" class="class item main back">
    <span class="label">Classes</span>
    <div class="icon"><i class="material-icons">keyboard_arrow_left</i></div>
    </div>
    <div onclick="window.open('/courses/` + dtps.classes[num].id + `/discussion_topics/new')" class="class item main back">
    <span class="label">New discussion</span>
    <div class="icon"><i class="material-icons">add</i></div>
    </div>
    <div class="divider"></div>
  <h5 style="text-align: center; font-weight: bold;">No discussions found</h5><p style="text-align: center;">There aren't any discussion topics</p>`)
        } else {
            dtps.classes[num].topics = [];
            dtps.classes[num].topicList = [];
            for (var i = 0; i < data.length; i++) {
                dtps.classes[num].topics[data[i].id] = {
                    id: data[i].id,
                    title: data[i].title,
                    content: data[i].message,
                    author: {
                        name: data[i].author.display_name,
                        prof: data[i].author.avatar_image_url
                    },
                    locked: data[i].locked_for_user,
                    requirePost: data[i].require_initial_post,
                    num: i
                };
                dtps.classes[num].topicList.push(`
      <div onclick="dtps.selectedPage = ` + data[i].id + `" class="class item ` + data[i].id + `">
      <span class="label">` + data[i].title + `</span>
      <div class="icon"><i style="font-family: 'Material Icons Extended';" class="material-icons">` + (data[i].locked_for_user ? "lock_outline" : "chat_bubble_outline") + `</i></div>
      </div>
      `);
            }
            if ((dtps.selectedClass == num) && (dtps.selectedContent == "discuss")) {
                jQuery(".sidebar").html(`<div onclick="dtps.selectedContent = 'stream'; dtps.chroma(); dtps.classStream(dtps.selectedClass);" class="class item main back">
                <span class="label">Classes</span>
                <div class="icon"><i class="material-icons">keyboard_arrow_left</i></div>
                </div>
                <div onclick="window.open('/courses/` + dtps.classes[num].id + `/discussion_topics/new')" class="class item main back">
                <span class="label">New discussion</span>
                <div class="icon"><i class="material-icons">add</i></div>
                </div>
                <div class="divider"></div>
    ` + dtps.classes[num].topicList.join(""))
            }

            $(".class:not(.back)").click(function (event) {
                $(this).siblings().removeClass("active")
                $(this).addClass("active")
                dtps.getTopic(dtps.selectedClass, dtps.selectedPage);
            });
        }
    });
}

//Gets and displays a discussion
dtps.getTopic = function (num, id, fromModuleStream) {
    var classID = dtps.classes[num].id
    if (id == undefined) var id = dtps.selectedPage;
    if ((dtps.classes[dtps.selectedClass].id == classID) && ((dtps.selectedContent == "discuss") || fromModuleStream)) {
        jQuery(".classContent").html(`<div class="spinner"></div>`);
    }
    if (false) {
        jQuery(".classContent").html(`<div class="card">` + dtps.classes[num].topics[id].content + "</div>");
    } else {
        var spinnerTmp = true;
        dtps.webReq("canvas", "/api/v1/courses/" + classID + "/discussion_topics/" + id + "/view", function (resp) {
            var data = JSON.parse(resp);
            if ((dtps.classes[dtps.selectedClass].id == classID) && ((dtps.selectedContent == "discuss") || fromModuleStream)) {
                var blob = new Blob([`<base target="_blank" /> <link type="text/css" rel="stylesheet" href="https://cdn.jottocraft.com/CanvasCSS.css" media="screen,projection"/>
                <style>body {background-color: ` + getComputedStyle($(".card.details")[0]).getPropertyValue("--cards") + `; color: ` + getComputedStyle($(".card.details")[0]).getPropertyValue("--text") + `}</style>` + dtps.classes[num].topics[id].content], { type: 'text/html' });
                var newurl = window.URL.createObjectURL(blob);
                var people = {};
                (data.participants ? data.participants.forEach((person) => people[person.id] = person) : "");
                jQuery(".classContent").html((fromModuleStream ? `<div class="acrylicMaterial" onclick="dtps.moduleStream(dtps.selectedClass)" style="line-height: 40px;display:  inline-block;border-radius: 20px;margin: 82px 0px 0px 82px; cursor: pointer;">
                <div style="font-size: 16px;display: inline-block;vertical-align: middle;margin: 0px 20px;"><i style="vertical-align: middle;" class="material-icons">keyboard_arrow_left</i> Back</div></div>` : "") + `

                ` + (dtps.classes[num].topics[id].requirePost && !data.view ? `<div class="acrylicMaterial" style="border-radius: 20px;display: inline-block;margin: 10px 82px;margin-top: 25px;height: 40px;line-height: 40px;padding: 0px 20px; margin-right: -70px;">
                Replies are only visible to those who have posted at least one reply</div>` : "") + `

                ` + (dtps.classes[num].topics[id].locked ? `<div class="acrylicMaterial" style="border-radius: 20px;display: inline-block;margin: 10px 82px;margin-top: 25px;height: 40px;line-height: 40px;padding: 0px 20px; margin-right: -70px;">
                Locked</div>` : "") + `
                

                <div class="acrylicMaterial" style="line-height: 40px;display:  inline-block;border-radius: 20px;margin: 82px 0px 0px 82px;">
                <div style="font-size: 16px;display: inline-block;vertical-align: middle;margin: 0px 20px;">Discussions (beta)</div></div>

                <div class="card" style="margin-top: 20px;">
       <h4 style="font-weight: bold; margin: 0px; margin-top: 10px;">` + dtps.classes[num].topics[id].title + `</h4>
       <img style="width: 25px; vertical-align: middle; border-radius: 50%;" src="` + dtps.classes[num].topics[id].author.prof + `" />
            <h5 style="display: inline-block; vertical-align: middle;color: var(--lightText); font-size: 22px;">` + dtps.classes[num].topics[id].author.name + `</h5>

       <iframe id="classPageIframe" onload="dtps.iframeLoad('classPageIframe')" style="margin: 10px 0px; width: 100%; border: none; outline: none;" src="` + newurl + `" />
        </div>

        ` + (data.view ? data.view.map(function (comment) {
                    return `<div class="card" style="padding: 20px;">
            <img style="width: 25px; vertical-align: middle; border-radius: 50%;" src="` + people[comment.user_id].avatar_image_url + `" />
            <h5 style="display: inline-block; vertical-align: middle;">` + people[comment.user_id].display_name + `
            ` + (comment.rating_sum ? `<div style="color: var(--secText);margin: 2px 0px;display: inline-block;font-size: 18px;line-height: 18px; position: absolute; top: 30px; right: 20px;"><i class="material-icons" style=" margin-right: 0px; vertical-align: middle; ">thumb_up_alt</i> ` + comment.rating_sum + `</div>` : "") + `</h5>
            ` + comment.message + `
            ` + (comment.replies ? comment.replies.map(function (reply) {
                        return `<div style="padding: 10px 20px;background-color: var(--elements);border-radius: 10px; margin: 20px 0px;"><h6>` + people[reply.user_id].display_name + `
                        ` + (reply.rating_sum ? `<div style="color: var(--secText);margin: 2px 0px;display: inline-block;font-size: 18px;line-height: 18px; float:right;margin-top: -5px;"><i class="material-icons" style=" margin-right: 0px; vertical-align: middle; ">thumb_up_alt</i> ` + reply.rating_sum + `</div>` : "") + `</h6>
                        <p>` + reply.message + `</p>
                ` + (reply.replies ? reply.replies.map(function (replyLayer) {
                            return `<div style="padding: 10px 20px;background-color: var(--darker);border-radius: 10px; margin: 20px 0px; margin-left: 20px;"><h6>` + people[replyLayer.user_id].display_name + `
                            ` + (replyLayer.rating_sum ? `<div style="color: var(--secText);margin: 2px 0px;display: inline-block;font-size: 18px;line-height: 18px; float:right;margin-top: -5px;"><i class="material-icons" style=" margin-right: 0px; vertical-align: middle; ">thumb_up_alt</i> ` + replyLayer.rating_sum + `</div>` : "") + `</h6>
                            <p>` + replyLayer.message + `</p>
                ` + (replyLayer.replies ? replyLayer.replies.map(function (replyLayerLayer) {
                                return `<div style="padding: 10px 20px;background-color: var(--darkest);border-radius: 10px; margin: 20px 0px; margin-left: 20px;"><h6>` + people[replyLayerLayer.user_id].display_name + `
                                ` + (replyLayerLayer.rating_sum ? `<div style="color: var(--secText);margin: 2px 0px;display: inline-block;font-size: 18px;line-height: 18px; float:right;margin-top: -5px;"><i class="material-icons" style=" margin-right: 0px; vertical-align: middle; ">thumb_up_alt</i> ` + replyLayerLayer.rating_sum + `</div>` : "") + `</h6>
                                <p>` + replyLayerLayer.message + `</p></div>`
                            }).join("") : "") + `</div>`
                        }).join("") : "") + `
                </div>`
                    }).join("") : "") + `
            </div>`
                }).join("") : "") + `
      `);
            }
        });
    }
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
    dtps.selectedContent = "stream";
    if (!renderOv) dtps.showClasses();
    if ((dtps.selectedClass == num) && (dtps.selectedContent == "stream")) {
        if (!renderOv) {
            jQuery(".classContent").html(dtps.renderStreamTools(num) + `
    <div class="spinner"></div>
  `);
        }
    }
    var allData = [];
    var total = null;
    dtps.webReq("canvas", "/api/v1/courses/" + dtps.classes[num].id + "/outcome_results?per_page=100&user_ids[]=" + dtps.user.id, function (respp) {
        dtps.webReq("canvas", "/api/v1/courses/" + dtps.classes[num].id + "/assignment_groups?include[]=assignments&include[]=submissions&include[]=submission", function (resp) {
            var data = JSON.parse(resp);
            var outcomes = JSON.parse(respp).outcome_results;
            dtps.classes[num].stream = [];
            dtps.classes[num].rawStream = data;
            dtps.classes[num].streamitems = [];
            dtps.classes[num].weights = [];

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
                        outcomes: (data[i].assignments[ii].rubric ? data[i].assignments[ii].rubric.map(function (key) { return key.description }) : undefined),
                        outcomeIDs: (data[i].assignments[ii].rubric ? data[i].assignments[ii].rubric.map(function (key) { return key.outcome_id }) : undefined),
                        locksAt: data[i].assignments[ii].lock_at,
                        unlocksAt: data[i].assignments[ii].unlock_at,
                        locked: data[i].assignments[ii].locked_for_user,
                        lockedReason: data[i].assignments[ii].lock_explanation,
                        submissions: data[i].assignments[ii].submission.preview_url,
                        body: data[i].assignments[ii].description,
                        rubric: data[i].assignments[ii].rubric,
                        rubricItems: [],
                        submissionTypes: data[i].assignments[ii].submission_types,
                        worth: data[i].assignments[ii].points_possible
                    });
                    dtps.assignmentGradeTimes[data[i].assignments[ii].id] = data[i].assignments[ii].submission.graded_at;
                    if (data[i].assignments[ii].rubric) {
                        for (var iii = 0; iii < data[i].assignments[ii].rubric.length; iii++) {
                            dtps.classes[num].stream[dtps.classes[num].stream.length - 1].rubricItems.push(data[i].assignments[ii].rubric[iii].outcome_id);
                            if (data[i].assignments[ii].rubric[iii].ratings) {
                                data[i].assignments[ii].rubric[iii].ratingItems = [];
                                for (var iiii = 0; iiii < data[i].assignments[ii].rubric[iii].ratings.length; iiii++) {
                                    data[i].assignments[ii].rubric[iii].ratings[iiii].name = dtps.cblName(data[i].assignments[ii].rubric[iii].ratings[iiii].name);
                                    data[i].assignments[ii].rubric[iii].ratings[iiii].color = dtps.cblColor(data[i].assignments[ii].rubric[iii].ratings[iiii].points);
                                    data[i].assignments[ii].rubric[iii].ratingItems.push(data[i].assignments[ii].rubric[iii].ratings[iiii].points);
                                    if (!data[i].assignments[ii].rubric[iii].ratings[iiii].name) data[i].assignments[ii].rubric[iii].ratings[iiii].name = "";
                                    if (!data[i].assignments[ii].rubric[iii].ratings[iiii].color) data[i].assignments[ii].rubric[iii].ratings[iiii].color = "gray";
                                }
                            }
                        }
                    }
                    dtps.classes[num].streamitems.push(String(data[i].assignments[ii].id));
                    if ((data[i].assignments[ii].submission.score !== null) && (data[i].assignments[ii].submission.score !== undefined)) {
                        dtps.classes[num].stream[dtps.classes[num].stream.length - 1].grade = data[i].assignments[ii].submission.score + "/" + data[i].assignments[ii].points_possible;
                        dtps.classes[num].stream[dtps.classes[num].stream.length - 1].status = data[i].assignments[ii].submission.workflow_state;
                        dtps.classes[num].stream[dtps.classes[num].stream.length - 1].late = data[i].assignments[ii].submission.late;
                        dtps.classes[num].stream[dtps.classes[num].stream.length - 1].letter = (data[i].assignments[ii].submission.grade.match(/[a-z]/i) ? data[i].assignments[ii].submission.grade : data[i].assignments[ii].submission.score);
                        //Only treat assignment as graded in the gradebook if the assignment status says the grades are published. Scores are still shown with a pending review icon. This is to match native Canvas behavior.
                        if (data[i].assignments[ii].submission.workflow_state == "graded") {
                            dtps.classes[num].weights[i].possiblePoints = dtps.classes[num].weights[i].possiblePoints + data[i].assignments[ii].points_possible;
                            dtps.classes[num].weights[i].earnedPoints = dtps.classes[num].weights[i].earnedPoints + data[i].assignments[ii].submission.score;
                            dtps.classes[num].weights[i].assignments.push({ id: data[i].assignments[ii].id, disp: data[i].assignments[ii].name + ": " + data[i].assignments[ii].submission.score + "/" + data[i].assignments[ii].points_possible, percentage: (data[i].assignments[ii].submission.score / data[i].assignments[ii].points_possible).toFixed(2), possible: data[i].assignments[ii].points_possible, earned: data[i].assignments[ii].submission.score });
                        }
                    }
                    if (data[i].assignments[ii].submission !== undefined) {
                        dtps.classes[num].stream[dtps.classes[num].stream.length - 1].missing = data[i].assignments[ii].submission.missing;
                    }
                }
                if (dtps.classes[num].weights[i].possiblePoints !== 0) { dtps.classes[num].weights[i].grade = ((dtps.classes[num].weights[i].earnedPoints / dtps.classes[num].weights[i].possiblePoints) * 100).toFixed(2) + "%" } else { dtps.classes[num].weights[i].grade = "" }
            }

            for (var i = 0; i < outcomes.length; i++) {
                var streamItem = dtps.classes[num].streamitems.indexOf(outcomes[i].links.assignment.match(/\d+/)[0]);
                if (streamItem !== -1) {
                    var rubricItem = dtps.classes[num].stream[streamItem].rubricItems.indexOf(outcomes[i].links.learning_outcome);
                    if (rubricItem !== -1) {
                        dtps.classes[num].stream[streamItem].rubric[rubricItem].score = outcomes[i].score
                        dtps.classes[num].stream[streamItem].rubric[rubricItem].scoreName = outcomes[i].score
                        if (dtps.classes[num].grades[outcomes[i].links.learning_outcome] == undefined) dtps.classes[num].grades[outcomes[i].links.learning_outcome] = [];
                        dtps.classes[num].grades[outcomes[i].links.learning_outcome].push({ score: outcomes[i].score, possible: outcomes[i].possible })
                    }
                }
            }
            if ((dtps.selectedClass == num) && (dtps.selectedContent == "stream")) {
                if (!renderOv) {
                    jQuery(".classContent").html(dtps.renderStream(dtps.classes[num].stream.slice().sort(function (a, b) {
                        var keyA = new Date(a.dueDate).getTime(),
                            keyB = new Date(b.dueDate).getTime();
                        var now = new Date().getTime();
                        if (a.dueDate == null) { keyA = 0; }
                        if (b.dueDate == null) { keyB = 0; }
                        if (keyA < now) { a.old = true; }
                        if (keyB < now) { b.old = true; }
                        if (b.old || a.old) {
                            // Compare the 2 dates
                            if (keyA < keyB) return 1;
                            if (keyA > keyB) return -1;
                            return 0;
                        } else {
                            // Compare the 2 dates
                            if (keyA > keyB) return 1;
                            if (keyA < keyB) return -1;
                            return 0;
                        }
                    })));
                }
            }
            dtps.classesReady++;
            dtps.checkReady(num);
        });
    });
}

//renders stream tools html for a class
//these are the search box and the class info buttons
dtps.renderStreamTools = function (num, search, fromModules) {
    //num (number) = class number
    //search (boolean) = should render search
    //fromModules (boolean) = rendering stream tools for modules page
    return `
<div style="position: absolute;display:  inline-block;margin: 82px;">
<div class="acrylicMaterial" style="border-radius: 20px; display: inline-block; margin-right: 5px;">
<img src="` + dtps.classes[num].teacher.prof + `" style="width: 40px; height: 40px; border-radius: 50%;vertical-align: middle;"> <div style="font-size: 16px;display: inline-block;vertical-align: middle;margin: 0px 10px;">` + dtps.classes[num].teacher.name + `</div></div>

<div onclick="dtps.classInfo(` + num + `)" class="acrylicMaterial" style="border-radius: 50%; height: 40px; width: 40px; text-align: center; display: inline-block; vertical-align: middle; cursor: pointer; margin-right: 3px;">
<i style="line-height: 40px;" class="material-icons">info</i>
</div>

` + (dtps.classes[num].defaultView == "wiki" ? `<div onclick="dtps.classHome(` + num + `)" class="acrylicMaterial" style="border-radius: 50%; height: 40px; width: 40px; text-align: center; display: inline-block; vertical-align: middle; cursor: pointer;">
<i style="line-height: 40px;" class="material-icons">home</i>
</div>` : "") + `

</div>
<div style="text-align: right;">

` + (search ? `<i class="inputIcon material-icons">search</i><input onchange="dtps.search()" class="search inputIcon shadow" placeholder="Search assignments" type="search" />` : "") + `

<br />
<div class="btns row small acrylicMaterial assignmentPicker" style="margin: ` + (search ? `20px 80px 20px 0px !important` : `63px 80px 20px 0px !important`) + `;">
  <button class="btn ` + (!fromModules ? "active" : "") + `" onclick="dtps.classStream(dtps.selectedClass);"><i class="material-icons">assignment</i>Assignments</button>
  <button class="btn ` + (fromModules ? "active" : "") + `" onclick="dtps.moduleStream(dtps.selectedClass);"><i class="material-icons">view_module</i>Modules</button>
</div>
</div>`;
}

//Fetches module stream for a class
dtps.moduleStream = function (num) {
    dtps.selectedContent = "moduleStream";
    var moduleRootHTML = dtps.renderStreamTools(num, false, true);
    if (dtps.selectedContent == "moduleStream") jQuery(".classContent").html(moduleRootHTML + `<div class="spinner"></div>`);
    streamData = [];
    dtps.webReq("canvas", "/api/v1/courses/" + dtps.classes[num].id + "/modules?include[]=items&include[]=content_details", function (resp) {
        dtps.webReq("canvas", "/courses/" + dtps.classes[num].id + "/modules/progressions", function (progResp) {
            var data = JSON.parse(resp);
            var progData = JSON.parse(progResp);
            var collapsed = {};
            for (var i = 0; i < progData.length; i++) {
                collapsed[progData[i].context_module_progression.context_module_id] = progData[i].context_module_progression.collapsed;
            }
            for (var i = 0; i < data.length; i++) {
                var subsetData = [];
                for (var ii = 0; ii < data[i].items.length; ii++) {
                    var icon = "star_border";
                    if (data[i].items[ii].type == "ExternalTool") icon = "insert_link";
                    if (data[i].items[ii].type == "ExternalUrl") icon = "open_in_new";
                    if (data[i].items[ii].type == "Assignment") icon = "assignment";
                    if (data[i].items[ii].type == "Page") icon = "insert_drive_file";
                    if (data[i].items[ii].type == "Discussion") icon = "forum";
                    if (data[i].items[ii].type == "Quiz") icon = "assessment";
                    if (data[i].items[ii].type == "SubHeader") icon = "format_size";
                    var open = `window.open('` + data[i].items[ii].html_url + `')`;
                    if (data[i].items[ii].type == "ExternalTool") open = `$('#moduleIFrame').attr('src', ''); fluid.cards('.card.moduleURL'); $.getJSON('` + data[i].items[ii].url + `', function (data) { $('#moduleIFrame').attr('src', data.url); });`
                    if (data[i].items[ii].type == "Assignment") open = `dtps.assignment(` + data[i].items[ii].content_id + `, dtps.selectedClass);`
                    if (data[i].items[ii].type == "Page") open = `dtps.getPage(dtps.classes[dtps.selectedClass].id, '` + data[i].items[ii].page_url + `', true)`
                    if (data[i].items[ii].type == "SubHeader") {
                        subsetData.push(`<h5 style="font-size: 22px;padding: 2px 10px;">` + data[i].items[ii].title + `</h5>`);
                    } else {
                        subsetData.push(`<div onclick="` + open + `" style="color: var(--lightText); padding:10px;font-size:17px;border-radius:15px;margin:5px 0;margin-left: ` + (data[i].items[ii].indent * 15) + `px; cursor: pointer;">
<i class="material-icons" style="vertical-align: middle; margin-right: 10px;">` + icon + `</i>` + data[i].items[ii].title + `</div>`);
                    }
                }
                streamData.push(`<div class="card ` + (collapsed[data[i].id] ? "collapsed" : "") + `">
<h4 style="margin: 5px 2px; font-size: 32px; font-weight: bold;">
<i onclick="dtps.moduleCollapse(this, '` + dtps.classes[num].id + `', '` + data[i].id + `');" style="cursor: pointer; vertical-align: middle; color:var(--lightText);" class="material-icons collapseIcon">` + (collapsed[data[i].id] ? "keyboard_arrow_right" : "keyboard_arrow_down") + `</i>
` + data[i].name + `</h4>
<div class="moduleContents" style="padding-top: 10px;">
` + subsetData.join("") + `
</div>
</div>`)
            }
            if (dtps.selectedContent == "moduleStream") jQuery(".classContent").html(moduleRootHTML + streamData.join(""));
        });
    });
}

//collapse a module
dtps.moduleCollapse = function (ele, classID, modID) {
    $(ele).parents('.card').toggleClass('collapsed');
    if ($(ele).parents('.card').hasClass('collapsed')) {
        dtps.webReq("canCOLLAPSE", "/courses/" + classID + "/modules/" + modID + "/collapse", undefined, { collapse: 1, forceLoad: true })
        $(ele).html('keyboard_arrow_right');
    } else {
        dtps.webReq("canCOLLAPSE", "/courses/" + classID + "/modules/" + modID + "/collapse", undefined, { collapse: 0, forceLoad: true })
        $(ele).html('keyboard_arrow_down');
    }

}

//Asks the user when they have each class to load the class automatically
dtps.schedule = function () {
    var schedule = {}
    if (confirm("Type in which period you have each class as a number (1-6, type 7 for @d.tech). If the class is from a different semester or you don't have that class for a class period, leave the box blank")) {
        for (var i = 0; i < dtps.classes.length; i++) {
            var num = prompt("Which class period do you have '" + dtps.classes[i].name + "'? (Number 1-6, type 7 for @d.tech, or leave blank)");
            if ((Number(num) > 0) && (Number(num) < 8)) schedule[num] = dtps.classes[i].id;
        }
        localStorage.setItem("dtpsSchedule", JSON.stringify(schedule));
        alert("Your schedule has been saved. When loading Power+, Power+ will try to load the class that you are in instead of the dashboard, if you are using Power+ during school hours.")
    }
}

//Displays class info & syllabus
dtps.classInfo = function (num) {
    if ((dtps.classes[num].syllabus !== "") && dtps.classes[num].syllabus !== null) {
        var blob = new Blob([`<base target="_blank" /> <link type="text/css" rel="stylesheet" href="https://cdn.jottocraft.com/CanvasCSS.css" media="screen,projection"/>
    <style>body {background-color: ` + getComputedStyle($(".card.details")[0]).getPropertyValue("--cards") + `; color: ` + getComputedStyle($(".card.details")[0]).getPropertyValue("--text") + `}</style>` + dtps.classes[num].syllabus], { type: 'text/html' });
        var newurl = window.URL.createObjectURL(blob);
    }
    $(".card.classInfoCard").html(`<i onclick="fluid.cards.close('.card.classInfoCard')" class="material-icons close">close</i>
    <h4 style="font-weight: bold;">` + dtps.classes[num].name + `</h4>
    <p style="color: var(--secText)">` + (dtps.classes[num].description ? dtps.classes[num].description : "") + `</p>
    <div class="assignmentChip"><i class="material-icons">group</i>` + dtps.classes[num].totalStudents + ` students</div>
    ` + (dtps.classes[num].favorite ? `<div title="Favorited class" class="assignmentChip" style="background-color: #daa520"><i style="color:white;font-family: 'Material Icons Outline'" class="material-icons">star_border</i></div>` : "") + `
    <br />
    <div style="margin-top: 20px;" class="syllabusBody">` + ((dtps.classes[num].syllabus !== "") && dtps.classes[num].syllabus !== null ? `<iframe id="syllabusIframe" onload="dtps.iframeLoad('syllabusIframe')" style="margin: 10px 0px; width: 100%; border: none; outline: none;" src="` + newurl + `" />` : "") + `</div>
    `)
    fluid.modal(".card.classInfoCard")
}

//Displays class homepage
dtps.classHome = function (num) {
    $(".card.classInfoCard").html(`<i onclick="fluid.cards.close('.card.classInfoCard')" class="material-icons close">close</i>
    <h4 style="font-weight: bold;">` + dtps.classes[num].subject + ` Homepage</h4>
    <br />
    <p>Loading...</p>`)
    dtps.webReq("canvas", "/api/v1/courses/" + dtps.classes[num].id + "/front_page", function (resp) {
        var data = JSON.parse(resp);
        if (!data.message) {
            var blob = new Blob([`<base target="_blank" /> <link type="text/css" rel="stylesheet" href="https://cdn.jottocraft.com/CanvasCSS.css" media="screen,projection"/>
        <style>body {background-color: ` + getComputedStyle($(".card.details")[0]).getPropertyValue("--cards") + `; color: ` + getComputedStyle($(".card.details")[0]).getPropertyValue("--text") + `}</style>` + data.body], { type: 'text/html' });
            var newurl = window.URL.createObjectURL(blob);
            $(".card.classInfoCard").html(`<i onclick="fluid.cards.close('.card.classInfoCard')" class="material-icons close">close</i>
        <h4 style="font-weight: bold;">` + data.title + `</h4>
        <br />
        <div style="margin-top: 20px;" class="homepageBody"><iframe id="homepageIframe" onload="dtps.iframeLoad('homepageIframe')" style="margin: 10px 0px; width: 100%; border: none; outline: none;" src="` + newurl + `" /></div>
        `)
            fluid.modal(".card.classInfoCard")
        } else {
            alert("Error: No homepage found for this class")
            fluid.cards.close('.card.classInfoCard')
        }
    })
}

//Converts a Power+ stream array into HTML for displaying the assignment list
dtps.renderStream = function (stream, searchRes) {
    var streamlist = [];
    var oldDiv = false;
    for (var i = 0; i < stream.length; i++) {
        var outcomeDom = [];
        if (stream[i].rubric) {
            for (var ii = 0; ii < stream[i].rubric.length; ii++) {
                if (stream[i].rubric[ii].score) {
                    outcomeDom.push(`<div title="` + stream[i].rubric[ii].description + `" style="background-color: ` + dtps.cblColor(stream[i].rubric[ii].score) + `" class="outcome"></div>`)
                }
            }
        }
        streamlist.push((stream[i].old && !oldDiv ? `<h5 style="margin: 75px 75px 10px 75px;` + (dtps.selectedClass == "dash" ? `text-align: center;margin: 75px 25px 10px 75px;` : ``) + ` font-weight: bold;">Old/Undated Assignments</h5>` : "") + `
        <div onclick="` + (stream[i].google ? `window.open('` + stream[i].url + `')` : `dtps.assignment('` + stream[i].id + `', ` + stream[i].class + `)`) + `" class="card graded assignment ` + stream[i].col + `">
        ` + (stream[i].turnedIn && (stream[i].status !== "unsubmitted") ? `<i title="Assignment submitted" class="material-icons floatingIcon" style="color: #0bb75b;">assignment_turned_in</i>` : ``) + `
        ` + (stream[i].status == "unsubmitted" ? `<i title="Assignment unsubmitted" class="material-icons floatingIcon" style="color: #b3b70b;">warning</i>` : ``) + `
        ` + (stream[i].missing ? `<i title="Assignment is missing" class="material-icons floatingIcon" style="color: #c44848;">remove_circle_outline</i>` : ``) + `
        ` + (stream[i].late ? `<i title="Assignment is late" class="material-icons floatingIcon" style="color: #c44848;">assignment_late</i>` : ``) + `
        ` + (stream[i].locked ? `<i title="Assignment submissions are locked" class="material-icons floatingIcon" style="font-family: 'Material Icons Extended'; color: var(--secText, gray);">lock_outline</i>` : ``) + `
        ` + (stream[i].status == "pending_review" ? `<i title="Grade is pending review" class="material-icons floatingIcon" style="color: #b3b70b;">rate_review</i>` : ``) + `
        <div class="points">
        ` + (outcomeDom.length ? `<div class="earned outcomes">` + outcomeDom.join("") + `</div>` : `<div class="earned numbers">` + (stream[i].letter ? stream[i].grade.split("/")[0] : "") + `</div>`) + `
        ` + (stream[i].grade ? (stream[i].grade.split("/")[1] !== undefined ? `<div class="total possible">/` + stream[i].grade.split("/")[1] + `</div>` : "") : "") + `
        </div>
        <h4>` + stream[i].title + `</h4>
      	<h5 style="white-space: nowrap; overflow: hidden;">
         ` + (stream[i].due ? `<div class="infoChip"><i style="margin-top: -4px;" class="material-icons">alarm</i> Due ` + stream[i].due + `</div>` : "") + `
         ` + (stream[i].outcomes !== undefined ? `<div class="infoChip weighted"><i class="material-icons">adjust</i>` + stream[i].outcomes.length + `</div>` : "") + `
         ` + ((stream[i].weight !== undefined) && stream[i].uniqueWeight ? `<div class="infoChip weighted">` + stream[i].weightIcon + stream[i].weight.replace("Comprehension Checks", "CC").replace("Success Skills", "SS").replace("Performance Tasks", "PT") + `</div>` : "") + `
        </h5>
        </div>
      `);
        if (stream[i].old) oldDiv = true;
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
        (searchRes !== "" ? `<div style="text-align: right;"><i class="inputIcon material-icons">search</i><input value="` + searchRes + `" onchange="dtps.search()" class="search inputIcon shadow" placeholder="Search assignments" type="search" /></div>` : "") + `<div style="cursor: auto;" class="card assignment"><h4>No ` + (searchRes == "" ? "assignments" : "results found") + `</h4><p>` + (searchRes == "" ? "There aren't any assignments in this class yet" : "There aren't any search results.") + `</p></div>`
        : ((typeof Fuse !== "undefined" ? `
` + ((dtps.selectedClass !== "dash") && (searchRes == "") ? dtps.renderStreamTools(dtps.selectedClass, true) : "") : "") + streamlist.join(""));
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
dtps.masterStream = function (doneLoading, omitOldAssignments) {
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
        var keyA = new Date(a.dueDate).getTime(),
            keyB = new Date(b.dueDate).getTime();
        var now = new Date().getTime();
        if (a.dueDate == null) { keyA = 0; }
        if (b.dueDate == null) { keyB = 0; }
        if (keyA < now) { a.old = true; }
        if (keyB < now) { b.old = true; }
        if (b.old || a.old) {
            // Compare the 2 dates
            if (keyA < keyB) return 1;
            if (keyA > keyB) return -1;
            return 0;
        } else {
            // Compare the 2 dates
            if (keyA > keyB) return 1;
            if (keyA < keyB) return -1;
            return 0;
        }
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
dtps.getPage = function (classID, id, fromModuleStream) {
    if (id == undefined) var id = dtps.selectedPage;
    if ((dtps.classes[dtps.selectedClass].id == classID) && ((dtps.selectedContent == "pages") || fromModuleStream)) {
        jQuery(".classContent").html(`<div class="spinner"></div>`);
    }
    var spinnerTmp = true;
    dtps.webReq("canvas", "/api/v1/courses/" + classID + "/pages/" + id, function (resp) {
        var data = JSON.parse(resp);
        if ((dtps.classes[dtps.selectedClass].id == classID) && ((dtps.selectedContent == "pages") || fromModuleStream)) {
            var blob = new Blob([`<base target="_blank" /> <link type="text/css" rel="stylesheet" href="https://cdn.jottocraft.com/CanvasCSS.css" media="screen,projection"/>
                <style>body {background-color: ` + getComputedStyle($(".card.details")[0]).getPropertyValue("--cards") + `; color: ` + getComputedStyle($(".card.details")[0]).getPropertyValue("--text") + `}</style>` + data.body], { type: 'text/html' });
            var newurl = window.URL.createObjectURL(blob);
            jQuery(".classContent").html((fromModuleStream ? `<div class="acrylicMaterial" onclick="dtps.moduleStream(dtps.selectedClass)" style="line-height: 40px;display:  inline-block;border-radius: 20px;margin: 82px 0px 0px 82px; cursor: pointer;">
                <div style="font-size: 16px;display: inline-block;vertical-align: middle;margin: 0px 20px;"><i style="vertical-align: middle;" class="material-icons">keyboard_arrow_left</i> Back</div></div>` : "") + `
        <div class="card">
       <h4 style="font-weight: bold;">` + data.title + `</h4>
       <br />
       <iframe id="classPageIframe" onload="dtps.iframeLoad('classPageIframe')" style="margin: 10px 0px; width: 100%; border: none; outline: none;" src="` + newurl + `" />
        </div>
      `);
        }
    });
}

dtps.outcome = function (num, id, i) {
    dtps.webReq("canvas", "/api/v1/outcomes/" + id, function (resp) {
        var data = JSON.parse(resp);

        if (data.description) {
            var blob = new Blob([`<base target="_blank" /> <link type="text/css" rel="stylesheet" href="https://cdn.jottocraft.com/CanvasCSS.css" media="screen,projection"/>
        <style>body {background-color: ` + getComputedStyle($(".card.details")[0]).getPropertyValue("--cards") + `; color: ` + getComputedStyle($(".card.details")[0]).getPropertyValue("--text") + `}</style>` + data.description], { type: 'text/html' });
            var newurl = window.URL.createObjectURL(blob);
        }

        $(".card.outcomeCard").html(`<i onclick="fluid.cards.close('.card.outcomeCard')" class="material-icons close">close</i>
        <h4 style="font-weight: bold;">` + (data.title ? data.title : "An error occurred") + `</h4>
	` + (!data.title ? `<p>Power+ couldn't get the details for this outcome from Canvas</p>` : "") + `
        <div style="margin-bottom: 20px;" class="syllabusBody">` + (data.description ? `<iframe id="syllabusIframe" onload="dtps.iframeLoad('syllabusIframe')" style="margin: 10px 0px; width: 100%; border: none; outline: none;" src="` + newurl + `" />` : "") + `</div>
       <div style="display: inline-block; width: 40%;"> ` + (data.ratings ? data.ratings.map(function (rating) {
            var desc = rating.description.replace(dtps.cblName(rating.description) + ": ", '').replace(dtps.cblName(rating.description) + "- ", '').replace(dtps.cblName(rating.description), '');
            return `<div style="margin: 20px 0px;"><h5><span style="font-weight: bold; font-size: 42px; color: ` + dtps.cblColor(rating.points) + `">` + rating.points + "</span>&nbsp;&nbsp;" + dtps.cblName(rating.description) + `</h5>
            ` + (desc ? `<p>` + desc + `</p>` : "") + `</div>`
        }).join("") : "") + `</div>

        ` + (dtps.classes[num].outcomes[i].alignments && (dtps.classes[num].outcomes[i].alignments.length) ? `<div style="display: inline-block; width: 55%; vertical-align: top;">
	<h5>Assignments</h5>
        ` + dtps.classes[num].outcomes[i].alignments.map(function (alignment, ii) {
            return `<div onclick="dtps.assignment('` + alignment.assignment_id + `', ` + num + `)" style="margin: 5px 0px; color: var(--lightText); cursor: pointer; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">` + alignment.title + `</div>`
        }).join("") + `
        </div>` : ""))

        fluid.modal(".card.outcomeCard")
    })
}

//Loads the gradebook for a class. The type paramater specifies if it should load the mastery gradebook or not
dtps.gradebook = function (num) {
    dtps.showClasses();
    if (dtps.classes[num].noOutcomes) {
        $(".btns .btn.grades").hide();
        $(".btns .btn").removeClass("active");
        $(".btns .btn.stream").addClass("active");
        dtps.selectedContent = "stream";
        dtps.classStream(num);
    } else {
        headsUp = ``;
        $(".classContent").html(headsUp + `<div class="spinner"></div>`)

        dtps.webReq("canvas", "/api/v1/courses/" + dtps.classes[num].id + "/outcome_alignments?student_id=" + dtps.user.id, function (resp) {
            dtps.webReq("canvas", "/api/v1/courses/" + dtps.classes[num].id + "/outcome_rollups?user_ids[]=" + dtps.user.id + "&include[]=outcomes", function (respp) {
                dtps.webReq("canvas", "/api/v1/courses/" + dtps.classes[num].id + "/outcome_results?per_page=100&user_ids[]=" + dtps.user.id, function (resppp) {
                    var alignmentData = JSON.parse(resp);
                    var rollupData = JSON.parse(respp);
                    var resultsData = JSON.parse(resppp).outcome_results;
                    dtps.classes[num].outcomes = {};
                    dtps.classes[num].gradedOutcomes = {};
                    dtps.classes[num].recentChanges = [];

                    for (var i = 0; i < rollupData.linked.outcomes.length; i++) {
                        dtps.classes[num].outcomes[rollupData.linked.outcomes[i].id] = rollupData.linked.outcomes[i]
                        dtps.classes[num].outcomes[rollupData.linked.outcomes[i].id].alignments = []
                        dtps.classes[num].outcomes[rollupData.linked.outcomes[i].id].gradedAlignments = []
                        dtps.classes[num].outcomes[rollupData.linked.outcomes[i].id].sandbox = []
                        //lowest score sandbox starts with null since we are testing various different scores. null won't actually change, its just for making sure the length of the array is correct.
                        dtps.classes[num].outcomes[rollupData.linked.outcomes[i].id].lowestSandbox = [null]
                        dtps.classes[num].outcomes[rollupData.linked.outcomes[i].id].gradedAlignmentIDs = []
                    }

                    for (var i = 0; i < alignmentData.length; i++) {
                        if (dtps.classes[num].outcomes[alignmentData[i].learning_outcome_id] !== undefined) {
                            dtps.classes[num].outcomes[alignmentData[i].learning_outcome_id].alignments.push(alignmentData[i]);
                            var gradAlign = dtps.classes[num].outcomes[alignmentData[i].learning_outcome_id].gradedAlignments;

                            //get grades for outcome alignments
                            for (var ii = 0; ii < resultsData.length; ii++) {
                                if ((String(resultsData[ii].links.assignment).replace("assignment_", "") == alignmentData[i].assignment_id) && (resultsData[ii].links.learning_outcome == alignmentData[i].learning_outcome_id)) {
                                    if (resultsData[ii].score && !dtps.classes[num].outcomes[alignmentData[i].learning_outcome_id].gradedAlignmentIDs.includes(resultsData[ii].links.assignment)) {
                                        gradAlign.push(alignmentData[i]);
                                        dtps.classes[num].outcomes[alignmentData[i].learning_outcome_id].gradedAlignmentIDs.push(resultsData[ii].links.assignment);
                                        gradAlign[gradAlign.length - 1].score = resultsData[ii].score;
                                        gradAlign[gradAlign.length - 1].date = (dtps.assignmentGradeTimes[alignmentData[i].assignment_id] ? dtps.assignmentGradeTimes[alignmentData[i].assignment_id] : resultsData[ii].submitted_or_assessed_at);
                                        gradAlign[gradAlign.length - 1].gradAlignIndex = gradAlign.length - 1;

                                        //save for recent changes sandbox and lowest score sandbox
                                        dtps.classes[num].outcomes[alignmentData[i].learning_outcome_id].sandbox.push(resultsData[ii].score);
                                        dtps.classes[num].outcomes[alignmentData[i].learning_outcome_id].lowestSandbox.push(resultsData[ii].score);

                                        //save recent changes
                                        var change = dtps.classes[num].recentChanges[new Date(gradAlign[gradAlign.length - 1].date).toDateString()]
                                        if (change == undefined) {
                                            dtps.classes[num].recentChanges[new Date(gradAlign[gradAlign.length - 1].date).toDateString()] = {
                                                letterBefore: "--",
                                                alignments: []
                                            }
                                        }
                                        dtps.classes[num].recentChanges[new Date(gradAlign[gradAlign.length - 1].date).toDateString()].alignments.push(gradAlign[gradAlign.length - 1]);
                                    }
                                }
                            }

                            //sort graded alignments for decaying average
                            dtps.classes[num].outcomes[alignmentData[i].learning_outcome_id].gradedAlignments.sort(function (a, b) {
                                var keyA = new Date(a.date),
                                    keyB = new Date(b.date);
                                // Compare the 2 dates
                                if (keyA < keyB) return 1;
                                if (keyA > keyB) return -1;
                                return 0;
                            })

                        } else {
                            dtps.log("WARNING: GRADEBOOK FOUND AN OUTCOME ALIGNMENT THAT DOES NOT MATCH ANY ROLLUP (dtps.gradebook)")
                        }
                    }

                    //get lowest score for each outcome
                    Object.keys(dtps.classes[num].outcomes).map((k, index) => {
                        var outcome = dtps.classes[num].outcomes[k];
                        //5 means that more than just a 4 is needed to get a 3.5. it doesnt mean a 5 is needed
                        var lowestScore = 5;

                        //check new score for each outcome
                        outcome.ratings.map((rating) => {
                            //recalculate outcome decaying average
                            var lastAssessment = rating.points * (outcome.calculation_int / 100);
                            var sum = 0;
                            //starting at ii=1 is intentional to omit the latest outcome score from everything else
                            for (var ii = 1; ii < outcome.lowestSandbox.length; ii++) sum += outcome.lowestSandbox[ii];
                            var everythingElse = (sum / (outcome.lowestSandbox.length - 1)) * (1 - (outcome.calculation_int / 100))

                            var calculatedScore = lastAssessment + everythingElse;
                            if (outcome.lowestSandbox.length == 1) calculatedScore = rating.points;

                            //must get at least a 3.5 outcome average
                            if (calculatedScore >= 3.5) {
                                if (rating.points < lowestScore) lowestScore = rating.points;
                            }
                        });

                        outcome.lowestScore = lowestScore;
                    })


                    for (var i = 0; i < rollupData.rollups[0].scores.length; i++) {
                        var outcome = dtps.classes[num].outcomes[rollupData.rollups[0].scores[i].links.outcome];
                        dtps.classes[num].gradedOutcomes[rollupData.rollups[0].scores[i].links.outcome] = rollupData.rollups[0].scores[i].score;
                        outcome.score = rollupData.rollups[0].scores[i].score
                        if (outcome.gradedAlignments[0]) {
                            outcome.lastAssignment = {
                                id: outcome.gradedAlignments[0].assignment_id,
                                name: outcome.gradedAlignments[0].title,
                                score: outcome.gradedAlignments[0].score
                            }
                        }
                    }

                    //sort recent changes
                    dtps.classes[num].recentChangesKeys = Object.keys(dtps.classes[num].recentChanges).sort(function (a, b) {
                        var keyA = new Date(a),
                            keyB = new Date(b);
                        // Compare the 2 dates
                        if (keyA < keyB) return 1;
                        if (keyA > keyB) return -1;
                        return 0;
                    });

                    //get recent changes
                    dtps.classes[num].recentChangesKeys.map((k, index) => {
                        if (index < 3) {
                            console.log(k, index);
                            var change = dtps.classes[num].recentChanges[k];

                            //update data in sandbox
                            for (var ii = 0; ii < change.alignments.length; ii++) {
                                var sandbox = dtps.classes[num].outcomes[change.alignments[ii].learning_outcome_id].sandbox;
                                sandbox[change.alignments[ii].gradAlignIndex] = null;
                                //store last time outcome sandbox was modified
                                dtps.classes[num].outcomes[change.alignments[ii].learning_outcome_id].modded = k;
                            }

                            //recalculate outcome scores
                            var outcomeScores = [];
                            Object.keys(dtps.classes[num].outcomes).map((kk) => {
                                var outcome = dtps.classes[num].outcomes[kk];
                                if (outcome.modded == k) {
                                    //get length of all values in the sandbox, excluding null
                                    //and also first outcome assessment that is not null
                                    var counter = 0;
                                    var firstScore = null;
                                    for (var ii = 0; ii < outcome.sandbox.length; ii++) {
                                        if (outcome.sandbox[ii] !== null) {
                                            counter++;
                                            if (firstScore == null) firstScore = outcome.sandbox[ii];
                                        }
                                    }
                                    outcome.sandboxLength = counter;
                                    outcome.sandboxFirst = firstScore;

                                    //outcome alignments affected during this change, recalculate outcome score
                                    var lastAssessment = outcome.sandboxFirst * (outcome.calculation_int / 100);
                                    var sum = 0;
                                    //starting at ii=1 is intentional to omit the latest outcome score from everything else
                                    for (var ii = 0; ii < outcome.sandbox.length; ii++) {
                                        if (outcome.sandbox[ii] !== null) {
                                            sum += outcome.sandbox[ii];
                                        }
                                    }
                                    var everythingElse = (sum / (outcome.sandboxLength - 1)) * (1 - (outcome.calculation_int / 100))

                                    outcome.sandboxScore = lastAssessment + everythingElse;
                                    if (outcome.sandboxLength == 1) outcome.sandboxScore = outcome.sandboxFirst;
                                    if (outcome.sandboxLength) outcomeScores.push(outcome.sandboxScore);
                                } else {
                                    //outcome alignments not affected during this change, use previous outcome sandbox score or normal score if thats not present
                                    if (outcome.sandboxScore || outcome.score) outcomeScores.push(outcome.sandboxScore || outcome.score)
                                }
                            })

                            console.log("Recent outcome scores before " + k, outcomeScores)

                            //calculate new class grade
                            dtps.computeClassGrade(undefined, undefined, outcomeScores, (data) => {
                                change.letter = data;
                                console.log(change);
                            })
                        }
                    })

                    //temporary variable for if outcome divider is added yet
                    var dividerAdded = false;

                    $(".card.recentChanges").html(`<i onclick="fluid.cards.close('.card.recentChanges')" class="material-icons close">close</i>
                    <h5 style="font-weight: bold; margin-top: 0px; font-size: 32px;"><i class="material-icons">restore</i> Recent Changes</h5>
                    ` + dtps.classes[num].recentChangesKeys.map((k, index) => {
                        if (index < 3) {
                            if (index == 0) {
                                var letter = dtps.classes[num].letter;
                            } else {
                                var letter = dtps.classes[num].recentChanges[dtps.classes[num].recentChangesKeys[index - 1]].letter;
                            }
                            return `<div class="change"><h5 class="changeName"><div class="letter">` + letter + `</div>` + k + `</h5>` + dtps.classes[num].recentChanges[k].alignments.map((alignment) => {
                                return `<p class="alignmentChange"><span style="color: ` + dtps.cblColor(alignment.score) + `;">` + alignment.score + `</span> ` + alignment.title + `</p>`
                            }).join("") + `</div>`
                        } else {
                            return ``;
                        }
                    }).join(""));

                    var fix = "";
                    //not all outcomes meeting A criteria
                    if (dtps.classes[num].gradeCalc.number75Length !== dtps.classes[num].gradeCalc.number75LengthA) {
                        fix = "Get at least a 3.5 in " + (dtps.classes[num].gradeCalc.number75Length - dtps.classes[num].gradeCalc.number75LengthA) + " more outcomes to get an A"
                    }
                    //lowest score is below a 3
                    if (dtps.classes[num].gradeCalc.lowestValue < 3) {
                        fix = "Make sure all outcomes are at least a 3 to get an A (" + dtps.classes[num].gradeCalc.moreA + " outcomes are not a 3)"
                    }
                    //both
                    if ((dtps.classes[num].gradeCalc.lowestValue < 3) && (dtps.classes[num].gradeCalc.number75Length !== dtps.classes[num].gradeCalc.number75LengthA)) {
                        fix = "Get at least a 3.5 in " + (dtps.classes[num].gradeCalc.number75Length - dtps.classes[num].gradeCalc.number75LengthA) + " more outcomes and make sure all outcomes are at least a 3 to get an A (" + dtps.classes[num].gradeCalc.moreA + " outcomes are not a 3)"
                    }

                    $(".classContent").html(`
                    <div style="display: none;" id="whatIfGrade">
                    <div class="letter">--</div>
                    <div class="notice">
                    <h5>What-If Grade (beta)</h5>
                    <p>This letter grade is hypothetical and does not reflect your actual class grade</p>
                    <p><a onclick="dtps.gradebook(` + num + `)" href="#">Show actual grades</a></p>
                    </div>
                    </div>

    ` + (dtps.classes[num].letter !== "--" ? `<div class="card">
    <h3 style="margin-bottom: 10px; height: 80px; line-height: 80px; margin-top: 0px; font-weight: bold; -webkit-text-fill-color: transparent; background: -webkit-linear-gradient(var(--light), var(--norm)); -webkit-background-clip: text;">` + dtps.classes[num].subject + `
    <div class="classGradeCircle" style="background-color: transparent; display: inline-block;width: 80px;height: 80px; font-size: 40px; font-weight: bold; text-align: center;line-height: 80px;border-radius: 50%;float: right;vertical-align: middle;color: var(--light);">` + dtps.classes[num].letter + `</div></h3>
    <h5 style="height: 60px; line-height: 60px;color: var(--lightText); font-size: 24px; margin: 0px;">` + (dtps.classes[num].gradeCalc.number75thresh * 100).toFixed(0) + `% of outcome scores are ≥
    <div style=" display: inline-block; width: 80px; text-align: center; height: 60px; line-height: 60px; border-radius: 50%; float: right; vertical-align: middle; font-size: 26px; color: var(--text); font-weight: bold;">` + (dtps.classes[num].gradeCalc.number75 ? dtps.classes[num].gradeCalc.number75 : "--") + `</div></h5>
    <h5 style="height: 60px; line-height: 60px;color: var(--lightText); font-size: 24px; margin: 0px;">No outcome scores are lower than
    <div style=" display: inline-block; width: 80px; text-align: center; height: 60px; line-height: 60px; border-radius: 50%; float: right; vertical-align: middle; font-size: 26px; color: var(--text); font-weight: bold;">` + dtps.classes[num].gradeCalc.lowestValue + `</div></h5>
    <div style="display: none;" id="classGradeMore">
    <br />
    ` + (dtps.classes[num].letter !== "A" ? `<p style="text-align: center;">` + fix + `</p>` : "") + `
    <table class="u-full-width dtpsTable">
  <thead>
    <tr>
      <th>&nbsp;&nbsp;Final Letter</th>
      <th>At least 75% of outcome scores are ≥</th>
      <th>No outcome scores below</th>
    </tr>
  </thead>
  <tbody>
    <tr ` + (dtps.classes[num].letter == "A" ? `style="background-color: var(--norm); color: var(--light);font-size:20px;"` : ``) + `>
      <td>&nbsp;&nbsp;A</td>
      <td>3.5</td>
      <td>3.0</td>
    </tr>
    <tr ` + (dtps.classes[num].letter == "A-" ? `style="background-color: var(--norm); color: var(--light);font-size:20px;"` : ``) + `>
      <td>&nbsp;&nbsp;A-</td>
      <td>3.3</td>
      <td>2.5</td>
    </tr>
    <tr ` + (dtps.classes[num].letter == "B+" ? `style="background-color: var(--norm); color: var(--light);font-size:20px;"` : ``) + `>
      <td>&nbsp;&nbsp;B+</td>
      <td>3</td>
      <td>2.5</td>
    </tr>
    <tr ` + (dtps.classes[num].letter == "B" ? `style="background-color: var(--norm); color: var(--light);font-size:20px;"` : ``) + `>
      <td>&nbsp;&nbsp;B</td>
      <td>3</td>
      <td>2.25</td>
    </tr>
    <tr ` + (dtps.classes[num].letter == "B-" ? `style="background-color: var(--norm); color: var(--light);font-size:20px;"` : ``) + `>
      <td>&nbsp;&nbsp;B-</td>
      <td>2.6</td>
      <td>2.0</td>
    </tr>
    <tr ` + (dtps.classes[num].letter == "C" ? `style="background-color: var(--norm); color: var(--light);font-size:20px;"` : ``) + `>
      <td>&nbsp;&nbsp;C</td>
      <td>2.2</td>
      <td>0</td>
    </tr>
    <tr ` + (dtps.classes[num].letter == "I" ? `style="background-color: var(--norm); color: var(--light);font-size:20px;"` : ``) + `>
      <td>&nbsp;&nbsp;I</td>
      <td>Anything else</td>
      <td>--</td>
    </tr>
  </tbody>
</table>
</div>
<br />
<a onclick="$('#classGradeMore').toggle(); if ($('#classGradeMore').is(':visible')) {$(this).html('Show less')} else {$(this).html('Show more')}" style="color: var(--secText, gray); cursor: pointer;">Show More</a>
&nbsp;&nbsp;<a onclick="fluid.cards('.card.recentChanges');" style="color: var(--secText, gray); cursor: pointer;">Recent Changes</a>
</div>
<br />` : "") + `
` + Object.keys(dtps.classes[num].outcomes).sort(function (a, b) {
                        var keyA = dtps.classes[num].outcomes[a].score,
                            keyB = dtps.classes[num].outcomes[b].score;
                        if (keyA == undefined) { keyA = 999999 - dtps.classes[num].outcomes[a].alignments.length; }
                        if (keyB == undefined) { keyB = 999999 - dtps.classes[num].outcomes[b].alignments.length; }
                        // Compare the 2 scores
                        if (keyA > keyB) return 1;
                        if (keyA < keyB) return -1;
                        return 0;
                    }).map(function (i) {
                        var divider = !dividerAdded && !dtps.classes[num].outcomes[i].score;
                        if (divider) dividerAdded = true;
                        return (divider ? `<h5 style="font-weight: bold;margin: 75px 75px 10px 75px;">Unassesed outcomes</h5>` : "") + `
<div style="border-radius: 20px;padding: 20px; padding-bottom: 20px;" class="card outcomeResults">

<div onclick="dtps.outcome(` + num + `, '` + dtps.classes[num].outcomes[i].id + `', ` + i + `)" style="cursor: pointer;">
    ` + (dtps.classes[num].outcomes[i].score ? `<div class="points">
        <div style="color: ` + dtps.cblColor(dtps.classes[num].outcomes[i].score) + `" class="earned numbers">` + dtps.classes[num].outcomes[i].score + `</div>
    </div>` : "") + `
  <h5 style="font-size: 1.4rem; white-space: nowrap;overflow: hidden;text-overflow: ellipsis; margin-top: 0px; margin-right: 40px;">` + dtps.classes[num].outcomes[i].title + `</h5>
  <div title="Number of assignments that assess this outcome" style="color: var(--secText); display: inline-block; margin-right: 5px;"><i class="material-icons" style=" vertical-align: middle; ">assignment</i> ` + dtps.classes[num].outcomes[i].alignments.length + `</div>
  ` + (dtps.classes[num].outcomes[i].calculation_method == "decaying_average" ? `<div title="Decaying Average Ratio (last assignment / everything else)" style="color: var(--secText); display: inline-block; margin: 0px 5px;"><i class="material-icons" style=" vertical-align: middle; ">functions</i> ` + dtps.classes[num].outcomes[i].calculation_int + "% / " + (100 - dtps.classes[num].outcomes[i].calculation_int) + `%</div>` : "") + `
  ` + (dtps.classes[num].outcomes[i].lowestScore && (dtps.classes[num].outcomes[i].calculation_int >= 50) ? `<div title="On your next assignment for this outcome, you must get at least this number to get a 3.5 or higher in this outcome (beta)" style="color: var(--secText); display: inline-block; margin: 0px 5px;"><i class="material-icons" style=" vertical-align: middle; ">timeline</i> ` + (dtps.classes[num].outcomes[i].lowestScore == 5 ? ">4" : dtps.classes[num].outcomes[i].lowestScore) + `</div>` : "") + `
  <div class="dev" style="color: var(--secText); display: inline-block; margin: 0px 5px;"><i class="material-icons" style=" vertical-align: middle; ">bug_report</i> ` + dtps.classes[num].outcomes[i].id + `</div>
  ` + (dtps.classes[num].outcomes[i].score >= dtps.classes[num].outcomes[i].mastery_points ? `<div title="Outcome has been mastered" style="display: inline-block;margin: 0px 5px;color: #5d985d;">MASTERED</div>` : "") + `
  </div>

  ` + (dtps.classes[num].outcomes[i].lastAssignment ? `<div style="margin: 10px 0px;"></div>

  <div style="font-size: 18px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
  <i onclick="$(this).parent().siblings('.fullList').toggle(); if ($(this).parent().siblings('.fullList').is(':visible')) {$(this).html('keyboard_arrow_down')} else {$(this).html('keyboard_arrow_right')}" style="` + (dtps.classes[num].outcomes[i].gradedAlignments.length > 1 ? "" : "display: none;") + `cursor: pointer; vertical-align: middle; color:var(--lightText);" class="material-icons down fullListToggleIcon">keyboard_arrow_right</i>

  <div class="coolEpicLatest" id="` + num + `-` + i + `-` + 0 + `" ` + (dtps.classes[num].letter !== "--" ? `contenteditable="true"` : "") + ` style="` + (dtps.classes[num].outcomes[i].calculation_int >= 50 ?
                                    `line-height: 22px; width: 22px; height: 22px; border: none !important; --assessmentColor: ` + dtps.cblColor(dtps.classes[num].outcomes[i].lastAssignment.score) + `; background-color: var(--assessmentColor); color: white;`
                                    : `line-height: 20px; width: 20px; height: 20px; --assessmentColor: ` + dtps.cblColor(dtps.classes[num].outcomes[i].lastAssignment.score) + `; border: 1px solid var(--assessmentColor); color: var(--assessmentColor);`) + `
        display: inline-block; text-align: center; font-size: ` + (String(dtps.classes[num].outcomes[i].lastAssignment.score).length > 2 ? "10px" : "16px") + `; border-radius: 50%; margin-right: 5px; vertical-align: middle; outline: none;">
  ` + dtps.classes[num].outcomes[i].lastAssignment.score + `</div>
   <span class="coolEpicLatest" onclick="dtps.assignment('` + dtps.classes[num].outcomes[i].lastAssignment.id + `', ` + num + `)" style="cursor: pointer;">` + dtps.classes[num].outcomes[i].lastAssignment.name + `</span></div>` : "") + `
  
<div style="margin-top: 10px; display: none;" class="fullList">
` + dtps.classes[num].outcomes[i].gradedAlignments.map(function (alignment, ii) {
                                        return `<div ` + (ii == 0 ? `class="fullListLatest"` : "") + ` style="` + (ii == 0 ? "display: none;" : "") + `padding-left: 29px; margin: 2px 0px; color: var(--lightText); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
<div id="` + num + `-` + i + `-` + ii + `" ` + (dtps.classes[num].letter !== "--" ? `contenteditable="true"` : "") + ` style="` + (dtps.classes[num].outcomes[i].calculation_int >= 50 ? `line-height: 18px; width: 18px; height: 18px; --assessmentColor: ` + dtps.cblColor(alignment.score) + `; border: 1px solid var(--assessmentColor); color: var(--assessmentColor);` : `line-height: 20px; width: 20px; height: 20px; border: none !important; --assessmentColor: ` + dtps.cblColor(alignment.score) + `; background-color: var(--assessmentColor); color: white;`) + `display: inline-block; text-align: center; font-size: ` + (String(alignment.score).length > 2 ? "10px" : "14px") + `; border-radius: 50%; margin-right: 5px; outline: none;">` + alignment.score + `</div>
<span style="cursor: pointer;" onclick="dtps.assignment('` + alignment.assignment_id + `', ` + num + `)">` + alignment.title + `</span></div>`
                                    }).join("") + `
  </div>

  ` + ((dtps.classes[num].letter !== "--") && dtps.classes[num].outcomes[i].lastAssignment ? `
  <p onclick="dtps.simOutcomeInit(` + num + `, ` + i + `, this);" style="font-size: 14px; color: var(--secText); margin: 0px; margin-top: 10px; cursor: pointer;">
  <i style="cursor: pointer; vertical-align: middle; font-size: 16px;" class="material-icons down">add_box</i>
  Simulate additional outcome assessment
  </p>` : "") + `

  </div>`
                    }).join("") + `
</div>`)

                    Object.keys(dtps.classes[num].outcomes).map(function (i) {
                        dtps.classes[num].outcomes[i].gradedAlignments.map(function (alignment, ii) {
                            $("#" + num + "-" + i + "-" + ii + ", #" + num + "-" + i + "-extra").on("DOMCharacterDataModified", function (e) {
                                var text = $(this).text();
                                if ((String(text).length > 3) || (text && isNaN(Number(text))) || (text && ((Number(text) > 4) || (Number(text) < 1)))) {
                                    $(this).css("--assessmentColor", "var(--secText)");
                                    $("#whatIfGrade .letter").html("--");
                                    $("#whatIfGrade").show();
                                    $(this).parents(".card.outcomeResults").find(".earned.numbers").html("--*");
                                    $(this).parents(".card.outcomeResults").find(".earned.numbers").css("color", "var(--secText)");
                                } else {
                                    //update data
                                    var outcome = dtps.classes[$(this).attr("id").split("-")[0]].outcomes[$(this).attr("id").split("-")[1]];
                                    if ($(this).attr("sim") == "true") {
                                        outcome.gradedAlignments[0].score = Number(text);
                                    } else {
                                        var iii = $(this).attr("id").split("-")[2];
                                        if ((iii == 0) && outcome.simReady) iii = outcome.gradedAlignments.length - 1;
                                        outcome.gradedAlignments[iii].score = Number(text);
                                    }

                                    //recalculate outcome decaying average
                                    var lastAssessment = outcome.gradedAlignments[0].score * (outcome.calculation_int / 100);
                                    var sum = 0;
                                    //starting at ii=1 is intentional to omit the latest outcome score from everything else
                                    for (var ii = 1; ii < outcome.gradedAlignments.length; ii++) sum += outcome.gradedAlignments[ii].score;
                                    var everythingElse = (sum / (outcome.gradedAlignments.length - 1)) * (1 - (outcome.calculation_int / 100))

                                    var calculatedScore = lastAssessment + everythingElse;
                                    if (outcome.gradedAlignments.length == 1) calculatedScore = outcome.gradedAlignments[0].score;
                                    dtps.classes[$(this).attr("id").split("-")[0]].gradedOutcomes[$(this).attr("id").split("-")[1]] = calculatedScore;

                                    //get new class grade
                                    dtps.computeClassGrade(undefined, undefined, Object.values(dtps.classes[$(this).attr("id").split("-")[0]].gradedOutcomes), (data) => {
                                        $("#whatIfGrade .letter").html(data);
                                        $("#whatIfGrade").show();
                                    })

                                    //display results
                                    $(this).parents(".card.outcomeResults").find(".earned.numbers").html(Number(calculatedScore.toFixed(2)) + "*");
                                    $(this).parents(".card.outcomeResults").find(".earned.numbers").css("color", dtps.cblColor(calculatedScore));
                                    $(this).css("--assessmentColor", dtps.cblColor(text));
                                    $(this).siblings("span").html(!$(this).siblings("span").html().endsWith("*") ? $(this).siblings("span").html() + "*" : $(this).siblings("span").html());
                                }
                            })
                        });
                    })
                });
            });
        })
    }
}

dtps.simOutcomeInit = function (num, i, ele) {
    $(ele).parents(".card.outcomeResults").find('.fullList').find('.fullListLatest').show();
    $(ele).parents(".card.outcomeResults").find('.fullListToggleIcon').show();
    $(ele).parents(".card.outcomeResults").find("div.coolEpicLatest").attr('sim', true);
    $(ele).parents(".card.outcomeResults").find("div.coolEpicLatest").html('--');
    $(ele).parents(".card.outcomeResults").find("div.coolEpicLatest").css("--assessmentColor", "var(--secText)");
    $(ele).parents(".card.outcomeResults").find("span.coolEpicLatest").html('Simulated Outcome Assessment*');
    $(ele).parents(".card.outcomeResults").find(".earned.numbers").html("--*");
    $(ele).parents(".card.outcomeResults").find(".earned.numbers").css("color", "var(--secText)");
    $("#whatIfGrade .letter").html("--");
    $("#whatIfGrade").show();
    $(ele).hide();
    var outcome = dtps.classes[num].outcomes[i];
    outcome.gradedAlignments.push(outcome.gradedAlignments[0])
    outcome.gradedAlignments[0] = {
        learning_outcome_id: "SIM",
        title: "Simulated Outcome Assessment*",
        assignment_id: "0",
        submission_types: "none",
        url: "https://powerplus.app",
        score: Number($(ele).text()),
        date: new Date().toISOString()
    }
    outcome.simReady = true;
}

//Shows details for an assignment given the assignment ID and class number
dtps.assignment = function (id, classNum, submissions) {
    var streamNum = dtps.classes[classNum].streamitems.indexOf(String(id));
    var assignment = dtps.classes[classNum].stream[streamNum];
    console.log(classNum, streamNum);
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

                if (assignment.body) {
                    var blob = new Blob([`<base target="_blank" /> <link type="text/css" rel="stylesheet" href="https://cdn.jottocraft.com/CanvasCSS.css" media="screen,projection"/>
    <style>body {background-color: ` + getComputedStyle($(".card.details")[0]).getPropertyValue("--cards") + `; color: ` + getComputedStyle($(".card.details")[0]).getPropertyValue("--text") + `}</style>` + assignment.body], { type: 'text/html' });
                    var newurl = window.URL.createObjectURL(blob);
                }

                $(".card.details").html(`<i onclick="fluid.cards.close('.card.details'); $('.card.details').html('');" class="material-icons close">close</i>
<h4 style="font-weight: bold;">` + assignment.title + `</h4>

<div>
` + (assignment.due ? `<div class="assignmentChip"><i class="material-icons">alarm</i>Due ` + assignment.due + `</div>` : "") + `
` + (assignment.outcomes ? `<div class="assignmentChip"><i class="material-icons">adjust</i> ` + assignment.outcomes.length + `</div>` : "") + `
` + (assignment.turnedIn && (assignment.status !== "unsubmitted") ? `<div  title="Assignment submitted" class="assignmentChip" style="background-color: #0bb75b"><i style="color:white;" class="material-icons">assignment_turned_in</i></div>` : "") + `
` + (assignment.status == "unsubmitted" ? `<div  title="Assignment unsubmitted" class="assignmentChip" style="background-color: #b3b70b"><i style="color:white;" class="material-icons">warning</i></div>` : "") + `
` + (assignment.missing ? `<div  title="Assignment is missing" class="assignmentChip" style="background-color: #c44848"><i style="color:white;" class="material-icons">remove_circle_outline</i></div>` : "") + `
` + (assignment.late ? `<div title="Assignment is late" class="assignmentChip" style="background-color: #c44848"><i style="color:white;" class="material-icons">assignment_late</i></div>` : "") + `
` + (assignment.locked ? `<div title="Assignment submissions are locked" class="assignmentChip" style="background-color: var(--secText, gray);"><i style="color:white;font-family: 'Material Icons Extended';" class="material-icons">lock_outline</i></div>` : "") + `
` + (assignment.status == "pending_review" ? `<div title="Grade is pending review" class="assignmentChip" style="background-color: #b3b70b"><i style="color:white;" class="material-icons">rate_review</i></div>` : "") + `
</div>

<div style="margin-top: 20px;" class="assignmentBody">` + (assignment.body ? `<iframe id="assignmentIframe" onload="dtps.iframeLoad('assignmentIframe')" style="margin: 10px 0px; width: 100%; border: none; outline: none;" src="` + newurl + `" />` : "") + `</div>

<div style="margin: 5px 0px; background-color: var(--secText); height: 1px; width: 100%;" class="divider"></div>
<div style="width: calc(40% - 2px); margin-top: 20px; display: inline-block; overflow: hidden; vertical-align: middle;">
<p style="color: var(--secText); margin: 5px 0px;"><i style="vertical-align: middle;" class="material-icons">add_box</i> Posted: ` + assignment.published + `</p>
` + (assignment.due ? `<p style="color: var(--secText); margin: 5px 0px;"><i style="vertical-align: middle;" class="material-icons">alarm</i> Due: ` + assignment.due + `</p>` : "") + `
` + (assignment.locksAt ? `<p style="color: var(--secText); margin: 5px 0px;"><i style="vertical-align: middle;font-family: 'Material Icons Extended'" class="material-icons">lock_outline</i> Locks: ` + new Date(assignment.locksAt).toDateString().slice(0, -5) + ", " + dtps.ampm(new Date(assignment.locksAt)) + `</p>` : "") + `
` + (assignment.unlocksAt ? `<p style="color: var(--secText); margin: 5px 0px;"><i style="vertical-align: middle;" class="material-icons">lock_open</i> Unlocks: ` + new Date(assignment.unlocksAt).toDateString().slice(0, -5) + ", " + dtps.ampm(new Date(assignment.unlocksAt)) + `</p>` : "") + `
` + (assignment.status ? `<p style="color: var(--secText); margin: 5px 0px;"><i style="vertical-align: middle;" class="material-icons">assignment_return</i> Status: ` + (assignment.status == "submitted" ? "Submitted" : (assignment.status == "unsubmitted" ? "Unsubmitted" : (assignment.status == "graded" ? "Graded" : (assignment.status == "pending_review" ? "Pending Review" : assignment.status)))) + `</p>` : "") + `
` + ((assignment.worth !== undefined) && (assignment.worth !== null) ? `<p style="color: var(--secText); margin: 5px 0px;"><i style="vertical-align: middle;" class="material-icons">bar_chart</i> Total Points: ` + assignment.worth + `</p>` : "") + `
` + (assignment.grade ? `<p style="color: var(--secText); margin: 5px 0px;"><i style="vertical-align: middle;" class="material-icons">assessment</i> Points Earned: ` + assignment.grade + ` (` + assignment.letter + `)</p>` : "") + `
` + (assignment.submissionTypes ? `<p style="color: var(--secText); margin: 5px 0px;"><i style="vertical-align: middle;" class="material-icons">assignment</i> Submission Types: ` + assignment.submissionTypes.join(", ").replace(/online_/g, '').replace(/_/g, ' ') + `</p>` : "") + `
<p style="color: var(--secText); margin: 5px 0px;"><i style="vertical-align: middle;" class="material-icons">category</i> Group: ` + assignment.weight + `</p>
` + (assignment.outcomes ? assignment.outcomes.map(function (key) { return `<p style="color: var(--secText); margin: 5px 0px;"><i style="vertical-align: middle;" class="material-icons">adjust</i> ` + key + `</p>`; }).join("") : "") + `
` + (assignment.locked && assignment.lockedReason ? `<p style="color: var(--secText); margin: 5px 0px;"><i style="vertical-align: middle;font-family: 'Material Icons Extended'" class="material-icons">lock_outline</i> ` + assignment.lockedReason + `</p>` : "") + `
<p style="color: var(--secText); margin: 5px 0px;"><i style="vertical-align: middle;" class="material-icons">class</i> Class: ` + assignment.subject + `</p>
<br />
<div class="btn small outline" onclick="dtps.assignment(` + id + `, ` + classNum + `, true)"><i class="material-icons">assignment</i> Submissions</div>
<div class="btn small outline" onclick="window.open('` + assignment.url + `')"><i class="material-icons">open_in_new</i> Open in Canvas</div>
</div>
<div style="width: calc(60% - 7px); margin-top: 20px; margin-left: 5px; display: inline-block; overflow: hidden; vertical-align: middle;">
` + (assignment.rubric ? assignment.rubric.map(function (rubric) {
                    if (rubric.ratings) {
                        dtps.classes[classNum].tmp[rubric.id] = rubric.long_description
                        return `
                        <div style="margin: 32px 0px;">
                        <h6 style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">` + rubric.description + `</h6>
        <div style="margin-right: 20px; vertical-align: middle;">
<p style="color: var(--secText);" class="` + rubric.id + `"><a onclick="$('p.` + rubric.id + `').html(dtps.classes[` + classNum + `].tmp['` + rubric.id + `'])" href="#">Rubric details</a></p>
</div>
<div style="display: inline-block; border-radius: 8px; white-space: nowrap; overflow: hidden; font-size: 0; vertical-align: middle; background: ` + (rubric.score ? rubric.ratings[rubric.ratingItems.indexOf(rubric.score)].color : `linear-gradient(90deg, ` + rubric.ratings.map(function (rating) { return rating.color + ","; }).join("").slice(0, -1) + `)`) + `;">
` + (rubric.score !== undefined ? `
<div style="padding: 5px 10px; font-size: 18px; background-color: transparent; color: white; font-weight: bold; width: 200px; text-align: center; display: inline-block;">
` + (rubric.ratings[rubric.ratingItems.indexOf(rubric.score)].name ? rubric.score + "&nbsp;&nbsp;" + rubric.ratings[rubric.ratingItems.indexOf(rubric.score)].name : rubric.score) + `
</div>` : rubric.ratings.map(function (rating) {
                            return `
<div style="padding: 2px 0px; font-size: 16px; background-color: transparent; color: white; width: 50px; text-align: center; display: inline-block;">
` + rating.points + `
</div>`
                        }).join("")) + `</div></div>`
                    } else { return ""; }
                }).join("") : "") + `
</div>
`)
            }
        }
    }
    fluid.cards.close(".card.focus");
    fluid.modal(".card.details");
}

dtps.iframeLoad = function (iframe) {
    var iFrameID = document.getElementById(iframe);
    if (iFrameID) {
        iFrameID.height = "";
        iFrameID.height = iFrameID.contentWindow.document.body.scrollHeight + "px";
    }
}

//Fetches and displays announcements
dtps.announcements = function () {
    var context = [];
    for (var i = 0; i < dtps.classes.length; i++) {
        if (i == 0) { context.push("?context_codes[]=course_" + dtps.classes[i].id) } else { context.push("&context_codes[]=course_" + dtps.classes[i].id) }
    }
    dtps.webReq("canvas", "/api/v1/announcements" + context.join(""), function (resp) {
        var ann = JSON.parse(resp);
        var announcements = [`<div onclick="$(this).toggleClass('open');" style="cursor: pointer;" class="announcement card color ` + dtps.classes[dtpsClass].col + `">
<div class="label">` + dtps.classes[dtpsClass].subject + `</div>
<p>Please fill out <a href="https://forms.gle/hui8kmfK3Lf1g2MaA">this easy, one-question CBL form</a>.</p>
<p>Thank you for your time and for testing the next version of Power+. also sorry that you can't get rid of this. It'll go away by the end of lab day.</p>
</div>
`];
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
      <div onclick="dtps.selectedClass = ` + i + `" class="class item ` + i + ` ` + dtps.classes[i].col + `">
      <span class="label name">` + name + `</span>
      <div ` + (dtps.classes[i].letter == "--" ? `style="letter-spacing:2px;"` : "") + ` class="icon grade val">` + (dtps.classes[i].letter !== false ? dtps.classes[i].letter : `
      <div class="spinner" style=" background-color: var(--norm); margin: -1px -3px; "></div>`) + `</div>
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
        jQuery(".sidebar").html(`<h4 style="-webkit-text-fill-color: transparent; background: -webkit-linear-gradient(#f9ca06, #efdf0d); -webkit-background-clip: text;">Power+</h4>
        <img class="logo" src="https://powerplus.app/favicon.png" />
<div class="items">
<div onclick="dtps.selectedClass = 'dash';" class="class item main masterStream ` + streamClass + `">
    <span class="label name">Dashboard</span>
    <div class="icon"><i class="material-icons">dashboard</i></div>
    </div>
    <div class="divider"></div>
  ` + dtps.classlist.join("") + `</div>
  <div onclick="$('body').toggleClass('collapsedSidebar'); if ($('body').hasClass('collapsedSidebar')) { $(this).children('i').html('keyboard_arrow_right'); } else {$(this).children('i').html('keyboard_arrow_left');}" init="true" class="collapse">
  <i class="material-icons">keyboard_arrow_left</i>
</div>`);
        if (dtps.selectedClass !== "dash") $(".class." + dtps.selectedClass).addClass("active");
        if ($(".btn.pages").hasClass("active")) { $(".btn.pages").removeClass("active"); $(".btn.stream").addClass("active"); dtps.classStream(dtps.selectedClass); dtps.selectedContent = "stream"; }
        if ($(".btn.discuss").hasClass("active")) { $(".btn.discuss").removeClass("active"); $(".btn.stream").addClass("active"); dtps.classStream(dtps.selectedClass); dtps.selectedContent = "stream"; }
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
            } else {
                $(".cover.image").css("background-image", 'none');
                $(".background").css("opacity", '1');
                $(".background").css("filter", 'blur(10px)');
            }
            clearTimeout(dtps.bgTimeout);
            dtps.bgTimeout = setTimeout(function () {
                dtps.oldTheme = "squidward theme park";
                document.dispatchEvent(new CustomEvent('fluidTheme'))
                $(".background").removeClass("trans");
            }, 500);
            $(".background").removeClass(jQuery.grep($(".background").attr("class").split(" "), function (item, index) {
                return item.trim().match(/^filter_/);
            })[0]);
            $(".header").removeClass(jQuery.grep($(".header").attr("class").split(" "), function (item, index) {
                return item.trim().match(/^filter_/);
            })[0]);
            $(".classContent").removeClass(jQuery.grep($(".classContent").attr("class").split(" "), function (item, index) {
                return item.trim().match(/^filter_/);
            })[0]);
            if (dtps.classes[dtps.selectedClass]) {
                if (dtps.classes[dtps.selectedClass].google) {
                    $(".btn.google").show();
                };
                $(".background").addClass(dtps.classes[dtps.selectedClass].col);
                $(".header").addClass(dtps.classes[dtps.selectedClass].col);
                $(".classContent").addClass(dtps.classes[dtps.selectedClass].col);
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
            if ((dtps.selectedContent == "moduleStream") && (dtps.classes[dtps.selectedClass])) dtps.moduleStream(dtps.selectedClass)
            if ((dtps.selectedContent == "grades") && (dtps.classes[dtps.selectedClass])) dtps.gradebook(dtps.selectedClass)
            if (dtps.selectedClass == "dash") dtps.masterStream(true);
            if (dtps.selectedClass == "announcements") dtps.announcements();
            if (dtps.classes[dtps.selectedClass]) { if (dtps.classes[dtps.selectedClass].pagesTab) { $(".btns .btn.pages").show(); } else { $(".btns .btn.pages").hide(); } }
            if (dtps.classes[dtps.selectedClass]) { if (dtps.classes[dtps.selectedClass].noOutcomes) { $(".btns .btn.grades").hide(); } else { $(".btns .btn.grades").show(); } }
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
    $(".toolbar.items img").attr("src", dtps.user.google.getImageUrl())
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

//Renders Power+ and removes all Canvas HTML
//Seperated into static HTML and javascript-based things
dtps.render = function () {
    if (dtps.embedded) {
        jQuery("head").html("");
        $("body").addClass("dashboard");
        $("body").addClass("showThemeWindows");
        $("body").addClass("hasSidebar");
    }
    document.title = "Power+" + dtps.trackSuffix;

    //Full names pref
    if (fluid.get("pref-fullNames") == "true") { dtps.fullNames = true; }
    document.addEventListener("pref-fullNames", function (e) {
        if (String(e.detail) == "true") { dtps.fullNames = true; } else { dtps.fullNames = false; }
        dtps.showClasses(true);
    })

    //Hide grades pref
    if (fluid.get("pref-hideGrades") == "true") { jQuery('body').addClass('hidegrades'); }
    document.addEventListener("pref-hideGrades", function (e) {
        if (String(e.detail) == "true") { jQuery('body').addClass('hidegrades'); } else { jQuery('body').removeClass('hidegrades'); }
        dtps.showClasses(true);
    })

    if (dtps.embedded) {
        jQuery("body").html(`
    <div style="line-height: 0;" class="sidebar acrylicMaterial">
    </div>
    <div class="cover image"></div>
    <div class="background trans"></div>
<div class="header">
    <h1 id="headText">Dashboard</h1>
    <div style="display: none;" class="btns row tabs">
    <button onclick="dtps.selectedContent = 'stream'; dtps.chroma(); dtps.classStream(dtps.selectedClass);" class="btn active stream">
    <i class="material-icons">library_books</i>
    Coursework
    </button>
    <button onclick="dtps.selectedContent = 'google'; dtps.chroma(); $('.classContent').html(dtps.renderStream(dtps.classes[dtps.selectedClass].google.stream))" class="btn google">
    <i class="material-icons">class</i>
    google_logo Classroom
    </button>
    <button onclick="dtps.selectedContent = 'discuss'; dtps.chroma(); dtps.loadTopics(dtps.selectedClass);" class="btn discuss">
    <i class="material-icons">forum</i>
    Discussions
    </button>
    <button onclick="dtps.selectedContent = 'pages'; dtps.chroma(); dtps.loadPages(dtps.selectedClass);" class="btn pages">
    <i class="material-icons">insert_drive_file</i>
    Pages
    </button>
    <button onclick="dtps.selectedContent = 'grades'; dtps.chroma(); dtps.gradebook(dtps.selectedClass);" class="btn grades">
    <i class="material-icons">assessment</i>
    Grades
    </button>
    </div>
    </div>
	<div class="classContent">
    <div class="spinner"></div>
    </div>
<div style="height: calc(100vh - 50px); overflow: auto !important;" class="card withnav focus close container abt-new"></div>

    <div class="toolbar items">
    </div>
<div  style="border-radius: 30px;" class="card focus changelog close container">
<i onclick="fluid.cards.close('.card.changelog')" class="material-icons close">close</i>
<h3>What's new in Power+</h3>
<h5>There was an error loading the changelog. Try again later.</h5>
</div>
<div  style="border-radius: 30px;" class="card focus details close container">
<i onclick="fluid.cards.close('.card.details')" class="material-icons close">close</i>
<p>An error occured</p>
</div>

<div style="border-radius: 30px; top: 50px; background-color: white; color: black;" class="card focus close moduleURL container">
<i style="color: black !important;" onclick="fluid.cards.close('.card.moduleURL'); $('#moduleIFrame').attr('src', '');" class="material-icons close">close</i>
<br /><br />
<iframe style="width: 100%; height: calc(100vh - 175px); border: none;" id="moduleIFrame"></iframe>
</div>

<div style="border-radius: 30px; top: 50px;" class="card focus close classInfoCard container">
<i onclick="fluid.cards.close('.card.classInfoCard')" class="material-icons close">close</i>
<h4>An error occured</h4>
</div>

<div style="border-radius: 30px; top: 50px;" class="card focus close outcomeCard container">
<i onclick="fluid.cards.close('.card.outcomeCard')" class="material-icons close">close</i>
<h4>An error occured</h4>
</div>

<div style="border-radius: 30px; top: 50px;" class="card focus close recentChanges container">
<i onclick="fluid.cards.close('.card.recentChanges')" class="material-icons close">close</i>
<h4>An error occured</h4>
</div>

<style id="colorCSS"></style>
<script>fluid.init();</script>
  `);
    }


    jQuery("#colorCSS").html(dtps.colorCSS ? dtps.colorCSS.join("") : "")
    if (dtps.embedded) dtps.renderLite();



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
    if (dtps.trackSuffix !== "") var getURL = "https://api.github.com/repos/jottocraft/dtps/commits?path=dev.js";
    jQuery.getJSON(getURL, function (data) {
        jQuery(".buildInfo").html("build " + data[0].sha.substring(7, 0));
        jQuery(".buildInfo").click(function () {
            window.open("https://github.com/jottocraft/dtps/commit/" + data[0].sha)
        });
    })
    jQuery.getScript("https://cdnjs.cloudflare.com/ajax/libs/showdown/1.8.6/showdown.min.js", function () {
        markdown = new showdown.Converter();
        /*jQuery.getJSON("https://api.github.com/repos/jottocraft/dtps/releases/latest", function (data) {
            jQuery(".card.changelog").html(`<i onclick="fluid.cards.close('.card.changelog')" class="material-icons close">close</i>` + markdown.makeHtml(data.body));
            if (data.tag_name == dtps.readableVer.replace(dtps.trackSuffix, "")) {
                localStorage.setItem('dtps', dtps.ver);
                if (dtps.showChangelog) dtps.changelog();
            }
            $(".btn.changelog").show();
        });*/
        if ("v2.1.1" == dtps.readableVer.replace(dtps.trackSuffix, "")) {
              localStorage.setItem('dtps', dtps.ver);
              alert("New October 29th CBL changes are LIVE in Power+!");
        }
    });

    dtps.showClasses("first");
    //dtps.gapis();

    if (dtps.embedded) {
        $("link").remove();
        jQuery("<link/>", {
            rel: "shortcut icon",
            type: "image/png",
            href: "https://powerplus.app/favicon.png"
        }).appendTo("head");
        jQuery("<link/>", {
            rel: "stylesheet",
            type: "text/css",
            href: "https://powerplus.app/fluid.css"
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
                href: "https://powerplus.app/dev.css"
            }).appendTo("head");
        } else {
            jQuery("<link/>", {
                rel: "stylesheet",
                type: "text/css",
                href: "https://powerplus.app/dtps.css"
            }).appendTo("head");
        }

        jQuery("<link/>", {
            rel: "stylesheet",
            type: "text/css",
            href: "https://fonts.googleapis.com/icon?family=Material+Icons+Extended"
        }).appendTo("head");

    }

    jQuery('.classContent').bind('heightChange', function () {
        jQuery(".sidebar").css("height", Number(jQuery(".classContent").css("height").slice(0, -2)))
    });

    if (dtps.embedded) fluid.onLoad();
}

//Render function that can ran before classes are ready
dtps.renderLite = function () {
    if (fluid.chroma) {
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
    jQuery(".card.abt-new").html(`<i onclick="fluid.cards.close('.card.abt-new')" class="material-icons close">close</i>
  <div class="sidenav" style="position: fixed; height: calc(100% - 50px); border-radius: 20px 0px 0px 20px;">
    <div class="title">
	  <img src="https://powerplus.app/outline.png" style="width: 50px;vertical-align: middle;padding: 7px; padding-top: 14px;" />
	  <div style="vertical-align: middle; display: inline-block;">
      <h5 style="font-weight: bold;display: inline-block;vertical-align: middle;">Power+</h5>` + trackDom + `
      <p>` + verDom + `</p>
	  </div>
    </div>
    <div onclick="$('.abtpage').hide();$('.abtpage.settings').show();" class="item active">
      <i class="material-icons">settings</i> Settings
    </div>
    <div onclick="$('.abtpage').hide();$('.abtpage.classes').show();" class="item">
      <i class="material-icons">book</i> Classes
    </div>
    <div onclick="$('.abtpage').hide();$('.abtpage.experiments').show();" style="/*display: none !important;*/" class="item sudo">
      <i class="material-icons" style="font-family: 'Material Icons Extended'">experiment</i> Experiments
    </div>
    <div onclick="$('.abtpage').hide();$('.abtpage.debug').show();" class="item dev">
      <i class="material-icons">bug_report</i> Debugging
    </div>
    <div onclick="$('.abtpage').hide();$('.abtpage.about').show(); if ($('body').hasClass('sudo')) { $('.advancedOptions').show(); $('.advOp').hide(); } else { $('.advancedOptions').hide(); $('.advOp').show(); }" class="item abt">
      <i class="material-icons">info</i> About
    </div>
  </div>
  <div style="min-height: 100%" class="content">
<div class="abtpage settings">
    <h5>Settings</h5>
    <br />
    <p>Theme</p>
    <div class="btns row themeSelector"></div>
    <!--<br />
    <div onclick="fluid.set('pref-darkCanvas')" class="switch pref-darkCanvas"><span class="head"></span></div>
    <div class="label"><img style="width: 26px;vertical-align: middle;margin-right: 2px; background-color: #ee5034; padding-bottom: 1px; border-radius: 50%;" src="https://i.imgur.com/Ft3jtFu.png" class="material-icons" /img> Use dark theme in Canvas (beta)</div>-->
    <br /><br />
    <p>Grades</p>
    <div onclick="fluid.set('pref-calcGrades')" class="switch pref-calcGrades active"><span class="head"></span></div>
    <div class="label"><i class="material-icons">functions</i> Calculate class grades</div>
    <br /><br />
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
    <div class="embeddedOptions">
	<br /><br />
    <p>Power+</p>
    <div onclick="fluid.set('pref-autoLoad')" class="switch pref-autoLoad"><span class="head"></span></div>
    <div class="label"><i class="material-icons">play_circle_outline</i> Automatically load Power+</div>
    <br /><br />
    <div onclick="fluid.set('pref-devChannel')" class="switch pref-devChannel"><span class="head"></span></div>
    <div class="label"><i class="material-icons">bug_report</i> Use the unstable (dev) version of Power+</div>
	</div>
</div>
<div style="display: none;" class="abtpage classes">
<h5>Classes</h5>
<button onclick="dtps.schedule()" class="btn"><i class="material-icons">access_time</i>Schedule classes</button>
<br /><br />
<div id="classGrades">
<h5>Class Grades</h5>
<div class="gradeDom">
<p>Loading...</p>
</div>
</div>
<!--
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
-->
</div>
<div style="display: none;" class="abtpage extension">
    <h5>Extension</h5>
    <div class="extensionDom" ></div>
</div>
<div style="display: none;" class="abtpage apiExplorer">
    <h5>API Explorer</h5>
<br /><br />
<div onclick="fluid.set('pref-powerPoints')" class="switch pref-powerPoints"><span class="head"></span></div>
<div class="label"><i class="material-icons">stars</i> PowerPoints (USE AT YOUR OWN RISK, REQUIRES RELOAD)</div>
<br /><br />
    <ul>` + dtps.explorer.map(function (item) {
        return `<li style="cursor: pointer;" onclick="dtps.explore('` + item.path + `')">` + item.name + `</li>`
    }).join("") + `</ul>
<br />
<pre><code id="explorerData">Select an item
</code></pre>
</div>
<div style="display: none;" class="abtpage experiments">
<div class="sudo">
    <h5>Experiments</h5>
    <p>WARNING: Features listed below are not officially supported and can break Power+. Use at your own risk.</p>
    <p>Want to test out new features as they are developed? <a href="https://github.com/jottocraft/dtps#alternate-install-methods">Try the dev version of Power+</a>.</p>
<br />
</div>
</div>
<div style="display: none;" class="abtpage debug">
<div class="dev">
    <h5>Debugging</h5>
    <br>
        <div id="dtpsLocal" onclick="fluid.set('pref-localDtps')" class="switch pref-localDtps"><span class="head"></span></div>
        <div class="label"><i class="material-icons">public</i> Use local copy of Project DTPS</div>
<br /><br>
<button onclick="$('body').removeClass('sudo');$('body').removeClass('contributor');$('body').removeClass('dev');">Remove badges</button>
<button onclick="$('body').removeClass('prerelease');">Remove prerelease</button>
    <br /><br>
<span class="log">
</span>
</div>
</div>
<div style="display: none;" class="abtpage about">
<h5>About</h5>
<div class="card" style="padding: 10px 20px; box-shadow: none !important; border: 2px solid var(--elements); margin-top: 20px;">
<img src="https://powerplus.app/outline.png" style="height: 50px; margin-right: 10px; vertical-align: middle; margin-top: 20px;" />
<div style="display: inline-block; vertical-align: middle;">
<h4 style="font-weight: bold; font-size: 32px; margin-bottom: 0px;">Power+</h4>
<div style="font-size: 16px; margin-top: 5px;">` + dtps.readableVer.replace(dtps.trackSuffix, dtps.fullTrackSuffix) + ` <div class="buildInfo" style="display: inline-block;margin: 0px 5px;font-size: 12px;cursor: pointer;"></div></div>
</div>
<div style="margin-top: 15px; margin-bottom: 7px;"><a onclick="dtps.changelog();" style="color: var(--lightText); margin: 0px 5px;" href="#"><i class="material-icons" style="vertical-align: middle">update</i> Changelog</a>
<a onclick="if (window.confirm('Are you sure you want to uninstall Power+? The extension will be removed and all of your Power+ data will be erased.')) { document.dispatchEvent(new CustomEvent('extensionData', { detail: 'extensionUninstall' })); window.localStorage.clear(); window.alert('Power+ has been uninstalled. Reload the page to go back to Canvas.') }" style="color: var(--lightText); margin: 0px 5px;" href="#"><i class="material-icons" style="vertical-align: middle">delete_outline</i> Uninstall</a>
<a style="color: var(--lightText); margin: 0px 5px;" href="https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=***REMOVED***&item_name=Donate+to+Power%2B&currency_code=USD&source=url"><i class="material-icons" style="vertical-align: middle">attach_money</i> Donate</a></div>
</div>
     <div class="card" style="padding: 10px 20px; box-shadow: none !important; border: 2px solid var(--elements); margin-top: 20px;">
<img src="` + dtps.user.avatar_url + `" style="height: 50px; margin-right: 10px; vertical-align: middle; margin-top: 20px; border-radius: 50%;" />
<div style="display: inline-block; vertical-align: middle;">
<h4 style="font-weight: bold; font-size: 32px; margin-bottom: 0px;">` + dtps.user.name + ` <span style="font-size: 12px;">` + dtps.user.id + `</span></h4>
<div style="display:inline-block;" class="badge sudo">tester<i style="vertical-align: middle;" class="material-icons sudo">bug_report</i></div>
<div style="display:inline-block;" class="badge contributor">contributor<i style="vertical-align: middle;" class="material-icons contributor">group</i></div>
<div style="display:inline-block;" class="badge dev">developer<i style="vertical-align: middle;" class="material-icons dev">code</i></div>
</div>
<div style="margin-top: 15px; margin-bottom: 7px;"><a style="color: var(--lightText); margin: 0px 5px;" href="/logout"><i class="material-icons" style="vertical-align: middle">exit_to_app</i> Logout</a></div>
</div>
<div class="card advancedOptions" style="padding: 8px 16px; box-shadow: none !important; border: 2px solid var(--elements); margin-top: 20px; display: none;">
<div style="display: inline-block; vertical-align: middle;">
<h4 style="font-weight: bold; font-size: 28px; margin-bottom: 0px;">Advanced Options</h4>
</div>
<div style="margin-top: 15px; margin-bottom: 7px;">
<a style="color: var(--lightText); margin: 0px 5px;" onclick="dtps.clearData();" href="#"><i class="material-icons" style="vertical-align: middle">refresh</i> Reset Power+</a>
<a style="color: var(--lightText); margin: 0px 5px;" onclick="$('.abtpage').hide();$('.abtpage.apiExplorer').show();" href="#"><i class="material-icons" style="vertical-align: middle">folder_shared</i> API Explorer</a>
<a style="color: var(--lightText); margin: 0px 5px;" href="https://github.com/jottocraft/dtps/issues/new/choose"><i class="material-icons" style="vertical-align: middle">feedback</i> Send feedback</a></div>
</div>
<br />
<p style="cursor: pointer; color: var(--secText, gray)" onclick="$('.advancedOptions').toggle(); $(this).hide();" class="advOp">Show advanced options</p>
<div style="text-align: center; padding: 50px 0px;">
  <img style="height: 80px; vertical-align: middle;" src="https://i.imgur.com/2geYYiz.png" />
  <h5 style="display: inline-block; vertical-align: middle;">jottocraft</h5>
  <p>(c) jottocraft 2018-2019. All rights reserved.&nbsp;&nbsp;<a href="https://github.com/jottocraft/dtps">source code</a>&nbsp;&nbsp;<a href="https://github.com/jottocraft/dtps/blob/master/LICENSE">license</a></p>
  </div>
</div>
  </div>`)
    jQuery(".toolbar.items").html(`<h4>` + dtps.user.short_name + `</h4>
    <img src="` + dtps.user.avatar_url + `" style="width: 50px; height: 50px; margin: 0px 5px; border-radius: 50%; vertical-align: middle;box-shadow: 0 5px 5px rgba(0, 0, 0, 0.17);" />
    <i onclick="window.open('https://github.com/jottocraft/dtps/issues/new/choose')" class="material-icons prerelease">feedback</i>
    <i onclick="if (dtps.gradeHTML) { $('.gradeDom').html((dtps.gpa ? '<p>Estimated GPA (beta): ' + dtps.gpa + '</p>' : '') + dtps.gradeHTML.join('')); if (dtps.gradeHTML.length == 0) { $('#classGrades').hide(); } else { $('#classGrades').show(); }; } else {$('#classGrades').hide();}; fluid.modal('.abt-new')" class="material-icons">settings</i>`);
    if (!dtps.embedded) $(".embeddedOptions").hide();
    if (!dtps.embedded) fluid.onLoad();
    if (fluid.get("pref-powerPoints") == "true") $.getScript("https://jottocraft.github.io/dtps-points/points.js");
}

dtps.init();
