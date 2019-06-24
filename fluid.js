/*!
Fluid UI JavaScript Modules v3.9.1
Copyright (c) 2017-2019 jottocraft
Licenced under the MIT License (https://github.com/jottocraft/fluid/blob/master/LICENSE)
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

fluid.includedFlexThemes = ["midnight", "nitro", "aquatic", "highContrast", "candy", "violet"]
fluid.theme = function (theme, dontSave) {
  if (theme == "toggle") { if ($("body").hasClass("dark")) { theme = "light"; } else { theme = "dark"; } }
  $(".btns.themeSelector .btn").removeClass("active");
  if (theme) { $(".btns.themeSelector .btn." + theme.replace("#", "")).addClass("active"); }
  classes = document.body.classList.value.split(" ");
  for (var ii = 0; ii < classes.length; ii++) { if ((classes[ii].startsWith("light") || classes[ii].startsWith("dark")) && ((classes[ii] !== "dark") && (classes[ii] !== "light"))) { $("body").removeClass(classes[ii]) } }
  document.body.style = "";
  if (theme) {
    for (var i = 0; i < fluid.includedFlexThemes.length; i++) $("body").removeClass(fluid.includedFlexThemes[i])

    //apply theme
    if (theme == "dark") { $("body").addClass("dark"); $("body").removeClass("light"); }
    if (theme == "light") { $("body").removeClass("dark"); $("body").addClass("light"); }
    if (fluid.includedFlexThemes.includes(theme)) { $("body").addClass("dark"); $("body").removeClass("light"); $("body").addClass(theme); }
    if (theme == "highContrast") { $("body").removeClass("dark"); $("body").addClass("light"); }
    if (String(theme).startsWith("light")) { $("body").removeClass("dark"); $("body").addClass("light"); $("body").addClass(theme); }
    if (String(theme).startsWith("dark")) { $("body").addClass("dark"); $("body").removeClass("light"); $("body").addClass(theme); }
    if ((String(theme).startsWith("dark") && (theme !== "dark")) || (String(theme).startsWith("light") && (theme !== "light")) || (fluid.includedFlexThemes.includes(theme))) { $("body").addClass("flex"); } else { $("body").removeClass("flex"); }
    if (theme == "auto") {
      var hours = new Date().getHours()
      if (hours > fluid.auto.darkEndAM && hours < fluid.auto.darkStartPM) {
        $("body").removeClass("dark");
        $("body").addClass("light");
      } else {
        $("body").addClass("dark");
        $("body").removeClass("light");
      }
    }
    if (String(theme).startsWith("#")) {
      var baseColor = theme.slice(1)
      console.warn("[FLUID UI] Using fluid.theme to generate a theme based on a color. This function should be used for demo purposes only. Do not use this function on an actual site.")
      var color = tinycolor(baseColor)
      document.body.style.setProperty("--flex-light", tinycolor(baseColor).brighten(10).toString())
      document.body.style.setProperty("--flex-bg", tinycolor(baseColor).brighten(5).toString())
      if (tinycolor(baseColor).isLight()) {
        var colorDark = "black";
        document.body.style.setProperty("--flex-text", "black")
        $("body").removeClass("dark")
        $("body").addClass("light");
      } else {
        var colorDark = "white";
        document.body.style.setProperty("--flex-text", "white")
        $("body").addClass("dark")
        $("body").removeClass("light");
      }
      var colorDesc = "dark";
      if (colorDark == "black") var colorDesc = "light";
      document.body.style.setProperty("--flex-layer1", tinycolor(baseColor).darken(5).toString())
      document.body.style.setProperty("--flex-layer2", tinycolor(baseColor).darken(10).toString())
      document.body.style.setProperty("--flex-layer3", tinycolor(baseColor).darken(15).toString())
      document.body.style.setProperty("--theme-color", colorDark)
      document.body.style.setProperty("--flex-sectext", tinycolor(baseColor).brighten(40).desaturate(50).toString())
      document.body.style.setProperty("--theme-color-outline", colorDark + `c0`)
      document.body.style.setProperty("--theme-text-color", tinycolor(baseColor).brighten(10).toString())
      $("#genTheme").html(`<code>/* Set this CSS on your Fluid site to use your generated Flex Theme */
  
     body.` + colorDesc + `NewTheme {
         --flex-light: ` + tinycolor(baseColor).brighten(10).toString() + `;
         --flex-bg: ` + tinycolor(baseColor).brighten(5).toString() + `;
         --flex-text: ` + colorDark + `;
         --flex-sectext: ` + tinycolor(baseColor).brighten(40).desaturate(50).toString() + `;
         --flex-layer1: ` + tinycolor(baseColor).darken(5).toString() + `;
         --flex-layer2: ` + tinycolor(baseColor).darken(10).toString() + `;
         --flex-layer3: ` + tinycolor(baseColor).darken(15).toString() + `;
         --theme-color: ` + colorDark + `;
         --theme-color-outline: ` + tinycolor(colorDark).toHexString() + `c0;
         --theme-text-color: ` + tinycolor(baseColor).brighten(10).toString() + `;
     }</code>`);
      $("body").addClass("flex");
    }

    //change context menu css for new theme
    if ($("#activecontextmenu").children(".btn").hasClass("active")) { $("#activecontextmenu").children(".btn").css("background-color", "#207bdf") } else {
      if ($("#activecontextmenu").length) { if ($("#activecontextmenu").children().length == 2) { if ($("body").hasClass("dark")) { $("#activecontextmenu").children(".btn, i")[0].style = "background-color: var(--flex-layer3, #16181a);" } else { $("#activecontextmenu").children(".btn, i")[0].style = "background-color: var(--flex-layer3, #dddddd);" } } }
    }

    //save theme prefrence
    if (dontSave !== true) { localStorage.setItem("fluidTheme", theme); }
  }

  //Load acrylic variables
  if (typeof tinycolor !== "undefined") {
    //acrylic supported (tinycolor library loaded)
    var acrylicBase = getComputedStyle(document.body).getPropertyValue("--acrylic");
    if (acrylicBase == "") acrylicBase = getComputedStyle(document.body).getPropertyValue("--background");
    document.documentElement.style.setProperty("--acrylic10", tinycolor(acrylicBase).setAlpha(0.1).toRgbString())
    document.documentElement.style.setProperty("--acrylic50", tinycolor(acrylicBase).setAlpha(0.5).toRgbString())
    document.documentElement.style.setProperty("--acrylic50-fallback", tinycolor(acrylicBase).setAlpha(0.9).toRgbString())
    document.documentElement.style.setProperty("--acrylicSecText", tinycolor(getComputedStyle(document.body).getPropertyValue("--text")).setAlpha(0.3).toRgbString())
  }

  if (theme) {
    //emit theme change event
    document.dispatchEvent(new CustomEvent('fluidTheme', { detail: theme }))
  }

  if (theme == undefined) {
    //get current theme
    var activeTheme = null;
    var bodyClass = $(document.body).attr("class");
    if ($("body").hasClass("dark")) var activeTheme = "dark";
    if ($("body").hasClass("light")) var activeTheme = "light";
    //check for included flex themes
    for (var i = 0; i < fluid.includedFlexThemes.length; i++) {
      if (bodyClass.includes(fluid.includedFlexThemes[i])) {
        activeTheme = fluid.includedFlexThemes[i];
      }
    }
    //check for custom flex themes
    for (var i = 0; i < document.body.classList.length.length; i++) { if (document.body.classList.length[i].startsWith("light")) { var activeTheme = document.body.classList.length[i] } if (document.body.classList.length[i].startsWith("dark")) { var activeTheme = document.body.classList.length[i] } }
    if (activeTheme) { $(".btns.themeSelector .btn." + activeTheme.replace("#", "")).addClass("active"); }
    return activeTheme;
  }

}
fluid.isOutlined = function () {
  return $("body").hasClass("outline");
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
/* Loader auto initilization */
setTimeout(function () {
  try {
    $("loader").html('<div class="bubblingG"><span id="bubblingG_1"></span><span id="bubblingG_2"></span><span id="bubblingG_3"></span></div>');
  }
  catch (err) {
  }
}, 1);
fluid.load = function (mode) {
  if (mode) {
    $("loader").removeClass("hidden");
  } else {
    $("loader").addClass("hidden");
  }
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
fluid.init = function () {
  if ((window.navigator.userAgent.indexOf('MSIE ') > 0) || (window.navigator.userAgent.indexOf('Trident/') > 0)) {
    alert("Internet Explorer is not supported. Please upgrade to a modern browser like Microsoft Edge or Google Chrome.")
    throw "error: unsupported browser";
  }
  if ($("body").hasClass("hasSidebar") && (window.innerWidth < 1000)) {
    $("body").addClass("collapsedSidebar")
  } else {
    $("body").removeClass("collapsedSidebar")
  }
  for (var i = 0; i < Object.keys(window.localStorage).length; i++) {
    if (Object.keys(window.localStorage)[i].startsWith("pref-")) {
      fluid.set(Object.keys(window.localStorage)[i], window.localStorage.getItem(Object.keys(window.localStorage)[i]))
    }
  }
  window.onresize = function (event) {
    if ($("body").hasClass("hasSidebar") && (window.innerWidth < 1000)) {
      $("body").addClass("collapsedSidebar")
    } else {
      $("body").removeClass("collapsedSidebar")
    }
  };
  if (typeof fluidThemes !== "undefined") {
    if (typeof fluidThemes[0] == "string") {
      fluidThemes = [];
    }
    var flexDom = [];
    var pages = [];
    for (var i = 0; i < fluidThemes.length; i++) {
      pages.push([]);
      for (var ii = 0; ii < fluidThemes[i].length; ii++) {
        if (typeof fluidThemes[i][ii] == "object") { if (!fluidThemes[i][ii].icon) { fluidThemes[i][ii].icon = "palette"; } pages[i].push(`<button onclick="fluid.theme('` + fluidThemes[i][ii].id + `')" class="btn themeWindow flex ` + fluidThemes[i][ii].id.replace("#", "") + `"><div class="themeName"><i class="material-icons">` + fluidThemes[i][ii].icon + `</i> ` + fluidThemes[i][ii].name + `</div></button>`) }
        if (fluidThemes[i][ii] == "midnight") { pages[i].push(`<button onclick="fluid.theme('midnight')" class="btn themeWindow flex midnight"><div class="themeName"><i class="material-icons">brightness_3</i> Midnight Black</div></button>`) }
        if (fluidThemes[i][ii] == "nitro") { pages[i].push(`<button onclick="fluid.theme('nitro')" class="btn themeWindow flex nitro"><div class="themeName"><i class="material-icons">whatshot</i> Nitro</div></button>`) }
        if (fluidThemes[i][ii] == "aquatic") { pages[i].push(`<button onclick="fluid.theme('aquatic')" class="btn themeWindow flex aquatic"><div class="themeName"><i class="material-icons">pool</i> Aqua</div></button>`) }
        if (fluidThemes[i][ii] == "candy") { pages[i].push(`<button onclick="fluid.theme('candy')" class="btn themeWindow flex candy"><div class="themeName"><i class="material-icons">color_lens</i> Candy</div></button>`) }
        if (fluidThemes[i][ii] == "violet") { pages[i].push(`<button onclick="fluid.theme('violet')" class="btn themeWindow flex violet"><div class="themeName"><i class="material-icons">terrain</i> Violet</div></button>`) }
        if (fluidThemes[i][ii] == "highContrast") { pages[i].push(`<button onclick="fluid.theme('highContrast')" class="btn themeWindow flex highContrast"><div class="themeName"><i class="material-icons">accessibility_new</i> High Contrast</div></button>`) }
        if (fluidThemes[i][ii] == "rainbow") {
          pages[i] = [`<button style="background-color: #8e0004 !important;" onclick="fluid.theme('darkRed')" class="btn darkRed gColor"></button>
     <button style="background-color: #8e4b00 !important;" onclick="fluid.theme('darkOrange')" class="btn darkOrange gColor"></button>
     <button style="background-color: #6a5a00 !important;" onclick="fluid.theme('darkYellow')" class="btn darkYellow gColor"></button>
     <button style="background-color: #257300 !important;" onclick="fluid.theme('darkGreen')" class="btn darkGreen gColor"></button>
     <button style="background-color: #0043bf !important;" onclick="fluid.theme('darkBlue')" class="btn darkBlue gColor"></button>
     <button style="background-color: #8100b9 !important;" onclick="fluid.theme('darkPurple')" class="btn darkPurple gColor"></button>`]
        }
      }
    }
    fluid.themePageList = [];
    $(".btns.row.themeSelector").html(`
   <button style="display: none;" onclick="fluid.themePages(this, -1);" class="btn arrow leftArrow"><i class="material-icons">keyboard_arrow_left</i></button>
   <span class="s0">
   <button onclick="fluid.theme('auto')" class="btn themeWindow auto ` + ((new Date().getHours() > fluid.auto.darkEndAM) && (new Date().getHours() < fluid.auto.darkStartPM) ? "lightBox" : "darkBox") + `"><div class="themeName"><i class="material-icons">brightness_auto</i> Auto</div></button>
   <button onclick="fluid.theme('light')" class="btn themeWindow light lightBox"><div class="themeName"><i class="material-icons">brightness_high</i> Light</div></button>
   <button onclick="fluid.theme('dark')" class="btn themeWindow dark darkBox"><div class="themeName"><i class="material-icons">brightness_low</i> Dark</div></button>
   </span>
   ` + pages.map(function (key, i) {
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

  //Legacy (>=v3.x.x) compatibility
  if (getCookie("fluidTheme") !== "") {
    console.warn("[FLUID UI] Detected a legacy Fluid UI Theme cookie")
    window.localStorage.setItem("fluidTheme", getCookie("fluidTheme"));
    document.cookie = "fluidTheme=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
  }
  fluid.unsetStart = false;
  if (window.localStorage.getItem("fluidTheme") !== null) {
    fluid.theme(window.localStorage.getItem("fluidTheme"), true)
  } else {
    var unset = fluid.theme(undefined, "unsetStat");
    console.log(unset)
    if (unset == null) {
      fluid.unsetStart = true;
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

  $("loader").html('<div class="bubblingG"><span id="bubblingG_1"></span><span id="bubblingG_2"></span><span id="bubblingG_3"></span></div>');
  $(".btns:not(.themeSelector) .btn:not(.manual), .list.select .item:not(.manual), .sidenav .item:not(.manual), .sidebar .item:not(.manual)").click(function (event) {
    if ($(event.target).parent().hasClass("multiple")) {
      $(this).toggleClass("active")
    } else {
      $(this).siblings().removeClass("active")
      $(this).addClass("active")
    }
  });
  fluid.shouldSwitch = true;
  $(".switch").click(function (event) {
    if ($(event.target).hasClass("head")) {
      var ele = $(event.target).parent();
    } else { var ele = event.target }
    if (fluid.shouldSwitch && !$(ele).attr("class").includes("pref-")) {
      $(ele).toggleClass("active");
      fluid.shouldSwitch = false;
      setTimeout(() => fluid.shouldSwitch = true, 400)
    }
  });
  $("#activecontextmenu").contextmenu(function (event) {
    event.preventDefault();
  });
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
  $(".btn, .nav a, .nav li").contextmenu(function (event) {
    fluid.contextMenu(event.target, event)
  });
  $(".contextmenu.list .item").click(function (event) {
    fluid.exitContextMenu(false);
  });
  $("div.nav.active li").click(function (event) {
    $(this).siblings().removeClass("active")
    $(this).addClass("active")
  });

  $(".section.collapse .header").click(function (event) {
    if ($(this).parent().hasClass("collapsed")) {
      if ($(this).parent().hasClass("one")) {
        $(this).parent().siblings().addClass("collapsed");
      }
    }
    $(this).parent().toggleClass("collapsed");
  });

  $(".list .item, a").contextmenu(function (event) {
    if (fluid.expBeh) { event.preventDefault(); fluid.bounceBack(event.target); }
  });

}



$(document).ready(fluid.init);

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
      $("body").removeClass("nitro");
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
      $("body").removeClass("nitro");
      autoOverridePosition = 0;
    }
  } else {
    autoOverridePosition = 0;
  }

});



