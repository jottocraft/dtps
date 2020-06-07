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
    dtpsLMS.source = "https://github.com/jottocraft/dtps/tree/master/lms";
    dtpsLMS.preferRubricGrades = true;
    dtpsLMS.institutionSpecific = true;
    dtpsLMS.genericGradebook = false;

    //Update assignments
    //This is for customizing rubric names and colors to match d.tech CBL
    dtpsLMS.updateAssignments = function (rawAssignments) {
        return rawAssignments.map(assignment => {
            //Check if assignment has rubric
            if (assignment.rubric) {
                //Update assignment rubric
                assignment.rubric.forEach(rubricItem => {
                    rubricItem.scoreName = shortenDtechRubricScoreName(rubricItem.scoreName);

                    if (rubricItem.score) {
                        rubricItem.color = dtechRubricColor(rubricItem.score / rubricItem.value);
                    }
                });
            }

            //Return updated assignment to the Array.map function
            return assignment;
        })
    }

    //Run d.tech grade calculation algorithm (defined below)
    dtpsLMS.calculateGrade = function (course, assignments) {
        //Get d.tech grade calculation formula
        var formula = "sem2";

        //Run d.tech grade calculation
        var dtechResults = dtechGradeCalc.run(assignments, formula);

        if (dtechResults) {
            //Class has a grade
            return {
                letter: dtechResults.results.letter,
                grade: 98,
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
    var dtechRubricColor = function (percentage) {
        if (percentage >= 1) return "#4f9e59";
        if (percentage >= .75) return "#a1b553";
        if (percentage >= .5) return "#c26d44";
        if (percentage >= .25) return "#c4474e";
        if (percentage >= 0) return "#bd3139";
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
             * @description Semester 2 grade calculation parameters
             * @property {{string, number}} percentage Percentage criteria parameters. The key of each item in the object is the letter and the value is the percentage needed to meet the criteria
             * @property {{string, number}} lowest Lowest average criteria perameters. The key of each item in the object is the letter and the value is the lowest average needed to meet the criteria
             */
            sem2: {
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
         * @param {string} [formula] Formula to use for grade calculation. Can be one of the following: sem2. Default: sem2.
         * @return {object} Grade calculation results
         */
        run: function (assignments, formula = "sem2") {

            //Array of grade variations
            var gradeVariations = [];

            //Outcomes object
            //This doesn't have to be used by the grade calculation formula, but it's defined here so it can be returned
            var outcomes = {};

            if (formula == "sem2") {
                //SEMESTER 2 OUTCOME AVERAGE FORMULA (sem2)

                // ------- [sem2] Step 1: Get rubric assessments by outcome -------

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
                            }
                        });
                    }
                });

                // ------- [sem2] Step 2: Calculate outcome averages -------

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
                        outcome.droppedScore = lowestScore;
                        outcome.average = droppedAverage;
                    } else {
                        //Calculating with all outcome scores was the same or higher
                        outcome.scoreType = "all";
                        outcome.average = average;
                    }
                });


                // ------- [sem2] Step 3: Calculate letter grade variations -------

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

            if (formula == "sem2") {
                //SEMESTER 2 LETTER GRADE FORMULA (sem2)

                //Array of letters from each criteria
                var letters = [];

                // ------- [sem2] Step 1: Get highest letter for Criteria 1 (percentage of outcomes criteria) -------
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

                // ------- [sem2] Step 2: Get highest letter for Criteria 2 (lowest outcome criteria) -------

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
    }
});