/**
 * @file DTPS assignment functions
 * @author jottocraft
 * 
 * @copyright Copyright (c) 2018-2022 jottocraft
 * @license MIT
 */

/**
 * Renders HTML for an assignment item in a list
 * 
 * @param {Assignment} assignment The assignment object to render
 * @param {string} [childDisplay] Text to display for specifying the child or children this assignment is for
 * @return {string} Assignment HTML for use in a list
 */
dtps.renderAssignment = function (assignment, childDisplay) {
    //Render points/letter score
    var scoreHTML = dtps.renderAssignmentScore(assignment);

    var HTML = /*html*/`
        <div 
            onclick="${`dtps.assignment('` + assignment.id + `', ` + assignment.class + `, ` + (!isNaN(childDisplay) ? true : false) + `)`}" 
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

            <h5>
                <!-- Assignment info -->
                <div class="info">
                    ${assignment.error ? `<div style="color: #f2392c;" class="infoChip weighted"><i class="fluid-icon">error</i> Error</div>` : ""}
                    ${assignment.dueAt ? `<div ${dtpsLMS.isUsualDueDate && !dtpsLMS.isUsualDueDate(assignment.dueAt) ? `style="font-weight: bold;color: var(--text);"` : ""} class="infoChip"><i style="margin-top: -2px;" class="fluid-icon">alarm</i> Due ` + dtps.formatDate(assignment.dueAt) + `</div>` : ""}
                    ${assignment.outcomes ? `<div class="infoChip weighted"><i class="fluid-icon">adjust</i>` + assignment.outcomes.length + `</div>` : ""}
                    ${assignment.category ? `<div class="infoChip weighted"><i class="fluid-icon">category</i> ` + assignment.category + `</div>` : ""}
                    ${childDisplay ? `<div class="infoChip weighted"><i class="fluid-icon">person</i> ` + childDisplay + `</div>` : ""}
                </div>

                <!-- Status icons -->
                <div class="status">
                    ${assignment.turnedIn ? `<i title="Assignment submitted" class="fluid-icon statusIcon" style="color: #0bb75b;">assignment_turned_in</i>` : ``}
                    ${assignment.missing ? `<i title="Assignment is missing" class="fluid-icon statusIcon" style="color: #c44848;">remove_circle_outline</i>` : ``}
                    ${assignment.late ? `<i title="Assignment is late" class="fluid-icon statusIcon" style="color: #c44848;">assignment_late</i>` : ``}
                    ${assignment.locked ? `<i title="Assignment submissions are locked" class="fluid-icon statusIcon" style="color: var(--secText, gray);">lock_outline</i>` : ``}
                    ${assignment.pending ? `<i title="Grade is pending review" class="fluid-icon statusIcon" style="color: #b3b70b;">rate_review</i>` : ``}
                </div>
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
            if (rubricItem.score !== undefined) {
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
                <div class="grade">${Number(assignment.grade.toFixed(2))}</div>
                <div class="value">/${Number(assignment.value.toFixed(2))}</div>
                ${assignment.letter ? `<div class="letter">${assignment.letter.replace("incomplete", `<i class="fluid-icon">cancel</i>`).replace("complete", `<i class="fluid-icon">done</i>`)}</div>` : ""}
                <div class="percentage">${Math.round((assignment.grade / assignment.value) * 100)}%</div>
            </div>
        `;
    }

    return scoreHTML;
}

/**
* Merges and renders assignments for children in the same class
* 
* @param {Assignment[]} assignments An array of assignment objects to merge
* @return {string} HTML with the assignments merged and labelled
*/
dtps.mergeAndRenderChildAssignments = function (assignments) {
    var assignmentGroups = [];

    assignments.forEach(assignment => {
        var matchedGroup = false;
        assignmentGroups.forEach(group => {
            var groupAssignment = group[0];

            //Check if assignment matches group assignment
            var matchKeys = ["id", "dueAt", "locked", "category", "turnedIn", "late", "missing", "grade", "value", "letter"];
            var matches = 0;
            matchKeys.forEach(k => {
                if (assignment[k] == groupAssignment[k]) matches++;
            });

            if (matches == matchKeys.length) {
                matchedGroup = true;
                group.push(assignment);
            }
        });

        if (!matchedGroup) {
            assignmentGroups.push([assignment]);
        }
    });

    return assignmentGroups.map(g => {
        return dtps.renderAssignment(g[0], g.length == 1 ? dtps.user.children.find(c => c.id == dtps.classes[g[0].class].userID).name : g.length);
    }).join("");
}

