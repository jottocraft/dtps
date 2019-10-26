/*!
Fluid UI JavaScript Modules v3.9.2
Copyright (c) 2017-2019 jottocraft
Licenced under the GNU General Public License v3.0 (https://github.com/jottocraft/fluid/blob/master/LICENSE)
 */


function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

Date.prototype.stdTimezoneOffset = function () {
  var jan = new Date(this.getFullYear(), 0, 1);
  var jul = new Date(this.getFullYear(), 6, 1);
  return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
}

Date.prototype.isDstObserved = function () {
  return this.getTimezoneOffset() < this.stdTimezoneOffset();
}

fluid = new Object;
fluid.contextMenuOpen = false;

fluid.dst = new Date().isDstObserved()
if (fluid.dst) {
  // WITH Daylight Savings Time
  // Light: 5AM - 6PM Dark: 7PM - 4AM
  fluid.auto = { darkStartPM: 19, darkEndAM: 4 }
} else {
  // NO Daylight Savings Time
  // Light: 6AM - 5PM Dark: 6PM - 5AM
  fluid.auto = { darkStartPM: 18, darkEndAM: 5 }
}

window.matchMedia("(prefers-color-scheme: dark)").addListener(function (e) {
  if ((window.localStorage.getItem("fluidTheme") == undefined) && fluid.unsetStart) {
    console.log("[FLUID UI] Detected a change in system-wide theme")
    if (e.matches) {
      fluid.theme("dark", true);
    } else {
      fluid.theme("auto", true);
    }
  }
})

fluid.includedFlexThemes = ["midnight", "nitro", "aquatic", "highContrast", "candy", "violet", "tome"]
fluid.theme = function (requestedTheme, temporary) {
  // GET CURRENT THEME -----------------------
  var currentTheme = null;

  if ($("body").hasClass("dark")) currentTheme = "dark";
  if ($("body").hasClass("light")) currentTheme = "light";

  var bodyClass = document.body.className;
  for (var i = 0; i < fluid.includedFlexThemes.length; i++) {
    if (String(bodyClass).includes(fluid.includedFlexThemes[i])) {
      currentTheme = fluid.includedFlexThemes[i];
    }
  }

  for (var i = 0; i < document.body.classList.length; i++) { if ((document.body.classList[i] !== "light") && document.body.classList[i].startsWith("light")) { currentTheme = document.body.classList[i] } if ((document.body.classList[i] !== "dark") && document.body.classList[i].startsWith("dark")) { currentTheme = document.body.classList[i] } }
  if (currentTheme) { $(".btns.themeSelector .btn." + currentTheme.replace("#", "")).addClass("active"); }

  if (requestedTheme == undefined) return currentTheme;
  // -----------------------------------------

  // APPLY REQUESTED THEME -------------------
  classes = document.body.classList.value.split(" ");
  for (var ii = 0; ii < classes.length; ii++) { if ((classes[ii].startsWith("light") || classes[ii].startsWith("dark")) && ((classes[ii] !== "dark") && (classes[ii] !== "light"))) { $("body").removeClass(classes[ii]) } }
  for (var i = 0; i < fluid.includedFlexThemes.length; i++) $("body").removeClass(fluid.includedFlexThemes[i])

  if (requestedTheme.includes("light") || (requestedTheme == "highContrast")) { $("body").removeClass("dark"); $("body").addClass("light"); }
  if (requestedTheme.includes("dark") || fluid.includedFlexThemes.includes(requestedTheme)) { $("body").removeClass("light"); $("body").addClass("dark"); }
  if (requestedTheme !== "auto") $("body").addClass(requestedTheme);

  //Auto (time-based) theme
  if (requestedTheme == "auto") {
    var hours = new Date().getHours()
    if (hours > fluid.auto.darkEndAM && hours < fluid.auto.darkStartPM) {
      $("body").removeClass("dark"); $("body").addClass("light");
    } else {
      $("body").removeClass("light"); $("body").addClass("dark");
    }
  }

  //Fluid Flex Compatibility Layer
  if ((String(requestedTheme).startsWith("dark") && (requestedTheme !== "dark")) || (String(requestedTheme).startsWith("light") && (requestedTheme !== "light")) || (fluid.includedFlexThemes.includes(requestedTheme))) { $("body").addClass("flex"); } else { $("body").removeClass("flex"); }

  //Save theme & UI Stuff
  if (temporary !== true) { localStorage.setItem("fluidTheme", requestedTheme); }
  if (requestedTheme) { $(".btns.themeSelector .btn").removeClass("active"); $(".btns.themeSelector .btn." + requestedTheme.replace("#", "")).addClass("active"); }
  // -----------------------------------------

  // OTHER THEME THINGS ----------------------
  //Acrylic (tinycolor library required)
  if (typeof tinycolor !== "undefined") {
    var acrylicBase = getComputedStyle(document.body).getPropertyValue("--acrylic");
    if (acrylicBase == "") acrylicBase = getComputedStyle(document.body).getPropertyValue("--background");
    document.documentElement.style.setProperty("--acrylic10", tinycolor(acrylicBase).setAlpha(0.1).toRgbString())
    document.documentElement.style.setProperty("--acrylic50", tinycolor(acrylicBase).setAlpha(0.5).toRgbString())
    document.documentElement.style.setProperty("--acrylic50-fallback", tinycolor(acrylicBase).setAlpha(0.9).toRgbString())
    document.documentElement.style.setProperty("--acrylicSecText", tinycolor(getComputedStyle(document.body).getPropertyValue("--text")).setAlpha(0.3).toRgbString())
  } else {
    console.warn("[FLUID UI] The tinycolor library is not present. Fluid UI Acrylic will not work on this site.");
  }

  //Load chroma
  if (fluid.chroma.on && fluid.chroma.themeLink) {
    fluid.chroma.static(getComputedStyle(document.body).getPropertyValue("--background"))
  }

  if ((requestedTheme !== currentTheme) && (currentTheme !== null)) {
    //emit theme change event if the theme has changed
    document.dispatchEvent(new CustomEvent('fluidTheme', { detail: requestedTheme }))
  }
  // -----------------------------------------

}

