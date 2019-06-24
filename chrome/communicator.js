$(document).ready(function() {
console.log("[DTPS Chrome] Automatically loading Project DTPS");

//Canvas Script
var url = 'https://dtps.js.org/init.js'
if (window.localStorage.devAutoLoad == "true") var url = (window.localStorage.dtpsLocal == "true" ? window.localStorage.dtpsPath + 'init.js' : 'https://dtps.js.org/init.js')

window.dtpsLoader = 3;

document.addEventListener('extensionData', function(e) {
   if (e.detail == "extensionStatus") {
	       document.dispatchEvent(new CustomEvent('extensionData', {
        detail: "extensionInstalled"
    }));
   }
   if (e.detail == "extensionUninstall") {
      chrome.runtime.sendMessage({messageName: 'extensionUninstall'});
   }
});



if ((window.localStorage.disableAutoLoad == undefined) || (window.localStorage.disableAutoLoad == "true")) {
jQuery("#menu").append(`<li class="ic-app-header__menu-list-item">
            <a onclick="jQuery.getScript('` + url + `');dtpsLoader=2;" style="cursor: pointer;" class="ic-app-header__menu-list-link">
              <div class="menu-item-icon-container" aria-hidden="true">
                  <img src="https://dtps.js.org/canvas.png" class="ic-icon-svg">

              </div>
              <div class="menu-item__text" style="font-size: 14px;">Power+
              ` + (window.localStorage.devAutoLoad == "true" ? `<div style="background-color: #ec9b06;color: white;font-size: 10px;line-height: 9px;vertical-align: middle;padding: 2px 2.5px;border-radius: 5px;display: inline-block;">dev</div>` : "") + `
              </div>
            </a>
          </li>`)
} else {
	$.getScript(url);
}
});
