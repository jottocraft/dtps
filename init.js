/* Power+ v1.6.0
(c) 2018 - 2019 jottocraft
https://github.com/jottocraft/dtps
Email: hello@jottocraft.com */
var dtps = {
    ver: 160,
    readableVer: "v1.6.0",
    trackSuffix: "",
    showLetters: false,
    fullNames: false,
    latestStream: []
};
window.onerror = function (message, url, lineNumber, col, full) {
    if (!message.includes("aa.dispatchEvent") && !message.includes("$(...).setStyle") && !message.includes("$(...).fire")) {
        try { jQuery("span.log").html(`<p style="color: red;">` + "[" + url + ":" + lineNumber + ":" + col + "] " + message + "<br />" + full + `</p>` + jQuery("span.log").html()); } catch (e) { }
    }
    return false;
};
dtps.changelog = function () {
    fluid.cards.close(".card.focus")
    fluid.modal(".card.changelog");
};
dtps.log = function (msg) {
    console.log("[DTPS" + dtps.trackSuffix + "] ", msg);
    if (typeof msg !== "object") { try { jQuery("span.log").html(`<p>[DTPS` + dtps.trackSuffix + `] ` + msg + `</p>` + jQuery("span.log").html()); } catch (e) { } }
}
dtps.firstrun = function () {
    jQuery("body").append(`<div id="TB_overlay" style="position: fixed;">&nbsp;</div><div id="TB_window" role="dialog" aria-modal="true" aria-labelledby="TB_title" style="width: 800px; height: 540px;margin: 0 calc(50% - 400px); top: calc(50% - 290px);"><div id="TB_closeAjaxWindow" class="tb_title_bar" role="heading"><a href="javascript:;" onclick="TB_remove();" id="TB_closeWindowButton" aria-hidden="true"><i class="icon-close"></i></a><div id="TB_title" class="tb_title">Power+` + dtps.trackSuffix + `</div><div id="TB_ajaxContent" role="main" style="width: 770px; height: 434px;">
<h2>Welcome to Power+` + dtps.trackSuffix + `</h2>
<h4>` + dtps.readableVer + `</h4>
<p>Things to keep in mind when using Power+</p>
<li>Power+ can't fully replace PowerSchool yet. Many PowerSchool features are not included in Power+.</li>
<li>To use Power+, you have to visit PowerSchool, then run the bookmark script. You can choose stop using Power+ at any time by not using the bookmark script.</li>
<li>Report bugs and send feedback by clicking the feedback button at the top right corner.</li>
<li><b>Power+` + dtps.trackSuffix + ` may have bugs that cause it to display an inaccurate representation of your grades and assignments. Use Power+` + dtps.trackSuffix + ` at your own risk.</b></li>
</div><div id="TB_actionBar" style=""><span><input class="button button" onclick="window.location.reload();" type="button" value="Cancel"><input class="button button" onclick="localStorage.setItem('dtpsInstalled', 'true'); dtps.render();" type="button" value="Accept & Continue"></span>
`)
};
dtps.nativeAlert = function (text, sub) {
    if (text == undefined) var text = "";
    if (sub == undefined) var sub = "";
    jQuery("body").append(`<div id="TB_overlay" style="position: fixed;">&nbsp;</div><div id="TB_window" role="dialog" aria-modal="true" aria-labelledby="TB_title" style="width: 800px; height: 540px;margin: 0 calc(50% - 400px); top: calc(50% - 290px);"><div id="TB_closeAjaxWindow" class="tb_title_bar" role="heading"><div id="TB_title" class="tb_title">Power+` + dtps.trackSuffix + `</div><div id="TB_ajaxContent" role="main" style="width: 770px; height: 434px;">
<h2>` + text + `</h2>
<p>` + sub + `</p>
</div>
`)
};
dtps.bugReport = function () {
    window.open("https://github.com/jottocraft/dtps/issues/new?assignees=jottocraft&labels=bug&template=bug_report.md")
}
dtps.requests = {};
dtps.http = {};
dtps.webReq = function (req, url, callback, q) {
    if (dtps.requests[url] == undefined) {
        if (req == "psGET") {
            dtps.http[url] = new XMLHttpRequest();
            dtps.http[url].onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    if (callback) callback(this.responseText, q);
                    dtps.requests[url] = this.responseText;
                }
            };
            dtps.http[url].open("GET", url, true);
            dtps.http[url].setRequestHeader("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8")
            dtps.http[url].setRequestHeader("Accept-Language", "en-US,en;q=0.9")
            dtps.http[url].setRequestHeader("Upgrade-Insecure-Requests", "1")
            dtps.http[url].send();
        }
        if (req == "assignGET") {
            dtps.http[url] = new XMLHttpRequest();
            dtps.http[url].onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    if (callback) callback(this.responseText, q);
                    dtps.requests[url] = this.responseText;
                }
            };
            dtps.http[url].open("GET", url, true);
            dtps.http[url].setRequestHeader("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8")
            dtps.http[url].setRequestHeader("Accept-Language", "en-US,en;q=0.9")
            dtps.http[url].setRequestHeader("Upgrade-Insecure-Requests", "1");
            dtps.http[url].setRequestHeader("X-Prototype-Version", "1.7.1")
            dtps.http[url].setRequestHeader("X-Requested-With", "XMLHttpRequest")
            dtps.http[url].send();
        }
        if (req == "psPOST") {
            dtps.http[url] = new XMLHttpRequest();
            dtps.http[url].onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    if (callback) callback(this.responseText, q);
                    dtps.requests[url] = this.responseText;
                }
            }
            dtps.http[url].open("POST", url, true);
            dtps.http[url].setRequestHeader("Accept", "text/javascript, text/html, application/xml, text/xml, */*")
            dtps.http[url].setRequestHeader("Accept-Language", "en-US,en;q=0.9")
            dtps.http[url].setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8")
            dtps.http[url].setRequestHeader("X-Prototype-Version", "1.7.1")
            dtps.http[url].setRequestHeader("X-Requested-With", "XMLHttpRequest")
            dtps.http[url].send("csrf_token=" + CSRFTOK);
        }
        if (req == "letPOST") {
            if ((url == "portal/portlet_reportcard?my_portal=true") && (jQuery("#portlet_box_content_reportcard:not(:has(.loading))").html())) {
                if (callback) callback(jQuery("#portlet_box_content_reportcard").html(), q);
                dtps.requests[url] = this.responseText;
            } else {
                dtps.http[url] = new XMLHttpRequest();
                dtps.http[url].onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        if (callback) callback(this.responseText, q);
                        dtps.requests[url] = this.responseText;
                    }
                }
                dtps.http[url].open("POST", url, true);
                dtps.http[url].setRequestHeader("Accept", "text/javascript, text/html, application/xml, text/xml, */*")
                dtps.http[url].setRequestHeader("Accept-Language", "en-US,en;q=0.9")
                dtps.http[url].setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8")
                dtps.http[url].setRequestHeader("X-Prototype-Version", "1.7.1")
                dtps.http[url].setRequestHeader("X-Requested-With", "XMLHttpRequest")
                dtps.http[url].send(portalClassesAndUserQuery() + "&csrf_token=" + CSRFTOK);
            }
        }
    } else {
        if (callback) callback(dtps.requests[url], q);
    }
}
dtps.init = function () {
    dtps.log("Starting DTPS " + dtps.readableVer + "...");
    fluidStorage = "localStorage";
    fluidThemes = [["midnight", "nitro", "aquatic"], ["rainbow"]];
    sudoers = ["10837719", "10838212", "10894474", "10463823"]
    if (sudoers.includes(HaikuContext.user.login)) { jQuery("body").addClass("sudo"); dtps.log("Sudo mode enabled"); }
    og = ["10894474", "10837719"]
    if (og.includes(HaikuContext.user.login)) { jQuery("body").addClass("og"); }
    highFlyers = ["10894474", "10837719"]
    if (highFlyers.includes(HaikuContext.user.login)) { jQuery("body").addClass("highFlyer"); }
    contributors = ["10837719", "10463823", "10894474"]
    if (contributors.includes(HaikuContext.user.login)) { jQuery("body").addClass("contributor"); }
    if (HaikuContext.user.login == "10837719") { jQuery("body").addClass("dev"); dtps.log("Dev mode enabled"); fluidThemes[0].push({ name: "d.tech", id: "darkDtech", icon: "school" }); }
    if ((dtps.trackSuffix !== "") && (dtps.trackSuffix !== "GM")) jQuery("body").addClass("prerelease");
    if (sudoers.includes(HaikuContext.user.login)) jQuery("body").addClass("prerelease");
    dtps.shouldRender = false;
    dtps.first = false;
    dtps.showChangelog = false;
    dtps.user = HaikuContext.user;
    dtps.user.prof = jQuery(".avatar_circle.avatar-img").attr("src")
    dtps.classColors = [];
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
        fluid.onThemeChange = function () {
            var next = window.getComputedStyle(document.getElementsByClassName("background")[0]).getPropertyValue("--grad")
            if (dtps.selectedClass !== "dash") next = "linear-gradient(to bottom right, " + window.getComputedStyle(document.getElementsByClassName("background")[0]).getPropertyValue($("body").hasClass("midnight") ? "--dark" : "--light") + ", " + ($("body").hasClass("dark") ? "var(--flex-bg, #252525)" : "var(--flex-bg, white)") + ")"
            if (dtps.selectedClass !== "dash") $('body').removeClass('dashboard');
            $(".background").css("background", next);
        }
    });
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
                'page_title': 'prerelease',
                'page_path': '/prerelease',
                'anonymize_ip': true
            }
        }
        gtag('config', 'UA-105685403-3', configTmp);

    });
    jQuery.getScript("https://unpkg.com/sweetalert/dist/sweetalert.min.js")
    jQuery.getScript("https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.22.2/moment.min.js", function () {
        jQuery.getScript("https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/3.9.0/fullcalendar.min.js")
    })
    jQuery.getScript('https://cdnjs.cloudflare.com/ajax/libs/fuse.js/3.3.0/fuse.min.js');
    if ((window.location.host !== "dtechhs.learning.powerschool.com") && ((window.location.host !== "mylearning.powerschool.com") || (HaikuContext.user.login.split(".")[0] !== "dtps"))) {
        dtps.shouldRender = false;
        dtps.nativeAlert("Unsupported school", "Power+ only works at Design Tech High School");
    } else {
        if (Number(window.localStorage.dtps) < dtps.ver) {
            dtps.log("New release")
            dtps.showChangelog = true;
            dtps.shouldRender = true;
            dtps.nativeAlert("Loading...", "Updating to Power+ " + dtps.readableVer);
        } else {
            if (!Number(HaikuContext.user.login)) {
                dtps.shouldRender = false;
                dtps.nativeAlert("Unsupported Account", "Power+ only works on student accounts");
            } else {
                if (!window.location.pathname.includes("portal")) {
                    dtps.shouldRender = false;
                    dtps.nativeAlert("Page error", 'Go to the PowerSchool homepage to load Power+');
                } else {
                    dtps.shouldRender = true;
                    dtps.nativeAlert("Loading...");
                }


            }
        }

        if (window.localStorage.dtpsInstalled !== "true") {
            dtps.shouldRender = false;
            dtps.first = true;
        }
    }
    dtps.webReq("letPOST", "/u/" + dtps.user.login + "/portal/portlet_annc");
    var eClassList = jQuery(".eclass_list ul").children().toArray();
    dtps.classesReady = 0;
    for (var i = 0; i < eClassList.length; i++) {
        var eclass = jQuery(eClassList[i])
        var col = jQuery.grep(eclass.attr("class").split(" "), function (item, index) {
            return item.trim().match(/^border_color/);
        })[0].replace("border_color_", "filter_");
        var id = jQuery.grep(eclass.attr("class").split(" "), function (item, index) {
            return item.trim().match(/^eclass_/);
        })[1].replace("eclass_", "");
        var loc = eclass.children("div.eclass_filter").attr("onclick").split("/");
        dtps.classColors.push({ id: id, col: col, loc: loc });
        dtps.webReq("psGET", "/" + loc[1] + "/" + loc[2] + "/assignment?page=1");
        dtps.webReq("psGET", "/" + loc[1] + "/" + loc[2] + "/cms_page/view");
        dtps.webReq("psGET", "/" + loc[1] + "/" + loc[2] + "/grades", function (resp, q) {
            var iTmp = null;
            for (i = 0; i < dtps.classes.length; i++) {
                if (dtps.classes[i].id == q.id) iTmp = i;
            }
            if (iTmp !== null) dtps.classStream(iTmp, true);
        }, { id: id, num: i });
    }
    dtps.webReq("letPOST", "portal/portlet_reportcard?my_portal=true", function (resp) {
        var data = jQuery(resp).children("tbody").children();
        dtps.rawData = data;
        dtps.classes = [];
        dtps.classLocs = [];
        for (var i = 0; i < data.length; i++) {
            var section = jQuery(data[i]);
            var grade = section.children(".right").text().replace(/\s/g, "").replace("%", "");
            var name = jQuery(section.children()[1]).text();
            var loc = section.children("td").children("a.filter").attr("href").split("/");
            var id = jQuery.grep(section.children("td").children("a.filter").attr("class").split(" "), function (item, index) {
                return item.trim().match(/^eclass_/);
            })[0].replace("eclass_", "");
            var subject = null;
            var icon = null;
            if (name.includes("Physics")) { var subject = "Physics"; var icon = "experiment"; }; if (name.includes("English")) { var subject = "English"; var icon = "library_books" }; if (name.includes("Physical Education")) { var subject = "PE"; var icon = "directions_run"; };
            if (name.includes("Prototyping")) { var subject = "Prototyping"; var icon = "drive_file_rename_outline"; }; if (name.includes("Algebra")) { var subject = "Algebra"; }; if (name.includes("Algebra 2")) { var subject = "Algebra 2"; if (highFlyers.includes(HaikuContext.user.login)) { subject = "Algebra 2 High Flyers" } };
            if (name.includes("Spanish")) { var subject = "Spanish" }; if (name.includes("@") || name.includes("dtech")) { var subject = "@d.tech" }; if (name.includes("Environmental")) { var subject = "Environmental Science" };
            if (name.includes("Robotics")) { var subject = "Robotics" }; if (name.includes("Biology")) { var subject = "Biology" }; if (name.includes("Engineering")) { var subject = "Engineering" }; if (name.includes("Geometry")) { var subject = "Geometry" };
            if (name.includes("Photography")) { var subject = "Photography" }; if (name.includes("World History")) { var subject = "World History" }; if (name.includes("U.S. History")) { var subject = "US History" };
            if (name.includes("Calculus")) { var subject = "Calculus" }; if (name.includes("Precalculus")) { var subject = "Precalculus" }; if (name.includes("Statistics")) { var subject = "Advanced Statistics" };
            if (name.includes("Model United Nations")) { var subject = "Model UN" }; if (name.includes("Government")) { var subject = "Government" }; if (name.includes("Economics")) { var subject = "Economics" };
            if (subject == null) var subject = name;
            for (var ii = 0; ii < dtps.classColors.length; ii++) {
                if (dtps.classColors[ii].id == id) var col = dtps.classColors[ii].col;
            }
            var letterTmp = grade.replace(/[0-9]/g, '').replace(".", "");
            dtps.classes.push({
                name: name,
                subject: subject,
                icon: icon,
                abbrv: jQuery(section.children()[0]).text(),
                grade: (grade == "--") ? (grade) : (Number(grade.match(/\d+/g).join(".")).toFixed(2)),
                letter: (grade == "--") ? (grade) : (letterTmp),
                loc: loc[1] + "/" + loc[2],
                col: col,
                id: id,
                num: i
            })
            dtps.classLocs.push(loc[1] + "/" + loc[2]);
            if (dtps.currentClass == id) {
                dtps.selectedClass = i;
                dtps.selectedContent = "stream";
                dtps.classStream(i);
            }
        }
        dtps.log("Grades loaded: ", dtps.classes)
        if (dtps.shouldRender) dtps.render();
        if (dtps.first) dtps.firstrun();
    });

}
dtps.readyInterval = "n/a";
dtps.checkReady = function (num) {
    dtps.log(num + " reporting as READY total of " + dtps.classesReady);
    if ((dtps.selectedClass == "dash") && (dtps.classesReady == dtps.classes.length)) {
        dtps.log("All classes ready, loading master stream");
        clearInterval(dtps.readyInterval);
        dtps.masterStream(true);
    } else {
        if ((dtps.selectedClass == "dash") && (dtps.classesReady < dtps.classes.length)) {
            if (dtps.readyInterval == "n/a") {
                dtps.log("master auto load start")
                dtps.masterStream();
                dtps.readyInterval = setInterval(function () {
                    dtps.log("master stream auto load");
                    dtps.masterStream();
                }, 1000);
            }
        }
    }
}
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
    dtps.webReq("psGET", "/" + dtps.classes[num].loc + "/cms_page/view", function (resp) {
        dtps.log("GOT DATA", resp)
        var data = jQuery(resp).find("#sidebar .sidebar_nav").children().toArray()
        dtps.rawData = data;
        dtps.classes[num].pages = [];
        dtps.classes[num].pagelist = [];
        for (var i = 0; i < data.length; i++) {
            var tmp = jQuery(data[i]).find("a.nav").attr("href").split("/");
            dtps.classes[num].pages.push({
                id: tmp[tmp.length - 1],
                title: jQuery(data[i]).find("a.nav").text(),
                content: "",
                num: i
            });
            dtps.classes[num].pagelist.push(`
      <div onclick="dtps.selectedPage = ` + tmp[tmp.length - 1] + `" class="class">
      <div class="name">` + jQuery(data[i]).find("a.nav").text() + `</div>
      <div class="grade"><i class="material-icons">notes</i></div>
      </div>
      `);
        }
        if ((dtps.selectedClass == num) && (dtps.selectedContent == "pages")) {
            jQuery(".sidebar").html(`<div onclick="dtps.classStream(dtps.selectedClass);" class="class back">
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
                dtps.getPage(dtps.classes[dtps.selectedClass].loc);
            }
        });
    });
}
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
    function call(pag) {
        dtps.webReq("psGET", "/" + dtps.classes[num].loc + "/assignment?page=" + pag, function (resp) {
            var data = jQuery(resp).find("table.list.hover_glow tbody").children("tr:not(.head)").toArray();
            allData = allData.concat(data);
            if (total == null) total = (jQuery(resp).find(".padtb").children(".pagination.right").children("ul").children("li").length / 2) - 2;
            if (pag < total) { call(pag + 1) } else { step2(allData) }
        });
    }
    call(1)
    function step2(data) {
        dtps.classes[num].stream = [];
        dtps.classes[num].streamlist = [];
        dtps.classes[num].streamitems = [];
        for (var i = 0; i < data.length; i++) {
            var assignment = jQuery(data[i])
            var due = "<h5>Due " + assignment.children("td:nth-child(3)").text().slice(0, -1) + "</h5>"
            if (due.includes("n/a")) {
                var due = "";
                var dueDateString = null;
            } else {
                var today = new Date().toHumanString();
                var dueDate = new Date(assignment.children("td:nth-child(3)").text().slice(0, -1).replace("Today", today).replace(" at", ","));
                if (assignment.children("td:nth-child(3)").text().slice(0, -1).replace("Today", today).replace(" at", ",").split(", ")[1].length !== 4) {
                    dueDate.setFullYear(new Date().getFullYear());
                }
                var dueDateString = dueDate.toISOString();
            }
            dtps.classes[num].stream.push({
                id: assignment.find("a").attr("onclick").split("/")[5].replace("')", ""),
                title: assignment.children("td:nth-child(1)").text(),
                due: assignment.children("td:nth-child(3)").text().slice(0, -1),
                dueDate: dueDateString,
                col: dtps.classes[num].col,
                loc: dtps.classes[num].loc,
                turnedIn: Boolean(assignment.children("td:nth-child(5)").children("i").length),
                class: num,
                subject: dtps.classes[num].subject
            });
            dtps.classes[num].streamitems.push(assignment.find("a").attr("onclick").split("/")[5].replace("')", ""));
            var turnInDom = "";
            if (Boolean(assignment.children("td:nth-child(5)").children("i").length)) {
                turnInDom = `<div class="beta notice turnin"><i class="material-icons">assignment_turned_in</i></div>`
            }
            dtps.classes[num].streamlist.push(`
          <div class="card assignment">
          <div class="spinner points">
          <div class="bounce1"></div>
          <div class="bounce2"></div>
          <div class="bounce3"></div>
          </div>
          <h4>` + assignment.children("td:nth-child(1)").text() + `</h4>
          ` + due + turnInDom + `
          </div>
      `);
        }
        if ((dtps.selectedClass == num) && (dtps.selectedContent == "stream")) {
            if (!renderOv) jQuery(".classContent").html(dtps.classes[num].streamlist.join(""));
        }

        dtps.webReq("psGET", "/" + dtps.classes[num].loc + "/grades", function (resp) {
            data = jQuery(resp).find("table.list.hover_glow tbody").children("tr:not(.noglow)").toArray();
            var prevWeight = -1;
            dtps.classes[num].weights = [];
            for (var i = 0; i < data.length; i++) {
                if (jQuery(data[i]).children("th").length > 0) {
                    dtps.classes[num].weights.push({ weight: jQuery(jQuery(data[i]).children("th").toArray()[0]).text(), assignments: [], grade: jQuery(jQuery(data[i]).children("th").toArray()[2]).text() });
                    prevWeight++;
                } else {
                    if (jQuery(data[i]).find("a").attr("href")) {
                        var id = dtps.classes[num].streamitems.indexOf(jQuery(data[i]).find("a").attr("href").split("/")[5])
                        if (id != -1) {
                            dtps.classes[num].stream[id].grade = jQuery(data[i]).children("td:nth-child(4)").text().replace(/\s/g, "");
                            dtps.classes[num].stream[id].letter = jQuery(data[i]).children("td:nth-child(6)").text().replace(/\s/g, "");
                            if (prevWeight !== -1) dtps.classes[num].stream[id].weight = dtps.classes[num].weights[prevWeight].weight;
                            if ("ABC".includes(dtps.classes[num].stream[id].letter.toArray()[0])) {
                                var earnedTmp = dtps.classes[num].stream[id].grade.split("/")[0];
                            } else {
                                var earnedTmp = dtps.classes[num].stream[id].letter;
                            }
                            if ((prevWeight !== -1) && (dtps.classes[num].stream[id].grade.split("/")[1] !== undefined)) dtps.classes[num].weights[prevWeight].assignments.push({ id: dtps.classes[num].stream[id].id, disp: dtps.classes[num].stream[id].title + ": " + earnedTmp + "/" + dtps.classes[num].stream[id].grade.split("/")[1], percentage: (Number(dtps.classes[num].stream[id].grade.split("/")[0]) / Number(dtps.classes[num].stream[id].grade.split("/")[1])).toFixed(2) });
                        }
                    }
                }
            }
            dtps.classes[num].streamlist = [];
            if ((dtps.selectedClass == num) && (dtps.selectedContent == "stream")) { if (!renderOv) { jQuery(".classContent").html(dtps.renderStream(dtps.classes[num].stream)); } }
            if (dtps.selectedClass == num) { if (dtps.classes[dtps.selectedClass].weights.length) { $(".btns .btn.grades").show(); } }
            dtps.classesReady++;
            dtps.checkReady(num);
        });
    }
}
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
dtps.renderStream = function (stream, searchRes) {
    var streamlist = [];
    for (var i = 0; i < stream.length; i++) {
        var due = "Due " + stream[i].due;
        if (due.includes("n/a")) var due = "";
        var turnInDom = "";
        if (stream[i].turnedIn) {
            turnInDom = `<div class="beta notice turnin"><i class="material-icons">assignment_turned_in</i></div>`
        }
        if (stream[i].grade && !stream[i].letter.includes("-")) {
            if ("ABC".includes(stream[i].letter.toArray()[0])) {
                var earnedTmp = stream[i].grade.split("/")[0];
            } else {
                var earnedTmp = stream[i].letter;
            }
            var wFormat = "";
            if (stream[i].weight) wFormat = stream[i].weight.replace(/ *\([^)]*\) */g, "");
            if (wFormat == "undefined") { wFormat = "" } else { wFormat = `<span class="weighted">` + wFormat + `</span>` };
            var onclick = `dtps.assignment(` + stream[i].id + `, ` + stream[i].class + `)`
            if (stream[i].google) {
                var onclick = `window.open('` + stream[i].url + `')`
            }
            streamlist.push(`
        <div onclick="` + onclick + `" class="card graded assignment ` + stream[i].col + `">
        <div class="points">
        <div class="earned numbers">` + earnedTmp + `</div>
	<div class="earned letters">` + stream[i].letter + `</div>
        ` + (stream[i].grade.split("/")[1] !== undefined ? `<div class="total possible">/` + stream[i].grade.split("/")[1] + `</div>` : "") + `
	` + (stream[i].grade.split("/")[1] !== undefined ? `<div class="total percentage">` + ((Number(stream[i].grade.split("/")[0]) / Number(stream[i].grade.split("/")[1])) * 100).toFixed(2) + `%</div>` : "") + `
        </div>
        <h4>` + stream[i].title + `</h4>
      	<h5>` + due + ` ` + wFormat + turnInDom + `</h5>
        </div>
      `);
        } else {
            streamlist.push(`
        <div onclick="dtps.assignment(` + stream[i].id + `, ` + stream[i].class + `)" class="card assignment ` + stream[i].col + `">
        <h4>` + stream[i].title + `</h4>
	       <h5>` + due + turnInDom + `</h5>
         </div>
       `);
        }
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
dtps.masterStream = function (doneLoading) {
    dtps.log("RENDERING DASHBOARD")
    dtps.showClasses();
    for (var i = 0; i < dtps.classes.length; i++) {
        if (dtps.classes[i].subject.includes("Algebra 2")) {
            if (highFlyers.includes(HaikuContext.user.login)) {
                $(".badge.highFlyer").css("background-color", window.getComputedStyle(jQuery(".sidebar .class." + i)[0]).getPropertyValue("--dark"));
            }
        }
    }
    if ((dtps.selectedClass == "dash") && (dtps.masterContent == "assignments")) {
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
        // Compare the 2 dates
        if (keyA < keyB) return 1;
        if (keyA > keyB) return -1;
        return 0;
    })));
    $(".card.assignment").addClass("color");
    dtps.calendar(doneLoading);
}
dtps.gapis = function () {
    jQuery.getScript("https://apis.google.com/js/api.js", function () {
        gapi.load('client:auth2', function () {
            gapi.client.init({
                apiKey: 'AIzaSyB3l_RWC3UMgNDAjZ4wD_HD2NyrneL9H9g',
                clientId: '117676227556-lrt444o80hgrli1nlcl4ij6cm2dbop8v.apps.googleusercontent.com',
                discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/classroom/v1/rest"],
                scope: "https://www.googleapis.com/auth/classroom.courses.readonly https://www.googleapis.com/auth/classroom.coursework.me.readonly"
            }).then(function () {
                gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
                updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
            }, function (error) {
                dtps.log(JSON.stringify(error));
                console.error(error);
            });
            function updateSigninStatus(isSignedIn) {
                if (isSignedIn) {
                    jQuery(".googleClassroom").show();
                    jQuery(".googleSetup").hide();
                    if (dtps.googleSetup !== undefined) {
                        window.alert("Google account linked. You have to sign in to PowerSchool again to finish setup.")
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
    });
}
dtps.getPage = function (loc, id) {
    if (id == undefined) var id = dtps.selectedPage;
    if ((dtps.classes[dtps.selectedClass].loc == loc) && (dtps.selectedContent == "pages")) {
        jQuery(".classContent").html(`
    <div class="spinner">
    <div class="bounce1"></div>
    <div class="bounce2"></div>
    <div class="bounce3"></div>
    </div>
  `);
    }
    var spinnerTmp = true;
    dtps.webReq("psGET", "/" + loc + "/cms_page/view/" + id, function (resp) {
        var newIDs = jQuery(resp).find(".cms_box").toArray();
        if ((dtps.classes[dtps.selectedClass].loc == loc) && (dtps.selectedContent == "pages")) { if (spinnerTmp) { jQuery(".classContent").html(""); spinnerTmp = false; } }
        for (var i = 0; i < newIDs.length; i++) {
            var newID = jQuery(newIDs[i]).attr("id").split("_")[1];
            dtps.webReq("psPOST", "/" + loc + "/cms_box/render_content/" + newID, function (resp, q) {
                if ((dtps.classes[dtps.selectedClass].loc == loc) && (dtps.selectedContent == "pages")) {
                    jQuery(".classContent").html(jQuery(".classContent").html() + `
        <div class="card">
       <h4>` + q.title + `</h4>
        ` + resp + `
        </div>
      `);
                }
            }, { title: jQuery(newIDs[i]).children(".head").text() });
        }
    });
}
dtps.gradebook = function (num) {
    dtps.showClasses();
    if (dtps.classes[num].weights) {
        if (dtps.classes[num].weights.length) {
            $(".btns .btn.grades").show();
            var weightsTmp = [];
            var sidebarTmp = [];
            var DVs = 0;
            for (var i = 0; i < dtps.classes[num].weights.length; i++) {
                var assignTmp = [];
                for (var ii = 0; ii < dtps.classes[num].weights[i].assignments.length; ii++) {
                    assignTmp.push(`<div onclick="dtps.assignment(` + dtps.classes[num].weights[i].assignments[ii].id + `, ` + num + `)" style="
    padding: 5px;
    background-color:  var(--theme-color-outline);;
    border-radius: 12px;
    height: 30px;
    margin: 10px 5px;
    cursor: pointer;
"><div style="
    position: absolute;
    z-index: 5;
    color: var(--theme-text-color);
">` + dtps.classes[num].weights[i].assignments[ii].disp + `</div><div style="
    position: absolute;
    width: calc(` + (dtps.classes[num].weights[i].assignments[ii].percentage * 100) + `% - 280px);
    height: 32px;
    background-color: var(--theme-color);
    margin: -6px;
    border-radius: 12px;
"></div></div>`)
                    if (!((dtps.classes[num].weights[i].weight.toUpperCase().includes("SUCCESS")) || (dtps.classes[num].weights[i].weight.toUpperCase().includes("SS")))) {
                        var parts = dtps.classes[num].weights[i].assignments[ii].disp.split(":");
                        if (parts[parts.length - 1].includes("DV")) DVs++;
                        if (parts[parts.length - 1].includes("M")) DVs++;
                        if (parts[parts.length - 1].includes("INC")) DVs++;
                    }
                }
                dtps.classes[num].weights[i].icon = "";
                if (dtps.classes[num].weights[i].weight.toUpperCase().includes("SUCCESS") || dtps.classes[num].weights[i].weight.includes("SS")) { dtps.classes[num].weights[i].icon = `<i class="material-icons">star_border</i> `; dtps.classes[num].weights[i].weight = "Success Skills (" + dtps.classes[num].weights[i].weight.match(/\(([^)]+)\)/)[1] + ")"; }
                if (dtps.classes[num].weights[i].weight.toUpperCase().includes("COMPREHENSION") || dtps.classes[num].weights[i].weight.includes("CC")) { dtps.classes[num].weights[i].icon = `<i class="material-icons">done</i> `; dtps.classes[num].weights[i].weight = "Comprehension Checks (" + dtps.classes[num].weights[i].weight.match(/\(([^)]+)\)/)[1] + ")"; }
                if (dtps.classes[num].weights[i].weight.toUpperCase().includes("PERFORMANCE") || dtps.classes[num].weights[i].weight.includes("PT") || dtps.classes[num].weights[i].weight.includes("UE") || dtps.classes[num].weights[i].weight.includes("Exam")) { dtps.classes[num].weights[i].icon = `<i class="material-icons">assessment</i> `; dtps.classes[num].weights[i].weight = "Performance Tasks (" + dtps.classes[num].weights[i].weight.match(/\(([^)]+)\)/)[1] + ")"; }
                if (dtps.classes[num].weights[i].icon == "") dtps.classes[num].weights[i].icon = '<i class="material-icons">category</i> ';
                weightsTmp.push(`<div style="display: none;" class="weight ` + i + `"><h4>` + dtps.classes[num].weights[i].weight + `<div style="color: var(--flex-sectext, gray); text-align: right; font-size: 24px; float: right; display: inline-block;">` + dtps.classes[num].weights[i].grade + `</div></h4>` + assignTmp.join("") + `</div>`);
                sidebarTmp.push(`<div onclick="$(this).siblings().removeClass('active'); $(this).addClass('active'); $('.weight').hide(); $('.weight.` + i + `').show();" class="item">
       ` + dtps.classes[num].weights[i].icon + dtps.classes[num].weights[i].weight.replace("Comprehension Check", "CC").replace("Success Skills", "SS").replace("Performance Task", "PT") + `
    </div>`);
            }
            var headsUp = `<div class="card" style="background-color: #3cc15b;color: white;padding: 10px 20px;"><i class="material-icons" style="margin-right: 10px;font-size: 32px;display: inline-block;vertical-align: middle;">check_circle_outline</i><h5 style="display: inline-block;vertical-align: middle;margin-right: 5px;">On track to pass&nbsp;&nbsp;<span style="font-size: 18px;">Power+ didn't detect any DVs in any of your CCs or PTs</span></h5></div>`
            if (DVs > 0) {
                var headsUp = `<div class="card" style="background-color: #c14d3c;color: white;padding: 10px 20px;"><i class="material-icons" style="margin-right: 10px;font-size: 32px;display: inline-block;vertical-align: middle;">cancel</i><h5 style="display: inline-block;vertical-align: middle;margin-right: 5px;">You're at risk of failing this class&nbsp;&nbsp;<span style="font-size: 18px;">Power+ detected ` + DVs + ` DV(s) in your CCs/PTs</span></h5></div>`
            }
            if (String(window.localStorage.dtpsGradeTrend).startsWith("{") && (dtps.classes[dtps.selectedClass].grade !== "--")) var gradeDiff = Number((dtps.classes[dtps.selectedClass].grade - Number(JSON.parse(window.localStorage.dtpsGradeTrend)[dtps.classes[dtps.selectedClass].id].oldGrade)).toFixed(2));
            jQuery(".classContent").html(headsUp + (dtps.classes[dtps.selectedClass].grade !== "--" ? (String(window.localStorage.dtpsGradeTrend).startsWith("{") ? (gradeDiff !== 0 ? `<div class="card" style="background-color: #4e4e4e;color: white;padding: 10px 20px;">
<i class="material-icons" style="margin-right: 10px;font-size: 32px;display: inline-block;vertical-align: middle;">` + (gradeDiff > 0 ? "arrow_upward" : "arrow_downward") + `</i><span style="font-size: 18px; vertical-align: middle;">Your grade in this class has ` + (gradeDiff > 0 ? "increased" : "decreased") + ` by ` + String(gradeDiff).replace("-", "") + `%</span></h5></div>` : "") : "") : "") + `
<div style="height: 800px;" class="card withnav">
  <div class="sidenav">
    <div class="title">
      <h5>Gradebook</h5>
      <p>` + dtps.classes[num].name + `</p>
    </div>
    ` + sidebarTmp.join("") + `
  </div>
  <div class="content">
    ` + weightsTmp.join("") + `
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
dtps.assignment = function (id, classNum) {
    var streamNum = dtps.classes[classNum].streamitems.indexOf(id.toString());
    var assignment = dtps.classes[classNum].stream[streamNum];
    $(".card.details").html(`
<i onclick="fluid.cards.close('.card.details')" class="material-icons close">close</i>
<h3>Loading...</h3>
`);
    fluid.cards.close(".card.focus");
    fluid.modal(".card.details");
    var handInDom = `<div class="btn" onclick="window.location.href = '/` + assignment.loc + `/dropbox/assignment/` + assignment.id + `#/'"><i class="material-icons">assignment</i> Hand In</div>`
    if (assignment.turnedIn) handInDom = `<div class="btn" onclick="window.location.href = '/` + assignment.loc + `/dropbox/assignment/` + assignment.id + `#/'"><i class="material-icons">assignment_returned</i> Resubmit</div>`
    dtps.webReq("assignGET", "/" + assignment.loc + "/assignment/view/" + assignment.id, function (data) {
        var dom = jQuery("<div />", { html: data });
        var props = dom.children("div").siblings("table").children("tbody").children("tr:has(.label.right)");
        var list = [];
        for (var i = 0; i < props.length; i++) {
            var prop = jQuery(props[i]).text().replace(/^\s+|\s+$/g, "").replace(/\r?\n|\r/g, "").split(/:(.+)/);
            var icon = "";
            if (prop[0].includes("Posted")) icon = `<i class="material-icons">add_box</i>`
            if (prop[0].includes("Due")) icon = `<i class="material-icons">access_time</i>`
            if (prop[0].includes("Total")) icon = `<i class="material-icons">assessment</i>`
            if (prop[0] && prop[1]) {
                list.push(`<div style="cursor: auto;margin: 0px; padding: 10px 15px;" class="item">` + icon + "<b>" + prop[0] + "</b>:  " + prop[1] + `</div>`)
                jQuery(props[i]).remove();
            }
        }
        if (assignment.grade) {
            list.push(`<div style="cursor: auto;margin: 0px; padding: 10px 15px;" class="item"><i class="material-icons">star_border</i>` + "<b>Points earned</b>:  " + assignment.grade + " (" + assignment.letter + `)</div>`)
            list.push(`<div style="cursor: auto;margin: 0px; padding: 10px 15px;" class="item"><i class="material-icons">category</i>` + "<b>Category</b>:  " + assignment.weight + `</div>`)
        }
        if (contributors.includes(HaikuContext.user.login)) {
            list.push(`<div style="cursor: auto;margin: 0px; padding: 10px 15px;" class="item"><i class="material-icons">bug_report</i>` + "<b>IDs (classNumber-classID, streamNumber-assignmentID)</b>:  " + classNum + "-" + dtps.classes[classNum].id + " " + streamNum + "-" + assignment.id + `</div>`)
        }
        list.push(`<div style="cursor: auto;margin: 0px; padding: 10px 15px;" class="item"><i class="material-icons">class</i>` + "<b>Class</b>:  " + (dtps.fullNames ? dtps.classes[classNum].name : dtps.classes[classNum].subject) + `</div>`)
        dom.children("div").siblings("table").before(`<br /><div class="list">` + list.join("") + `</div><br /><br />`)
        $(".card.details").html(`<i onclick="fluid.cards.close('.card.details')" class="material-icons close">close</i>` + dom.html() + `
