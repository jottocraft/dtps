if (window.location.pathname.split("/")[3] == "portal") {
	
	$(document).ready(function() {
if ((window.localStorage.disableAutoLoad == undefined) || (window.localStorage.disableAutoLoad == "false")) {
console.log("[DTPS Chrome] Automatically loading Project DTPS");
window.dtpsLoader = 2;
window.dtpsExtension = true;
document.addEventListener('extensionData', function(e) {
   if (e.detail == "extensionStatus") {
	       document.dispatchEvent(new CustomEvent('extensionData', {
        detail: "extensionInstalled"
    }));
   }
});
var url = 'https://dtps.js.org/init.js'
if (window.localStorage.devAutoLoad == "true") var url = 'https://dtps.js.org/dev.js'
$.getScript(url);
} else {
	jQuery("#myacc_dmenu").prepend(`<div class="dmoption" role="menuitem" taborder="-1" onclick="localStorage.setItem('disableAutoLoad', false); window.location.reload();"><a href="javascript:;" role="menuitem">Enable Power+</a></div>`)
}
	});
	
}