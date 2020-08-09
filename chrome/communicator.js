if (window.location.hostname == "powerplus.app") {
  const observer = new MutationObserver(mutations => {
    mutations.forEach(({ addedNodes }) => {
      addedNodes.forEach(node => {
        //Power+ button
        if (node.nodeType === 1 && node.id == "dtpsInstallBtn") {
          node.setAttribute("onclick", "window.location.href = 'https://dtechhs.instructure.com/power+'");
          node.innerHTML = `<i class="material-icons">open_in_new</i> Open`;
        }
      })
    })
  })

  // Starts the monitoring
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  })
} else if (window.location.pathname == "/power+") {
  const observer = new MutationObserver(mutations => {
    mutations.forEach(({ addedNodes }) => {
      addedNodes.forEach(node => {
        //Power+ preloader
        if (node.nodeType === 1 && node.tagName === 'BODY') {
          node.innerHTML = /*html*/`
            <div dtps="true" id="dtpsNativeOverlay" style="background-color: #151515; position: fixed; top: 0px; left: 0px; width: 100%; height: 100vh; z-index: 99;text-align: center;z-index: 999;transition: opacity 0.2s;">
              <img dtps="true" style="height: 100px; margin-top: 132px;" src="https://i.imgur.com/7dDUVh2.png" />
			  <br dtps="true" />
              <div dtps="true" class="progress"><div dtps="true" class="indeterminate"></div></div>
              <style dtps="true">body {background-color: #151515; overflow: hidden;}*,:after,:before{box-sizing:border-box}.progress{position:relative;width:600px;height:5px;overflow:hidden;border-radius:12px;background:#262626;backdrop-filter:opacity(.4);display:inline-block;margin-top:75px}.progress .indeterminate{position:absolute;background:#e3ba4b;height:5px;animation:indeterminate 1.4s infinite;animation-timing-function:linear}@keyframes indeterminate{0%{width:5%;left:-15%}to{width:100%;left:110%}}</style>
            </div>
          `;
        } else if (node.nodeType === 1 && node.tagName === 'HEAD') {
          node.innerHTML = /*html*/`
            <link dtps="true" rel="shortcut icon" href="https://powerplus.app/favicon.png" type="image/png">
            <meta dtps="true" name="viewport" content="width=device-width, initial-scale=1">
            <meta dtps="true" charset="utf-8">
            <title dtps="true">Power+</title>
            <meta dtps="true" name="description" content="A better UI for Canvas LMS">
            <meta dtps="true" name="author" content="jottocraft">
          `;
        } else if (node.nodeType === 1 && node.getAttribute("dtps") != "true") {
          //Node is not added by dtps
          node.remove();
        }
      })
    })
  })

  // Starts the monitoring
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  })

  //tell Power+ the loader is already shown
  var s = document.createElement("script");
  s.textContent = "window.dtpsPreLoader = true;";
  s.async = false;
  s.setAttribute("dtps", "true");
  document.documentElement.appendChild(s);

  //add jQuery
  var s = document.createElement("script");
  s.src = "https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js";
  s.async = false;
  s.setAttribute("dtps", "true");
  document.documentElement.appendChild(s);

  //Wait for page to load
  window.onload = function () {
    //Stop observer
    observer.disconnect();

    //load Power+ script
    window.dtpsLoader = 4;
    var script = "https://powerplus.app/scripts/lms/dtech.js";

    //Check for debugging/canary scripts
    var debuggingPath = window.localStorage.dtpsDebuggingPort ? "http://localhost:" + window.localStorage.dtpsDebuggingPort + "/scripts/lms/dtech.js" : null;
    var canaryPath = window.localStorage.githubCanary ? "https://jottocraft.github.io/" + window.localStorage.githubCanary : null;

    //Check for version preference
    if (debuggingPath && (window.localStorage.dtpsLoaderPref == "debugging")) {
      script = debuggingPath;
    } else if (canaryPath && (window.localStorage.dtpsLoaderPref == "canary")) {
      script = canaryPath;
    }

    //Add script to DOM
    var s = document.createElement("script");
    s.src = script;
    s.async = false;
    s.setAttribute("dtps", "true");
    document.documentElement.appendChild(s);
    s.onerror = function () {
      //Couldn't load debugging script, fallback to production
      console.log("[DTPS CHROME] Failed to load debugging script. Falling back to production.");
      window.localStorage.dtpsLoaderPref = "prod";
      var ss = document.createElement("script");
      ss.src = "https://powerplus.app/scripts/lms/dtech.js";
      ss.async = false;
      ss.setAttribute("dtps", "true");
      document.documentElement.appendChild(ss);
    };
  }

} else if (window.location.search.includes("dtpsLogin=true")) {
  //redirect to Power+ after login
  console.log("[DTPS Chrome] Redirecting after login...")
  window.location.href = "/power+"
} else {
  const observer = new MutationObserver(mutations => {
    mutations.forEach(({ addedNodes }) => {
      addedNodes.forEach(node => {
        //Power+ button
        if (node.nodeType === 1 && node.id == "menu") {
          node.insertAdjacentHTML("beforeend", `<li class="ic-app-header__menu-list-item">
            <a href="/power+" style="cursor: pointer;" class="ic-app-header__menu-list-link">
              <div class="menu-item-icon-container" aria-hidden="true">
                  <img src="https://powerplus.app/whiteOutline.png" class="ic-icon-svg">
              </div>
              <div class="menu-item__text" style="font-size: 14px;">Power+</div>
            </a>
          </li>`)
        }
      })
    })
  })

  // Starts the monitoring
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  })
}