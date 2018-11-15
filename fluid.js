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
  if (theme == "toggle") { $("body").toggleClass("dark"); }
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

  if (window.localStorage.fluidTheme !== "") {
    fluid.theme(window.localStorage.fluidTheme, true)
  } else {
    if (fluid.theme(undefined, "unsetStat") == "unset") fluid.theme("auto", true);
  }
  if (!$("body").hasClass("notwemoji")) {
  twemoji.parse(document.body);
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

/*! Copyright Twitter Inc. and other contributors. Licensed under MIT */
var twemoji=function(){"use strict";var twemoji={base:"https://twemoji.maxcdn.com/2/",ext:".png",size:"72x72",className:"emoji",convert:{fromCodePoint:fromCodePoint,toCodePoint:toCodePoint},onerror:function onerror(){if(this.parentNode){this.parentNode.replaceChild(createText(this.alt,false),this)}},parse:parse,replace:replace,test:test},escaper={"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"},re=/(?:\ud83d[\udc68\udc69])(?:\ud83c[\udffb-\udfff])?\u200d(?:\u2695\ufe0f|\u2696\ufe0f|\u2708\ufe0f|\ud83c[\udf3e\udf73\udf93\udfa4\udfa8\udfeb\udfed]|\ud83d[\udcbb\udcbc\udd27\udd2c\ude80\ude92]|\ud83e[\uddb0-\uddb3])|(?:\ud83c[\udfcb\udfcc]|\ud83d[\udd74\udd75]|\u26f9)((?:\ud83c[\udffb-\udfff]|\ufe0f)\u200d[\u2640\u2642]\ufe0f)|(?:\ud83c[\udfc3\udfc4\udfca]|\ud83d[\udc6e\udc71\udc73\udc77\udc81\udc82\udc86\udc87\ude45-\ude47\ude4b\ude4d\ude4e\udea3\udeb4-\udeb6]|\ud83e[\udd26\udd35\udd37-\udd39\udd3d\udd3e\uddb8\uddb9\uddd6-\udddd])(?:\ud83c[\udffb-\udfff])?\u200d[\u2640\u2642]\ufe0f|(?:\ud83d\udc68\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68|\ud83d\udc68\u200d\ud83d\udc68\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc68\u200d\ud83d\udc68\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d[\udc68\udc69]|\ud83d\udc69\u200d\ud83d\udc69\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc69\u200d\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\u2764\ufe0f\u200d\ud83d\udc68|\ud83d\udc68\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc68\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\ud83d\udc68\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\u2764\ufe0f\u200d\ud83d[\udc68\udc69]|\ud83d\udc69\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\ud83d\udc69\u200d\ud83d[\udc66\udc67]|\ud83c\udff3\ufe0f\u200d\ud83c\udf08|\ud83c\udff4\u200d\u2620\ufe0f|\ud83d\udc41\u200d\ud83d\udde8|\ud83d\udc68\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\ud83d[\udc66\udc67]|\ud83d\udc6f\u200d\u2640\ufe0f|\ud83d\udc6f\u200d\u2642\ufe0f|\ud83e\udd3c\u200d\u2640\ufe0f|\ud83e\udd3c\u200d\u2642\ufe0f|\ud83e\uddde\u200d\u2640\ufe0f|\ud83e\uddde\u200d\u2642\ufe0f|\ud83e\udddf\u200d\u2640\ufe0f|\ud83e\udddf\u200d\u2642\ufe0f)|[\u0023\u002a\u0030-\u0039]\ufe0f?\u20e3|(?:[\u00a9\u00ae\u2122\u265f]\ufe0f)|(?:\ud83c[\udc04\udd70\udd71\udd7e\udd7f\ude02\ude1a\ude2f\ude37\udf21\udf24-\udf2c\udf36\udf7d\udf96\udf97\udf99-\udf9b\udf9e\udf9f\udfcd\udfce\udfd4-\udfdf\udff3\udff5\udff7]|\ud83d[\udc3f\udc41\udcfd\udd49\udd4a\udd6f\udd70\udd73\udd76-\udd79\udd87\udd8a-\udd8d\udda5\udda8\uddb1\uddb2\uddbc\uddc2-\uddc4\uddd1-\uddd3\udddc-\uddde\udde1\udde3\udde8\uddef\uddf3\uddfa\udecb\udecd-\udecf\udee0-\udee5\udee9\udef0\udef3]|[\u203c\u2049\u2139\u2194-\u2199\u21a9\u21aa\u231a\u231b\u2328\u23cf\u23ed-\u23ef\u23f1\u23f2\u23f8-\u23fa\u24c2\u25aa\u25ab\u25b6\u25c0\u25fb-\u25fe\u2600-\u2604\u260e\u2611\u2614\u2615\u2618\u2620\u2622\u2623\u2626\u262a\u262e\u262f\u2638-\u263a\u2640\u2642\u2648-\u2653\u2660\u2663\u2665\u2666\u2668\u267b\u267f\u2692-\u2697\u2699\u269b\u269c\u26a0\u26a1\u26aa\u26ab\u26b0\u26b1\u26bd\u26be\u26c4\u26c5\u26c8\u26cf\u26d1\u26d3\u26d4\u26e9\u26ea\u26f0-\u26f5\u26f8\u26fa\u26fd\u2702\u2708\u2709\u270f\u2712\u2714\u2716\u271d\u2721\u2733\u2734\u2744\u2747\u2757\u2763\u2764\u27a1\u2934\u2935\u2b05-\u2b07\u2b1b\u2b1c\u2b50\u2b55\u3030\u303d\u3297\u3299])(?:\ufe0f|(?!\ufe0e))|(?:(?:\ud83c[\udfcb\udfcc]|\ud83d[\udd74\udd75\udd90]|[\u261d\u26f7\u26f9\u270c\u270d])(?:\ufe0f|(?!\ufe0e))|(?:\ud83c[\udf85\udfc2-\udfc4\udfc7\udfca]|\ud83d[\udc42\udc43\udc46-\udc50\udc66-\udc69\udc6e\udc70-\udc78\udc7c\udc81-\udc83\udc85-\udc87\udcaa\udd7a\udd95\udd96\ude45-\ude47\ude4b-\ude4f\udea3\udeb4-\udeb6\udec0\udecc]|\ud83e[\udd18-\udd1c\udd1e\udd1f\udd26\udd30-\udd39\udd3d\udd3e\uddb5\uddb6\uddb8\uddb9\uddd1-\udddd]|[\u270a\u270b]))(?:\ud83c[\udffb-\udfff])?|(?:\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc65\udb40\udc6e\udb40\udc67\udb40\udc7f|\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc73\udb40\udc63\udb40\udc74\udb40\udc7f|\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc77\udb40\udc6c\udb40\udc73\udb40\udc7f|\ud83c\udde6\ud83c[\udde8-\uddec\uddee\uddf1\uddf2\uddf4\uddf6-\uddfa\uddfc\uddfd\uddff]|\ud83c\udde7\ud83c[\udde6\udde7\udde9-\uddef\uddf1-\uddf4\uddf6-\uddf9\uddfb\uddfc\uddfe\uddff]|\ud83c\udde8\ud83c[\udde6\udde8\udde9\uddeb-\uddee\uddf0-\uddf5\uddf7\uddfa-\uddff]|\ud83c\udde9\ud83c[\uddea\uddec\uddef\uddf0\uddf2\uddf4\uddff]|\ud83c\uddea\ud83c[\udde6\udde8\uddea\uddec\udded\uddf7-\uddfa]|\ud83c\uddeb\ud83c[\uddee-\uddf0\uddf2\uddf4\uddf7]|\ud83c\uddec\ud83c[\udde6\udde7\udde9-\uddee\uddf1-\uddf3\uddf5-\uddfa\uddfc\uddfe]|\ud83c\udded\ud83c[\uddf0\uddf2\uddf3\uddf7\uddf9\uddfa]|\ud83c\uddee\ud83c[\udde8-\uddea\uddf1-\uddf4\uddf6-\uddf9]|\ud83c\uddef\ud83c[\uddea\uddf2\uddf4\uddf5]|\ud83c\uddf0\ud83c[\uddea\uddec-\uddee\uddf2\uddf3\uddf5\uddf7\uddfc\uddfe\uddff]|\ud83c\uddf1\ud83c[\udde6-\udde8\uddee\uddf0\uddf7-\uddfb\uddfe]|\ud83c\uddf2\ud83c[\udde6\udde8-\udded\uddf0-\uddff]|\ud83c\uddf3\ud83c[\udde6\udde8\uddea-\uddec\uddee\uddf1\uddf4\uddf5\uddf7\uddfa\uddff]|\ud83c\uddf4\ud83c\uddf2|\ud83c\uddf5\ud83c[\udde6\uddea-\udded\uddf0-\uddf3\uddf7-\uddf9\uddfc\uddfe]|\ud83c\uddf6\ud83c\udde6|\ud83c\uddf7\ud83c[\uddea\uddf4\uddf8\uddfa\uddfc]|\ud83c\uddf8\ud83c[\udde6-\uddea\uddec-\uddf4\uddf7-\uddf9\uddfb\uddfd-\uddff]|\ud83c\uddf9\ud83c[\udde6\udde8\udde9\uddeb-\udded\uddef-\uddf4\uddf7\uddf9\uddfb\uddfc\uddff]|\ud83c\uddfa\ud83c[\udde6\uddec\uddf2\uddf3\uddf8\uddfe\uddff]|\ud83c\uddfb\ud83c[\udde6\udde8\uddea\uddec\uddee\uddf3\uddfa]|\ud83c\uddfc\ud83c[\uddeb\uddf8]|\ud83c\uddfd\ud83c\uddf0|\ud83c\uddfe\ud83c[\uddea\uddf9]|\ud83c\uddff\ud83c[\udde6\uddf2\uddfc]|\ud83c[\udccf\udd8e\udd91-\udd9a\udde6-\uddff\ude01\ude32-\ude36\ude38-\ude3a\ude50\ude51\udf00-\udf20\udf2d-\udf35\udf37-\udf7c\udf7e-\udf84\udf86-\udf93\udfa0-\udfc1\udfc5\udfc6\udfc8\udfc9\udfcf-\udfd3\udfe0-\udff0\udff4\udff8-\udfff]|\ud83d[\udc00-\udc3e\udc40\udc44\udc45\udc51-\udc65\udc6a-\udc6d\udc6f\udc79-\udc7b\udc7d-\udc80\udc84\udc88-\udca9\udcab-\udcfc\udcff-\udd3d\udd4b-\udd4e\udd50-\udd67\udda4\uddfb-\ude44\ude48-\ude4a\ude80-\udea2\udea4-\udeb3\udeb7-\udebf\udec1-\udec5\uded0-\uded2\udeeb\udeec\udef4-\udef9]|\ud83e[\udd10-\udd17\udd1d\udd20-\udd25\udd27-\udd2f\udd3a\udd3c\udd40-\udd45\udd47-\udd70\udd73-\udd76\udd7a\udd7c-\udda2\uddb4\uddb7\uddc0-\uddc2\uddd0\uddde-\uddff]|[\u23e9-\u23ec\u23f0\u23f3\u267e\u26ce\u2705\u2728\u274c\u274e\u2753-\u2755\u2795-\u2797\u27b0\u27bf\ue50a])|\ufe0f/g,UFE0Fg=/\uFE0F/g,U200D=String.fromCharCode(8205),rescaper=/[&<>'"]/g,shouldntBeParsed=/^(?:iframe|noframes|noscript|script|select|style|textarea)$/,fromCharCode=String.fromCharCode;return twemoji;function createText(text,clean){return document.createTextNode(clean?text.replace(UFE0Fg,""):text)}function escapeHTML(s){return s.replace(rescaper,replacer)}function defaultImageSrcGenerator(icon,options){return"".concat(options.base,options.size,"/",icon,options.ext)}function grabAllTextNodes(node,allText){var childNodes=node.childNodes,length=childNodes.length,subnode,nodeType;while(length--){subnode=childNodes[length];nodeType=subnode.nodeType;if(nodeType===3){allText.push(subnode)}else if(nodeType===1&&!("ownerSVGElement"in subnode)&&!shouldntBeParsed.test(subnode.nodeName.toLowerCase())){grabAllTextNodes(subnode,allText)}}return allText}function grabTheRightIcon(rawText){return toCodePoint(rawText.indexOf(U200D)<0?rawText.replace(UFE0Fg,""):rawText)}function parseNode(node,options){var allText=grabAllTextNodes(node,[]),length=allText.length,attrib,attrname,modified,fragment,subnode,text,match,i,index,img,rawText,iconId,src;while(length--){modified=false;fragment=document.createDocumentFragment();subnode=allText[length];text=subnode.nodeValue;i=0;while(match=re.exec(text)){index=match.index;if(index!==i){fragment.appendChild(createText(text.slice(i,index),true))}rawText=match[0];iconId=grabTheRightIcon(rawText);i=index+rawText.length;src=options.callback(iconId,options);if(src){img=new Image;img.onerror=options.onerror;img.setAttribute("draggable","false");attrib=options.attributes(rawText,iconId);for(attrname in attrib){if(attrib.hasOwnProperty(attrname)&&attrname.indexOf("on")!==0&&!img.hasAttribute(attrname)){img.setAttribute(attrname,attrib[attrname])}}img.className=options.className;img.alt=rawText;img.src=src;modified=true;fragment.appendChild(img)}if(!img)fragment.appendChild(createText(rawText,false));img=null}if(modified){if(i<text.length){fragment.appendChild(createText(text.slice(i),true))}subnode.parentNode.replaceChild(fragment,subnode)}}return node}function parseString(str,options){return replace(str,function(rawText){var ret=rawText,iconId=grabTheRightIcon(rawText),src=options.callback(iconId,options),attrib,attrname;if(src){ret="<img ".concat('class="',options.className,'" ','draggable="false" ','alt="',rawText,'"',' src="',src,'"');attrib=options.attributes(rawText,iconId);for(attrname in attrib){if(attrib.hasOwnProperty(attrname)&&attrname.indexOf("on")!==0&&ret.indexOf(" "+attrname+"=")===-1){ret=ret.concat(" ",attrname,'="',escapeHTML(attrib[attrname]),'"')}}ret=ret.concat("/>")}return ret})}function replacer(m){return escaper[m]}function returnNull(){return null}function toSizeSquaredAsset(value){return typeof value==="number"?value+"x"+value:value}function fromCodePoint(codepoint){var code=typeof codepoint==="string"?parseInt(codepoint,16):codepoint;if(code<65536){return fromCharCode(code)}code-=65536;return fromCharCode(55296+(code>>10),56320+(code&1023))}function parse(what,how){if(!how||typeof how==="function"){how={callback:how}}return(typeof what==="string"?parseString:parseNode)(what,{callback:how.callback||defaultImageSrcGenerator,attributes:typeof how.attributes==="function"?how.attributes:returnNull,base:typeof how.base==="string"?how.base:twemoji.base,ext:how.ext||twemoji.ext,size:how.folder||toSizeSquaredAsset(how.size||twemoji.size),className:how.className||twemoji.className,onerror:how.onerror||twemoji.onerror})}function replace(text,callback){return String(text).replace(re,callback)}function test(text){re.lastIndex=0;var result=re.test(text);re.lastIndex=0;return result}function toCodePoint(unicodeSurrogates,sep){var r=[],c=0,p=0,i=0;while(i<unicodeSurrogates.length){c=unicodeSurrogates.charCodeAt(i++);if(p){r.push((65536+(p-55296<<10)+(c-56320)).toString(16));p=0}else if(55296<=c&&c<=56319){p=c}else{r.push(c.toString(16))}}return r.join(sep||"-")}}();
