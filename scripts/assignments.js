/**
 * @file DTPS assignment functions
 * @author jottocraft
 * 
 * @copyright Copyright (c) 2018-2020 jottocraft. All rights reserved.
 * @license GPL-2.0-only
 */

/**
 * Renders HTML for an assignment item in a list
 * 
 * @param {Assignment} assignment The assignment object to render
 * @return {string} Assignment HTML for use in a list
 */
dtps.renderAssignment = function (assignment) {
    //Render points/letter score
    var scoreHTML = dtps.renderAssignmentScore(assignment);

    var HTML = /*html*/`
        <div 
            onclick="${`dtps.assignment('` + assignment.id + `', ` + assignment.class + `)`}" 
            class="card ${scoreHTML ? "graded assignment" : "assignment"}"
            style="${'--classColor: ' + dtps.classes[assignment.class].color}"
        >

            <!-- Color bar for the dashboard -->
            <div class="colorBar"></div>

            <!-- Assignment title and points -->
            <h4>
                <span>${assignment.title}</span>

                <!-- Points display -->
                ${scoreHTML ? `<div class="points">${scoreHTML}</div>` : ``}
            </h4>

            <h5 style="white-space: nowrap; overflow: hidden;">
                <!-- Assignment info -->
                ${assignment.dueAt ? `<div class="infoChip"><i style="margin-top: -2px;" class="material-icons">alarm</i> Due ` + dtps.formatDate(assignment.dueAt) + `</div>` : ""}
                ${assignment.outcomes ? `<div class="infoChip weighted"><i class="material-icons">adjust</i>` + assignment.outcomes.length + `</div>` : ""}
                ${assignment.category ? `<div class="infoChip weighted"><i class="material-icons">category</i> ` + assignment.category + `</div>` : ""}

                <!-- Status icons -->
                ${assignment.turnedIn ? `<i title="Assignment submitted" class="material-icons statusIcon" style="color: #0bb75b;">assignment_turned_in</i>` : ``}
                ${assignment.missing ? `<i title="Assignment is missing" class="material-icons statusIcon" style="color: #c44848;">remove_circle_outline</i>` : ``}
                ${assignment.late ? `<i title="Assignment is late" class="material-icons statusIcon" style="color: #c44848;">assignment_late</i>` : ``}
                ${assignment.locked ? `<i title="Assignment submissions are locked" class="material-icons statusIcon" style="font-family: 'Material Icons Extended'; color: var(--secText, gray);">lock_outline</i>` : ``}
                ${assignment.pending ? `<i title="Grade is pending review" class="material-icons statusIcon" style="color: #b3b70b;">rate_review</i>` : ``}
            </h5>
        </div>
    `;

    return HTML;
}

/**
* Renders HTML for an assignment score if the assignment is graded
* 
* @param {Assignment} assignment The assignment object to render a score for
* @return {string} Assignment score HTML
*/
dtps.renderAssignmentScore = function (assignment) {
    var scoreHTML = "";

    //Use rubric score over points score if possible
    if (dtpsLMS.useRubricGrades && assignment.rubric) {
        var rubricHTML = [];

        assignment.rubric.forEach(rubricItem => {
            if (rubricItem.score) {
                rubricHTML.push(/*html*/`
                    <div title="${rubricItem.title}" style="color: ${rubricItem.color || "var(--text)"};">
                        ${rubricItem.score}
                    </div>
                `);
            }
        });

        if (rubricHTML.length) scoreHTML = `<div class="dtpsRubricScore">${rubricHTML.join("")}</div>`;

    } else if (!dtpsLMS.useRubricGrades && (assignment.grade || (assignment.grade == 0))) {
        scoreHTML = /*html*/`
            <div class="assignmentGrade">
                <div class="grade">${assignment.grade}</div>
                <div class="value">/${assignment.value}</div>
                ${assignment.letter ? `<div class="letter">${assignment.letter.replace("incomplete", `<i class="material-icons">cancel</i>`).replace("complete", `<i class="material-icons">done</i>`)}</div>` : ""}
                <div class="percentage">${Math.round((assignment.grade / assignment.value) * 100)}%</div>
            </div>
        `;
    }

    return scoreHTML;
}

/**
 * Renders the DTPS dashboard and calls dtps.renderCalendar, dtps.renderUpdates, and dtps.renderUpcoming
 */
dtps.masterStream = function () {
    //Ensure classes are rendered in the sidebar
    dtps.presentClass("dash");
    dtps.showClasses();

    //Clear active state from all tabs
    $("#dtpsTabBar .btn").removeClass("active");

    //Count amount of classes that are loaded
    var ready = 0;
    dtps.classes.forEach(course => {
        if (course.assignments) ready++;
    });

    //Check if all classes are loaded
    var doneLoading = ready == dtps.classes.length;

    //Returns dashboard item container HTML for an item
    function dashboardContainerHTML(dashboardItem) {
        if (dashboardItem.id == "dtps.calendar") {
            return $.fullCalendar !== undefined ? `<div id="calendar" class="card" style="padding: 20px;"></div>` : "";
        } else if (dashboardItem.id == "dtps.updates") {
            return `<div class="updatesStream recentlyGraded announcements"></div>`;
        } else if (dashboardItem.id == "dtps.dueToday") {
            return `<div style="padding: 20px 0px;" class="dueToday"></div>`;
        } else if (dashboardItem.id == "dtps.upcoming") {
            return `<div style="padding: 20px 0px;" class="assignmentStream"></div>`;
        }
    }

    //Render HTML with loading placeholder
    if (dtps.selectedClass == "dash") {
        jQuery(".classContent").html(/*html*/`
            <div class="dash cal" style="width: 40%;display: inline-block; vertical-align: top;">
                ${dtps.leftDashboard.map(dashboardItem => {
            return dashboardContainerHTML(dashboardItem);
        }).join("")}
            </div>

            <div style="width: 59%; display: inline-block;" class="dash stream">
                ${!doneLoading ? `<div style="margin: 75px 25px 10px 75px;"><div class="spinner"></div></div>` : ""}
                ${dtps.rightDashboard.map(dashboardItem => {
            return dashboardContainerHTML(dashboardItem);
        }).join("")}
            </div>
        `);
    }

    //Render updates stream
    dtps.renderUpdates();

    //Render upcoming assignments stream
    dtps.renderUpcoming(doneLoading);

    //Render calendar
    dtps.calendar();

    //Render due today
    dtps.renderDueToday(doneLoading);
}

