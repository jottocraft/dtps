window.alert("The Power+ dev channel is offline. Visit dtps.js.org/roadmap for more information.")
if (window.localStorage.devAutoLoad == "true") {
	window.localStorage.devAutoLoad = "false"
	window.location.reload();
}
