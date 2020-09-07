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
var baseURL = document.currentScript.src.split('/')[0] + '//' + document.currentScript.src.split('/')[2];

//Load Canvas integration
jQuery.getScript(baseURL + "/scripts/lms/canvas.js", function () {

    //Add d.tech-specific items to dtpsLMS
    dtpsLMS.name = "d.tech";
    dtpsLMS.legalName = "Canvas LMS, Design Tech High School, and Instructure Inc";
    dtpsLMS.description = "Power+ integration for Canvas LMS, customized for d.tech";
    dtpsLMS.logo = "https://i.imgur.com/efGrLq3.png";
    dtpsLMS.source = "https://github.com/jottocraft/dtps/blob/master/scripts/lms/dtech.js";
    dtpsLMS.useRubricGrades = true;
    dtpsLMS.institutionSpecific = true;
    dtpsLMS.genericGradebook = false;

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

                        if (rubricItem.score) {
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
            var promises = [];

            //Create a new promise for each class
            classes.forEach(course => {
                if (course.homepage) {
                    promises.push(new Promise((resolve, reject) => {
                        dtpsLMS.fetchHomepage(course.id).then(homepage => {
                            //get zoom link
                            var matches = 0;
                            for (var i = 0; i < $(homepage).find("a").length; i++) {
                                var link = $($(homepage).find("a")[i]);
                                if (link.attr("alt") && link.attr("alt").toUpperCase().includes("ZOOM BUTTON") && link.attr("href")) {
                                    //Button labelled as zoom button
                                    course.videoMeetingURL = link.attr("href");
                                } else if (link.attr("href") && link.attr("href").includes("zoom.us")) {
                                    //Button link goes to a zoom meeting
                                    course.videoMeetingURL = link.attr("href");
                                }
                            }

                            if (matches > 1) {
                                //Multiple zoom links found
                                course.videoMeetingURL = null;
                            }

                            resolve();
                        })
                    }))
                }
            })

            //Run all promises
            Promise.all(promises).then(() => {
                resolve(classes);
            })
        });
    }

    //Run d.tech grade calculation algorithm (defined below)
    dtpsLMS.calculateGrade = function (course, assignments) {
        var formula = null;

        //Get d.tech grade calculation formula
        if (course.term == "20-21") {
            formula = "2020s1";
        } else if (course.id == "630") {
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
        if (score >= 4) return "#4f9e59";
        if (score >= 3) return "#a1b553";
        if (score >= 2) return "#c26d44";
        if (score >= 1) return "#c4474e";
        if (score >= 0) return "#bd3139";
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
                                if (rubricItem.score && rubricItem.outcome) {
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
                    //Get array of scores for the outcome
                    var outcomeScores = outcome.scores.map(RubricItem => RubricItem.score);

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
                        outcome.droppedScore = outcomeScores.indexOf(lowestScore);
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
                    <div style="--classColor: ${course.color}" class="card">

                        <h3 class="gradeTitle">
                            Grades

                            <div class="classGradeCircle">
                                <div class="letter">${course.letter}</div>
                            </div>

                        </h3>

                        <h5 class="gradeStat">
                            75% (rounded down) of outcome scores are ≥
                            <div class="numFont">${course.gradeCalculation.dtech.results.parameters.number75.toFixed(1)}</div>
                        </h5>

                        <h5 class="gradeStat">
                            No outcome scores are lower than
                            <div class="numFont">${course.gradeCalculation.dtech.results.parameters.lowestScore.toFixed(1)}</div>
                        </h5>

                        <div style="${dtps.gradebookExpanded ? "" : "display: none;"}" id="classGradeMore">
                            <br />

                            ${course.previousLetter ? /*html*/`
                            <h5 class="smallStat">
                                Previous Grade
                                <div class="numFont">${course.previousLetter}</div>
                            </h5>
                            ` : ``}

                            ${course.gradeCalculation.dtech.results.parameters.number75thresh ? /*html*/`
                            <h5 class="smallStat">
                                75% of outcomes (rounded down) is
                                <div class="numFont">${course.gradeCalculation.dtech.results.parameters.number75thresh}</div>
                            </h5>
                            ` : ``}
                        
                            <br />

                            <table class="u-full-width dtpsTable">
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
                                            <tr ${course.letter == letter ? `style="background-color: var(--classColor); color: white; font-size:20px; font-weight: bold;"` : ``}>
                                                <td>&nbsp;&nbsp;${letter}</td>
                                                <td>${dtechGradeCalc.params[course.gradeCalculation.dtech.formula].percentage[letter]}</td>
                                                <td>${dtechGradeCalc.params[course.gradeCalculation.dtech.formula].lowest[letter]}</td>
                                            </tr>
                                        `
                    }).join("")}
                                </tbody>
                            </table>
                        </div>

                        <br />

                        <br />
                        <a onclick="$('#classGradeMore').toggle(); if ($('#classGradeMore').is(':visible')) {$(this).html('Show less'); dtps.gradebookExpanded = true;} else {$(this).html('Show more'); dtps.gradebookExpanded = false;}"
                            style="color: var(--secText, gray); cursor: pointer; margin-right: 10px;">${dtps.gradebookExpanded ? "Show less" : "Show more"}</a>
                        <a href="https://docs.google.com/document/d/1g4-aYZ_BS5_I4Ie64WGCwXeArl1K_pHbBbebDHra_sM/edit" style="color: var(--secText, gray);">Using 2020-21 grade calculation</a>
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
                            <div id="outcomeScore${outcomeID}" style="position: absolute; top: 20px; right: 20px; font-size: 26px; font-weight: bold; display: inline-block; color: ${dtechRubricColor(outcome.average)}">${outcome.average.toFixed(2)}</div>
                        ` : ``}
                        
                        <div class="assessments">
                            ${outcome.scores.length == 0 ? `
                                    <p style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin: 6px 0px; color: var(--secText);">This outcome has not been assessed yet</p>
                            ` :
                            outcome.scores.map((assessment, aIndex) => {
                                return /*html*/`
                                        <p id="outcome${assessment.outcome}assessment${aIndex}" class="${aIndex == outcome.droppedScore ? "dropped" : ""}" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin: 6px 0px;">
                                            <span aIndex="${aIndex}" outcomeID="${outcomeID}"
                                                style="outline: none;margin-right: 5px; font-size: 20px; vertical-align: middle; color: ${assessment.color}" class="editableScore" contenteditable>${assessment.score}</span>
                                            <span class="assessmentTitle" style="cursor: pointer;" onclick="dtps.assignment('${assessment.assignmentID}', ${course.num});">${assessment.assignmentTitle}</span>
                                        </p>
                                    `;
                            }).join("")
                        }
                        </div>

                        <p class="addWhatIf" outcomeID="${outcomeID}" style="font-size: 14px; color: var(--secText); margin: 0px; margin-top: 16px; cursor: pointer;">
                            <i style="cursor: pointer; vertical-align: middle; font-size: 16px;" class="material-icons down">add_box</i>
                            Add a What-If grade
                        </p>
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
    dtpsLMS.gradebookDidRender = function (course) {
        //Add event listeners for every editable score in the gradebook
        $(".card.outcomeResults .assessments .editableScore").toArray().forEach(ele => {
            listenForWhatIf(ele, course);
        });

        //Add event listeners for the "Add a What-If grade" buttons
        $("p.addWhatIf").click(function () {
            addWhatIf(course, $(this).attr("outcomeID"));
        })
    }

    //Adds a What-If grade listener to the provided element
    var listenForWhatIf = function (ele, course) {
        ele.addEventListener("input", function () {
            //Prepare what-if grades if it's not already prepared
            initWhatIf(course);

            //Get new outcome score
            var typedScore = Number($(ele).text());

            //Check if score is valid
            if ($(ele).text() && ($(ele).text().length < 4) && !isNaN(typedScore) && (typedScore >= 1) && (typedScore <= 4)) {
                //Valid outcome score, update color to match
                $(ele).css("color", dtechRubricColor(typedScore))

                //Update score in the what-if outcomes
                course.gradeCalculation.dtech.whatIfOutcomes[Number($(ele).attr("outcomeID"))].scores[Number($(ele).attr("aIndex"))].score = typedScore;

                //Calculate what-if grade
                calcWhatIf(course);
            } else {
                //Invalid outcome score, gray out and reset what-if letter
                $(ele).css("color", "var(--secText)");
                $("#outcomeScore" + Number($(ele).attr("outcomeID"))).html("--");
                $("#outcomeScore" + Number($(ele).attr("outcomeID"))).css("color", "var(--secText)");
                $(".card#whatIfResults .resultLetter").html("--");
                $(".card#whatIfResults .resultLetter").css("color", "var(--secText)");
            }

        }, false);
    }

    //Copies outcomes for modification, shows what-if UI
    var initWhatIf = function (course) {
        if (!$(".card#whatIfResults").is(":visible")) {
            //Initialize what-if grades

            //Copy outcomes for modification
            course.gradeCalculation.dtech.whatIfOutcomes = JSON.parse(JSON.stringify(course.gradeCalculation.dtech.outcomes));

            //Show what-if card, reset state
            $(".card#whatIfResults").show();
            $(".card#whatIfResults .resultLetter").html("--");
            $(".card#whatIfResults .resultLetter").css("color", "var(--secText)");
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
            $(".card#whatIfResults .resultLetter").html(results.results.letter);
            if (results.results.percentage) {
                $(".card#whatIfResults .resultPercentage").html("Percentage: " + Number(results.results.percentage).toFixed(2) + "%");
            } else {
                $(".card#whatIfResults .resultPercentage").html("");
            }
            $(".card#whatIfResults .resultLetter").css("color", "var(--classColor)");

            //Remove dropped state
            $(".card.outcomeResults .dropped").removeClass("dropped");

            Object.keys(course.gradeCalculation.dtech.whatIfOutcomes).forEach(outcomeID => {
                var outcome = course.gradeCalculation.dtech.whatIfOutcomes[outcomeID];

                //Update outcome average
                if (outcome.average) {
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
            score: "--",
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
            <p id="outcome${outcomeID}assessment${aIndex}" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin: 6px 0px;">
                <span aIndex="${aIndex}" outcomeID="${outcomeID}"
                      style="outline: none;margin-right: 5px; font-size: 20px; vertical-align: middle; color: var(--secText);" class="editableScore" contenteditable>-</span>
                <span class="assessmentTitle">What-If Grade</span>
            </p>
        `);

        //Reset what-if results card
        $(".card#whatIfResults .resultLetter").html("--");
        $(".card#whatIfResults .resultLetter").css("color", "var(--secText)");

        //Add an event listener for the new score
        listenForWhatIf($(`#outcome${outcomeID}assessment${aIndex} .editableScore`)[0], course);
    }
});