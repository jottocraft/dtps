/**
 * @file DTPS course user list screen
 * @author jottocraft
 * 
 * @copyright Copyright (c) 2018-2021 jottocraft
 * @license GPL-2.0-only
 */


/**
 * Renders the people tab for a class
 * 
 * @param {string} courseID The course ID to render the people tab for
 */
dtps.usersList = function (courseID) {
    //Get class index and set as selected class
    var classNum = dtps.classes.map(course => course.id).indexOf(courseID);
    dtps.selectedClass = classNum;

    //Set people as the selected content
    dtps.selectedContent = "people";
    $("#dtpsTabBar .btn").removeClass("active");
    $("#dtpsTabBar .btn.people").addClass("active");

    //Load class color and things
    dtps.presentClass(classNum);

    //Ensure classes are shown in the sidebar
    dtps.showClasses();

    if (classNum == -1) {
        //Class does not exist
        dtps.error("The selected class doesn't exist", "classNum check failed @ dtps.usersList");
    }

    if ((dtps.selectedClass == classNum) && (dtps.selectedContent == "people")) {
        jQuery(".classContent").html(/*html*/`
            <div style="--size: 250px; margin: 0px 20px;" class="grid flex">
              <div class="block status card">
                <h2 class="main"><span class="shimmer">--</span></h2>
                <h5 class="bottom"><i class="fluid-icon">contact_page</i> Your section</h5>
              </div>
              <div class="block status">
                <h2 class="main numFont"><span class="shimmer">--</span></h2>
                <h5 class="bottom"><i class="fluid-icon">groups</i> Total Students</h5>
              </div>
              <div class="block status">
                <h2 class="main numFont"><span class="shimmer">--</span></h2>
                <h5 class="bottom"><i class="fluid-icon">school</i> Teachers</h5>
              </div>
            </div>
            <div class="card">
                <h5><b style="width: 300px; display: inline-block;" class="shimmer">Title</b></h5>
                ${[1, 2, 3, 4, 5, 6].map(() => (
                    /*html*/`
                        <div>
                            <p class="shimmerParent">
                                <span style="width: 30px; height: 30px; outline: none; border-radius: 50%; display: inline-block; vertical-align: middle; margin-right: 5px;"></span>
                                <a style="color: var(--text); vertical-align: middle;">User name</a>
                            </p>
                        </div>
                    `
        )).join("")}
            </div>
        `);
    }

    //Fetch users list
    new Promise(resolve => {
        if (dtps.classes[classNum].people && (dtps.classes[classNum].people !== true)) {
            resolve(dtps.classes[classNum].people);
        } else {
            dtpsLMS.fetchUsers(dtps.classes[classNum].lmsID).then(data => resolve(data));
        }
    }).then(function (sections) {
        dtps.classes[classNum].people = sections;

        //Count students and teachers by user ID
        var allStudents = [];
        var allTeachers = [];
        var currentSection = null;
        sections.forEach(section => {
            section.users.forEach(user => {
                if ((section.title == "Teachers") && !allTeachers.includes(user.id)) {
                    allTeachers.push(user.id);
                } else if (!allStudents.includes(user.id)) {
                    allStudents.push(user.id);
                }

                if (!currentSection && (user.id == dtps.user.id)) {
                    currentSection = section.title;
                }
            });
        });

        if ((dtps.selectedClass == classNum) && (dtps.selectedContent == "people")) {
            if (!sections || (sections.length == 0)) {
                //No people in this class? (this shouldn't be possible)
                jQuery(".classContent").html(/*html*/`
                    <div style="cursor: auto;" class="card assignment">
                        <h4>Error</h4>
                        <p>Power+ could not get the list of people in this course</p>
                    </div>
                `);
            } else {
                jQuery(".classContent").html(/*html*/`
                    <div style="--size: 250px; margin: 0px 20px;" class="grid flex">
                      <div class="block status card">
                        <h2 style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;" class="main">${currentSection || "--"}</h2>
                        <h5 class="bottom"><i class="fluid-icon">contact_page</i> Your section</h5>
                      </div>
                      <div class="block status">
                        <h2 class="main numFont">${allStudents.length}</h2>
                        <h5 class="bottom"><i class="fluid-icon">groups</i> Total Students</h5>
                      </div>
                      <div class="block status">
                        <h2 class="main numFont">${allTeachers.length}</h2>
                        <h5 class="bottom"><i class="fluid-icon">school</i> ${allTeachers.length == 1 ? "Teacher" : "Teachers"}</h5>
                      </div>
                    </div>
                ` + sections.map(section => (
                    /*html*/`
                        <div class="card">
                            <h5><b>${section.title}</b> (${section.users.length} ${section.users.length == 1 ? "person" : "people"})</h5>
                            ${section.users.map(user => (
                                /*html*/`
                                    <div>
                                        <p>
                                            <img style="width: 30px; border-radius: 50%; vertical-align: middle; margin-right: 5px;" src="${user.photoURL}" />
                                            <a href="${user.url}" style="color: var(--text); vertical-align: middle;">${user.name}</a>
                                        </p>
                                    </div>
                                `
                )).join("")}
                        </div>
                    `
                )).join(""));
            }
        }
    }).catch(function (err) {
        dtps.error("Couldn't fetch users", "Caught promise rejection @ dtps.usersList", err);
    });
}

//Fluid UI screen definitions
fluid.externalScreens.people = (courseID) => {
    dtps.usersList(courseID);
}

/**
* @typedef {Object} ClassSection
* @description Defines a class section in DTPS
* @property {string} title Name of the section
* @property {string} id Section ID
* @property {User[]} users Students in this section
*/