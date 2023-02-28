/**
 * @file Fluid UI JavaScript Modules
 * @author jottocraft
 * @version v5.0.0-dep
 * 
 * @copyright Made by jottocraft 2017-2021. All code in this repository is in the public domain (https://github.com/jottocraft/fluid-old/blob/master/LICENSE).
 * @license unlicense
 */

/**
 * Global Fluid UI object.
 * All global Fluid UI functions and variables are stored in this object.
 * 
 * @global
 * @namespace fluid
 * @property {object} screens Fluid UI screens object containing functions for local screens and URLs for external screens
 * @property {object} externalScreens Contains all of the functions for external screens, which are added to this object as needed
 * @property {string[]} includedThemes The list of color theme IDs included in this version of Fluid UI. This should NOT be changed for custom themes.
 * @property {Object.<string, Theme>} themes Contains all of the color theme objects
 * @property {FluidConfig} config Fluid UI configuration variables
 */
var fluid = {
    screens: {},
    externalScreens: {},
    includedThemes: ["midnight", "tome"],
    themes: {
        /**
        * @typedef {object} Theme
        * @description Color theme objects
        * @property {string} name Theme display name
        * @property {string} icon Theme icon
        * @property {'light'|'dark'} type Theme type. Must be "light" if the theme uses dark text on a light background or "dark" if the theme uses light text on a dark background.
        * @property {ThemeColors} [colors] Contains all of the theme colors. This can be omitted if there is CSS for the theme.
        * @property {boolean} [isColorTheme=false] True if this theme is a color theme, false if the theme is black/white/gray.
        */
        /**
        * @typedef {object} ThemeColors
        * @description An object containing colors for a Fluid UI theme. Each key in the object corresponds exactly to the name of the CSS variable that it sets.
        * @property {string} background Page background color
        * @property {string} text Primary text color
        * @property {string} lightText Color used for slightly less important text (somewhere between text and secText)
        * @property {string} secText Secondary text color 
        * @property {string} elements Color used for clickable elements (e.g. buttons, switches, etc.)
        * @property {string} elementText Text color for clickable elements
        * @property {string} elementHover Clickable elements hover color
        * @property {string} switchHead Switch head color
        * @property {string} inputColor Color for input elements (like text boxes)
        * @property {string} navbar Navigation bar color
        * @property {string} sidebar Sidebar background
        * @property {string} sidebarActive Selected sidebar item background
        * @property {string} sidenav Sidenav background
        * @property {string} sidenavActive Selected sidenav item background
        * @property {string} cards Cards color
        * @property {string} content Background used for code blocks and the theme selector. Presented with lightShadow. Somewhere between background and inputColor.
        * @property {string} theme Color used for active items (like enabled switches). This may be overridden (on all themes) to match the site's brand colors.  
        * @property {string} themeText Text color used on top of the "theme" color
        * @property {string} [themeSelectorColor] Text color used when showing this theme in the theme selector in black/white themes. Optional, and should only be used for color themes.
        */
        midnight: {
            name: "Midnight",
            icon: "brightness_3",
            type: "dark",
            isColorTheme: false
            //The midnight theme's colors are defined in CSS
        },
        tome: {
            name: "Tome",
            icon: "bookmark_border",
            type: "dark",
            isColorTheme: true,
            colors: {
                background: "#18161d",

                text: "#efefef",
                lightText: "#8e82a2",
                secText: "#6a6179",

                elements: "#322e3c",
                elementText: "#ffffff",
                elementHover: "#403a50",
                switchHead: "#cccccc",

                inputColor: "#2d2935",

                navbar: "#211e29",
                sidebar: "#1f1c26",
                sidebarActive: "#2c2736",
                sidenav: "#26232d",
                sidenavActive: "#2a2631",

                cards: "#232029",
                content: "#1e1b25",

                theme: "#5c3e7b",
                themeText: "#f8f0ff",

                highlight: "#ffffff12",
                acrylic: "#282333cc",
                mediumAcrylic: "#28233380",
                lightAcrylic: "#28233366",
                backgroundTint: "#18161de6",

                themeSelectorColor: "#7c68b1"
            }
        }
    },
    /**
    * @typedef {object} FluidConfig
    * @description Contains customization options
    * @property {string} [defaultTheme=system] The theme ID to use by default
    * @proeprty {boolean} [themeLock=false] Prevents the user from using a theme other than the default
    * @property {boolean} [allowBackgroundImages=true] Allows the user to set a background image theme
    * @property {boolean|string[]} [allowedThemes=true] Either an array of themeIDs to allow, or true to allow all themes. Light, dark, and system are always allowed.
    */
    config: { //These configuration settings affects how built-in UI elements behave. Users can bypass these restrictions using the web inspector.
        defaultTheme: "system", //The theme ID to use by default
        themeLock: false, //Prevents the user from using a theme other than the default
        allowBackgroundImages: true, //Allow the user to set background images.
        allowedThemes: true //An array of theme IDs to allow, or true to allow all themes. Ignored if allowThemeMenu is false. Dark, light, and auto are always allowed.
    },
    /**
    * @typedef {object} strings
    * @description An object containing all of the strings (or functions if the text is adaptive) for text displayed in the UI. This is provided so that websites can override the text in Fluid UI.
    */
    strings: {
        SYSTEM: "System",
        LIGHT: "Light",
        DARK: "Dark",
        BACKGROUND_IMAGE: "Background Image",
        USE_BACKGROUND_IMAGE: "Use a background image",
        IMAGE_URL: "Image URL",
        FILE_UPLOADED: "File uploaded",
        UPLOAD_IMAGE: "Upload image",
        REMOVE_FILE: "Remove file"
    }
};

