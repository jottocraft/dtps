/**
 * @file DTPS pages & discussion functions
 * @author jottocraft
 * 
 * @copyright Copyright (c) 2018-2020 jottocraft. All rights reserved.
 * @license GPL-2.0-only
 */


/**
 * Renders the discussions list for a class
 * 
 * @param {string} courseID The course ID to render discussion threads for
 * @param {string} [defaultThread] The thread to load by default
 */
dtps.loadThreadsList = function (courseID, defaultThread) {
    //Get class index and set as selected class
    var classNum = dtps.classes.map(course => course.id).indexOf(courseID);
    dtps.selectedClass = classNum;

    //Set discussions as the selected content
    dtps.selectedContent = "discuss";
    $("#dtpsTabBar .btn").removeClass("active");
    $("#dtpsTabBar .btn.discuss").addClass("active");

    if (classNum == -1) {
        //Class does not exist
        dtps.error("The selected class doesn't exist", "classNum check failed @ dtps.loadThreadsList");
    }

    //Load class color and things
    dtps.presentClass(classNum);
    jQuery("body").removeClass("collapsedSidebar");

    if ((dtps.selectedClass == classNum) && (dtps.selectedContent == "discuss")) {
        //Render sidebar
        jQuery(".sidebar").html(/*html*/`
            <div class="bigLogo" style="text-align: center; margin: 10px 0 20px; height: 38px;">
                <i style="font-size: 28px; margin-right: 7px; vertical-align: middle;" class="material-icons">forum</i>
                <h4 style="color: var(--text); display: inline-block; font-size: 28px; vertical-align: middle; margin: 0px;">Discussions</h4>
            </div>
                        
            <div class="items">
                <div class="spinner"></div>
            </div>
        `);

        //Delete existing class content HTML
        jQuery(".classContent").html("");
    }

    //Fetch discussion thread data
    dtpsLMS.fetchDiscussionThreads(dtps.classes[classNum].id).then(function (threadData) {
        //Store fetched data to the selected class
        dtps.classes[classNum].discussions = threadData;

        if (dtps.classes[classNum].discussions.length == 0) {
            //No discussion topics in this class
            jQuery(".sidebar .items").html(/*html*/`
                <div onclick="fluid.screen('stream', '${dtps.classes[classNum].id}');" class="class item main back">
                    <span class="label">Classes</span>
                    <div class="icon">
                        <i class="material-icons">keyboard_arrow_left</i>
                    </div>
                </div>

                <p style="text-align: center; font-weight: bold; margin-top: 60px;">No discussions found</p>
                <p style="text-align: center; font-size: 14px;">This class doesn't have any discussions</p>
            `);
        } else {
            //Loop over discusson threads array to create discussion thread HTML for the sidebar
            var discussionHTML = dtps.classes[classNum].discussions.map(discussionThread => {
                return /*html*/`
                    <div data-threadID="${discussionThread.id}" class="item">
                        <span class="label">${discussionThread.title}</span>
                        <div class="icon">
                            <i style="font-family: 'Material Icons Extended';" class="material-icons">${discussionThread.locked ? "lock_outline" : "chat_bubble_outline"}</i>
                        </div>
                    </div>
                `;
            }).join("");

            //Render discussion threads in the sidebar
            if ((dtps.selectedClass == classNum) && (dtps.selectedContent == "discuss")) {
                jQuery(".sidebar .items").html(/*html*/`
                    <div onclick="fluid.screen('stream', '${dtps.classes[classNum].id}');" class="class item main back">
                        <span class="label">Classes</span>
                        <div class="icon">
                            <i class="material-icons">keyboard_arrow_left</i>
                        </div>
                    </div>

                    ${
                    dtps.classes[classNum].newDiscussionThreadURL ? (/*html*/`
                            <div onclick="window.open('${dtps.classes[classNum].newDiscussionThreadURL}')" class="class item back">
                                <span class="label">New discussion</span>
                                <div class="icon">
                                    <i class="material-icons">add</i>
                                </div>
                            </div>
                        `) : ""
                    }

                    <div class="divider"></div>

                    ${discussionHTML}
                `);

                //Load default thread if provided
                if (defaultThread) {
                    dtps.loadThreadPosts(classNum, defaultThread);
                }

                //Add click event listeners for discussion threads
                $(".sidebar .item:not(.back)").click(function (event) {
                    //Show the selected thread as active
                    $(this).siblings().removeClass("active");
                    $(this).addClass("active");

                    //Get thread ID from HTML attribute
                    var postID = $(this).attr("data-threadID");

                    //Load the thread
                    dtps.loadThreadPosts(classNum, postID);
                });
            }
        }

    }).catch(function (err) {
        dtps.error("Couldn't fetch discussion threads", "Caught promise rejection @ dtps.loadThreadsList", err);
    });
}

