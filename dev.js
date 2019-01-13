var dtps = {
  ver: 150,
  readableVer: "v1.5.0 (dev)",
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
<p>Things to keep in mind when using Power+</p>
<li>Power+ can't fully replace PowerSchool yet. Many PowerSchool features are not included in Power+.</li>
<li>To use Power+, you have to visit PowerSchool, then run the bookmark script. You can choose stop using Power+ at any time by not using the bookmark script.</li>
<li>Report bugs and send feedback by clicking the feedback button at the top right corner.</li>
<li><b>Power+` + dtps.trackSuffix + ` may have bugs that cause it to display an inaccurate representation of your grades and assignments. Use Power+` + dtps.trackSuffix + ` at your own risk.</b></li>
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
  fluidThemes = [ "midnight", "nitro", "aquatic", "rainbow" ];
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
  dtps.user.prof = jQuery(".avatar_circle.avatar-img").attr("src")
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
	jQuery.getScript("https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.4.0/Chart.min.js")
	jQuery.getScript("https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.22.2/moment.min.js", function() {
		jQuery.getScript("https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/3.9.0/fullcalendar.min.js")
	})
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
      jQuery.getScript('https://dtps.js.org/fluid.js');
	    dtps.shouldRender = true;
      dtps.alert("Loading...", "Updating to Power+ " + dtps.readableVer);
    } else {
	  if (!Number(HaikuContext.user.login)) {
		  dtps.shouldRender = false;
    dtps.alert("Unsupported Account", "Power+ only works on student accounts");
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
	  dtps.webReq("psGET", "/" + loc[1] + "/" + loc[2] + "/assignment?page=1");
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
  var allData = [];
  var total = null;
 function call(pag) {
  dtps.webReq("psGET", "/" + dtps.classes[num].loc + "/assignment?page=" + pag, function(resp) {
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
    	    if (id != -1) {
      	    dtps.classes[num].stream[id].grade = jQuery(data[i]).children("td:nth-child(4)").text().replace(/\s/g, "");
      	    dtps.classes[num].stream[id].letter = jQuery(data[i]).children("td:nth-child(6)").text().replace(/\s/g, "");
            if (prevWeight !== -1) dtps.classes[num].stream[id].weight = dtps.classes[num].weights[prevWeight].weight;
		    if ("ABC".includes(dtps.classes[num].stream[id].letter.toArray()[0])) {
  			var earnedTmp = dtps.classes[num].stream[id].grade.split("/")[0];
	    } else {
    		var earnedTmp = dtps.classes[num].stream[id].letter;
    	}
	    if (prevWeight !== -1) dtps.classes[num].weights[prevWeight].assignments.push(dtps.classes[num].stream[id].title + ": " + earnedTmp + "/" + dtps.classes[num].stream[id].grade.split("/")[1]);
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
	    var wFormat = "";
	    if (stream[i].weight) wFormat = stream[i].weight.replace(/ *\([^)]*\) */g, "");
	    if (wFormat == "undefined") { wFormat = "" } else { wFormat = `<span class="weighted">` + wFormat + `</span>`} ;
	    var onclick = `dtps.assignment(` + stream[i].id + `, ` + stream[i].class + `)`
	    if (stream[i].google) {
	    var onclick = `window.open('` + stream[i].url + `')`
	    }
		  streamlist.push(`
        <div onclick="` + onclick + `" class="card graded assignment ` + stream[i].col + `">
        <div class="points">
        <div class="earned numbers">` + earnedTmp + `</div>
	<div class="earned letters">` + stream[i].letter + `</div>
        <div class="total possible">/` + stream[i].grade.split("/")[1] + `</div>
	<div class="total percentage">` + ((Number(stream[i].grade.split("/")[0]) / Number(stream[i].grade.split("/")[1])) * 100) + `%</div>
        </div>
        <h4>` + stream[i].title + `</h4>
      	<h5>` + due + ` ` + wFormat + turnInDom + `</h5>
        </div>
      `);
    } else {
      streamlist.push(`
        <div onclick="dtps.assignment(` + stream[i].id + `, ` + stream[i].class + `)" class="card assignment ` + stream[i].col + `">
        <h4>` + stream[i].title + `</h4>
	       <h5>` + due + turnInDom +  `</h5>
         </div>
       `);
    }
  }
	if (searchRes == undefined) {
 dtps.latestStream = stream;
 dtps.fuse = new Fuse(stream,  {
  shouldSort: true,
  threshold: 0.6,
  keys: [ "title", "id", "due", "subject" ]
});
	searchRes = "";
}
  return `<div style="text-align: right;"><input value="` + searchRes + `" onchange="dtps.search()" class="search" placeholder="Search assignments" type="text" /></div>` + streamlist.join("");
  //return streamlist.join("");
}
dtps.search = function() {
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
dtps.masterStream = function(doneLoading) {
  dtps.showClasses();
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
	} else {
		dtps.logGrades();
	}
	var gradeTrendDom = ""
	if ((window.localStorage.dtpsGradeTrend !== "false") && (window.localStorage.dtpsGradeTrend !== undefined)) {
	if (Object.keys(JSON.parse(window.localStorage.dtpsGradeTrend)).length > 2) {
	     gradeTrendDom = `<div class="card" style="padding: 5px;margin:25px;margin-right:0px;width: 100%;"><canvas id="gradeTrendChart"></canvas></div>`
	    } else {
	 gradeTrendDom = `<div onclick="fluid.modal('.card.trend')" class="card" style="margin:25px; margin-right:0px;background-color: #7b7b7b;color: white;padding: 10px 20px;cursor: pointer;"><i class="material-icons" style="margin-right: 10px;font-size: 32px;display: inline-block;vertical-align: middle;">timeline</i><h5 style="display: inline-block;vertical-align: middle;margin-right: 5px;">Not enough data</h5></div>`
	    }
	}
	if ((dtps.selectedClass == "dash") && (dtps.masterContent == "assignments")) {
		jQuery(".classContent").html(`
<div class="dash cal" style="width: 40%;display: inline-block; vertical-align: top;">
<div id="calendar" class="card" style="width: 100%;margin: 25px;">
</div>
` + gradeTrendDom + `
</div>
<div style="width: 59%; display: inline-block;" class="dash stream">
</div>
`)
		if ((window.localStorage.dtpsGradeTrend !== "false") && (window.localStorage.dtpsGradeTrend !== undefined)) {
	if (Object.keys(JSON.parse(window.localStorage.dtpsGradeTrend)).length > 2) {
		var gradeData = JSON.parse(window.localStorage.dtpsGradeTrend)
		var dataSets = [];
		for (var ii = 0; ii < dtps.classes.length; ii++) {
		var dataPoints = [];
		for (var i = 0; i < Object.keys(gradeData).length; i++) dataPoints.push(Number(gradeData[Object.keys(gradeData)[i]][dtps.classes[ii].id]))
		var ctx = document.getElementById('gradeTrendChart').getContext('2d');
		var styles = window.getComputedStyle($(".class." + ii)[0]); 
		dataSets.push({ label: dtps.classes[ii].subject, borderColor: styles.getPropertyValue('--light'), data: dataPoints})
		}
		
var chart = new Chart(ctx, { type: 'line', data: { labels: Object.keys(gradeData),
        datasets: dataSets.sort(function(a, b){
    var keyA = a.data[a.data.length - 1],
    keyB = b.data[b.data.length - 1];
    // Compare the 2 dates
    if(keyA < keyB) return -1;
    if(keyA > keyB) return 1;
    return 0;
  })
    },  options: {}
});
	}
		}
		
		dtps.announcements();
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
	}
	$(".card.assignment").addClass("color");
	dtps.calendar(doneLoading);
}
dtps.gapis = function() {
	jQuery.getScript("https://apis.google.com/js/api.js", function() {
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
		var sidebarTmp = [];
		var DVs = 0;
	for (var i = 0; i < dtps.classes[num].weights.length; i++) {
		var assignTmp = [];
		for (var ii = 0; ii < dtps.classes[num].weights[i].assignments.length; ii++) {
			assignTmp.push(`<p>` + dtps.classes[num].weights[i].assignments[ii] + `</p>`)
			if (!((dtps.classes[num].weights[i].weight.includes("Success")) || (dtps.classes[num].weights[i].weight.includes("SS")))) {
				var parts = dtps.classes[num].weights[i].assignments[ii].split(":");		
				if (parts[parts.length - 1].includes("DV")) DVs++;
				if (parts[parts.length - 1].includes("M")) DVs++;
				if (parts[parts.length - 1].includes("INC")) DVs++;
			}
		}
		dtps.classes[num].weights[i].icon = "";
		if (dtps.classes[num].weights[i].weight.includes("Success") || dtps.classes[num].weights[i].weight.includes("SS")) dtps.classes[num].weights[i].icon = `<i class="material-icons">star_border</i> `
	        if (dtps.classes[num].weights[i].weight.includes("Comprehension") || dtps.classes[num].weights[i].weight.includes("CC")) dtps.classes[num].weights[i].icon = `<i class="material-icons">done</i> `
		if (dtps.classes[num].weights[i].weight.includes("Performance") || dtps.classes[num].weights[i].weight.includes("PT"))dtps.classes[num].weights[i].icon = `<i class="material-icons">assessment</i> `
		weightsTmp.push(`<div style="display: none;" class="weight ` + i + `"><h4>` + dtps.classes[num].weights[i].weight + `</h4>` + assignTmp.join("") + `</div>` );
		sidebarTmp.push(`<div onclick="$('.sidenav .item').removeClass('active'); $(this).addClass('active'); $('.weight').hide(); $('.weight.` + i + `').show();" class="item">
       ` + dtps.classes[num].weights[i].icon + dtps.classes[num].weights[i].weight.replace("Comprehension Check", "CC").replace("Success Skills", "SS").replace("Performance Task", "PT") + `
    </div>`);
	}
	var headsUp = `<div class="card" style="background-color: #3cc15b;color: white;padding: 10px 20px;"><i class="material-icons" style="margin-right: 10px;font-size: 32px;display: inline-block;vertical-align: middle;">check_circle_outline</i><h5 style="display: inline-block;vertical-align: middle;margin-right: 5px;">On track to pass&nbsp;&nbsp;<span style="font-size: 18px;">Power+ didn't detect any DVs in any of your CCs or PTs</span></h5></div>`
	if (DVs > 0) {
        var headsUp = `<div class="card" style="background-color: #c14d3c;color: white;padding: 10px 20px;"><i class="material-icons" style="margin-right: 10px;font-size: 32px;display: inline-block;vertical-align: middle;">cancel</i><h5 style="display: inline-block;vertical-align: middle;margin-right: 5px;">You're at risk of failing this class&nbsp;&nbsp;<span style="font-size: 18px;">Power+ detected ` + DVs + ` DV(s) in your CCs/PTs</span></h5></div>`
	}
	var gradeTrendDom = `<div onclick="fluid.modal('.card.trend')" class="card" style="background-color: #3c8ac1;color: white;padding: 10px 20px;cursor: pointer;"><i class="material-icons" style="margin-right: 10px;font-size: 32px;display: inline-block;vertical-align: middle;">timeline</i><h5 style="display: inline-block;vertical-align: middle;margin-right: 5px;">Grade trend&nbsp;&nbsp;<span style="font-size: 18px;">Keep track of your grades over time with grade trend. Click to learn more.</span></h5></div>`
	if ((window.localStorage.dtpsGradeTrend !== "false") && (window.localStorage.dtpsGradeTrend !== undefined)) {
	if (Object.keys(JSON.parse(window.localStorage.dtpsGradeTrend)).length > 2) {
	    var gradeTrendDom = `<div class="card" style="padding: 5px;"><canvas id="gradeTrendChart"></canvas></div>`
	    } else {
	var gradeTrendDom = `<div onclick="fluid.modal('.card.trend')" class="card" style="background-color: #7b7b7b;color: white;padding: 10px 20px;cursor: pointer;"><i class="material-icons" style="margin-right: 10px;font-size: 32px;display: inline-block;vertical-align: middle;">timeline</i><h5 style="display: inline-block;vertical-align: middle;margin-right: 5px;">Not enough data&nbsp;&nbsp;<span style="font-size: 18px;">Power+ doesn't have enough grade data to show a graph yet</span></h5></div>`
	    }
	}
	jQuery(".classContent").html(headsUp + gradeTrendDom + `
<div style="height: 700px;" class="card withnav">
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
		if ((window.localStorage.dtpsGradeTrend !== "false") && (window.localStorage.dtpsGradeTrend !== undefined)) {
	if (Object.keys(JSON.parse(window.localStorage.dtpsGradeTrend)).length > 2) {
		var gradeData = JSON.parse(window.localStorage.dtpsGradeTrend)
		var dataPoints = [];
		for (var i = 0; i < Object.keys(gradeData).length; i++) dataPoints.push(Number(gradeData[Object.keys(gradeData)[i]][dtps.classes[num].id]))
		var ctx = document.getElementById('gradeTrendChart').getContext('2d');
		var styles = window.getComputedStyle($(".class." + num)[0]); 
var chart = new Chart(ctx, { type: 'line', data: { labels: Object.keys(gradeData),
       datasets: [{ label: "Grade trend", backgroundColor: styles.getPropertyValue('--norm'), borderColor: styles.getPropertyValue('--light'), data: dataPoints}]
    },  options: {}
});
	}
		}
	    } else {
	$(".btns .btn.grades").hide();
        $(".btns .btn").removeClass("active");
        $(".btns .btn.stream").addClass("active");
        dtps.selectedContent = "stream";
        dtps.classStream(num);
}
	}
}
dtps.assignment = function(id, classNum) {
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
	dtps.webReq("assignGET", "/" + assignment.loc + "/assignment/view/" + assignment.id, function(data) {
	var dom = jQuery("<div />", {html: data});
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
	dom.children("div").siblings("table").before(`<br /><div class="list">` + list.join("") + `</div><br /><br />`)
	  $(".card.details").html(`<i onclick="fluid.cards.close('.card.details')" class="material-icons close">close</i>` + dom.html() + `
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
	dtps.webReq("letPOST", "/u/" + dtps.user.login + "/portal/portlet_annc", function(resp) {
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
					subject = `<div class="label">` + dtps.classes[psClass].subject + `</div>`;
				}
			announcements.push(`<div onclick="$(this).toggleClass('open');" style="margin: 25px; margin-right: 0px; width: 100%;cursor: pointer;" class="announcement card color ` + col + `">
` + subject + jQuery(jQuery(ann[i]).children("td")[1]).children(".annc-with-images").html() + `
</div>
`);
		}
		}
		if ((dtps.selectedClass == "dash") && (dtps.masterContent == "assignments")) {
  jQuery(".dash.cal").append("<br />" + announcements.join("")); }
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
		    var styles = window.getComputedStyle($(".class." + i)[0]);
		    calEvents.push({
		  title: dtps.classes[i].stream[ii].title,
		  start: dtps.classes[i].stream[ii].dueDate,
		  allDay: false,
	          color: styles.getPropertyValue('--norm'),
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
dtps.clearData = function() {
if (window.confirm("Clearing Power+ data will clear all local user data stored by Power+. This should be done if it is a new semester / school year or if you are having issues with Power+. Are you sure you want to clear all your Power+ data?")) {
 window.localStorage.clear()
 window.alert("Power+ data cleared. Reload the page to begin repopulating your userdata.")
}
}
dtps.showClasses = function(override) {
  var streamClass = "active"
  if (dtps.selectedClass !== "dash") var streamClass = "";
	dtps.classlist = [];
	var unreadAnn = "";
	if (dtps.unreadAnn) unreadAnn = "&nbsp;&nsbp;(" + dtps.unreadAnn + ")";
	if (window.localStorage.dtpsClassOrder !== undefined) {
		var classOrder = JSON.parse(window.localStorage.dtpsClassOrder)
		for (var i = 0; i < classOrder.length; i++) {
		var num = 0;
		for (var ii = 0; ii < dtps.classes.length; ii++) {
			if (dtps.classes[ii].id == classOrder[i]) { var num = ii; }
		}
    dtps.classlist.push(`
      <div onclick="dtps.selectedClass = ` + num + `" class="class ` + num + ` ` + dtps.classes[num].col + `">
      <div class="name">` + dtps.classes[num].subject + `</div>
      <div class="grade val"><span class="letter">` + dtps.classes[num].letter + `</span><span class="points">` + dtps.classes[num].grade + `%</span></div>
      </div>
    `);
  }
	} else {
  for (var i = 0; i < dtps.classes.length; i++) {
    dtps.classlist.push(`
      <div onclick="dtps.selectedClass = ` + i + `" class="class ` + i + ` ` + dtps.classes[i].col + `">
      <div class="name">` + dtps.classes[i].subject + `</div>
      <div class="grade val"><span class="letter">` + dtps.classes[i].letter + `</span><span class="points">` + dtps.classes[i].grade + `%</span></div>
      </div>
    `);
  }
	}
	var googleClassDom = ""
		if (dtps.isolatedGoogleClasses) {
		dtps.classlist.push(`<div class="classDivider"></div>`)
		for (var i = 0; i < dtps.isolatedGoogleClasses.length; i++) {
		dtps.classlist.push(`<div onclick="$('.sidebar .class').removeClass('active'); $(this).addClass('active'); $('body').addClass('isolatedGoogleClass'); dtps.selectedClass = 'isolatedGoogleClass'; $('.classContent').html(dtps.renderStream(dtps.googleClasses[`  + dtps.isolatedGoogleClasses[i] +`].stream)); $('#headText').html('` + dtps.googleClasses[dtps.isolatedGoogleClasses[i]].name + `')" class="class google ` + dtps.googleClasses[dtps.isolatedGoogleClasses[i]] + `">
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
   <div style="display: none;" onclick="dtps.selectedClass = 'announcements';" class="class">
    <div class="name" id="annLabel">Announcements ` + unreadAnn + `</div>
    <div class="grade"><i class="material-icons">announcement</i></div>
    </div>
    <div class="classDivider"></div>
  ` + dtps.classlist.join(""));
  if (dtps.selectedClass !== "dash") $(".class." + dtps.selectedClass).addClass("active");
  if ($(".btn.pages").hasClass("active")) { $(".btn.pages").removeClass("active"); $(".btn.stream").addClass("active"); dtps.classStream(dtps.selectedClass); dtps.selectedContent = "stream"; }
  $( ".class:not(.google)" ).click(function(event) {
	  $('body').removeClass('isolatedGoogleClass');
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
}
dtps.saveClassOrder = function() {
$(".sidebar").sortable("destroy");
var classes = $(".sidebar").children(".class")
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
dtps.googleStream = function() {
	function googleStream(i) {
		if (dtps.googleClasses[i]) {
	gapi.client.classroom.courses.courseWork.list({ courseId: dtps.googleClasses[i].id }).then(function(resp) {
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
				url: resp.result.courseWork[ii].alternateLink,
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
dtps.googleAuth = function() {
  dtps.user.google = gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile();
  $(".items img").attr("src", dtps.user.google.getImageUrl())
	gapi.client.classroom.courses.list({ pageSize: 10 }).then(function(resp) {
	  dtps.googleClasses = resp.result.courses;
	  for (var i = 0; i < dtps.googleClasses.length; i++) {
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
	  dtps.isolatedGoogleClasses = [];
	  var isolatedDom = [];
	  for (var i = 0; i < dtps.googleClasses.length; i++) { if (dtps.googleClasses[i].psClass == undefined) {
		  dtps.isolatedGoogleClasses.push(i) 
		  isolatedDom.push(`<br /><br />
    <div onclick="window.alert('coming soon')" class="switch sudo"><span class="head"></span></div>
    <div class="label sudo">` +  dtps.googleClasses[i].name + `</div>`)
	  } }
	$(".isolatedGClassList").html(isolatedDom.join("").slice(12));
	  dtps.showClasses(true);
	  dtps.googleStream();
		fluid.init();
  });
}
dtps.logGrades = function() {
	if ((window.localStorage.dtpsGradeTrend !== "false") && (window.localStorage.dtpsGradeTrend !== undefined)) {
		dtps.log("Grade trend enabled; checking grade data")
		var now = new Date();
		var start = new Date(now.getFullYear(), 0, 0);
		var diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
		var oneDay = 1000 * 60 * 60 * 24;
		var day = Math.floor(diff / oneDay);
		var gradeData = JSON.parse(window.localStorage.dtpsGradeTrend);
		if (!gradeData.day) {
			dtps.log("Grade trend enabled; check passed; storing grades for today")
			var gradesNow = {};
			for (var i = 0; i < dtps.classes.length; i++) {
				gradesNow[dtps.classes[i].id] = dtps.classes[i].grade
			}
			gradeData[day] = gradesNow;
			localStorage.setItem('dtpsGradeTrend', JSON.stringify(gradeData));
		}
	}
}
dtps.render = function() {
  document.title = "Power+" + dtps.trackSuffix
  $ = jQuery;
  var letterGradesClass = "";
  if (window.localStorage.dtpsLetterGrades == "true") { $("body").addClass("letterGrades"); letterGradesClass = " active"; }
  if (!dtps.showChangelog) jQuery.getScript('https://dtps.js.org/fluid.js');
  dtps.selectedClass = "dash";
  dtps.sorting = false;
  dtps.selectedContent = "stream";
  dtps.masterContent = "assignments";
	var trackDom = "";
	if (dtps.trackSuffix !== "") {
	   trackDom = `<div style="display:inline-block;font-size: 16px; padding: 3px 4px;" class="beta badge notice">` + dtps.trackSuffix.replace(" (", "").replace(")", "") + `</div>`
	    } else {
		  trackDom = ``;
	    }
	var verDom =  dtps.readableVer.replace(dtps.trackSuffix, "");
	if (dtps.trackSuffix !== "") {
	   verDom = `<div class="buildInfo" style="display: inline-block;font-size: 12px;cursor: pointer;"></div>`
	    } else {
		  verDom = dtps.readableVer.replace(dtps.trackSuffix, "");
	    }
	document.addEventListener('extensionData', function(e) {
   if (e.detail == "extensionInstalled") {
	        var extensionDom = "";
	   jQuery(".extensionDom").html(`<br />
<div id="extensionAutoLoad" onclick="$(this).toggleClass('active'); if (window.localStorage.disableAutoLoad == 'true') {localStorage.setItem('disableAutoLoad', false); jQuery('.extensionDevMode').show();} else {localStorage.setItem('disableAutoLoad', true); jQuery('.extensionDevMode').hide(); window.alert('To re-enable auto load, click on your profile picture at the top right corner of PowerSchool Learning and select the option to enable Power+')}" class="switch active"><span class="head"></span></div>
    <div class="label"><i class="material-icons">extension</i> Automatically load Power+</div>
<br /><br />
<div class="extensionDevMode switch" id="extensionDevMode" onclick="$(this).toggleClass('active'); if (window.localStorage.devAutoLoad == 'true') {localStorage.setItem('devAutoLoad', false);} else {localStorage.setItem('devAutoLoad', true);}"><span class="head"></span></div>
    <div class="extensionDevMode label"><i class="material-icons">extension</i> Load the dev (unstable) version of Power+</div>`)
	   jQuery(".extTab").show();
	   if (window.localStorage.disableAutoLoad == "true") { jQuery("#extensionAutoLoad").removeClass("active"); jQuery(".extensionDevMode").hide(); }
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
  <div class="sidenav">
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
    <div onclick="$('.abtpage').hide();$('.abtpage.debug').show();" class="item dev">
      <i class="material-icons">bug_report</i> Debugging
    </div>
    <div onclick="$('.abtpage').hide();$('.abtpage.about').show();" class="item">
      <i class="material-icons">info</i> About
    </div>
  </div>
  <div class="content">
<div class="abtpage display">
    <h5>Display</h5>
    <br />
    <p><b>Theme</b></p>
    <div class="btns row themeSelector"></div>
    <br /><br />
    <p><b>Grades</b></p>
    <div onclick="jQuery('body').toggleClass('hidegrades')" class="switch"><span class="head"></span></div>
    <div class="label"><i class="material-icons">visibility_off</i> Hide class grades</div>
    <br /><br />
    <div onclick="$('body').toggleClass('letterGrades'); localStorage.setItem('dtpsLetterGrades', $('body').hasClass('letterGrades'));" class="switch` + letterGradesClass + `"><span class="head"></span></div>
    <div class="label"><i class="material-icons">font_download</i> Display letter grades instead of points earned</div>
    <br /><br />
    <div onclick="window.alert('coming soon')" class="switch sudo"><span class="head"></span></div>
    <div class="label sudo"><i class="material-icons">experiment</i> Display full class names</div>
    <br /><br />
    <div onclick="$('.gradeEditor').toggle();" class="switch sudo"><span class="head"></span></div>
    <div class="label sudo"><i class="material-icons">edit</i> Show grade editor (Power+ testers only)</div>
</div>
<div style="display: none;" class="abtpage classes">
    <h5>Classes</h5>
    <button onclick="if (!dtps.sorting) { dtps.sorting = true; $('.sidebar').sortable(); window.alert('Drag and drop to reorder your classes. Click this button again when you are done.') } else { dtps.saveClassOrder(); }" class="btn"><i class="material-icons">sort</i>Sort classes</button>
    <br /><br />
<div class="googleClassroom">
    <h5>google_logo Classes</h5>
    <br />
    <button onclick="window.alert('On the page that opens, make sure your d.tech account is selected, then select Project DTPS, and click Remove Access'); window.open('https://myaccount.google.com/permissions');">Remove google_logo Classroom</button>
    <br />
    <p>Classes listed below could not be associated with a PowerSchool class. You can choose which classes to show in the sidebar.</p>
    <div class="isolatedGClassList"><p>Loading...</p></div>
</div>
<div class="googleSetup">
    <h5>google_logo Classroom</h5>
    <p>Link google_logo Classroom to see assignments and classes from both PowerSchool and Google.</p>
    <p>If Power+ thinks one of your PowerSchool classes also has a Google Classroom, it'll add a Google Classroom tab to that class. You can choose which extra classes to show in the sidebar.</p>
    <br />
    <button onclick="if (window.confirm('EXPERIMENTAL FEATURE: Google Classroom features are still in development. Continue at your own risk. Please leave feedback by clicking the feedback button at the top right corner of Power+.')) { dtps.googleSetup = true; dtps.webReq('psGET', 'https://dtechhs.learning.powerschool.com/do/account/logout', function() { gapi.auth2.getAuthInstance().signIn(); })}" class="btn sudo"><i class="material-icons">experiment</i>Link google_logo Classroom</button>
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
    <button onclick="window.alert('On the page that opens, make sure your d.tech account is selected, then click on Project DTPS, and click Remove Access'); window.open('https://myaccount.google.com/permissions')">Remove google_logo Classroom</button>
</div>
</div>
<div style="display: none;" class="abtpage debug">
<div class="dev">
    <h5>Debugging</h5>
</div>
</div>
<div style="display: none;" class="abtpage about">
    <h5>Power+ ` + dtps.readableVer + ` <div class="buildInfo" style="display: inline-block;margin: 0px 5px;font-size: 12px;cursor: pointer;"></div></h5>
    <p>Made by <a href="https://github.com/jottocraft">jottocraft</a></p>
<div style="display:inline-block;" class="beta badge notice sudo">tester&nbsp;<i style="vertical-align: middle;" class="material-icons sudo">bug_report</i></div>
<div style="display:inline-block;" class="beta badge notice contributor">contributor&nbsp;<i style="vertical-align: middle;" class="material-icons contributor">group</i></div>
<div style="display:inline-block;" class="beta badge notice og">OG&nbsp;<i style="vertical-align: middle;" class="material-icons og">star_border</i></div>
<div style="display:inline-block;" class="beta badge notice dev">developer&nbsp;<i style="vertical-align: middle;" class="material-icons dev">code</i></div>
<br /><br />
    <button onclick="dtps.changelog();" style="display:none;" class="btn changelog"><i class="material-icons">update</i>Changelog</button>
    <button onclick="dtps.clearData();" class="btn"><i class="material-icons">delete_outline</i>Reset Power+</button>
    <br /><br />
    <h5>Resources</h5>
    <ul>
<li><a href="mailto:jotto3053@gmail.com">Contact me</a></li>
<li><a href="https://dtps.js.org">Power+ website</a></li>
<li><a href="https://github.com/jottocraft/dtps">Source code on GitHub</a> (<a href="https://github.com/jottocraft/dtps/blob/master/LICENSE">license</a>)</li>
</ul>
    <br />
    <h5>Credits</h5>
<ul>
    <li>Calendar made with <a href="https://fullcalendar.io/">FullCalendar</a></li>
    <li>Grade trend graphs made with <a href="https://www.chartjs.org/">Chart.js</a></li>
    <li>Logo made with logomakr.com</li>
</ul>
<br />
<p>(c) 2018-2019 jottocraft (<a href="https://github.com/jottocraft/dtps/blob/master/LICENSE">license</a>)</p>
</div>
  </div>
</div>
    <div class="items">
    <h4>` + dtps.user.first_name + ` ` + dtps.user.last_name + `</h4>
    <img src="` + dtps.user.prof + `" style="width: 50px; height: 50px; margin: 0px 5px; border-radius: 50%; vertical-align: middle;" />
    <i onclick="window.open('https://github.com/jottocraft/dtps/issues/new/choose')" class="material-icons">feedback</i>
    <i onclick="fluid.modal('.console')" class="material-icons dev">code</i>
    <i onclick="document.dispatchEvent(new CustomEvent('extensionData', { detail: 'extensionStatus'})); fluid.modal('.abt-new')" class="material-icons">more_horiz</i>
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
<div  style="width: calc(80%);border-radius: 30px;" class="card focus trend close">
<i onclick="fluid.cards.close('.card.trend')" class="material-icons close">close</i>
<h3>Grade Trend</h3>
<p>Grade trend lets you keep track of your grades over time. When you enable grade trend, Power+ will store a copy of your class grades locally on your computer every day you use Power+. Then, when you click on the grades tab with grade trend enabled, Power+ will show you a graph of how your class grades have changed over time.</p>
<p>The grade trend setting applies to all classes. It may take a few days after enabling grade trend for the graph to appear.</p>
<p><b>You can always disable grade trend by clicking the turn off button on the grade trend graph. Disabling grade trend permanently erases all of your grade data off of your computer.</b></p>
<button onclick="localStorage.setItem('dtpsGradeTrend', JSON.stringify({})); window.alert('Grade trend enabled'); dtps.logGrades();" class="btn"><i class="material-icons">timeline</i> Enable grade trend</button><button onclick="fluid.cards.close('.card.trend')" class="btn"><i class="material-icons">cancel</i> Not now</button>
</div>
  `);
	var getURL = "https://api.github.com/repos/jottocraft/dtps/commits?path=init.js";
	if (dtps.trackSuffix !== "") var getURL = "https://api.github.com/repos/jottocraft/dtps/commits?path=dev.js";
	jQuery.getJSON(getURL, function(data) {
		jQuery(".buildInfo").html("build " + data[0].sha.substring(7,0));
		jQuery(".buildInfo").click(function() {
			window.open("https://github.com/jottocraft/dtps/commit/" + data[0].sha)
		});
	})
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
  jQuery('.classContent').bind('heightChange', function(){
   	jQuery(".sidebar").css("height", Number(jQuery(".classContent").css("height").slice(0,-2)))
    });
  fluid.init();
}
dtps.init();