/**
 * Compiles and displays due today / to-do stream
 * 
 * @param {boolean} doneLoading True if all classes have finished loading their assignment lists
 */
dtps.renderDueToday = function (doneLoading) {
    //Combine class stream arrays
    var combinedStream = [];
    if (dtps.classes) {
        dtps.classes.forEach(course => {
            if (course.assignments) {
                //If course has assignments, add them to the combined stream array
                course.assignments.forEach(assignment => {
                    //Only assignments that are due today
                    if (dtps.isToday(assignment.dueAt)) {
                        combinedStream.push(assignment);
                    }
                })
            }
        })
    }

    //Sort combined stream by date
    combinedStream.sort(function (a, b) {
        var keyA = new Date(a.dueAt).getTime(),
            keyB = new Date(b.dueAt).getTime();

        // Compare the 2 dates
        if (keyA > keyB) return 1;
        if (keyA < keyB) return -1;
        return 0;
    });

    //Get due today stream HTML
    var combinedHTML = combinedStream.map(assignment => {
        return dtps.renderAssignment(assignment);
    }).join("");

    if (combinedStream.length == 0) {
        //Nothing due today
        if (doneLoading) {
            combinedHTML = `<p style="text-align: center;margin: 10px 25px 10px 75px; font-size: 18px;"><i class="material-icons">done</i> Nothing due today</p>`;
        } else {
            combinedHTML = ``;
        }
    } else {
        //Add header
        combinedHTML = /*html*/`
            <h5 style="text-align: center; margin: 10px 25px 10px 75px; font-weight: bold;">Due today</h5>
        ` + combinedHTML;
    }

    if (dtps.selectedClass == "dash") {
        jQuery(".classContent .dash .dueToday").html(combinedHTML);
    }
}

/**
 * Compiles and displays upcoming assignments stream
 */
dtps.renderUpcoming = function () {
    //Combine class stream arrays
    var combinedStream = [];
    if (dtps.classes) {
        dtps.classes.forEach(course => {
            if (course.assignments) {
                //If course has assignments, add them to the combined stream array
                course.assignments.forEach(assignment => {
                    //Only include upcoming assignments that aren't due today
                    if ((new Date(assignment.dueAt) > new Date()) && !dtps.isToday(assignment.dueAt)) {
                        combinedStream.push(assignment);
                    }
                })
            }
        })
    }

    //Sort combined stream by date
    combinedStream.sort(function (a, b) {
        var keyA = new Date(a.dueAt).getTime(),
            keyB = new Date(b.dueAt).getTime();

        // Compare the 2 dates
        if (keyA > keyB) return 1;
        if (keyA < keyB) return -1;
        return 0;
    });

    //Render upcoming assignments stream
    var combinedHTML = combinedStream.map(assignment => {
        return dtps.renderAssignment(assignment);
    }).join("");

    //No upcoming assignments
    if (combinedStream.length == 0) {
        combinedHTML = "";
    }

    if (dtps.selectedClass == "dash") {
        jQuery(".classContent .dash .assignmentStream").html(combinedHTML);
    }
}

/**
 * Renders updates stream (recently graded & announcements)
 */
dtps.renderUpdates = function () {
    //Get updates HTML
    var updatesHTML = "";

    dtps.updates.forEach(update => {
        if (update.type == "announcement") {
            updatesHTML += /*html*/`
                <div onclick="$(this).toggleClass('open');" style="cursor: pointer; padding: 20px; --classColor: ${dtps.classes[update.class].color};" class="announcement card">
                    <div class="className">${dtps.classes[update.class].subject}</div>
                    ${update.body}
                </div>
            `;
        } else if (update.type == "assignment") {
            var scoreHTML = dtps.renderAssignmentScore(update);
            updatesHTML += /*html*/`
                <div onclick="dtps.assignment('${update.id}', ${update.class})" style="--classColor: ${dtps.classes[update.class].color};" class="card recentGrade">
                    <h5>
                        <span>${update.title}</span>

                        <!-- Points display -->
                        ${scoreHTML ? `<div class="points">${scoreHTML}</div>` : ``}
                    </h5>

                    <p>Graded at ${dtps.formatDate(update.gradedAt)}</p>
                </div>
            `;
        }
    })

    if (dtps.selectedClass == "dash") {
        jQuery(".classContent .dash .updatesStream").html(updatesHTML);
    }
}


/**
 * Compiles and displays the assignment calendar
 */