/**
 * Fetches and displays posts in a discussion
 * 
 * @param {number} classNum The class number to render
 * @param {string} threadID The discussion thread to render
 */
dtps.loadThreadPosts = function (classNum, threadID) {
    //Show loading indicator
    if ((dtps.selectedClass == classNum) && (dtps.selectedContent == "discuss")) {
        jQuery(".classContent").html(`<div class="spinner"></div>`);
    }

    //Get discussion data
    var thread = null;
    dtps.classes[classNum].discussions.forEach(discussionThread => {
        if (discussionThread.id == threadID) {
            thread = discussionThread;
        }
    });

    if (!thread) {
        dtps.error("Thread does not exist", "thread is null @ dtps.loadThreadPosts");
        throw null;
    }

    //Fetch discussion posts from the LMS
    dtpsLMS.fetchDiscussionPosts(dtps.classes[classNum].id, threadID).then(function (postData) {
        //Store posts in the discussion thread
        thread.posts = postData;

        //Post HTML array
        var postHTML = [];

        thread.posts.forEach((post, index) => {
            //Get background and text color for iFrame content
            var computedBackgroundColor = getComputedStyle($(".card.details")[0]).getPropertyValue("--cards");
            var computedTextColor = getComputedStyle($(".card.details")[0]).getPropertyValue("--text");

            //Create a new blob data URL with the post's content
            var blob = new Blob([`
                    <base target="_blank" /> 
                    <link type="text/css" rel="stylesheet" href="https://cdn.jottocraft.com/CanvasCSS.css" media="screen,projection"/>
                    <style>body {background-color: ${computedBackgroundColor}; color: ${computedTextColor};</style>
                    ${post.body}
                `], { type: 'text/html' });
            var discussionPostContentURL = window.URL.createObjectURL(blob);

            //Create HTML for replies
            var replyHTML = [];
            if (post.replies) {
                //Add space above replies
                replyHTML.push(`<br />`);

                //Get HTML for each reply and add to array
                post.replies.forEach(reply => {
                    replyHTML.push(/*html*/`
                        <div style="margin-left: ${(reply.depth || 0) * 50}px;" class="discussionReply">
                            <div class="discussionHeader">
                                ${post.author ? /*html*/`
                                    <img src="${reply.author.photoURL}" />
                                    <h5>${reply.author.name}</h5>
                                ` : ``}
                                
                                <span style="cursor: pointer;" onclick="window.open('${reply.replyURL}')">
                                    <i class="material-icons">reply</i>
                                    <span>Reply</span>
                                </span>
                            </div>

                            ${reply.body}
                        </div>
                    `)
                });

                //Add space below replies
                replyHTML.push(`<br />`);
            }

            //Create HTML for this post
            //Note that index == 0 is the initial post
            postHTML.push(/*html*/`
                    <div class="card" style="margin-top: 20px;${index == 0 ? "margin-bottom: 75px;" : "padding: 20px 30px;"}">
                        <!-- Thread title (Initial post) -->
                        ${index == 0 ? /*html*/`
                            <h4 style="font-weight: bold">${thread.title}</h4>
                        ` : ''}

                        <!-- Author header -->
                        <div ${index == 0 ? `style="margin-bottom: 32px;"` : ""} class="discussionHeader">
                            ${post.author ? /*html*/`
                                <img src="${post.author.photoURL}" />
                                <h5>${post.author.name}</h5>
                            ` : ``}

                            <i class="material-icons">calendar_today</i>
                            <span>${dtps.formatDate(post.postedAt)}</span>

                            <!-- Thread info (initial post) -->
                            ${index == 0 ? /*html*/`
                                ${thread.locked ? `<i class="material-icons">lock</i>` : ""}
                                ${thread.requireInitialPost ? /*html*/`
                                    <i class="material-icons">visibility</i>
                                    <span>You must post before you can see other replies</span>
                                ` : ""}
                            ` : ''}
                        </div>
         
                        ${post.body}

                        ${replyHTML.join("")}

                        <!-- Reply / Add post footer -->
                        ${post.replyURL ? /*html*/`
                            <div ${index == 0 ? `style="margin-top: 32px;"` : ""} class="discussionFooter">
                                ${index == 0 ? /*html*/`
                                    <button onclick="window.open('${post.replyURL}')" class="btn small"><i class="material-icons">post_add</i> Add Post</button>
                                ` : /*html*/`
                                    <button onclick="window.open('${post.replyURL}')" class="btn small"><i class="material-icons">reply</i> Reply</button>
                                `}
                            </div> 
                        ` : ""}
                    </div>
                `);
        });

        //Render HTML
        if ((dtps.selectedClass == classNum) && (dtps.selectedContent == "discuss")) {
            jQuery(".classContent").html(postHTML.join(""));
        }
    }).catch(function (err) {
        dtps.error("Could not fetch discussion posts", "Caught promise rejection @ dtps.loadThreadPosts", err);
    });
}