/**
 * Global Fluid UI configuration object.
 * All Fluid UI features, as configured by the site developer, are passed to Fluid UI through this object.
 * This object must be defined globally, before Fluid UI is loaded, for it to take effect.
 * 
 * @global
 * @namespace fluidConfig
 * @property {FluidConfig} config Fluid UI configuration options. This will be merged with the defaults, so only options that differ from the default need to be provided.
 * @property {Object.<string, Theme>} themes Custom themes to add to Fluid UI.
 */

//Listen for system theme change
window.matchMedia("(prefers-color-scheme: dark)").addListener(function (e) {
    if (document.documentElement.dataset.theme == "system") {
        fluid.theme("system", true);
    }
});

//Listen for theme or preference changes
window.addEventListener('storage', function (e) {
    if (e.key.startsWith("pref-")) {
        fluid.set(e.key, e.newValue, true)
    }
    if (e.key == "fluidTheme") {
        fluid.theme(e.newValue, true)
    }
});

//Listen for window resize
window.onresize = function (event) {
    if (window.innerWidth <= 900) {
        $("body").addClass("collapsedSidebar");
    } else {
        if (window.localStorage.getItem("fluidSidebarCollapsed") == "true") {
            $("body").addClass("collapsedSidebar");
        } else {
            $("body").removeClass("collapsedSidebar");
        }
    }
};

//Listen for screen change
window.onhashchange = function () {
    if (fluid.screensEnabled) {
        //get url screen
        var { screenID, param } = fluid.getURLScreen();

        //Load screen from hash
        fluid.loadScreen(screenID, param);

        //Broadcast screen change
        document.dispatchEvent(new CustomEvent("fluidScreen", { detail: screenID }));
    }
}

/**
 * Gets the current screen from the URL parameter
 * 
 * @returns {object} The screenID and parameter from the URL
 */
fluid.getURLScreen = function () {
    var screenID = null, param = null;

    if (document.location.hash == "#/") {
        screenID = fluid.defaultScreen;
    } else if (document.location.hash.startsWith("#/")) {
        screenID = document.location.hash.split("/")[1];
        param = document.location.hash.split("/").slice(2).join("/");
    }

    if (param) {
        param = decodeURI(param);
        if (param && param.startsWith("{")) try { param = JSON.parse(param); } catch (e) { }
    }

    return { screenID, param };
}

/**
 * Applies a theme, stores the preference, and updates the theme selection UI
 * 
 * @param {string} requestedTheme The ID of the theme to apply
 * @param {boolean} [temporary=false] If the theme is only being applied temporarily. When true, the theme will be applied, but the preference will not be saved.
 */