/**
 * Renders the DTPS dashboard and calls dtps.renderCalendar, dtps.renderUpdates, and dtps.renderUpcoming
 */
dtps.mainStream = function () {
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
            return window.FullCalendar ? `<div id="calendar" class="card" style="padding: 20px;"></div>` : "";
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
            <div style="letter-spacing: 0px;">
                <div style="float: left; width: 45%; display: inline-block;" class="dash">
                    <div id="remoteUpdateImportant"></div>
                    ${dtps.leftDashboard.map(dashboardItem => {
            return dashboardContainerHTML(dashboardItem);
        }).join("")}
                </div>

                <div style="float: left; width: 55%; display: inline-block;" class="dash">
                    ${!doneLoading ? `<div style="margin: 75px 25px 10px 75px;"><div class="spinner"></div></div>` : ""}
                    ${dtps.rightDashboard.map(dashboardItem => {
            return dashboardContainerHTML(dashboardItem);
        }).join("")}
                </div>
            </div>
        `);
    }

    //Render updates stream
    dtps.renderUpdates();

    //Render upcoming assignments stream
    dtps.renderUpcoming();

    //Render calendar
    dtps.calendar(doneLoading);

    //Render due today
    dtps.renderDueToday(doneLoading);
}

/**
 * Checks if a due date is on a date
 * 
 * @param {Date} date Date to check 
 * @param {Date} [onDate] Date checked against (defaults to today)
 */
dtps.isDueOnDate = function (date, onDate) {
    var today = onDate ? new Date(onDate) : new Date();
    var tomorrow = new Date(today.getTime() + 86400000);
    var d1 = new Date(date);

    var isActuallyTodayAfter9 = d1.getFullYear() === today.getFullYear() &&
        d1.getMonth() === today.getMonth() &&
        d1.getDate() === today.getDate() &&
        d1.getHours() >= 9;

    var isTomorrowBefore9 = d1.getFullYear() === tomorrow.getFullYear() &&
        d1.getMonth() === tomorrow.getMonth() &&
        d1.getDate() === tomorrow.getDate() &&
        d1.getHours() < 9;

    return isActuallyTodayAfter9 || isTomorrowBefore9;
}

/**
 * Compiles and displays due today / to-do stream
 * 
 * @param {boolean} doneLoading True if all classes have finished loading their assignment lists
 * @param {Date} [fromDate] The date to display assignments from. Defaults to the current date.
 */
dtps.renderDueToday = function (doneLoading, fromDate) {
    //Combine class stream arrays
    var combinedStream = [];
    if (dtps.classes) {
        dtps.classes.forEach(course => {
            if (course.assignments) {
                //If course has assignments, add them to the combined stream array
                course.assignments.forEach(assignment => {
                    //Only assignments that are due today
                    if (dtps.isDueOnDate(assignment.dueAt, fromDate)) {
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
    if (dtps.user.parent) {
        var combinedHTML = dtps.mergeAndRenderChildAssignments(combinedStream);
    } else {
        var combinedHTML = combinedStream.map(assignment => {
            return dtps.renderAssignment(assignment);
        }).join("");
    }

    if (combinedStream.length == 0) {
        //Nothing due today
        if (doneLoading) {
            combinedHTML = `<p style="text-align: center;margin: 10px 0px; font-size: 18px;"><i class="fluid-icon">done</i> ${fromDate ? "Nothing is due on " + fromDate.toLocaleString("en", { weekday: 'short', month: 'short', day: 'numeric' }) : "Nothing is due today"}</p>`;
        } else {
            combinedHTML = ``;
        }
    } else {
        //Add header
        combinedHTML = /*html*/`
            <h5 style="text-align: center; margin: 10px 0px; font-weight: bold;">${fromDate ? "Due on " + fromDate.toLocaleString("en", { weekday: 'short', month: 'short', day: 'numeric' }) : "Due Today"}</h5>
        ` + combinedHTML;
    }

    if (dtps.selectedClass == "dash") {
        jQuery(".classContent .dash .dueToday").html(combinedHTML);
    }
}

/**
 * Compiles and displays upcoming assignments stream
 * 
 * @param {Date} [fromDate] The date to display assignments from. Defaults to the current date.
 */
dtps.renderUpcoming = function (fromDate) {
    //Combine class stream arrays
    var today = fromDate ? new Date(fromDate) : new Date();
    var combinedStream = [];
    if (dtps.classes) {
        dtps.classes.forEach(course => {
            if (course.assignments) {
                //If course has assignments, add them to the combined stream array
                course.assignments.forEach(assignment => {
                    //Only include upcoming assignments that aren't due today
                    if ((new Date(assignment.dueAt).getTime() > today.getTime()) && !dtps.isDueOnDate(assignment.dueAt, today)) {
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

    //Limit stream length to 30 assignments
    if (combinedStream.length > 30) {
        combinedStream.length = 30;
    }

    //Render upcoming assignments stream
    if (dtps.user.parent) {
        var combinedHTML = dtps.mergeAndRenderChildAssignments(combinedStream);
    } else {
        var combinedHTML = combinedStream.map(assignment => {
            return dtps.renderAssignment(assignment);
        }).join("");
    }

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
 * @param {boolean} [dateSelected] True if a date is selected in the dashboard
 */
dtps.renderUpdates = function (dateSelected) {
    //Get updates HTML
    var updatesHTML = "";

    if (dtps.remoteConfig.remoteUpdate.active && (dtps.remoteConfig.remoteUpdate.host ? dtps.remoteConfig.remoteUpdate.host == window.location.host : true)) {
        $("#remoteUpdateImportant").html(/*html*/`
            <div style="cursor: auto; padding: 20px; --classColor: var(--secText);" class="announcement card open">
                <div class="className">
                    <img src="${dtps.baseURL + "/icon.svg"}" style="vertical-align: middle;width: 22px;margin-right: 5px;" />
                    <span style="font-weight: bold; vertical-align: middle; color: var(--text); font-size: 18px;">${dtps.remoteConfig.remoteUpdate.title}</span>
                </div>
                ${dtps.remoteConfig.remoteUpdate.html}
            </div>
        `);
    }

    if (dateSelected && (dtps.selectedClass == "dash")) {
        return jQuery(".classContent .dash .updatesStream").html(/*html*/`
            <div style="cursor: auto; padding: 20px; --classColor: var(--secText);" class="announcement card open">
                <div class="className">Date Selected</div>
                <p>Updates are not shown while a date is selected</p>
            </div>
        `);
    }

    dtps.updates.forEach(update => {
        if (update.type == "announcement") {
            updatesHTML += /*html*/`
                <div onclick="$(this).toggleClass('open');" style="cursor: pointer; padding: 20px; --classColor: ${dtps.classes[update.class].color};" class="announcement card">
                    <div class="className">${update.title}</div>
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

                    <p>${dtps.user.parent ? "Graded for " + dtps.user.children.find(c => c.id == dtps.classes[update.class].userID).name : "Graded"} at ${dtps.formatDate(update.gradedAt)}</p>
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
 * 
 * @param {boolean} doneLoading True if all classes have finished loading their assignment lists
 */
dtps.calendar = function (doneLoading) {
    if (dtps.selectedClass == "dash") {
        //Calendar events array
        var calEvents = [];

        //Add assignments from every class to calEvents array
        dtps.classes.forEach((course, courseIndex) => {
            if (course.assignments) {
                //Class has assignments
                course.assignments.forEach(assignment => {
                    //Show assignments due before 9AM on the previous day
                    var date = new Date(assignment.dueAt);
                    if (date.getHours() < 9) {
                        //Set the date to 23:59 the previous day for calendar display
                        date.setTime(date.getTime() - 86400000);
                        date.setHours(23);
                        date.setMinutes(59);
                    }

                    var existingEvent = calEvents.find(e => e.id == assignment.id);
                    if (existingEvent && assignment.missing) {
                        //Mark existing event as missing and link to missing assignment
                        existingEvent.missing = true;
                        existingEvent.borderColor = "#c44848";
                        existingEvent.assignmentID = assignment.id;
                        existingEvent.classNum = courseIndex;
                    } else if (!existingEvent) {
                        calEvents.push({
                            title: assignment.title,
                            start: date,
                            id: assignment.id,
                            allDay: true,
                            backgroundColor: course.color,
                            borderColor: (assignment.missing === true) ? '#c44848' : 'transparent',
                            textColor: "white",
                            classNum: courseIndex,
                            assignmentID: assignment.id,
                            missing: assignment.missing
                        });
                    }
                });
            }
        });

        //Render calendar
        if (window.FullCalendar) {
            var calendarEl = document.getElementById('calendar');
            calendar = new FullCalendar.Calendar(calendarEl, {
                locale: "en",
                initialView: 'dayGridMonth',
                events: calEvents,
                eventContent: info => {
                    const { missing } = info.event.extendedProps;
                    const html = /*html*/`
                        <div class='fc-event-main-frame'>
                            <div class='fc-event-title-container'>
                                <div class='fc-event-title fc-sticky'>
                                    ${missing ? `<i title="Assignment is missing" class="fluid-icon statusIcon">remove_circle_outline</i>` : ``}
                                    <span style="vertical-align: middle;">${info.event.title}</span>
                                </div>
                            </div>
                        </div>
                    `;
                    return { html };
                },
                contentHeight: 0,
                handleWindowResize: false,
                headerToolbar: {
                    start: 'title',
                    center: '',
                    end: 'prev,next'
                },
                dateClick: function (info) {
                    if ($(info.dayEl).hasClass("fc-day-today")) return fluid.screen();

                    //Update calendar
                    $("#calendar .fc-daygrid-day").removeClass("active");
                    $(info.dayEl).addClass("active");
                    $("#calendar").addClass("dateSelected");

                    //Display selected date
                    $(".headerArea .contentLabel i").text("event");
                    $(".headerArea .contentLabel span").text("Showing assignments from " + info.date.toLocaleString("en", { weekday: 'short', month: 'short', day: 'numeric' }));
                    $(".headerArea .contentLabel").show();

                    //Re-render dashboard from the selected date
                    dtps.renderDueToday(doneLoading, info.date);
                    dtps.renderUpcoming(info.date);
                    dtps.renderUpdates(true);
                },
                eventClick: function (info) {
                    dtps.assignment(info.event.extendedProps.assignmentID, info.event.extendedProps.classNum);
                }
            });
            calendar.render();
        }
    }
}

/**
 * Shows the assignments stream for a class
 * 
 * @param {string} classID The class ID to show assignments for
 * @param {Assignment[]} [searchResults] An array of assignemnts to render instead of course.assignments. Used for assignment search.
 */
dtps.classStream = function (classID, searchResults) {
    //Get class index and set as selected class
    var classNum = dtps.classes.map(course => course.id).indexOf(classID);
    dtps.selectedClass = classNum;

    //Set stream as the selected content
    dtps.selectedContent = "stream";
    $("#dtpsTabBar .btn").removeClass("active");
    $("#dtpsTabBar .btn.stream").addClass("active");

    //Save coursework stream preference
    window.localStorage.setItem("courseworkPref-" + classID, "stream");

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
            jQuery(".classContent").html(dtps.renderStreamTools(classNum, "stream") + [1, 2, 3, 4].map(() => (
                /*html*/`
                    <div class="card assignment graded">
                        <h4>
                            <span style="width: 450px;" class="shimmer">Assignment Title</span>
                            <div class="points shimmer">00/00</div>
                        </h4>

                        <h5 style="white-space: nowrap; overflow: hidden;">
                            <div style="width: 200px;" class="infoChip shimmer"></div>
                            <i class="fluid-icon statusIcon shimmer">more_horiz</i>
                        </h5>
                    </div>
                `
            )).join(""));
        }
    } else if (assignments.length == 0) {
        //This class doesn't have any assignments
        if ((dtps.selectedClass == classNum) && (dtps.selectedContent == "stream")) {
            $(".classContent").html(dtps.renderStreamTools(classNum, "stream") + /*html*/`
                <div style="text-align: center;">
                    <div style="margin: 60px; padding: 20px 40px; display: inline-block; border: 2px solid var(--elements); border-radius: var(--elementRadius);">
                        <h5>No Assignments</h5>
                        <p>There aren't any assignments in this class yet.</p>
                    </div>
                </div>
            `);
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
                    divider = `<h5 style="margin: 75px 20px 10px 20px;font-weight: bold;">Undated Assignments</h5>`;
                }

                prevAssignment = "undated";
            } else if (new Date(assignment.dueAt) < new Date()) {
                if (prevAssignment && (prevAssignment !== "old")) {
                    divider = `<h5 style="margin: 75px 20px 10px 20px;font-weight: bold;">Old Assignments</h5>`;
                }

                prevAssignment = "old";
            } else {
                prevAssignment = "upcoming";
            }

            return divider + dtps.renderAssignment(assignment);
        }).join("");

        //Add stream header with class info buttons and search box
        streamHTML = dtps.renderStreamTools(classNum, "stream") + streamHTML;

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
 * @param {boolean} [generic] True if user-specific details, such as grades, should not be displayed
 */