dtps.calendar = function () {
    if (dtps.selectedClass == "dash") {
        //Calendar events array
        var calEvents = [];

        //Add assignments from every class to calEvents array
        dtps.classes.forEach((course, courseIndex) => {
            if (course.assignments) {
                //Class has assignments
                course.assignments.forEach(assignment => {
                    calEvents.push({
                        title: assignment.title,
                        start: moment(new Date(assignment.dueAt)).toISOString(true),
                        allDay: false,
                        color: course.color,
                        classNum: courseIndex,
                        assignmentID: assignment.id
                    });
                });
            }
        });

        //Render calendar
        if ($.fullCalendar !== undefined) {
            $('#calendar').fullCalendar({
                events: calEvents,
                header: {
                    left: 'title',
                    right: 'prev,next'
                },
                eventClick: function (calEvent, jsEvent, view) {
                    dtps.assignment(calEvent.assignmentID, calEvent.classNum);
                },
                eventAfterAllRender: function () {
                    $(".fc-prev-button").html(`<i class="material-icons">keyboard_arrow_left</i>`);
                    $(".fc-next-button").html(`<i class="material-icons">keyboard_arrow_right</i>`);
                }
            });
        }
        $(".fc-prev-button").html(`<i class="material-icons">keyboard_arrow_left</i>`);
        $(".fc-next-button").html(`<i class="material-icons">keyboard_arrow_right</i>`);

    }
}

/**
 * Shows the assignments stream for a class
 * 
 * @param {string} classID The class ID to show assignments for
 * @param {Assignment[]} [searchResults] An array of assignemnts to render instead of course.assignments. Used for assignment search.
 * @param {string} [searchText] Text to render in the search box. Used for assignment search.
 */
dtps.classStream = function (classID, searchResults, searchText) {
    //Get class index and set as selected class
    var classNum = dtps.classes.map(course => course.id).indexOf(classID);
    dtps.selectedClass = classNum;

    //Set stream as the selected content
    dtps.selectedContent = "stream";
    $("#dtpsTabBar .btn").removeClass("active");
    $("#dtpsTabBar .btn.stream").addClass("active");

    //Load class color, name, etc.
    dtps.presentClass(classNum);

    //Ensure classes are shown in the sidebar
    dtps.showClasses();

    if (classNum == -1) {
        //Class does not exist
        dtps.error("The selected class doesn't exist", "classNum check failed @ dtps.classStream");
    }

    //Use search results to render or render all class assignments
    var assignments = searchResults || dtps.classes[classNum].assignments;

    //Render assignments
    if (!assignments) {
        //Assignments are still loading
        if ((dtps.selectedClass == classNum) && (dtps.selectedContent == "stream")) {
            jQuery(".classContent").html(dtps.renderClassTools(classNum, "stream", searchText) + `<div class="spinner"></div>`);
        }
    } else if (assignments.length == 0) {
        if (searchText) {
            //No search results
            if ((dtps.selectedClass == classNum) && (dtps.selectedContent == "stream")) {
                $(".classContent").html(/*html*/ dtps.renderClassTools(classNum, "stream", searchText) + `
                    <div style="cursor: auto;" class="card assignment">
                        <h4>No results</h4>
                        <p>There weren't any search results</p>
                        <button onclick="fluid.screen()" class="btn"><i class="material-icons">arrow_back</i> Back</button>
                    </div>
                `);
            }
        } else {
            //This class doesn't have any assignments
            if ((dtps.selectedClass == classNum) && (dtps.selectedContent == "stream")) {
                $(".classContent").html(dtps.renderClassTools(classNum, "stream", searchText) + `<div style="cursor: auto;" class="card assignment"><h4>No assignments</h4><p>There aren't any assignments in this class yet</p></div>`);
            }
        }
    } else {
        //Sort assignments
        assignments.sort(function (a, b) {
            var keyA = new Date(a.dueAt).getTime(),
                keyB = new Date(b.dueAt).getTime();

            var now = new Date().getTime();

            //Put assignments without a due date at the end
            if (!a.dueAt) { keyA = 0; }
            if (!b.dueAt) { keyB = 0; }

            //Put upcoming assignments at the top
            if ((keyA < now) || (keyB < now)) {
                // Sort upcoming assignments from earliest -> latest
                if (keyA < keyB) return 1;
                if (keyA > keyB) return -1;
                return 0;
            } else {
                // Sort old assignments from latest -> earliest
                if (keyA > keyB) return 1;
                if (keyA < keyB) return -1;
                return 0;
            }
        });

        //Render assignments
        var prevAssignment = null;
        var streamHTML = assignments.map(assignment => {
            var divider = "";

            if (!assignment.dueAt) {
                if (prevAssignment && (prevAssignment !== "undated")) {
                    divider = `<h5 style="margin: 75px 75px 10px 75px;font-weight: bold;">Undated Assignments</h5>`;
                }

                prevAssignment = "undated";
            } else if (new Date(assignment.dueAt) < new Date()) {
                if (prevAssignment && (prevAssignment !== "old")) {
                    divider = `<h5 style="margin: 75px 75px 10px 75px;font-weight: bold;">Old Assignments</h5>`;
                }

                prevAssignment = "old";
            } else {
                prevAssignment = "upcoming";
            }

            return divider + dtps.renderAssignment(assignment);
        }).join("");

        //Add stream header with class info buttons and search box
        streamHTML = dtps.renderClassTools(classNum, "stream", searchText) + streamHTML;

        if ((dtps.selectedClass == classNum) && (dtps.selectedContent == "stream")) {
            $(".classContent").html(streamHTML);
        }
    }
}

/**
 * Shows details for an assignment given the assignment ID and class number
 * 
 * @param {string} id Assignment ID
 * @param {number} classNum Assignment class number
 */