// a key map of allowed keys
var outlineKeysAuto = {
  38: 'up',
  40: 'down',
  120: 'f9'
};
var outlineOverride = ['up', 'up', 'down', 'down', 'f9'];
var outlineOverridePosition = 0;
document.addEventListener('keydown', function (e) {
  var key = outlineKeysAuto[e.keyCode];
  var requiredKey = outlineOverride[outlineOverridePosition];
  if (key == requiredKey) {
    outlineOverridePosition++;
    if (outlineOverridePosition == outlineOverride.length) {
      $('body').toggleClass('outline');
      outlineOverridePosition = 0;
    }
  } else {
    outlineOverridePosition = 0;
  }
});

// a key map of allowed keys
var emojiKeysAuto = {
  38: 'up',
  40: 'down',
  69: 'e'
};
var emojiOverride = ['up', 'up', 'down', 'down', 'e'];
var emojiOverridePosition = 0;
document.addEventListener('keydown', function (e) {
  var key = emojiKeysAuto[e.keyCode];
  var requiredKey = emojiOverride[emojiOverridePosition];
  if (key == requiredKey) {
    emojiOverridePosition++;
    if (emojiOverridePosition == emojiOverride.length) {
      twemoji.parse(document.body);
      emojiOverridePosition = 0;
    }
  } else {
    emojiOverridePosition = 0;
  }
});