fluid.get = function (key) {
  return window.localStorage.getItem(key);
}
fluid.set = function (key, val, trigger) {
  if (key.startsWith("pref-")) {
    if ((String(val) == "true") || (String(val) == "false") || (val == undefined)) {
      //boolean value
      if (val == undefined) {
        if (fluid.get(key) !== null) {
          //toggle boolean value
          if (fluid.get(key) == "true") { val = false; } else { val = true; }
        } else {
          //no value to toggle, get value from switch activity
          val = !$("." + key).hasClass("active");
        }
      }
      if (String(val) == "true") {
        $(".switch." + key + ", .btn." + key).addClass("active");
      } else {
        $(".switch." + key + ", .btn." + key).removeClass("active");
      }
    } else {
      //value pref
      $(".btns." + key + " .btn").removeClass("active")
      $(".btns." + key + " .btn." + val).addClass("active")
    }
    if (trigger == undefined) window.localStorage.setItem(key, val);
    if (trigger !== "load") {
      document.dispatchEvent(new CustomEvent(key, { detail: val }));
    }
  } else {
    console.error("Error: Calling fluid.set with invalid prefrence name. Make sure the name of your prefrence starts with 'pref-'. See https://fluid.js.org/#input-prefs.")
  }
}

window.addEventListener('storage', function (e) {
  if (e.key.startsWith("pref-")) {
    fluid.set(e.key, e.newValue, true)
  }
  if (e.key == "fluidTheme") {
    fluid.theme(e.newValue, true)
  }
});

fluid.tcoh = function () {
  $("body").addClass("litleceser");
  $('img').attr('src', 'https://i.imgur.com/uhZT30E.png');
  var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
  link.type = 'image/png';
  link.rel = 'shortcut icon';
  link.href = 'https://i.imgur.com/uhZT30E.png';
  document.getElementsByTagName('head')[0].appendChild(link);
  document.title = "LITTLE CESERS HOT N READY FOR ONLY FIVE DOLALARS EXTRA MOST BESTEST IS ONLY SIX FOR EXTRA CHEESE AND PEPERONI AND THE NATIONS BEST PRICE"
}

