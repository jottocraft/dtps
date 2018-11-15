/*!
Fluid UI JavaScript Modules v2.9.4-9.5 [INTERNAL DEVELOPMENT VERSION. FOR DEMONSTRATION PURPOSES ONLY]
!!!THIS VERSION OF FLUID UI SHOULD *NOT* BE DEPLOYED ON ANY EXTERNAL SITE FOR ANY REASON!!!

Copyright (c) 2017-2018 jottocraft

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
 */
 function getCookie(cname) {
     var name = cname + "=";
     var decodedCookie = decodeURIComponent(document.cookie);
     var ca = decodedCookie.split(';');
     for(var i = 0; i <ca.length; i++) {
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

fluid = new Object;
fluid.cloudEnabled = true;
fluid.contextMenuOpen = false;

fluid.theme = function(theme, dontSave) {
  $(".btns.themeSelector .btn").removeClass("active");
  if (!String(theme).startsWith("#")) { $(".btns.themeSelector .btn." + theme).addClass("active"); }
  if (theme == undefined) {
    if (dontSave !== "unsetStat") { var activeTheme = "light"; } else { var activeTheme = "unset"; }
    var classes = document.body.classList;
    if ($("body").hasClass("dark")) var activeTheme = "dark";
    if ($("body").hasClass("light")) var activeTheme = "light";
    if ($("body").hasClass("nitro")) var activeTheme = "nitro";
    if ($("body").hasClass("midnight")) var activeTheme = "midnight";
    if ($("body").hasClass("aquatic")) var activeTheme = "aquatic";
    for (var i = 0; i < classes.length; i++) { if (classes[i].startsWith("flex")) { var activeTheme = classes[i].slice(4) } }
    return activeTheme;
  }
  $("body").removeClass("midnight");
  $("body").removeClass("nitro");
  $("body").removeClass("aquatic");
  if (theme == "toggle") { $("body").toggleClass("dark"); if ($("body").hasClass("dark")) { var theme = "dark"; } else { var theme = "light"; } }
  if (theme == "dark") { $("body").addClass("dark"); }
  if (theme == "light") { $("body").removeClass("dark"); }
  if (theme == "midnight") { $("body").addClass("dark"); $("body").addClass("midnight"); }
  if (theme == "nitro") { $("body").addClass("dark"); $("body").addClass("nitro"); }
  if (theme == "aquatic") { $("body").addClass("dark"); $("body").addClass("aquatic"); }
  if (String(theme).startsWith("flex")) { $("body").addClass("dark"); $("body").addClass(theme); }
  if (theme == "auto") {
    var hours = new Date().getHours()
    // Light: 6AM - 5PM Dark: 6PM - 5AM
    if (hours > 5 && hours < 18) {
      $("body").removeClass("dark");
    } else {
      $("body").addClass("dark");
    }
  }
  if (String(theme).startsWith("#")) {
    var baseColor = theme.slice(1)
    console.warn("[Fluid UI] Using fluid.theme to generate a theme based on a color. This function should only be used for demo purposes only. Do not use this function on an actual site.")
    jQuery.getScript("https://bgrins.github.io/TinyColor/tinycolor.js", function() {
      var color = tinycolor(baseColor)
      document.body.style.setProperty("--flex-light", tinycolor(baseColor).brighten(10).toString())
      document.body.style.setProperty("--flex-bg", tinycolor(baseColor).brighten(5).toString())
      if (tinycolor(baseColor).isLight()) {
        var colorDark = "black";
        document.body.style.setProperty("--flex-text", "black")
        $("body").removeClass("dark")
      } else {
        var colorDark = "white";
        document.body.style.setProperty("--flex-text", "white")
        $("body").addClass("dark")
      }
      document.body.style.setProperty("--flex-layer1", tinycolor(baseColor).darken(5).toString())
      document.body.style.setProperty("--flex-layer2", tinycolor(baseColor).darken(10).toString())
      document.body.style.setProperty("--flex-layer3", tinycolor(baseColor).darken(15).toString())
      document.body.style.setProperty("--theme-color", colorDark)
      document.body.style.setProperty("--theme-color-outline", colorDark + `c0`)
      document.body.style.setProperty("--theme-text-color", tinycolor(baseColor).brighten(10).toString())
      $("#genTheme").html(`<code>/* Set this CSS on your Fluid site to use your generated Flex Theme */

    body.flexNewTheme {
        --flex-light: ` +  tinycolor(baseColor).brighten(10).toString() + `;
        --flex-bg: ` + tinycolor(baseColor).brighten(5).toString() + `;
        --flex-text: ` + colorDark + `;
        --flex-layer1: ` + tinycolor(baseColor).darken(5).toString() + `;
        --flex-layer2: ` + tinycolor(baseColor).darken(10).toString() + `;
        --flex-layer3: ` + tinycolor(baseColor).darken(15).toString() + `;
        --theme-color: ` +  colorDark + `;
        --theme-color-outline: ` +  tinycolor(colorDark).toHexString() + `c0;
        --theme-text-color: ` + tinycolor(baseColor).brighten(10).toString() + `;
    }</code>`);
    });
  }
  if (theme !== undefined) {
  if ($("#activecontextmenu").children(".btn").hasClass("active")) {$("#activecontextmenu").children(".btn").css("background-color", "#207bdf") } else {
  if ($("#activecontextmenu").length) { if ($("#activecontextmenu").children().length == 2) { if ($("body").hasClass("dark")) { $("#activecontextmenu").children(".btn, i")[0].style = "background-color: var(--flex-layer3, #16181a);" } else { $("#activecontextmenu").children(".btn, i")[0].style = "background-color: var(--flex-layer3, #dddddd);" } } } }
  if (dontSave !== true) localStorage.setItem("fluidTheme", theme)
}
}
fluid.isOutlined = function() {
  return $("body").hasClass("outline");
}
fluid.tcoh = function() {
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
try { $("loader").html('<div class="bubblingG"><span id="bubblingG_1"></span><span id="bubblingG_2"></span><span id="bubblingG_3"></span></div>');
}
catch(err) {
}
}, 1);
fluid.load = function(mode) {
  if (mode) {
    $("loader").removeClass("hidden");
  } else {
    $("loader").addClass("hidden");
  }
}
fluid.init = function() {
  $( ".btns.row.themeSelector" ).html(`
    <div onclick="fluid.theme('auto')" class="btn auto"><i class="material-icons">brightness_auto</i> Auto</div>
    <div onclick="fluid.theme('light')" class="btn light"><i class="material-icons">brightness_high</i> Light</div>
    <div onclick="fluid.theme('dark')" class="btn dark"><i class="material-icons">brightness_low</i> Dark</div>
    <div onclick="fluid.theme('midnight')" class="btn midnight"><i class="material-icons">brightness_3</i> Midnight Black</div>
    `);

  if (window.localStorage.fluidTheme) {
    fluid.theme(window.localStorage.fluidTheme, true)
  } else {
    if (fluid.theme(undefined, "unsetStat") == "unset") fluid.theme("auto", true);
  }

  $( ".btns:not(.themeSelector) .btn, .list.select .item, .sidenav .item" ).click(function(event) {
  if ($(event.target).parent().hasClass("multiple")) {
    $(this).toggleClass("active")
  } else {
  $(this).siblings().removeClass("active")
  $(this).addClass("active")
}
});
fluid.shouldSwitch = true;
$( ".switch, .switch .head" ).click(function(event) {
if ($(event.target).hasClass("head")) {
var ele = $(event.target).parent();
} else { var ele = event.target }
if (fluid.shouldSwitch) {
$(ele).toggleClass("active");
fluid.shouldSwitch = false;
setTimeout(() => fluid.shouldSwitch = true, 400)
}
});
$( "#activecontextmenu" ).contextmenu(function(event) {
  event.preventDefault();
});
fluid.contextMenu = function(target, event) {
  var element = target
  if ($(element).children("a").length == 1) element = $(element).children("a").children("i").get(0);
  if ($(element).siblings(".contextmenu").length == 1) {
     if (event) event.preventDefault();
    if (!fluid.contextMenuOpen) {
      $(element).addClass("outOfContext")
      document.body.style.overflow = "hidden";
      $( "body" ).css( "padding-right", "5px");
    fluid.contextMenuOpen = true;
    fluid.generateWrapper();

    var bodyRect = document.body.getBoundingClientRect(),
      elemRect = element.getBoundingClientRect(),
      left   = elemRect.left - bodyRect.left - 5,
      top   = elemRect.top - bodyRect.top;

    $("#activecontextmenu").css("left", left)
    $("#activecontextmenu").css("top", top)
    $(element).parent().css("height", $(element).parent().height());
    if ($(element).hasClass("material-icons")) {
      $(element).parent().parent().css("width", "44px")
      $(element).parent().parent().css("height", "44px")
      $("#pagewrapper").attr("onclick","fluid.exitContextMenu(true);");
    } else {
      $("#pagewrapper").attr("onclick","fluid.exitContextMenu(false);");
    }
    $(element).parent().addClass("contextMenuSource")
    if ($(element).hasClass("active")) {$(element).css("background-color", "#207bdf") } else {
    if ($("body").hasClass("outline")){
    if ($("body").hasClass("dark")) { $(element).css("border", "1px solid #16181a") } else { $(element).css("border", "1px solid #dddddd") }}
    else { if ($("body").hasClass("dark")) { element.style = "background-color: var(--flex-layer3, #16181a);"; } else { element.style = "background-color: var(--flex-layer3, #dddddd);"; }} }
    $(element).siblings(".contextmenu").css("display", "inline-block");
    $(element).siblings(".contextmenu").css("margin-left", "-20px")
    $(element).siblings(".contextmenu").css("margin-right", "10px")
    $(element).parent().children().appendTo("#activecontextmenu");
    $("#activecontextmenu").css("width", $("body").width() - Number($("#activecontextmenu").css("left").slice(0,-2)))
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
$( ".btn, .nav a, .nav li" ).contextmenu(function(event) {
fluid.contextMenu(event.target, event)
});
$( ".contextmenu.list .item" ).click(function(event) {
  fluid.exitContextMenu(false);
});
$( "div.nav.active li" ).click(function(event) {
$(this).siblings().removeClass("active")
$(this).addClass("active")
});

$( ".section.collapse .header" ).click(function(event) {
  if ($(this).parent().hasClass("collapsed")) {
    if ($(this).parent().hasClass("one")) {
      $(this).parent().siblings().addClass("collapsed");
    }
  }
$(this).parent().toggleClass("collapsed");
});

$( ".list .item, a" ).contextmenu(function(event) {
if (fluid.expBeh) { event.preventDefault(); fluid.bounceBack(event.target); }
});

}

$( document ).ready(fluid.init);

$( window ).resize(function() {
  fluid.exitContextMenu(true);
});

fluid.exitContextMenu = function(force) {
  $("#pagewrapper").removeClass("blur")
  $("#activecontextmenu").children(".contextmenu").css("display", "none");
  if (force) { wait = 0; } else { wait = 300; }
  setTimeout(function() {
  $("#activecontextmenu").children().appendTo(".contextMenuSource")
  $(".contextMenuSource").children(".btn, i").css("background-color", "");
  $(".contextMenuSource").children(".btn, i").css("border", "");
  $(".contextMenuSource").children(".btn, i").removeClass("outOfContext")
  $(".contextMenuSource").css("height", "");
  $("#pagewrapper").attr("onclick","");
  $(".contextMenuSource").removeClass("contextMenuSource")
  fluid.contextMenuOpen = false;
  document.body.style.overflow = "";
  $( "body" ).css( "padding-right", "");
}, wait);
}

fluid.bounceBack = function (ele) {
  if (!fluid.contextMenuOpen) {
  fluid.contextMenuOpen = true;

  $("#pagewrapper").addClass("blur")
  document.body.style.overflow = "hidden";
  $( "body" ).css( "padding-right", "5px");
  setTimeout(function() {
    $("#pagewrapper").removeClass("blur");
    document.body.style.overflow = "";
    $( "body" ).css( "padding-right", "");
  }, 200)
}
}

/* Cards */
menuopen = false;
fluid.cards = function(element, isModal) {
  var focus = $(element).hasClass('focus');
  if (focus) {
    fluid.generateWrapper();
        $(element).css({top: window.scrollY + 50});
        if (menuopen) {
          fluid.cards.close(".focus");
          $("#pagewrapper").addClass('blur');
          if (isModal) document.body.style.overflow = "hidden"
          $( "body" ).css( "padding-right", "5px");
          $(element).removeClass('close');
          setTimeout(function() {$("#pagewrapper").attr("onclick","fluid.card.close('" + element + "');");}, 100)
        } else {
          $("#pagewrapper").addClass('blur');
          if (isModal) document.body.style.overflow = "hidden"
          $( "body" ).css( "padding-right", "5px");
          $(element).removeClass('close');
          setTimeout(function() {$("#pagewrapper").attr("onclick","fluid.cards.close('.focus');");}, 100)
        }
  } else {
    $("#pagewrapper").attr("onclick","");
    if (menuopen) {
      fluid.cards.close();
      $(element).removeClass('close');
    } else {
     menuopen = true;
     $(element).removeClass('close');
    }
  }
}
fluid.modal = function(element) {
  fluid.cards(element, true)
}
fluid.toast = function(icon, text, sticky, focus) {
  fluid.toastNav = $(".nav:not(.toast):not(.card):visible")
  $(fluid.toastNav).hide();
  var iconExtraStyles = ""
  if (text == undefined) { var text = ""; }
  if (icon == undefined) { var icon = "";  }
  if (text == "") { var iconExtraStyles = "margin-right: -15px;"; }
  fluid.generateWrapper();
  $("#activetoast").hide();
    $("#activetoast").html(`<div class="nav sticky toast">
    <i onclick="fluid.exitToast()" class="material-icons" style="vertical-align: middle;cursor:pointer;` + iconExtraStyles + `">` + icon + `</i>
    <h5 style="margin:0px;display:inline-block;vertical-align:middle;margin-right: 7px;margin-left: 5px;">` + text + `</h5>
        </div>`)
        $("#activetoast").show("fade");
        fluid.toastHiding = false;
        $( ".toast" ).hover(
  function() {
    $(".toast i").html("cancel")
  }, function() {
    if (!fluid.toastHiding) $(".toast i").html(icon)
  }
);
}
fluid.exitToast = function() {
  $(fluid.toastNav).show();
  var iconExtraStyles = ""
  fluid.toastHiding = true;
  $("#activetoast").hide("fade");
}
fluid.cards.close = function(element) {
  $(element).addClass('close');
  $('#pagewrapper').removeClass("blur");
  document.body.style.overflow = ""
  $( "body" ).css( "padding-right", "");
  $("#pagewrapper").attr("onclick","");
  menuopen = false;
}
fluid.generateWrapper = function() {
  if ( !$( "#pagewrapper" ).length ) {
  $( "body" ).wrapInner( "<div id='pagewrapper'></div>");
  $( "#pagewrapper" ).after( "<div id='focuscardwrapper' class='container'></div>" );
  $( "#pagewrapper" ).after( "<div id='activecontextmenu' style='position:absolute'></div>" );
  $( "#pagewrapper" ).after( "<div id='activetoast'></div>" );
  $( "#pagewrapper" ).after( "<div id='splashscreen' style='display:none;margin-top: 100px;' class='container'><h1 style='font-size:5rem;' id='splashscreenname'></h1><div id='splashscreencnt'></div></div>" );
  $(".card.focus").appendTo("#focuscardwrapper");
  $(".splash").appendTo("#splashscreencnt");
  }
}
fluid.splash = function(element) {
  fluid.splashScroll = window.scrollY;
  fluid.generateWrapper();
  $("#pagewrapper").hide();
 var title = $(element).attr("title");
  $("#splashscreenname").html(title);
  $(element).show();
  $("#splashscreen").show();
}

fluid.unsplash = function() {
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



document.addEventListener('keydown', function(e) {
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
document.addEventListener('keydown', function(e) {
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
document.addEventListener('keydown', function(e) {
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
document.addEventListener('keydown', function(e) {
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
document.addEventListener('keydown', function(e) {
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