dtps.assignment = function (id, classNum) {
    //Get assignment from the id prop
    var assignmentIDs = dtps.classes[classNum].assignments.map(assignment => assignment.id);
    var assignment = dtps.classes[classNum].assignments[assignmentIDs.indexOf(id)];

    //The assignment body is rendered in an iFrame to keep its content and styling isolated from the rest of the page
    var assignmentBodyURL = null;
    if (assignment.body) {
        //Get computed background and text color to style the iFrame with
        var computedBackgroundColor = getComputedStyle($(".card.details")[0]).getPropertyValue("--cards");
        var computedTextColor = getComputedStyle($(".card.details")[0]).getPropertyValue("--text");

        //Generate a blob with the assignment body and get its data URL
        var blob = new Blob([`
                <base target="_blank" /> 
                <link type="text/css" rel="stylesheet" href="https://cdn.jottocraft.com/CanvasCSS.css" media="screen,projection"/>
                <style>body {background-color: ${computedBackgroundColor}; color: ${computedTextColor};</style>
                ${assignment.body}
            `], { type: 'text/html' });
        assignmentBodyURL = window.URL.createObjectURL(blob);
    }

    //Get assignment rubric HTML
    var assignmentRubricHTML = "";
    if (assignment.rubric) {
        var assignmentRubricHTML = assignment.rubric.map(function (rubricItem) {
            return /*html*/`
                    <div class="dtpsAssignmentRubricItem">
                        <h5>${rubricItem.title}</h5>
                        <div class="score">
                            <p style="color: ${rubricItem.color ? rubricItem.color : "var(--secText)"};" class="scoreName">
                                ${rubricItem.score ? rubricItem.scoreName || "" : "Not assessed"}

                                <div class="points">
                                    <p class="earned">${rubricItem.score || "-"}</p>
                                    <p class="possible">${"/" + rubricItem.value}</p>
                                </div>
                            </p>
                        </div>
                    </div>
                `
        }).join("");
    }

    //Get assignment feedback HTML
    var assignmentFeedbackHTML = "";
    if (assignment.feedback) {
        var assignmentFeedbackHTML = assignment.feedback.map(feedback => {
            return /*html*/`
                    <div class="dtpsSubmissionComment">
                        ${feedback.author ? /*html*/`
                            <img src="${feedback.author.photoURL}" />
                            <h5>${feedback.author.name}</h5>
                        ` : ``}

                        <p>${feedback.comment}</p>
                    </div>
                `
        }).join("");
    }

    //Get assignment score HTML
    var scoreHTML = dtps.renderAssignmentScore(assignment);

    //Render assignment details
    $(".card.details").html(/*html*/`
            <i onclick="fluid.cards.close('.card.details'); $('.card.details').html('');" class="material-icons close">close</i>

            <h4 style="font-weight: bold;">${assignment.title}</h4>

            <div>
                ${assignment.dueAt ? `<div class="assignmentChip"><i class="material-icons">alarm</i><span>Due ${dtps.formatDate(assignment.dueAt)}</span></div>` : ""}
                ${assignment.turnedIn ? `<div title="Assignment submitted" class="assignmentChip" style="color: #0bb75b"><i class="material-icons">assignment_turned_in</i></div>` : ""}
                ${assignment.missing ? `<div  title="Assignment is missing" class="assignmentChip" style="color: #c44848"><i class="material-icons">remove_circle_outline</i></div>` : ""}
                ${assignment.late ? `<div title="Assignment is late" class="assignmentChip" style="color: #c44848"><i class="material-icons">assignment_late</i></div>` : ""}
                ${assignment.locked ? `<div title="Assignment submissions are locked" class="assignmentChip" style="color: var(--secText, gray);"><i style="font-family: 'Material Icons Extended';" class="material-icons">lock_outline</i></div>` : ""}
                ${scoreHTML}
            </div>

            <div style="margin-top: 20px;" class="assignmentBody">
                ${assignment.body ? `<iframe id="assignmentIframe" onload="dtps.iframeLoad('assignmentIframe')" style="margin: 10px 0px; width: 100%; border: none; outline: none;" src="${assignmentBodyURL}" />` : ""}
            </div>

            ${assignment.body ? `<div style="margin: 5px 0px; background-color: var(--darker); height: 1px; width: 100%;" class="divider"></div>` : ""}

            <div style="width: calc(40% - 2px); margin-top: 20px; display: inline-block; overflow: hidden; vertical-align: top;">
                ${assignment.publishedAt ? `<p style="color: var(--secText); margin: 5px 0px;"><i style="vertical-align: middle;" class="material-icons">add_box</i> Published: ${dtps.formatDate(assignment.publishedAt)}</p>` : ""}
                ${assignment.dueAt ? `<p style="color: var(--secText); margin: 5px 0px;"><i style="vertical-align: middle;" class="material-icons">alarm</i> Due: ${dtps.formatDate(assignment.dueAt)}</p>` : ""}
                ${assignment.value ? `<p style="color: var(--secText); margin: 5px 0px;"><i style="vertical-align: middle;" class="material-icons">bar_chart</i> Point value: ${assignment.value}</p>` : ""}
                ${(assignment.grade || (assignment.grade == 0)) ? `<p style="color: var(--secText); margin: 5px 0px;"><i style="vertical-align: middle;" class="material-icons">assessment</i> Points earned: ${assignment.grade}</p>` : ""}
                ${assignment.letter ? `<p style="color: var(--secText); margin: 5px 0px;"><i style="vertical-align: middle;" class="material-icons">font_download</i> Letter grade: ${assignment.letter}</p>` : ""}
                ${assignment.category ? `<p style="color: var(--secText); margin: 5px 0px;"><i style="vertical-align: middle;" class="material-icons">category</i> Category: ${assignment.category}</p>` : ""}
                ${assignment.rubric ? assignment.rubric.map(function (rubricItem) { return `<p style="color: var(--secText); margin: 5px 0px;"><i style="vertical-align: middle;" class="material-icons">adjust</i> ${rubricItem.title}</p>`; }).join("") : ""}
                <p style="color: var(--secText); margin: 5px 0px;"><i style="vertical-align: middle;" class="material-icons">class</i> Class: ${dtps.classes[assignment.class].subject}</p>
                ${dtps.env == "dev" ? `<p style="color: var(--secText); margin: 5px 0px;"><i style="vertical-align: middle;" class="material-icons">code</i> Assignment ID: ${assignment.id}</p>` : ""}

                <br />
                <div class="row">
                    <div class="btn small outline" onclick="window.open('${assignment.url}')"><i class="material-icons">open_in_new</i> Open in ${dtpsLMS.shortName || dtpsLMS.name}</div>
                </div>
            </div>

            <div style="width: calc(60% - 7px); margin-top: 20px; margin-left: 5px; display: inline-block; overflow: hidden; vertical-align: middle;">
                ${assignmentFeedbackHTML}

                ${assignmentRubricHTML}
            </div>
        `);

    //Close other active cards and open the assignment details card
    fluid.cards.close(".card.focus");
    fluid.modal(".card.details");
}

