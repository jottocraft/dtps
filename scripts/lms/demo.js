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
    genericGradebook: true,
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
        resolve([{
            name: "Demo Class",
            id: "1",
            subject: "Demo Class",
            description: `<p>This class is for demonstration purposes only and is not a real class</p>`,
            homepage: true,
            numStudents: 1337,
            modules: true,
            discussions: true,
            pages: true,
            color: "#8800ff",
            grade: 81,
            letter: "B-",
            previousLetter: "A",
            image: "https://powerplus.app/wallpaper.png",
            teacher: {
                name: "Demo Teacher",
                id: "2",
                photoURL: "https://powerplus.app/logo.png"
            }
        }]);
    })
}

//Fetches assignment data from Canvas
dtpsLMS.fetchAssignments = function (userID, classID) {
    return new Promise(function (resolve, reject) {
        if (classID == "1") {
            resolve([
                {
                    title: "Demo assignment 1",
                    id: "191",
                    body: "<p>This assignment is for demonstration purposes only</p>",
                    dueAt: new Date().getTime() + 3000000,
                    turnedIn: true,
                    locked: false,
                    category: "Demo assignments",
                    value: 12,
                    publishedAt: new Date().getTime() - 100000000,
                    rubric: [
                        {
                            title: "Demo outcome 1",
                            id: "1",
                            value: 4,
                            description: "This outcome is for demonstration purposes only"
                        },
                        {
                            title: "Demo outcome 2",
                            id: "2",
                            value: 4,
                            description: "This outcome is for demonstration purposes only"
                        },
                        {
                            title: "Demo outcome 3",
                            id: "3",
                            value: 4,
                            description: "This outcome is for demonstration purposes only"
                        }
                    ]
                },
                {
                    title: "Demo assignment 2",
                    id: "192",
                    body: "<p>This assignment is for demonstration purposes only</p>",
                    dueAt: new Date().getTime() - 100000000,
                    turnedIn: true,
                    locked: true,
                    gradedAt: new Date(),
                    grade: 8,
                    value: 8,
                    letter: "A",
                    category: "Demo assignments",
                    publishedAt: new Date().getTime() - 1000000000,
                    rubric: [
                        {
                            title: "Demo outcome 1",
                            id: "1",
                            value: 4,
                            description: "This outcome is for demonstration purposes only",
                            score: 4,
                            scoreName: "Beyond Innovation++",
                            color: "#4f9e59"
                        },
                        {
                            title: "Demo outcome 2",
                            id: "2",
                            value: 4,
                            description: "This outcome is for demonstration purposes only",
                            score: 4,
                            scoreName: "Beyond Innovation++",
                            color: "#4f9e59"
                        }
                    ]
                },
                {
                    title: "Demo assignment 3",
                    id: "193",
                    body: "<p>This assignment is for demonstration purposes only</p>",
                    dueAt: new Date().getTime() - 100000000,
                    turnedIn: true,
                    late: true,
                    locked: true,
                    grade: 5,
                    gradedAt: new Date(),
                    value: 8,
                    letter: "B",
                    category: "Demo assignments",
                    publishedAt: new Date().getTime() - 1000000000,
                    rubric: [
                        {
                            title: "Demo outcome 1",
                            id: "1",
                            value: 4,
                            description: "This outcome is for demonstration purposes only",
                            score: 2,
                            scoreName: "Developing",
                            color: "#c26d44"
                        },
                        {
                            title: "Demo outcome 2",
                            id: "2",
                            value: 4,
                            description: "This outcome is for demonstration purposes only",
                            score: 3,
                            scoreName: "Proficient",
                            color: "#a1b553"
                        }
                    ]
                },
                {
                    title: "Demo assignment 4",
                    id: "194",
                    body: "<p>This assignment is for demonstration purposes only</p>",
                    dueAt: new Date().getTime() + 10000000,
                    value: 4,
                    category: "Demo assignments",
                    publishedAt: new Date().getTime() - 1000000000,
                    rubric: [
                        {
                            title: "Demo outcome 1",
                            id: "1",
                            value: 4,
                            description: "This outcome is for demonstration purposes only"
                        }
                    ]
                }
            ])
        }
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
            title: "Demo Announcement",
            postedAt: new Date().getDate(),
            body: "<p>This announcement is for demonstration purposes only</p>"
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

//Get baseURL from the URL of this script
var baseURL = document.currentScript.src.split("/scripts/lms/demo.js")[0];

//Load Power+
jQuery.getScript(baseURL + "/scripts/core.js");