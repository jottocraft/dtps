var dtps = {};
dtps.log = function(msg) {
console.log("[DTPS] " + msg);
}
dtps.firstrun = function () {
  jQuery("body").append(`<div id="TB_overlay" style="position: fixed;">&nbsp;</div><div id="TB_window" role="dialog" aria-modal="true" aria-labelledby="TB_title" style="width: 800px; height: 540px; left: 141.5px; top: 200px;"><div id="TB_closeAjaxWindow" class="tb_title_bar" role="heading"><a href="javascript:;" onclick="TB_remove();" id="TB_closeWindowButton" aria-hidden="true"><i class="icon-close"></i></a><div id="TB_title" class="tb_title">project dtps</div><div id="TB_ajaxContent" role="main" style="width: 770px; height: 434px;">
<h2>Welcome to project dtps</h2>
<h4>v0.0.1 [Alpha]</h4>
<p>Click "Install" below to continue</p>
</div><div id="TB_actionBar" style=""><span><input class="button button" onclick="ThickBox.close();" type="button" value="Cancel"><input class="button button" onclick="ThickBox.close();" type="button" value="Install"></span>
`)
}
dtps.majorUpdate = function () {
  jQuery("body").append(`<div id="TB_overlay" style="position: fixed;">&nbsp;</div><div id="TB_window" role="dialog" aria-modal="true" aria-labelledby="TB_title" style="width: 800px; height: 540px; left: 141.5px; top: 200px;"><div id="TB_closeAjaxWindow" class="tb_title_bar" role="heading"><a href="javascript:;" onclick="TB_remove();" id="TB_closeWindowButton" aria-hidden="true"><i class="icon-close"></i></a><div id="TB_title" class="tb_title">project dtps</div><div id="TB_ajaxContent" role="main" style="width: 770px; height: 434px;">
<h2>What's new in project dtps</h2>
<h4>v0.0.1 [Alpha]</h4>
<ul>
<li>Bugfixes</li>
</ul>
</div><div id="TB_actionBar" style=""><span><input class="button button" onclick="ThickBox.close();" type="button" value="Continue"></span>
`)
}
dtps.log("Loading project dtps...");
var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var data = jQuery(this.responseText).children("tbody").children();
      dtps.classes = [];
      for (var i = 0; i < data.length; i++) {
        var section = jQuery(data[i]);
        dtps.classes.push({
          name: jQuery(section.children()[1]).text(),
          abbrv: jQuery(section.children()[0]).text(),
          grade: section.children(".right").text().replace(/\s/g, "")
        })
      }
      dtps.log("Classes loaded")
    }
  };
  xhttp.open("POST", "https://dtechhs.learning.powerschool.com/u/10837719/portal/portlet_reportcard?my_portal=true", true);
  xhttp.setRequestHeader("Accept", "text/javascript, text/html, application/xml, text/xml, */*")
  xhttp.setRequestHeader("Accept-Language", "en-US,en;q=0.9")
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8")
  xhttp.setRequestHeader("X-Prototype-Version", "1.7.1")
  xhttp.setRequestHeader("X-Requested-With", "XMLHttpRequest")
  xhttp.send("id=9915857+10145967+9715213+9915843+9915882&e=15668509&csrf_token=a6b227ce5120182257f86aab1815027b273f429e");