/**
 * Searches the assignment stream for a keyword using Fuse.js
 */
dtps.search = function () {
    if ($("input.search").val() == "") {
        fluid.screen();
    } else {
        var input = $("input.search").val();
        var search = new Fuse(dtps.classes[dtps.selectedClass].assignments, {
            keys: ["title", "body"]
        });
        dtps.classStream(dtps.classes[dtps.selectedClass].id, search.search(input), input);
    }
}

/**
 * Shows the module stream for a class
 * 
 * @param {string} classID Class number to fetch modules for
 */
dtps.moduleStream = function (classID) {
    //Get class index and set as selected class
    var classNum = dtps.classes.map(course => course.id).indexOf(classID);
    dtps.selectedClass = classNum;

    //Set stream as the selected content
    dtps.selectedContent = "moduleStream";
    $("#dtpsTabBar .btn").removeClass("active");
    $("#dtpsTabBar .btn.stream").addClass("active");

    //Load class color, name, etc.
    dtps.presentClass(classNum);

    //Ensure classes are shown in the sidebar
    dtps.showClasses();

    if (classNum == -1) {
        //Class does not exist
        dtps.error("The selected class doesn't exist", "classNum check failed @ dtps.moduleStream");
    }

    //Show loading indicator
    if ((dtps.selectedClass == classNum) && (dtps.selectedContent == "moduleStream")) {
        jQuery(".classContent").html(dtps.renderClassTools(classNum, "modules") + `<div class="spinner"></div>`);
    }

    new Promise(resolve => {
        if (dtps.classes[classNum].modules && (dtps.classes[classNum].modules !== true)) {
            resolve(dtps.classes[classNum].modules);
        } else {
            dtpsLMS.fetchModules(dtps.classes[classNum].id).then(data => resolve(data));
        }
    }).then(data => {
        //Save modules data in the class object for future use
        dtps.classes[classNum].modules = data;

        var modulesHTML = dtps.renderClassTools(classNum, "modules");

        data.forEach(module => {
            var moduleItemHTML = "";

            //Get HTML for each module item
            module.items.forEach(item => {
                //Get module item icon
                var icon = "list";
                if (item.type == "assignment") icon = "assignment";
                if (item.type == "page") icon = "insert_drive_file";
                if (item.type == "discussion") icon = "forum";
                if (item.type == "url") icon = "open_in_new";
                if (item.type == "header") icon = "format_size";
                if (item.type == "embed") icon = "web";

                //Get module action
                var action = "";
                if (item.type == "assignment") action = "dtps.assignment('" + item.id + "', " + classNum + ")";
                if (item.type == "page") {
                    if (dtps.classes[classNum].pages) {
                        action = "fluid.screen('pages', '" + classID + "|" + item.id + "')";
                    } else {
                        action = "window.open('" + item.url + "')";
                    }                 
                }  
                if (item.type == "discussion") {
                    if (dtps.classes[classNum].discussions) {
                        action = "fluid.screen('discussions', '" + classID + "|" + item.id + "')";
                    } else {
                        action = "window.open('" + item.url + "')";
                    }
                }
                if (item.type == "url") action = "window.open('" + item.url + "')";
                if (item.type == "header") action = "";
                if (item.type == "embed") action = "dtps.showIFrameCard('" + item.url + "')";

                //Get module HTML
                if (item.type == "header") {
                    moduleItemHTML += `<h5 style="font-size: 22px;padding: 2px 10px;">${item.title}</h5>`;
                } else {
                    moduleItemHTML += `
                        <div class="moduleItem" onclick="${action}" style="margin-left: ${item.indent * 15}px;">
                            <i class="material-icons">${icon}</i>
                            ${item.title}
                        </div>
                    `;
                }
            });

            //Add HTML for this module to the string
            modulesHTML += /*html*/`
                <div class="module card ${module.collapsed ? "collapsed" : ""}">
                    <h4>
                        <i onclick="dtps.moduleCollapse(this, '${dtps.classes[classNum].id}', '${module.id}');" 
                            class="material-icons collapseIcon">${module.collapsed ? "keyboard_arrow_right" : "keyboard_arrow_down"}</i>
                        ${module.title}
                    </h4>

                    <div class="moduleContents" style="padding-top: 10px;">
                        ${moduleItemHTML}
                    </div>
                </div>
            `;
        });

        if (data.length == 0) {
            modulesHTML += `<div style="cursor: auto;" class="card assignment"><h4>No modules</h4><p>There aren't any modules in this class yet</p></div>`;
        }

        //Render module HTML
        if ((dtps.selectedClass == classNum) && (dtps.selectedContent == "moduleStream")) {
            jQuery(".classContent").html(modulesHTML);
        }
    }).catch(err => {
        dtps.error("Could not load modules", "Caught promise rejection @ dtps.moduleStream", err);
    });
}

