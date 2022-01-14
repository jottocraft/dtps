/**
 * @file DTPS loader
 * @author jottocraft
 * 
 * @copyright Copyright (c) 2018-2022 jottocraft
 * @license MIT
 */

window.dtpsBaseURL = "https://powerplus.app";

if (window.location.hostname === "dtechhs.instructure.com") {
    //Load Design Tech High School script
    jQuery.getScript(window.dtpsBaseURL + "/scripts/lms/dtech.js");
} else {
    //Load Canvas LMS script
    jQuery.getScript(window.dtpsBaseURL + "/scripts/lms/canvas.js");
}