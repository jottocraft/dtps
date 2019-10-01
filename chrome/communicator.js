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
		  
		  if (window.localStorage["pref-devChannel"] == "true") {
	jQuery(".feature-flags.collectionViewItems").prepend(`<li class="feature-flag"><div class="row-fluid feature dtps_dark">
  <div class="span7">
    <span class="element_toggler" aria-controls="dtps_dark-details" aria-expanded="false" role="button" tabindex="0">
       <span class="screenreader-only">
         Toggle feature details for Dark theme by Power+
       </span>
       <i class="icon-mini-arrow-right"></i>
    </span>
    <span class="feature-title">Dark theme by Power+ (beta)</span>

    
  </div>

  <div class="span5 text-right">
    
      <!-- start super toggle -->
      <label class="ic-Super-toggle--on-off" for="ff_toggle_dtps_dark">
        <span class="screenreader-only">
          
            Enable feature: Dark theme by Power+
          
        </span>
        <input onclick="if ($('#ff_toggle_dtps_dark').attr('checked') == 'checked') {window.localStorage['pref-darkCanvas'] = true;} else {window.localStorage['pref-darkCanvas'] = false;}" ` + (window.localStorage["pref-darkCanvas"] == "true" ? "checked" : "") + ` id="ff_toggle_dtps_dark" class="ic-Super-toggle__input ff_toggle" type="checkbox" data-id="dtps_dark">
        <div class="ic-Super-toggle__container" aria-hidden="true" data-checked="On" data-unchecked="Off">
          <div class="ic-Super-toggle__switch">
            <div class="ic-Super-toggle__option--LEFT">
              <svg xmlns="http://www.w3.org/2000/svg" version="1.1" x="0" y="0" width="548.9" height="548.9" viewBox="0 0 548.9 548.9" xml:space="preserve">
                <polygon points="449.3 48 195.5 301.8 99.5 205.9 0 305.4 95.9 401.4 195.5 500.9 295 401.4 548.9 147.5"></polygon>
              </svg>
            </div>
            <div class="ic-Super-toggle__option--RIGHT">
              <svg xmlns="http://www.w3.org/2000/svg" version="1.1" x="0" y="0" viewBox="0 0 28 28" xml:space="preserve">
                <polygon points="28 22.4 19.6 14 28 5.6 22.4 0 14 8.4 5.6 0 0 5.6 8.4 14 0 22.4 5.6 28 14 19.6 22.4 28"></polygon>
              </svg>
            </div>
          </div>
        </div>
      </label>
      <!-- end super toggle -->
    
  </div>
</div>

<div class="feature-details row-fluid" id="dtps_dark-details" style="display: none;">
  <div class="span10">
    <p class="feature-description">
      
      
        A dark theme for Canvas, made by Power+. Reload the page for changes to take effect. You can toggle this feature option here or in the settings menu of Power+, under the theme section.
      
    </p>
  </div>

  <div class="span2 text-right feature-detail-links">
    
  </div>
</div>
</li>`);
   }

   }
});

$(document.head).ready(function() {
	if (!(window.localStorage["pref-autoLoad"] == "true") && (window.localStorage["pref-darkCanvas"] == "true") && (window.localStorage["pref-devChannel"] == "true")) {
		javascript:jQuery("<link/>", { rel: "stylesheet", type: "text/css", href: "https://powerplus.app/canvasDark.css" }).appendTo("head");
	}
});