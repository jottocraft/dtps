var dtps = {};
dtps.log = function(msg) {
console.log("[DTPS] " + msg);
}
dtps.log("It's alive!");
var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
     dtps.log(this.responseText);
    }
  };
  xhttp.open("GET", "bookmark.txt", true);
  xhttp.send();
