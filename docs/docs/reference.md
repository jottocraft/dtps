--- 
id: reference 
title: Reference 
--- 
Generated on Fri 07/24/2020 
 
Reference documentation is also available in [JSDoc format](/jsdoc/index.html) 
## Objects

<dl>
<dt><a href="#dtpsLMS">dtpsLMS</a> : <monospace>object</monospace></dt>
<dd><p>Global DTPS LMS integration object. All LMS-related tasks, such as fetching data, are handled by this object. This is always loaded first. Please read the guide docs for instructions on implementing a custom LMS.</p>
</dd>
<dt><a href="#dtps">dtps</a> : <monospace>object</monospace></dt>
<dd><p>Global DTPS object
All global DTPS functions and variables are stored in this object</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#Assignment">Assignment</a> : <monospace>Object</monospace></dt>
<dd><p>Defines assignments objects in DTPS</p>
</dd>
<dt><a href="#Module">Module</a> : <monospace>Object</monospace></dt>
<dd><p>Defines module objects in DTPS</p>
</dd>
<dt><a href="#ModuleItem">ModuleItem</a> : <monospace>Object</monospace></dt>
<dd><p>Defines module items in DTPS</p>
</dd>
<dt><a href="#Announcement">Announcement</a> : <monospace>Object</monospace></dt>
<dd><p>Defines announcement objects in DTPS</p>
</dd>
<dt><a href="#AssignmentFeedback">AssignmentFeedback</a> : <monospace>Object</monospace></dt>
<dd><p>Defines assignment feedback objects in DTPS</p>
</dd>
<dt><a href="#RubricItem">RubricItem</a> : <monospace>Object</monospace></dt>
<dd><p>Defines rubric item objects in DTPS</p>
</dd>
<dt><a href="#DashboardItem">DashboardItem</a> : <monospace>Object</monospace></dt>
<dd><p>Defines dashboard items in DTPS</p>
</dd>
<dt><a href="#Date">Date</a> : <monospace>string</monospace></dt>
<dd><p>A date string recognized by <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse">Date.parse</a></p>
</dd>
<dt><a href="#User">User</a> : <monospace>Object</monospace></dt>
<dd><p>Defines user objects in DTPS</p>
</dd>
<dt><a href="#Class">Class</a> : <monospace>Object</monospace></dt>
<dd><p>Defines class objects in DTPS</p>
</dd>
<dt><a href="#DiscussionThread">DiscussionThread</a> : <monospace>Object</monospace></dt>
<dd><p>Defines discussion thread objects in DTPS</p>
</dd>
<dt><a href="#DiscussionPost">DiscussionPost</a> : <monospace>Object</monospace></dt>
<dd><p>Defines discussion post objects in DTPS</p>
</dd>
<dt><a href="#Page">Page</a> : <monospace>Object</monospace></dt>
<dd><p>Defines Page objects in DTPS</p>
</dd>
</dl>

<a name="dtpsLMS"></a>

## dtpsLMS : <monospace>object</monospace>
Global DTPS LMS integration object. All LMS-related tasks, such as fetching data, are handled by this object. This is always loaded first. Please read the guide docs for instructions on implementing a custom LMS.

**Kind**: global namespace  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <monospace>string</monospace> | Full LMS name |
| [shortName] | <monospace>string</monospace> | Short LMS name |
| legalName | <monospace>string</monospace> | Legal name (or names) to show in the "Welcome to Power+" disclaimer |
| [description] | <monospace>string</monospace> | A short description of the LMS integration provided |
| logo | <monospace>string</monospace> | LMS logo image URL |
| url | <monospace>string</monospace> | URL to the LMS' website |
| source | <monospace>string</monospace> | URL to the LMS integration's source code |
| [institutionSpecific] | <monospace>boolean</monospace> | True if the LMS is designed for a specific institution instead of a broader LMS |
| [preferRubricGrades] | <monospace>boolean</monospace> | True if DTPS should prefer rubric grades for assignments |
| [genericGradebook] | <monospace>boolean</monospace> | True if DTPS should show the generic gradebook. Ignored if dtpsLMS.gradebook defined. |