fluid.chroma = { on: false, themeLink: false };
fluid.chroma.session = {};
fluid.chroma.supported = function (cb) {
  $.ajax({
    type: "GET",
    url: 'http://localhost:54235/razer/chromasdk',
    success: function () {
      if (cb) cb(true);
    },
    error: function (error) {
      if (cb) cb(false);
    }
  })
}
fluid.chroma.init = function (profile, cb) {
  $.ajax({
    type: "POST",
    url: 'http://localhost:54235/razer/chromasdk',
    dataType: 'json',
    contentType: 'application/json',
    data: `{
          "title": "` + profile.title + `",
          "description": "` + profile.description + `",
          "author": {
              "name": "` + profile.author + `",
              "contact": "` + (profile.domain ? profile.domain : document.location.hostname) + `"
          },
          "device_supported": ` + JSON.stringify([
      "keyboard",
      "mouse",
      "headset",
      "mousepad",
      "keypad",
      "chromalink"]) + `,
          "category": "application"
      }`,
    success: function (res) {
      fluid.chroma.session = res
      setInterval(function () {
        $.ajax({
          type: "PUT",
          url: fluid.chroma.session.uri + "/heartbeat",
          dataType: 'json',
          contentType: 'application/json'
        })
      }, 10000)
      setTimeout(function () {
        $("body").attr("onunload", "fluid.chroma.disable()");
        fluid.chroma.on = true;
        if (cb) cb();
      }, 2000)
    }
  })
}
fluid.chroma.disable = function (cb) {
  if (fluid.chroma.on) {
    $.ajax({
      type: "DELETE",
      url: fluid.chroma.session.uri,
      dataType: 'json',
      contentType: 'application/json',
      success: function () {
        fluid.chroma.on = false;
        fluid.chroma.session = {};
        if (cb) cb();
      }
    })
  }
}
fluid.chroma.effect = function (color, array) {
  //color: static color used for everything except for keyboards
  //array: 2d array for custom effect for keyboards
  fluid.chroma.static(color, true);

  //color to bgr integer
  convertedArray = [];
  for (var i = 0; i < array.length; i++) {
    convertedArray.push([])
    for (var ii = 0; ii < array[i].length; ii++) {
      if (array[i][ii] == 0) {
        convertedArray[i].push(0)
      } else {
        if (array[i][ii] == null) {
          var rgb = tinycolor(color).toRgb();
          convertedArray[i].push(parseInt(tinycolor("rgb(" + rgb.b + ", " + rgb.g + ", " + rgb.r + ")").toHexString().replace("#", "1"), 16))
        } else {
          var rgb = tinycolor(array[i][ii]).toRgb();
          convertedArray[i].push(parseInt(tinycolor("rgb(" + rgb.b + ", " + rgb.g + ", " + rgb.r + ")").toHexString().replace("#", "1"), 16))
        }
      }
    }
  }

  $.ajax({
    type: "PUT",
    url: fluid.chroma.session.uri + "/keyboard",
    dataType: 'json',
    contentType: 'application/json',
    data: `{
      "effect": "CHROMA_CUSTOM",
      "param": ` + JSON.stringify(convertedArray) + `
    }`
  })
}
fluid.chroma.static = function (color, exKeyboard) {
  var rgb = tinycolor(color).toRgb();

  function static(endpoint) {
    $.ajax({
      type: "PUT",
      url: fluid.chroma.session.uri + endpoint,
      dataType: 'json',
      contentType: 'application/json',
      data: `{
      "effect": "CHROMA_STATIC",
      "param": {
          "color": ` + parseInt(tinycolor("rgb(" + rgb.b + ", " + rgb.g + ", " + rgb.r + ")").toHexString().replace("#", "1"), 16) + `
      }
    }`
    })
  }
  if (exKeyboard == undefined) static("/keyboard");
  static("/mouse");
  static("/mousepad");
  static("/headset");
  static("/chromalink");
  static("/keypad");
}


