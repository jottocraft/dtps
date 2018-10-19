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
  xhttp.open("POST", "https://dtechhs.learning.powerschool.com/u/10837719/portal/portlet_grades?my_portal=true", true);
  xhttp.send("id=9915857+10145967+9715213+9915843+9915882&e=15668509&csrf_token=823f04b43cd4b367d8bd67070702a86983d29f4e");