` + handInDom + `
<div class="btn sudo" onclick="dtps.myWork('` + assignment.loc + `', ` + assignment.id + `)"><i class="material-icons" style="font-family: 'Material Icons Extended'">experiment</i> View Work</div>
`);
    });
}
dtps.myWork = function (loc, id) {
    dtps.webReq("assignGET", "/" + loc + "/dropbox/messages/" + id + "?user_id=" + dtps.user.login, function (data) {
        $(".card.details").html(`<i onclick="fluid.cards.close('.card.details')" class="material-icons close">close</i>` + data);
    });
}
dtps.announcements = function () {
    dtps.webReq("letPOST", "/u/" + dtps.user.login + "/portal/portlet_annc", function (resp) {
        dtps.raw = resp;
        var ann = jQuery(resp).children("tbody").children("tr").toArray();
        var announcements = [];
        for (var i = 0; i < ann.length; i++) {
            if (jQuery(ann[i]).children("td")[1] !== undefined) {
                var loc = jQuery(ann[i]).children("td:has(a)").children("a").attr("href").split("/");
                var psClass = dtps.classLocs.indexOf(loc[1] + "/" + loc[2]);
                var col = "";
                var subject = "";
                if (psClass !== -1) {
                    col = dtps.classes[psClass].col
                    var name = dtps.classes[psClass].subject
                    if (dtps.fullNames) name = dtps.classes[psClass].name
                    subject = `<div class="label">` + name + `</div>`;
                }
                announcements.push(`<div onclick="$(this).toggleClass('open');" style="cursor: pointer;" class="announcement card color ` + col + `">