fluid.themePages = function (ele, dir) {
  var themePage = $(ele).parents(".themeSelector").attr("themePage")
  if (dir == +1) {
    themePage++;
    $(ele).parents(".themeSelector").children("span").hide();
    $(ele).parents(".themeSelector").children('.s' + fluid.themePageList[themePage]).show();
    if (themePage == (fluid.themePageList.length - 1)) { $(ele).hide(); } $(ele).siblings(".btn").show();
  } else {
    themePage--;
    $(ele).parents(".themeSelector").children("span").hide();
    $(ele).parents(".themeSelector").children('.s' + fluid.themePageList[themePage]).show();
    if (themePage == 0) { $(ele).hide(); } $(ele).siblings(".btn").show();
  }
  $(ele).parents(".themeSelector").attr("themePage", themePage)
}

fluid.contextMenu = function (target, event) {
  var element = target
  if ($(element).children("a").length == 1) element = $(element).children("a").children("i").get(0);
  if ($(element).siblings(".contextmenu").length == 1) {
    if (event) event.preventDefault();
    if (!fluid.contextMenuOpen) {
      $(element).addClass("outOfContext")
      document.body.style.overflow = "hidden";
      $("body").css("padding-right", "5px");
      fluid.contextMenuOpen = true;
      fluid.generateWrapper();

      var bodyRect = document.body.getBoundingClientRect(),
        elemRect = element.getBoundingClientRect(),
        left = elemRect.left - bodyRect.left - 5,
        top = elemRect.top - bodyRect.top;

      $("#activecontextmenu").css("left", left)
      $("#activecontextmenu").css("top", top)
      $("#activecontextmenu").css("display", "inline-block")
      $("#activecontextmenu").css("background", "transparent")
      $(element).parent().css("height", $(element).parent().height());
      $(element).parent().css("width", $(element).parent().width());
      $(element).parent().css("vertical-align", "middle");
      if ($(element).hasClass("material-icons")) {
        $(element).parent().parent().css("width", "44px")
        $(element).parent().parent().css("height", "44px")
        $("#pagewrapper").attr("onclick", "fluid.exitContextMenu(true);");
      } else {
        $("#pagewrapper").attr("onclick", "fluid.exitContextMenu(false);");
      }
      $(element).parent().addClass("contextMenuSource")
      if ($(element).hasClass("active")) { $(element).css("background-color", "#207bdf") } else {
        if ($("body").hasClass("outline")) {
          if ($("body").hasClass("dark")) { $(element).css("border", "1px solid #16181a") } else { $(element).css("border", "1px solid #dddddd") }
        }
        else { if ($("body").hasClass("dark")) { element.style = "background-color: var(--flex-layer3, #16181a);"; } else { element.style = "background-color: var(--flex-layer3, #dddddd);"; } }
      }
      $(element).siblings(".contextmenu").css("display", "inline-block");
      $(element).siblings(".contextmenu").css("margin-left", "-20px")
      $(element).siblings(".contextmenu").css("margin-right", "10px")
      $(element).parent().children().appendTo("#activecontextmenu");
      $("#activecontextmenu").css("width", $("body").width() - Number($("#activecontextmenu").css("left").slice(0, -2)))
      if ($(element).siblings('.contextmenu').css("right").charAt(0) == "-") {
        $(element).siblings('.contextmenu').css("right", 0)
        $(element).siblings(".contextmenu").css("margin-top", $(element).height() + 3)
      } else {
        $(element).siblings(".contextmenu").css("margin-top", $(element).height())
      }
      $("#pagewrapper").addClass("blur", 100)
    }
  } else {
    if (fluid.expBeh) {
      event.preventDefault();
      fluid.bounceBack(element);
    }
  }
}