/**
 * Collapses a module
 * 
 * @param {Element} ele Element of the module collapse arrow
 * @param {string} classID Class ID
 * @param {string} modID Module ID of the module to collapse
 */
dtps.moduleCollapse = function (ele, classID, modID) {
    //Add collapsed class to module card
    $(ele).parents('.card').toggleClass('collapsed');

    //Update arrow icon and, if the LMS supports it, collapse the module in the LMS as well
    if ($(ele).parents('.card').hasClass('collapsed')) {
        if (dtpsLMS.collapseModule) dtpsLMS.collapseModule(classID, modID, true);
        $(ele).html('keyboard_arrow_right');
    } else {
        if (dtpsLMS.collapseModule) dtpsLMS.collapseModule(classID, modID, false);
        $(ele).html('keyboard_arrow_down');
    }

}

/**
 * Gets stream tools HTML (search box, class info, and modules/assignment switcher)
 * 
 * @param {number} num Class number
 * @param {string} type Class content these tools are for (e.g. "stream")
 * @param {string} [searchText] Text to render in the search box for assignment search
 * @return {string} Stream tools HTML
 */
dtps.renderClassTools = function (num, type, searchText) {
    var modulesSelector = dtps.classes[num].modules;
    return /*html*/`
        <div style="position: absolute;display:inline-block;margin: ${modulesSelector ? "82px" : "38px 82px"};">

            ${dtps.classes[num].teacher ? /*html*/`
                <div class="acrylicMaterial" style="border-radius: 20px; display: inline-block; margin-right: 5px;">
                    <img src="${dtps.classes[num].teacher.photoURL}" style="width: 40px; height: 40px; border-radius: 50%;vertical-align: middle;"> 
                    <div style="font-size: 16px;display: inline-block;vertical-align: middle;margin: 0px 10px;">${dtps.classes[num].teacher.name}</div>
                </div>` : ``
        }

            <div onclick="dtps.classInfo(${num})" class="acrylicMaterial" style="border-radius: 50%; height: 40px; width: 40px; text-align: center; display: inline-block; vertical-align: middle; cursor: pointer; margin-right: 3px;">
                <i style="line-height: 40px;" class="material-icons">info</i>
            </div>

            ${dtps.classes[num].homepage ? /*html*/`
                <div onclick="dtps.classHome(${num})" class="acrylicMaterial" style="border-radius: 50%; height: 40px; width: 40px; text-align: center; display: inline-block; vertical-align: middle; cursor: pointer; margin-right: 3px;">
                    <i style="line-height: 40px;" class="material-icons">home</i>
                </div>` : ""
        }

        ${dtps.classes[num].videoMeetingURL ? /*html*/`
                <div onclick="window.open('${dtps.classes[num].videoMeetingURL}')" class="acrylicMaterial" style="border-radius: 50%; height: 40px; width: 40px; text-align: center; display: inline-block; vertical-align: middle; cursor: pointer; margin-right: 3px;">
                    <i style="line-height: 40px;" class="material-icons">videocam</i>
                </div>` : ""
        }

        </div>
        
        ${(type == "modules") || (type == "stream") ? /*html*/`
            <div style="text-align: right;${modulesSelector ? "" : "margin-top: 20px;"}">

                ${type == "stream" ? `<i class="inputIcon material-icons">search</i><input ${searchText ? `value="${searchText}"` : ``} onchange="dtps.search()" class="search inputIcon filled shadow" placeholder="Search assignments" type="search" />` : ""}

                <br />
                ${modulesSelector ? /*html*/`
                    <div class="btns row small acrylicMaterial assignmentPicker" style="margin: ${type == "stream" ? `20px 80px 20px 0px !important` : `63px 80px 20px 0px !important`};">
                        <button class="btn ${type == "stream" ? "active" : ""}" onclick="fluid.screen('stream', dtps.classes[dtps.selectedClass].id);"><i class="material-icons">assignment</i>Assignments</button>
                        <button class="btn ${type == "modules" ? "active" : ""}" onclick="fluid.screen('moduleStream', dtps.classes[dtps.selectedClass].id);"><i class="material-icons">view_module</i>Modules</button>
                    </div>
                ` : ``}
                
            </div>` : ``
        }
    `;
}

/**
 * Displays class info & syllabus card
 * 
 * @param {number} num Class number to show info for
 */
dtps.classInfo = function (num) {
    //Get syllabus blob if the class has a syllabus
    if ((dtps.classes[num].syllabus !== "") && dtps.classes[num].syllabus !== null) {
        //Get computed background and text color to style the iFrame with
        var computedBackgroundColor = getComputedStyle($(".card.details")[0]).getPropertyValue("--cards");
        var computedTextColor = getComputedStyle($(".card.details")[0]).getPropertyValue("--text");

        //Generate a blob with the assignment body and get its data URL
        var blob = new Blob([`
            <base target="_blank" /> 
            <link type="text/css" rel="stylesheet" href="https://cdn.jottocraft.com/CanvasCSS.css" media="screen,projection"/>
            <style>body {background-color: ${computedBackgroundColor}; color: ${computedTextColor};</style>
            ${dtps.classes[num].syllabus}
        `], { type: 'text/html' });
        var syllabusURL = window.URL.createObjectURL(blob);
    }

    //Show class info HTML
    $(".card.details").html(/*html*/`
        <i onclick="fluid.cards.close('.card.details')" class="material-icons close">close</i>

        <h4 style="font-weight: bold;">${dtps.classes[num].name}</h4>
        <p style="color: var(--secText)">${dtps.classes[num].description || ""}</p>

        <div class="assignmentChip"><i class="material-icons">group</i><span>${dtps.classes[num].numStudents} students</span></div>
        ${dtps.env == "dev" ? `<div class="assignmentChip"><i class="material-icons">code</i><span>Class ID: ${dtps.classes[num].id}</span></div>` : ``}
    
        <br />

        <div style="margin-top: 20px;" class="syllabusBody">
            ${dtps.classes[num].syllabus ? `
                <iframe id="syllabusIframe" onload="dtps.iframeLoad('syllabusIframe')" style="margin: 10px 0px; width: 100%; border: none; outline: none;" src="${syllabusURL}" />` : ""}
        </div>
    `)

    //Show the class info card
    fluid.modal(".card.details")
}