fluid.theme = function (requestedTheme, temporary) {
    //Check for theme lock config
    if (fluid.config.themeLock && (requestedTheme !== fluid.config.defaultTheme)) return;

    // TOGGLE THEME SHORTCUT
    if (requestedTheme == "toggle") {
        if (document.documentElement.dataset.themeType == "dark") {
            return fluid.theme("light");
        } else {
            return fluid.theme("dark");
        }
    }

    // GET CURRENT THEME -----------------------
    var currentTheme = null;

    if (document.documentElement.dataset.theme == "system") {
        currentTheme = document.documentElement.dataset.themeType;
    } else {
        currentTheme = document.documentElement.dataset.theme;
    }

    if (requestedTheme == undefined) return currentTheme;
    // -----------------------------------------

    // APPLY REQUESTED THEME -------------------
    if (requestedTheme && !requestedTheme.startsWith("image.")) {
        //Set theme vars
        if ((requestedTheme == "light") || (requestedTheme == "dark")) {
            document.documentElement.dataset.theme = requestedTheme;
            document.documentElement.dataset.themeType = requestedTheme;
        } else if (requestedTheme == "system") {
            //Use system theme
            document.documentElement.dataset.theme = "system";
            if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
                document.documentElement.dataset.themeType = "dark";
            } else {
                document.documentElement.dataset.themeType = "light";
            }
        } else if (fluid.themes[requestedTheme]) {
            document.documentElement.dataset.theme = requestedTheme;
            document.documentElement.dataset.themeType = fluid.themes[requestedTheme].type;
        }

        //Set color theme vars for JavaScript themes
        if (fluid.themes[requestedTheme] && fluid.themes[requestedTheme].colors) {
            if (!$("style#fluidTheme")[0]) $("head").append(`<style id="fluidTheme"></style>`);

            var themeVars = "";
            Object.keys(fluid.themes[requestedTheme].colors).forEach(color => {
                themeVars += `--${color}: ${fluid.themes[requestedTheme].colors[color]};`
            });
            $("style#fluidTheme").html(`[data-theme=${requestedTheme}][data-theme-type=${fluid.themes[requestedTheme].type}] { ${themeVars} }`);
        } else {
            $("style#fluidTheme").remove();
        }
    }

    //Apply theme image
    if (requestedTheme.startsWith("image.")) {
        var imageURL = requestedTheme.split("image.")[1];

        if (imageURL) {
            document.documentElement.dataset.themeImage = imageURL;
            document.documentElement.style.setProperty("--themeImage", "url('" + imageURL + "')");
        } else {
            document.documentElement.style.removeProperty("--themeImage");
            delete document.documentElement.dataset.themeImage;
        }
    }
    // -----------------------------------------

    // SAVE THEME PREF AND UPDATE UI -------------------
    if (requestedTheme && requestedTheme.startsWith("image.")) {
        if (requestedTheme !== "image.") {
            if (temporary !== true) {
                localStorage.setItem("fluidThemeImageURL", document.documentElement.dataset.themeImage);
                localStorage.setItem("fluidThemeImage", true);
            }

            //Update UI
            $("#themeMenu #fluidThemeImage").addClass("active");
            $("#themeMenu #fluidThemeImageInput").show();
            $("#themeMenu #fluidThemeImageInput input").val(document.documentElement.dataset.themeImage);
        } else {
            if (temporary !== true) localStorage.removeItem("fluidThemeImage");

            //Update UI
            $("#themeMenu #fluidThemeImage").removeClass("active");
            $("#themeMenu #fluidThemeImageInput").hide();
            $("#themeMenu #fluidThemeImageInput input").val("");
        }
    } else if (requestedTheme) {
        if (temporary !== true) {
            localStorage.setItem("fluidTheme", requestedTheme);
        }

        //Update UI
        $(".themeOptions .themeSelection").removeClass("active");
        $(".themeOptions .themeSelection." + requestedTheme).addClass("active");

        //Legacy themeSelector
        $(".btns.themeSelector .btn").removeClass("active");
        $(".btns.themeSelector .btn[data-theme=" + requestedTheme + "]").addClass("active");

        if (fluid.themes[requestedTheme] && fluid.themes[requestedTheme].isColorTheme) {
            $(".themeOptions").addClass("noSelectorColors");
        } else {
            $(".themeOptions").removeClass("noSelectorColors");
        }
    }
    // -----------------------------------------

    // OTHER THEME THINGS ----------------------
    if ((requestedTheme !== currentTheme) && (currentTheme !== null)) {
        //emit theme change event if the theme has changed
        document.dispatchEvent(new CustomEvent('fluidTheme', { detail: requestedTheme }))
    }
    // -----------------------------------------

}

/**
 * Applies a theme, stores the preference, and updates the theme selection UI
 * 
 * @param {string|boolean} requestedImage The URL of the image to apply. If false, the theme image will be disabled.
 * @param {boolean} [temporary=false] If the image is only being applied temporarily. When true, the theme will be applied, but the preference will not be saved.
 */