/**
 * Renders the pages list for a class
 * 
 * @param {string} courseID The course ID to render pages for
 * @param {string} [defaultPage] If provided, load the pageID by default
 */
dtps.loadPagesList = function (courseID, defaultPage) {
    //Get class index and set as selected class
    var classNum = dtps.classes.map(course => course.id).indexOf(courseID);
    dtps.selectedClass = classNum;

    //Set pages as the selected content
    dtps.selectedContent = "pages";
    $("#dtpsTabBar .btn").removeClass("active");
    $("#dtpsTabBar .btn.pages").addClass("active");

    if (classNum == -1) {
        //Class does not exist
        dtps.error("The selected class doesn't exist", "classNum check failed @ dtps.loadPagesList");
    }

    //Load class color and things
    dtps.presentClass(classNum);
    jQuery("body").removeClass("collapsedSidebar");

    if ((dtps.selectedClass == classNum) && (dtps.selectedContent == "pages")) {
        //Render sidebar
        jQuery(".sidebar").html(/*html*/`
            <div class="bigLogo" style="text-align: center; margin: 10px 0 20px; height: 38px;">
                <i style="font-size: 28px; margin-right: 7px; vertical-align: middle;" class="material-icons">insert_drive_file</i>
                <h4 style="color: var(--text); display: inline-block; font-size: 28px; vertical-align: middle; margin: 0px;">Pages</h4>
            </div>
                        
            <div class="items">
                <div class="spinner"></div>
            </div>
        `);

        //Delete existing class content HTML
        jQuery(".classContent").html("");
    }

    dtpsLMS.fetchPages(dtps.classes[classNum].id).then(function (pagesData) {
        //Store fetched pages data to the class
        dtps.classes[classNum].pages = pagesData;

        if (pagesData.length == 0) {
            //No pages in this class
            jQuery(".sidebar .items").html(/*html*/`
                <div onclick="fluid.screen('stream', '${dtps.classes[classNum].id}');" class="class item main back">
                    <span class="label">Classes</span>
                    <div class="icon">
                        <i class="material-icons">keyboard_arrow_left</i>
                    </div>
                </div>

                <p style="text-align: center; font-weight: bold; margin-top: 60px;">No pages found</p>
                <p style="text-align: center; font-size: 14px;">This class doesn't have any pages</p>
            `);
        } else {
            //Loop over discusson threads array to create discussion thread HTML for the sidebar
            var pageHTML = dtps.classes[classNum].pages.map(page => {
                return /*html*/`
                    <div data-pageID="${page.id}" class="item ${(defaultPage && (page.id == defaultPage)) ? "active" : ""}">
                        <span class="label">${page.title}</span>
                        <div class="icon">
                            <i class="material-icons">insert_drive_file</i>
                        </div>
                    </div>
                `;
            }).join("");

            //Render discussion threads in the sidebar
            if ((dtps.selectedClass == classNum) && (dtps.selectedContent == "pages")) {
                jQuery(".sidebar .items").html(/*html*/`
                    <div onclick="fluid.screen('stream', '${dtps.classes[classNum].id}');" class="class item main back">
                        <span class="label">Classes</span>
                        <div class="icon">
                            <i class="material-icons">keyboard_arrow_left</i>
                        </div>
                    </div>

                    <div class="divider"></div>

                    ${pageHTML}
                `);
            }

            //Load default page if provided
            if (defaultPage) {
                dtps.loadPage(classNum, defaultPage);
            }

            //Add click event listeners for pages
            $(".sidebar .item:not(.back)").click(function (event) {
                //Show the selected thread as active
                $(this).siblings().removeClass("active");
                $(this).addClass("active");

                //Get page ID from HTML attribute
                var pageID = $(this).attr("data-pageID");

                //Load the page content
                dtps.loadPage(classNum, pageID);
            });
        }
    }).catch((err) => {
        dtps.error("Couldn't fetch pages", "Caught promise rejection @ dtps.loadPagesList", err);
    });
}