fluid.onLoad = function () {
  //NOTE: fluid.onLoad should ONLY be loaded ON PAGE LOAD. Use fluid.init to initialize elements added after page load

  //Unsupported browser alert
  if (window.navigator.userAgent.includes('MSIE ') || window.navigator.userAgent.includes('Trident/')) {
    alert("Internet Explorer is not supported. Please upgrade to a modern browser like Microsoft Edge or Google Chrome.")
    throw "error: unsupported browser";
  }

  //Load initial prefrences
  //NOTE: DO NOT add a prefrence element after page load. It is extremely difficult to maintain good performance while making sure every prefrence element is on the same page
  for (var i = 0; i < Object.keys(window.localStorage).length; i++) {
    if (Object.keys(window.localStorage)[i].startsWith("pref-")) {
      fluid.set(Object.keys(window.localStorage)[i], window.localStorage.getItem(Object.keys(window.localStorage)[i]))
    }
  }

  //Render fluid theme page DOM
  if (typeof fluidThemes !== "undefined") {
    if (typeof fluidThemes[0] !== "object") {
      fluidThemes = [];
    }
    fluid.themePageDOM = [];
    for (var i = 0; i < fluidThemes.length; i++) {
      fluid.themePageDOM.push([]);
      for (var ii = 0; ii < fluidThemes[i].length; ii++) {
        if (typeof fluidThemes[i][ii] == "object") { if (!fluidThemes[i][ii].icon) { fluidThemes[i][ii].icon = "palette"; } fluid.themePageDOM[i].push(`<button onclick="fluid.theme('` + fluidThemes[i][ii].id + `')" class="btn themeWindow flex ` + fluidThemes[i][ii].id.replace("#", "") + `"><div class="themeName"><i class="material-icons">` + fluidThemes[i][ii].icon + `</i> ` + fluidThemes[i][ii].name + `</div></button>`) }
        if (fluidThemes[i][ii] == "midnight") { fluid.themePageDOM[i].push(`<button onclick="fluid.theme('midnight')" class="btn themeWindow flex midnight"><div class="themeName"><i class="material-icons">brightness_3</i> Midnight</div></button>`) }
        if (fluidThemes[i][ii] == "nitro") { fluid.themePageDOM[i].push(`<button onclick="fluid.theme('nitro')" class="btn themeWindow flex nitro"><div class="themeName"><i class="material-icons">whatshot</i> Nitro</div></button>`) }
        if (fluidThemes[i][ii] == "aquatic") { fluid.themePageDOM[i].push(`<button onclick="fluid.theme('aquatic')" class="btn themeWindow flex aquatic"><div class="themeName"><i class="material-icons">pool</i> Aqua</div></button>`) }
        if (fluidThemes[i][ii] == "candy") { fluid.themePageDOM[i].push(`<button onclick="fluid.theme('candy')" class="btn themeWindow flex candy"><div class="themeName"><i class="material-icons">color_lens</i> Candy</div></button>`) }
        if (fluidThemes[i][ii] == "violet") { fluid.themePageDOM[i].push(`<button onclick="fluid.theme('violet')" class="btn themeWindow flex violet"><div class="themeName"><i class="material-icons">terrain</i> Violet</div></button>`) }
        if (fluidThemes[i][ii] == "highContrast") { fluid.themePageDOM[i].push(`<button onclick="fluid.theme('highContrast')" class="btn themeWindow flex highContrast"><div class="themeName"><i class="material-icons">accessibility_new</i> High Contrast</div></button>`) }
        if (fluidThemes[i][ii] == "rainbow") {
          fluid.themePageDOM[i] = [`<button style="background-color: #8e0004 !important;" onclick="fluid.theme('darkRed')" class="btn darkRed gColor"></button>
     <button style="background-color: #8e4b00 !important;" onclick="fluid.theme('darkOrange')" class="btn darkOrange gColor"></button>
     <button style="background-color: #6a5a00 !important;" onclick="fluid.theme('darkYellow')" class="btn darkYellow gColor"></button>
     <button style="background-color: #257300 !important;" onclick="fluid.theme('darkGreen')" class="btn darkGreen gColor"></button>
     <button style="background-color: #0043bf !important;" onclick="fluid.theme('darkBlue')" class="btn darkBlue gColor"></button>
     <button style="background-color: #8100b9 !important;" onclick="fluid.theme('darkPurple')" class="btn darkPurple gColor"></button>`]
        }
      }
    }
  }

  //Legacy (>=v3.x.x) compatibility
  if (getCookie("fluidTheme") !== "") {
    console.warn("[FLUID UI] Detected a legacy Fluid UI Theme cookie. Moving to localStorage...")
    window.localStorage.setItem("fluidTheme", getCookie("fluidTheme"));
    document.cookie = "fluidTheme=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
  }

  fluid.unsetStart = false;
  if (window.localStorage.getItem("fluidTheme") == null) {
    var unset = fluid.theme();
    console.log("[FLUID UI] Unset Fluid Theme: " + unset)
    if (unset == null) {
      fluid.unsetStart = true;
    }
  }

  fluid.init();
}