` + subject + jQuery(jQuery(ann[i]).children("td")[1]).children(".annc-with-images").html() + `
</div>
`);
            }
        }
        if ((dtps.selectedClass == "dash") && (dtps.masterContent == "assignments")) {
            jQuery(".dash .announcements").append("<br />" + announcements.join(""));
        }
    });
};
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
dtps.clearData = function () {
    if (window.confirm("Clearing Power+ data will clear all local user data stored by Power+. This should be done if it is a new semester / school year or if you are having issues with Power+. Are you sure you want to clear all your Power+ data?")) {
        window.localStorage.clear()
        window.alert("Power+ data cleared. Reload the page to begin repopulating your userdata.")
    }
}
dtps.showClasses = function (override) {
    var streamClass = "active"
    if (dtps.selectedClass !== "dash") var streamClass = "";
    dtps.classlist = [];
    if (window.localStorage.dtpsClassOrder !== undefined) {
        var classOrder = JSON.parse(window.localStorage.dtpsClassOrder)
        for (var i = 0; i < classOrder.length; i++) {
            var num = null;
            for (var ii = 0; ii < dtps.classes.length; ii++) {
                if (dtps.classes[ii].id == classOrder[i]) { var num = ii; }
            }
            if (num !== null) {
                var name = dtps.classes[num].subject
                if (dtps.fullNames) name = dtps.classes[num].name
                dtps.classlist.push(`
      <div onclick="dtps.selectedClass = ` + num + `" class="class ` + num + ` ` + dtps.classes[num].col + `">
      <div class="name">` + name + `</div>
      <div class="grade val"><span class="letter">` + dtps.classes[num].letter + `</span><span class="points">` + dtps.classes[num].grade + `%</span></div>
      </div>
    `);
            }
        }
        for (var i = 0; i < dtps.classes.length; i++) {
            if (!classOrder.includes(dtps.classes[i].id)) {
                var name = dtps.classes[i].subject
                if (dtps.fullNames) name = dtps.classes[i].name
                dtps.classlist.push(`
      <div onclick="dtps.selectedClass = ` + i + `" class="class ` + i + ` ` + dtps.classes[i].col + `">
      <div class="name">` + name + `</div>
      <div class="grade val"><span class="letter">` + dtps.classes[i].letter + `</span><span class="points">` + dtps.classes[i].grade + `%</span></div>
      </div>
    `);
            }
        }
    } else {
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
                if (highFlyers.includes(HaikuContext.user.login)) {
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
                dtps.onThemeChange();
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
            if (!$(".background").attr("class").includes("filter")) {
                //no color
                if (!$("body").hasClass("dark")) { $(".items").addClass("black"); } else { $(".items").removeClass("black"); }
            } else {
                $(".items").removeClass("black");
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
dtps.saveClassOrder = function () {
    $(".sidebar").sortable("destroy");
    var classes = $(".sidebar").children(".class:not(.google)")
    var classOrder = [];
    for (var i = 0; i < classes.length; i++) {
        if (/\d/.test(jQuery(classes[i]).attr("class"))) {
            classOrder.push(dtps.classes[Number(jQuery(classes[i]).attr("class").replace(/^\D+|\D.*$/g, ""))].id)
        }
    }
    localStorage.setItem("dtpsClassOrder", JSON.stringify(classOrder));
    dtps.sorting = false;
    window.alert("Class order saved");
}
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
dtps.render = function () {
    document.title = "Power+" + dtps.trackSuffix;
    if (window.localStorage.dtpsLetterGrades == "true") { $("body").addClass("letterGrades"); }
    if (window.localStorage.dtpsFullNames == "true") { dtps.fullNames = true; }
    $("body").addClass("dashboard");
    if (!dtps.currentClass) {
        dtps.selectedClass = "dash";
        dtps.selectedContent = "stream";
    }
    dtps.sorting = false;
    dtps.masterContent = "assignments";
    var trackDom = "";
    if (dtps.trackSuffix !== "") {
        trackDom = `<div style="display:inline-block;font-size: 16px; padding: 3px 4px;" class="beta badge notice">` + dtps.trackSuffix.replace(" (", "").replace(")", "") + `</div>`
    } else {
        trackDom = ``;
    }
    var verDom = dtps.readableVer.replace(dtps.trackSuffix, "");
    if (dtps.trackSuffix !== "") {
        verDom = `<div class="buildInfo" style="display: inline-block;font-size: 12px;cursor: pointer;"></div>`
    } else {
        verDom = dtps.readableVer.replace(dtps.trackSuffix, "");
    }
    document.addEventListener('extensionData', function (e) {
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
        }
    });
    jQuery("body").html(`
    <div class="sidebar">
    </div>
    <div class="background trans"></div>
