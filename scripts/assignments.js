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
 * @todo Add support for points/letter scores
 * @return {string} Assignment HTML for use in a list
 */
dtps.renderAssignment = function (assignment) {
    var scoreHTML = "";
    //Render points/letter score

    //Use rubric score over points score if possible
    if (assignment.rubric) {
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

        scoreHTML = `<div class="dtpsRubricScore">${rubricHTML.join("")}</div>`;
    }

    var HTML = /*html*/`
        <div 
            onclick="${`dtps.assignment('` + assignment.id + `', ` + assignment.class + `)`}" 
            class="card graded assignment"
            style="${'--classColor: ' + dtps.classes[assignment.class].color}"
        >

            <!-- Color bar for the dashboard -->
            <div class="colorBar"></div>

            <!-- Assignment title and points -->
            <h4>
                ${assignment.title}

                <!-- Points display -->
                <div class="points">
                    ${scoreHTML}
                </div>
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
 * Renders the DTPS dashboard and calls dtps.renderCalendar, dtps.renderUpdates, and dtps.renderUpcoming
 */
dtps.masterStream = function () {
    //Ensure classes are rendered in the sidebar
    dtps.presentClass("dash");
    dtps.showClasses();

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
    dtps.renderUpcoming();

    //Render calendar
    dtps.calendar();

    //Render due today
    dtps.renderDueToday();
}

/**
 * Compiles and displays due today / to-do stream
 */
dtps.renderDueToday = function () {
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
        combinedHTML = `<p style="text-align: center;margin: 10px 25px 10px 75px; font-size: 18px;"><i class="material-icons">done</i> Nothing due today</p>`;
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
 * 
 * @todo pending v3 support
 */
dtps.renderUpdates = function () {
    /*var context = [];
    for (var i = 0; i < dtps.classes.length; i++) {
        if (fluid.get("pref-hideClass" + dtps.classes[i].id) !== "true") {
            if (!context.length) { context.push("?context_codes[]=course_" + dtps.classes[i].id) } else { context.push("&context_codes[]=course_" + dtps.classes[i].id) }
        }
    }
    dtps.webReq("canvas", "/api/v1/announcements" + context.join(""), function (resp) {
        var ann = JSON.parse(resp);
        var updates = [];
        for (var i = 0; i < ann.length; i++) {
            var dtpsClass = null;
            for (var ii = 0; ii < dtps.classes.length; ii++) {
                if (dtps.classes[ii].id == ann[i].context_code.split("_")[1]) {
                    dtpsClass = ii;
                }
            }
            updates.push({
                type: "announcement",
                date: ann[i].posted_at,
                dom: `<div onclick="$(this).toggleClass('open');" style="cursor: pointer; padding: 20px;" class="announcement card color ` + dtps.classes[dtpsClass].col + `">
                <div class="className">` + ann[i].title + `</div>` + ann[i].message + `
                </div>
                `
            });
        }
        if (dtps.recentlyGraded) {
            dtps.recentlyGraded.forEach(grade => {
                updates.push({
                    type: "grade",
                    date: grade.date,
                    dom: `<div onclick="dtps.assignment('` + grade.id + `', '` + grade.class + `')" class="card ` + dtps.classes[grade.class].col + ` recentGrade">
                    <div style="float: right; margin-left: 10px;" class="earned outcomes">` + dtps.renderOutcomeScore(grade.rubric).join("") + `</div>
                    <h5>` + grade.name + `</h5>
                    <p>Graded at ` + (new Date(grade.date).toDateString().slice(0, -5) + ", " + dtps.ampm(new Date(grade.date))) + `</p>
                </div>`
                })
            })
        }
        updates.sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
        })
        if ((dtps.selectedClass == "dash") && (dtps.masterContent == "assignments")) {
            jQuery(".dash .updatesStream").html(updates.map(update => update.dom).join(""));
        }
    });*/
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
 */
dtps.classStream = function (classID) {
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

    //Render assignments
    if (!dtps.classes[dtps.selectedClass].assignments) {
        //Assignments are still loading
        jQuery(".classContent").html(`<div class="spinner"></div>`);
    } else if (dtps.classes[dtps.selectedClass].assignments.length == 0) {
        //This class doesn't have any assignments
        $(".classContent").html(`<div style="cursor: auto;" class="card assignment"><h4>No assignments</h4><p>There aren't any assignments in this class yet</p></div>`);
    } else {
        //Sort assignments
        dtps.classes[dtps.selectedClass].assignments.sort(function (a, b) {
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
        var streamHTML = dtps.classes[dtps.selectedClass].assignments.map(assignment => {
            return dtps.renderAssignment(assignment);
        }).join("");

        //Add stream header with class info buttons and search box
        streamHTML = dtps.renderClassTools(classNum, "stream") + streamHTML;

        $(".classContent").html(streamHTML);
    }
}

/**
 * Shows details for an assignment given the assignment ID and class number
 * 
 * @param {string} id Assignment ID
 * @param {number} classNum Assignment class number
 * @param {boolean} [submissions] If true, assignment submissions will be shown
 * @todo Support numerical grades
 */
dtps.assignment = function (id, classNum, submissions) {
    //Get assignment from the id prop
    var assignmentIDs = dtps.classes[classNum].assignments.map(assignment => assignment.id);
    var assignment = dtps.classes[classNum].assignments[assignmentIDs.indexOf(id)];

    if (submissions) {
        //Render assignment submissions
        $(".card.details").css("background-color", "white");
        $(".card.details").css("color", "black")
        $(".card.details").html(`<i style="color: black !important;" onclick="fluid.cards.close('.card.details')" class="material-icons close">close</i>
            <i style="left: 0; right: auto; color: black !important;" onclick="dtps.assignment(` + id + `, ` + classNum + `)" class="material-icons close">arrow_back</i>
            <br /><br />
            <iframe style="width: 100%; height: calc(100vh - 175px); border: none;" src="` + assignment.submissions + `"></iframe>
        `);
    } else {
        //Render assignment

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
                                    <p class="earned">${rubricItem.score || ""}</p>
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
        var scoreHTML = "";

        //Use rubric score over points score if possible
        if (assignment.rubric) {
            var rubricHTML = [];

            //Loop over every rubric item to get HTML for each
            assignment.rubric.forEach(rubricItem => {
                if (rubricItem.score) {
                    rubricHTML.push(/*html*/`
                    <div class="assignmentChip" title="${rubricItem.title}" style="color: ${rubricItem.color || "var(--text)"}; font-weight: bold;">
                        ${rubricItem.score}
                    </div>
                `);
                }
            });

            scoreHTML = rubricHTML.join("");
        }

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
                ${assignment.grade ? `<p style="color: var(--secText); margin: 5px 0px;"><i style="vertical-align: middle;" class="material-icons">assessment</i> Points earned: ${assignment.grade}</p>` : ""}
                ${assignment.letter ? `<p style="color: var(--secText); margin: 5px 0px;"><i style="vertical-align: middle;" class="material-icons">font_download</i> Letter grade: ${assignment.letter}</p>` : ""}
                ${assignment.category ? `<p style="color: var(--secText); margin: 5px 0px;"><i style="vertical-align: middle;" class="material-icons">category</i> Category: ${assignment.category}</p>` : ""}
                ${assignment.rubric ? assignment.rubric.map(function (rubricItem) { return `<p style="color: var(--secText); margin: 5px 0px;"><i style="vertical-align: middle;" class="material-icons">adjust</i> ${rubricItem.title}</p>`; }).join("") : ""}
                <p style="color: var(--secText); margin: 5px 0px;"><i style="vertical-align: middle;" class="material-icons">class</i> Class: ${dtps.classes[assignment.class].subject}</p>
                <p style="color: var(--secText); margin: 5px 0px;"><i style="vertical-align: middle;" class="material-icons">bug_report</i> Assignment ID: ${assignment.id}</p>

                <br />
                <div class="row">
                    <div class="btn small outline" onclick="dtps.assignment('${assignment.id}', ${classNum}, true)"><i class="material-icons">assignment</i> Submissions</div>
                    <div class="btn small outline" onclick="window.open('${assignment.url}')"><i class="material-icons">open_in_new</i> Open in ${dtpsLMS.shortName || dtpsLMS.name}</div>
                </div>
            </div>

            <div style="width: calc(60% - 7px); margin-top: 20px; margin-left: 5px; display: inline-block; overflow: hidden; vertical-align: middle;">
                ${assignmentFeedbackHTML}

                ${assignmentRubricHTML}
            </div>
        `);
    }

    //Close other active cards and open the assignment details card
    fluid.cards.close(".card.focus");
    fluid.modal(".card.details");
}

/**
 * Searches the assignment stream for a keyword using Fuse.js
 * 
 * @todo pending v3 support
 */
dtps.search = function () {
    alert("This feature has not been implemented yet");
    throw "DTPS v3 IMPLEMENTATION ERR";
    if (dtps.selectedClass == "dash") {
        if ($("input.search").val() == "") {
            jQuery(".classContent .stream").html(dtps.renderStream(dtps.latestStream, ""))
        } else {
            jQuery(".classContent .stream").html(dtps.renderStream(dtps.fuse.search($("input.search").val()), $("input.search").val()))
        }
        $(".card.assignment").addClass("color");
    } else {
        if ($("input.search").val() == "") {
            jQuery(".classContent").html(dtps.renderStream(dtps.latestStream, ""))
        } else {
            jQuery(".classContent").html(dtps.renderStream(dtps.fuse.search($("input.search").val()), $("input.search").val()))
        }
    }
}

/**
 * Fetches module stream for a class
 * 
 * @param {number} num Class number to fetch modules for
 * @todo pending v3 support
 */
dtps.moduleStream = function (num) {
    alert("This feature has not been implemented yet");
    throw "DTPS v3 IMPLEMENTATION ERR";
    dtps.selectedContent = "moduleStream";
    var moduleRootHTML = dtps.renderClassTools(num, false, true);
    if (dtps.selectedContent == "moduleStream") jQuery(".classContent").html(moduleRootHTML + `<div class="spinner"></div>`);
    streamData = [];
    dtps.webReq("canvas", "/api/v1/courses/" + dtps.classes[num].id + "/modules?include[]=items&include[]=content_details", function (resp) {
        dtps.webReq("canvas", "/courses/" + dtps.classes[num].id + "/modules/progressions", function (progResp) {
            var data = JSON.parse(resp);
            var progData = JSON.parse(progResp);
            var collapsed = {};
            for (var i = 0; i < progData.length; i++) {
                collapsed[progData[i].context_module_progression.context_module_id] = progData[i].context_module_progression.collapsed;
            }
            for (var i = 0; i < data.length; i++) {
                var subsetData = [];
                for (var ii = 0; ii < data[i].items.length; ii++) {
                    var icon = "star_border";
                    if (data[i].items[ii].type == "ExternalTool") icon = "insert_link";
                    if (data[i].items[ii].type == "ExternalUrl") icon = "open_in_new";
                    if (data[i].items[ii].type == "Assignment") icon = "assignment";
                    if (data[i].items[ii].type == "Page") icon = "insert_drive_file";
                    if (data[i].items[ii].type == "Discussion") icon = "forum";
                    if (data[i].items[ii].type == "Quiz") icon = "assessment";
                    if (data[i].items[ii].type == "SubHeader") icon = "format_size";
                    var open = `window.open('` + data[i].items[ii].html_url + `')`;
                    if (data[i].items[ii].type == "ExternalTool") open = `$('#moduleIFrame').attr('src', ''); fluid.cards('.card.moduleURL'); $.getJSON('` + data[i].items[ii].url + `', function (data) { $('#moduleIFrame').attr('src', data.url); });`
                    if (data[i].items[ii].type == "Assignment") open = `dtps.assignment(` + data[i].items[ii].content_id + `, dtps.selectedClass);`
                    if (data[i].items[ii].type == "Page") open = `dtps.getPage(dtps.classes[dtps.selectedClass].id, '` + data[i].items[ii].page_url + `', true)`
                    if (data[i].items[ii].type == "SubHeader") {
                        subsetData.push(`<h5 style="font-size: 22px;padding: 2px 10px;">` + data[i].items[ii].title + `</h5>`);
                    } else {
                        subsetData.push(`<div onclick="` + open + `" style="color: var(--lightText); padding:10px;font-size:17px;border-radius:15px;margin:5px 0;margin-left: ` + (data[i].items[ii].indent * 15) + `px; cursor: pointer;">
<i class="material-icons" style="vertical-align: middle; margin-right: 10px;">` + icon + `</i>` + data[i].items[ii].title + `</div>`);
                    }
                }
                streamData.push(`<div class="card ` + (collapsed[data[i].id] ? "collapsed" : "") + `">
<h4 style="margin: 5px 2px; font-size: 32px; font-weight: bold;">
<i onclick="dtps.moduleCollapse(this, '` + dtps.classes[num].id + `', '` + data[i].id + `');" style="cursor: pointer; vertical-align: middle; color:var(--lightText);" class="material-icons collapseIcon">` + (collapsed[data[i].id] ? "keyboard_arrow_right" : "keyboard_arrow_down") + `</i>
` + data[i].name + `</h4>
<div class="moduleContents" style="padding-top: 10px;">
` + subsetData.join("") + `
</div>
</div>`)
            }
            if (dtps.selectedContent == "moduleStream") jQuery(".classContent").html(moduleRootHTML + streamData.join(""));
        });
    });
}

/**
 * Collapses a module
 * 
 * @param {Element} ele Element of the module collapse arrow
 * @param {string} classID Class ID
 * @param {string} modID Module ID of the module to collapse
 * @todo pending v3 support
 */
dtps.moduleCollapse = function (ele, classID, modID) {
    alert("This feature has not been implemented yet");
    throw "DTPS v3 IMPLEMENTATION ERR";
    $(ele).parents('.card').toggleClass('collapsed');
    if ($(ele).parents('.card').hasClass('collapsed')) {
        dtps.webReq("canCOLLAPSE", "/courses/" + classID + "/modules/" + modID + "/collapse", undefined, { collapse: 1, forceLoad: true })
        $(ele).html('keyboard_arrow_right');
    } else {
        dtps.webReq("canCOLLAPSE", "/courses/" + classID + "/modules/" + modID + "/collapse", undefined, { collapse: 0, forceLoad: true })
        $(ele).html('keyboard_arrow_down');
    }

}

/**
 * Gets stream tools HTML (search box, class info, and modules/assignment switcher)
 * 
 * @param {number} num Class number
 * @param {string} type Class content these tools are for (e.g. "stream")
 * @param {boolean} [modulesSelector] True if the class supports modules
 * @return {string} Stream tools HTML
 */
dtps.renderClassTools = function (num, type, modulesSelector) {
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

            ${dtps.classes[num].defaultView == "wiki" ? /*html*/`
                <div onclick="dtps.classHome(${num})" class="acrylicMaterial" style="border-radius: 50%; height: 40px; width: 40px; text-align: center; display: inline-block; vertical-align: middle; cursor: pointer;">
                    <i style="line-height: 40px;" class="material-icons">home</i>
                </div>` : ""
        }

        </div>
        
        ${(type == "modules") || (type == "stream") ? /*html*/`
            <div style="text-align: right;${modulesSelector ? "" : "margin-top: 20px;"}">

                ${type == "stream" ? `<i class="inputIcon material-icons">search</i><input onchange="dtps.search()" class="search inputIcon shadow" placeholder="Search assignments" type="search" />` : ""}

                <br />
                ${modulesSelector ? /*html*/`
                    <div class="btns row small acrylicMaterial assignmentPicker" style="margin: ${type == "stream" ? `20px 80px 20px 0px !important` : `63px 80px 20px 0px !important`};">
                        <button class="btn ${type == "stream" ? "active" : ""}" onclick="dtps.classStream(dtps.selectedClass);"><i class="material-icons">assignment</i>Assignments</button>
                        <button class="btn ${type == "modules" ? "active" : ""}" onclick="dtps.moduleStream(dtps.selectedClass);"><i class="material-icons">view_module</i>Modules</button>
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
    if ((dtps.classes[num].syllabus !== "") && dtps.classes[num].syllabus !== null) {
        var blob = new Blob([`<base target="_blank" /> <link type="text/css" rel="stylesheet" href="https://cdn.jottocraft.com/CanvasCSS.css" media="screen,projection"/>
    <style>body {background-color: ` + getComputedStyle($(".card.details")[0]).getPropertyValue("--cards") + `; color: ` + getComputedStyle($(".card.details")[0]).getPropertyValue("--text") + `}</style>` + dtps.classes[num].syllabus], { type: 'text/html' });
        var newurl = window.URL.createObjectURL(blob);
    }
    $(".card.details").html(`<i onclick="fluid.cards.close('.card.details')" class="material-icons close">close</i>
    <h4 style="font-weight: bold;">` + dtps.classes[num].name + `</h4>
    <p style="color: var(--secText)">` + (dtps.classes[num].description ? dtps.classes[num].description : "") + `</p>
    <div class="assignmentChip"><i class="material-icons">group</i><span>` + dtps.classes[num].numStudents + ` students</span></div>
    <div class="assignmentChip"><i class="material-icons">bug_report</i><span>Class ID: ` + dtps.classes[num].id + `</span></div>
    ` + (dtps.classes[num].favorite ? `<div title="Favorited class" class="assignmentChip" style="background-color: #daa520"><i style="color:white;font-family: 'Material Icons Outline'" class="material-icons">star_border</i></div>` : "") + `
    <br />
    <div style="margin-top: 20px;" class="syllabusBody">` + ((dtps.classes[num].syllabus !== "") && dtps.classes[num].syllabus !== null ? `<iframe id="syllabusIframe" onload="dtps.iframeLoad('syllabusIframe')" style="margin: 10px 0px; width: 100%; border: none; outline: none;" src="` + newurl + `" />` : "") + `</div>
    `)
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

    dtps.webReq("canvas", "/api/v1/courses/" + dtps.classes[num].id + "/front_page", function (resp) {
        var data = JSON.parse(resp);
        if (!data.message) {
            var blob = new Blob([`<base target="_blank" /> <link type="text/css" rel="stylesheet" href="https://cdn.jottocraft.com/CanvasCSS.css" media="screen,projection"/>
        <style>body {background-color: ` + getComputedStyle($(".card.details")[0]).getPropertyValue("--cards") + `; color: ` + getComputedStyle($(".card.details")[0]).getPropertyValue("--text") + `}</style>` + data.body], { type: 'text/html' });
            var newurl = window.URL.createObjectURL(blob);
            $(".card.details").html(`<i onclick="fluid.cards.close('.card.details')" class="material-icons close">close</i>
        <h4 style="font-weight: bold;">` + data.title + `</h4>
        <br />
        <div style="margin-top: 20px;" class="homepageBody"><iframe id="homepageIframe" onload="dtps.iframeLoad('homepageIframe')" style="margin: 10px 0px; width: 100%; border: none; outline: none;" src="` + newurl + `" /></div>
        `)
            fluid.modal(".card.details")
        } else {
            alert("Error: No homepage found for this class")
            fluid.cards.close('.card.details')
        }
    })
}

//Fluid UI screen definitions
fluid.externalScreens.dashboard = () => {
    dtps.masterStream();
}

fluid.externalScreens.stream = (courseID) => {
    dtps.classStream(courseID);
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