fluid.init = function () {
  if (typeof fluidThemes !== "undefined") {
    fluid.themePageList = [];
    $(".btns.row.themeSelector").html(`
   <button style="display: none;" onclick="fluid.themePages(this, -1);" class="btn arrow leftArrow"><i class="material-icons">keyboard_arrow_left</i></button>
   <span class="s0">
   <button onclick="fluid.theme('auto')" class="btn themeWindow auto ` + ((new Date().getHours() > fluid.auto.darkEndAM) && (new Date().getHours() < fluid.auto.darkStartPM) ? "lightBox" : "darkBox") + `"><div class="themeName"><i class="material-icons">brightness_auto</i> Auto</div></button>
   <button onclick="fluid.theme('light')" class="btn themeWindow light lightBox"><div class="themeName"><i class="material-icons">brightness_high</i> Light</div></button>
   <button onclick="fluid.theme('dark')" class="btn themeWindow dark darkBox"><div class="themeName"><i class="material-icons">brightness_low</i> Dark</div></button>
   </span>
   ` + fluid.themePageDOM.map(function (key, i) {
      return `<span style="display:none;" class="s` + (i + 1) + `">
     ` + key.join("") + `
     </span>`
    }).join("") + `
   <button onclick="fluid.themePages(this, +1);" class="btn arrow rightArrow"><i class="material-icons">keyboard_arrow_right</i></button>
   `);
    $(".themeWindow").prepend(`<div class="demoSecText"></div><div class="demoSecText short"></div><div class="demoBtn"><div class="demoBtnText"></div></div><div class="demoSwitch"><div class="demoHead"></div></div>`)
    $(".themeSelector").attr("themePage", 0)
    for (var i = 0; i < ($('.themeSelector').children().length - 2); i++) {
      if ($('.themeSelector .s' + i).children().length) fluid.themePageList.push(i);
    }
  }

  if (window.localStorage.getItem("fluidTheme") !== null) {
    fluid.theme(window.localStorage.getItem("fluidTheme"), true)
  } else {
    if ((fluid.theme() == null) && fluid.unsetStart) {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        fluid.theme("dark", true);
      } else {
        fluid.theme("auto", true);
      }
    }
  }

  if (!$("body").hasClass("notwemoji")) {
    $.getScript("https://twemoji.maxcdn.com/2/twemoji.min.js?12.0.4", function () {
      if (typeof twemoji !== "undefined") twemoji.parse(document.body);
    })
  }

  $(".btns:not(.themeSelector) .btn:not(.manual):not([init='true']), .list.select .item:not(.manual):not([init='true']), .sidenav .item:not(.manual):not([init='true']), .sidebar .item:not(.manual):not([init='true'])").click(function (event) {
    if ($(event.target).parent().hasClass("multiple")) {
      $(this).toggleClass("active")
    } else {
      $(this).siblings().removeClass("active")
      $(this).addClass("active")
    }
    $(this).attr("init", "true")
  });

  $(".sidebar .collapse:not([init='true'])").click(function() {
    $('body').toggleClass('collapsedSidebar');
    if ($('body').hasClass('collapsedSidebar')) {
      $(this).html(`<i class="material-icons">keyboard_arrow_right</i>`);
    } else {
      $(this).html(`<i class="material-icons">keyboard_arrow_left</i>`);
    }
    $(this).attr("init", "true");
  })

  fluid.shouldSwitch = true;
  $(".switch:not([init='true'])").click(function (event) {
    if ($(event.target).hasClass("head")) {
      var ele = $(event.target).parent();
    } else { var ele = event.target }
    if (fluid.shouldSwitch && !$(ele).attr("class").includes("pref-")) {
      $(ele).toggleClass("active");
      fluid.shouldSwitch = false;
      setTimeout(() => fluid.shouldSwitch = true, 400)
    }
    $(this).attr("init", "true")
  });

  $("#activecontextmenu:not([init='true'])").contextmenu(function (event) {
    event.preventDefault();
    $(this).attr("init", "true")
  });

  $(".btn:not([init='true']), .nav a:not([init='true']), .nav li:not([init='true'])").contextmenu(function (event) {
    fluid.contextMenu(event.target, event)
    $(this).attr("init", "true")
  });

  $(".contextmenu.list .item:not([init='true'])").click(function (event) {
    fluid.exitContextMenu(false);
    $(this).attr("init", "true")
  });

  $("div.nav.active li:not([init='true'])").click(function (event) {
    $(this).siblings().removeClass("active")
    $(this).addClass("active")
    $(this).attr("init", "true")
  });

  $(".section.collapse .header:not([init='true'])").click(function (event) {
    if ($(this).parent().hasClass("collapsed")) {
      if ($(this).parent().hasClass("one")) {
        $(this).parent().siblings().addClass("collapsed");
      }
    }
    $(this).parent().toggleClass("collapsed");
    $(this).attr("init", "true")
  });

  if (fluid.expBeh) {
    //experimental behavior
    $(".list .item:not([init='true']), a:not([init='true'])").contextmenu(function (event) {
      event.preventDefault(); fluid.bounceBack(event.target);
      $(this).attr("init", "true")
    });
  }
}



