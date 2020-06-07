/**
 * @file DTPS bookmarklet loader
 * @author jottocraft
 * 
 * @copyright Copyright (c) 2018-2020 jottocraft. All rights reserved.
 * @license GPL-2.0-only
 */

const DTPS_ROOT_URL = "https://powerplus.app/";

if (window.location.hostname == "dtechhs.instructure.com") {
    jQuery.getScript(DTPS_ROOT_URL + "/scripts/lms/dtech.js");
} else {
    throw "Error: Invalid domain";
}