fluid.themeImage = function (requestedImage, temporary) {
    //Check for theme image config
    if (!fluid.config.allowBackgroundImages && requestedImage) return;

    // GET CURRENT THEME -----------------------
    var prop = getComputedStyle(document.documentElement).getPropertyValue('--themeImage');
    var currentImage = prop && prop.match(/(?<=^url\(("|'))(.*)(?=("|')\)$)/)[0];
    if (requestedImage == undefined) return currentImage;
    // -----------------------------------------

    //Apply theme image
    var isDataImage = requestedImage && requestedImage.startsWith("data:image/");
    if (requestedImage) {
        if (!$("#fluidImageCSS")[0]) $("head").append('<style id="fluidImageCSS"></style>');
        $("#fluidImageCSS").html(`:root { --themeImage:url("${requestedImage}"); }`);
        document.documentElement.dataset.themeImage = "";
    } else {
        $("#fluidImageCSS").remove();
        delete document.documentElement.dataset.themeImage;
    }
    // -----------------------------------------

    // SAVE THEME PREF AND UPDATE UI -------------------
    if (requestedImage) {
        if (temporary !== true) {
            localStorage.setItem("fluidThemeImageURL", requestedImage);
            localStorage.setItem("fluidThemeImage", true);
        }

        //Update UI
        $("#fluidThemeImage").addClass("active");
        $("#fluidThemeImageInput").show();

        if (isDataImage) {
            $("#fluidImageURL").val(fluid.strings.FILE_UPLOADED);
            $("#fluidThemeImageInput i.inputIcon").html("insert_drive_file");
            $("#fluidImageURL").attr("disabled", true);

            $("#fluidImageFileRemove").show();
            $("#fluidImageFileAdd").hide();
        } else {
            $("#fluidThemeImageInput input").val(requestedImage);
            $("#fluidThemeImageInput i.inputIcon").html("link");
            $("#fluidImageURL").attr("disabled", false);

            $("#fluidImageFileRemove").hide();
            $("#fluidImageFileAdd").show();
        }
    } else {
        if (temporary !== true) localStorage.removeItem("fluidThemeImage");

        //Update UI
        $("#fluidThemeImage").removeClass("active");
        $("#fluidThemeImageInput").hide();

        $("#fluidThemeImageInput input").val("");
        $("#fluidThemeImageInput i.inputIcon").html("link");
        $("#fluidImageURL").attr("disabled", false);

        $("#fluidImageFileRemove").hide();
        $("#fluidImageFileAdd").show();
    }
    // -----------------------------------------

    // OTHER THEME THINGS ----------------------
    if (requestedImage !== currentImage) {
        //emit theme change event if the theme has changed
        document.dispatchEvent(new CustomEvent('fluidThemeImage', { detail: requestedImage }));
    }
    // -----------------------------------------
}

/**
 * Gets a Fluid UI preference
 * 
 * @param {string} key The name of the preference to get 
 */
fluid.get = function (key) {
    return window.localStorage.getItem(key);
}

/**
 * Sets a Fluid UI preference
 * 
 * @param {string} key The name of the preference to set
 * @param {string} val The value of the preference to set 
 * @param {'load'} [trigger] This is "load" if setting the preference during initial page load 
 */
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
                $(".switch." + key + ", .btn." + key + ", .checkbox." + key).addClass("active");
            } else {
                $(".switch." + key + ", .btn." + key + ", .checkbox." + key).removeClass("active");
            }
        } else {
            //value pref
            $(".btns." + key + " .btn, .radio." + key + " .checkbox").removeClass("active")
            $(".btns." + key + " .btn." + val + ", .radio." + key + " .checkbox." + val).addClass("active")
        }
        if (trigger == undefined) window.localStorage.setItem(key, val);
        if (trigger !== "load") {
            document.dispatchEvent(new CustomEvent(key, { detail: val }));
        }
    } else {
        console.error("Error: Calling fluid.set with invalid prefrence name. Make sure the name of your prefrence starts with 'pref-'. See https://fluid-old.jottocraft.com/#input-prefs.")
    }
}

/**
 * Applies the fluidConfig configuration parameters, if provided. Ran automatically from fluid.onLoad, but can be called manually after if needed.
 * If ran multiple times, each fluidConfig acts as a patch over the previous.
 */
fluid.applyConfig = function () {
    //Apply fluid config
    if (window.fluidConfig) {
        //Apply fluid config from fluidConfig if provided
        if (fluidConfig.config) {
            Object.assign(fluid.config, fluidConfig.config);
        }

        //Add themes from config if provided
        if (fluidConfig.themes) {
            Object.keys(fluidConfig.themes).forEach(id => {
                //Filter out reserved theme names
                if ((id == "dark") || (id == "light") || (id == "auto") || (id == "system")) return;

                if (fluid.themes[id]) {
                    fluid.themes[id] = Object.assign(fluid.themes[id], fluidConfig.themes[id]);
                } else {
                    fluid.themes[id] = fluidConfig.themes[id];
                }
            });
        }

        //Apply string overrides from fluidConfig if provided
        if (fluidConfig.strings) {
            Object.assign(fluid.strings, fluidConfig.strings);
        }
    }
}

/**
 * Loads Fluid UI JavaScript features for initial page load.
 * This should only run once. fluid.init should be used instead for initializing new elements page.
 */
fluid.onLoad = function () {
    //NOTE: fluid.onLoad should ONLY be loaded on the initial page load. Use fluid.init to initialize elements added after page load.

    //Apply configuration
    fluid.applyConfig();

    //Unsupported browser alert
    if (window.navigator.userAgent.includes('MSIE ') || window.navigator.userAgent.includes('Trident/')) {
        alert("Internet Explorer is not supported. Please upgrade to a modern browser like Microsoft Edge or Google Chrome.")
        throw "[Fluid UI] Error: Unsupported browser";
    }

    //load initial fluid ui theme
    if (window.localStorage.getItem("fluidTheme") !== null) {
        fluid.theme(window.localStorage.getItem("fluidTheme"), true);
    } else if (fluid.config.defaultTheme) {
        fluid.theme(fluid.config.defaultTheme, true);
    } else {
        fluid.theme("system", true);
    }

    //load initial theme image
    if (window.localStorage.getItem("fluidThemeImage") == "true") {
        if (window.localStorage.getItem("fluidThemeImageURL")) {
            fluid.themeImage(window.localStorage.getItem("fluidThemeImageURL"), true);
        } else {
            window.localStorage.removeItem("fluidThemeImage");
        }
    }

    //initialize elements when document is ready
    $(document).ready(() => fluid.init());
}

/**
 * Used to initialize new elements added to the document
 */