$(document).ready(function() {
  if (typeof fluidAutoLoad !== "undefined") {
    if (fluidAutoLoad !== false) {
      fluid.onLoad();
    }
  } else {
    fluid.onLoad();
  }
});

$(window).resize(function () {
  fluid.exitContextMenu(true);
});

fluid.exitContextMenu = function (force) {
  if (fluid.contextMenuOpen) {
    $("#pagewrapper").removeClass("blur")
    $("#activecontextmenu").children(".contextmenu").css("display", "none");
    if (force) { wait = 0; } else { wait = 300; }
    setTimeout(function () {
      $("#activecontextmenu").children().appendTo(".contextMenuSource")
      $(".contextMenuSource").children(".btn, i").css("background-color", "");
      $(".contextMenuSource").children(".btn, i").css("border", "");
      $(".contextMenuSource").children(".btn, i").removeClass("outOfContext")
      $(".contextMenuSource").css("height", "");
      $("#pagewrapper").attr("onclick", "");
      $(".contextMenuSource").removeClass("contextMenuSource")
      fluid.contextMenuOpen = false;
      document.body.style.overflow = "";
      $("body").css("padding-right", "");
    }, wait);
  }
}

fluid.bounceBack = function (ele) {
  if (!fluid.contextMenuOpen) {
    fluid.contextMenuOpen = true;

    $("#pagewrapper").addClass("blur")
    document.body.style.overflow = "hidden";
    $("body").css("padding-right", "5px");
    setTimeout(function () {
      $("#pagewrapper").removeClass("blur");
      document.body.style.overflow = "";
      $("body").css("padding-right", "");
    }, 200)
  }
}

