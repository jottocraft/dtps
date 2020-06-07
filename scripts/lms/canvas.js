/**
 * @file DTPS Canvas LMS Integration
 * @author jottocraft
 * 
 * @copyright Copyright (c) 2018-2020 jottocraft. All rights reserved.
 * @license GPL-2.0-only
 * 
 * JSDoc documentation for these LMS functions can be found near the end of core.js
 */

//DTPS LMS configuration for Canvas
var dtpsLMS = {
    name: "Canvas LMS",
    shortName: "Canvas",
    legalName: "Canvas LMS and Instructure Inc.",
    description: "Power+ integration for Canvas LMS",
    url: "https://www.instructure.com/canvas/",
    logo: "https://i.imgur.com/rGjNVoc.png",
    source: "https://github.com/jottocraft/dtps/tree/master/lms"
};


/**
 * Common headers used for Canvas web requests.
 * This variable is specific to Canvas LMS integration in DTPS and is not required for other LMS integrations.
 */
dtpsLMS.commonHeaders = { Accept: "application/json+canvas-string-ids, application/json" };

//Fetch userdata from Canvas
dtpsLMS.fetchUser = function () {
    return new Promise(function (resolve, reject) {
        jQuery.ajax({
            url: "/api/v1/users/self",
            type: "GET",
            headers: dtpsLMS.commonHeaders,
            success: function (data) {
                resolve({
                    name: data.name,
                    id: data.id,
                    photoURL: data.avatar_url
                });
            },
            error: function (err) {
                reject(err);
            }
        });
    })
}

//Fetch class data from Canvas
dtpsLMS.fetchClasses = function () {
    return new Promise(function (resolve, reject) {
        jQuery.ajax({
            url: "/api/v1/users/self/colors",
            type: "GET",
            headers: dtpsLMS.commonHeaders,
            success: function (colorData) {
                jQuery.ajax({
                    url: "/api/v1/users/self/dashboard_positions",
                    type: "GET",
                    headers: dtpsLMS.commonHeaders,
                    success: function (dashboardData) {
                        jQuery.ajax({
                            url: "/api/v1/users/self/courses?per_page=100&enrollment_state=active&include[]=term&include[]=total_scores&include[]=public_description&include[]=total_students&include[]=account&include[]=teachers&include[]=course_image&include[]=syllabus_body&include[]=tabs",
                            type: "GET",
                            headers: dtpsLMS.commonHeaders,
                            success: function (courseData) {
                                //All fetches have been completed successfully

                                var courses = [];

                                //Add courses from canvas to courses array as a DTPS course object
                                courseData.forEach((course, index) => {
                                    var dtpsCourse = {
                                        name: course.course_code,
                                        id: course.id,
                                        num: index,
                                        subject: window.localStorage["pref-fullNames"] == "true" ? course.course_code : course.course_code.split(" - ")[0],
                                        syllabus: course.syllabus_body,
                                        description: course.public_description,
                                        numStudents: course.total_students,
                                        term: course.course_code.split(" - ")[1],
                                        color: colorData.custom_colors["course_" + course.id],
                                        grade: course.enrollments[0].computed_current_score,
                                        letter: course.enrollments[0].computed_current_grade,
                                        image: course.image_download_url,
                                        newDiscussionThreadURL: '/courses/' + course.id + '/discussion_topics/new',
                                        pages: course.tabs.map(tab => tab.id).includes("pages"),
                                        discussions: course.tabs.map(tab => tab.id).includes("discussions")
                                    };

                                    if (course.teachers[0]) {
                                        dtpsCourse.teacher = {
                                            name: course.teachers[0] && course.teachers[0].display_name,
                                            id: course.teachers[0] && course.teachers[0].id,
                                            photoURL: course.teachers[0] && course.teachers[0].avatar_image_url
                                        };
                                    }

                                    courses.push(dtpsCourse);
                                });

                                //Sort courses array
                                courses.sort(function (a, b) {
                                    var keyA = dashboardData.dashboard_positions["course_" + a.id],
                                        keyB = dashboardData.dashboard_positions["course_" + b.id];

                                    if (keyA < keyB) return -1;
                                    if (keyA > keyB) return 1;
                                    return 0;
                                });

                                resolve(courses);
                            },
                            error: function (err) {
                                reject(err);
                            }
                        });
                    },
                    error: function (err) {
                        reject(err);
                    }
                });
            },
            error: function (err) {
                reject(err);
            }
        });
    })
}

