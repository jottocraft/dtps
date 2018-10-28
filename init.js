var dtps = {
  ver: 011,
  readableVer: "v0.1.1 (Beta)",
  trackSuffix: " (Beta)"
};
dtps.changelog = function () {
  jQuery("body").append(`<div id="TB_overlay" style="position: fixed;">&nbsp;</div><div id="TB_window" role="dialog" aria-modal="true" aria-labelledby="TB_title" style="width: 800px; height: 540px;margin: 0 calc(50% - 400px); top: calc(50% - 290px);"><div id="TB_closeAjaxWindow" class="tb_title_bar" role="heading"><a href="javascript:;" onclick="TB_remove();" id="TB_closeWindowButton" aria-hidden="true"><i class="icon-close"></i></a><div id="TB_title" class="tb_title">Project DTPS</div><div id="TB_ajaxContent" role="main" style="width: 770px; height: 434px;">
<h2>What's new in Project DTPS</h2>
<h4>` + dtps.readableVer + `</h4>
<ul>
<li>Added Stream to class list. Shows work from all classes.</li>
<li><b>Known stream bug: does not show content from the class at top of the list.</b></li>
<li>Up next: ironing things out and multi-block pages. Gradebook is low priority right now, so I'll be hiding the tab until it's ready.</li>
</ul>
</div><div id="TB_actionBar" style=""><span><input class="button button" onclick="ThickBox.close();dtps.render();" type="button" value="Continue"></span>
`)
};
dtps.log = function(msg) {
console.log("[DTPS] " + msg);
}
dtps.firstrun = function () {
  jQuery("body").append(`<div id="TB_overlay" style="position: fixed;">&nbsp;</div><div id="TB_window" role="dialog" aria-modal="true" aria-labelledby="TB_title" style="width: 800px; height: 540px;margin: 0 calc(50% - 400px); top: calc(50% - 290px);"><div id="TB_closeAjaxWindow" class="tb_title_bar" role="heading"><a href="javascript:;" onclick="TB_remove();" id="TB_closeWindowButton" aria-hidden="true"><i class="icon-close"></i></a><div id="TB_title" class="tb_title">Project DTPS</div><div id="TB_ajaxContent" role="main" style="width: 770px; height: 434px;">
<h2>Welcome to Project DTPS</h2>
<h4>` + dtps.readableVer + `</h4>
<h4>Before using Project DTPS, make sure you know what you're signing up for. Read all of this carefully.<h4>
<li>Project dtps basically a completly different website ran via a script on powerschool that will pull data from your powerschool account and show you a much better UI</li>
<li>Project dtps is meant to be simple, so various powerschool features will be left out. If you need to use an unsupported feature, reload powerschool and don't click the bookmark.</li>
<li>Project dtps will not store any of your user data anywhere. Project dtps currently only saves the last used version of Project DTPS (for changelogs) and if you agreed to this prompt locally on your computer as a cookie.</li>
<li>Project dtps has the potential to write / edit data on your powerschool account, but there are no plans for that and it currently does not write/edit anything on your powerschool account, powerschool assignments, any powerschool coursework, etc.</li>
<li>Project dtps needs to be launched via the bookmark <b>every time</b> you visit powerschool in order to work. You can choose to not click the bookmark and powerschool will work as normal. Project dtps does not and cannot run any scrips of any kind without you clicking the bookmark (unless using the Project DTPS auto load chrome extension)</li>
<li>To prevent any privacy incidents from occuring, please don't run other scripts alongside Project DTPS. Project DTPS can be reverse engineered and taken advantage of if you run other scripts.</li>
<li><b>Project DTPS and myself are not responsible for any issues of any kind regarding anything related to powerschool. Use this at your own risk. Project DTPS will have bugs, some of which may inaccuratly reflect your academic status. If you have any doubts about anything, you can just not click the bookmark and use powerschool normally.</b></li>
</div><div id="TB_actionBar" style=""><span><input class="button button" onclick="ThickBox.close();" type="button" value="Cancel"><input class="button button" onclick="ThickBox.close(); document.cookie = 'dtpsInstalled=true'; dtps.render();" type="button" value="Accept & Continue"></span>
`)
};
dtps.alert = function (text, sub) {
  if (text == undefined) var text = "";
  if (sub == undefined) var sub = "";
  jQuery("body").append(`<div id="TB_overlay" style="position: fixed;">&nbsp;</div><div id="TB_window" role="dialog" aria-modal="true" aria-labelledby="TB_title" style="width: 800px; height: 540px;margin: 0 calc(50% - 400px); top: calc(50% - 290px);"><div id="TB_closeAjaxWindow" class="tb_title_bar" role="heading"><div id="TB_title" class="tb_title">Project DTPS</div><div id="TB_ajaxContent" role="main" style="width: 770px; height: 434px;">
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
dtps.requests = {};
dtps.http = {};
dtps.webReq = function(req, url, callback, q) {
	if (dtps.requests[url] == undefined) {
	if (req == "psGET") {
		dtps.http[url] = new XMLHttpRequest();
  dtps.http[url].onreadystatechange = function() {
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
	if (req == "psPOST") {
		dtps.http[url] = new XMLHttpRequest();
      dtps.http[url].onreadystatechange = function() {
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
		dtps.http[url] = new XMLHttpRequest();
    dtps.http[url].onreadystatechange = function() {
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
  dtps.http[url].send(portalClassesAndUserQuery()+ "&csrf_token=" + CSRFTOK);
	}
	} else {
			if (callback) callback(dtps.requests[url], q);
		}
}
dtps.init = function () {
  dtps.log("Starting DTPS " + dtps.readableVer + "...");
  var sudoers = ["10837719", "10838212", "10894474"]
  if (sudoers.includes(HaikuContext.user.login)) { jQuery("body").addClass("dev"); dtps.log("Dev mode enabled") }
  dtps.shouldRender = false;
  dtps.user = HaikuContext.user;
  dtps.classColors = [];
  var eClassList = jQuery(".eclass_list ul").children().toArray();
   dtps.classesReady = 0;
  for (var i = 0; i < eClassList.length; i++) {
	  console.log(i)
	  var eclass = jQuery(eClassList[i])
	  var col = jQuery.grep(eclass.attr("class").split(" "), function (item, index) {
              return item.trim().match(/^border_color/);
          })[0].replace("border_color_", "filter_");
	  var id = jQuery.grep(eclass.attr("class").split(" "), function (item, index) {
               return item.trim().match(/^eclass_/);
          })[1].replace("eclass_", "");
	  var loc = eclass.children("div.eclass_filter").attr("onclick").split("/");
	  dtps.classColors.push({id: id, col: col, loc: loc});
	  dtps.webReq("psGET", "https://dtechhs.learning.powerschool.com/" + loc[1] + "/" + loc[2] + "/assignment");
	  dtps.webReq("psGET", "https://dtechhs.learning.powerschool.com/" + loc[1] + "/" + loc[2] + "/grades", function(resp, q) {
		  var iTmp = null;
		  for (i = 0; i < dtps.classes.length; i++) {
			  if (dtps.classes[i].id == q.id) iTmp = i;
		  }
		  if (iTmp) dtps.classStream(iTmp, true); 
	  }, { id: id, num: i });
  }
  if (window.location.host !== "dtechhs.learning.powerschool.com") {
    dtps.shouldRender = false;
    dtps.alert("Unsupported school", "Project DTPS only works at Design Tech High School");
  } else {
    
     if (Number(dtps.getCookie("dtps")) < dtps.ver) {
    dtps.changelog();
  } else {
    dtps.shouldRender = true;
    dtps.alert("Loading...");
  }
    
    if (dtps.getCookie("dtpsInstalled") !== "true") {
    dtps.firstrun();
  }
    
  }
  document.cookie = "dtps=" + dtps.ver;
    dtps.webReq("letPOST", "portal/portlet_reportcard?my_portal=true", function(resp) {
      var data = jQuery(resp).children("tbody").children();
      dtps.rawData = data;
      dtps.classes = [];
      for (var i = 0; i < data.length; i++) {
        var section = jQuery(data[i]);
        var grade = section.children(".right").text().replace(/\s/g, "").replace("%", "");
        var name = jQuery(section.children()[1]).text();
        var loc = section.children("td").children("a.filter").attr("href").split("/");
		var id = jQuery.grep(section.children("td").children("a.filter").attr("class").split(" "), function (item, index) {
               return item.trim().match(/^eclass_/);
          })[0].replace("eclass_", "");
        var subject = null;
        if (name.includes("Physics")) { var subject = "Physics" }; if (name.includes("English")) { var subject = "English" }; if (name.includes("Physical Education")) { var subject = "PE" };
        if (name.includes("Prototyping")) { var subject = "Prototyping" }; if (name.includes("Algebra")) { var subject = "Algebra" };if (name.includes("Algebra 2")) { var subject = "Algebra 2" };
        if (name.includes("Spanish")) { var subject = "Spanish" }; if (name.includes("@") || name.includes("dtech")) { var subject = "@d.tech" };
        if (subject == null) var subject = name;
		for (var ii = 0; ii < dtps.classColors.length; ii++) {
		if (dtps.classColors[ii].id == id) var col = dtps.classColors[ii].col;
		}
        dtps.classes.push({
          name: name,
          subject: subject,
          abbrv: jQuery(section.children()[0]).text(),
          grade: (grade == "--") ? ( grade ) : (Number(grade.match(/\d+/g).join(".")).toFixed(2)),
          letter: (grade == "--") ? ( grade ) : (grade.replace(/[0-9]/g, '').replace(".", "")),
          loc: loc[1] + "/" + loc[2],
		  col: col,
		  id: id,
          num: i
        })
      }
      dtps.log("Grades loaded: ", dtps.classes)
      if (dtps.shouldRender) dtps.render();
    });
}
dtps.checkReady = function(num) {
	/* dtps.log(num + " reporting as READY total of " + dtps.classesReady); */ if ((dtps.selectedClass == "stream") && (dtps.classesReady == (dtps.classes.length - 1))) { dtps.log("LOADING STREAM"); dtps.masterStream(); }
}
dtps.loadPages = function(num) {
  jQuery(".sidebar").html(`
<div class="classDivider"></div>
<div class="spinner">
  <div class="bounce1"></div>
  <div class="bounce2"></div>
  <div class="bounce3"></div>
</div>
`);
	jQuery(".classContent").html("");
  dtps.webReq("psGET", "https://dtechhs.learning.powerschool.com/" + dtps.classes[num].loc  +  "/cms_page/view", function(resp) {
	  console.log("GOT DATA", resp)
      var data = jQuery(resp).find("#sidebar .sidebar_nav").children().toArray()
      dtps.rawData = data;
      dtps.classes[num].pages = [];
      dtps.classes[num].pagelist = [];
      for (var i = 0; i < data.length; i++) {
      var tmp = jQuery(data[i]).find("a.nav").attr("href").split("/");
      dtps.classes[num].pages.push({
        id: tmp[tmp.length-1],
        title: jQuery(data[i]).find("a.nav").text(),
        content:  "",
        num: i
      });
        dtps.classes[num].pagelist.push(`
<div onclick="dtps.selectedPage = ` + tmp[tmp.length-1] + `" class="class">
<div class="label">` + jQuery(data[i]).find("a.nav").text() + `</div>
<div class="grade"><i class="material-icons">notes</i></div>
</div>
`);
       }
      jQuery(".sidebar").html(`<div onclick="dtps.showClasses()" class="class">
<div class="label">Classes</div>
<div class="grade"><i class="material-icons">keyboard_arrow_left</i></div>
</div>
<div class="classDivider"></div>
` + dtps.classes[num].pagelist.join(""))
      $( ".class" ).click(function(event) {
  $(this).siblings().removeClass("active")
  $(this).addClass("active")
  dtps.getPage(dtps.classes[dtps.selectedClass].loc);
});
    });
}
dtps.classStream = function(num, renderOv) {
  dtps.showClasses();
  if (!renderOv) jQuery(".classContent").html(`
<div class="spinner">
  <div class="bounce1"></div>
  <div class="bounce2"></div>
  <div class="bounce3"></div>
</div>
`);
    dtps.webReq("psGET", "https://dtechhs.learning.powerschool.com/" + dtps.classes[num].loc + "/assignment", function(resp) {
      var data = jQuery(resp).find("table.list.hover_glow tbody").children("tr:not(.head)").toArray();
      dtps.classes[num].stream = [];
      dtps.classes[num].streamlist = [];
      dtps.classes[num].streamitems = [];    
      for (var i = 0; i < data.length; i++) {
      var assignment = jQuery(data[i])
      var due = assignment.children("td:nth-child(3)").text().slice(0,-1);
	if (due == "n/a") var due = "N/A";      
      dtps.classes[num].stream.push({
        id: assignment.find("a").attr("onclick").split("/")[5].replace("')", ""),
        title: assignment.children("td:nth-child(1)").text(),
        due: assignment.children("td:nth-child(3)").text().slice(0,-1),
		col: dtps.classes[num].col
      });
	   dtps.classes[num].streamitems.push(assignment.find("a").attr("onclick").split("/")[5].replace("')", "")) 
        dtps.classes[num].streamlist.push(`
<div class="card assignment">
<div class="spinner points">
  <div class="bounce1"></div>
  <div class="bounce2"></div>
  <div class="bounce3"></div>
</div>
    <h4>` + assignment.children("td:nth-child(1)").text() + `</h4>
	<h5>Due ` + due + `</h5>
</div>
`);
       }
      if (!renderOv) jQuery(".classContent").html(dtps.classes[num].streamlist.join(""));
	    
    dtps.webReq("psGET", "https://dtechhs.learning.powerschool.com/" + dtps.classes[num].loc + "/grades", function(resp) {
	     data = jQuery(resp).find("table.list.hover_glow tbody").children("tr:not(.noglow):not(:has(th))").toArray();
	    for (var i = 0; i < data.length; i++) {
	    if (jQuery(data[i]).find("a").attr("href")) {
	    var id = dtps.classes[num].streamitems.indexOf(jQuery(data[i]).find("a").attr("href").split("/")[5])
	    if (id && (id != -1)) {
	    dtps.classes[num].stream[id].grade = jQuery(data[i]).children("td:nth-child(4)").text().replace(/\s/g, "");
	    dtps.classes[num].stream[id].letter = jQuery(data[i]).children("td:nth-child(6)").text().replace(/\s/g, "");
	    }
	    }
	    }
	    dtps.classes[num].streamlist = [];

	     if (!renderOv) jQuery(".classContent").html(dtps.renderStream(dtps.classes[num].stream, dtps.classes[num].col));
		 dtps.classesReady++;
		 dtps.checkReady(num);
    });    
	    
    }); 
	

}
dtps.renderStream = function(stream) {
	var streamlist = [];
	if (col == undefined) var col = "";
	for (var i = 0; i < stream.length; i++) {
		    if ((stream[i].grade !== "-") && (stream[i].grade)) {
		  streamlist.push(`
<div class="card graded assignment ` + stream[i].col + `">
<div class="points">
 <div class="earned">` + stream[i].grade.split("/")[0] + `</div>
<div class="total">/` + stream[i].grade.split("/")[1] + `</div>
</div>
    <h4>` + stream[i].title + `</h4>
	<h5>Due ` + stream[i].due + `</h5>
</div>
`); } else {
streamlist.push(`
<div class="card assignment ` + stream[i].col + `">
    <h4>` + stream[i].title + `</h4>
	<h5>Due ` + stream[i].due + `</h5>
</div>
`);	
}
	    }
		return streamlist.join("");
		
}
dtps.masterStream = function() {
  dtps.showClasses();
  jQuery(".classContent").html(`
<div class="spinner">
  <div class="bounce1"></div>
  <div class="bounce2"></div>
  <div class="bounce3"></div>
</div>
`);
	var buffer = [];
    for (var i = 0; i < dtps.classes.length; i++) {
	    if (dtps.classes[i].stream) {
			dtps.log("BUILDING: " + i)
			buffer = buffer.concat(dtps.classes[i].stream)
	    }
    }
	console.log(buffer)
	jQuery(".classContent").html(dtps.renderStream(buffer.sort(function(a, b){
var year = new Date().getFullYear();
var today = new Date().toHumanString();
    var keyA = new Date(a.due.replace("Today", today).replace(year + " at", "")).setYear(year),
        keyB = new Date(b.due.replace("Today", today).replace(year + " at", "")).setYear(year);

    // Compare the 2 dates
    if(keyA < keyB) return 1;
    if(keyA > keyB) return -1;
    return 0;
})));
	$(".card.assignment").addClass("color");

}
dtps.getPage = function(loc, id) {
  if (id == undefined) var id = dtps.selectedPage;
  jQuery(".classContent").html(`
<div class="spinner">
  <div class="bounce1"></div>
  <div class="bounce2"></div>
  <div class="bounce3"></div>
</div>
`);
    dtps.webReq("psGET", "https://dtechhs.learning.powerschool.com/" + loc + "/cms_page/view/" + id, function(resp) {
      var newID = jQuery(resp).find("#col_2_1 .cms_box").attr("id").split("_")[1]
        dtps.webReq("psPOST", "https://dtechhs.learning.powerschool.com/" + loc + "/cms_box/render_content/" + newID, function(resp) {
         jQuery(".classContent").html(`
<div class="card">
` + resp + `
</div>
`)
        });
    }); 
}
dtps.showClasses = function () {
  var streamClass = "active"
  if (dtps.selectedClass !== "stream") var streamClass = "";
  jQuery(".sidebar").html(`<div onclick="dtps.selectedClass = 'stream';" class="class ` + streamClass + `">
<div class="name">Stream</div>
<div class="grade"><i class="material-icons">view_stream</i></div>
</div>
<div class="classDivider"></div>
` + dtps.classlist.join("") + `<div onclick="fluid.cards('.abt')" class="item link">
<div class="name"><i class="material-icons">settings</i><span>Settings</span></div>
</div>`);
  if (dtps.selectedClass !== "stream") $(".class." + dtps.selectedClass).addClass("active");
  if ($(".btn.pages").hasClass("active")) { $(".btn.pages").removeClass("active"); $(".btn.stream").addClass("active"); dtps.classStream(dtps.selectedClass); dtps.selectedContent = "stream"; }
       $( ".class" ).click(function(event) {
	  $(".background").removeClass(jQuery.grep($(".background").attr("class").split(" "), function (item, index) {
              return item.trim().match(/^filter_/);
          })[0]);
		  if (dtps.selectedClass !== "stream") $(".background").addClass(dtps.classes[dtps.selectedClass].col)
  $(this).siblings().removeClass("active")
  $(this).addClass("active")
  //dtps.loadClass()
  $(".header h1").html($(this).children(".name").text())
  if ($(this).children(".name").text() == "Stream") {
  $(".header .btns").hide();
  } else {
  $(".header .btns").show();
  }
  if ((dtps.selectedContent == "stream") && (dtps.selectedClass !== "stream")) dtps.classStream(dtps.selectedClass)
  if (dtps.selectedClass == "stream") dtps.masterStream();	       
	    
});
}
dtps.render = function() {
  document.title = "Project DTPS" + dtps.trackSuffix
   $ = jQuery;
jQuery.getScript('https://jottocraft.github.io/dtps/fluid.js');
  dtps.selectedClass = "stream";
  dtps.selectedContent = "stream";
  dtps.classlist = [];
  for (var i = 0; i < dtps.classes.length; i++) {
    dtps.classlist.push(`
<div onclick="dtps.selectedClass = ` + i + `" class="class ` + i + ` ` + dtps.classes[i].col + `">
<div class="name">` + dtps.classes[i].subject + `</div>
<div class="grade"><span class="letter">` + dtps.classes[i].letter + `</span><span class="points">` + dtps.classes[i].grade + `%</span></div>
</div>
`);
  }
	if (fluid.isDark()) { var dark = " active" } else { var dark = "" }
   jQuery("body").html(`
<div class="sidebar">
</div>
<div class="background">
<div class="header">
<h1 id="headText">Stream</h1>
<div style="display: none;" class="btns row">
<button onclick="dtps.selectedContent = 'stream'; dtps.classStream(dtps.selectedClass);" class="btn active stream">
Stream
<i class="material-icons">view_stream</i>
</button>
<button onclick="dtps.selectedContent = 'pages'; dtps.loadPages(dtps.selectedClass);" class="btn pages">
Pages
<i class="material-icons">list</i>
</button>
<button onclick="dtps.selectedContent = 'grades'" class="btn grades dev">
Gradebook
<i class="material-icons">code</i>
</button>
</div>
<div class="classContent">

<div class="spinner">
  <div class="bounce1"></div>
  <div class="bounce2"></div>
  <div class="bounce3"></div>
</div>

</div>
</div>
</div>

<div style="width: calc(80%);border-radius: 30px;" class="card focus close abt">
<h3>Settings</h3>
<h5>Project DTPS` + dtps.trackSuffix + ` ` + dtps.readableVer + `</h5>
<br />
<div onclick="fluid.dark();" class="switch` + dark + `"><span class="head"></span></div>
<div class="label">Enable dark mode</div>
</div>

`)
  dtps.showClasses();
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
   href: "https://fonts.googleapis.com/icon?family=Material+Icons+Extended"
}).appendTo("head");
  fluid.init();
  
}

dtps.init();