dtps.assignment = function (id, classNum, generic) {
    //Get assignment from the id prop
    var assignmentIDs = dtps.classes[classNum].assignments.map(assignment => assignment.id);
    var assignment = dtps.classes[classNum].assignments[assignmentIDs.indexOf(id)];

    //The assignment body is rendered in an iFrame to keep its content and styling isolated from the rest of the page
    var assignmentBodyHTML = null;
    if (assignment.body) {
        //Get computed background and text color to style the iFrame with
        var computedBackgroundColor = getComputedStyle($(".card.details")[0]).getPropertyValue("--cards");
        var computedTextColor = getComputedStyle($(".card.details")[0]).getPropertyValue("--text");

        var body = assignment.body;
        if ($("body").hasClass("dark")) {
            body = dtps.brightenTextForDarkMode(assignment.body, computedBackgroundColor);
        }

        //Generate a blob with the assignment body and get its data URL
        var blob = new Blob([`
                    <base target="_blank" /> 
                    <link type="text/css" rel="stylesheet" href="https://cdn.jottocraft.com/CanvasCSS.css" media="screen,projection"/>
                    <style>body {background-color: ${computedBackgroundColor}; color: ${computedTextColor};}</style>
                    ${body}
                `], { type: 'text/html' });
        assignmentBodyHTML = `<iframe id="assignmentIframe" onload="dtps.iframeLoad('assignmentIframe')" style="margin: 10px 0px; width: 100%; border: none; outline: none;" src="${window.URL.createObjectURL(blob)}" />`;

    }

    //Get assignment rubric HTML
    var assignmentRubricHTML = "";
    if (assignment.rubric) {
        var assignmentRubricHTML = assignment.rubric.map(function (rubricItem) {
            return /*html*/`
                    <div class="dtpsAssignmentRubricItem">
                        <h5>${rubricItem.title}</h5>
                        <div class="score">
                            <p style="color: ${(!generic && rubricItem.color) ? rubricItem.color : "var(--secText)"};" class="scoreName">
                                ${generic ? "" : (rubricItem.score !== undefined ? rubricItem.scoreName || "" : "Not assessed")}

                                <div class="points">
                                    <p class="earned">${generic || (rubricItem.score == undefined) ? "" : rubricItem.score}</p>
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
            <i onclick="fluid.cards.close('.card.details'); $('.card.details').html('');" class="fluid-icon close">close</i>

            <h4 style="font-weight: bold;">${assignment.title}</h4>

            <div>
                ${assignment.dueAt ? `<div class="assignmentChip"><i class="fluid-icon">alarm</i><span>Due ${dtps.formatDate(assignment.dueAt)}</span></div>` : ""}
                ${assignment.turnedIn && !generic ? `<div title="Assignment submitted" class="assignmentChip" style="color: #0bb75b"><i class="fluid-icon">assignment_turned_in</i></div>` : ""}
                ${assignment.missing && !generic ? `<div  title="Assignment is missing" class="assignmentChip" style="color: #c44848"><i class="fluid-icon">remove_circle_outline</i></div>` : ""}
                ${assignment.late && !generic ? `<div title="Assignment is late" class="assignmentChip" style="color: #c44848"><i class="fluid-icon">assignment_late</i></div>` : ""}
                ${assignment.locked && !generic ? `<div title="Assignment submissions are locked" class="assignmentChip" style="color: var(--secText, gray);"><i class="fluid-icon">lock_outline</i></div>` : ""}
                ${(dtps.user.parent && !generic) ? `<div class="assignmentChip"><i class="fluid-icon">person</i><span>${dtps.user.children.find(c => c.id == dtps.classes[assignment.class].userID).name}</span></div>` : ""}
                ${generic ? "" : scoreHTML}
            </div>

            ${assignment.error ? /*html*/`
                <div>
                    <div class="alert error"> 
                        <div class="header"> 
                          <h5><i class="fluid-icon">error</i> Assignment Error</h5> 
                        </div> 

                        <p>${assignment.error}</p> 
                    </div>
                </div>
            ` : ``}

            <div style="margin-top: 20px;" class="assignmentBody">
                ${assignment.body ? assignmentBodyHTML : ""}
            </div>

            ${assignment.body ? `<div style="margin: 5px 0px; background-color: var(--darker); height: 1px; width: 100%;" class="divider"></div>` : ""}

            <div style="width: calc(40% - 2px); margin-top: 20px; display: inline-block; overflow: hidden; vertical-align: top;">
                ${assignment.publishedAt ? `<p style="color: var(--secText); margin: 5px 0px;"><i style="vertical-align: middle;" class="fluid-icon">add_box</i> Published: ${dtps.formatDate(assignment.publishedAt)}</p>` : ""}
                ${assignment.dueAt ? `<p style="color: var(--secText); margin: 5px 0px;"><i style="vertical-align: middle;" class="fluid-icon">alarm</i> Due: ${dtps.formatDate(assignment.dueAt)}</p>` : ""}
                ${assignment.value ? `<p style="color: var(--secText); margin: 5px 0px;"><i style="vertical-align: middle;" class="fluid-icon">bar_chart</i> Point value: ${assignment.value}</p>` : ""}
                ${(assignment.grade || (assignment.grade == 0)) && !generic ? `<p style="color: var(--secText); margin: 5px 0px;"><i style="vertical-align: middle;" class="fluid-icon">assessment</i> Points earned: ${assignment.grade}</p>` : ""}
                ${assignment.letter && !generic ? `<p style="color: var(--secText); margin: 5px 0px;"><i style="vertical-align: middle;" class="fluid-icon">font_download</i> Letter grade: ${assignment.letter}</p>` : ""}
                ${assignment.category ? `<p style="color: var(--secText); margin: 5px 0px;"><i style="vertical-align: middle;" class="fluid-icon">category</i> Category: ${assignment.category}</p>` : ""}
                ${assignment.rubric ? assignment.rubric.map(function (rubricItem) { return `<p style="color: var(--secText); margin: 5px 0px;"><i style="vertical-align: middle;" class="fluid-icon">adjust</i> ${rubricItem.title}</p>`; }).join("") : ""}
                <p style="color: var(--secText); margin: 5px 0px;"><i style="vertical-align: middle;" class="fluid-icon">class</i> Class: ${dtps.classes[assignment.class].subject}</p>
                ${dtps.env == "dev" ? `<p style="color: var(--secText); margin: 5px 0px;"><i style="vertical-align: middle;" class="fluid-icon">code</i> Assignment ID: ${assignment.id}</p>` : ""}

                <br />
                <div class="row">
                    ${assignment.url ? `<button class="btn small outline" onclick="window.open('${assignment.url}')"><i class="fluid-icon">open_in_new</i> Open in ${dtpsLMS.shortName || dtpsLMS.name}</button>` : ``}
                </div>
            </div>

            <div style="width: calc(60% - 10px); margin-top: 20px; margin-left: 5px; display: inline-block; overflow: hidden; vertical-align: middle;">
                ${!generic ? assignmentFeedbackHTML : ""}

                ${assignmentRubricHTML}
            </div>
        `);

    //Close other active cards and open the assignment details card
    fluid.cards.close(".card.focus");
    fluid.cards(".card.details");
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

    //Save coursework stream preference
    window.localStorage.setItem("courseworkPref-" + classID, "moduleStream");

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
        jQuery(".classContent").html(dtps.renderStreamTools(classNum, "modules") + /*html*/`
            <div class="module card collapsed">
                <h4>
                    <i class="fluid-icon collapseIcon shimmer">star</i>
                    <span class="shimmer">[SHIMMER] Module title (collapsed)</span>
                </h4>
                <div class="moduleContents" style="padding-top: 10px;"></div>
            </div>
            <div class="module card">
                <h4>
                    <i class="fluid-icon collapseIcon shimmer">star</i>
                    <span class="shimmer">[SHIMMER] Module title</span>
                </h4>
        
                <div class="moduleContents" style="padding-top: 10px;">
                    <div class="moduleItem shimmer">[SHMMER] module item</div>
                    <div class="moduleItem shimmer">[SHMMER] module item</div>
                    <div class="moduleItem shimmer">[SHMMER] module item</div>
                    <div class="moduleItem shimmer">[SHMMER] module item</div>
                    <div class="moduleItem shimmer">[SHMMER] module item</div>
                </div>
            </div>
        `);
    }

    new Promise(resolve => {
        if (dtps.classes[classNum].modules && (dtps.classes[classNum].modules !== true)) {
            resolve(dtps.classes[classNum].modules);
        } else {
            dtpsLMS.fetchModules(dtps.user.id, dtps.classes[classNum].lmsID).then(data => resolve(data));
        }
    }).then(data => {
        //Save modules data in the class object for future use
        dtps.classes[classNum].modules = data;

        var modulesHTML = dtps.renderStreamTools(classNum, "modules");
        var allCollapsed = true;

        data.forEach(module => {
            var moduleItemHTML = "";
            if (!module.collapsed) allCollapsed = false;

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
                    action = "fluid.screen('pages', '" + classID + "|" + item.id + "|true')";
                }
                if (item.type == "discussion") {
                    action = "fluid.screen('discussions', '" + classID + "|" + item.id + "|true')";
                }
                if (item.type == "url") action = "window.open('" + item.url + "')";
                if (item.type == "header") action = "";
                if (item.type == "embed") action = "dtps.showIFrameCard('" + item.url + "')";

                //Get module HTML
                if (item.type == "header") {
                    moduleItemHTML += `<h5 style="font-size: 16px;padding: 0px 10px; text-decoration: underline;">${item.title}</h5>`;
                } else {
                    moduleItemHTML += `
                        <div class="moduleItem" onclick="${action}" style="margin-left: ${item.indent * 15}px;">
                            <i ${item.completed ? `style="color: #27ba3c"` : ""} class="fluid-icon">${item.completed ? "check" : icon}</i>
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
                            class="fluid-icon collapseIcon">${module.collapsed ? "keyboard_arrow_right" : "keyboard_arrow_down"}</i>
                        ${module.title}
                    </h4>

                    <div class="moduleContents" style="padding-top: 10px;">
                        ${moduleItemHTML}
                    </div>
                </div>
            `;
        });

        if (data.length == 0) {
            modulesHTML += /*html*/`
                <div style="text-align: center;">
                    <div style="margin: 60px; padding: 20px 40px; display: inline-block; border: 2px solid var(--elements); border-radius: var(--elementRadius);">
                        <h5>No Modules</h5>
                        <p>There aren't any modules in this class yet.</p>
                    </div>
                </div>
            `;
        }

        //Render module HTML
        if ((dtps.selectedClass == classNum) && (dtps.selectedContent == "moduleStream")) {
            $(".classContent").html(modulesHTML);
            if (dtpsLMS.collapseAllModules) {
                $("#moduleExpandCollapse").html(allCollapsed ? `<i class="fluid-icon">unfold_more</i> Expand all` : `<i class="fluid-icon">unfold_less</i> Collapse all`);
                $("#moduleExpandCollapse").attr("onclick", allCollapsed ? `dtps.moduleCollapseAll(false)` : `dtps.moduleCollapseAll(true)`);
                $("#moduleExpandCollapse").show();
            }
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
        dtps.classes[dtps.selectedClass].modules.find(m => m.id == modID).collapsed = true;
    } else {
        if (dtpsLMS.collapseModule) dtpsLMS.collapseModule(classID, modID, false);
        $(ele).html('keyboard_arrow_down');
        dtps.classes[dtps.selectedClass].modules.find(m => m.id == modID).collapsed = false;
    }
}


/**
 * Collapses all module
 * 
 * @param {boolean} collapse If true, modules will be collapsed, otherwise, they will all be expanded
 */
dtps.moduleCollapseAll = function (collapse) {
    if (collapse && dtpsLMS.collapseAllModules) {
        dtpsLMS.collapseAllModules(dtps.classes[dtps.selectedClass].lmsID, true);
        $(".classContent .card.module h4 i").text("keyboard_arrow_right");
        $(".classContent .module.card").addClass("collapsed");
        dtps.classes[dtps.selectedClass].modules.forEach(m => m.collapsed = true);
        $("#moduleExpandCollapse").html(`<i class="fluid-icon">unfold_more</i> Expand all`);
        $("#moduleExpandCollapse").attr("onclick", `dtps.moduleCollapseAll(false)`);
    } else if (dtpsLMS.collapseAllModules) {
        dtpsLMS.collapseAllModules(dtps.classes[dtps.selectedClass].lmsID, false);
        $(".classContent .card.module h4 i").text("keyboard_arrow_down");
        $(".classContent .module.card").removeClass("collapsed");
        dtps.classes[dtps.selectedClass].modules.forEach(m => m.collapsed = false);
        $("#moduleExpandCollapse").html(`<i class="fluid-icon">unfold_less</i> Collapse all`);
        $("#moduleExpandCollapse").attr("onclick", `dtps.moduleCollapseAll(true)`);
    }
}

/**
 * Gets stream tools HTML (search box, class info, and modules/assignment switcher)
 * 
 * @param {number} num Class number
 * @param {string} type Class content these tools are for (e.g. "stream")
 * @return {string} Stream tools HTML
 */
dtps.renderStreamTools = function (num, type) {
    var modulesSelector = dtps.classes[num].modules;
    return /*html*/`
        ${(type == "modules") || (type == "stream") ? /*html*/`
            <div style="text-align: right;${modulesSelector ? "" : "margin-top: 20px;"}">
                ${modulesSelector ? /*html*/`
                    ${(type == "modules") && dtpsLMS.collapseAllModules ? `<button id="moduleExpandCollapse" onclick="dtps.moduleCollapseAll()" style="margin-right:20px;display:none;" class="btn"></button>` : ""}
                    <div class="btns row small assignmentPicker" style="margin: 5px 20px 5px 0px !important;">
                        <button class="btn ${type == "stream" ? "active" : ""}" onclick="fluid.screen('stream', dtps.classes[dtps.selectedClass].id);"><i class="fluid-icon">assignment</i>Assignments</button>
                        <button class="btn ${type == "modules" ? "active" : ""}" onclick="fluid.screen('moduleStream', dtps.classes[dtps.selectedClass].id);"><i class="fluid-icon">view_module</i>Modules</button>
                    </div>
                ` : ``}
                
            </div>` : ``
        }
    `;
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
    if (!(dtps.classes[classNum].letter || dtps.classes[classNum].grade) || !dtps.classes[classNum].assignments) {
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
                            <div class="gradebookScore">${Math.round(assignment.grade * 100) / 100}</div>
                            <div class="gradebookValue">/${Math.round(assignment.value * 100) / 100}</div>
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
                    ${dtps.classes[classNum].grade ? `<div class="percentage">${dtps.classes[classNum].grade}%</div>` : ``}
                    ${dtps.classes[classNum].letter ? `<div class="letter">${dtps.classes[classNum].letter}</div>` : ""}
                </div>
            </h3>

            ${zeros ? /*html*/`
                <h5 style="color: #d63d3d;" class="gradeStat">
                    Zeros
                    <div style="color: #d63d3d;" class="numFont">${zeros}</div>
                </h5>
            ` : ``}

            <div style="${dtps.gradebookExpanded ? "" : "display: none;"}" id="genericClassGradeMore">
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
                        <span class="earned">${Math.round(earnedPoints)}</span>
                        <span class="total">/${Math.round(totalPoints)}</span>
                    </div>
                </h5>

                <h5 class="smallStat">
                    Graded Assignments
                    <div class="numFont">${gradedAssignments}</div>
                </h5>
            </div>

            <br />
            <a onclick="$('#genericClassGradeMore').toggle(); if ($('#genericClassGradeMore').is(':visible')) {$(this).html('Show less'); dtps.gradebookExpanded = true;} else {$(this).html('Show more'); dtps.gradebookExpanded = false;}"
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
    dtps.mainStream();
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
* @property {number} class Automatically managed by DTPS. The class number that this assignment belongs to.
* @property {Date} [dueAt] Assignment due date
* @property {string} [url] Assignment URL
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
* @property {string} [error] If an error occures when processing this assignment, store an error message here to notify the user that some features/data may be unavailable
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
 * @property {boolean} [completed] True if the module item has been completed
 */

/**
* @typedef {Object} Announcement
* @description Defines announcement objects in DTPS
* @property {string} title Title of the announcement
* @property {Date} postedAt Date when the announcement was posted
* @property {string} body Announcement content
* @property {string} url Announcement URL
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
* @property {string} id Rubric item ID (only needs to be unique to this assignment)
* @property {number} value Total amount of points possible
* @property {string} [outcome] The ID of the outcome this rubric item is assessing. This is only used for grade calculation.
* @property {string} [description] Rubric item description
* @property {number} [score] Rubric assessment score in points
* @property {string} [scoreName] Rubric assessment score name
* @property {string} [color] Score color in a CSS color format
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