fluid.init = function () {
    //generate overlay
    fluid.generateOverlay();

    //Load initial prefrences
    for (var i = 0; i < Object.keys(window.localStorage).length; i++) {
        if (Object.keys(window.localStorage)[i].startsWith("pref-")) {
            fluid.set(Object.keys(window.localStorage)[i], window.localStorage.getItem(Object.keys(window.localStorage)[i]), "load");
        }
    }

    //Legacy theme selector
    $(".btns.row.themeSelector").html(`
      <button onclick="fluid.theme('system')" data-theme="system" class="btn ${fluid.currentTheme == "system" ? 'active' : ""}"><div class="lightDarkSplit"></div><div class="themeName"><i class="fluid-icon">computer</i> ${fluid.strings.SYSTEM}</div></button>
      <button onclick="fluid.theme('light')" data-theme="light" data-theme-type="light" class="btn ${document.documentElement.dataset.theme == "light" ? 'active' : ""}"><div class="themeName"><i class="fluid-icon">light_mode</i> ${fluid.strings.LIGHT}</div></button>
      <button onclick="fluid.theme('dark')" data-theme="dark" data-theme-type="dark" class="btn ${document.documentElement.dataset.theme == "dark" ? 'active' : ""}"><div class="themeName"><i class="fluid-icon">dark_mode</i> ${fluid.strings.DARK}</div></button>
    `);

    //New theme selection UI
    var hasThemeImage = window.localStorage.getItem("fluidThemeImage") == "true";
    $(".themeSelectionUI").html(/*html*/`
      <div class="themeOptions ${fluid.themes[document.documentElement.dataset.theme] && fluid.themes[document.documentElement.dataset.theme].isColorTheme ? "noSelectorColors" : ""}">
        <div onclick="fluid.theme('system')" style="--themeSelectorColor: none;" class="themeSelection system ${document.documentElement.dataset.theme == "system" ? "active" : ""}"><i class="fluid-icon">computer</i> <span>${fluid.strings.SYSTEM}</span></div>
        <div onclick="fluid.theme('light')" data-theme="light" data-theme-type="light" class="themeSelection light ${document.documentElement.dataset.theme == "light" ? "active" : ""}"><i class="fluid-icon">light_mode</i> <span>${fluid.strings.LIGHT}</span></div>
        <div onclick="fluid.theme('dark')" data-theme="dark" data-theme-type="dark" class="themeSelection dark ${document.documentElement.dataset.theme == "dark" ? "active" : ""}"><i class="fluid-icon">dark_mode</i> <span>${fluid.strings.DARK}</span></div>
        <div class="divider"></div>
        ${Object.keys(fluid.themes).filter(id => fluid.config.allowedThemes.includes ? fluid.config.allowedThemes.includes(id) : true).map(id => {
        var theme = fluid.themes[id];
        return `<div onclick="fluid.theme('${id}')" ${theme.colors ? `style="--themeSelectorColor: ${theme.colors.themeSelectorColor || "none"};"` : `data-theme="${id}" data-theme-type="${theme.type}"`} class="themeSelection ${id} ${document.documentElement.dataset.theme == id ? "active" : ""}"><i class="fluid-icon">${theme.icon}</i> <span>${theme.name}</span></div>`
    }).join("")}
      </div>
      <div class="themeCustomization">
        <h5><i class="fluid-icon">wallpaper</i> <span>${fluid.strings.BACKGROUND_IMAGE}</span></h5>
        <div style="margin-bottom: 20px;">
            <div id="fluidThemeImage" init="true" class="switch ${hasThemeImage ? "active" : ""}"><span class="head"></span></div>
            <div class="label">${fluid.strings.USE_BACKGROUND_IMAGE}</div>
        </div>
        <div id="fluidThemeImageInput" ${!hasThemeImage ? `style="display: none;"` : ``}>
            ${window.localStorage.getItem("fluidThemeImageURL") && window.localStorage.getItem("fluidThemeImageURL").startsWith("data:image/") ? `
                <i class="inputIcon fluid-icon">insert_drive_file</i>
                <input id="fluidImageURL" value="${fluid.strings.FILE_UPLOADED}" disabled style="margin-bottom: 10px;" class="inputIcon" placeholder="${fluid.strings.IMAGE_URL}" />
                <button id="fluidImageFileRemove" class="btn small"><i class="fluid-icon">remove_circle_outline</i> ${fluid.strings.REMOVE_FILE}</button>
                <button id="fluidImageFileAdd" style="display: none;" class="btn small"><i class="fluid-icon">file_upload</i> ${fluid.strings.UPLOAD_IMAGE}</button>
            ` : `
                <i class="inputIcon fluid-icon">link</i>
                <input id="fluidImageURL" value="${window.localStorage.getItem("fluidThemeImageURL") || ""}" style="margin-bottom: 10px;" class="inputIcon" placeholder="${fluid.strings.IMAGE_URL}" />
                <button id="fluidImageFileRemove" style="display: none;" class="btn small"><i class="fluid-icon">remove_circle_outline</i> ${fluid.strings.REMOVE_FILE}</button>
                <button id="fluidImageFileAdd" class="btn small"><i class="fluid-icon">file_upload</i> ${fluid.strings.UPLOAD_IMAGE}</button>
            `}

            <input id="fluidImageFile" type="file" accept="image/*" style="display: none;">
        </div>
      </div>
    `);

    $("#fluidImageFileAdd").click(() => $("#fluidImageFile").click());
    $("#fluidImageFileRemove").click(() => {
        localStorage.removeItem("fluidThemeImageURL");
        fluid.themeImage(false);
    });

    $(".switch#fluidThemeImage").click(e => {
        $(".switch#fluidThemeImage").toggleClass("active");

        if ($(".switch#fluidThemeImage").hasClass("active")) {
            if (window.localStorage.getItem("fluidThemeImageURL")) {
                fluid.themeImage(window.localStorage.getItem("fluidThemeImageURL"));
            } else {
                $("#fluidThemeImageInput").show();
            }
        } else {
            fluid.themeImage(false);
        }
    });

    $("#fluidImageURL").change(e => {
        var val = $("#fluidImageURL").val();
        if (val) {
            fluid.themeImage(val);
        } else {
            window.localStorage.removeItem("fluidThemeImageURL");
            fluid.themeImage(false);
        }
    });

    $("#fluidImageFile").on("change", function () {
        var file = this.files[0];
        var reader = new FileReader();

        reader.addEventListener("load", function () {
            fluid.themeImage(reader.result);
        }, false);
        reader.readAsDataURL(file);
    });

    //Sidebar collapsed
    if (window.localStorage.getItem("fluidSidebarCollapsed") == "true") {
        $("body").addClass("collapsedSidebar");
    }

    //Sidebar group collapsed state
    for (var i = 0; i < $(".sidebar .group").length; i++) {
        var group = $($(".sidebar .group")[i]);
        if (group.attr("id") && window.localStorage.getItem("fluidSidebar-" + group.attr("id"))) {
            //Sidebar collapsed state pref
            if (window.localStorage.getItem("fluidSidebar-" + group.attr("id")) == "open") {
                group.addClass("open");
            } else if (window.localStorage.getItem("fluidSidebar-" + group.attr("id")) == "closed") {
                group.removeClass("open");
            }
        }
    }

    $(".btns:not(.themeSelector) .btn:not(.manual):not([init='true']), .list.select .item:not(.manual):not([init='true']), .sidenav .item:not(.manual):not([init='true']), .sidebar .item:not(.group .name):not(.manual):not(.footer):not([init='true']), .radio .checkbox:not([init='true'])").click(function (event) {
        if (!($(this).parent().attr("class") || "").includes("pref-") && !($(this).parents(".radio").attr("class") || "").includes("pref-")) {
            //not a pref
            if ($(this).parent().hasClass("multiple")) {
                //Multiple selection mode
                $(this).toggleClass("active")
            } else if ($(this).parents(".sidebar").length) {
                //Sidebar
                $(this).parents(".sidebar").find(".item:not(.group .name)").removeClass("active");
                $(this).addClass("active");
            } else if ($(this).parents(".radio").length) {
                //radio button
                $(this).parent().siblings().children(".checkbox").removeClass("active")
                $(this).addClass("active")
            } else {
                $(this).siblings().removeClass("active")
                $(this).addClass("active")
            }
        }
    });
    $(".btns:not(.themeSelector) .btn:not(.manual):not([init='true']), .list.select .item:not(.manual):not([init='true']), .sidenav .item:not(.manual):not([init='true']), .sidebar .item:not(.group .name):not(.manual):not(.footer):not([init='true']), .radio .checkbox:not([init='true'])").attr("init", "true");

    $(".sidebar .group .name:not([init='true'])").click(function () {
        $(this).parent().toggleClass("open");

        if ($(this).parent().attr("id")) {
            if ($(this).parent().hasClass("open")) {
                window.localStorage.setItem("fluidSidebar-" + $(this).parent().attr("id"), "open");
            } else {
                window.localStorage.setItem("fluidSidebar-" + $(this).parent().attr("id"), "closed");
            }
        }
    });
    $(".sidebar .group .name:not([init='true'])").attr("init", "true");

    $(".navbar .profile:not([init='true'])").click(function () {
        if ($(".card.profileMenu").length) {
            fluid.generateOverlay();
            $(".card.profileMenu").show();
            fluid.blur(true);
        }
    });
    $(".navbar .profile:not([init='true'])").attr("init", "true");

    $(".sidebar .collapse:not([init='true'])").click(function () {
        $('body').toggleClass('collapsedSidebar');
        if ($('body').hasClass('collapsedSidebar')) {
            window.localStorage.setItem("fluidSidebarCollapsed", "true");
        } else {
            window.localStorage.setItem("fluidSidebarCollapsed", "false");
        }
    });
    $(".sidebar .collapse:not([init='true'])").attr("init", "true");

    fluid.shouldSwitch = true;
    $(".switch:not([init='true']), .checkbox:not([init='true'])").click(function (event) {
        if (!$(this).parents(".radio")[0]) {
            //not a radio button
            if (fluid.shouldSwitch && !$(this).attr("class").includes("pref-")) {
                //not a pref
                $(this).toggleClass("active");
                fluid.shouldSwitch = false;
                setTimeout(() => fluid.shouldSwitch = true, 400)
            }
        }
    });
    $(".switch:not([init='true']), .checkbox:not([init='true'])").attr("init", "true");

    $("div.nav.active li:not([init='true'])").click(function (event) {
        $(this).siblings().removeClass("active")
        $(this).addClass("active")
    });
    $("div.nav.active li:not([init='true'])").attr("init", "true");

    $(".section.collapse .header:not([init='true'])").click(function (event) {
        if ($(this).parent().hasClass("collapsed")) {
            if ($(this).parent().hasClass("one")) {
                $(this).parent().siblings().addClass("collapsed");
            }
        }
        $(this).parent().toggleClass("collapsed");
    });
    $(".section.collapse .header:not([init='true'])").attr("init", "true");
}