/* Cards */
menuopen = false;
fluid.cards = function (element, isModal) {
  var focus = $(element).hasClass('focus');
  if (focus) {
    fluid.generateWrapper();
    $(element).css("top", "50px");
    if (menuopen) {
      fluid.cards.close(".focus");
      $("#pagewrapper").addClass('blur');
      if (isModal) document.body.style.overflow = "hidden"
      $("body").css("padding-right", "5px");
      $(element).removeClass('close');
      setTimeout(function () { $("#pagewrapper").attr("onclick", "fluid.card.close('" + element + "');"); }, 100)
    } else {
      $("#pagewrapper").addClass('blur');
      if (isModal) document.body.style.overflow = "hidden"
      $("body").css("padding-right", "5px");
      $(element).removeClass('close');
      setTimeout(function () { $("#pagewrapper").attr("onclick", "fluid.cards.close('.focus');"); }, 100)
    }
  } else {
    $("#pagewrapper").attr("onclick", "");
    if (menuopen) {
      fluid.cards.close();
      $(element).removeClass('close');
    } else {
      menuopen = true;
      $(element).removeClass('close');
    }
  }
}
fluid.modal = function (element) {
  fluid.cards(element, true)
}
fluid.toast = function (icon, text, sticky, focus) {
  fluid.toastNav = $(".nav:not(.toast):not(.card):visible")
  $(fluid.toastNav).hide();
  var iconExtraStyles = ""
  if (text == undefined) { var text = ""; }
  if (icon == undefined) { var icon = ""; }
  if (text == "") { var iconExtraStyles = "margin-right: -15px;"; }
  fluid.generateWrapper();
  $("#activetoast").hide();
  $("#activetoast").html(`<div class="nav sticky toast">
   <i onclick="fluid.exitToast()" class="material-icons" style="vertical-align: middle;cursor:pointer;` + iconExtraStyles + `">` + icon + `</i>
   <h5 style="margin:0px;display:inline-block;vertical-align:middle;margin-right: 7px;margin-left: 5px;">` + text + `</h5>
       </div>`)
  $("#activetoast").show("fade");
  fluid.toastHiding = false;
  $(".toast").hover(
    function () {
      $(".toast i").html("cancel")
    }, function () {
      if (!fluid.toastHiding) $(".toast i").html(icon)
    }
  );
}
fluid.exitToast = function () {
  $(fluid.toastNav).show();
  var iconExtraStyles = ""
  fluid.toastHiding = true;
  $("#activetoast").hide("fade");
}
fluid.cards.close = function (element) {
  $(element).addClass('close');
  $('#pagewrapper').removeClass("blur");
  document.body.style.overflow = ""
  $("body").css("padding-right", "");
  $("#pagewrapper").attr("onclick", "");
  menuopen = false;
}
fluid.generateWrapper = function () {
  if (!$("#pagewrapper").length) {
    $("body").wrapInner("<div id='pagewrapper'></div>");
    $("#pagewrapper").after("<div id='focuscardwrapper' class='container'></div>");
    $("#pagewrapper").after("<div id='activecontextmenu' style='position:absolute'></div>");
    $("#pagewrapper").after("<div id='activetoast'></div>");
    $("#pagewrapper").after("<div id='splashscreen' style='display:none;margin-top: 100px;' class='container'><h1 style='font-size:5rem;' id='splashscreenname'></h1><div id='splashscreencnt'></div></div>");
    $(".card.focus").appendTo("#focuscardwrapper");
    $(".splash").appendTo("#splashscreencnt");
  }
}
fluid.splash = function (element) {
  fluid.splashScroll = window.scrollY;
  fluid.generateWrapper();
  $("#pagewrapper").hide();
  var title = $(element).attr("title");
  $("#splashscreenname").html(title);
  $(element).show();
  $("#splashscreen").show();
}
fluid.unsplash = function () {
  $("#splashscreen").hide();
  $("#splashscreenname").html("");
  $(".splash").hide();
  $("#pagewrapper").show();
  window.scrollTo(0, fluid.splashScroll);
}

/* Fluid Commands */
// a key map of allowed keys
var allowedKeys = {
  38: 'up',
  40: 'down',
  119: 'f8'
};
var darkOverride = ['up', 'up', 'down', 'down', 'f8'];
var darkOverridePosition = 0;

var allowedKeysAuto = {
  38: 'up',
  40: 'down',
  118: 'f7'
};
var autoOverride = ['up', 'up', 'down', 'down', 'f7'];
var autoOverridePosition = 0;



document.addEventListener('keydown', function (e) {
  var key = allowedKeys[e.keyCode];
  var requiredKey = darkOverride[darkOverridePosition];
  if (key == requiredKey) {
    darkOverridePosition++;
    if (darkOverridePosition == darkOverride.length) {
      fluid.theme("toggle");
      darkOverridePosition = 0;
    }
  } else {
    darkOverridePosition = 0;
  }

  var key = allowedKeysAuto[e.keyCode];
  var requiredKey = autoOverride[autoOverridePosition];
  if (key == requiredKey) {
    autoOverridePosition++;
    if (autoOverridePosition == autoOverride.length) {
      fluid.theme("auto");
      autoOverridePosition = 0;
    }
  } else {
    autoOverridePosition = 0;
  }

});
