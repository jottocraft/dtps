(function () {
    try {
        function verifyCanvasInstance(cb) {
            window.addEventListener("load", function () {
                //What are the odds that another non-Canvas page uses this?
                //Hopefully slim-to-none because I'm using this as an indicator of a Canvas instance...
                if (window.ENV?.current_user_global_id) {
                    //Remember that this is Canvas to speed up future page loads
                    window.localStorage.setItem("dtpsThinksThisIsCanvas", "true");
                    cb();
                }
            });
        }

        //Is this a Canvas instance? (always YES for instructure.com subdomains)
        const knownCanvasInstance = (
            window.localStorage.getItem("dtpsThinksThisIsCanvas") === "true"
            || window.location.hostname.endsWith("instructure.com")
        );

        if ((window.location.pathname == "/power+") || (window.location.pathname == "/power+/")) {
            if (!knownCanvasInstance) {
                verifyCanvasInstance(() => window.location.reload());
                return;
            }

            //Check for light or dark theme
            var light = false;
            if (window.localStorage.fluidTheme == "light") {
                light = true;
            } else if (((window.localStorage.fluidTheme == "system") || (window.localStorage.fluidTheme == "auto")) && !window.matchMedia("(prefers-color-scheme: dark)").matches) {
                light = true;
            }

            //Globally-Unique User ID
            let guuid;

            const useClassicDTPS = window.location.search && window.location.search.includes("classicEdition=true");
            const observer = new MutationObserver(mutations => {
                mutations.forEach(({ addedNodes }) => {
                    addedNodes.forEach(node => {
                        //Power+ preloader
                        if (node.nodeType === 1 && node.tagName === 'BODY') {
                            node.insertAdjacentHTML("afterbegin", /*html*/`
                          <div dtps="true" id="dtpsNativeOverlay" style="background-color: inherit; position: fixed; top: 0px; left: 0px; width: 100%; height: 100vh; z-index: 99;text-align: center;z-index: 999;transition: opacity 0.2s;">
                            <img dtps="true" style="height: 100px; margin-top: 132px;" src="${useClassicDTPS ? "https://i.imgur.com/fqqPF9i.png" : (light ? "https://i.imgur.com/0WzWwb1.png" : "https://i.imgur.com/7dDUVh2.png")}" />
                                  <br dtps="true" />
                            <div dtps="true" class="progress"><div id="dtpsLoadingScreenBar" dtps="true" class="indeterminate"></div></div>
                            <style dtps="true">body {background-color: ${light ? "white" : "#151515"}; --crxElements: ${light ? "#ececec" : "#2b2b2b"}; --crxText: ${light ? "#333" : "#efefef"}; overflow: hidden;}*,:after,:before{box-sizing:border-box}.progress{background:var(--crxElements);position:relative;width:600px;height:5px;overflow:hidden;border-radius:12px;backdrop-filter:opacity(.4);display:inline-block;margin-top:75px}.progress .indeterminate{position:absolute;background:#e3ba4b;height:5px;animation:indeterminate 1.4s infinite;animation-timing-function:linear}@keyframes indeterminate{0%{width:5%;left:-15%}to{width:100%;left:110%}}p{font-family:BlinkMacSystemFont,-apple-system,"Segoe UI",Roboto,Oxygen,Ubuntu,Cantarell,"Fira Sans","Droid Sans","Helvetica Neue",Helvetica,Arial,sans-serif;color: var(--crxText);margin-top: 24px;}</style>
                          </div>
                        `);
                        } else if (node.nodeType === 1 && node.tagName === 'HEAD') {
                            node.insertAdjacentHTML("afterbegin", /*html*/`
                          <link dtps="true" rel="shortcut icon" href="https://powerplus.app/favicon.png" type="image/png">
                          <meta dtps="true" name="viewport" content="width=device-width, initial-scale=1">
                          <meta dtps="true" charset="utf-8">
                          <title dtps="true">Power+</title>
                          <meta dtps="true" name="description" content="A better UI for Canvas LMS">
                          <meta dtps="true" name="author" content="jottocraft">
                        `);
                        } else if (node.nodeType === 1 && node.tagName === 'SCRIPT' && (node.textContent && node.textContent.includes('"current_user"'))) {
                            //Do nothing for node containing environment data for faster load times (skip fetching user data)
                            guuid = node.textContent.match(/"current_user_global_id":"(.*?)"/)[1];
                        } else if (node.nodeType === 1 && node.getAttribute("dtps") != "true") {
                            //Node is not added by dtps loader
                            node.remove();
                        }
                    })
                })
            });

            //Start MutationObserver
            observer.observe(document.documentElement, {
                childList: true,
                subtree: true
            });

            //Get Power+ base URL
            var baseURL = "https://powerplus.app";
            if (useClassicDTPS) {
                baseURL = "https://classic.powerplus.app";
            } else if (window.localStorage.externalReleaseURL && (window.localStorage.dtpsLoaderPref == "external")) {
                baseURL = window.localStorage.externalReleaseURL;
            } else if (window.localStorage.dtpsLoaderPref == "local") {
                baseURL = "http://localhost:2750";
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

                //Hash global user ID for extra privacy
                window.crypto.subtle.digest("SHA-256", new TextEncoder().encode(guuid)).then(data => {
                    //unique hash
                    let uh = Array.from(new Uint8Array(data)).map((b) => b.toString(16).padStart(2, '0')).join('');

                    //Determine LMS script to load
                    var lmsScript = null;
                    if (window.location.hostname === "dtechhs.instructure.com") {
                        lmsScript = "dtech";
                    } else {
                        lmsScript = "canvas";
                    }

                    //Check for debugging LMS overrides
                    if (window.localStorage.dtpsLMSOverride) lmsScript = window.localStorage.dtpsLMSOverride;

                    //Add script to DOM
                    var s = document.createElement("script");
                    s.src = useClassicDTPS ? "https://classic.powerplus.app/init.js" : baseURL + "/scripts/lms/" + lmsScript + ".js?uh=" + uh;
                    s.async = false;
                    s.setAttribute("dtps", "true");
                    document.documentElement.appendChild(s);
                    s.onerror = function () {
                        //Couldn't load debugging script, fallback to production
                        if (window.localStorage.dtpsLoaderPref && (window.localStorage.dtpsLoaderPref !== "prod")) {
                            console.log("[DTPS CHROME] Failed to load development script. Falling back to production.");
                            window.localStorage.dtpsLoaderPref = "prod";
                            window.location.reload();
                        } else {
                            document.getElementById("dtpsLoadingScreenBar").style.animationPlayState = "paused";
                            document.getElementById("dtpsLoadingScreenStatus").innerText = "Could not load Power+. Please try again later.";
                        }
                    };
                });
            }
        } else if (window.location.search.includes("dtpsLogin=true") && knownCanvasInstance) {
            //redirect to Power+ after login
            console.log("[DTPS Chrome] Redirecting after login...");
            window.location.href = "/power+/";
        } else {
            let releaseType = null;
            const loaderPref = window.localStorage.getItem("dtpsLoaderPref");
            if (loaderPref === "external") releaseType = "Power+ (external)";
            if (loaderPref === "local") releaseType = "Power+ (local)";

            function injectDTPSButton(node) {
                node.insertAdjacentHTML("beforeend", /*html*/`
                <li class="menu-item ic-app-header__menu-list-item ">
                  <a id="global_nav_dtps_link" role="button" href="/power+/" class="ic-app-header__menu-list-link">
                    <div class="menu-item-icon-container" aria-hidden="true">
                      <svg xmlns="http://www.w3.org/2000/svg" class="ic-icon-svg ic-icon-svg--dtps" version="1.1" viewBox="0 0 48 63.999"><path d="m5.333 0c-2.946 0-5.333 2.4-5.333 5.333v48c0 2.933 2.388 5.333 5.333 5.333h5.333v5.333l6.667-5.333 6.667 5.333v-5.333h18.667c2.947 0 5.333-2.4 5.333-5.333v-2.667c0 2.933-2.387 5.333-5.333 5.333h-18.667v-5.333h-13.333v5.333h-4c-2.209 0-4-1.867-4-4 0-2.4 1.791-4 4-4h36c2.947 0 5.333-2.4 5.333-5.333v-37.333c0-2.933-2.387-5.333-5.333-5.333h-37.333z"/></svg>
                    </div>
                    <div class="menu-item__text">${releaseType || "Power+"}</div>
                  </a>
                </li>
              `);
            }

            if (knownCanvasInstance) {
                //Inject button as the page loads in
                const observer = new MutationObserver(mutations => {
                    mutations.forEach(({ addedNodes }) => {
                        addedNodes.forEach(node => {
                            //Power+ button
                            if (node.nodeType === 1 && node.id === "menu") {
                                injectDTPSButton(node);
                            }
                        })
                    })
                });

                // Starts the monitoring
                observer.observe(document.documentElement, {
                    childList: true,
                    subtree: true
                });
            } else {
                verifyCanvasInstance(() => {
                    injectDTPSButton(document.getElementById("menu"));
                });
            }
        }
    } catch (e) { }
})();