* [dtpsLMS](#dtpsLMS) : <monospace>object</monospace>
    * [.fetchUser()](#dtpsLMS.fetchUser) ??? [<monospace>Promise.&lt;User&gt;</monospace>](#User)
    * [.fetchClasses()](#dtpsLMS.fetchClasses) ??? <monospace>Promise.&lt;Array.&lt;Class&gt;&gt;</monospace>
    * [.fetchAssignments(classID)](#dtpsLMS.fetchAssignments) ??? <monospace>Promise.&lt;Array.&lt;Assignment&gt;&gt;</monospace>
    * [.fetchModules(classID)](#dtpsLMS.fetchModules) ??? <monospace>Promise.&lt;Array.&lt;Module&gt;&gt;</monospace>
    * [.collapseModule(classID, moduleID, collapsed)](#dtpsLMS.collapseModule) ??? <monospace>Promise</monospace>
    * [.fetchAnnouncements(classID)](#dtpsLMS.fetchAnnouncements) ??? <monospace>Promise.&lt;Array.&lt;Announcement&gt;&gt;</monospace>
    * [.fetchHomepage(classID)](#dtpsLMS.fetchHomepage) ??? <monospace>Promise.&lt;string&gt;</monospace>
    * [.fetchDiscussionThreads(classID)](#dtpsLMS.fetchDiscussionThreads) ??? <monospace>Promise.&lt;Array.&lt;DiscussionThread&gt;&gt;</monospace>
    * [.fetchDiscussionPosts(classID, threadID)](#dtpsLMS.fetchDiscussionPosts) ??? <monospace>Promise.&lt;Array.&lt;DiscussionPost&gt;&gt;</monospace>
    * [.fetchPages(classID)](#dtpsLMS.fetchPages) ??? <monospace>Promise.&lt;Array.&lt;Page&gt;&gt;</monospace>
    * [.fetchPageContent(classID, pageID)](#dtpsLMS.fetchPageContent) ??? <monospace>Promise.&lt;string&gt;</monospace>
    * [.gradebook(course)](#dtpsLMS.gradebook) ??? <monospace>Promise.&lt;string&gt;</monospace>
    * [.calculateGrade(course, assignments)](#dtpsLMS.calculateGrade) ??? <monospace>undefined</monospace> \| <monospace>object</monospace>
    * [.updateAssignments(assignments)](#dtpsLMS.updateAssignments) ??? [<monospace>Array.&lt;Assignment&gt;</monospace>](#Assignment)
    * [.updateClasses(classes)](#dtpsLMS.updateClasses) ??? [<monospace>Array.&lt;Class&gt;</monospace>](#Class)


* * *

<a name="dtpsLMS.fetchUser"></a>

### dtpsLMS.fetchUser() ??? [<monospace>Promise.&lt;User&gt;</monospace>](#User)
[REQUIRED] Fetches user data from the LMS

**Kind**: static method of [<monospace>dtpsLMS</monospace>](#dtpsLMS)  
**Returns**: [<monospace>Promise.&lt;User&gt;</monospace>](#User) - A promise which resolves to a User object  

* * *

<a name="dtpsLMS.fetchClasses"></a>

### dtpsLMS.fetchClasses() ??? <monospace>Promise.&lt;Array.&lt;Class&gt;&gt;</monospace>
[REQUIRED] Fetches class data from the LMS

**Kind**: static method of [<monospace>dtpsLMS</monospace>](#dtpsLMS)  
**Returns**: <monospace>Promise.&lt;Array.&lt;Class&gt;&gt;</monospace> - A promise which resolves to an array of Class objects  

* * *

<a name="dtpsLMS.fetchAssignments"></a>

### dtpsLMS.fetchAssignments(classID) ??? <monospace>Promise.&lt;Array.&lt;Assignment&gt;&gt;</monospace>
[REQUIRED] Fetches assignment data for a course from the LMS

**Kind**: static method of [<monospace>dtpsLMS</monospace>](#dtpsLMS)  
**Returns**: <monospace>Promise.&lt;Array.&lt;Assignment&gt;&gt;</monospace> - A promise which resolves to an array of Assignment objects  

| Param | Type | Description |
| --- | --- | --- |
| classID | <monospace>string</monospace> | The class ID to fetch assignments for |


* * *

<a name="dtpsLMS.fetchModules"></a>

### dtpsLMS.fetchModules(classID) ??? <monospace>Promise.&lt;Array.&lt;Module&gt;&gt;</monospace>
[OPTIONAL] Fetches module data for a course from the LMS

**Kind**: static method of [<monospace>dtpsLMS</monospace>](#dtpsLMS)  
**Returns**: <monospace>Promise.&lt;Array.&lt;Module&gt;&gt;</monospace> - A promise which resolves to an array of Module objects  

| Param | Type | Description |
| --- | --- | --- |
| classID | <monospace>string</monospace> | The class ID to fetch modules for |


* * *

<a name="dtpsLMS.collapseModule"></a>

### dtpsLMS.collapseModule(classID, moduleID, collapsed) ??? <monospace>Promise</monospace>
[OPTIONAL] Collapses a module in the LMS

**Kind**: static method of [<monospace>dtpsLMS</monospace>](#dtpsLMS)  
**Returns**: <monospace>Promise</monospace> - A promise which resolves when the operation is completed  

| Param | Type | Description |
| --- | --- | --- |
| classID | <monospace>string</monospace> | The ID of the class |
| moduleID | <monospace>string</monospace> | The ID of the module to collapse |
| collapsed | <monospace>boolean</monospace> | True if the module is collapsed, false otherwise |


* * *

<a name="dtpsLMS.fetchAnnouncements"></a>

### dtpsLMS.fetchAnnouncements(classID) ??? <monospace>Promise.&lt;Array.&lt;Announcement&gt;&gt;</monospace>
[OPTIONAL] Fetches recent announcements for a course from the LMS

**Kind**: static method of [<monospace>dtpsLMS</monospace>](#dtpsLMS)  
**Returns**: <monospace>Promise.&lt;Array.&lt;Announcement&gt;&gt;</monospace> - A promise which resolves to an array of Announcement objects  

| Param | Type | Description |
| --- | --- | --- |
| classID | <monospace>string</monospace> | The class ID to fetch announcements for |


* * *

<a name="dtpsLMS.fetchHomepage"></a>

### dtpsLMS.fetchHomepage(classID) ??? <monospace>Promise.&lt;string&gt;</monospace>
[OPTIONAL] Fetches homepage HTML for a course from the LMS

**Kind**: static method of [<monospace>dtpsLMS</monospace>](#dtpsLMS)  
**Returns**: <monospace>Promise.&lt;string&gt;</monospace> - A promise which resolves to the HTML for the class homepage  

| Param | Type | Description |
| --- | --- | --- |
| classID | <monospace>string</monospace> | The class ID to get the homepage for |


* * *

<a name="dtpsLMS.fetchDiscussionThreads"></a>

### dtpsLMS.fetchDiscussionThreads(classID) ??? <monospace>Promise.&lt;Array.&lt;DiscussionThread&gt;&gt;</monospace>
[OPTIONAL] Fetches discussion threads for a course from the LMS

**Kind**: static method of [<monospace>dtpsLMS</monospace>](#dtpsLMS)  
**Returns**: <monospace>Promise.&lt;Array.&lt;DiscussionThread&gt;&gt;</monospace> - A promise which resolves to an array of Discussion Thread objects  

| Param | Type | Description |
| --- | --- | --- |
| classID | <monospace>string</monospace> | The class ID to fetch discussion threads for |


* * *

<a name="dtpsLMS.fetchDiscussionPosts"></a>

### dtpsLMS.fetchDiscussionPosts(classID, threadID) ??? <monospace>Promise.&lt;Array.&lt;DiscussionPost&gt;&gt;</monospace>
[REQUIRED IF dtpsLMS.fetchDiscussionThreads IS IMPLEMENTED] Fetches discussion posts in a thread from the LMS

**Kind**: static method of [<monospace>dtpsLMS</monospace>](#dtpsLMS)  
**Returns**: <monospace>Promise.&lt;Array.&lt;DiscussionPost&gt;&gt;</monospace> - A promise which resolves to an array of Discussion Post objects  

| Param | Type | Description |
| --- | --- | --- |
| classID | <monospace>string</monospace> | The class ID to fetch discussion posts for |
| threadID | <monospace>string</monospace> | The discussion thread ID to fetch discussion posts for |


* * *

<a name="dtpsLMS.fetchPages"></a>

### dtpsLMS.fetchPages(classID) ??? <monospace>Promise.&lt;Array.&lt;Page&gt;&gt;</monospace>
[OPTIONAL] Fetches pages for a course from the LMS

**Kind**: static method of [<monospace>dtpsLMS</monospace>](#dtpsLMS)  
**Returns**: <monospace>Promise.&lt;Array.&lt;Page&gt;&gt;</monospace> - A promise which resolves to an array of Page objects  

| Param | Type | Description |
| --- | --- | --- |
| classID | <monospace>string</monospace> | The class ID to fetch pages for |


* * *

<a name="dtpsLMS.fetchPageContent"></a>

### dtpsLMS.fetchPageContent(classID, pageID) ??? <monospace>Promise.&lt;string&gt;</monospace>
[REQUIRED IF dtpsLMS.fetchPages IS IMPLEMENTED] Fetches content for a page from the LMS

**Kind**: static method of [<monospace>dtpsLMS</monospace>](#dtpsLMS)  
**Returns**: <monospace>Promise.&lt;string&gt;</monospace> - A promise which resolves to the page's content as HTML  

| Param | Type | Description |
| --- | --- | --- |
| classID | <monospace>string</monospace> | The class ID to fetch page content for |
| pageID | <monospace>string</monospace> | The page ID to fetch page content for |


* * *

<a name="dtpsLMS.gradebook"></a>

### dtpsLMS.gradebook(course) ??? <monospace>Promise.&lt;string&gt;</monospace>
[OPTIONAL] Renders custom gradebook HTML for unique grading systems or for a more tailored experience. The gradebook only shows for classes with a grade and with at least 1 assignment.

**Kind**: static method of [<monospace>dtpsLMS</monospace>](#dtpsLMS)  
**Returns**: <monospace>Promise.&lt;string&gt;</monospace> - A promise which resolves to HTML to render for the class gradebook  

| Param | Type | Description |
| --- | --- | --- |
| course | [<monospace>Class</monospace>](#Class) | Class to render the gradebook for. If custom grade calculation is enabled (dtpsLMS.calculateGrade), those results can be accessed at course.gradeCalculation. |


* * *

<a name="dtpsLMS.calculateGrade"></a>

### dtpsLMS.calculateGrade(course, assignments) ??? <monospace>undefined</monospace> \| <monospace>object</monospace>
[OPTIONAL] Calculates class grades with a custom grade calculation formula. Used for unique grading systems.

**Kind**: static method of [<monospace>dtpsLMS</monospace>](#dtpsLMS)  
**Returns**: <monospace>undefined</monospace> \| <monospace>object</monospace> - The letter grade should be returned in the "letter" property as a string and the percentage in the "grade" property as a number. Other custom properties can be set if they need to be accessed by dtpsLMS.gradebook. Return undefined if there is no grade for the class.  

| Param | Type | Description |
| --- | --- | --- |
| course | [<monospace>Class</monospace>](#Class) | Class to calculate grades for [DO NOT USE COURSE.ASSIGNMENTS to access assignments for grade calculation. Use the assignments parameter instead.] |
| assignments | [<monospace>Array.&lt;Assignment&gt;</monospace>](#Assignment) | Assignments used for grade calculation. Use this instead of course.assignments for hypothetical/what-if grade calculation. |


* * *

<a name="dtpsLMS.updateAssignments"></a>

### dtpsLMS.updateAssignments(assignments) ??? [<monospace>Array.&lt;Assignment&gt;</monospace>](#Assignment)
[OPTIONAL, INSTITUTION ONLY] This function can be implemented by institution-specific scripts to loop through and override assignment data returned by the LMS.

**Kind**: static method of [<monospace>dtpsLMS</monospace>](#dtpsLMS)  
**Returns**: [<monospace>Array.&lt;Assignment&gt;</monospace>](#Assignment) - Updated assignments array  

| Param | Type | Description |
| --- | --- | --- |
| assignments | [<monospace>Array.&lt;Assignment&gt;</monospace>](#Assignment) | Original assignments array |


* * *

<a name="dtpsLMS.updateClasses"></a>

### dtpsLMS.updateClasses(classes) ??? [<monospace>Array.&lt;Class&gt;</monospace>](#Class)
[OPTIONAL, INSTITUTION ONLY] This function can be implemented by institution-specific scripts to loop through and override class data returned by the LMS.

**Kind**: static method of [<monospace>dtpsLMS</monospace>](#dtpsLMS)  
**Returns**: [<monospace>Array.&lt;Class&gt;</monospace>](#Class) - Updated classes array  

| Param | Type | Description |
| --- | --- | --- |
| classes | [<monospace>Array.&lt;Class&gt;</monospace>](#Class) | Original classes array |


* * *

<a name="dtps"></a>

## dtps : <monospace>object</monospace>
Global DTPS object
All global DTPS functions and variables are stored in this object

**Kind**: global namespace  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| ver | <monospace>number</monospace> | Comparable version number |
| readableVer | <monospace>string</monospace> | Formatted semantic version number |
| classes | [<monospace>Array.&lt;Class&gt;</monospace>](#Class) | DTPS classes array |
| baseURL | <monospace>string</monospace> | The base URL that DTPS is being loaded from |
| unstable | <monospace>boolean</monospace> | This is true if loading an unstable version of DTPS |
| gradebookExpanded | <monospace>boolean</monospace> | True if gradebook details (Show more...) is open. Used in the generic gradebook and may be used in custom gradebook implementations. |
| popup | <monospace>string</monospace> \| <monospace>undefined</monospace> | Popup to show when loaded. Either undefined (no popup), "firstrun", or "changelog". |
| user | [<monospace>User</monospace>](#User) | Current user, fetched with dtps.init |
| selectedClass | <monospace>number</monospace> \| <monospace>string</monospace> | The selected class number, or "dash" if the dashboard is selected. Set when the first screen is loaded in dtps.init. |
| selectedContent | <monospace>string</monospace> | The selected class content/tab. Set when the first class content is loaded. Defaults to "stream". |
| bgTimeout | <monospace>number</monospace> \| <monospace>undefined</monospace> | Background transition timeout when switching between classes |
| updates | <monospace>Array.&lt;(Assignment\|Announcement)&gt;</monospace> | Array of up to 10 recently graded assignments or announcements. |
| dashboardItems | [<monospace>Array.&lt;DashboardItem&gt;</monospace>](#DashboardItem) | Array of items that can be shown on the dashboard |
| leftDashboard | [<monospace>Array.&lt;DashboardItem&gt;</monospace>](#DashboardItem) | Items on the left side of the dashboard based on dtps.dashboardItems and user prefrences. Set in dtps.loadDashboardPrefs. |
| rightDashboard | [<monospace>Array.&lt;DashboardItem&gt;</monospace>](#DashboardItem) | Items on the right side of the dashboard based on dtps.dashboardItems and user prefrences. Set in dtps.loadDashboardPrefs. |


* [dtps](#dtps) : <monospace>object</monospace>
    * [.renderAssignment(assignment)](#dtps.renderAssignment) ??? <monospace>string</monospace>
    * [.renderAssignmentScore(assignment)](#dtps.renderAssignmentScore) ??? <monospace>string</monospace>
    * [.masterStream()](#dtps.masterStream)
    * [.renderDueToday()](#dtps.renderDueToday)
    * [.renderUpcoming()](#dtps.renderUpcoming)
    * [.renderUpdates()](#dtps.renderUpdates)
    * [.calendar()](#dtps.calendar)
    * [.classStream(classID, [searchResults], [searchText])](#dtps.classStream)
    * [.assignment(id, classNum)](#dtps.assignment)
    * [.search()](#dtps.search)
    * [.moduleStream(classID)](#dtps.moduleStream)
    * [.moduleCollapse(ele, classID, modID)](#dtps.moduleCollapse)
    * [.renderClassTools(num, type, [searchText])](#dtps.renderClassTools) ??? <monospace>string</monospace>
    * [.classInfo(num)](#dtps.classInfo)
    * [.classHome(num)](#dtps.classHome)
    * [.gradebook(classID)](#dtps.gradebook)
    * [.class()](#dtps.class) ??? <monospace>object</monospace> \| <monospace>undefined</monospace>
    * [.isToday(date)](#dtps.isToday)
    * [.changelog(onlyIfNewVersion)](#dtps.changelog)
    * [.log(msg)](#dtps.log)
    * [.error(msg, [devNotes], [err])](#dtps.error)
    * [.firstrun()](#dtps.firstrun)
    * [.renderLoadingScreen()](#dtps.renderLoadingScreen)
    * [.JS(cb)](#dtps.JS)
    * [.CSS()](#dtps.CSS)
    * [.init()](#dtps.init)
    * [.ampm(date)](#dtps.ampm) ??? <monospace>string</monospace>
    * [.formatDate(date)](#dtps.formatDate) ??? <monospace>string</monospace>
    * [.obsSwitch(ele)](#dtps.obsSwitch)
    * [.iframeLoad(iframeID)](#dtps.iframeLoad)
    * [.clearData()](#dtps.clearData)
    * [.chroma()](#dtps.chroma)
    * [.showClasses([override])](#dtps.showClasses)
    * [.presentClass(classNum)](#dtps.presentClass)
    * [.showLMSGradebook(classID)](#dtps.showLMSGradebook)
    * [.showIFrameCard(url)](#dtps.showIFrameCard)
    * [.logGrades(classNum)](#dtps.logGrades)
    * [.settings()](#dtps.settings)
    * [.saveDashboardPrefs()](#dtps.saveDashboardPrefs)
    * [.loadDashboardPrefs()](#dtps.loadDashboardPrefs)
    * [.render()](#dtps.render)
    * [.renderLite()](#dtps.renderLite)
    * [.loadThreadsList(courseID, [defaultThread])](#dtps.loadThreadsList)
    * [.loadThreadPosts(classNum, threadID)](#dtps.loadThreadPosts)
    * [.loadPagesList(courseID, [defaultPage])](#dtps.loadPagesList)
    * [.loadPage(classNum, pageID)](#dtps.loadPage)


* * *

<a name="dtps.renderAssignment"></a>

### dtps.renderAssignment(assignment) ??? <monospace>string</monospace>
Renders HTML for an assignment item in a list

**Kind**: static method of [<monospace>dtps</monospace>](#dtps)  
**Returns**: <monospace>string</monospace> - Assignment HTML for use in a list  

| Param | Type | Description |
| --- | --- | --- |
| assignment | [<monospace>Assignment</monospace>](#Assignment) | The assignment object to render |


* * *

<a name="dtps.renderAssignmentScore"></a>

### dtps.renderAssignmentScore(assignment) ??? <monospace>string</monospace>
Renders HTML for an assignment score if the assignment is graded

**Kind**: static method of [<monospace>dtps</monospace>](#dtps)  
**Returns**: <monospace>string</monospace> - Assignment score HTML  

| Param | Type | Description |
| --- | --- | --- |
| assignment | [<monospace>Assignment</monospace>](#Assignment) | The assignment object to render a score for |


* * *

<a name="dtps.masterStream"></a>

### dtps.masterStream()
Renders the DTPS dashboard and calls dtps.renderCalendar, dtps.renderUpdates, and dtps.renderUpcoming

**Kind**: static method of [<monospace>dtps</monospace>](#dtps)  

* * *

<a name="dtps.renderDueToday"></a>

### dtps.renderDueToday()
Compiles and displays due today / to-do stream

**Kind**: static method of [<monospace>dtps</monospace>](#dtps)  

* * *

<a name="dtps.renderUpcoming"></a>

### dtps.renderUpcoming()
Compiles and displays upcoming assignments stream

**Kind**: static method of [<monospace>dtps</monospace>](#dtps)  

* * *

<a name="dtps.renderUpdates"></a>

### dtps.renderUpdates()
Renders updates stream (recently graded & announcements)

**Kind**: static method of [<monospace>dtps</monospace>](#dtps)  

* * *

<a name="dtps.calendar"></a>

### dtps.calendar()
Compiles and displays the assignment calendar

**Kind**: static method of [<monospace>dtps</monospace>](#dtps)  

* * *

<a name="dtps.classStream"></a>

### dtps.classStream(classID, [searchResults], [searchText])
Shows the assignments stream for a class

**Kind**: static method of [<monospace>dtps</monospace>](#dtps)  

| Param | Type | Description |
| --- | --- | --- |
| classID | <monospace>string</monospace> | The class ID to show assignments for |
| [searchResults] | [<monospace>Array.&lt;Assignment&gt;</monospace>](#Assignment) | An array of assignemnts to render instead of course.assignments. Used for assignment search. |
| [searchText] | <monospace>string</monospace> | Text to render in the search box. Used for assignment search. |


* * *

<a name="dtps.assignment"></a>

### dtps.assignment(id, classNum)
Shows details for an assignment given the assignment ID and class number

**Kind**: static method of [<monospace>dtps</monospace>](#dtps)  

| Param | Type | Description |
| --- | --- | --- |
| id | <monospace>string</monospace> | Assignment ID |
| classNum | <monospace>number</monospace> | Assignment class number |


* * *

<a name="dtps.search"></a>

### dtps.search()
Searches the assignment stream for a keyword using Fuse.js

**Kind**: static method of [<monospace>dtps</monospace>](#dtps)  

* * *

<a name="dtps.moduleStream"></a>

### dtps.moduleStream(classID)
Shows the module stream for a class

**Kind**: static method of [<monospace>dtps</monospace>](#dtps)  

| Param | Type | Description |
| --- | --- | --- |
| classID | <monospace>string</monospace> | Class number to fetch modules for |


* * *

<a name="dtps.moduleCollapse"></a>

### dtps.moduleCollapse(ele, classID, modID)
Collapses a module

**Kind**: static method of [<monospace>dtps</monospace>](#dtps)  

| Param | Type | Description |
| --- | --- | --- |
| ele | <monospace>Element</monospace> | Element of the module collapse arrow |
| classID | <monospace>string</monospace> | Class ID |
| modID | <monospace>string</monospace> | Module ID of the module to collapse |


* * *

<a name="dtps.renderClassTools"></a>

### dtps.renderClassTools(num, type, [searchText]) ??? <monospace>string</monospace>
Gets stream tools HTML (search box, class info, and modules/assignment switcher)

**Kind**: static method of [<monospace>dtps</monospace>](#dtps)  
**Returns**: <monospace>string</monospace> - Stream tools HTML  

| Param | Type | Description |
| --- | --- | --- |
| num | <monospace>number</monospace> | Class number |
| type | <monospace>string</monospace> | Class content these tools are for (e.g. "stream") |
| [searchText] | <monospace>string</monospace> | Text to render in the search box for assignment search |


* * *

<a name="dtps.classInfo"></a>

### dtps.classInfo(num)
Displays class info & syllabus card

**Kind**: static method of [<monospace>dtps</monospace>](#dtps)  

| Param | Type | Description |
| --- | --- | --- |
| num | <monospace>number</monospace> | Class number to show info for |


* * *

<a name="dtps.classHome"></a>

### dtps.classHome(num)
Displays the class homepage

**Kind**: static method of [<monospace>dtps</monospace>](#dtps)  

| Param | Type | Description |
| --- | --- | --- |
| num | <monospace>number</monospace> | Class number to show the homepage for |


* * *

<a name="dtps.gradebook"></a>

### dtps.gradebook(classID)
Shows the generic gradebook

**Kind**: static method of [<monospace>dtps</monospace>](#dtps)  

| Param | Type | Description |
| --- | --- | --- |
| classID | <monospace>string</monospace> | Class ID |


* * *

<a name="dtps.class"></a>

### dtps.class() ??? <monospace>object</monospace> \| <monospace>undefined</monospace>
Debugging shortcut for getting the selected class. This should only be used in the web inspector and not in actual code.

**Kind**: static method of [<monospace>dtps</monospace>](#dtps)  
**Returns**: <monospace>object</monospace> \| <monospace>undefined</monospace> - The selected class  

* * *

<a name="dtps.isToday"></a>

### dtps.isToday(date)
Checks if a Date is today

**Kind**: static method of [<monospace>dtps</monospace>](#dtps)  

| Param | Type | Description |
| --- | --- | --- |
| date | [<monospace>Date</monospace>](#Date) | Date string to check |


* * *

<a name="dtps.changelog"></a>

### dtps.changelog(onlyIfNewVersion)
Fetches and displays the DTPS changelog modal

**Kind**: static method of [<monospace>dtps</monospace>](#dtps)  

| Param | Description |
| --- | --- |
| onlyIfNewVersion | True if the changelog should only show if this is a new version |


* * *

<a name="dtps.log"></a>

### dtps.log(msg)
Logs debugging messages

**Kind**: static method of [<monospace>dtps</monospace>](#dtps)  

| Param | Type | Description |
| --- | --- | --- |
| msg | <monospace>string</monospace> | The debugging message to log |


* * *

<a name="dtps.error"></a>

### dtps.error(msg, [devNotes], [err])
Shows an error message alert and logs to console

**Kind**: static method of [<monospace>dtps</monospace>](#dtps)  

| Param | Type | Description |
| --- | --- | --- |
| msg | <monospace>string</monospace> | The error to display |
| [devNotes] | <monospace>string</monospace> | Technical error details displayed in a smaller font |
| [err] | <monospace>Error</monospace> | An error object to log to the console. If this is null, DTPS will assume the error has been handled elsewhere. |


* * *

<a name="dtps.firstrun"></a>

### dtps.firstrun()
Renders "Welcome to Project DTPS" screen on the first run

**Kind**: static method of [<monospace>dtps</monospace>](#dtps)  

* * *

<a name="dtps.renderLoadingScreen"></a>

### dtps.renderLoadingScreen()
Renders the DTPS loading screen

**Kind**: static method of [<monospace>dtps</monospace>](#dtps)  

* * *

<a name="dtps.JS"></a>

### dtps.JS(cb)
Load all external JavaScript libraries

**Kind**: static method of [<monospace>dtps</monospace>](#dtps)  

| Param | Type | Description |
| --- | --- | --- |
| cb | <monospace>function</monospace> | Callback function |


* * *

<a name="dtps.CSS"></a>

### dtps.CSS()
Load all DTPS CSS files

**Kind**: static method of [<monospace>dtps</monospace>](#dtps)  

* * *

<a name="dtps.init"></a>

### dtps.init()
Starts DTPS (entrypoint function)

**Kind**: static method of [<monospace>dtps</monospace>](#dtps)  

* * *

<a name="dtps.ampm"></a>

### dtps.ampm(date) ??? <monospace>string</monospace>
12 hour time formatter

**Kind**: static method of [<monospace>dtps</monospace>](#dtps)  
**Returns**: <monospace>string</monospace> - Formatted time string in 12hr format  

| Param | Type | Description |
| --- | --- | --- |
| date | [<monospace>Date</monospace>](#Date) | The date to format |


* * *

<a name="dtps.formatDate"></a>

### dtps.formatDate(date) ??? <monospace>string</monospace>
Formats a date to a readable date string

**Kind**: static method of [<monospace>dtps</monospace>](#dtps)  
**Returns**: <monospace>string</monospace> - Formatted date string in DAY MONTH DATE, HH:MM AMPM format  

| Param | Type | Description |
| --- | --- | --- |
| date | [<monospace>Date</monospace>](#Date) | The date to format |


* * *

<a name="dtps.obsSwitch"></a>

### dtps.obsSwitch(ele)
Switches the current child account being observed

**Kind**: static method of [<monospace>dtps</monospace>](#dtps)  

| Param | Type | Description |
| --- | --- | --- |
| ele | <monospace>Element</monospace> | The dropdown element used to switch accounts |


* * *

<a name="dtps.iframeLoad"></a>

### dtps.iframeLoad(iframeID)
Adjusts the height of an iFrame to match its content

**Kind**: static method of [<monospace>dtps</monospace>](#dtps)  

| Param | Type | Description |
| --- | --- | --- |
| iframeID | <monospace>string</monospace> | The ID of the iFrame element to adjust |


* * *

<a name="dtps.clearData"></a>

### dtps.clearData()
Clears all DTPS data

**Kind**: static method of [<monospace>dtps</monospace>](#dtps)  

* * *

<a name="dtps.chroma"></a>

### dtps.chroma()
Runs Razer Chroma RGB effects for the selected content

**Kind**: static method of [<monospace>dtps</monospace>](#dtps)  
**Todo**

- [ ] Pending v3 rewrite


* * *

<a name="dtps.showClasses"></a>

### dtps.showClasses([override])
Renders the class list in the sidebar

**Kind**: static method of [<monospace>dtps</monospace>](#dtps)  

| Param | Type | Description |
| --- | --- | --- |
| [override] | <monospace>boolean</monospace> | True if the sidebar should be forcefully re-rendered |


* * *

<a name="dtps.presentClass"></a>

### dtps.presentClass(classNum)
Renders the class header (color, name, tabs, etc.) and sets the class as the selected class

**Kind**: static method of [<monospace>dtps</monospace>](#dtps)  

| Param | Type | Description |
| --- | --- | --- |
| classNum | <monospace>number</monospace> \| <monospace>string</monospace> | The class number to load or "dash" if loading the dashboard |


* * *

<a name="dtps.showLMSGradebook"></a>

### dtps.showLMSGradebook(classID)
Shows the gradebook using HTML from dtpsLMS.gradebook

**Kind**: static method of [<monospace>dtps</monospace>](#dtps)  

| Param | Type | Description |
| --- | --- | --- |
| classID | <monospace>string</monospace> | Class ID |


* * *

<a name="dtps.showIFrameCard"></a>

### dtps.showIFrameCard(url)
Shows a URL in the iFrame card

**Kind**: static method of [<monospace>dtps</monospace>](#dtps)  

| Param | Type | Description |
| --- | --- | --- |
| url | <monospace>string</monospace> | The URL to load |


* * *

<a name="dtps.logGrades"></a>

### dtps.logGrades(classNum)
Stores grade data locally for the previous grade feature

**Kind**: static method of [<monospace>dtps</monospace>](#dtps)  

| Param | Description |
| --- | --- |
| classNum | Class number to log grade |


* * *

<a name="dtps.settings"></a>

### dtps.settings()
Opens the settings page

**Kind**: static method of [<monospace>dtps</monospace>](#dtps)  

* * *

<a name="dtps.saveDashboardPrefs"></a>

### dtps.saveDashboardPrefs()
Saves dashboard prefrences

**Kind**: static method of [<monospace>dtps</monospace>](#dtps)  

* * *

<a name="dtps.loadDashboardPrefs"></a>

### dtps.loadDashboardPrefs()
Loads dashboard prefrences

**Kind**: static method of [<monospace>dtps</monospace>](#dtps)  

* * *

<a name="dtps.render"></a>

### dtps.render()
Renders initial static DTPS HTML

**Kind**: static method of [<monospace>dtps</monospace>](#dtps)  

* * *

<a name="dtps.renderLite"></a>

### dtps.renderLite()
Renders basic content after the user has been loaded

**Kind**: static method of [<monospace>dtps</monospace>](#dtps)  

* * *

<a name="dtps.loadThreadsList"></a>

### dtps.loadThreadsList(courseID, [defaultThread])
Renders the discussions list for a class

**Kind**: static method of [<monospace>dtps</monospace>](#dtps)  

| Param | Type | Description |
| --- | --- | --- |
| courseID | <monospace>string</monospace> | The course ID to render discussion threads for |
| [defaultThread] | <monospace>string</monospace> | The thread to load by default |


* * *

<a name="dtps.loadThreadPosts"></a>

### dtps.loadThreadPosts(classNum, threadID)
Fetches and displays posts in a discussion

**Kind**: static method of [<monospace>dtps</monospace>](#dtps)  

| Param | Type | Description |
| --- | --- | --- |
| classNum | <monospace>number</monospace> | The class number to render |
| threadID | <monospace>string</monospace> | The discussion thread to render |


* * *

<a name="dtps.loadPagesList"></a>

### dtps.loadPagesList(courseID, [defaultPage])
Renders the pages list for a class

**Kind**: static method of [<monospace>dtps</monospace>](#dtps)  

| Param | Type | Description |
| --- | --- | --- |
| courseID | <monospace>string</monospace> | The course ID to render pages for |
| [defaultPage] | <monospace>string</monospace> | If provided, load the pageID by default |


* * *

<a name="dtps.loadPage"></a>

### dtps.loadPage(classNum, pageID)
Fetches and renders a page and its contents

**Kind**: static method of [<monospace>dtps</monospace>](#dtps)  

| Param | Type | Description |
| --- | --- | --- |
| classNum | <monospace>string</monospace> | The class number of the page to render |
| pageID | <monospace>string</monospace> | The page ID to render |


* * *

<a name="Assignment"></a>

## Assignment : <monospace>Object</monospace>
Defines assignments objects in DTPS

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| title | <monospace>string</monospace> | Title of the assignment |
| [body] | <monospace>string</monospace> | HTML of the assignment's body |
| id | <monospace>string</monospace> | Assignment ID |
| [dueAt] | [<monospace>Date</monospace>](#Date) | Assignment due date |
| url | <monospace>string</monospace> | Assignment URL |
| [feedback] | [<monospace>Array.&lt;AssignmentFeedback&gt;</monospace>](#AssignmentFeedback) | Feedback / private comments for this assignment |
| [grader] | [<monospace>User</monospace>](#User) | Assignment grader |
| [turnedIn] | <monospace>boolean</monospace> | True if the assignment is turned in |
| [late] | <monospace>boolean</monospace> | True if the assignment is late |
| [missing] | <monospace>boolean</monospace> | True if the assignment is missing |
| [locked] | <monospace>boolean</monospace> | True if assignment submissions are locked |
| [category] | <monospace>string</monospace> | Assignment category |
| [publishedAt] | [<monospace>Date</monospace>](#Date) | Date for when the assignment was published |
| [gradedAt] | [<monospace>Date</monospace>](#Date) | Date for when the assignment was graded |
| [grade] | <monospace>number</monospace> | Points earned on this assignment |
| [letter] | <monospace>string</monospace> | Letter grade on this assignment |
| [value] | <monospace>number</monospace> | Total amount of points possible for this assignment |
| [rubric] | [<monospace>Array.&lt;RubricItem&gt;</monospace>](#RubricItem) | Assignment rubric |


* * *

<a name="Module"></a>

## Module : <monospace>Object</monospace>
Defines module objects in DTPS

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| title | <monospace>string</monospace> | Title of the module |
| id | <monospace>string</monospace> | Module ID |
| [collapsed] | <monospace>boolean</monospace> | True if the module is collapsed, false otherwise. undefined or null if this module does not support collapsing. |
| items | [<monospace>Array.&lt;ModuleItem&gt;</monospace>](#ModuleItem) | An array of items for this module. |


* * *

<a name="ModuleItem"></a>

## ModuleItem : <monospace>Object</monospace>
Defines module items in DTPS

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| type | <monospace>string</monospace> | Either "assignment", "page", "discussion", "url", "embed", or "header". |
| [title] | <monospace>string</monospace> | Required for URL and header items, and can be used to override the title of assignment, page, and discussion items. |
| [id] | <monospace>string</monospace> | Required for assignment, page, and discussion items. |
| [url] | <monospace>string</monospace> | Required for URL and embed items. |
| [indent] | <monospace>number</monospace> | Indent level |


* * *

<a name="Announcement"></a>

## Announcement : <monospace>Object</monospace>
Defines announcement objects in DTPS

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| title | <monospace>string</monospace> | Title of the announcement |
| postedAt | [<monospace>Date</monospace>](#Date) | Date when the announcement was posted |
| body | <monospace>string</monospace> | Announcement content |


* * *

<a name="AssignmentFeedback"></a>

## AssignmentFeedback : <monospace>Object</monospace>
Defines assignment feedback objects in DTPS

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| comment | <monospace>string</monospace> | Feedback comment |
| [author] | [<monospace>User</monospace>](#User) | Feedback author |


* * *

<a name="RubricItem"></a>

## RubricItem : <monospace>Object</monospace>
Defines rubric item objects in DTPS

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| title | <monospace>string</monospace> | Title of the rubric item |
| id | <monospace>string</monospace> | Rubric item ID (does NOT have to be unique) |
| value | <monospace>number</monospace> | Total amount of points possible |
| [outcome] | <monospace>string</monospace> | The ID of the outcome this rubric item is assessing. This is only used for grade calculation. |
| [description] | <monospace>string</monospace> | Rubric item description |
| [score] | <monospace>number</monospace> | Rubric assessment score in points |
| [scoreName] | <monospace>string</monospace> | Rubric assessment score name |
| [scoreColor] | <monospace>string</monospace> | Score color in CSS color format |


* * *

<a name="DashboardItem"></a>

## DashboardItem : <monospace>Object</monospace>
Defines dashboard items in DTPS

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <monospace>string</monospace> | Dashbord item name |
| id | <monospace>string</monospace> | Unique dashboard item ID |
| icon | <monospace>string</monospace> | Dashboard item icon |
| supportsCompactMode | <monospace>boolean</monospace> | True if this dashboard item supports compact mode |
| size | <monospace>number</monospace> | The approximate size of this dashboard item relative to other dashboard items. Should be no less than 20. |
| defaultSide | <monospace>string</monospace> | The default side of this dashboard item. Either "right" or "left". |
| compact | <monospace>boolean</monospace> | True if the user has turned on compact mode for this item. |


* * *

<a name="Date"></a>

## Date : <monospace>string</monospace>
A date string recognized by [Date.parse](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse)

**Kind**: global typedef  

* * *

<a name="User"></a>

## User : <monospace>Object</monospace>
Defines user objects in DTPS

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <monospace>string</monospace> | User name |
| id | <monospace>string</monospace> | User ID |
| photoURL | <monospace>string</monospace> | User photo URL |
| [children] | [<monospace>Array.&lt;User&gt;</monospace>](#User) | [ONLY FOR DTPS.USER] Array of child users. If this is defined, the user is treated as a parent account. Sub-children are not allowed. |
| parent | <monospace>boolean</monospace> | [ONLY FOR DTPS.USER] Automatically managed by DTPS. True if the user is a parent account. |
| lmsID | <monospace>string</monospace> | [ONLY FOR DTPS.USER] Automatically managed by DTPS. This is the user ID that all LMS web requests should use. Can change when a parent account changes the selected child. |


* * *

<a name="Class"></a>

## Class : <monospace>Object</monospace>
Defines class objects in DTPS

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <monospace>string</monospace> | Name of the class |
| id | <monospace>string</monospace> | Class ID |
| num | <monospace>number</monospace> | Index of the class in the dtps.classes array |
| subject | <monospace>string</monospace> | Class subject |
| assignments | [<monospace>Array.&lt;Assignment&gt;</monospace>](#Assignment) | Class assignments. Assume assignments are still loading if this is undefined. The class has no assignments if this is an empty array. Loaded in dtps.init. |
| [modules] | [<monospace>Array.&lt;Module&gt;</monospace>](#Module) \| <monospace>boolean</monospace> | Class modules. Assume this class supports the modules feature, but is not yet loaded, if this is true and that the class has no modules if this is an empty array. For LMSs that do not support modules, either keep it undefined or set it to false. |
| [discussions] | [<monospace>Array.&lt;DiscussionThread&gt;</monospace>](#DiscussionThread) \| <monospace>boolean</monospace> | Class discussion threads. Assume this class supports discussions, but not yet loaded, if this is true and that the class has no threads if this is an empty array. For LMSs that do not support discussions, either keep it undefined or set it to false. |
| [pages] | [<monospace>Array.&lt;Page&gt;</monospace>](#Page) \| <monospace>boolean</monospace> | Class pages. Assume this class supports the pages feature, but not yet loaded, if true and that the class has no pages if this is an empty array. For LMSs that do not support pages, either keep it undefined or set it to false. |
| [newDiscussionThreadURL] | <monospace>string</monospace> | A URL the user can visit to create a new discussion thread in this class |
| [syllabus] | <monospace>string</monospace> | Class syllabus HTML |
| [homepage] | <monospace>boolean</monospace> | True if the class has a homepage. If a class has a homepage, dtpsLMS.fetchHomepage must be implemented. |
| [description] | <monospace>string</monospace> | Class description HTML |
| [numStudents] | <monospace>number</monospace> | Number of students in the class |
| [term] | <monospace>string</monospace> | Class term |
| [color] | <monospace>string</monospace> | Class color |
| [grade] | <monospace>number</monospace> | Current percentage grade in the class |
| [letter] | <monospace>string</monospace> | Current letter grade in the class |
| [previousLetter] | <monospace>string</monospace> | Automatically managed by DTPS. The previous letter grade in this class, based on local grade history. |
| [image] | <monospace>string</monospace> | URL to the class background image |
| [teacher] | [<monospace>User</monospace>](#User) | Class teacher |
| [hasGradebook] | <monospace>boolean</monospace> | Automatically managed by DTPS. True if the class should show the gradebook tab. |
| [gradeCalculation] | <monospace>object</monospace> | Automatically managed by DTPS. If custom grade calculation is implemented, this will be the results from custom grade calculation returned by dtpsLMS.calculateGrade. |


* * *

<a name="DiscussionThread"></a>

## DiscussionThread : <monospace>Object</monospace>
Defines discussion thread objects in DTPS

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| title | <monospace>string</monospace> | Title of the discussion thread |
| id | <monospace>string</monospace> | Discussion thread ID |
| posts | [<monospace>Array.&lt;DiscussionPost&gt;</monospace>](#DiscussionPost) | Posts in this thread, with the initial one first. Assume that the topic has not been selected and loaded if this is undefined, and that there are no posts if this is an empty array. |
| [locked] | <monospace>boolean</monospace> | True if posting to the discussion thread is locked |
| [requireInitialPost] | <monospace>boolean</monospace> | True if the user must post before viewing others' posts |


* * *

<a name="DiscussionPost"></a>

## DiscussionPost : <monospace>Object</monospace>
Defines discussion post objects in DTPS

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| id | <monospace>string</monospace> | Discussion post ID |
| body | <monospace>string</monospace> | Discussion post body HTML |
| postedAt | [<monospace>Date</monospace>](#Date) | Date for when the post was posted |
| [depth] | <monospace>number</monospace> | The depth level this post is |
| [author] | [<monospace>User</monospace>](#User) | Discussion post author |
| [replies] | [<monospace>Array.&lt;DiscussionPost&gt;</monospace>](#DiscussionPost) | Replies to this post. Nested replies (replies to replies) should be after this post in the array with a depth of 1, not in the replies key. |
| [replyURL] | <monospace>string</monospace> | A URL that the user can visit to reply to this post |


* * *

<a name="Page"></a>

## Page : <monospace>Object</monospace>
Defines Page objects in DTPS

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| title | <monospace>string</monospace> | Page title |
| id | <monospace>string</monospace> | Page ID |
| content | <monospace>string</monospace> | Page content. Assume the page hasn't been selected/loaded if this is undefined. |
| [updatedAt] | [<monospace>Date</monospace>](#Date) | When the page was last updated |
| [author] | [<monospace>User</monospace>](#User) | Page author |


* * *

