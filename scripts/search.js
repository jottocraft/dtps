/**
 * @file DTPS global search
 * @author jottocraft
 * 
 * @copyright Copyright (c) 2018-2020 jottocraft. All rights reserved.
 * @license GPL-2.0-only
 */


/**
 * Searches Power+ globally and shows results on the "Search Results" screen
 * 
 * @param term {string} The search term typed in the input box
 */
dtps.globalSearch = function (term) {
    //Ensure classes are rendered in the sidebar
    dtps.presentClass("search");
    dtps.showClasses();

    //Clear active state from all tabs
    $("#dtpsTabBar .btn").removeClass("active");

    jQuery(".classContent").html([1, 2, 3, 4].map(() => (
        /*html*/`
            <div class="card assignment graded">
                <h4>
                    <span style="width: 450px;" class="shimmer">Assignment Title</span>
                    <div class="points shimmer">00/00</div>
                </h4>

                <h5 style="white-space: nowrap; overflow: hidden;">
                    <div style="width: 200px;" class="infoChip shimmer"></div>
                    <i class="material-icons statusIcon shimmer">more_horiz</i>
                </h5>
            </div>
        `
    )).join(""));

    return;

    var resultHTML = "";
    var searchData = [];

    dtps.classes.forEach(course => {
        if (course.assignments) {
            //If course has assignments, add them to the combined stream array
            searchData = searchData.concat(course.assignments);
        }
    });

    var search = new Fuse(searchData, {
        keys: ["title", "body"],
        includeMatches: true
    });
}

//Fluid UI screen definitions
fluid.externalScreens.search = (term) => {
    dtps.globalSearch(term);
}