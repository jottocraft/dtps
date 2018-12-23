**These docs are still being written. Help out by making a PR on [GitHub](https://github.com/jottocraft/dtps)**

### dtps.ver
Number: The version number of DTPS in number form (XYZ) instead of X.Y.Z for changlogs and comparing versions

### dtps.readableVer
String: The displayed version number of DTPS in the form vX.Y.Z track. Must start with v and the track part is optional and only used in pre-release versions of DTPS.

### dtps.trackSuffix
String: The the track part of dtps.readableVer (i.e. " (dev)"). Must start with a space so it can be added to things without messing up formatting.

### dtps.showLetters
Boolean: Specifies if the show letter grades instead of points earned experiment is enabled

### dtps.unreadAnn
Number: Specifies amount of unread announcements (not used)

### dtps.latestStream
Array: The DTPS stream array of the currently loaded stream (for search)

### dtps.authProvider
Object: The [Firebase Auth Provider](https://firebase.google.com/docs/reference/js/firebase.auth.GoogleAuthProvider) object used for linking Google Classroom

### dtps.classColors
Array: An array that is used to specify colors for classes before loading dtps.classes array. Only used temporarily, use dtps.classes[n].col after DTPS is loaded.

### dtps.classLocs
Array: An array that is used to specify locations for classes before loading dtps.classes array. Only used temporarily, use dtps.classes[n].loc after DTPS is loaded.

### dtps.classes
Array: An array of [DTPS class objects](https://dtps.readthedocs.io/en/latest/types/class). The most important variable in DTPS. Contains all classes and their information, including assignments, stream, Google, and basically everything.

### dtps.classesReady
Number: Represents the amount of classes that have loaded their streams. Used for the loading indicator on [dtps.masterStream](https://dtps.readthedocs.io/en/latest/refrence/functions/#dtpsmasterstreamdoneloading).

### dtps.classList
Array: Used to render HTML for the sidebar in [dtps.showClasses](https://dtps.readthedocs.io/en/latest/refrence/functions/#dtpsshowclassesoverride)

### dtps.classroomAuth
String: Represents the authentication token paramater used for making Google Classroom web request

### dtps.first
Boolean: A variable that represents if the user is using DTPS for the first time. Used to call [dtps.firstrun](https://dtps.readthedocs.io/en/latest/refrence/functions/#dtpsfirstrun)

### dtps.fuse
Object: The [fusejs](http://fusejs.io/) object for search

### dtps.googleClasses
Array: Represents raw class data pulled from the Google Classroom API. Includes all classes.

### dtps.http
Object: The [XMLHttpRequests](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest) used to make web requests. They are stored in an object based on the request's URL instead of a variable to prevent conflicts.

### dtps.latestStream
Array: A copy of the latest stream that was rendered. Lets search figure out what to search.

### dtps.masterContent
String: Represents the selected tab on the [master stream](https://dtps.readthedocs.io/en/latest/refrence/functions/#dtpsmasterstreamdoneloading). This isn't used anymore since the dashboard removed masterStream tabs

### dtps.raw
String: Used for debugging raw web request data. This should basically never be used.

### dtps.rawData
Represents parsed web request data for debugging. This can really be any type, but is usually an array.

### dtps.requests
Object: Stores raw web request data made with [dtps.webReq](https://dtps.readthedocs.io/en/latest/refrence/functions/#dtpswebreqreq-url-callback-q) so repeated request already have a copy of site content and load instantly.

### dtps.selectedClass
Number: Represents the class number of the selected class in the sidebar. Frequently used as dtps.classes[dtps.selectedClass] to get the current class object.

### dtps.selectedContent
String: Represents the selected tab in a class. i.e. stream, google, pages, or grades. 

### dtps.shouldRender
Boolean: Defind in [dtps.init](https://dtps.readthedocs.io/en/latest/refrence/functions/#dtpsinit). Represents if all checks have passed. When set to true, dtps.init calls [dtps.render](https://dtps.readthedocs.io/en/latest/refrence/functions/#dtpsrender) to continue loading DTPS. When false, an error message is shown and DTPS is not loaded.

### dtps.showChangelog
Boolean: Defind in [dtps.init](https://dtps.readthedocs.io/en/latest/refrence/functions/#dtpsinit). Used to determine whether to call [dtps.changelog](https://dtps.readthedocs.io/en/latest/refrence/functions/#dtpschangelog) or not.

### dtps.updateScript
Boolean: (not used anymore) Determines if the user is using an outdated bookmark script.

### dtps.user
Object: Represents the current user as defined by PowerSchool in HaikuContext.user. DTPS adds google (google user object) and prof (PowerSchool profile picture URL) to this object.