/*!
Fluid JS Modules v3.0 beta 2

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

fluid.dark = function(theme, auto) {
  if (theme == undefined) {
  $("body").toggleClass("dark");
  }
  if (theme == true) {
  $("body").addClass("dark");
  }
  if (theme == false) {
  $("body").removeClass("dark");
  }
  if ( $(".themeico").length ) {
    if (fluid.isDark()) {
      $(".themeico").text("brightness_low");
    } else {
      $(".themeico").text("brightness_high");
    }
  }
  if ($("#activecontextmenu").children(".btn").hasClass("active")) {$("#activecontextmenu").children(".btn").css("background-color", "#207bdf") } else {
  if ($("#activecontextmenu").length) { if ($("#activecontextmenu").children().length == 2) { if ($("body").hasClass("dark")) { $("#activecontextmenu").children(".btn, i").css("background-color", "#16181a") } else { $("#activecontextmenu").children(".btn, i").css("background-color", "#dddddd") } } } }
  if (auto !== true) document.cookie = "fluidIsDark=" + fluid.isDark();
}
fluid.isDark = function() {
  return $("body").hasClass("dark");
}
fluid.auto = function(auto) {
  var hours = new Date().getHours()
  // Light: 6AM - 6PM Dark: 7PM - 5AM
  if (hours > 5 && hours < 19) {
    $("body").removeClass("dark");
  } else {
    $("body").addClass("dark");
  }
  if ( $(".themeico").length ) {
    if (fluid.isDark()) {
      $(".themeico").text("brightness_low");
    } else {
      $(".themeico").text("brightness_high");
    }
  }
  if (auto !== true) document.cookie = "fluidIsDark=auto";
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
  if (getCookie("fluidIsDark") == "true") {
    fluid.dark(true, true)
  } else {
    if (getCookie("fluidIsDark") == "auto") {
      fluid.auto(true);
    } else {
      if (getCookie("fluidIsDark") == "false") {
    fluid.dark(false, true)
  } else {
    if ($("body").hasClass("auto")) {
      fluid.auto(true);
    }
  }
  }
  }

  $( ".btns .btn, .list.select .item" ).click(function(event) {
  if ($(event.target).parent().hasClass("multiple")) {
    $(this).toggleClass("active")
  } else {
  $(this).siblings().removeClass("active")
  $(this).addClass("active")
}
});
$( "#activecontextmenu" ).contextmenu(function(event) {
  event.preventDefault();
});
$( ".btn, .nav a, .nav li" ).contextmenu(function(event) {
var element = event.target
if ($(element).children("a").length == 1) element = $(element).children("a").children("i").get(0);
if ($(element).siblings(".contextmenu").length == 1) {
   event.preventDefault();
  if (!fluid.contextMenuOpen) {
    $(element).addClass("outOfContext")
    document.body.style.overflow = "hidden";
    $( "body" ).css( "padding-right", "5px");
  fluid.contextMenuOpen = true;
  fluid.generateWrapper();

  var bodyRect = document.body.getBoundingClientRect(),
    elemRect = element.getBoundingClientRect(),
    left   = elemRect.left - bodyRect.left,
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
  else { if ($("body").hasClass("dark")) { $(element).css("background-color", "#16181a") } else { $(element).css("background-color", "#dddddd") }} }
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
  $("#pagewrapper").addClass("blur")
}
} else {
  if (fluid.expBeh) {
    event.preventDefault();
    fluid.bounceBack(element);
  }
}
});
$( ".contextmenu.list .item" ).click(function(event) {
  fluid.exitContextMenu(false);
});
$( "div.nav.active li" ).click(function(event) {
$(this).siblings().removeClass("active")
$(this).addClass("active")
});

$( ".section.collapse .header" ).click(function(event) {
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
  fluid.toastNav = $(".nav:not(.toast):visible")
  $(".nav:not(.toast)").hide();
  var iconExtraStyles = ""
  if (text == undefined) { var text = ""; }
  if (icon == undefined) { var icon = "";  }
  if (text == "") { var iconExtraStyles = "margin-right: -15px;"; }
  fluid.generateWrapper();
    $("#activetoast").html(`<div class="nav sticky toast">
    <i onclick="fluid.exitToast()" class="material-icons" style="vertical-align: middle;cursor:pointer;` + iconExtraStyles + `">` + icon + `</i>
    <h5 style="margin:0px;display:inline-block;vertical-align:middle;margin-right: 7px;margin-left: 5px;">` + text + `</h5>
        </div>`)
        $( ".toast" ).hover(
  function() {
    $(".toast i").html("keyboard_arrow_down")
  }, function() {
    $(".toast i").html(icon)
  }
);
}
fluid.exitToast = function() {
  $(fluid.toastNav).show();
  var iconExtraStyles = ""
    $("#activetoast").html("");
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
      fluid.dark();
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
      fluid.auto();
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