<div class="header">
    <h1 id="headText">Dashboard</h1>
    <div style="display: none;" class="btns row tabs">
    <button onclick="dtps.selectedContent = 'stream'; dtps.classStream(dtps.selectedClass);" class="btn active stream">
    <i class="material-icons">assignment</i>
    Assignments
    </button>
    <button onclick="dtps.selectedContent = 'google'; $('.classContent').html(dtps.renderStream(dtps.classes[dtps.selectedClass].google.stream))" class="btn google">
    <i class="material-icons">class</i>
    google_logo Classroom
    </button>
    <button onclick="dtps.selectedContent = 'pages'; dtps.loadPages(dtps.selectedClass);" class="btn pages">
    <i class="material-icons">insert_drive_file</i>
    Pages
    </button>
    <button onclick="dtps.selectedContent = 'grades'; dtps.gradebook(dtps.selectedClass);" class="btn grades">
    <i class="material-icons">assessment</i>
    Grades
    </button>
    <button onclick="alert('The grade editor is just for fun. Does not change your actual grade. For Power+ testers only. Do not abuse this.'); dtps.classes[dtps.selectedClass].letter = prompt('Enter a letter grade'); dtps.classes[dtps.selectedClass].grade = prompt('Enter a percentage number(i.e. 98)');dtps.showClasses(true);" class="btn sudo gradeEditor" style="display: none;">
    <i class="material-icons">edit</i>
    Grade Editor
    </button>
    </div>
    </div>
	<div class="classContent">
    <div class="spinner">
      <div class="bounce1"></div>
      <div class="bounce2"></div>
      <div class="bounce3"></div>
    </div>
    </div>
