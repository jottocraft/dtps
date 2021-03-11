/**
 * @file DTPS Demo LMS
 * @author jottocraft
 * 
 * @copyright Copyright (c) 2018-2021 jottocraft. All rights reserved.
 * @license GPL-2.0-only
 * 
 * This LMS script is for demonstrating Power+ and doesn't fetch actual data
 * JSDoc documentation for these LMS functions can be found near the end of core.js
 */

//DTPS LMS configuration
var dtpsLMS = {
    name: "Demo LMS",
    shortName: "Demo",
    description: "All content in this LMS is not real and is for demonstration purposes only",
    url: "https://powerplus.app",
    logo: "https://powerplus.app/logo.png",
    source: "https://github.com/jottocraft/dtps/blob/main/scripts/lms/demo.js",
    genericGradebook: false,
    useRubricGrades: true,
    isDemoLMS: true
};

//Return sample user data
dtpsLMS.fetchUser = function () {
    return new Promise(function (resolve, reject) {
        resolve({
            name: "Demo User",
            id: "1",
            photoURL: "https://powerplus.app/logo.png"
        });
    })
}

//Fetch class data from Canvas
dtpsLMS.fetchClasses = function (userID) {
    return new Promise(function (resolve, reject) {
        var baseClass = {
            description: `<p>This class is for demonstration purposes only and is not a real class</p>`,
            homepage: true,
            numStudents: 1337,
            modules: true,
            discussions: true,
            pages: true,
            teacher: {
                name: "Demo Teacher",
                id: "2",
                photoURL: "https://powerplus.app/logo.png"
            }
        };

        resolve([
            {
                ...baseClass,
                name: "Advisory",
                icon: "school",
                id: "1",
                lmsID: "1",
                subject: "Advisory",
                color: "red"
            },
            {
                ...baseClass,
                name: "Physics",
                id: "2",
                lmsID: "2",
                subject: "Physics",
                color: "green",
                letter: "A",
                group: "Semester 1"
            },
            {
                ...baseClass,
                name: "English",
                id: "3",
                lmsID: "3",
                subject: "English",
                color: "blue",
                letter: "A",
                group: "Semester 1"
            },
            {
                ...baseClass,
                name: "History",
                id: "4",
                lmsID: "4",
                subject: "History",
                color: "orange",
                letter: "P",
                group: "Semester 1"
            },
            {
                ...baseClass,
                name: "Physics",
                icon: "science",
                id: "5",
                lmsID: "5",
                subject: "Physics",
                color: "green",
                group: "Semester 2"
            },
            {
                ...baseClass,
                name: "English",
                icon: "description",
                id: "6",
                lmsID: "6",
                subject: "English",
                color: "blue",
                grade: 98,
                group: "Semester 2"
            },
            {
                ...baseClass,
                name: "History",
                icon: "history_edu",
                id: "7",
                lmsID: "7",
                subject: "History",
                color: "orange",
                letter: "A",
                previousLetter: "B+",
                group: "Semester 2"
            }
        ]);
    })
}

function generateAssignmentName() {
    var assignmentName = [];

    assignmentName.push(["Unit 1", "Unit 2", "Unit 3", "Final", "Mid-Semester", "Pre", "Honors", "Extra Credit"].random());
    assignmentName.push(["Exam", "Discussion Post", "Homework", "Assignment", "Project", "Research Project", "Check-In", "Quiz", "Test", "Survey", "Reading", "Essay", "Lab"].random());

    return assignmentName.join(" ");
}

//Fetches assignment data from Canvas
dtpsLMS.fetchAssignments = function (userID, classID) {
    return new Promise(function (resolve, reject) {
        var assignments = [];
        if (Number(classID) < 5) return resolve([]);

        Array.prototype.random = function () {
            return this[Math.floor((Math.random() * this.length))];
        };

        for (var i = 0; i < 20; i++) {
            //Get random assignment due date
            var assignmentDate = new Date(new Date().getTime() + (Math.floor(Math.random() * 5.256e+9) - 2.628e+9));

            assignmentDate.setHours(23);
            assignmentDate.setMinutes(59);

            assignments.push({
                title: generateAssignmentName(),
                id: Math.floor(Math.random() * 10000),
                body: "<p>This assignment is for demonstration purposes only</p>",
                dueAt: assignmentDate,
                turnedIn: assignmentDate > new Date().getTime() ? Math.random() < 0.5 : false,
                locked: assignmentDate < new Date().getTime() ? Math.random() < 0.5 : false,
                value: Math.floor(Math.random() * 100),
                publishedAt: new Date().getTime() - 100000000,
                rubric: [
                    {
                        title: "Skills Assessment",
                        id: "1",
                        value: 4,
                        description: "This outcome is for demonstration purposes only"
                    },
                    {
                        title: "Writing Skills",
                        id: "2",
                        value: 4,
                        description: "This outcome is for demonstration purposes only"
                    },
                    {
                        title: "Research Skills",
                        id: "3",
                        value: 4,
                        description: "This outcome is for demonstration purposes only"
                    },
                    {
                        title: "Thinking Skills",
                        id: "3",
                        value: 4,
                        description: "This outcome is for demonstration purposes only"
                    }
                ]
            })
        }

        resolve(assignments);
    })
}

//Fetches modules data from Canvas
dtpsLMS.fetchModules = function (userID, classID) {
    return new Promise(function (resolve, reject) {
        resolve([
            {
                title: "Demo module",
                id: "1",
                items: [
                    {
                        type: "url",
                        title: "google.com",
                        url: "https://www.google.com"
                    },
                    {
                        type: "page",
                        title: "Demo Page",
                        id: "1"
                    },
                    {
                        type: "discussion",
                        title: "Demo Discussion",
                        id: "1"
                    },
                    {
                        type: "assignment",
                        title: "Demo Assignment 1",
                        id: "191"
                    },
                    {
                        type: "assignment",
                        title: "Demo Assignment 2",
                        id: "192"
                    }
                ]
            }
        ]);
    });
}

