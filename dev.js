window.alert("The Power+ dev channel is offline")
if (window.localStorage.devAutoLoad == "true") {
	window.localStorage.devAutoLoad = "false"
	window.location.reload();
}
