/**
 * @file DTPS Generic Gradebook
 * @author jottocraft
 * 
 * @copyright Copyright (c) 2018-2020 jottocraft. All rights reserved.
 * @license GPL-2.0-only
 */

//True if the gradebook is expanded
var gradebookExpanded = false;

/**
 * Shows the generic gradebook
 * 
 * @param {string} classID Class ID
 * @todo Show assignments
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
    jQuery(".classContent").html(`<div class="spinner"></div>`);

    //Terminate function if the class doesn't have a letter grade or assignments
    if (!dtps.classes[classNum].letter || !dtps.classes[classNum].assignments) {
        return;
    }

    //Define variables for total points and zeros
    var zeros = 0;
    var totalPoints = 0;
    var earnedPoints = 0;
    var gradedAssignments = 0;

    //Calculate total points and zeros
    dtps.classes[classNum].assignments.forEach(assignment => {
        if (assignment.grade || (assignment.grade == 0)) {
            earnedPoints += assignment.grade;
            gradedAssignments++;
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

            <div style="${gradebookExpanded ? "" : "display: none;"}" id="classGradeMore">
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
            <a onclick="$('#classGradeMore').toggle(); if ($('#classGradeMore').is(':visible')) {$(this).html('Show less'); gradebookExpanded = true;} else {$(this).html('Show more'); gradebookExpanded = false;}"
                style="color: var(--secText, gray); cursor: pointer; margin-right: 10px;">${gradebookExpanded ? "Show less" : "Show more"}</a>
        </div>
    `;

    //Render HTML
    $(".classContent").html(gradeCalcSummary);
}

//Fluid UI screen definitions
fluid.externalScreens.gradebook = (courseID) => {
    dtps.gradebook(courseID);
}