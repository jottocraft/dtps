/**
 * @file DTPS bookmarklet loader
 * @author jottocraft
 * 
 * @copyright Copyright (c) 2018-2021 jottocraft
 * @license GPL-2.0-only
 */
const DTPS_ROOT_URL="https://powerplus.app/";if("dtechhs.instructure.com"==window.location.hostname)jQuery.getScript(DTPS_ROOT_URL+"/scripts/lms/dtech.js");else{if(!window.location.hostname.endsWith("instructure.com"))throw"Error: Invalid domain";jQuery.getScript(DTPS_ROOT_URL+"/scripts/lms/canvas.js")}
//# sourceMappingURL=/init.js.map