//Fetches assignment data from Canvas
dtpsLMS.fetchAssignments = function (classID) {
    return new Promise(function (resolve, reject) {
        jQuery.ajax({
            url: "/api/v1/courses/" + classID + "/students/submissions?include[]=rubric_assessment&include[]=submission_comments&per_page=100&student_ids[]=" + dtps.user.id,
            type: "GET",
            headers: dtpsLMS.commonHeaders,
            success: function (submissionData) {
                jQuery.ajax({
                    url: "/api/v1/courses/" + classID + "/assignment_groups?per_page=100&include[]=assignments&include[]=submissions&include[]=submission",
                    type: "GET",
                    headers: dtpsLMS.commonHeaders,
                    success: function (assignmentGroupData) {
                        //All fetches have been completed successfully
                        var assignments = [];

                        //Add assignments from canvas to assignments array as a DTPS assignment object
                        assignmentGroupData.forEach(group => {
                            group.assignments.forEach((assignment, index) => {
                                //Define dtpsAssignment
                                var dtpsAssignment = {
                                    title: assignment.name,
                                    body: assignment.description,
                                    id: assignment.id,
                                    dueAt: assignment.due_at,
                                    url: assignment.html_url,
                                    locked: assignment.locked_for_user,
                                    category: assignmentGroupData.length == 1 ? null : group.name,
                                    publishedAt: assignment.created_at,
                                    value: assignment.points_possible
                                };

                                //Save score names to an array temporarily
                                //This is because the scoreNames can only be found in the rubric data from Canvas
                                //And we don't know which name to use until the outcome score data is processed
                                var temporaryScoreNames = {};

                                //Add rubric data from Canvas to the dtpsAssignment
                                if (assignment.rubric) {
                                    assignment.rubric.forEach(canvasRubric => {
                                        //Add rubric array to assignment if it doesn't exist yet
                                        if (!dtpsAssignment.rubric) dtpsAssignment.rubric = [];

                                        dtpsAssignment.rubric.push({
                                            title: canvasRubric.description,
                                            description: canvasRubric.long_description,
                                            id: canvasRubric.id,
                                            value: canvasRubric.points,
                                            outcome: canvasRubric.outcome_id
                                        });

                                        temporaryScoreNames[canvasRubric.id] = {};
                                        canvasRubric.ratings.forEach(canvasRating => {
                                            temporaryScoreNames[canvasRubric.id][canvasRating.points] = canvasRating.description;
                                        });
                                    })
                                }

                                //Add submission data from Canvas to the dtpsAssignment
                                submissionData.forEach(submission => {
                                    if (submission.assignment_id == assignment.id) {
                                        //Add scores from this submission to the rubric
                                        if (submission.rubric_assessment) {
                                            dtpsAssignment.rubric.forEach(rubric => {
                                                if (submission.rubric_assessment[rubric.id]) {
                                                    rubric.score = submission.rubric_assessment[rubric.id].points;
                                                    rubric.scoreName = temporaryScoreNames[rubric.id][rubric.score];
                                                }
                                            });
                                        }

                                        //Check for turned in, late, missing, gradedAt, and feedback
                                        dtpsAssignment.turnedIn = submission.submission_type !== null;
                                        dtpsAssignment.late = submission.late;
                                        dtpsAssignment.missing = submission.missing;
                                        dtpsAssignment.gradedAt = submission.graded_at;
                                        dtpsAssignment.grade = submission.score;
                                        if (isNaN(submission.grade)) dtpsAssignment.letter = submission.grade; //letter cannot be a number

                                        //Check for submission comments
                                        if (submission.submission_comments) {
                                            //Add feedback array to assignment
                                            dtpsAssignment.feedback = [];

                                            //Add each comment to feedback array
                                            submission.submission_comments.forEach(comment => {
                                                var feedback = {
                                                    comment: comment.comment
                                                };

                                                //Add author to feedback if found
                                                if (comment.author) {
                                                    feedback.author = {
                                                        name: comment.author.display_name,
                                                        id: comment.author.id,
                                                        photoURL: comment.author.avatar_image_url
                                                    }
                                                }

                                                dtpsAssignment.feedback.push(feedback)
                                            });
                                        }
                                    }
                                });

                                //Add assignment to results array
                                assignments.push(dtpsAssignment);
                            });
                        });

                        resolve(assignments);
                    },
                    error: function (err) {
                        reject(err);
                    }
                });
            },
            error: function (err) {
                reject(err);
            }
        });
    })
}

