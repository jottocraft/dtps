const s = document.createElement("script");
s.src = chrome.runtime.getURL("loader.js");
s.onload = () => s.remove();
document.documentElement.appendChild(s);