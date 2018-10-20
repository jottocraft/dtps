var dtps = {
  ver: 004,
  readableVer: "v0.0.4 [ALPHA]"
};
dtps.changelog = function () {
  jQuery("body").append(`<div id="TB_overlay" style="position: fixed;">&nbsp;</div><div id="TB_window" role="dialog" aria-modal="true" aria-labelledby="TB_title" style="width: 800px; height: 540px; left: 141.5px; top: 200px;"><div id="TB_closeAjaxWindow" class="tb_title_bar" role="heading"><a href="javascript:;" onclick="TB_remove();" id="TB_closeWindowButton" aria-hidden="true"><i class="icon-close"></i></a><div id="TB_title" class="tb_title">project dtps</div><div id="TB_ajaxContent" role="main" style="width: 770px; height: 434px;">
<h2>What's new in project dtps</h2>
<h4>` + dtps.readableVer + `</h4>
<ul>
<li>Added the shell of the dtps UI. Class selector and background gradient probably finished to beta standards.</li>
<li>Stream, class colors, pages and gradebook coming soon. This might take a while, though. Will add after a smaller planned update.</li>
</ul>
</div><div id="TB_actionBar" style=""><span><input class="button button" onclick="ThickBox.close();dtps.render();" type="button" value="Continue"></span>
`)
};
dtps.log = function(msg) {
console.log("[DTPS] " + msg);
}
dtps.firstrun = function () {
  jQuery("body").append(`<div id="TB_overlay" style="position: fixed;">&nbsp;</div><div id="TB_window" role="dialog" aria-modal="true" aria-labelledby="TB_title" style="width: 800px; height: 540px; left: 141.5px; top: 200px;"><div id="TB_closeAjaxWindow" class="tb_title_bar" role="heading"><a href="javascript:;" onclick="TB_remove();" id="TB_closeWindowButton" aria-hidden="true"><i class="icon-close"></i></a><div id="TB_title" class="tb_title">project dtps</div><div id="TB_ajaxContent" role="main" style="width: 770px; height: 434px;">
<h2>Welcome to project dtps</h2>
<h4>` + dtps.readableVer + `</h4>
<h4>Before using project dtps, make sure you know what you're signing up for. Read all of this carefully.<h4>
<li>Project dtps is a powerschool skin / mod that will pull data from your powerschool account and show you a much better UI</li>
<li>Project dtps is meant to be simple, so various powerschool features will be left out. If you need to use an unsupported feature, reload powerschool and don't click the bookmark.</li>
<li>Project dtps will not store any of your user data anywhere. Project dtps currently only saves the last used version of project dtps (for changelogs) and if you agree to this prompt locally on your computer as a cookie.</li>
<li>Project dtps has the potential to write / edit data on your powerschool account, but there are no plans for that and it currently does not write/edit anything on your powerschool account, powerschool assignments, any powerschool coursework, etc.</li>
<li>Project dtps needs to be launched via the bookmark <b>every time</b> you visit powerschool in order to work. You can choose to not click the bookmark and powerschool will work as normal. Project dtps does not and cannot run any scrips of any kind without you clicking the bookmark. A chrome extension may be created in the future to automatically load project dtps.</li>
<li>To prevent any privacy incidents from occuring, please don't run other scripts alongside project dtps. project dtps can be reverse engineered and taken advantage of if you run other scripts.</li>
<li><b>Project dtps or myself are not responsible for any issues of any kind regarding anything related to powerschool. Use this at your own risk. Project dtps will have bugs, some of which may inaccuratly reflect your academic status. If you have any doubts, you can just not click the bookmark and use powerschool normally.</b></li>
</div><div id="TB_actionBar" style=""><span><input class="button button" onclick="ThickBox.close();" type="button" value="Cancel"><input class="button button" onclick="ThickBox.close(); document.cookie = 'dtpsInstalled=true'; dtps.render();" type="button" value="Accept & Continue"></span>
`)
};
dtps.alert = function (text, sub) {
  if (text == undefined) var text = "";
  if (sub == undefined) var sub = "";
  jQuery("body").append(`<div id="TB_overlay" style="position: fixed;">&nbsp;</div><div id="TB_window" role="dialog" aria-modal="true" aria-labelledby="TB_title" style="width: 800px; height: 540px; left: 141.5px; top: 200px;"><div id="TB_closeAjaxWindow" class="tb_title_bar" role="heading"><div id="TB_title" class="tb_title">project dtps</div><div id="TB_ajaxContent" role="main" style="width: 770px; height: 434px;">
<h2>` + text + `</h2>
<p>` + sub + `</p>
</div>
`)
};
dtps.getCookie = function(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
dtps.init = function () {
  dtps.log("Starting dtps v" + dtps.ver + "...");
  dtps.shouldRender = false;
  dtps.user = jQuery("#header-body h1").text().split(", ")[1];
  if (window.location.host !== "dtechhs.learning.powerschool.com") {
    dtps.shouldRender = false;
    dtps.alert("Unsupported school", "Project dtps only works at Design Tech High School");
  } else {
    
     if (Number(dtps.getCookie("dtps")) < dtps.ver) {
    dtps.changelog();
  } else {
    dtps.shouldRender = true;
    dtps.alert("Loading...");
  }
    
  }
  if (dtps.getCookie("dtpsInstalled") !== "true") {
    dtps.firstrun();
  }
  document.cookie = "dtps=" + dtps.ver;
var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var data = jQuery(this.responseText).children("tbody").children();
      dtps.rawData = data;
      dtps.classes = [];
      for (var i = 0; i < data.length; i++) {
        var section = jQuery(data[i]);
        var grade = section.children(".right").text().replace(/\s/g, "").replace("%", "");
        var name = jQuery(section.children()[1]).text();
        var loc = section.children("td").children("a.filter").attr("href").split("/")
        var subject = null;
        if (name.includes("Physics")) { var subject = "Physics" }; if (name.includes("English")) { var subject = "English" }; if (name.includes("Physical Education")) { var subject = "PE" };
        if (name.includes("Prototyping")) { var subject = "Prototyping" }; if (name.includes("Algebra")) { var subject = "Algebra" };if (name.includes("Algebra 2")) { var subject = "Algebra 2" };
        if (name.includes("Spanish")) { var subject = "Spanish" }; if (name.includes("@") || name.includes("dtech")) { var subject = "@d.tech" };
        if (subject == null) var subject = name;
        dtps.classes.push({
          name: name,
          subject: subject,
          abbrv: jQuery(section.children()[0]).text(),
          grade: (grade == "--") ? ( grade ) : (Number(grade.match(/\d+/g).join(".")).toFixed(2)),
          letter: (grade == "--") ? ( grade ) : (grade.replace(/[0-9]/g, '').replace(".", "")),
          loc: loc[1] + "/" + loc[2]
        })
      }
      dtps.log("Grades loaded", dtps.classes)
      if (dtps.shouldRender) dtps.render();
    }
  };
  xhttp.open("POST", "portal/portlet_reportcard?my_portal=true", true);
  xhttp.setRequestHeader("Accept", "text/javascript, text/html, application/xml, text/xml, */*")
  xhttp.setRequestHeader("Accept-Language", "en-US,en;q=0.9")
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8")
  xhttp.setRequestHeader("X-Prototype-Version", "1.7.1")
  xhttp.setRequestHeader("X-Requested-With", "XMLHttpRequest")
  xhttp.send(portalClassesAndUserQuery()+ "&csrf_token=" + CSRFTOK);
}
dtps.loadPages = function(num) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      console.log(this.responseText)
      /* var data = jQuery(this.responseText).children("tbody").children();
      dtps.rawData = data;
      dtps.classes = [];
      for (var i = 0; i < data.length; i++) {
        var section = jQuery(data[i]);
        var grade = section.children(".right").text().replace(/\s/g, "").replace("%", "");
        var name = jQuery(section.children()[1]).text();
        var subject = null;
        if (name.includes("Physics")) { var subject = "Physics" }; if (name.includes("English")) { var subject = "English" }; if (name.includes("Physical Education")) { var subject = "PE" };
        if (name.includes("Prototyping")) { var subject = "Prototyping" }; if (name.includes("Algebra")) { var subject = "Algebra" };if (name.includes("Algebra 2")) { var subject = "Algebra 2" };
        if (name.includes("Spanish")) { var subject = "Spanish" }; if (name.includes("@") || name.includes("dtech")) { var subject = "@d.tech" };
        if (subject == null) var subject = name;
        dtps.classes.push({
          name: name,
          subject: subject,
          abbrv: jQuery(section.children()[0]).text(),
          grade: (grade == "--") ? ( grade ) : (Number(grade.match(/\d+/g).join(".")).toFixed(2)),
          letter: (grade == "--") ? ( grade ) : (grade.replace(/[0-9]/g, '').replace(".", ""))
        })
      }
      dtps.log("Grades loaded", dtps.classes)
      if (dtps.shouldRender) dtps.render();
    } */
  };
  xhttp.open("POST", "https://dtechhs.learning.powerschool.com/" + dtps.classes[num].loc +  "/cms_page/view", true);
  xhttp.setRequestHeader("Accept", "text/javascript, text/html, application/xml, text/xml, */*")
  xhttp.setRequestHeader("Accept-Language", "en-US,en;q=0.9")
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8")
  xhttp.setRequestHeader("X-Prototype-Version", "1.7.1")
  xhttp.setRequestHeader("X-Requested-With", "XMLHttpRequest")
  xhttp.send("csrf_token=" + CSRFTOK);
}
}
dtps.render = function() {
  document.title = "Project dtps Alpha"
   $ = jQuery;
  dtps.classlist = [];
  for (var i = 0; i < dtps.classes.length; i++) {
    dtps.classlist.push(`
<div onclick="dtps.selectedClass = ` + i + `" class="class">
<div class="label">` + dtps.classes[i].subject + `</div>
<div class="grade"><span class="letter">` + dtps.classes[i].letter + `</span><span class="points">` + dtps.classes[i].grade + `%</span></div>
</div>
`);
  }
   jQuery("body").html(`
<div class="sidebar">
<div class="class active">
<div class="label">Stream</div>
<div class="grade"><i class="material-icons">view_stream</i></div>
</div>
<div class="classDivider"></div>
` + dtps.classlist.join("") + `
</div>
<div class="background">
<div class="header">
<h1>Stream</h1>
<div style="display: none;" class="btns row">
<button class="btn active">
Stream
<i class="material-icons">view_stream</i>
</button>
<button class="btn">
Pages
<i class="material-icons">list</i>
</button>
<button class="btn">
Gradebook
<i class="material-icons">book</i>
</button>
</div>
</div>
</div>
`)
  $("link").remove();
  jQuery("<link/>", {
   rel: "shortcut icon",
   type: "image/png",
   href: "https://jottocraft.github.io/dtps/favicon.png"
}).appendTo("head");
  jQuery("<link/>", {
   rel: "stylesheet",
   type: "text/css",
   href: "https://jottocraft.github.io/dtps/fluid.css"
}).appendTo("head");
  jQuery("<link/>", {
   rel: "stylesheet",
   type: "text/css",
   href: "https://jottocraft.github.io/dtps/dtps.css"
}).appendTo("head");
  jQuery("<link/>", {
   rel: "stylesheet",
   type: "text/css",
   href: "https://fonts.googleapis.com/icon?family=Material+Icons"
}).appendTo("head");
  jQuery.getScript('https://jottocraft.github.io/dtps/fluid.js');
  
  $( ".class" ).click(function(event) {
  $(this).siblings().removeClass("active")
  $(this).addClass("active")
  //dtps.loadClass()
  $(".header h1").html($(this).children(".label").text())
  if ($(this).children(".label").text() == "Stream") {
  $(".header .btns").hide();
  } else {
  $(".header .btns").show();
  }
});
  fluid.init();
  
}

dtps.init();