//Fetches discussion thread data from Canvas
dtpsLMS.fetchDiscussionThreads = function (classID) {
    return new Promise(function (resolve, reject) {
        jQuery.ajax({
            url: "/api/v1/courses/" + classID + "/discussion_topics",
            type: "GET",
            headers: dtpsLMS.commonHeaders,
            success: function (data) {
                var dtpsDiscussionThreads = data.map(function (thread) {
                    return {
                        title: thread.title,
                        id: thread.id,
                        locked: thread.locked_for_user,
                        requireInitialPost: thread.require_initial_post
                    }
                });

                resolve(dtpsDiscussionThreads);
            },
            error: function (err) {
                reject(err);
            }
        });
    })
}

//Fetches discussion thread posts from Canvas
dtpsLMS.fetchDiscussionPosts = function (classID, threadID) {
    return new Promise(function (resolve, reject) {
        jQuery.ajax({
            url: "/api/v1/courses/" + classID + "/discussion_topics/" + threadID + "/",
            type: "GET",
            headers: dtpsLMS.commonHeaders,
            success: function (threadData) {
                //Check if this discussion is a group discussion
                if (threadData.group_topic_children && threadData.group_topic_children.length) {
                    //This discussion is probably a group discussion, check groups, then fetch posts
                    jQuery.ajax({
                        url: "/api/v1/courses/" + classID + "/groups?only_own_groups=true",
                        type: "GET",
                        headers: dtpsLMS.commonHeaders,
                        success: function (groupData) {
                            //Get array of group IDs
                            var myGroups = groupData.map(group => group.id);

                            //Set default group and discussion ID variables
                            var groupID = null;
                            var groupDiscussionID = null;

                            //Check every group this discussion has and see if one of them is in myGroups, set that group as the group to fetch posts for
                            threadData.group_topic_children.forEach(group => {
                                if (myGroups.includes(group.group_id)) {
                                    groupID = group.group_id;
                                    groupDiscussionID = group.id;
                                }
                            });

                            if (!groupID || !groupDiscussionID) {
                                //Couldn't find a group match, fetch class discussion
                                jQuery.ajax({
                                    url: "/api/v1/courses/" + classID + "/discussion_topics/" + threadID + "/view",
                                    type: "GET",
                                    headers: dtpsLMS.commonHeaders,
                                    success: function (responsesData) {
                                        parseResponse(responsesData, "/courses/" + classID + "/discussion_topics/" + threadID);
                                    },
                                    error: function (err) {
                                        reject(err);
                                    }
                                });
                            } else {
                                //Group match found, fetch group discussion
                                jQuery.ajax({
                                    url: "/api/v1/groups/" + groupID + "/discussion_topics/" + groupDiscussionID + "/view",
                                    type: "GET",
                                    headers: dtpsLMS.commonHeaders,
                                    success: function (responsesData) {
                                        parseResponse(responsesData, "/groups/" + groupID + "/discussion_topics/" + groupDiscussionID);
                                    },
                                    error: function (err) {
                                        reject(err);
                                    }
                                });
                            }
                        },
                        error: function (err) {
                            reject(err);
                        }
                    });
                } else {
                    //Not a group discussion, directly fetch posts
                    jQuery.ajax({
                        url: "/api/v1/courses/" + classID + "/discussion_topics/" + threadID + "/view",
                        type: "GET",
                        headers: dtpsLMS.commonHeaders,
                        success: function (responsesData) {
                            parseResponse(responsesData, "/courses/" + classID + "/discussion_topics/" + threadID);
                        },
                        error: function (err) {
                            reject(err);
                        }
                    });
                }
                

                //This function handles the response from Canavs and returns the data to DTPS
                //BaseURL is the baseURL of the thread, since this might be different for group discussions
                function parseResponse(responsesData, baseURL) {
                    //Define discussions post array
                    var dtpsDiscussionPosts = [];

                    //Define the initial post
                    var initialPost = {
                        id: threadID,
                        body: threadData.message,
                        postedAt: threadData.created_at,
                        replyURL: baseURL
                    };

                    //Check for author
                    if (threadData.author && threadData.author.display_name) {
                        initialPost.author = {
                            name: threadData.author.display_name,
                            id: threadData.author.id,
                            photoURL: threadData.author.avatar_image_url
                        };
                    }

                    //Add initial post to array
                    dtpsDiscussionPosts.push(initialPost);

                    if (responsesData.view) {
                        //Get thread author information
                        var people = {};
                        if (responsesData.participants) {
                            responsesData.participants.forEach(participant => {
                                people[participant.id] = participant;
                            })
                        }

                        //If there are posts found from the second request, add those as well
                        responsesData.view.forEach(function (post) {
                            if (!post.deleted) {
                                var replies = [];

                                //Get replies for this post
                                if (post.replies) {
                                    //If this post has replies, flatten them into a single array
                                    function addReplies(arr, depth) {
                                        //Loop over replies to add
                                        arr.forEach(reply => {
                                            //Add this reply to the array
                                            if (!reply.deleted) {
                                                //Define reply object
                                                var dtpsReply = {
                                                    id: reply.id,
                                                    body: reply.message,
                                                    postedAt: reply.created_at,
                                                    replyURL: baseURL + "/entry-" + reply.id,
                                                    depth: depth
                                                };

                                                //Check for reply author
                                                if (people[reply.user_id]) {
                                                    dtpsReply.author = {
                                                        name: people[reply.user_id].display_name,
                                                        id: reply.user_id,
                                                        photoURL: people[reply.user_id].avatar_image_url
                                                    }
                                                }

                                                //Add reply to flattened array
                                                replies.push(dtpsReply);
                                            }

                                            //Add nested replies to array
                                            if (reply.replies) addReplies(reply.replies, depth + 1);
                                        });
                                    }

                                    addReplies(post.replies, 0);
                                }

                                //Define post object
                                var dtpsPost = {
                                    id: post.id,
                                    body: post.message,
                                    postedAt: post.created_at,
                                    replies: replies,
                                    replyURL: baseURL + "/entry-" + post.id
                                };

                                //Check for post author
                                if (people[post.user_id]) {
                                    dtpsPost.author = {
                                        name: people[post.user_id].display_name,
                                        id: post.user_id,
                                        photoURL: people[post.user_id].avatar_image_url
                                    }
                                }

                                //Add post to array
                                dtpsDiscussionPosts.push(dtpsPost);
                            }
                        });
                    }

                    resolve(dtpsDiscussionPosts);
                }
            },
            error: function (err) {
                reject(err);
            }
        });
    })
}

