/**
 * @file DTPS bookmarklet loader
 * @author jottocraft
 * 
 * @copyright Copyright (c) 2018-2021 jottocraft. All rights reserved.
 * @license GPL-2.0-only
 */

const DTPS_ROOT_URL = "https://powerplus.app/";

if (window.location.hostname == "dtechhs.instructure.com") {
    //Load Design Tech High School script
    jQuery.getScript(DTPS_ROOT_URL + "/scripts/lms/dtech.js");
} else if (window.location.hostname.endsWith("instructure.com")) {
    //Load Canvas LMS script
    jQuery.getScript(DTPS_ROOT_URL + "/scripts/lms/canvas.js");
} else {
    throw "Error: Invalid domain";
}