/**
 * Displays the class homepage
 * 
 * @param {number} num Class number to show the homepage for
 */
dtps.classHome = function (num) {
    //Render loading screen
    $(".card.details").html(/*html*/`
        <i onclick="fluid.cards.close('.card.details')" class="material-icons close">close</i>
        <h4 style="font-weight: bold;">${dtps.classes[num].subject} Homepage</h4>

        <br />
        <p>Loading...</p>
    `);

    //Fetch homepage from the LMS
    dtpsLMS.fetchHomepage(dtps.classes[num].id).then(homepage => {
        if (homepage) {
            //Get computed background and text color to style the iFrame with
            var computedBackgroundColor = getComputedStyle($(".card.details")[0]).getPropertyValue("--cards");
            var computedTextColor = getComputedStyle($(".card.details")[0]).getPropertyValue("--text");

            //Generate a blob with the assignment body and get its data URL
            var blob = new Blob([`
                <base target="_blank" /> 
                <link type="text/css" rel="stylesheet" href="https://cdn.jottocraft.com/CanvasCSS.css" media="screen,projection"/>
                <style>body {background-color: ${computedBackgroundColor}; color: ${computedTextColor};</style>
                ${homepage}
            `], { type: 'text/html' });
            var homepageURL = window.URL.createObjectURL(blob);

            $(".card.details").html(/*html*/`
                <i onclick="fluid.cards.close('.card.details')" class="material-icons close">close</i>

                <h4 style="font-weight: bold;">${dtps.classes[num].subject} Homepage</h4>

                <br />
                <div style="margin-top: 20px;" class="homepageBody">
                    <iframe id="homepageIframe" onload="dtps.iframeLoad('homepageIframe')" style="margin: 10px 0px; width: 100%; border: none; outline: none;" src="${homepageURL}" />
                </div>
            `);

            fluid.modal(".card.details");
        } else {
            fluid.cards.close('.card.details');
            dtps.error("Homepage unavailable", "homepage is either empty or undefined @ dtps.classHome");
        }
    }).catch(e => {
        dtps.error("Couldn't load homepage", "Caught a promise rejection @ dtps.classHome", e);
    })
}

/**
 * Shows the generic gradebook
 * 
 * @param {string} classID Class ID
 */
dtps.gradebook = function (classID) {
    //Get class index and set as selected class
    var classNum = dtps.classes.map(course => course.id).indexOf(classID);
    dtps.selectedClass = classNum;

    //Set stream as the selected content
    dtps.selectedContent = "grades";
    $("#dtpsTabBar .btn").removeClass("active");
    $("#dtpsTabBar .btn.grades").addClass("active");

    //Load class color, name, etc.
    dtps.presentClass(classNum);

    //Ensure classes are shown in the sidebar
    dtps.showClasses();

    if (classNum == -1) {
        //Class does not exist
        dtps.error("The selected class doesn't exist", "classNum check failed @ dtps.gradebook");
    }

    //Show loading indicator
    if ((dtps.selectedClass == classNum) && (dtps.selectedContent == "grades")) {
        jQuery(".classContent").html(`<div class="spinner"></div>`);
    }

    //Terminate function if the class doesn't have a letter grade or assignments
    if (!dtps.classes[classNum].letter || !dtps.classes[classNum].assignments) {
        return;
    }

    //Define variables for total points and zeros
    var zeros = 0;
    var totalPoints = 0;
    var earnedPoints = 0;
    var gradedAssignments = 0;

    //Define variable for assignment HTML string
    var assignmentHTML = "";

    //Calculate total points and zeros
    dtps.classes[classNum].assignments.forEach(assignment => {
        if (assignment.grade || (assignment.grade == 0)) {
            earnedPoints += assignment.grade;
            gradedAssignments++;

            assignmentHTML += /*html*/`
                <div onclick="dtps.assignment('${assignment.id}', ${classNum})" class="gradebookAssignment card">
                    <h5>
                        ${assignment.title}

                        <div class="stats">
                            ${assignment.letter ? `<div class="gradebookLetter">${assignment.letter}</div>` : ""}
                            <div class="gradebookScore">${assignment.grade}</div>
                            <div class="gradebookValue">/${assignment.value}</div>
                            <div class="gradebookPercentage">${Math.round((assignment.grade / assignment.value) * 100)}%</div>
                        </div>
                    </h5>
                </div>
            `;
        }

        if (assignment.value) {
            totalPoints += assignment.value;
        }

        if ((assignment.grade == 0) && assignment.value) {
            zeros++;
        }
    })

    //Grade calculation summary
    var gradeCalcSummary = /*html*/`
        <div style="--classColor: ${dtps.classes[classNum].color}" class="card">
            <h3 class="gradeTitle">
                Grade Summary
                <div class="classGradeCircle">
                    ${dtps.classes[classNum].grade ? `<span class="percentage">${dtps.classes[classNum].grade}%</span>` : ``}
                    <div class="letter">${dtps.classes[classNum].letter || ``}</div>
                </div>
            </h3>

            ${zeros ? /*html*/`
                <h5 style="color: #d63d3d;" class="gradeStat">
                    Zeros
                    <div style="color: #d63d3d;" class="numFont">${zeros}</div>
                </h5>
            ` : ``}

            <div style="${dtps.gradebookExpanded ? "" : "display: none;"}" id="classGradeMore">
                <br />

                ${dtps.classes[classNum].previousLetter ? /*html*/`
                    <h5 class="smallStat">
                        Previous Grade
                        <div class="numFont">${dtps.classes[classNum].previousLetter}</div>
                    </h5>
                ` : ``}

                <h5 class="smallStat">
                    Points
                    <div class="numFont fraction">
                        <span class="earned">${earnedPoints}</span>
                        <span class="total">/${totalPoints}</span>
                    </div>
                </h5>

                <h5 class="smallStat">
                    Graded Assignments
                    <div class="numFont">${gradedAssignments}</div>
                </h5>
            </div>

            <br />
            <a onclick="$('#classGradeMore').toggle(); if ($('#classGradeMore').is(':visible')) {$(this).html('Show less'); dtps.gradebookExpanded = true;} else {$(this).html('Show more'); dtps.gradebookExpanded = false;}"
                style="color: var(--secText, gray); cursor: pointer; margin-right: 10px;">${dtps.gradebookExpanded ? "Show less" : "Show more"}</a>
        </div>

        <br />
    `;


    //Render HTML
    if ((dtps.selectedClass == classNum) && (dtps.selectedContent == "grades")) {
        $(".classContent").html(gradeCalcSummary + assignmentHTML);
    }
}