/**
 * Fetches and renders a page and its contents
 * 
 * @param {string} classNum The class number of the page to render
 * @param {string} pageID The page ID to render
 */
dtps.loadPage = function (classNum, pageID) {
    //Show loading indicator
    if ((dtps.selectedClass == classNum) && (dtps.selectedContent == "pages")) {
        jQuery(".classContent").html(`<div class="spinner"></div>`);
    }

    //Get page data
    var page = null;
    dtps.classes[classNum].pages.forEach(pageCheck => {
        if (pageCheck.id == pageID) {
            page = pageCheck;
        }
    });

    if (!page) {
        dtps.error("Page does not exist", "page is null @ dtps.loadPage");
        throw null;
    }

    //Fetch page content
    dtpsLMS.fetchPageContent(dtps.classes[classNum].id, page.id).then(function (pageContentData) {
        //Store page content in the page object
        page.content = pageContentData;

        if ((dtps.selectedClass == classNum) && (dtps.selectedContent == "pages")) {
            //Get computed background and text color to style the iFrame with
            var computedBackgroundColor = getComputedStyle($(".card.details")[0]).getPropertyValue("--cards");
            var computedTextColor = getComputedStyle($(".card.details")[0]).getPropertyValue("--text");

            //Generate a blob with the page content and get its data URL
            var blob = new Blob([`
                <base target="_blank" /> 
                <link type="text/css" rel="stylesheet" href="https://cdn.jottocraft.com/CanvasCSS.css" media="screen,projection"/>
                <style>body {background-color: ${computedBackgroundColor}; color: ${computedTextColor};</style>
                ${page.content}
            `], { type: 'text/html' });

            //Get URL from blob
            var pageContentURL = window.URL.createObjectURL(blob);

            //Render page card in the class content
            jQuery(".classContent").html(/*html*/`
                <div class="card">
                    <!-- Page title -->
                    <h4 style="font-weight: bold;">${page.title}</h4>

                    <!-- Page header -->
                    <div style="margin-bottom: 32px;" class="discussionHeader">
                        ${page.author ? /*html*/`
                            <img src="${page.author.photoURL}" />
                            <h5>${page.author.name}</h5>
                        ` : ``}

                        <i class="material-icons">calendar_today</i>
                        <span>${"Last Updated " + dtps.formatDate(page.updatedAt)}</span>
                    </div>

                    <!-- Page content -->
                    <br />
                    <iframe id="classPageIframe" onload="dtps.iframeLoad('classPageIframe')" style="margin: 10px 0px; width: 100%; border: none; outline: none;" src="${pageContentURL}" />
                </div>
            `);
        }
    }).catch((err) => {
        dtps.error("Couldn't load page", "Caught promise rejection @ dtps.loadPage", err);
    });
}

//Fluid UI screen definitions
fluid.externalScreens.discussions = (param) => {
    //Split parameter string into variables
    var courseID = param.split("|")[0];
    var threadID = param.split("|")[1];

    dtps.loadThreadsList(courseID, threadID);
}

fluid.externalScreens.pages = (param) => {
    //Split parameter string into variables
    var courseID = param.split("|")[0];
    var pageID = param.split("|")[1];

    dtps.loadPagesList(courseID, pageID);
}

//Type definitions

/**
* @typedef {Object} DiscussionThread
* @description Defines discussion thread objects in DTPS
* @property {string} title Title of the discussion thread
* @property {string} id Discussion thread ID
* @property {DiscussionPost[]} posts Posts in this thread, with the initial one first. Assume that the topic has not been selected and loaded if this is undefined, and that there are no posts if this is an empty array.
* @property {boolean} [locked] True if posting to the discussion thread is locked
* @property {boolean} [requireInitialPost] True if the user must post before viewing others' posts
*/

/**
* @typedef {Object} DiscussionPost
* @description Defines discussion post objects in DTPS
* @property {string} id Discussion post ID
* @property {string} body Discussion post body HTML
* @property {Date} postedAt Date for when the post was posted
* @property {number} [depth] The depth level this post is
* @property {User} [author] Discussion post author
* @property {DiscussionPost[]} [replies] Replies to this post. Nested replies (replies to replies) should be after this post in the array with a depth of 1, not in the replies key.
* @property {string} [replyURL] A URL that the user can visit to reply to this post
*/

/**
* @typedef {Object} Page
* @description Defines Page objects in DTPS
* @property {string} title Page title
* @property {string} id Page ID
* @property {string} content Page content. Assume the page hasn't been selected/loaded if this is undefined.
* @property {Date} [updatedAt] When the page was last updated
* @property {User} [author] Page author
*/