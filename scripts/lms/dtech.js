/**
 * @file d.tech-specific features, CBL & grade calculation
 * @author jottocraft
 * 
 * @copyright Copyright (c) 2018-2020 jottocraft. All rights reserved.
 * @license GPL-2.0-only
 * 
 * JSDoc documentation for these LMS functions can be found near the end of core.js
 */

//Get baseURL from the URL of this script
var baseURL = document.currentScript.src.split("/scripts/lms/dtech.js")[0];

//Load Canvas integration
jQuery.getScript(baseURL + "/scripts/lms/canvas.js", function () {
    //Add d.tech-specific items to dtpsLMS
    dtpsLMS.name = "d.tech";
    dtpsLMS.legalName = "Canvas LMS, Design Tech High School, and Instructure Inc";
    dtpsLMS.description = "Power+ integration for Canvas LMS, customized for d.tech";
    dtpsLMS.logo = "https://i.imgur.com/efGrLq3.png";
    dtpsLMS.source = "https://github.com/jottocraft/dtps/blob/main/scripts/lms/dtech.js";
    dtpsLMS.useRubricGrades = true;
    dtpsLMS.institutionSpecific = true;
    dtpsLMS.genericGradebook = false;
    dtpsLMS.dtech = true;

    //Check if due date is usual
    dtpsLMS.isUsualDueDate = function (date) {
        var date = new Date(date);

        if (date.getHours() >= 22) {
            return true;
        } else if ((date.getHours() == 21) && (date.getMinutes() > 50)) {
            return true;
        } else if (date.getHours() < 8) {
            return true;
        }

        return false;
    };

    //Update assignments
    //This is for customizing rubric names and colors to match d.tech CBL
    dtpsLMS.updateAssignments = function (rawAssignments) {
        return new Promise((resolve, reject) => {
            var updatedAssignments = rawAssignments.map(assignment => {
                //Check if assignment has rubric
                if (assignment.rubric) {
                    //Update assignment rubric
                    assignment.rubric.forEach(rubricItem => {
                        rubricItem.scoreName = shortenDtechRubricScoreName(rubricItem.scoreName);

                        if (rubricItem.score !== undefined) {
                            rubricItem.color = dtechRubricColor(rubricItem.score);
                        }
                    });
                }

                //Return updated assignment to the Array.map function
                return assignment;
            });

            resolve(updatedAssignments);
        })
    }

    //Update classes
    dtpsLMS.updateClasses = function (classes) {
        return new Promise((resolve, reject) => {
            var tmpNewArray = [];
            classes.forEach((course, i) => {
                if (course.term == dtps.remoteConfig.dtechCurrentTerm) {
                    tmpNewArray.push(course);
                } else if (course.id == dtps.remoteConfig.debugClassID) {
                    tmpNewArray.push(course);
                } else if (!course.endDate || (new Date() < new Date(course.endDate))) {
                    tmpNewArray.push(course);
                }

                //Check if course is ineligible for videoMeetingURL
                if (!dtps.remoteConfig.showVideoMeetingButton || !course.homepage || (course.term !== dtps.remoteConfig.dtechCurrentTerm)) {
                    course.videoMeetingURL = null;
                }

                //Get course period
                var matches = course.period.match(/[0-9](?=\(A)/);
                if (matches && matches[0]) {
                    course.period = matches[0] == "7" ? 0 : Number(matches[0]);
                } else if (/(d|design)(\.| |-)?lab/gi.test(course.subject)) {
                    course.period = 11;
                } else if (/exploration/gi.test(course.subject)) {
                    course.period = 12;
                } else {
                    course.period = Infinity;
                }

                //Get course cycle
                if (window.localStorage.getItem("pref-autoGroupClasses") !== "false") {
                    if ((course.period >= 1) && (course.period <= 3)) {
                        course.group = "Cycle 1";
                    } else if ((course.period >= 4) && (course.period <= 6)) {
                        course.group = "Cycle 2";
                    } else if ((course.period == 11) || (course.period == 12)) {
                        course.group = "Intersession";
                    }
                }

                //Add course icon
                if (course.id == dtps.remoteConfig.debugClassID) {
                    course.icon = "bug_report";
                } else if (/Game/gi.test(course.subject)) {
                    course.icon = "games";
                } else if (/Architecture/gi.test(course.subject)) {
                    course.icon = "architecture";
                } else if (/History/gi.test(course.subject)) {
                    course.icon = "history_edu";
                } else if (/Biology/gi.test(course.subject)) {
                    course.icon = "biotech";
                } else if (/Physics|Science|Chemistry/gi.test(course.subject)) {
                    course.icon = "science";
                } else if (/Math|Algebra|Geometry|Calculus|Statistics/gi.test(course.subject)) {
                    course.icon = "calculate";
                } else if (/Engineering|DRG/gi.test(course.subject)) {
                    course.icon = "engineering";
                } else if (/((d|design)(\.| |-)?lab)|Prototyping/gi.test(course.subject)) {
                    course.icon = "design_services";
                } else if (/Exploration/gi.test(course.subject)) {
                    course.icon = "explore";
                } else if (/@d.?tech/gi.test(course.subject)) {
                    course.icon = "school";
                } else if (/English/gi.test(course.subject)) {
                    course.icon = "description";
                } else if (/Model( |-|)(United Nations|UN)/gi.test(course.subject)) {
                    course.icon = "public";
                } else if (/Spanish|Language/gi.test(course.subject)) {
                    course.icon = "translate";
                } else if (/Government/gi.test(course.subject)) {
                    course.icon = "gavel";
                } else if (/(Koi|Live)( |-|)Stream/gi.test(course.subject)) {
                    course.icon = "live_tv";
                } else if (/Film/gi.test(course.subject)) {
                    course.icon = "camera_roll";
                } else if (/Leadership/gi.test(course.subject)) {
                    course.icon = "stars";
                } else if (/Athletics/gi.test(course.subject)) {
                    course.icon = "sports_handball";
                }
            });
            classes = tmpNewArray;

            //Automatically sort and group classes if enabled
            if (window.localStorage.getItem("pref-autoGroupClasses") !== "false") {
                classes.sort((a, b) => {
                    return a.period - b.period;
                });
            }

            resolve(classes);
        });
    }

    //Fetch videoMeetingURL for a class
    dtpsLMS.fetchMeetingURL = function (classID) {
        return new Promise((resolve, reject) => {
            var course = dtps.classes.find(course => course.id == classID);

            if (course.homepage && (course.term == dtps.remoteConfig.dtechCurrentTerm)) {
                dtpsLMS.fetchHomepage(classID).then(homepage => {
                    //get zoom link
                    var meetingURL = null;
                    var matches = 0;
                    for (var i = 0; i < $(homepage).find("a").length; i++) {
                        var link = $($(homepage).find("a")[i]);
                        if (link.children("img").attr("alt") && link.children("img").attr("alt").toUpperCase().includes("ZOOM BUTTON") && link.attr("href")) {
                            //Button labelled as zoom button
                            meetingURL = link.attr("href");
                        } else if (link.attr("href") && link.attr("href").includes("zoom.us")) {
                            //Button link goes to a zoom meeting, only use this if there is no other zoom link
                            //if (!meetingURL) meetingURL = link.attr("href");
                        }
                    }

                    if (matches > 1) {
                        //Multiple zoom links found
                        meetingURL = null;
                    }

                    resolve(meetingURL);
                });
            }
        })
    }

    //Run d.tech grade calculation algorithm (defined below)
    dtpsLMS.calculateGrade = function (course, assignments) {
        var formula = null;

        //Get d.tech grade calculation formula
        if (course.term == "20-21") {
            formula = "2020s1";
        } else if (String(course.id).includes(dtps.remoteConfig.debugClassID)) {
            formula = "2020s1";
        }

        //If there is no grade calculation formula, don't run grade calc
        if (!formula) return;

        //Run d.tech grade calculation
        var dtechResults = dtechGradeCalc.run(assignments, formula);

        if (dtechResults) {
            //Class has a grade
            return {
                letter: dtechResults.results.letter,
                dtech: dtechResults //Return dtech results for gradebook
            };
        } else {
            //No grade for this class
            return;
        }
    }

    //Local functions & variables, not part of the dtpsLMS specification ----------------------------------------------

    //Shortens rubric name for d.tech CBL rubrics
    var shortenDtechRubricScoreName = function (rating) {
        if (String(rating).toUpperCase().includes("PIONEERING")) return "Pioneering";
        if (String(rating).toUpperCase().includes("PROFICIENT")) return "Proficient";
        if (String(rating).toUpperCase().includes("DEVELOPING")) return "Developing";
        if (String(rating).toUpperCase().includes("EMERGING")) return "Emerging";
        if (!String(rating).includes(" ") && (String(rating).length <= 20)) return rating;
        return "";
    }

    //Get score color from rubric percentage
    var dtechRubricColor = function (score) {
        if (score > 4.0) return "#20D684";
        if (score == 4.0) return "#41BA35";
        if (score >= 3.9) return "#50BC39";
        if (score >= 3.8) return "#5FBD3D";
        if (score >= 3.7) return "#6EBF40";
        if (score >= 3.6) return "#7DC044";
        if (score >= 3.5) return "#8CC248";
        if (score >= 3.4) return "#9AC44C";
        if (score >= 3.3) return "#A9C550";
        if (score >= 3.2) return "#B8C753";
        if (score >= 3.1) return "#C7C857";
        if (score >= 3.0) return "#D6CA5B";
        if (score >= 2.9) return "#D8C35A";
        if (score >= 2.8) return "#DABB59";
        if (score >= 2.7) return "#DCB458";
        if (score >= 2.6) return "#DEAC57";
        if (score >= 2.5) return "#E1A556";
        if (score >= 2.4) return "#E39E55";
        if (score >= 2.3) return "#E59654";
        if (score >= 2.2) return "#E78F53";
        if (score >= 2.1) return "#E98752";
        if (score >= 2.0) return "#EB8051";
        if (score >= 1.9) return "#E97A50";
        if (score >= 1.8) return "#E7744F";
        if (score >= 1.7) return "#E56F4E";
        if (score >= 1.6) return "#E3694D";
        if (score >= 1.5) return "#E1634C";
        if (score >= 1.4) return "#DE5D4A";
        if (score >= 1.3) return "#DC5749";
        if (score >= 1.2) return "#DA5248";
        if (score >= 1.1) return "#D84C47";
        if (score >= 1.0) return "#D64646";
        if (score >= 0.0) return "#D72727";
        if (score < 0.0) return "#BF0000";
    }

    /**
     * d.tech CBL grade calculation algorithm
     * 
     * @property {string[]} letters An array of letters that can be returned from highest -> lowest
     * @property {object} params Parameters for each type of grade calculation, such as requirements for each criteria
     */
    var dtechGradeCalc = {
        letters: ["A", "A-", "B+", "B", "B-", "C", "I"],
        params: {
            /**
             * @description 2020s1 grade calculation parameters
             * @property {{string, number}} percentage Percentage criteria parameters. The key of each item in the object is the letter and the value is the percentage needed to meet the criteria
             * @property {{string, number}} lowest Lowest average criteria perameters. The key of each item in the object is the letter and the value is the lowest average needed to meet the criteria
             */
            "2020s1": {
                percentage: {
                    "A": 3.3,
                    "A-": 3.3,
                    "B+": 2.6,
                    "B": 2.6,
                    "B-": 2.6,
                    "C": 2.2,
                    "I": 0
                },
                lowest: {
                    "A": 3,
                    "A-": 2.5,
                    "B+": 2.2,
                    "B": 1.8,
                    "B-": 1.5,
                    "C": 1.5,
                    "I": 0
                }
            }
        },
        /**
         * A simple average function
         * 
         * @param {number[]} array Array of numbers to average
         * @return {number} Average of the numbers in the array
         */
        average: function (array) {
            var sum = 0;
            array.forEach(item => sum += item);
            return sum / array.length;
        },
        /**
         * Runs grade calculation. Takes assignments, gets outcome averages, then calls getLetter to get the final letter.
         * This function returns undefined if there is no grade.
         * 
         * @param {Assignment[]} assignments Array of assignments to use for grade calculation
         * @param {string} formula Formula to use for grade calculation. Can be one of the following: 2020s1
         * @param {object} outcomesOverride An outcome object to use instead of using assignments. Used for what-if grades.
         * @return {object} Grade calculation results
         */
        run: function (assignments, formula, outcomesOverride) {

            //Array of grade variations
            var gradeVariations = [];

            //Outcomes object
            //This doesn't have to be used by the grade calculation formula. Can be overridden for What-If grades.
            var outcomes = outcomesOverride || {};

            if (formula == "2020s1") {
                //2020-21 SEMESTER 1 OUTCOME AVERAGE FORMULA (2020s1)

                // ------- [2020s1] Step 1: Get rubric assessments by outcome -------

                if (!outcomesOverride) {
                    assignments.forEach(assignment => {
                        if (assignment.rubric) {
                            //Assignment has a rubric

                            assignment.rubric.forEach(rubricItem => {
                                if ((rubricItem.score !== undefined) && rubricItem.outcome) {
                                    //Rubric item is assessed and is linked with an outcome

                                    if (!outcomes[rubricItem.outcome]) {
                                        //Outcome object doesn't exist yet
                                        outcomes[rubricItem.outcome] = {
                                            scores: []
                                        };
                                    }

                                    //Add RubricItem to outcome array
                                    outcomes[rubricItem.outcome].scores.push(rubricItem);

                                    //Save outcome name as rubric title
                                    if (rubricItem.title) outcomes[rubricItem.outcome].title = rubricItem.title;
                                }
                            });
                        }
                    });
                }

                // ------- [2020s1] Step 2: Calculate outcome averages -------

                //If there are no outcomes, this class doesn't have a grade
                if (Object.keys(outcomes).length == 0) return;

                //Loop over the values of each item in the outcomes object
                Object.values(outcomes).forEach(outcome => {
                    //Get array of scores for the outcome, remove null scores
                    var outcomeScores = outcome.scores.map(RubricItem => RubricItem.score).filter(score => score !== null);

                    //Calculate outcome average with all outcome scores
                    var average = this.average(outcomeScores);

                    //Get the lowest score
                    var lowestScore = Math.min(...outcomeScores);

                    //Drop the lowest score to see what happens
                    var droppedArray = outcomeScores.slice(); //copy of outcomeScores array
                    droppedArray.splice(droppedArray.indexOf(lowestScore), 1); //remove lowest score from array

                    var droppedAverage = this.average(droppedArray); //calculate average from droppedArray

                    //Choose the higher score
                    if (droppedAverage > average) {
                        //The dropped score was higher
                        outcome.scoreType = "dropped";
                        outcome.droppedScore = outcome.scores.map(RubricItem => RubricItem.score).indexOf(lowestScore);
                        outcome.average = droppedAverage;
                    } else {
                        //Calculating with all outcome scores was the same or higher
                        outcome.scoreType = "all";
                        outcome.average = average;
                        delete outcome.droppedScore;
                    }
                });


                // ------- [2020s1] Step 3: Calculate letter grade variations -------

                //All outcomes variation
                var outcomeAvgs = Object.values(outcomes).map(outcome => outcome.average);
                gradeVariations.push(this.getLetter(outcomeAvgs, formula, "all"));

            }

            //Get the highest grade variation from the results
            var bestVariation = null;
            gradeVariations.forEach(variation => {
                if (!bestVariation || (this.letters.indexOf(variation.letter) < this.letters.indexOf(bestVariation.letter))) {
                    //variation.letter is a higher letter than bestVariation.letter, or there is no best variation yet
                    bestVariation = variation;
                }
            });

            //Return grade calculation results
            return {
                results: bestVariation, //Results for the best variation
                formula: formula, //Formula used to calculate this grade
                outcomes: outcomes //Calculated outcome scores
            };
        },
        /**
         * Calculates a letter grade from an array of outcome averages. Called by gradeCalc.run.
         * Gets the best possible letter from each criteria, then the lowest letter from that array.
         * 
         * @param {number[]} outcomeAvgs Array of outcome averages to use for letter grade calculation
         * @param {string} formula Formula to use for grade calculation. See gradeCalc.run.
         * @param {string} [variation] Name of the letter grade variation (e.g. withSS, withoutSS, etc.). Only used for formulas with multiple variations.
         * @return {object} Letter grade calculation results
         */
        getLetter: function (outcomeAvgs, formula, variation) {
            //Grade calculation results object
            //This includes any properties that need to be passed to the gradebook. The properties set depend on the formula.
            var parameters = {};

            //Sort outcome averages highest -> lowest
            outcomeAvgs.sort((a, b) => b - a);

            if (formula == "2020s1") {
                //2020-21 SEMESTER 1 LETTER GRADE FORMULA (2020s1)

                //Array of letters from each criteria
                var letters = [];

                // ------- [2020s1] Step 1: Get highest letter for Criteria 1 (percentage of outcomes criteria) -------
                var percentage = .75;
                var numOutcomesRequired = Math.floor(outcomeAvgs.length * percentage); //Minimum number of outcomes required

                //Calculate the value 75% of outcomes >= to (number75) and the number of outcomes needed to meet criteria 1
                if (outcomeAvgs.length == 1) {
                    parameters.number75 = outcomeAvgs[0]; //if there is only 1 outcome, that outcome is number75
                } else {
                    parameters.number75 = outcomeAvgs[numOutcomesRequired - 1]; //number75 = the outcome 75% through the array (since its sorted)
                }
                parameters.number75thresh = numOutcomesRequired; //number75thresh = number of outcomes needed to meet the criteria

                //Get the best letter
                var bestLetter = null;

                //Test each letter and add the highest to the letters array
                for (var i = 0; i < this.letters.length; i++) {
                    let letter = this.letters[i];

                    if (parameters.number75 >= this.params[formula].percentage[letter]) {
                        //Able to get this letter
                        bestLetter = letter;

                        //Stop checking for matches since all letters after this are lower
                        break;
                    }
                }

                //Add highest criteria 1 letter to the letters array
                letters.push(bestLetter);

                // ------- [2020s1] Step 2: Get highest letter for Criteria 2 (lowest outcome criteria) -------

                //Reset best letter
                var bestLetter = null;

                //Since the array is highest -> lowest, the lowest score is the last item in the array
                parameters.lowestScore = outcomeAvgs[outcomeAvgs.length - 1];

                //Test each letter and add the highest to the letters array
                for (var i = 0; i < this.letters.length; i++) {
                    let letter = this.letters[i];

                    if (parameters.lowestScore >= this.params[formula].lowest[letter]) {
                        //Able to get this letter
                        bestLetter = letter;

                        //Stop checking for matches since all letters after this are lower
                        break;
                    }
                }

                //Add highest criteria 2 letter to the letters array
                letters.push(bestLetter);
            }

            //Get the final letter, the lowest letter from the array
            var letterIndexes = letters.map(letter => this.letters.indexOf(letter)); //Array of letter indexes in this.letters
            var lowestLetterIndex = Math.max(...letterIndexes); //Lowest letter = highest index in this.letters
            var letter = this.letters[lowestLetterIndex]; //Get final letter

            return {
                letter: letter,
                parameters: parameters,
                variation: variation
            };
        }
    };

    dtpsLMS.gradebook = function (course) {
        return new Promise((resolve, reject) => {
            if (course.gradeCalculation && course.gradeCalculation.dtech) {
                //RENDERER: RENDER GRADE CALCULATION SUMMARY ------------------------------------
                if (course.gradeCalculation.dtech.formula == "2020s1") {
                    var gradeCalcSummary = /*html*/`
                    <div id="gradeSummary" style="--size: 250px; margin: 0px 20px; --classColor: ${course.color};" class="grid flex">
                      <div style="background-color: var(--classColor); color: white;" class="block status letterGrade card">
                        <h2 class="main">${course.letter}</h2>
                        ${course.previousLetter ? `<h5 class="previousGrade">Previous grade: ${course.previousLetter}</h5>` : ""}
                        <h5 class="bottom"><i class="material-icons">grade</i> Grade</h5>
                      </div>
                      <div class="block status number75">
                        <h2 class="main numFont">${course.gradeCalculation.dtech.results.parameters.number75.toFixed(2)}</h2>
                        <h5 class="bottom"><i class="material-icons">functions</i> 75% of outcomes (${course.gradeCalculation.dtech.results.parameters.number75thresh}) ≥</h5>
                      </div>
                      <div class="block status lowestScore">
                        <h2 class="main numFont">${course.gradeCalculation.dtech.results.parameters.lowestScore.toFixed(2)}</h2>
                        <h5 class="bottom"><i class="material-icons">leaderboard</i> Lowest outcome</h5>
                      </div>
                    </div>

                    <div style="--classColor: ${course.color};${dtps.gradebookExpanded ? "" : "display: none;"}" id="classGradeMore">
                            <br />
                            <table class="table">
                                <thead>
                                    <tr>
                                    <th>&nbsp;&nbsp;Final Letter</th>
                                    <th>75% (rounded down) of outcome scores is ≥</th>
                                    <th>No outcome scores below</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    ${dtechGradeCalc.letters.map(letter => {
                        return /*html*/`
                                            <tr class="letter${letter} ${course.letter == letter ? `active` : ``}">
                                                <td>&nbsp;&nbsp;${letter}</td>
                                                <td>${dtechGradeCalc.params[course.gradeCalculation.dtech.formula].percentage[letter]}</td>
                                                <td>${dtechGradeCalc.params[course.gradeCalculation.dtech.formula].lowest[letter]}</td>
                                            </tr>
                                        `
                    }).join("")}
                                </tbody>
                            </table>
                        </div>

                    <div onclick="$('#classGradeMore').toggle(); if ($('#classGradeMore').is(':visible')) {$(this).children('i').text('keyboard_arrow_up'); $(this).children('span').text('Show less'); dtps.gradebookExpanded = true;} else {$(this).children('i').text('keyboard_arrow_down'); $(this).children('span').text('Show more'); dtps.gradebookExpanded = false;}" class="gradeSummaryShowHide">
                        ${dtps.gradebookExpanded ? `<i class="material-icons">keyboard_arrow_up</i> <span>Show less</span>` : `<i class="material-icons">keyboard_arrow_down</i> <span>Show more</span>`}
                    </div>
                `;
                } else {
                    var gradeCalcSummary = ""; //no grade calculation for this class
                }

                //RENDERER: RENDER EACH OUTCOME ------------------------------------
                var outcomeHTML = []; //array of outcome html to be rendered
                var dividerAdded = false; //used for determining if the unassessed outcome divided has been added
                Object.keys(course.gradeCalculation.dtech.outcomes).sort(function (a, b) {
                    var keyA = course.gradeCalculation.dtech.outcomes[a].average,//sort by score lowest -> highest
                        keyB = course.gradeCalculation.dtech.outcomes[b].average;
                    if (keyA == undefined) { keyA = 999999 - course.gradeCalculation.dtech.outcomes[a].scores.length; } //put outcomes with no assessments at the bottom
                    if (keyB == undefined) { keyB = 999999 - course.gradeCalculation.dtech.outcomes[b].scores.length; }
                    // Compare the 2 scores
                    if (keyA > keyB) return 1;
                    if (keyA < keyB) return -1;
                    return 0;
                }).forEach((outcomeID) => {
                    var outcome = course.gradeCalculation.dtech.outcomes[outcomeID];

                    var divider = !dividerAdded && !outcome.scores.length; //render divider
                    if (divider) dividerAdded = true; //remember that divider is already rendered

                    outcomeHTML.push(/*html*/`
                    ${divider ? `<h5 style="font-weight: bold;margin: 75px 75px 10px 75px;">Unassesed outcomes</h5>` : ""}

                    <div style="border-radius: 20px;padding: 22px; padding-bottom: 20px;" class="card outcomeResults outcome-${outcomeID}">
                        <h5 style="max-width: calc(100% - 50px); font-size: 24px; margin: 0px; margin-bottom: 20px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; cursor: pointer;">${outcome.title}</h5>

                        ${outcome.average !== undefined ? `
                            <div id="outcomeScore${outcomeID}" class="numFont" style="position: absolute; top: 20px; right: 20px; font-size: 26px; font-weight: bold; display: inline-block; color: ${dtechRubricColor(outcome.average)}">${outcome.average.toFixed(2)}</div>
                        ` : ``}
                        
                        <div class="assessments">
                            ${outcome.scores.length == 0 ? `
                                    <p style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin: 6px 0px; color: var(--secText);">This outcome has not been assessed yet</p>
                            ` :
                            outcome.scores.map((assessment, aIndex) => {
                                return /*html*/`
                                        <div class="assessmentWrapper ${aIndex == outcome.droppedScore ? "dropped" : ""}" id="outcome${assessment.outcome}assessment${aIndex}" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin: 6px 0px;">
                                            <div style="color: ${assessment.color};" aIndex="${aIndex}" outcomeID="${outcomeID}" class="editableScore" ${dtps.remoteConfig.allowWhatIfGrades ? `contenteditable` : ""}>${assessment.score}</div>
                                            <span class="assessmentTitle" style="cursor: pointer;" onclick="dtps.assignment('${assessment.assignmentID}', ${course.num});">${assessment.assignmentTitle}</span>
                                        </div>
                                    `;
                            }).join("")
                        }
                        </div>

                        ${dtps.remoteConfig.allowWhatIfGrades ? /*html*/`
                            <p class="addWhatIf" outcomeID="${outcomeID}" style="font-size: 14px; color: var(--secText); margin: 0px; margin-top: 16px; cursor: pointer;">
                                <i style="cursor: pointer; vertical-align: middle; font-size: 16px;" class="material-icons down">add_box</i>
                                Add a What-If grade
                            </p>
                        ` : ""}
                    </div>
                `);
                })

                //RENDERER: RENDER WHAT-IF RESULTS
                var whatIfResults = /*html*/`
                    <div style="--classColor: ${course.color}" class="card" id="whatIfResults">
                        <div style="display: inline-block;">
                           <h5>
                              What-If Grade
                              <div class="resultLetter">--</div>
                           </h5>
                           <p style="color: var(--lightText);" class="resultPercentage"></p>
                           <p>This grade is hypothetical and does not represent your actual grade for this class.</p>
                           <p onclick="fluid.screen();" style="color: var(--secText); cursor: pointer;">Show actual grades</p>
                        </div>
                    </div>
                `;

                //RESOLVE WITH HTML
                resolve(whatIfResults + gradeCalcSummary + `<br />` + outcomeHTML.join(""));
            } else {
                resolve();
            }
        });
    }

    //Enable What-If grades
    var scrollListenerAdded = false;
    dtpsLMS.gradebookDidRender = function (course) {
        //Add event listeners for every editable score in the gradebook
        $(".card.outcomeResults .assessments .editableScore").toArray().forEach(ele => {
            listenForWhatIf(ele, course);
        });

        //Add event listeners for the "Add a What-If grade" buttons
        $("p.addWhatIf").click(function () {
            addWhatIf(course, $(this).attr("outcomeID"));
        });

        //Keep the grade summary on top
        if (!scrollListenerAdded) {
            scrollListenerAdded = true;
            var gradeSummary = document.getElementById("gradeSummary");
            var sticky = gradeSummary.offsetTop - parseFloat($("body").css("padding-top")) - 10;
            window.onscroll = function () {
                if ((window.pageYOffset >= sticky) && ((dtps.classes[dtps.selectedClass]) && (dtps.selectedContent == "grades"))) {
                    $(".classContent").addClass("fixedGradeSummary");
                } else {
                    $(".classContent").removeClass("fixedGradeSummary");
                }
            };
        }
    }

    //Adds a What-If grade listener to the provided element
    var listenForWhatIf = function (ele, course) {
        ele.addEventListener("input", function () {
            //Prepare what-if grades if it's not already prepared
            initWhatIf(course);

            //Get new outcome score
            var typedScore = Number($(ele).text());

            //Check if score is valid
            if ($(ele).text() && ($(ele).text().length < 4) && !isNaN(typedScore) && (typedScore >= 0) && (typedScore <= 4)) {
                //Valid outcome score, update color to match
                $(ele).css("color", dtechRubricColor(typedScore));

                //Check if score is modified
                var isWhatIf = course.gradeCalculation.dtech.whatIfOutcomes[Number($(ele).attr("outcomeID"))].scores[Number($(ele).attr("aIndex"))].whatIfGrade;
                if (isWhatIf || (typedScore !== course.gradeCalculation.dtech.outcomes[Number($(ele).attr("outcomeID"))].scores[Number($(ele).attr("aIndex"))].score)) {
                    $(ele).addClass("modified");
                } else {
                    $(ele).removeClass("modified");
                }

                //Update score in the what-if outcomes
                course.gradeCalculation.dtech.whatIfOutcomes[Number($(ele).attr("outcomeID"))].scores[Number($(ele).attr("aIndex"))].score = typedScore;

                //Calculate what-if grade
                calcWhatIf(course);
            } else {
                //Invalid outcome score, gray out and calculate without this score
                $(ele).css("color", "var(--secText)");
                $(ele).addClass("modified");

                //Update score in the what-if outcomes
                course.gradeCalculation.dtech.whatIfOutcomes[Number($(ele).attr("outcomeID"))].scores[Number($(ele).attr("aIndex"))].score = null;

                //Calculate what-if grade
                calcWhatIf(course);
            }

        }, false);

        ele.addEventListener("focus", function () {
            $(ele).addClass("focused");
        }, false);

        ele.addEventListener("blur", function () {
            if ($(ele).hasClass("whatIf") && ($(ele).text() == "")) {
                $(ele).parent().remove();
                course.gradeCalculation.dtech.whatIfOutcomes[Number($(ele).attr("outcomeID"))].scores[Number($(ele).attr("aIndex"))].score = null;
            } else {
                $(ele).removeClass("focused");
            }
        }, false);

        ele.addEventListener("keydown", function (e) {
            function placeCaretAtEnd(el) {
                el.focus();
                if (typeof window.getSelection != "undefined"
                    && typeof document.createRange != "undefined") {
                    var range = document.createRange();
                    range.selectNodeContents(el);
                    range.collapse(false);
                    var sel = window.getSelection();
                    sel.removeAllRanges();
                    sel.addRange(range);
                } else if (typeof document.body.createTextRange != "undefined") {
                    var textRange = document.body.createTextRange();
                    textRange.moveToElementText(el);
                    textRange.collapse(false);
                    textRange.select();
                }
            }

            if (e.key == "ArrowDown") {
                e.preventDefault();
                var scores = $(".editableScore").toArray();
                if (scores[scores.indexOf(ele) + 1]) {
                    placeCaretAtEnd(scores[scores.indexOf(ele) + 1]);
                }
            } else if (e.key == "ArrowUp") {
                e.preventDefault();
                var scores = $(".editableScore").toArray();
                if (scores[scores.indexOf(ele) - 1]) {
                    placeCaretAtEnd(scores[scores.indexOf(ele) - 1]);
                }
            }
        }, false);
    }

    //Copies outcomes for modification, shows what-if UI
    var initWhatIf = function (course) {
        if (!$("#gradeSummary").hasClass("whatIf")) {
            //Initialize what-if grades

            //Copy outcomes for modification
            course.gradeCalculation.dtech.whatIfOutcomes = JSON.parse(JSON.stringify(course.gradeCalculation.dtech.outcomes));

            //Show what-if mode for grade summary
            $("#gradeSummary .block.card").css("background-color", "");
            $("#gradeSummary .block.card").css("color", "var(--classColor)");
            $("#gradeSummary .block.card h5.bottom").html(`<i class="material-icons">analytics</i> What-If Grade`);
            $("#gradeSummary .block.card .previousGrade").remove();
            $("#gradeSummary .block.card h2.main").after(`<h5 onclick="fluid.screen();" class="showActualGrades">Show actual grades</h5>`);

            $("#gradeSummary").addClass("whatIf");
            $("#classGradeMore").addClass("whatIf");
        }
    }

    //Calculates what-if grade and updates the UI based on the results
    var calcWhatIf = function (course) {
        if (course.gradeCalculation.dtech.whatIfOutcomes) {
            //Class has what-if outcomes

            //Run grade calculation with modified outcomes object
            var results = dtechGradeCalc.run(course.assignments, course.gradeCalculation.dtech.formula, course.gradeCalculation.dtech.whatIfOutcomes);

            //Update whatIfOutcomes object with new scores
            course.gradeCalculation.dtech.whatIfOutcomes = results.outcomes;

            //Update what-if results card with the grade calculation results
            $("#gradeSummary .block.letterGrade h2.main").html(results.results.letter);
            $("#gradeSummary .block.number75 h2.main").html(results.results.parameters.number75.toFixed(2));
            $("#gradeSummary .block.lowestScore h2.main").html(results.results.parameters.lowestScore.toFixed(2));
            $("#classGradeMore .table tr").removeClass("active");
            $("#classGradeMore .table tr.letter" + results.results.letter).addClass("active");

            //Remove dropped state
            $(".card.outcomeResults .dropped").removeClass("dropped");

            Object.keys(course.gradeCalculation.dtech.whatIfOutcomes).forEach(outcomeID => {
                var outcome = course.gradeCalculation.dtech.whatIfOutcomes[outcomeID];

                //Update outcome average
                if (outcome.average !== undefined) {
                    $("#outcomeScore" + outcomeID).html(outcome.average.toFixed(2));
                    $("#outcomeScore" + outcomeID).css("color", dtechRubricColor(outcome.average));
                }

                //Add dropped state if the score is dropped
                if (outcome.droppedScore !== undefined) {
                    $("#outcome" + outcomeID + "assessment" + outcome.droppedScore).addClass("dropped");
                }
            })
        }
    }

    //Adds a new score to an outcome
    var addWhatIf = function (course, outcomeID) {
        //Prepare what-if grades if it's not already prepared
        initWhatIf(course);

        //Get new assessment index
        var aIndex = course.gradeCalculation.dtech.whatIfOutcomes[outcomeID].scores.length;

        //Add new assessment to the outcome
        course.gradeCalculation.dtech.whatIfOutcomes[outcomeID].scores.push({ //most of the stuff in this object is optional but I'm adding it anyways
            id: "whatIf" + aIndex, //if changing this, update the id for the rendered what-if grade assessment as well
            score: null,
            value: 4,
            whatIfGrade: true,
            outcome: outcomeID,
            color: "var(--secText)",
            assignmentTitle: "What-If Grade",
            description: "A What-If grade",
            title: course.gradeCalculation.dtech.whatIfOutcomes[outcomeID].title,
            assignmentID: null
        });

        //Add a new What-If assessment to the UI
        $(".card.outcomeResults.outcome-" + outcomeID + " .assessments").append(/*html*/`
            <div class="assessmentWrapper" id="outcome${outcomeID}assessment${aIndex}" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin: 6px 0px;">
                <div style="color: var(--secText);" aIndex="${aIndex}" outcomeID="${outcomeID}" class="editableScore modified whatIf" contenteditable></div>
                <span class="assessmentTitle">What-If Grade</span>
            </div>
        `);

        //Add an event listener for the new score
        listenForWhatIf($(`#outcome${outcomeID}assessment${aIndex} .editableScore`)[0], course);
    }
});