//Fluid UI screen definitions
fluid.externalScreens.dashboard = () => {
    dtps.masterStream();
}

fluid.externalScreens.stream = (courseID) => {
    dtps.classStream(courseID);
}

fluid.externalScreens.moduleStream = (courseID) => {
    dtps.moduleStream(courseID);
}

fluid.externalScreens.gradebook = (courseID) => {
    dtps.gradebook(courseID);
}

//Type definitions

/**
* @typedef {Object} Assignment
* @description Defines assignments objects in DTPS
* @property {string} title Title of the assignment
* @property {string} [body] HTML of the assignment's body
* @property {string} id Assignment ID
* @property {Date} [dueAt] Assignment due date
* @property {string} url Assignment URL
* @property {AssignmentFeedback[]} [feedback] Feedback / private comments for this assignment
* @property {User} [grader] Assignment grader
* @property {boolean} [turnedIn] True if the assignment is turned in
* @property {boolean} [late] True if the assignment is late
* @property {boolean} [missing] True if the assignment is missing
* @property {boolean} [locked] True if assignment submissions are locked
* @property {string} [category] Assignment category
* @property {Date} [publishedAt] Date for when the assignment was published
* @property {Date} [gradedAt] Date for when the assignment was graded
* @property {number} [grade] Points earned on this assignment
* @property {string} [letter] Letter grade on this assignment
* @property {number} [value] Total amount of points possible for this assignment
* @property {RubricItem[]} [rubric] Assignment rubric
*/

/**
* @typedef {Object} Module
* @description Defines module objects in DTPS
* @property {string} title Title of the module
* @property {string} id Module ID
* @property {boolean} [collapsed] True if the module is collapsed, false otherwise. undefined or null if this module does not support collapsing.
* @property {ModuleItem[]} items An array of items for this module.
*/

/**
 * @typedef {Object} ModuleItem
 * @description Defines module items in DTPS
 * @property {string} type Either "assignment", "page", "discussion", "url", "embed", or "header".
 * @property {string} [title] Required for URL and header items, and can be used to override the title of assignment, page, and discussion items.
 * @property {string} [id] Required for assignment, page, and discussion items.
 * @property {string} [url] Required for URL and embed items. Required for discussion and page items if the class does not support the pages or discussions feature.
 * @property {number} [indent] Indent level
 */

/**
* @typedef {Object} Announcement
* @description Defines announcement objects in DTPS
* @property {string} title Title of the announcement
* @property {Date} postedAt Date when the announcement was posted
* @property {string} body Announcement content
*/

/**
* @typedef {Object} AssignmentFeedback
* @description Defines assignment feedback objects in DTPS
* @property {string} comment Feedback comment
* @property {User} [author] Feedback author
*/

/**
* @typedef {Object} RubricItem
* @description Defines rubric item objects in DTPS
* @property {string} title Title of the rubric item
* @property {string} id Rubric item ID (does NOT have to be unique)
* @property {number} value Total amount of points possible
* @property {string} [outcome] The ID of the outcome this rubric item is assessing. This is only used for grade calculation.
* @property {string} [description] Rubric item description
* @property {number} [score] Rubric assessment score in points
* @property {string} [scoreName] Rubric assessment score name
* @property {string} [scoreColor] Score color in CSS color format
*/

/**
 * @typedef {Object} DashboardItem
 * @description Defines dashboard items in DTPS
 * @property {string} name Dashbord item name
 * @property {string} id Unique dashboard item ID
 * @property {string} icon Dashboard item icon
 * @property {boolean} supportsCompactMode True if this dashboard item supports compact mode
 * @property {number} size The approximate size of this dashboard item relative to other dashboard items. Should be no less than 20.
 * @property {string} defaultSide The default side of this dashboard item. Either "right" or "left".
 * @property {boolean} compact True if the user has turned on compact mode for this item.
 */