/**
 * Updates the current screen state and loads a new screen
 * 
 * @param {string} [requestedID] The ID of the screen to load
 * @param {string|object} [ctx] The context passed to the screen
 */
fluid.screen = function (requestedID, ctx) {
    //mark screens as enabled for back button listener
    fluid.screensEnabled = true;

    //update screen
    if (fluid.screens[requestedID]) {
        var hash = null;

        if (requestedID == fluid.defaultScreen ? ctx : true) {
            hash = "#/" + requestedID + (ctx ? "/" + (typeof ctx == "object" ? JSON.stringify(ctx) : ctx) : "");
        } else {
            hash = "#/";
        }

        if (decodeURI(document.location.hash) == hash) {
            //Load screen directly if the hash is already set
            fluid.loadScreen(requestedID, ctx);
        } else {
            //Change the hash which will automatically trigger a screen load
            if (!window.location.pathname.endsWith("/")) history.replaceState({}, '', window.location.pathname + "/");
            document.location.hash = hash;
        }
    } else if (!requestedID) {
        //Reload existing screen or default screen if no ID is provided
        var { screenID, param } = fluid.getURLScreen();
        if (screenID) {
            fluid.screen(screenID, param);
        } else {
            fluid.screen(fluid.defaultScreen, ctx);
        }
    } else {
        //screen not found
        console.error("[FLUID UI] fluid.screen was called, but no screen could be found. Make sure you have defined the screen you are trying to navigate to or the default screen.");
    }
}

