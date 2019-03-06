if (window.location.pathname.split("/")[3] == "portal") {
	
	$(document).ready(function() {
		var url = 'https://dtps.js.org/init.js'
if (window.localStorage.devAutoLoad == "true") var url = 'https://dtps.js.org/dev.js'

window.dtpsLoader = 2;
window.dtpsExtension = true;
document.addEventListener('extensionData', function(e) {
   if (e.detail == "extensionStatus") {
	       document.dispatchEvent(new CustomEvent('extensionData', {
        detail: "extensionInstalled"
    }));
   }
});

if ((window.localStorage.disableAutoLoad == undefined) || (window.localStorage.disableAutoLoad == "true")) {
jQuery("#global_top_links").append(`<a onclick="javascript:jQuery.getScript('` + url + `');dtpsLoader=2;">Power+` + (window.localStorage.devAutoLoad == "true" ? " (dev)" : "") + `</a>`)
} else {
console.log("[DTPS Chrome] Automatically loading Project DTPS");
$.getScript(url);	
}

	});
	
}