//Fetches announcement data from Canvas
dtpsLMS.fetchAnnouncements = function (classID) {
    return new Promise(function (resolve, reject) {
        resolve([{
            title: "Assignments Graded",
            postedAt: new Date().getDate(),
            body: "<p>Hello,</p><p>The assignments have finally been graded. Sorry about the delay. There is a test coming up on Tuesday, so make sure you study for it since it will be really hard and you will probably fail.</p><br /><br /><br /><br /><p>This is a demo announcement</p>"
        }]);
    });
}

//Fetches homepage data from Canvas
dtpsLMS.fetchHomepage = function (classID) {
    return new Promise(function (resolve, reject) {
        resolve(`<p>This homepage is for demonstration purposes only</p>`);
    });
}

//Fetches discussion thread data from Canvas
dtpsLMS.fetchDiscussionThreads = function (classID) {
    return new Promise(function (resolve, reject) {
        resolve([
            {
                title: "Demo Discussion",
                id: "1",
                locked: true
            }
        ])
    })
}

//Fetches discussion thread posts from Canvas
dtpsLMS.fetchDiscussionPosts = function (classID, threadID) {
    return new Promise(function (resolve, reject) {
        resolve({
            title: "Demo Discussion",
            id: "1",
            locked: true,
            requireInitialPost: false,
            posts: [
                {
                    id: "1",
                    body: `<p>This discussion is for demonstration purposes only</p>`,
                    postedAt: new Date(),
                    author: {
                        name: "Demo Teacher",
                        id: "2",
                        photoURL: "https://powerplus.app/logo.png"
                    }
                }
            ]
        })
    })
}

//Fetches pages list data from Canvas
dtpsLMS.fetchPages = function (classID) {
    return new Promise(function (resolve, reject) {
        resolve([
            {
                title: "Demo Page",
                id: "1"
            }
        ])
    })
}

//Fetches pages list data from Canvas
dtpsLMS.fetchPageContent = function (classID, pageID) {
    return new Promise(function (resolve, reject) {
        resolve({
            title: "Demo Page",
            id: "1",
            updatedAt: new Date(),
            content: `<p>This page is for demonstration purposes only</p>`,
            author: {
                name: "Demo Teacher",
                id: "2",
                photoURL: "https://powerplus.app/logo.png"
            }
        });
    })
}

dtpsLMS.gradebook = function (course) {
    return new Promise((resolve, reject) => {
        //RENDERER: RENDER GRADE CALCULATION SUMMARY ------------------------------------
        var gradeCalcSummary = /*html*/`
                <div id="gradeSummary" style="--size: 250px; margin: 0px 20px; --classColor: ${course.color};" class="grid flex">
                  <div style="background-color: var(--classColor); color: white;" class="block status letterGrade card">
                    <h2 class="main">${course.letter}</h2>
                    ${course.previousLetter ? `<h5 class="previousGrade">Previous grade: ${course.previousLetter}</h5>` : ""}
                    <h5 class="bottom"><i class="fluid-icon">grade</i> Grade</h5>
                  </div>
                  <div class="block status number75">
                    <h2 class="main numFont">3.7</h2>
                    <h5 class="bottom"><i class="fluid-icon">functions</i> 75% of outcomes (5) ≥</h5>
                  </div>
                  <div class="block status lowestScore">
                    <h2 class="main numFont">3.5</h2>
                    <h5 class="bottom"><i class="fluid-icon">leaderboard</i> Lowest outcome</h5>
                  </div>
                </div>

                <div class="gradeSummaryShowHide">
                    ${dtps.gradebookExpanded ? `<i class="fluid-icon">keyboard_arrow_up</i> <span>Show less</span>` : `<i class="fluid-icon">keyboard_arrow_down</i> <span>Show more</span>`}
                </div>
            `;

        var rubricColor = function (score) {
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

        //RENDERER: RENDER EACH OUTCOME ------------------------------------
        var outcomeHTML = []; //array of outcome html to be rendered
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].forEach(() => {
            var avg = 3 + Math.random();
            outcomeHTML.push(/*html*/`
                <div style="border-radius: 20px;padding: 22px; padding-bottom: 20px;" class="card outcomeResults">
                    <h5 style="max-width: calc(100% - 50px); font-size: 24px; margin: 0px; margin-bottom: 20px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; cursor: pointer;">${["Learning Skills", "Critical Thinking", "Reading Skills", "Research Skills", "Writing Skills", "Collaborative Skills"].random()}</h5>

                    <div class="numFont" style="position: absolute; top: 20px; right: 20px; font-size: 26px; font-weight: bold; display: inline-block; color: ${rubricColor(avg)}">${avg.toFixed(2)}</div>
                    
                    <div class="assessments">
                        ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(() => {
                var score = [3, 3.5, 4, 4, 4, 4].random();
                return /*html*/`
                                    <div class="assessmentWrapper" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin: 6px 0px;">
                                        <div style="color: ${rubricColor(score)};" class="editableScore">${score}</div>
                                        <span class="assessmentTitle" style="cursor: pointer;">${generateAssignmentName()}</span>
                                    </div>
                                `;
            }).join("")}
                    </div>
                </div>
            `);
        })

        //RESOLVE WITH HTML
        resolve(gradeCalcSummary + `<br />` + outcomeHTML.join(""));
    });
}

//scroll listener
var scrollListenerAdded = false;
dtpsLMS.gradebookDidRender = function (course) {
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


//Load Power+
jQuery.getScript(window.dtpsBaseURL + "/scripts/core.js");