/**
 * Loads a screen. This should not be called directly (see fluid.screen instead).
 * 
 * @param {string} screenID The ID of the screen to load
 * @param {string|object} [ctx] The context parameter passed to the screen
 */
fluid.loadScreen = function (screenID, ctx) {
    if (typeof fluid.screens[screenID] == "string") {
        //external screen
        if (fluid.externalScreens[screenID]) {
            //external screen already loaded
            fluid.externalScreens[screenID](ctx);
        } else {
            //external screen not yet loaded
            $.getScript(fluid.screens[screenID], () => {
                if (fluid.externalScreens[screenID]) {
                    fluid.externalScreens[screenID](ctx);
                } else {
                    console.error("[FLUID UI] Error: The scriptURL for screen '" + screenID + "' does not define fluid.externalScreens['" + screenID + "']");
                }
            });
        }
    } else {
        fluid.screens[screenID](ctx);
    }
}

/**
 * Generates the blur overlay used when a card is opened.
 * This should not be called directly.
 */
fluid.generateOverlay = function () {
    if (!$("#fluidUIOverlay").length) {
        $("body").prepend(`<div class="hidden" id="fluidUIOverlay"></div>`);
        $(".card.focus").appendTo("#fluidUIOverlay");
        $("#fluidUIOverlay").append("<div id='themeMenu' class='focus card close' style='height: 100%;'></div>");

        $("#fluidUIOverlay").click(function (e) {
            if (e.target !== this) return;
            fluid.exitAlert();
            fluid.cards.close();
        });
    }
}

/**
 * Shows the page blur effect.
 * This should not be called directly.
 * 
 * @param {boolean} [noBlur=false] If this is true, the blur container will be shown without the blur effect
 */
fluid.blur = function (noBlur) {
    function getScrollbarWidth() {
        return window.innerWidth - document.documentElement.clientWidth;
    }

    if ($("#fluidUIOverlay").hasClass("hidden")) {
        $("body").css("--scrollbarWidth", getScrollbarWidth() + "px");
    }

    if (noBlur) {
        $("body").removeClass("disableOverflow");
        $("#fluidUIOverlay").removeClass("noBlur").removeClass("hidden").addClass("visible").addClass("noBlur");
    } else {
        $("body").addClass("disableOverflow");
        $("#fluidUIOverlay").removeClass("noBlur").removeClass("hidden").addClass("visible");
    }
}

/**
 * Removes the blur effect.
 * This should not be called directly.
 */
fluid.unblur = function () {
    if (!$("#fluidUIOverlay").hasClass("hidden") && $("#fluidUIOverlay").hasClass("visible")) {
        $("#fluidUIOverlay").removeClass("visible");
        $("body").removeClass("disableOverflow");

        setTimeout(function () {
            if (!$("#fluidUIOverlay").hasClass("visible")) $("#fluidUIOverlay").addClass("hidden");
        }, 200)
    }
}

