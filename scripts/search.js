/**
 * @file DTPS global search
 * @author jottocraft
 * 
 * @copyright Copyright (c) 2018-2020 jottocraft. All rights reserved.
 * @license GPL-2.0-only
 */


/**
 * Searches Power+ globally and shows results on the "Search Results" screen
 * 
 * @param term {string} The search term typed in the input box
 */
dtps.globalSearch = function (term) {
    //Validate search and get search vars
    var type = $("#dtpsMainSearchBox").attr("data-search-type");
    var courseNum = $("#dtpsMainSearchBox").attr("data-dtps-course");
    var term = term ? decodeURI(term) : "";
    if (!type || !courseNum) {
        return fluid.screen("dashboard");
    }

    //Ensure classes are rendered in the sidebar
    dtps.presentClass("search");
    dtps.showClasses();
    dtps.selectedContent = "stream";

    //Clear active state from all tabs
    $("#dtpsTabBar .btn").removeClass("active");

    jQuery(".classContent").html([1, 2, 3, 4].map(() => (
        /*html*/`
            <div class="card assignment graded">
                <h4>
                    <span style="width: 450px;" class="shimmer">Assignment Title</span>
                    <div class="points shimmer">00/00</div>
                </h4>

                <h5 style="white-space: nowrap; overflow: hidden;">
                    <div style="width: 200px;" class="infoChip shimmer"></div>
                    <i class="material-icons statusIcon shimmer">more_horiz</i>
                </h5>
            </div>
        `
    )).join(""));

    //Fetch everything
    var dataset = [];
    var datasetPromises = [];

    (courseNum == "all" ? dtps.classes : [dtps.classes[Number(courseNum)]]).forEach(course => {
        if ((type == "assignments") || (type == "coursework") || (type == "everything")) {
            datasetPromises.push(new Promise((resolve, reject) => {
                if (!course.assignments) return resolve([]);
                resolve(course.assignments.map(assignment => ({
                    title: assignment.title,
                    class: course.num,
                    body: $('<div>' + assignment.body + '</div>').text(),
                    url: assignment.url,
                    locatedIn: assignment.category ? assignment.category : "Assignment",
                    icon: "assignment",
                    infoIcons: [
                        assignment.dueAt ? "alarm" : null
                    ].filter(i => i),
                    info: [
                        assignment.dueAt ? "Due: " + dtps.formatDate(assignment.dueAt) : null
                    ].filter(i => i).join("$|$"),
                    icons: [
                        {
                            icon: assignment.missing ? "remove_circle_outline" : null,
                            keywords: "missing"
                        },
                        {
                            icon: assignment.turnedIn ? "assignment_turned_in" : null,
                            keywords: "turned in submitted"
                        },
                        {
                            icon: assignment.locked ? "lock_outline" : null,
                            keywords: "locked"
                        },
                        {
                            icon: assignment.late ? "assignment_late" : null,
                            keywords: "late"
                        }
                    ].filter(i => i.icon)
                })));
            }));
        }

        if ((type == "modules") || (type == "coursework") || (type == "everything")) {
            datasetPromises.push(new Promise((resolve, reject) => {
                if (!course.modules) return resolve([]);
                new Promise(resolve => {
                    if (course.modules && (course.modules !== true)) {
                        resolve(course.modules);
                    } else {
                        dtpsLMS.fetchModules(dtps.user.id, course.lmsID).then(data => resolve(data));
                    }
                }).then(data => {
                    var res = [];
                    data.forEach(module => {
                        module.items.forEach(item => {
                            //Prevent assignments from showing twice in coursework search results
                            //(since assignments can appear in both assignments and modules tab)
                            if ((item.type == "assignment") && (type == "coursework")) return;

                            item.locatedIn = module.title;
                            res.push(item);
                        });
                    });

                    resolve(res.map(item => ({
                        title: item.title,
                        class: course.num,
                        url: item.url,
                        locatedIn: item.locatedIn,
                        icon: "view_module",
                        infoIcons: [
                            "category"
                        ].filter(i => i),
                        info: [
                            "Type: " + item.type
                        ].filter(i => i).join("$|$"),
                        icons: [
                            {
                                icon: item.completed ? "check" : null,
                                keywords: "completed done submitted"
                            }
                        ].filter(i => i.icon)
                    })));
                }).catch(() => resolve([]));
            }));
        }

        if ((type == "homepages") || (type == "everything")) {
            datasetPromises.push(new Promise((resolve, reject) => {
                if (!course.homepage) return resolve([]);
                dtpsLMS.fetchHomepage(course.lmsID).then(data => {
                    resolve([{
                        title: course.subject + " Homepage",
                        class: course.num,
                        locatedIn: course.subject,
                        icon: "home",
                        body: $('<div>' + data + '</div>').text(),
                        icons: []
                    }]);
                }).catch(() => resolve([]));
            }));
        }

        if ((type == "pages") || (type == "everything")) {
            datasetPromises.push(new Promise((resolve, reject) => {
                if (!course.pages) return resolve([]);
                dtpsLMS.fetchPages(course.lmsID).then(pages => {
                    Promise.all(pages.map(page => (
                        dtpsLMS.fetchPageContent(course.lmsID, page.id)
                    ))).then(pages => {
                        resolve(pages.map(page => ({
                            title: page.title,
                            class: course.num,
                            body: $('<div>' + page.content + '</div>').text(),
                            locatedIn: "Page",
                            icon: "insert_drive_file",
                            infoIcons: [
                                page.author && page.author.name ? "person" : null
                            ].filter(i => i),
                            info: [
                                page.author && page.author.name ? "Author: " + page.author && page.author.name : null
                            ].filter(i => i).join("$|$"),
                            icons: []
                        })));
                    })
                }).catch(() => resolve([]));
            }));
        }

        if ((type == "discussions") || (type == "everything")) {
            datasetPromises.push(new Promise((resolve, reject) => {
                if (!course.discussions) return resolve([]);
                dtpsLMS.fetchDiscussionThreads(course.lmsID).then(discussions => {
                    Promise.all(discussions.map(discussion => (
                        dtpsLMS.fetchDiscussionPosts(course.lmsID, discussion.id)
                    ))).then(discussions => {
                        var res = [];
                        discussions.forEach(discussion => {
                            discussion.posts.forEach(post => {
                                post.locatedIn = discussion.title;
                                res.push(post);

                                if (post.replies) {
                                    post.replies.forEach(reply => {
                                        reply.locatedIn = discussion.title;
                                        res.push(reply);
                                    });
                                }
                            })
                        });
                        resolve(res.map(post => ({
                            body: $('<div>' + post.body + '</div>').text(),
                            class: course.num,
                            url: post.replyURL,
                            locatedIn: post.locatedIn,
                            icon: "forum",
                            infoIcons: [
                                post.author && post.author.name ? "person" : null,
                                post.postedAt ? "calendar_today" : null
                            ].filter(i => i),
                            info: [
                                post.author && post.author.name ? "Author: " + post.author && post.author.name : null,
                                post.postedAt ? "Posted At: " + dtps.formatDate(post.postedAt) : null
                            ].filter(i => i).join("$|$"),
                            icons: []
                        })));
                    })
                }).catch(() => resolve([]));
            }));
        }

        if ((type == "people") || (type == "everything")) {
            datasetPromises.push(new Promise((resolve, reject) => {
                if (!course.people) return resolve([]);
                new Promise(resolve => {
                    if (course.people && (course.people !== true)) {
                        resolve(course.people);
                    } else {
                        dtpsLMS.fetchUsers(course.lmsID).then(data => resolve(data));
                    }
                }).then(data => {
                    var res = [];
                    data.forEach(section => {
                        section.users.forEach(user => {
                            user.locatedIn = section.title;
                            res.push(user);
                        });
                    });
                    resolve(res.map(person => ({
                        title: person.name,
                        class: course.num,
                        url: person.url,
                        locatedIn: person.locatedIn,
                        icon: "people",
                        icons: []
                    })));
                }).catch(() => resolve([]));
            }));
        }

        if ((type == "grades") || (type == "everything")) {
            datasetPromises.push(new Promise((resolve, reject) => {
                if (!course.assignments) return resolve([]);
                var res = [];

                course.assignments.forEach(assignment => {
                    if (dtpsLMS.useRubricGrades && assignment.rubric) {
                        assignment.rubric.forEach(rubric => {
                            if (rubric.score) {
                                res.push({
                                    title: assignment.title,
                                    class: course.num,
                                    url: assignment.url,
                                    locatedIn: rubric.title,
                                    icon: "assessment",
                                    infoIcons: [
                                        "bar_chart"
                                    ].filter(i => i),
                                    info: [
                                        "Score: " + rubric.score + "/" + rubric.value + (rubric.scoreName ? " " + rubric.scoreName : "")
                                    ].filter(i => i).join("$|$"),
                                    icons: []
                                });
                            }
                        });
                    } else if (assignment.grade) {
                        res.push({
                            title: assignment.title,
                            class: course.num,
                            url: assignment.url,
                            locatedIn: "Grade",
                            icon: "assessment",
                            infoIcons: [
                                "bar_chart"
                            ].filter(i => i),
                            info: [
                                "Score: " + assignment.grade + "/" + assignment.value + " (" + Math.round((assignment.grade / assignment.value) * 100) + "%" + (assignment.letter ? ", " + assignment.letter : "") + ")"
                            ].filter(i => i).join("$|$"),
                            icons: []
                        });
                    }
                });

                resolve(res);
            }));
        }

        if ((type == "announcements") || (type == "everything")) {
            datasetPromises.push(new Promise((resolve, reject) => {
                dtpsLMS.fetchAnnouncements(course.lmsID).then(announcements => {
                    resolve(announcements.map((announcement) => ({
                        title: announcement.title,
                        class: course.num,
                        locatedIn: course.subject,
                        icon: "announcement",
                        body: $('<div>' + announcement.body + '</div>').text(),
                        infoIcons: [
                            "calendar_today"
                        ].filter(i => i),
                        info: [
                            "Posted at: " + dtps.formatDate(announcement.postedAt)
                        ].filter(i => i).join("$|$"),
                        icons: []
                    })));
                }).catch(() => resolve([]));
            }));
        }
    });

    Promise.all(datasetPromises).then(results => {
        results.forEach(result => {
            dataset = dataset.concat(result);
        });

        var idx = lunr(function () {
            this.ref('id');
            this.field('title');
            this.field('body');
            this.field('locatedIn');
            this.field('info');
            this.metadataWhitelist = ['position'];

            dataset.forEach(function (doc, i) {
                this.add({
                    id: i,
                    ...doc
                });
            }, this)
        });

        var result = idx.search(term);

        console.log(dataset, term, result);

        $(".classContent").html(result.map(res => dtps.renderSearchResult(dataset[Number(res.ref)], res.matchData.metadata, courseNum == "all")));
    });
}

