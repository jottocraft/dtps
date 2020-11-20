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
  const useClassicDTPS = window.location.search && window.location.search.includes("classicEdition=true");
  const observer = new MutationObserver(mutations => {
    mutations.forEach(({ addedNodes }) => {
      addedNodes.forEach(node => {
        //Power+ preloader
        if (node.nodeType === 1 && node.tagName === 'BODY') {
          node.innerHTML = /*html*/`
            <div dtps="true" id="dtpsNativeOverlay" style="background-color: #151515; position: fixed; top: 0px; left: 0px; width: 100%; height: 100vh; z-index: 99;text-align: center;z-index: 999;transition: opacity 0.2s;">
              <img dtps="true" style="height: 100px; margin-top: 132px;" src="${useClassicDTPS ? "https://i.imgur.com/fqqPF9i.png" : "https://i.imgur.com/7dDUVh2.png"}" />
			        <br dtps="true" />
              <div dtps="true" class="progress"><div id="dtpsLoadingScreenBar" dtps="true" class="indeterminate"></div></div>
              <p id="dtpsLoadingScreenStatus" dtps="true">
                ${window.localStorage.dtpsLoaderPref == "codespace" ? `[codespace] Click <a onclick="window.localStorage.dtpsLoaderPref = 'prod';window.location.reload();" href="#">here</a> to switch to production` : ``}
              </p>
              <style dtps="true">body {background-color: #151515; overflow: hidden;}*,:after,:before{box-sizing:border-box}.progress{position:relative;width:600px;height:5px;overflow:hidden;border-radius:12px;background:#262626;backdrop-filter:opacity(.4);display:inline-block;margin-top:75px}.progress .indeterminate{position:absolute;background:#e3ba4b;height:5px;animation:indeterminate 1.4s infinite;animation-timing-function:linear}@keyframes indeterminate{0%{width:5%;left:-15%}to{width:100%;left:110%}}p{font-family:BlinkMacSystemFont,-apple-system,"Segoe UI",Roboto,Oxygen,Ubuntu,Cantarell,"Fira Sans","Droid Sans","Helvetica Neue",Helvetica,Arial,sans-serif;color: #c4c4c4;margin-top: 24px;}</style>
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
        } else if (node.nodeType === 1 && node.tagName === 'SCRIPT' && (node.textContent && node.textContent.includes('"current_user"'))) {
          //Do nothing for node containing enviornment data for faster load times
        } else if (node.nodeType === 1 && node.getAttribute("dtps") != "true") {
          //Node is not added by dtps
          node.remove();
        }
      })
    })
  })

  //Start MutationObserver
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  //Get Power+ base URL
  var baseURL = "https://powerplus.app";
  if (useClassicDTPS) {
    baseURL = "https://classic.dtps.jottocraft.com";
  } else if (window.localStorage.debuggingConfig && (window.localStorage.dtpsLoaderPref == "debugging")) {
    if (window.localStorage.debuggingConfig == "true") {
      baseURL = "http://localhost:2750";
    } else if (window.localStorage.debuggingConfig) {
      baseURL = window.localStorage.debuggingConfig;
    }
  } else if (window.localStorage.githubCanary && (window.localStorage.dtpsLoaderPref == "canary")) {
    baseURL = "https://jottocraft.github.io/" + window.localStorage.githubCanary;
  } else if (window.localStorage.codespaceExternalURL && (window.localStorage.dtpsLoaderPref == "codespace")) {
    baseURL = "https://" + window.localStorage.codespaceExternalURL.replace(/\//g, "") + ".apps.codespaces.githubusercontent.com";
  }

  //Set DTPS loader parameters
  var s = document.createElement("script");
  s.textContent = "window.dtpsPreLoader = true;window.dtpsBaseURL = '" + baseURL + "'";
  s.async = false;
  s.setAttribute("dtps", "true");
  document.documentElement.appendChild(s);

  //Load jQuery
  var s = document.createElement("script");
  s.src = "https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js";
  s.async = false;
  s.setAttribute("dtps", "true");
  document.documentElement.appendChild(s);

  //Wait for page to load
  window.onload = function () {
    //Stop observer
    observer.disconnect();

    //Determine LMS script to load
    var lmsScript = null;
    if (window.location.hostname.startsWith("dtechhs")) {
      lmsScript = "dtech";
    } else if (window.location.hostname.includes("instructure.com")) {
      lmsScript = "canvas";
    } else if (!window.localStorage.dtpsLMSOverride) {
      console.log("[DTPS CHROME]", "Could not find a valid LMS script for this site. Is Power+ supported on " + window.location.hostname + "?");
      return;
    }

    //Check for debugging LMS overrides
    if (window.localStorage.dtpsLMSOverride) lmsScript = window.localStorage.dtpsLMSOverride;

    //Add script to DOM
    var s = document.createElement("script");
    s.src = useClassicDTPS ? "https://classic.dtps.jottocraft.com/init.js" : baseURL + "/scripts/lms/" + lmsScript + ".js";
    s.async = false;
    s.setAttribute("dtps", "true");
    document.documentElement.appendChild(s);
    s.onerror = function () {
      //Couldn't load debugging script, fallback to production
      if (window.localStorage.dtpsLoaderPref && (window.localStorage.dtpsLoaderPref !== "prod")) {
        console.log("[DTPS CHROME] Failed to load debugging script. Falling back to production.");
        window.localStorage.dtpsLoaderPref = "prod";
        window.location.reload();
      } else {
        document.getElementById("dtpsLoadingScreenBar").style.animationPlayState = "paused";
        document.getElementById("dtpsLoadingScreenStatus").innerText = "Could not load Power+. Please try again later.";
      }
    };
  }

} else if (window.location.search.includes("dtpsLogin=true")) {
  //redirect to Power+ after login
  console.log("[DTPS Chrome] Redirecting after login...");
  window.location.href = "/power+";
} else {
  var releaseType = null;
  if (window.localStorage.dtpsLoaderPref == "debugging") releaseType = "Power+ (debug)";
  if (window.localStorage.dtpsLoaderPref == "canary") releaseType = "Power+ (canary)";
  if (window.localStorage.dtpsLoaderPref == "codespace") releaseType = "Power+ (codespace)";

  const observer = new MutationObserver(mutations => {
    mutations.forEach(({ addedNodes }) => {
      addedNodes.forEach(node => {
        //Power+ button
        if (node.nodeType === 1 && node.id == "menu") {
          node.insertAdjacentHTML("beforeend", /*html*/`
            <li class="menu-item ic-app-header__menu-list-item ">
              <a id="global_nav_dtps_link" role="button" href="/power+" class="ic-app-header__menu-list-link">
                <div class="menu-item-icon-container" aria-hidden="true">
                  <svg xmlns="http://www.w3.org/2000/svg" class="ic-icon-svg ic-icon-svg--dtps" version="1.1" viewBox="0 0 48 63.999"><path d="m5.333 0c-2.946 0-5.333 2.4-5.333 5.333v48c0 2.933 2.388 5.333 5.333 5.333h5.333v5.333l6.667-5.333 6.667 5.333v-5.333h18.667c2.947 0 5.333-2.4 5.333-5.333v-2.667c0 2.933-2.387 5.333-5.333 5.333h-18.667v-5.333h-13.333v5.333h-4c-2.209 0-4-1.867-4-4 0-2.4 1.791-4 4-4h36c2.947 0 5.333-2.4 5.333-5.333v-37.333c0-2.933-2.387-5.333-5.333-5.333h-37.333z"/></svg>
                </div>
                <div class="menu-item__text">${releaseType || "Power+"}</div>
              </a>
            </li>
          `);
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