//Fetches pages list data from Canvas
dtpsLMS.fetchPages = function (classID) {
    return new Promise(function (resolve, reject) {
        jQuery.ajax({
            url: "/api/v1/courses/" + classID + "/pages?per_page=100",
            type: "GET",
            headers: dtpsLMS.commonHeaders,
            success: function (data) {
                var dtpsPages = data.map(function (page) {
                    var dtpsPage = {
                        title: page.title,
                        id: page.page_id,
                        updatedAt: page.updated_at
                    };

                    //Check for page author
                    if (page.last_edited_by) {
                        dtpsPage.author = {
                            name: page.last_edited_by.display_name,
                            id: page.last_edited_by.id,
                            photoURL: page.last_edited_by.avatar_image_url
                        }
                    }

                    return dtpsPage;
                });

                resolve(dtpsPages);
            },
            error: function (err) {
                reject(err);
            }
        });
    })
}

//Fetches pages list data from Canvas
dtpsLMS.fetchPageContent = function (classID, pageID) {
    return new Promise(function (resolve, reject) {
        jQuery.ajax({
            url: "/api/v1/courses/" + classID + "/pages/" + pageID,
            type: "GET",
            headers: dtpsLMS.commonHeaders,
            success: function (data) {
                //Resolve with page content
                resolve(data.body);
            },
            error: function (err) {
                reject(err);
            }
        });
    })
}

//Get baseURL from the URL of this script
var baseURL = document.currentScript.src.split('/')[0] + '//' + document.currentScript.src.split('/')[2];

//Load Power+
jQuery.getScript(baseURL + "/scripts/core.js");