$(document).ready(function () {
   console.log("[DTPS Chrome] Power+ is ready");

   //Canvas Script
   var url = 'https://powerplus.app/init.js'
   if (window.localStorage["pref-devChannel"] == "true") var url = (window.localStorage["pref-localDtps"] == "true" ? (window.localStorage.dtpsPath ? window.localStorage.dtpsPath : "http://localhost:8000/") + 'dev.js' : 'https://powerplus.app/dev.js')

   window.dtpsLoader = 3;

   document.addEventListener('extensionData', function (e) {
      if (e.detail == "extensionStatus") {
         document.dispatchEvent(new CustomEvent('extensionData', {
            detail: "extensionInstalled"
         }));
      }
      if (e.detail == "extensionUninstall") {
         chrome.runtime.sendMessage({ messageName: 'extensionUninstall' });
      }
   });



   if (window.localStorage["pref-autoLoad"] == "true") {
      $.getScript(url);
   } else {
      jQuery("#menu").append(`<li class="ic-app-header__menu-list-item">
            <a onclick="jQuery.getScript('` + url + `');dtpsLoader=2;" style="cursor: pointer;" class="ic-app-header__menu-list-link">
              <div class="menu-item-icon-container" aria-hidden="true">
                  <img src="https://powerplus.app/whiteOutline.png" class="ic-icon-svg">

              </div>
              <div class="menu-item__text" style="font-size: 14px;">Power+
              ` + (window.localStorage["pref-devChannel"] == "true" ? `<div style="background-color: #ec9b06;color: white;font-size: 10px;line-height: 9px;vertical-align: middle;padding: 2px 2.5px;border-radius: 5px;display: inline-block;">dev</div>` : "") + `
              </div>
            </a>
          </li>`)

   }
});