/**
 * Shows a splash screen
 * 
 * @param {Element|string} element The element to show
 */
fluid.splash = function (element) {
    $("body").addClass("disableOverflow");
    $(element).show();
}

/**
 * Hides all splash screens
 */
fluid.unsplash = function () {
    $(".splashScreen").hide();
    $("body").removeClass("disableOverflow");
}

/**
 * Shows a card
 * 
 * @param {Element|string} element The card element to show
 */
fluid.cards = function (element) {
    fluid.generateOverlay();
    $(".card.focus:not(.close)").addClass("close");
    $(".card.profileMenu").hide();
    fluid.blur();
    $(element).addClass('container');
    $(element).removeClass('close');
}

/**
 * Closes the current card
 */
fluid.cards.close = function () {
    if (window?.dtps?.closeScreen()) return;
    $(".card.focus:not(.close)").addClass('close');
    fluid.unblur();
    $('.card.focus').removeClass("blur");
    $(".card.profileMenu").hide();
}

/**
* @typedef {object} AlertAction
* @description Sets the actions for an alert
* @property {string} icon Action icon
* @property {string} name Action name
* @property {function} action The function to run when the action is clicked
*/

/**
 * Shows a Fluid UI alert.
 * If only one parameter is provided (e.g. fluid.alert('Test alert')), a generic alert will be shown
 * 
 * @param {string} title The alert title 
 * @param {string} body Alert body HTML
 * @param {string} [icon] Alert icon
 * @param {AlertAction[]} [actions] Alert actions
 * @param {string} [color] The icon color 
 */
fluid.alert = function (title, body, icon, actions, color) {
    if (title && !body) {
        body = title;
        title = "Alert";
        icon = "notifications";
    }

    if (!color && (icon == "check")) color = "#3ba842";
    if (!color && (icon == "error")) color = "#a83b3b";
    if (!color && (icon == "warning")) color = "#d1a045";
    if (!color && (icon == "info")) color = "#459ed1";

    //Generate overlay
    fluid.generateOverlay();

    $("#activeAlert").remove();
    $("#fluidUIOverlay").append(`<div id="activeAlert" class="card alert">
<i class="fluid-icon close" onclick="fluid.exitAlert()">close</i>

 ${icon ? `<i style="color: ` + (color ? color : "var(--text)") + `" class="fluid-icon">${icon}</i>` : ""}
 <h5>${title}</h5>
 <div class="body">
  <div>${body}</div>
 </div>
 ` + (actions ? `<div class="footer">` + actions.map((action, key) => {
        return `<button class="btn ${key}">
   ` + (action.icon ? `<i class="fluid-icon">` + action.icon + `</i> ` : "") + action.name + `
   </button>`
    }).join("") + `</div>` : "") + `
</div>`);

    //Add onclick listeners
    if (actions) {
        actions.forEach((action, key) => {
            $("#activeAlert .footer .btn." + key).click(() => {
                if (action.action) action.action();
                fluid.exitAlert();
            })
        });
    }

    fluid.blur();
    $('.card.focus:not(.close)').addClass("blur");
}

/**
 * Closes the active alert
 */
fluid.exitAlert = function () {
    $("#activeAlert").remove();
    if (!$('.card.focus:not(.close)').length) fluid.unblur();
    $('.card.focus').removeClass("blur");
};

//Load Fluid UI
(function checkReady() {
    if (document.body) return fluid.onLoad();
    window.requestAnimationFrame(checkReady);
})();

//Fluid UI commands
var allowedKeys = {
    38: 'up',
    40: 'down',
    119: 'f8',
    120: 'f9',
    37: 'left',
    39: 'right',
    66: 'b',
    65: 'a'
};
var darkOverride = ['up', 'up', 'down', 'down', 'f8'];
var darkOverridePosition = 0;
var imageOverride = ['up', 'up', 'down', 'down', 'f9'];
var imageOverridePosition = 0;
document.addEventListener('keydown', function (e) {
    var key = allowedKeys[e.keyCode];
    var requiredKey = darkOverride[darkOverridePosition];
    if (key == requiredKey) {
        darkOverridePosition++;
        if (darkOverridePosition == darkOverride.length) {
            fluid.theme("toggle");
            darkOverridePosition = 0;
            e.preventDefault();
        }
    } else {
        darkOverridePosition = 0;
    }

    var requiredKey = imageOverride[imageOverridePosition];
    if (key == requiredKey) {
        imageOverridePosition++;
        if (imageOverridePosition == imageOverride.length) {
            if (window.localStorage.getItem("fluidThemeImageURL") && !document.documentElement.dataset.themeImage) {
                fluid.theme("image." + window.localStorage.getItem("fluidThemeImageURL"));
            } else {
                fluid.theme("image.");
            }
            imageOverridePosition = 0;
            e.preventDefault();
        }
    } else {
        imageOverridePosition = 0;
    }
});