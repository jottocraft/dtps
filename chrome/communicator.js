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

  //block most canvas scripts using yett
  var s = document.createElement("script");
  s.src = "https://cdn.jottocraft.com/canvas-blocker.min.js";
  s.async = false;
  document.documentElement.appendChild(s);

  const observer = new MutationObserver(mutations => {
    mutations.forEach(({ addedNodes }) => {
      addedNodes.forEach(node => {
        //Power+ preloader
        if (node.nodeType === 1 && node.tagName === 'H1' && node.innerHTML.toUpperCase().includes("PAGE NOT FOUND")) {
          node.innerHTML = "";
          node.insertAdjacentHTML("afterend", `<div style="background-color: #191919; position: fixed; top: 0px; left: 0px; width: 100%; height: 100vh; z-index: 99;text-align: center;">
          <img style="height: 115px; margin-top: 120px;" src="https://i.imgur.com/W2Di5X3.png" /><div class="loader"></div>
          </div>`);
          node.remove();

          var s = document.createElement("style");
          s.innerHTML = `body {background-color: #191919; overflow: hidden;}*,:after,:before{box-sizing:border-box}.loader{position:absolute;top:450px;left:50%;transform:translate(-50%,-50%);width:50px;height:10px;background:#3498db;border-radius:5px;animation:load 1.8s ease-in-out infinite}.loader:after,.loader:before{position:absolute;display:block;content:"";animation:load 1.8s ease-in-out infinite;height:10px;border-radius:5px}.loader:before{top:-20px;left:10px;width:40px;background:#ef4836}.loader:after{bottom:-20px;width:35px;background:#f5ab35}@keyframes load{0%{transform:translateX(40px)}50%{transform:translateX(-30px)}100%{transform:translateX(40px)}}`;
          document.body.appendChild(s);

          //tell Power+ the loader is already shown
          var s = document.createElement("script");
          s.textContent = "window.dtpsPreLoader = true;";
          s.async = false;
          document.documentElement.appendChild(s);
        }
        if (node.nodeType === 1 && node.tagName === 'HEADER' && node.id == "header") {
          node.remove();
        }
        if (node.nodeType === 1 && node.tagName === 'DIV' && node.id == "wrapper") {
          node.style = "margin: 0 !important;"
        }
        if (node.nodeType === 1 && node.tagName === 'TITLE') {
          node.innerHTML = "Power+";
        }
        if (node.nodeType === 1 && node.tagName === 'LINK' && node.rel == "shortcut icon") {
          node.type = "image/png"
          node.href = "https://powerplus.app/favicon.png";
        }
        // For each added canvas link thing
        if (node.nodeType === 1 && node.tagName === 'LINK' && node.type == "text/javascript") {
          node.removeAttribute("as");
          node.removeAttribute("rel");
          node.type = "javascript/blocked";
        }
      })
    })
  })

  // Starts the monitoring
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  })

  //add jQuery
  var s = document.createElement("script");
  s.src = "https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js";
  s.async = false;
  document.documentElement.appendChild(s);


  //load Power+ script
  window.dtpsLoader = 4;
  var s = document.createElement("script");
  s.src = window.localStorage.dtpsPath || "https://powerplus.app/init.js";
  s.async = false;
  document.documentElement.appendChild(s);

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