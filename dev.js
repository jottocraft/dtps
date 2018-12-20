var dtps = {
  ver: 140,
  readableVer: "v1.4.0 (dev)",
  trackSuffix: " (dev)",
  showLetters: false,
  unreadAnn: 0,
  latestStream: []
};
dtps.changelog = function () {
  fluid.cards.close(".card.focus")
  fluid.modal(".card.changelog");
};
dtps.log = function(msg) {
  console.log("[DTPS" + dtps.trackSuffix + "] ", msg);
  if (typeof msg !== "object") { try { jQuery(".card.console .log").html(`<h5>[DTPS` + dtps.trackSuffix + `] ` + msg + `</h5>` + jQuery(".card.console .log").html()); } catch(e) {} }
}
dtps.firstrun = function () {
  jQuery("body").append(`<div id="TB_overlay" style="position: fixed;">&nbsp;</div><div id="TB_window" role="dialog" aria-modal="true" aria-labelledby="TB_title" style="width: 800px; height: 540px;margin: 0 calc(50% - 400px); top: calc(50% - 290px);"><div id="TB_closeAjaxWindow" class="tb_title_bar" role="heading"><a href="javascript:;" onclick="TB_remove();" id="TB_closeWindowButton" aria-hidden="true"><i class="icon-close"></i></a><div id="TB_title" class="tb_title">Power+` + dtps.trackSuffix + `</div><div id="TB_ajaxContent" role="main" style="width: 770px; height: 434px;">
<h2>Welcome to Power+` + dtps.trackSuffix + `</h2>
<h4>` + dtps.readableVer + `</h4>
<li>Power+` + dtps.trackSuffix + ` is meant to be simple, so many PowerSchool features will be left out</li>
<li>Power+` + dtps.trackSuffix + ` does not store any personal user data (such as grades). Data Power+` + dtps.trackSuffix + ` does use and needs to store (such as prefrences and version info for changelogs) is stored locally on your computer, never in any online database. Power+` + dtps.trackSuffix + ` uses Google Analytics to track how many people are using Power+` + dtps.trackSuffix + ` and will never log your ID or IP address with Google Analytics</li>
<li>Power+` + dtps.trackSuffix + ` only reads data from PowerSchool. Power+` + dtps.trackSuffix + ` will never edit, write, or delete data of any kind on your PowerSchool account</li>
<li>Power+` + dtps.trackSuffix + ` needs to be loaded with the bookmark script every time (unless using the chrome extension). You can always use PowerSchool as normal by reloading and not clicking the bookmark</li>
<li>Report bugs and send feedback by clicking the feedback button at the top right corner</li>
<li><b>Power+` + dtps.trackSuffix + ` may have bugs that cause it to display an inaccurate representation of your grades and assignments. Use Power+ at your own risk.</b></li>
</div><div id="TB_actionBar" style=""><span><input class="button button" onclick="ThickBox.close();" type="button" value="Cancel"><input class="button button" onclick="ThickBox.close(); localStorage.setItem('dtpsInstalled', 'true'); dtps.render();" type="button" value="Accept & Continue"></span>
`)
};
dtps.alert = function (text, sub) {
  if (text == undefined) var text = "";
  if (sub == undefined) var sub = "";
  jQuery("body").append(`<div id="TB_overlay" style="position: fixed;">&nbsp;</div><div id="TB_window" role="dialog" aria-modal="true" aria-labelledby="TB_title" style="width: 800px; height: 540px;margin: 0 calc(50% - 400px); top: calc(50% - 290px);"><div id="TB_closeAjaxWindow" class="tb_title_bar" role="heading"><div id="TB_title" class="tb_title">Power+` + dtps.trackSuffix + `</div><div id="TB_ajaxContent" role="main" style="width: 770px; height: 434px;">
<h2>` + text + `</h2>
<p>` + sub + `</p>
</div>
`)
};
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
if (req == "assignGET") {
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
      dtps.http[url].setRequestHeader("Upgrade-Insecure-Requests", "1");
	dtps.http[url].setRequestHeader("X-Prototype-Version", "1.7.1")
      dtps.http[url].setRequestHeader("X-Requested-With", "XMLHttpRequest")
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
		if ((url == "portal/portlet_reportcard?my_portal=true") && (jQuery("#portlet_box_content_reportcard:not(:has(.loading))").html())) {
		if (callback) callback(jQuery("#portlet_box_content_reportcard").html(), q);
      	  dtps.requests[url] = this.responseText;
	} else {
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
  	}
	} else {
		if (callback) callback(dtps.requests[url], q);
	}
}
dtps.init = function () {
  dtps.log("Starting DTPS " + dtps.readableVer + "...");
  sudoers = ["10837719", "10838212", "10894474", "10463823"]
  if (sudoers.includes(HaikuContext.user.login)) { jQuery("body").addClass("sudo"); dtps.log("Sudo mode enabled"); }
  og = ["10894474", "10837719", "10838212"]
  if (og.includes(HaikuContext.user.login)) { jQuery("body").addClass("og"); }
  contributors = ["10837719", "10463823", "10894474"]
  if (contributors.includes(HaikuContext.user.login)) { jQuery("body").addClass("contributor"); }
  if (HaikuContext.user.login == "10837719") { jQuery("body").addClass("dev"); dtps.log("Dev mode enabled"); }
  dtps.shouldRender = false;
	dtps.first = false;
	dtps.showChangelog = false;
	dtps.updateScript = false;
  dtps.user = HaikuContext.user;
  dtps.classColors = [];
jQuery.getScript("https://www.googletagmanager.com/gtag/js?id=UA-105685403-3", function() {
window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('config', 'UA-105685403-3', {
  'page_title' : 'portal',
  'page_path': '/portal',
  'anonymize_ip': true
  });
	
});
	jQuery.getScript("https://www.gstatic.com/firebasejs/5.7.0/firebase.js", function() {
// Initialize Firebase
  var config = {
    apiKey: "AIzaSyB7Oek4HHBvazM5e0RppZMbZ8qg6RjSDdU",
    authDomain: "project-dtps.firebaseapp.com",
    databaseURL: "https://project-dtps.firebaseio.com",
    projectId: "project-dtps",
    storageBucket: "project-dtps.appspot.com",
    messagingSenderId: "117676227556"
  };
  firebase.initializeApp(config);
  dtps.authProvider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().useDeviceLanguage();
  dtps.authProvider.addScope('https://www.googleapis.com/auth/classroom.courses.readonly');
  dtps.authProvider.addScope('https://www.googleapis.com/auth/classroom.coursework.me.readonly');
});
	jQuery.getScript("https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/3.9.0/fullcalendar.min.js")
	jQuery.getScript("https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.22.2/moment.min.js")
	jQuery.getScript('https://cdnjs.cloudflare.com/ajax/libs/fuse.js/3.3.0/fuse.min.js');
  if ((window.location.host !== "dtechhs.learning.powerschool.com") && ((window.location.host !== "mylearning.powerschool.com") || (HaikuContext.user.login.split(".")[0] !== "dtps"))) {
    dtps.shouldRender = false;
    dtps.alert("Unsupported school", "Power+ only works at Design Tech High School");
  } else {
    if (Number(window.localStorage.dtps) < dtps.ver) {
	    dtps.log("New release")
      dtps.showChangelog = true;
	    //Load fluid JS modules early for changelogs
    $ = jQuery;
	    jQuery("body").addClass("notwemoji");
	    fluidThemes = [ "midnight", "nitro", "aquatic", "rainbow" ];
      jQuery.getScript('https://dtps.js.org/fluid.js');
	    dtps.shouldRender = true;
      dtps.alert("Loading...", "Updating to Power+ " + dtps.readableVer);
    } else {
	  if (!Number(HaikuContext.user.login)) {
		  dtps.shouldRender = false;
    dtps.alert("Unsupported Account", "Power+ only works on student accounts");
	      } else {
		      if (dtpsLoader < 2) {
			      dtps.updateScript = true;
			      dtps.shouldRender = true;
			      dtps.alert("Loading...", "Make sure to update your bookmark script");
			  } else {
				 if (window.location.pathname.split("/")[3] !== "portal") {
					 dtps.shouldRender = false;
      dtps.alert("Page error", 'Go to your <a href="/u/' + HaikuContext.user.login + '/portal">PowerSchool homepage</a> to load Power+');
				     } else {
      dtps.shouldRender = true;
      dtps.alert("Loading...");
			  }
		      
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
	  dtps.classColors.push({id: id, col: col, loc: loc});
	  dtps.webReq("psGET", "/" + loc[1] + "/" + loc[2] + "/assignment");
	  dtps.webReq("psGET", "/" + loc[1] + "/" + loc[2] + "/cms_page/view");
	  dtps.webReq("psGET", "/" + loc[1] + "/" + loc[2] + "/grades", function(resp, q) {
		  var iTmp = null;
		  for (i = 0; i < dtps.classes.length; i++) {
			  if (dtps.classes[i].id == q.id) iTmp = i;
		  }
		  if (iTmp !== null) dtps.classStream(iTmp, true);
	  }, { id: id, num: i });
  }
  dtps.webReq("letPOST", "portal/portlet_reportcard?my_portal=true", function(resp) {
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
      if (name.includes("Physics")) { var subject = "Physics" }; if (name.includes("English")) { var subject = "English" }; if (name.includes("Physical Education")) { var subject = "PE" };
      if (name.includes("Prototyping")) { var subject = "Prototyping" }; if (name.includes("Algebra")) { var subject = "Algebra" };if (name.includes("Algebra 2")) { var subject = "Algebra 2" };
      if (name.includes("Spanish")) { var subject = "Spanish" }; if (name.includes("@") || name.includes("dtech")) { var subject = "@d.tech" };if (name.includes("Environmental")) { var subject = "Environmental Science" };
      if (name.includes("Robotics")) { var subject = "Robotics" };if (name.includes("Biology")) { var subject = "Biology" };if (name.includes("Engineering")) { var subject = "Engineering" };if (name.includes("Geometry")) { var subject = "Geometry" };
      if (name.includes("Photography")) { var subject = "Photography" };if (name.includes("World History")) { var subject = "World History" };if (name.includes("U.S. History")) { var subject = "US History" };
      if (name.includes("Calculus")) { var subject = "Calculus" };if (name.includes("Precalculus")) { var subject = "Precalculus" };if (name.includes("Statistics")) { var subject = "Advanced Statistics" };
      if (name.includes("Model United Nations")) { var subject = "Model UN" };if (name.includes("Government")) { var subject = "Government" }; if (name.includes("Economics")) { var subject = "Economics" };
      if (subject == null) var subject = name;
  		for (var ii = 0; ii < dtps.classColors.length; ii++) {
    		if (dtps.classColors[ii].id == id) var col = dtps.classColors[ii].col;
  		}
	    var letterTmp = grade.replace(/[0-9]/g, '').replace(".", "");
      dtps.classes.push({
        name: name,
        subject: subject,
        abbrv: jQuery(section.children()[0]).text(),
        grade: (grade == "--") ? ( grade ) : (Number(grade.match(/\d+/g).join(".")).toFixed(2)),
        letter: (grade == "--") ? ( grade ) : (letterTmp),
        loc: loc[1] + "/" + loc[2],
  		  col: col,
  		  id: id,
        num: i
      })
	  dtps.classLocs.push(loc[1] + "/" + loc[2]);
    }
    dtps.log("Grades loaded: ", dtps.classes)
    if (dtps.shouldRender) dtps.render();
    if (dtps.first) dtps.firstrun();
  });

}
dtps.checkReady = function(num) {
  //dtps.log(num + " reporting as READY total of " + dtps.classesReady);
  if ((dtps.selectedClass == "dash") && (dtps.classesReady == dtps.classes.length)) {
    dtps.log("All classes ready, loading master stream");
    dtps.masterStream(true);
  } else {
  if ((dtps.selectedClass == "dash") && (dtps.classesReady < dtps.classes.length)) {
	  dtps.masterStream();
  }
  }
}
dtps.loadPages = function(num) {
	if ((dtps.selectedClass == num) && (dtps.selectedContent == "pages")) {
  jQuery(".sidebar").html(`
<div class="classDivider"></div>
<div class="spinner">
  <div class="bounce1"></div>
  <div class="bounce2"></div>
  <div class="bounce3"></div>
</div>
`);
	jQuery(".classContent").html(""); }
  dtps.webReq("psGET", "/" + dtps.classes[num].loc  +  "/cms_page/view", function(resp) {
	  dtps.log("GOT DATA", resp)
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
    ` + dtps.classes[num].pagelist.join("")) }
	  
    $( ".class" ).click(function(event) {
	    if (!$(this).hasClass("back")) {
      $(this).siblings().removeClass("active")
      $(this).addClass("active")
      dtps.getPage(dtps.classes[dtps.selectedClass].loc);
	    }
    });
  });
}
dtps.classStream = function(num, renderOv) {
	dtps.log("rendering stream for " + num)
  if (!renderOv) dtps.showClasses();
  if ((dtps.selectedClass == num) && (dtps.selectedContent == "stream")) { if (!renderOv) { jQuery(".classContent").html(`
    <div class="spinner">
    <div class="bounce1"></div>
    <div class="bounce2"></div>
    <div class="bounce3"></div>
    </div>
  `); } }
  dtps.webReq("psGET", "/" + dtps.classes[num].loc + "/assignment", function(resp) {
    var data = jQuery(resp).find("table.list.hover_glow tbody").children("tr:not(.head)").toArray();
    dtps.classes[num].stream = [];
    dtps.classes[num].streamlist = [];
    dtps.classes[num].streamitems = [];
    for (var i = 0; i < data.length; i++) {
      var assignment = jQuery(data[i])
      var due = "<h5>Due " + assignment.children("td:nth-child(3)").text().slice(0,-1) + "</h5>"
    	if (due.includes("n/a")) {
		var due = "";
		var dueDateString = null;
	} else {
		var dueDate = new Date(assignment.children("td:nth-child(3)").text().slice(0,-1));
	    dueDate.setFullYear(2018);
		var dueDateString = dueDate.toISOString();
	}
      dtps.classes[num].stream.push({
        id: assignment.find("a").attr("onclick").split("/")[5].replace("')", ""),
        title: assignment.children("td:nth-child(1)").text(),
        due: assignment.children("td:nth-child(3)").text().slice(0,-1),
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
          ` + due + turnInDom +  `
          </div>
      `);
    }
	  if ((dtps.selectedClass == num) && (dtps.selectedContent == "stream")) {
    if (!renderOv) jQuery(".classContent").html(dtps.classes[num].streamlist.join("")); }

    dtps.webReq("psGET", "/" + dtps.classes[num].loc + "/grades", function(resp) {
	    data = jQuery(resp).find("table.list.hover_glow tbody").children("tr:not(.noglow)").toArray();
	    var prevWeight = -1;
	    dtps.classes[num].weights = [];
	    for (var i = 0; i < data.length; i++) {
		    if (jQuery(data[i]).children("th").length > 0) {
			    dtps.classes[num].weights.push({weight: jQuery(jQuery(data[i]).children("th").toArray()[0]).text(), assignments: []});
			    prevWeight++;
	    } else {
  	    if (jQuery(data[i]).find("a").attr("href")) {
      	    var id = dtps.classes[num].streamitems.indexOf(jQuery(data[i]).find("a").attr("href").split("/")[5])
    	    if (id && (id != -1)) {
      	    dtps.classes[num].stream[id].grade = jQuery(data[i]).children("td:nth-child(4)").text().replace(/\s/g, "");
      	    dtps.classes[num].stream[id].letter = jQuery(data[i]).children("td:nth-child(6)").text().replace(/\s/g, "");
            if (prevWeight !== -1) dtps.classes[num].stream[id].weight = dtps.classes[num].weights[prevWeight].weight;
	    if (prevWeight !== -1) dtps.classes[num].weights[prevWeight].assignments.push(dtps.classes[num].stream[id].title + ": " + dtps.classes[num].stream[id].grade);
    	    }
  	    }
	    }
	    }
	    dtps.classes[num].streamlist = [];
      if ((dtps.selectedClass == num) && (dtps.selectedContent == "stream")) { if (!renderOv) { jQuery(".classContent").html(dtps.renderStream(dtps.classes[num].stream, dtps.classes[num].col)); } }
	   if (dtps.selectedClass == num) { if (dtps.classes[dtps.selectedClass].weights.length) { $(".btns .btn.grades").show(); } }
      dtps.classesReady++;
      dtps.checkReady(num);
    });
  });
}
dtps.renderStream = function(stream, searchRes) {
	var streamlist = [];
	for (var i = 0; i < stream.length; i++) {
		var due = "Due " + stream[i].due;
    	    if (due.includes("n/a")) var due = "";
		var turnInDom = "";
		if (stream[i].turnedIn) {
		    turnInDom = `<div class="beta notice turnin"><i class="material-icons">assignment_turned_in</i></div>`
	    }
    if ((stream[i].grade !== "-") && (stream[i].grade)) {
  		if ("ABC".includes(stream[i].letter.toArray()[0])) {
  			var earnedTmp = stream[i].grade.split("/")[0];
	    } else {
    		var earnedTmp = stream[i].letter;
    	}
	    if (dtps.showLetters) earnedTmp = stream[i].letter;
	    var wFormat = "";
	    if (stream[i].weight) wFormat = stream[i].weight.replace(/ *\([^)]*\) */g, "");
	    if (wFormat == "undefined") wFormat = "";
		  streamlist.push(`
        <div onclick="dtps.assignment(` + stream[i].class + `, ` + i + `)" class="card graded assignment ` + stream[i].col + `">
        <div class="points">
        <div class="earned">` + earnedTmp + `</div>
        <div class="total">/` + stream[i].grade.split("/")[1] + `</div>
        </div>
        <h4>` + stream[i].title + `</h4>
      	<h5>` + due + ` <span class="weighted">` + wFormat + `</span>` + turnInDom + `</h5>
        </div>
      `);
    } else {
      streamlist.push(`
        <div onclick="dtps.assignment(` + stream[i].class + `, ` + i + `)" class="card assignment ` + stream[i].col + `">
        <h4>` + stream[i].title + `</h4>
	       <h5>` + due + turnInDom +  `</h5>
         </div>
       `);
    }
  }
	if (!searchRes) {
 dtps.latestStream = stream;
 dtps.fuse = new Fuse(stream,  {
  shouldSort: true,
  threshold: 0.6,
  keys: [ "title", "id", "due", "subject" ]
});
}
  return `<div style="text-align: right;"><input class="search" placeholder="Search assignments" type="text" style=" margin: 10px 25px;" /></div>` + streamlist.join("");
}
dtps.masterStream = function(doneLoading) {
  dtps.showClasses();
	if (dtps.masterContent == "ann") {
		dtps.announcements();
	}
	if ((dtps.selectedClass == "dash") && (dtps.masterContent == "assignments")) {
  jQuery(".classContent").html(`
    <div class="spinner">
    <div class="bounce1"></div>
    <div class="bounce2"></div>
    <div class="bounce3"></div>
    </div>
  `);}
	var buffer = [];
  for (var i = 0; i < dtps.classes.length; i++) {
    if (dtps.classes[i].stream) {
  		dtps.log("BUILDING: " + i)
  		buffer = buffer.concat(dtps.classes[i].stream)
    }
  }
	dtps.log(buffer)
	var loadingDom = "";
	if (!doneLoading) {
		loadingDom = `<div class="spinner">
    <div class="bounce1"></div>
    <div class="bounce2"></div>
    <div class="bounce3"></div>
    </div>`;
	}
	if ((dtps.selectedClass == "dash") && (dtps.masterContent == "assignments")) {
		jQuery(".classContent").html(`
<div class="dash left cal" style="width: 40%;">
<div id="calendar" class="card" style="width: 100%;margin: 25px;">
</div>
</div>
<div style="width: 60%" class="dash right stream">
</div>
`)
		dtps.calendar(doneLoading);
	jQuery(".classContent .stream").html(loadingDom + dtps.renderStream(buffer.sort(function(a, b){
    var year = new Date().getFullYear();
    var today = new Date().toHumanString();
    var keyA = new Date(a.due.replace("Today", today).replace(year + " at", "")).setYear(year),
    keyB = new Date(b.due.replace("Today", today).replace(year + " at", "")).setYear(year);
    // Compare the 2 dates
    if(keyA < keyB) return 1;
    if(keyA > keyB) return -1;
    return 0;
  }))); 
		$( "input.search" ).change(function() {
			if ($("input.search").val() == "") {
			    jQuery(".classContent .stream").html(dtps.renderStream(dtps.latestStream, true)) 
			    } else {
			jQuery(".classContent .stream").html(dtps.renderStream(dtps.fuse.search($("input.search").val()), true))
		}
});
	}
	$(".card.assignment").addClass("color");
}
dtps.getPage = function(loc, id) {
  if (id == undefined) var id = dtps.selectedPage;
  if ((dtps.classes[dtps.selectedClass].loc == loc) && (dtps.selectedContent == "pages")) {
  jQuery(".classContent").html(`
    <div class="spinner">
    <div class="bounce1"></div>
    <div class="bounce2"></div>
    <div class="bounce3"></div>
    </div>
  `); }
	var spinnerTmp = true;
  dtps.webReq("psGET", "/" + loc + "/cms_page/view/" + id, function(resp) {
    var newIDs = jQuery(resp).find(".cms_box").toArray();
	  if ((dtps.classes[dtps.selectedClass].loc == loc) && (dtps.selectedContent == "pages")) { if (spinnerTmp) { jQuery(".classContent").html(""); spinnerTmp = false; } }
    for (var i = 0; i < newIDs.length; i++) {
	var newID = jQuery(newIDs[i]).attr("id").split("_")[1];
    dtps.webReq("psPOST", "/" + loc + "/cms_box/render_content/" + newID, function(resp, q) {
	    if ((dtps.classes[dtps.selectedClass].loc == loc) && (dtps.selectedContent == "pages")) {
       jQuery(".classContent").html(jQuery(".classContent").html() + `
        <div class="card">
       <h4>` + q.title + `</h4>
        ` + resp + `
        </div>
      `);}
    }, {title: jQuery(newIDs[i]).children(".head").text()});
    }
  });
}
dtps.gradebook = function(num) {
	dtps.showClasses();
	if (dtps.classes[num].weights) {
	if (dtps.classes[num].weights.length) {
		$(".btns .btn.grades").show();
		var weightsTmp = [];
	for (var i = 0; i < dtps.classes[num].weights.length; i++) {
		var assignTmp = [];
		for (var ii = 0; ii < dtps.classes[num].weights[i].assignments.length; ii++) {
			assignTmp.push(`<p>` + dtps.classes[num].weights[i].assignments[ii] + `</p>`)
		}
		if (Number(dtps.classes[num].weights[i].weight.match(/\(([^)]+)\)/)[1].slice(0,-1)) < 10) {
		weightsTmp.push(`<div style="height: 40px;" class="weight card">
<div class="open">
<h4 onclick="if (Number($(this).parent().parent().css('height').slice(0,-2)) <= 400) {$(this).parent().parent().toggleClass('open')}">` + dtps.classes[num].weights[i].weight + `</h4>
` + assignTmp.join("") + `
</div>
<div class="close">
<p  onclick="if (Number($(this).parent().parent().css('height').slice(0,-2)) <= 400) {$(this).parent().parent().toggleClass('open')}">` + dtps.classes[num].weights[i].weight + ` (click to expand)</p>
</div>
</div>`);
	} else {
		weightsTmp.push(`<div style="height: calc(` + Number(dtps.classes[num].weights[i].weight.match(/\(([^)]+)\)/)[1].slice(0,-1)) + `% - 40px);" class="weight card">
<h4 onclick="if (Number($(this).parent().css('height').slice(0,-2)) <= 400) {$(this).parent().toggleClass('open')}">` + dtps.classes[num].weights[i].weight + `</h4>
` + assignTmp.join("") + `
</div>`);
	}
	}
	jQuery(".classContent").html(`
    <div style="height: 1000px;" class="weight parent">
    ` + weightsTmp.join("") + `
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
dtps.assignment = function(classNum, streamNum) {
	var assignment = dtps.classes[classNum].stream[streamNum];
	 $(".card.details").html(`
<i onclick="fluid.cards.close('.card.details')" class="material-icons close">close</i>
<h3>Loading...</h3>
`);
	fluid.cards.close(".card.focus");
          fluid.modal(".card.details");
	var handInDom = `<div class="btn" onclick="window.location.href = '/` + assignment.loc + `/dropbox/assignment/` + assignment.id + `#/'"><i class="material-icons">assignment</i> Hand In</div>`
	if (assignment.turnedIn) handInDom = `<div class="btn" onclick="window.location.href = '/` + assignment.loc + `/dropbox/assignment/` + assignment.id + `#/'"><i class="material-icons">assignment_returned</i> Resubmit</div>`
	dtps.webReq("assignGET", "/" + assignment.loc + "/assignment/view/" + assignment.id, function(data) {
	  $(".card.details").html(`<i onclick="fluid.cards.close('.card.details')" class="material-icons close">close</i>` + data + `
` + handInDom + `
<div class="btn sudo" onclick="dtps.myWork('` + assignment.loc + `', ` + assignment.id + `)"><i class="material-icons">experiment</i> View Work</div>
`);
	});
}
dtps.myWork = function(loc, id) {
	dtps.webReq("assignGET", "/" + loc + "/dropbox/messages/" + id + "?user_id=" + dtps.user.login, function(data) {
	  $(".card.details").html(`<i onclick="fluid.cards.close('.card.details')" class="material-icons close">close</i>` + data);
	});
}
dtps.announcements = function() {
	if ((dtps.selectedClass == "dash") && (dtps.masterContent == "ann")) {
  jQuery(".classContent").html(`
    <div class="spinner">
    <div class="bounce1"></div>
    <div class="bounce2"></div>
    <div class="bounce3"></div>
    </div>
  `); }
	dtps.webReq("letPOST", "/u/" + dtps.user.login + "/portal/portlet_annc", function(resp) {
		dtps.raw = resp;
		var ann = jQuery(resp).children("tbody").children("tr").toArray();
		var announcements = [];
		if (window.localStorage.unreadAnn) {
		if (window.localStorage.unreadAnn < ann.length) {
		dtps.unreadAnn = ann.length - window.localStorage.unreadAnn;
		localStorage.setItem('unreadAnn', ann.length);
		$("#annLabel").html("Announcements (" + dtps.unreadAnn + ")");
	} else {
		if (window.localStorage.unreadAnn > ann.length) localStorage.setItem('unreadAnn', ann.length);
	}
	} else {
		localStorage.setItem('unreadAnn', ann.length);
	}
		for (var i = 0; i < ann.length; i++) {
			if (jQuery(ann[i]).children("td")[1] !== undefined) {
				var loc = jQuery(ann[i]).children("td:has(a)").children("a").attr("href").split("/");
				var psClass = dtps.classLocs.indexOf(loc[1] + "/" + loc[2]);
				var col = "";
				if (psClass !== -1) col = dtps.classes[psClass].col
			announcements.push(`<div class="card color ` + col + `">
` + jQuery(jQuery(ann[i]).children("td")[1]).children(".annc-with-images").html() + `
</div>
`);
		}
		}
		if ((dtps.selectedClass == "dash") && (dtps.masterContent == "ann")) {
  jQuery(".classContent").html(announcements.join("")); }
	});
};
dtps.calendar = function(doneLoading) {
	if ((dtps.selectedClass == "dash") && (dtps.masterContent == "assignments")) {
	calEvents = [];
	for (var i = 0; i < dtps.classes.length; i++) {
    if (dtps.classes[i].stream) {
  		dtps.log("BUILDING CAL: " + i)
	    for (var ii = 0; ii < dtps.classes[i].stream.length; ii++) {
		    if (dtps.classes[i].stream[ii].dueDate) {
			    $(".class." + i).removeClass("active")
		    calEvents.push({
		  title: dtps.classes[i].stream[ii].title,
		  start: dtps.classes[i].stream[ii].dueDate,
		  allDay: false,
	          color: $(".class." + i).css("background-color"),
			    classNum: i,
			    streamNum: ii
		})
		    }
	    }
    }
  }
	$('#calendar').fullCalendar({
  events: calEvents,
  header: {
      left: 'title',
      right: 'prev,next'
  },
  eventClick: function(calEvent, jsEvent, view) {
dtps.assignment(calEvent.classNum, calEvent.streamNum);
  }
});
	}
}
dtps.showClasses = function(override) {
  var streamClass = "active"
  if (dtps.selectedClass !== "dash") var streamClass = "";
	dtps.classlist = [];
	var unreadAnn = "";
	if (dtps.unreadAnn) unreadAnn = "&nbsp;&nsbp;(" + dtps.unreadAnn + ")";
  for (var i = 0; i < dtps.classes.length; i++) {
	  var googleDom = "";
	  if (dtps.classes[i].google) var googleDom = "&nbsp;&nbsp;google_G";
    dtps.classlist.push(`
      <div onclick="dtps.selectedClass = ` + i + `" class="class ` + i + ` ` + dtps.classes[i].col + `">
      <div class="name">` + dtps.classes[i].subject + googleDom + `</div>
      <div class="grade val"><span class="letter">` + dtps.classes[i].letter + `</span><span class="points">` + dtps.classes[i].grade + `%</span></div>
      </div>
    `);
  }
	if ((!Boolean(jQuery(".sidebar .class.masterStream")[0])) || override) {
		var streamDom = `<div onclick="dtps.selectedClass = 'dash';" class="class masterStream ` + streamClass + `">
    <div class="name">Stream</div>
    <div class="grade"><i class="material-icons">view_stream</i></div>
    </div>`;
		if (sudoers.includes(HaikuContext.user.login)) {
			streamDom = `<div onclick="dtps.selectedClass = 'dash';" class="class sudo masterStream ` + streamClass + `">
    <div class="name">Dashboard</div>
    <div class="grade"><i class="material-icons">dashboard</i></div>
    </div>`
		}
  jQuery(".sidebar").html(`<h5 style="margin: 10px 0px 25px 0px; font-weight: 600; font-size: 27px; text-align: center;">Power+</h5>
` + streamDom + `
   <div style="display: none;" onclick="dtps.selectedClass = 'announcements';" class="class">
    <div class="name" id="annLabel">Announcements ` + unreadAnn + `</div>
    <div class="grade"><i class="material-icons">announcement</i></div>
    </div>
    <div class="classDivider"></div>
  ` + dtps.classlist.join(""));
  if (dtps.selectedClass !== "dash") $(".class." + dtps.selectedClass).addClass("active");
  if ($(".btn.pages").hasClass("active")) { $(".btn.pages").removeClass("active"); $(".btn.stream").addClass("active"); dtps.classStream(dtps.selectedClass); dtps.selectedContent = "stream"; }
  $( ".class:not(.google)" ).click(function(event) {
	  var prev =  window.getComputedStyle(document.getElementsByClassName("background")[0]).getPropertyValue("--grad")
	  $(".btn.google").hide();
	  $(".background").css("background", prev)
		  $(".background").addClass("trans");
		  clearTimeout(dtps.bgTimeout);
		  bgTimeout = setTimeout(function() {
		  var next =  window.getComputedStyle(document.getElementsByClassName("background")[0]).getPropertyValue("--grad")
		  $(".background").css("background", next)
		  $(".background").removeClass("trans");
		  }, 500);
	  $(".background").removeClass(jQuery.grep($(".background").attr("class").split(" "), function (item, index) {
      return item.trim().match(/^filter_/);
    })[0]);
	  $(".header").removeClass(jQuery.grep($(".header").attr("class").split(" "), function (item, index) {
      return item.trim().match(/^filter_/);
    })[0]);
	  if (dtps.classes[dtps.selectedClass]) { if (dtps.classes[dtps.selectedClass].google) { $(".btn.google").show(); }; $(".background").addClass(dtps.classes[dtps.selectedClass].col); $(".header").addClass(dtps.classes[dtps.selectedClass].col) }
    $(this).siblings().removeClass("active")
    $(this).addClass("active")
    $(".header h1").html($(this).children(".name").text())
    if (!dtps.classes[dtps.selectedClass]) {
      $(".header .btns").hide();
      if (dtps.selectedClass == "dash") $(".header .btns.master").show();
    } else {
      $(".header .btns:not(.master)").show();
      $(".header .btns.master").hide();
    }
    if ((dtps.selectedContent == "stream") && (dtps.classes[dtps.selectedClass])) dtps.classStream(dtps.selectedClass)
    if ((dtps.selectedContent == "grades") && (dtps.classes[dtps.selectedClass])) dtps.gradebook(dtps.selectedClass)
    if (dtps.selectedClass == "dash") dtps.masterStream(true);
    if (dtps.selectedClass == "announcements") dtps.announcements();
    if (dtps.classes[dtps.selectedClass]) { if (dtps.classes[dtps.selectedClass].weights) { if (dtps.classes[dtps.selectedClass].weights.length) { $(".btns .btn.grades").show(); } else { $(".btns .btn.grades").hide(); } } else { $(".btns .btn.grades").hide(); } }
  });
}
}
dtps.googleStream = function() {
	function googleStream(i) {
		if (dtps.classes[i].google) {
	jQuery.getJSON("https://classroom.googleapis.com/v1/courses/" + dtps.classes[i].google.id + "/courseWork" + dtps.classroomAuth, function(resp) {
		dtps.classes[i].google.stream = [];
		for (var ii = 0; ii < resp.courseWork.length; ii++) {
			var due = new Date();
			due.setMonth(resp.courseWork[ii].month)
			due.setFullYear(resp.courseWork[ii].year)
			due.setDay(resp.courseWork[ii].day)
			dtps.classes[i].google.stream.push({
				title: resp.courseWork[ii].title,
				due: due.toHumanString(),
				dueDate: due.toISOString(),
				class: i,
				subject: dtps.classes[i].subject,
				turnedIn: false
			})
		}
		if (i < dtps.classes[i].length) googleStream(i + 1);
	});
		}
	}
	googleStream(0);
}
dtps.googleAuth = function() {
	window.alert("EXPERIMENTAL FEATURE\n Your name and email will be logged in the Power+ database if you continute. Do not send feedback or bug reports about this feature yet.")
	firebase.auth().signInWithPopup(dtps.authProvider).then(function(result) {
  var token = result.credential.accessToken;
  var user = result.user;
  dtps.classroomAuth = "?access_token=" + token;
  console.log(result);
  jQuery.getJSON("https://classroom.googleapis.com/v1/courses" + dtps.classroomAuth, function(resp) {
	  dtps.googleClasses = resp.courses;
	  function editDistance(s1, s2) {
      s1 = s1.toLowerCase();
      s2 = s2.toLowerCase();

      var costs = new Array();
      for (var i = 0; i <= s1.length; i++) {
        var lastValue = i;
        for (var j = 0; j <= s2.length; j++) {
          if (i == 0)
            costs[j] = j;
          else {
            if (j > 0) {
              var newValue = costs[j - 1];
              if (s1.charAt(i - 1) != s2.charAt(j - 1))
                newValue = Math.min(Math.min(newValue, lastValue),
                  costs[j]) + 1;
              costs[j - 1] = lastValue;
              lastValue = newValue;
            }
          }
        }
        if (i > 0)
          costs[s2.length] = lastValue;
      }
      return costs[s2.length];
    }
	  function similarity(s1, s2) {
      var longer = s1;
      var shorter = s2;
      if (s1.length < s2.length) {
        longer = s2;
        shorter = s1;
      }
      var longerLength = longer.length;
      if (longerLength == 0) {
        return 1.0;
      }
      return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
    }
	  for (var i = 0; i < dtps.googleClasses.length; i++) {
		  var highest = {stat: 0, class: null};
		  for (var ii = 0; ii < dtps.classes.length; ii++) {
			  var stat = similarity(dtps.googleClasses[i].name, dtps.classes[ii].subject)
			  if ((stat > highest.stat) && (stat > 0.2)) highest = {stat: stat, class: ii}
		  }
		  if (highest.class !== null) {
		  dtps.classes[highest.class].google = dtps.googleClasses[i]
		  }
	  }
	  dtps.showClasses(true);
	  dtps.googleStream();
  });
})
}
dtps.render = function() {
  document.title = "Power+" + dtps.trackSuffix
  $ = jQuery;
  if (!dtps.showChangelog) jQuery.getScript('https://dtps.js.org/fluid.js');
  dtps.selectedClass = "dash";
  dtps.selectedContent = "stream";
  dtps.masterContent = "dash";
	var relDom = "";
	if (dtps.trackSuffix !== "") {
	   relDom = dtps.readableVer.replace(dtps.trackSuffix, `<div style="display:inline-block;" class="beta badge notice">` + dtps.trackSuffix.replace(" (", "").replace(")", "") + `</div>`);
	    } else {
		  relDom = dtps.readableVer;
	    }
  jQuery("body").html(`
    <div class="sidebar">
    </div>
    <div class="background trans"></div>
<div class="header">
    <h1 id="headText">Dashboard</h1>
    <div style="display: none;" class="btns row">
    <button onclick="dtps.selectedContent = 'stream'; dtps.classStream(dtps.selectedClass);" class="btn active stream">
    <i class="material-icons">view_stream</i>
    Stream
    </button>
    <button onclick="dtps.selectedContent = 'google'; window.open(dtps.classes[dtps.selectedClass].google.alternateLink)" class="btn google">
    <i class="material-icons">experiment</i>
    google_logo Classroom
    </button>
    <button onclick="dtps.selectedContent = 'pages'; dtps.loadPages(dtps.selectedClass);" class="btn pages">
    <i class="material-icons">list</i>
    Pages
    </button>
    <button onclick="dtps.selectedContent = 'grades'; dtps.gradebook(dtps.selectedClass);" class="btn grades">
    <i class="material-icons">book</i>
    Gradebook
    </button>
    <button onclick="alert('The grade editor is just for fun. Does not change your actual grade. For Power+ testers only. Do not abuse this.'); dtps.classes[dtps.selectedClass].letter = prompt('Enter a letter grade'); dtps.classes[dtps.selectedClass].grade = prompt('Enter a percentage number(i.e. 98)');dtps.showClasses(true);" class="btn sudo gradeEditor" style="display: none;">
    <i class="material-icons">edit</i>
    Grade Editor
    </button>
    </div>
<div class="btns row master sudo">
    <button onclick="dtps.masterContent = 'dash'; dtps.masterStream(true);" class="btn dash active">
    <i class="material-icons">dashboard</i>
    Overview
    </button>
    <button onclick="dtps.masterContent = 'assignments'; dtps.masterStream(true);" class="btn assignments">
    <i class="material-icons">assignment</i>
    Assignments
    </button>
    <button onclick="dtps.masterContent = 'ann'; dtps.masterStream(true);" class="btn ann">
    <i class="material-icons">announcement</i>
    Announcements
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
    <div style="width: calc(80%);border-radius: 30px;" class="card focus close abt">
<i onclick="fluid.cards.close('.card.abt')" class="material-icons close">close</i>
    <h3>About</h3>
    <h5>Power+ ` + relDom + `</h5>
    Logged in as ` + dtps.user.first_name + ` ` + dtps.user.last_name + ` (` + dtps.user.login + `)
<div style="display:inline-block;" class="beta badge notice sudo">tester&nbsp;<i style="vertical-align: middle;" class="material-icons sudo">experiment</i></div>
<div style="display:inline-block;" class="beta badge notice contributor">contributor&nbsp;<i style="vertical-align: middle;" class="material-icons contributor">group</i></div>
<div style="display:inline-block;" class="beta badge notice og">OG&nbsp;<i style="vertical-align: middle;" class="material-icons og">star</i></div>
<div style="display:inline-block;" class="beta badge notice dev">developer&nbsp;<i style="vertical-align: middle;" class="material-icons dev">code</i></div>
    <p>Made by <a href="https://github.com/jottocraft">jottocraft</a></p>
    <br />
    <div class="btns row themeSelector"></div>
<br /><br />
<div onclick="jQuery('body').toggleClass('hidegrades')" class="switch"><span class="head"></span></div>
    <div class="label"><i class="material-icons">visibility_off</i> Hide class grades</div>
    <br /><br />
<div onclick="if (dtps.showLetters) {dtps.showLetters = false;} else {dtps.showLetters = true;}" class="switch sudo"><span class="head"></span></div>
    <div class="label sudo"><i class="material-icons">experiment</i> Show letter grades instead of points earned</div>
<br /><br />
<div onclick="$('.gradeEditor').toggle();" class="switch sudo"><span class="head"></span></div>
    <div class="label sudo"><i class="material-icons">edit</i> Show grade editor</div>
    <br /><br />
    <button onclick="dtps.changelog();" style="display:none;" class="btn changelog"><i class="material-icons">update</i>Changelog</button>
    <button onclick="dtps.googleAuth();" class="btn sudo"><i class="material-icons">experiment</i>Link google_logo Classroom</button>
    </div>
    <div class="items">
    <h4>` + dtps.user.first_name + ` ` + dtps.user.last_name + `</h4>
    <i onclick="fluid.modal('.abt')" class="material-icons">info_outline</i>
    <i onclick="fluid.modal('.console')" class="material-icons dev">code</i>
    <i onclick="window.open('https://github.com/jottocraft/dtps/issues/new/choose')" class="material-icons">feedback</i>
    </div>
<div  style="width: calc(80%);border-radius: 30px;" class="card focus changelog close">
<i onclick="fluid.cards.close('.card.changelog')" class="material-icons close">close</i>
<h3>What's new in Power+</h3>
<h5>There was an error loading the changelog. Try again later.</h5>
</div>
<div  style="width: calc(80%);border-radius: 30px;" class="card focus console close">
<i onclick="fluid.cards.close('.card.console')" class="material-icons close">close</i>
<h3>dtps.log</h3>
<span class="log">
</span>
</div>
<div  style="width: calc(80%);border-radius: 30px;" class="card focus script close">
<i onclick="fluid.cards.close('.card.script')" class="material-icons close">close</i>
<h3>Update your DTPS bookmark</h3>
<p>It looks like you're using an outdated or invalid version of the Power+ bookmark. While this may work for now, you may run into some issues in the future. Right click the bookmark, select "Edit", and replace the URL with the <a href="https://dtps.js.org/bookmark.txt">latest script</a>.</p>
</div>
<div  style="width: calc(80%);border-radius: 30px;" class="card focus details close">
<i onclick="fluid.cards.close('.card.details')" class="material-icons close">close</i>
<p>An error occured</p>
</div>
  `);
	 jQuery.getScript("https://cdn.rawgit.com/showdownjs/showdown/1.8.6/dist/showdown.min.js", function() {
	  markdown = new showdown.Converter();
		 jQuery.getJSON("https://api.github.com/repos/jottocraft/dtps/releases", function(data) {
		  jQuery(".card.changelog").html(`<i onclick="fluid.cards.close('.card.changelog')" class="material-icons close">close</i>` + markdown.makeHtml(data[0].body));
			 if (data[0].tag_name == dtps.readableVer.replace(dtps.trackSuffix, "")) {
				 localStorage.setItem('dtps', dtps.ver);
			if (dtps.showChangelog) dtps.changelog();
		 }
			 if (dtps.updateScript) { fluid.cards.close(".card.focus"); fluid.modal(".card.script"); }
			 $(".btn.changelog").show();
        });
  });	
	
	var prev =  window.getComputedStyle(document.getElementsByClassName("background")[0]).getPropertyValue("--grad")
	  $(".background").css("background", prev)
  dtps.showClasses();
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
  jQuery("<link/>", {
    rel: "stylesheet",
    type: "text/css",
    href: "https://dtps.js.org/dev.css"
  }).appendTo("head");
  jQuery("<link/>", {
    rel: "stylesheet",
    type: "text/css",
    href: "https://fonts.googleapis.com/icon?family=Material+Icons+Extended"
  }).appendTo("head");
  jQuery('.classContent').bind('heightChange', function(){
   	jQuery(".sidebar").css("height", Number(jQuery(".classContent").css("height").slice(0,-2)))
    });
  fluid.init();
}
dtps.init();
