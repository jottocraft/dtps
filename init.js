var dtps = {
  ver: 030,
  readableVer: "v0.3.0 (beta)",
  trackSuffix: " (beta)",
  showLetters: false,
  pePDV: false
};
dtps.changelog = function () {
  fluid.cards.close(".card.focus")
  fluid.cards(".card.changelog");
};
dtps.log = function(msg) {
  console.log("[DTPS] " + msg);
  try { jQuery(".card.console .log").html(`<h5>[DTPS] ` + msg + `</h5>` + jQuery(".card.console .log").html()); } catch(e) {}
}
dtps.firstrun = function () {
  jQuery("body").append(`<div id="TB_overlay" style="position: fixed;">&nbsp;</div><div id="TB_window" role="dialog" aria-modal="true" aria-labelledby="TB_title" style="width: 800px; height: 540px;margin: 0 calc(50% - 400px); top: calc(50% - 290px);"><div id="TB_closeAjaxWindow" class="tb_title_bar" role="heading"><a href="javascript:;" onclick="TB_remove();" id="TB_closeWindowButton" aria-hidden="true"><i class="icon-close"></i></a><div id="TB_title" class="tb_title">Project DTPS</div><div id="TB_ajaxContent" role="main" style="width: 770px; height: 434px;">
<h2>Welcome to Project DTPS</h2>
<h4>` + dtps.readableVer + `</h4>
<li>Project DTPS is meant to be simple, so many PowerSchool features will be left out</li>
<li>All data used by Project DTPS, user data and prefrences, will never be stored anywhere except for locally on your computer in local storage (window.localStorage). Grades and other personal data will never be stored anywhere. Project DTPS uses Google Analytics to track how many people are using DTPS and does not log your ID or IP address.</li>
<li>Project DTPS only reads data from PowerSchool. Project DTPS will never edit, write, or delete data of any kind on your PowerSchool account</li>
<li>Project DTPS needs to be loaded with the bookmark script every time (unless using the chrome extension). You can always use PowerSchool as normal by reloading and not clicking the bookmark</li>
<li>Report bugs and send feedback by clicking the feedback button at the top right corner</li>
<li><b>Project DTPS may have bugs that cause it to display an inaccurate representation of your grades and assignments. Use Project DTPS at your own risk.</b></li>
</div><div id="TB_actionBar" style=""><span><input class="button button" onclick="ThickBox.close();" type="button" value="Cancel"><input class="button button" onclick="ThickBox.close(); localStorage.setItem('dtpsInstalled', 'true'); dtps.render();" type="button" value="Accept & Continue"></span>
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
  var sudoers = ["10837719", "10838212", "10894474", "10463823"]
  if (sudoers.includes(HaikuContext.user.login)) { jQuery("body").addClass("sudo"); dtps.log("Sudo mode enabled"); }
  var og = ["10894474", "10837719"]
  if (og.includes(HaikuContext.user.login)) { jQuery("body").addClass("og"); dtps.log("OG mode enabled!!!"); }
  var devs = ["10837719"]
  if (devs.includes(HaikuContext.user.login)) { jQuery("body").addClass("dev"); dtps.log("Dev mode enabled"); }
  dtps.shouldRender = false;
	dtps.first = false;
	dtps.showChangelog = false;
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
  gtag('js', new Date());
});
  if (window.location.host !== "dtechhs.learning.powerschool.com") {
    dtps.shouldRender = false;
    dtps.alert("Unsupported school", "Project DTPS only works at Design Tech High School");
  } else {
    if (Number(window.localStorage.dtps) < dtps.ver) {
      dtps.showChangelog = true;
	    //Load fluid JS modules early for changelogs
    $ = jQuery;
      jQuery.getScript('https://jottocraft.github.io/dtps/fluid.js');
	    dtps.shouldRender = true;
      dtps.alert("Loading...", "Updating to DTPS " + dtps.readableVer);
    } else {
	  if (!Number(HaikuContext.user.login)) {
		  dtps.shouldRender = false;
    dtps.alert("Unsupported Account", "Project DTPS only works on student accounts");
	      } else {
      dtps.shouldRender = true;
      dtps.alert("Loading...");
    }
    }

    if (window.localStorage.dtpsInstalled !== "true") {
      dtps.shouldRender = false;
	    dtps.first = true;
    }
  }
  localStorage.setItem('dtps', dtps.ver);
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
	  dtps.webReq("psGET", "https://dtechhs.learning.powerschool.com/" + loc[1] + "/" + loc[2] + "/assignment");
	  dtps.webReq("psGET", "https://dtechhs.learning.powerschool.com/" + loc[1] + "/" + loc[2] + "/cms_page/view");
	  dtps.webReq("psGET", "https://dtechhs.learning.powerschool.com/" + loc[1] + "/" + loc[2] + "/grades", function(resp, q) {
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
	    if (dtps.pePDV) { if (subject == "PE") {if (letterTmp !== "DV") { letterTmp = "P"; }} }
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
    }
    dtps.log("Grades loaded: ", dtps.classes)
    if (dtps.shouldRender) dtps.render();
    if (dtps.first) dtps.firstrun();
  });

}
dtps.checkReady = function(num) {
  //dtps.log(num + " reporting as READY total of " + dtps.classesReady);
  if ((dtps.selectedClass == "stream") && (dtps.classesReady == dtps.classes.length)) {
    dtps.log("All classes ready, loading master stream");
    dtps.masterStream(true);
  } else {
  if ((dtps.selectedClass == "stream") && (dtps.classesReady < dtps.classes.length)) {
	  dtps.masterStream();
  }
  }
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
    jQuery(".sidebar").html(`<div onclick="dtps.showClasses()" class="class">
      <div class="name">Classes</div>
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
	dtps.log("rendering stream for " + num)
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
      var due = "<h5>Due " + assignment.children("td:nth-child(3)").text().slice(0,-1) + "</h5>"
    	if (due.includes("n/a")) var due = "";
      dtps.classes[num].stream.push({
        id: assignment.find("a").attr("onclick").split("/")[5].replace("')", ""),
        title: assignment.children("td:nth-child(1)").text(),
        due: assignment.children("td:nth-child(3)").text().slice(0,-1),
    		col: dtps.classes[num].col
      });
      dtps.classes[num].streamitems.push(assignment.find("a").attr("onclick").split("/")[5].replace("')", ""));
        dtps.classes[num].streamlist.push(`
          <div class="card assignment">
          <div class="spinner points">
          <div class="bounce1"></div>
          <div class="bounce2"></div>
          <div class="bounce3"></div>
          </div>
          <h4>` + assignment.children("td:nth-child(1)").text() + `</h4>
          ` + due + `
          </div>
      `);
    }
    if (!renderOv) jQuery(".classContent").html(dtps.classes[num].streamlist.join(""));

    dtps.webReq("psGET", "https://dtechhs.learning.powerschool.com/" + dtps.classes[num].loc + "/grades", function(resp) {
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
		var due = "Due " + stream[i].due;
    	    if (due.includes("n/a")) var due = "";
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
        <div class="card graded assignment ` + stream[i].col + `">
        <div class="points">
        <div class="earned">` + earnedTmp + `</div>
        <div class="total">/` + stream[i].grade.split("/")[1] + `</div>
        </div>
        <h4>` + stream[i].title + `</h4>
      	<h5>` + due + ` <span class="weighted">` + wFormat + `</span></h5>
        </div>
      `);
    } else {
      streamlist.push(`
        <div class="card assignment ` + stream[i].col + `">
        <h4>` + stream[i].title + `</h4>
	       <h5>` + due + `</h5>
         </div>
       `);
    }
  }
  return streamlist.join("");
}
dtps.masterStream = function(doneLoading) {
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
	dtps.log(buffer)
	var loadingDom = "";
	if (!doneLoading) {
		loadingDom = `<div class="spinner">
    <div class="bounce1"></div>
    <div class="bounce2"></div>
    <div class="bounce3"></div>
    </div>`;
	}
	jQuery(".classContent").html(loadingDom + dtps.renderStream(buffer.sort(function(a, b){
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
	var spinnerTmp = true;
  dtps.webReq("psGET", "https://dtechhs.learning.powerschool.com/" + loc + "/cms_page/view/" + id, function(resp) {
    var newIDs = jQuery(resp).find(".cms_box").toArray();
	  if (spinnerTmp) { jQuery(".classContent").html(""); spinnerTmp = false; }
    for (var i = 0; i < newIDs.length; i++) {
	var newID = jQuery(newIDs[i]).attr("id").split("_")[1];
    dtps.webReq("psPOST", "https://dtechhs.learning.powerschool.com/" + loc + "/cms_box/render_content/" + newID, function(resp, q) {
       jQuery(".classContent").html(jQuery(".classContent").html() + `
        <div class="card">
       <h4>` + q.title + `</h4>
        ` + resp + `
        </div>
      `)
    }, {title: jQuery(newIDs[i]).children(".head").text()});
    }
  });
}
dtps.gradebook = function(num) {
	dtps.showClasses();
	if (dtps.classes[num].weights.length) {
		$(".btns .btn.grades").show();
		var weightsTmp = [];
	for (var i = 0; i < dtps.classes[num].weights.length; i++) {
		var assignTmp = [];
		for (var ii = 0; ii < dtps.classes[num].weights[i].assignments.length; ii++) {
			assignTmp.push(`<p class="sudo"><i class="material-icons">experiment</i> ` + dtps.classes[num].weights[i].assignments[ii] + `</p>`)
		}
		weightsTmp.push(`<div style="height: ` + dtps.classes[num].weights[i].weight.match(/\(([^)]+)\)/)[1] + `;" class="weight card">
<h4 onclick="if (Number($(this).parent().css('height').slice(0,-2)) > 400) {$(this).parent().toggleClass('open')}">` + dtps.classes[num].weights[i].weight + `</h4>
` + assignTmp.join("") + `
</div>`);
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
dtps.showClasses = function () {
  var streamClass = "active"
  if (dtps.selectedClass !== "stream") var streamClass = "";
  jQuery(".sidebar").html(`<div onclick="dtps.selectedClass = 'stream';" class="class ` + streamClass + `">
    <div class="name">Stream</div>
    <div class="grade"><i class="material-icons">view_stream</i></div>
    </div>
    <div class="classDivider"></div>
  ` + dtps.classlist.join(""));
  if (dtps.selectedClass !== "stream") $(".class." + dtps.selectedClass).addClass("active");
  if ($(".btn.pages").hasClass("active")) { $(".btn.pages").removeClass("active"); $(".btn.stream").addClass("active"); dtps.classStream(dtps.selectedClass); dtps.selectedContent = "stream"; }
  $( ".class" ).click(function(event) {
	  var prev =  window.getComputedStyle(document.getElementsByClassName("background")[0]).getPropertyValue("--grad")
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
	  if (dtps.selectedClass !== "stream") $(".background").addClass(dtps.classes[dtps.selectedClass].col)
    $(this).siblings().removeClass("active")
    $(this).addClass("active")
    $(".header h1").html($(this).children(".name").text())
    if ($(this).children(".name").text() == "Stream") {
      $(".header .btns").hide();
    } else {
      $(".header .btns").show();
    }
    if ((dtps.selectedContent == "stream") && (dtps.selectedClass !== "stream")) dtps.classStream(dtps.selectedClass)
    if ((dtps.selectedContent == "grades") && (dtps.selectedClass !== "stream")) dtps.gradebook(dtps.selectedClass)
    if (dtps.selectedClass == "stream") dtps.masterStream();
    if (dtps.classes[dtps.selectedClass].weights.length) { $(".btns .btn.grades").show(); } else { $(".btns .btn.grades").hide(); }
  });
}
dtps.render = function() {
  document.title = "Project DTPS" + dtps.trackSuffix
  $ = jQuery;
  if (!dtps.showChangelog) jQuery.getScript('https://jottocraft.github.io/dtps/fluid.js');
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
	if (window.localStorage.fluidIsDark == "true") { var dark = " active" } else { var dark = "" }
  jQuery("body").html(`
    <div class="sidebar">
    </div>
    <div class="background trans"></div>
<div class="header">
    <h1 id="headText">Stream</h1>
    <div style="display: none;" class="btns row">
    <button onclick="dtps.selectedContent = 'stream'; dtps.classStream(dtps.selectedClass);" class="btn active stream">
    <i class="material-icons">view_stream</i>
    Stream
    </button>
    <button onclick="dtps.selectedContent = 'google';" class="btn google sudo">
    <i class="material-icons">experiment</i>
    google_logo
    </button>
    <button onclick="dtps.selectedContent = 'pages'; dtps.loadPages(dtps.selectedClass);" class="btn pages">
    <i class="material-icons">list</i>
    Pages
    </button>
    <button onclick="dtps.selectedContent = 'grades'; dtps.gradebook(dtps.selectedClass);" class="btn grades">
    <i class="material-icons">book</i>
    Gradebook
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
    <div style="width: calc(80%);border-radius: 30px;" class="card focus close abt">
    <h3>About</h3>
    <h5>Project DTPS ` + dtps.readableVer.replace(dtps.trackSuffix, `<div style="display:inline-block;" class="beta badge notice">` + dtps.trackSuffix.replace(" (", "").replace(")", "") + `</div>`) + `</h5>
    Logged in as ` + dtps.user.first_name + ` ` + dtps.user.last_name + ` (` + dtps.user.login + `)<div style="display:inline-block;" class="beta badge notice sudo">tester&nbsp;<i style="vertical-align: middle;" class="material-icons sudo">experiment</i></div><div style="display:inline-block;" class="beta badge notice dev">developer&nbsp;<i style="vertical-align: middle;" class="material-icons dev">code</i></div><div style="display:inline-block;" class="beta badge notice og">OG&nbsp;<i style="vertical-align: middle;" class="material-icons og">star</i></div>
    <p>Made by <a href="https://github.com/jottocraft">jottocraft</a></p>
    <br />
    <div onclick="fluid.dark();" class="switch` + dark + `"><span class="head"></span></div>
    <div class="label"><i class="material-icons">brightness_3</i> Use dark theme</div>
<br /><br />
<div onclick="if (dtps.showLetters) {dtps.showLetters = false;} else {dtps.showLetters = true;}" class="switch sudo"><span class="head"></span></div>
    <div class="label sudo"><i class="material-icons">experiment</i> Show letter grades instead of points earned</div>
    <br /><br />
<div onclick="jQuery('body').toggleClass('hidegrades')" class="switch sudo"><span class="head"></span></div>
    <div class="label sudo"><i class="material-icons">experiment</i> Hide grades</div>
    <br /><br />
<div onclick="if (dtps.pePDV) {dtps.pePDV = false;} else {dtps.pePDV = true;}" class="switch sudo"><span class="head"></span></div>
    <div class="label sudo"><i class="material-icons">experiment</i> Show P/DV letter grading for PE</div>
    <br /><br />
    <button onclick="dtps.changelog();" style="display:none;" class="btn changelog"><i class="material-icons">update</i>Changelog</button>
    </div>
    <div class="items">
    <h4>` + dtps.user.first_name + ` ` + dtps.user.last_name + `</h4>
    <i onclick="fluid.cards('.abt')" class="material-icons">info_outline</i>
    <i onclick="fluid.cards('.console')" class="material-icons dev">code</i>
    <i onclick="window.open('https://github.com/jottocraft/dtps/issues/new/choose')" class="material-icons">feedback</i>
    </div>
<div  style="width: calc(80%);border-radius: 30px;" class="card focus changelog close">
<h3>What's new in Project DTPS</h3>
<h5>There was an error loading the changelog. Try again later.</h5>
</div>
<div  style="width: calc(80%);border-radius: 30px;" class="card focus console close">
<h3>dtps.log</h3>
<span class="log">
</span>
</div>
  `);
	 jQuery.getScript("https://cdn.rawgit.com/showdownjs/showdown/1.8.6/dist/showdown.min.js", function() {
	  markdown = new showdown.Converter();
		 jQuery.getJSON("https://api.github.com/repos/jottocraft/dtps/releases", function(data) {
		  jQuery(".card.changelog").html(markdown.makeHtml(data[0].body));
			if (dtps.showChangelog) dtps.changelog();
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