// a key map of allowed keys
var nitroKeysAuto = {
  38: 'up',
  40: 'down',
  78: 'n'
};
var nitroOverride = ['up', 'up', 'down', 'down', 'n'];
var nitroOverridePosition = 0;
document.addEventListener('keydown', function (e) {
  var key = nitroKeysAuto[e.keyCode];
  var requiredKey = nitroOverride[nitroOverridePosition];
  if (key == requiredKey) {
    nitroOverridePosition++;
    if (nitroOverridePosition == nitroOverride.length) {
      $("body").toggleClass("nitro");
      $("body").addClass("dark");
      nitroOverridePosition = 0;
    }
  } else {
    nitroOverridePosition = 0;
  }
});

// a key map of allowed keys
var midnightKeysAuto = {
  38: 'up',
  40: 'down',
  77: 'm'
};
var midnightOverride = ['up', 'up', 'down', 'down', 'm'];
var midnightOverridePosition = 0;
document.addEventListener('keydown', function (e) {
  var key = midnightKeysAuto[e.keyCode];
  var requiredKey = midnightOverride[midnightOverridePosition];
  if (key == requiredKey) {
    midnightOverridePosition++;
    if (midnightOverridePosition == midnightOverride.length) {
      $("body").toggleClass("midnight");
      $("body").addClass("dark");
      midnightOverridePosition = 0;
    }
  } else {
    midnightOverridePosition = 0;
  }
});