<div style="height: calc(100vh - 50px);width: 75%;" class="card withnav focus close abt-new">
<i onclick="fluid.cards.close('.card.abt-new')" class="material-icons close">close</i>
  <div class="sidenav" style="position: fixed; height: calc(100% - 50px); border-radius: 20px 0px 0px 20px;">
    <div class="title">
	  <img src="https://dtps.js.org/outline.png" style="width: 50px;vertical-align: middle;margin-right: 5px;padding: 7px; padding-top: 14px;" />
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
    <div style="display:none;" onclick="$('.abtpage').hide();$('.abtpage.extension').show();" class="item extTab">
      <i class="material-icons">extension</i> Extension
    </div>
    <div onclick="$('.abtpage').hide();$('.abtpage.experiments').show();" style="/*display: none !important;*/" class="item sudo">
      <i class="material-icons" style="font-family: 'Material Icons Extended'">experiment</i> Experiments
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
    <div class="label"><i class="material-icons">timeline</i> Display grade trend</div>
    <br /><br />
    <div onclick="$('body').toggleClass('letterGrades'); localStorage.setItem('dtpsLetterGrades', $('body').hasClass('letterGrades'));" class="switch` + (window.localStorage.dtpsLetterGrades == "true" ? " active" : "") + `"><span class="head"></span></div>
    <div class="label"><i class="material-icons">font_download</i> Display letter grades instead of points earned</div>
    <br /><br />
    <div onclick="dtps.fullNames = !dtps.fullNames; localStorage.setItem('dtpsFullNames', dtps.fullNames); dtps.showClasses(true);" class="switch` + (window.localStorage.dtpsFullNames == "true" ? " active" : "") + `"><span class="head"></span></div>
    <div class="label"><i class="material-icons">title</i> Display full class names</div>
    <br /><br />
    <div onclick="$('.gradeEditor').toggle();" class="switch sudo"><span class="head"></span></div>
    <div class="label sudo"><i class="material-icons">edit</i> Show grade editor (Power+ testers only)</div>
