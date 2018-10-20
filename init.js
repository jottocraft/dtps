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
<p>Click "Install" below to continue</p>
</div><div id="TB_actionBar" style=""><span><input class="button button" onclick="ThickBox.close();" type="button" value="Cancel"><input class="button button" onclick="ThickBox.close(); document.cookie = 'dtpsInstalled=true';" type="button" value="Install"></span>
`)
};
dtps.loading = function () {
  jQuery("body").append(`<div id="TB_overlay" style="position: fixed;">&nbsp;</div><div id="TB_window" role="dialog" aria-modal="true" aria-labelledby="TB_title" style="width: 800px; height: 540px; left: 141.5px; top: 200px;"><div id="TB_closeAjaxWindow" class="tb_title_bar" role="heading"><div id="TB_title" class="tb_title">project dtps</div><div id="TB_ajaxContent" role="main" style="width: 770px; height: 434px;">
<h2>Loading...</h2>
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
  dtps.loading();
  dtps.shouldRender = false;
  if (Number(dtps.getCookie("dtps")) < dtps.ver) {
    dtps.changelog();
  } else {
    dtps.shouldRender = true;
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
        var subject = null;
        if (name.includes("Physics")) var subject = "Physics";
        if (name.includes("English")) var subject = "English";
        if (name.includes("Physical Education")) var subject = "PE";
        if (name.includes("Prototyping")) var subject = "Prototyping";
        if (name.includes("Algebra")) var subject = "Algebra";
        if (name.includes("Algebra 2")) var subject = "Algebra 2";
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
    }
  };
  xhttp.open("POST", "https://dtechhs.learning.powerschool.com/u/10837719/portal/portlet_reportcard?my_portal=true", true);
  xhttp.setRequestHeader("Accept", "text/javascript, text/html, application/xml, text/xml, */*")
  xhttp.setRequestHeader("Accept-Language", "en-US,en;q=0.9")
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8")
  xhttp.setRequestHeader("X-Prototype-Version", "1.7.1")
  xhttp.setRequestHeader("X-Requested-With", "XMLHttpRequest")
  xhttp.send("id=9915857+10145967+9715213+9915843+9915882&e=15668509&csrf_token=a6b227ce5120182257f86aab1815027b273f429e");
}
dtps.render = function() {
  document.title = "Project dtps Alpha"
   $ = jQuery;
  dtps.classlist = [];
  for (var i = 0; i < dtps.classes.length; i++) {
    dtps.classlist.push(`
<div class="class">
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
  
}

dtps.init();