/**
 * Renders a Search data object into HTML for display in the search results list
 * 
 * @param {SearchData} result The search result to render
 * @param {Object[]} matchData The list of matches from Lunr
 * @param {boolean} [mixedClasses] True if there are results from multiple classes
 * @return {string} The HTML for this result in the results list
 */
dtps.renderSearchResult = function (result, matchData, mixedClasses) {
    var matches = {};
    var matchTerms = Object.values(matchData);
    matchTerms.forEach(term => {
        Object.keys(term).forEach(k => {
            if (matches[k]) {
                matches[k] = matches[k].concat(term[k].position);
            } else {
                matches[k] = term[k].position;
            }
        });
    });
    matches = Object.keys(matches).map(k => ({ key: k, position: matches[k] }));

    //A function that highlights a string
    function highlightString(string, position) {
        var parts = string.split("");
        position.forEach(pos => {
            //highlight part
            parts.forEach((part, i) => {
                if (i == pos[0]) {
                    parts[i] = '<span class="highlight">' + parts[i];
                }

                if (i == (pos[0] + pos[1] - 1)) {
                    parts[i] = parts[i] + '</span>';
                }
            });
        });

        return parts.join("");
    }

    //Highlight matches
    var bodyParts = [];
    var bodyOverflow = 0;
    matches.forEach(match => {
        if (match.key == "title") {
            result.title = highlightString(result.title, match.position);
        } else if (match.key == "locatedIn") {
            result.locatedIn = highlightString(result.locatedIn, match.position);
        } else if (match.key == "body") {
            //Get longest 2 matches
            var sections = match.position.sort((a, b) => b[1] - a[1]);
            var matchesToDisplay = 2;
            if (sections.length < matchesToDisplay) matchesToDisplay = sections.length;
            bodyOverflow = sections.length - matchesToDisplay;

            for (var i = 0; i < matchesToDisplay; i++) {
                var matchStartIndex = sections[i][0];
                var matchEndIndex = sections[i][0] + sections[i][1] - 1;

                var startIndex = matchStartIndex - 10;
                var endIndex = matchEndIndex + 10;

                if (startIndex < 0) startIndex = 0;
                if (endIndex > (result.body.length - 1)) endIndex = result.body.length - 1;

                var res = result.body.slice(startIndex, matchStartIndex) + '<span class="highlight">' + result.body.slice(matchStartIndex, matchEndIndex + 1) + '</span>' + result.body.slice(matchEndIndex + 1, endIndex + 1);
                bodyParts.push(res);
            }
        } else if (match.key == "info") {
            result.info = highlightString(result.info, match.position);
        }
    });

    //Map result info back into an array
    if (result.info) {
        result.info = result.info.split("$|$").map((info, i) => {
            return {
                icon: result.infoIcons[i],
                info: info,
            }
        });
    }

    return /*html*/`
        <div 
            class="card searchResult ${mixedClasses ? "mixedClasses" : ""}"
            style="${'--classColor: ' + dtps.classes[result.class].color}"
        >

            <!-- Color bar for the dashboard -->
            <div class="colorBar"></div>

            <!-- Assignment title and points -->
            ${result.title ? `<h4>${result.title}</h4>` : ""}

            <h5>
                <div class="infoChip"><i style="margin-top: -2px;" class="material-icons">${result.icon}</i> ${result.locatedIn}</div>
                ${result.info ? result.info.map(info => (
        `<div class="infoChip"><i style="margin-top: -2px;" class="material-icons">${info.icon}</i> ${info.info}</div>`
    )).join("") : ""}
            </h5>

            ${bodyParts.map(part => (
        `<p><span style="color: var(--secText);">...</span>${part}<span style="color: var(--secText);">...</span></p>`
    )).join("")}
            ${bodyOverflow ? `<p style="color: var(--secText);">+${bodyOverflow} more matches</p>` : ""}

            <h5>
                ${result.icons.map((icon, i) => (`<i class="material-icons statusIcon">${icon.icon}</i>`)).join("")}
            </h5>
        </div>
    `;
}

//Fluid UI screen definitions
fluid.externalScreens.search = (term) => {
    dtps.globalSearch(term);
}

/**
 * @typedef {Object} SearchData
 * @description An object that can represent any type of data to be searched.
 * @property {string} [title] Result title
 * @property {string} [body] Result body (can be HTML)
 * @property {string} [url] A URL for opening this result in the LMS
 * @property {string} locatedIn Describes where this result was found (as specific as possible)
 * @property {string} icon The icon to use for this result. Should match (and is displayed with) the locatedIn property.
 * @property {Object[]} [info] Contains any info (e.g. due dates) for this result. Has an icon property, label property, and info property.
 * @property {Object[]} icons Status icons for this result. Has an "icon" property, for the icon, and a "keywords" property for a string with all of the search keywords for the icon.
 * @property {number} class The number of the class that this result is from
 */