</div>
<div style="display: none;" class="abtpage classes">
    <h5>Classes</h5>
    <button onclick="if (!dtps.sorting) { dtps.sorting = true; $('.sidebar').sortable(); window.alert('Drag and drop to reorder your classes. Click this button again when you are done.') } else { dtps.saveClassOrder(); }" class="btn"><i class="material-icons">sort</i>Sort classes</button>
    <button onclick="dtps.schedule()" class="btn"><i class="material-icons">access_time</i>Schedule</button>
    <br /><br />
<div class="googleClassroom prerelease">
    <h5>google_logo Classes</h5>
    <button class="btn" onclick="window.alert('On the page that opens, select Project DTPS, and click Remove Access.'); window.open('https://myaccount.google.com/permissions?authuser=' + dtps.user.google.getEmail());"><i class="material-icons">link_off</i>Unlink Google Classroom</button>
    <br /><br />
    <p>Classes listed below could not be associated with a PowerSchool class. You can choose which classes to show in the sidebar.</p>
    <div class="isolatedGClassList"><p>Loading...</p></div>
</div>
<div class="googleSetup prerelease">
    <h5>google_logo Classroom</h5>
    <p>Link google_logo Classroom to see assignments and classes from both PowerSchool and Google.</p>
    <p>If Power+ thinks one of your PowerSchool classes also has a Google Classroom, it'll add a Google Classroom tab to that class. You can choose which extra classes to show in the sidebar.</p>
    <button onclick="if (window.confirm('EXPERIMENTAL FEATURE: Google Classroom features are still in development. Continue at your own risk. Please leave feedback by clicking the feedback button at the top right corner of Power+.')) { dtps.googleSetup = true; dtps.webReq('psGET', 'https://dtechhs.learning.powerschool.com/do/account/logout', function() { gapi.auth2.getAuthInstance().signIn().catch(function(err) { /*window.location.reload()*/ console.warn(err); }); })}" class="btn sudo"><i class="material-icons">link</i>Link Google Classroom</button>
</div>
</div>
<div style="display: none;" class="abtpage extension">
    <h5>Extension</h5>
    <div class="extensionDom" ></div>
</div>
<div style="display: none;" class="abtpage experiments">
<div class="sudo">
    <h5>Experiments</h5>
    <p>Features listed below are in development or are UI tests and cannot be included in a bug report until their stable releases</p>
    <p>Want to test out new features as they are developed instead of waiting for the next release? <a href="https://dtps.js.org/devbookmark.txt">Try the dev version of Power+</a>.</p>
<br />
<br /><br />

</div>
</div>
<div style="display: none;" class="abtpage debug">
<div class="dev">
    <h5>Debugging</h5>
<br />
<span class="log">
</span>
</div>
</div>
<div style="display: none;" class="abtpage about">
    <h5>Power+ ` + dtps.readableVer + ` <div class="buildInfo" style="display: inline-block;margin: 0px 5px;font-size: 12px;cursor: pointer;"></div></h5>
    <p>Made by <a href="https://github.com/jottocraft">jottocraft</a></p>
    <button onclick="dtps.changelog();" style="display:none;" class="btn changelog"><i class="material-icons">update</i>Changelog</button>
    <button onclick="dtps.clearData();" class="btn outline"><i class="material-icons">delete_outline</i>Reset Power+</button>
     <br /><br />
   <h5>Logged in as ` + dtps.user.first_name + " " + dtps.user.last_name + ` <span style="font-size: 12px;">` + dtps.user.login + `</span></h5>
<div style="display:inline-block;" class="beta badge notice highFlyer">high flyer&nbsp;<i style="vertical-align: middle;" class="material-icons highFlyer">school</i></div>
<div style="display:inline-block;" class="beta badge notice sudo">tester&nbsp;<i style="vertical-align: middle;" class="material-icons sudo">bug_report</i></div>
<div style="display:inline-block;" class="beta badge notice contributor">contributor&nbsp;<i style="vertical-align: middle;" class="material-icons contributor">group</i></div>
<div style="display:inline-block;" class="beta badge notice og">OG&nbsp;<i style="vertical-align: middle;" class="material-icons og">star_border</i></div>
<div style="display:inline-block;" class="beta badge notice dev">developer&nbsp;<i style="vertical-align: middle;" class="material-icons dev">code</i></div>
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
<p style="cursor: pointer; color: var(--flex-sectext, gray)" onclick="dtps.render();">Re-render Power+</p>
</div>
<p><span onclick="dtps.bugReport()">(c)</span> 2018-2019 jottocraft (<a href="https://github.com/jottocraft/dtps/blob/master/LICENSE">license</a>)</p>
</div>
  </div>
</div>
    <div class="items">
    <h4>` + dtps.user.first_name + ` ` + dtps.user.last_name + `</h4>
    <img src="` + dtps.user.prof + `" style="width: 50px; height: 50px; margin: 0px 5px; border-radius: 50%; vertical-align: middle;box-shadow: 0 5px 5px rgba(0, 0, 0, 0.17);" />
    <i onclick="dtps.bugReport();" class="material-icons prerelease">bug_report</i>
    <i onclick="document.dispatchEvent(new CustomEvent('extensionData', { detail: 'extensionStatus'})); fluid.modal('.abt-new')" class="material-icons">more_horiz</i>
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
  `);
    if (!$(".background").attr("class").includes("filter")) {
        //no color
        if (!$("body").hasClass("dark")) { $(".items").addClass("black"); } else { $(".items").removeClass("black"); }
    } else {
        $(".items").removeClass("black");
    }
    dtps.masterStream();
    var getURL = "https://api.github.com/repos/jottocraft/dtps/commits?path=init.js";
    if (dtps.trackSuffix !== "") var getURL = "https://api.github.com/repos/jottocraft/dtps/commits?path=dev.js";
    jQuery.getJSON(getURL, function (data) {
        jQuery(".buildInfo").html("build " + data[0].sha.substring(7, 0));
        jQuery(".buildInfo").click(function () {
            window.open("https://github.com/jottocraft/dtps/commit/" + data[0].sha)
        });
    })
    jQuery.getScript("https://cdn.rawgit.com/showdownjs/showdown/1.8.6/dist/showdown.min.js", function () {
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

    var prev = "linear-gradient(to bottom right, " + window.getComputedStyle(document.getElementsByClassName("background")[0]).getPropertyValue($("body").hasClass("midnight") ? "--dark" : "--light") + ", " + jQuery("body").css("background-color") + ")"
    $(".background").css("background", prev)
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
