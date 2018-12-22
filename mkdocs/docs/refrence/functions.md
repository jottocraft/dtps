**These docs are still being written. Help out by making a PR on [GitHub](https://github.com/jottocraft/dtps)**

### dtps.changelog()
Displays the changelog modal. This function does not fetch changelog data.

### dtps.log(msg)
dtps.log should always be used instead of console.log. Used for debugging on without devtools.

* msg
 * String: message to log

### dtps.firstrun()
Displays the welcome to Project DTPS message in a native PowerSchool modal. Cannot be used after dtps.render has been called.

### dtps.alert(text, sub)
Displays an alert message in a native PowerSchool modal. Cannot be used after dtps.render has been called.

* text
	* String: alert title
* sub
	* String: alert message / text

### dtps.webReq(req, url, callback, q)
Used to fetch PowerSchool data using a web request

* req
	* String: Type of PowerSchool request to be made. Supported values: psGET, assignGET, psPOST, letPOST
* url
	* String: URL to make a web request with
* callback(res, q)
	* Function: Callback to call after data has been fetched
		* res
			* String: Response from web request
		* q
			* Object: Same object as q sent when webReq was called
* q
	* Object: Data about the request to be returned to the callback (mainly used for for loops)
 
### dtps.init()
Starts loading DTPS. The first function ran. Starts loading data and does basic checks before starting Power+
 
### dtps.checkReady(num)
Used to check when the dashboard is done loading assignments. Called by each class after loading its stream.

* num
	* Number: The class number that is done loading

### dtps.loadPages(num)
Gets the list of pages in a class and displays the list in the sidebar.

* num
	* Number: The class number to fetch pages for

### dtps.getPage(loc, id)
Renders all of the blocks of a page into class content

* loc
	* String: The location of the class (found at class.loc)
* id
	* Number: The ID of the page to load (found from dtps.loadPages)

### dtps.classStream(num, renderOv)
Fetches assignments from PowerSchool, loads them into a DTPS stream array, and calls dtps.renderStream to render them into the class content.

* num
	* Number: The class number to load the assignment stream for
* renderOv
	* Boolean: Setting to true prevents the stream from being rendered (i.e. preloading class stream array)

### dtps.renderStream(stream, searchRes)
Renders a DTPS stream array into HTML used to be loaded into class content.

* stream
	* Array: The DTPS stream array (array of assignments) to render
* searchRes
	* Boolean: Setting to true tells dtps.renderStream that the stream being renderd is search results

### dtps.masterStream(doneLoading)
Renders the dashboard

* doneLoading
	* Boolean: Specifies if the dashboard is fully loaded for the loading indicator

### dtps.gradebook(num)
Renders the grades tab for a class

* num
	* Number: The class number to load

### dtps.assignment(classNum, streamNum)
Fetches and displays the details for an assignment

* classNum
	* The class number of the assignment
* streamNum
	* The index / location of the assignment in the class's stream

### dtps.myWork(loc, id)
Displays the work submitted for an assignment

* loc
	* String: location of the class
* id
	* Number: ID of the assignment

### dtps.announcements()
Loads announcements into the dashboard (should only be called by dtps.masterStream)

### dtps.calendar(doneLoading)
Loads the calendar into the dashboard (should only be called by dtps.masterStream)

* doneLoading
	* Boolean: indicates if the masterStream is done loading. Since v1.4.0 replacing the masterStream with dashboard this doesn't do anything.
  
### dtps.showClasses(override)
Loads classes from dtps.classes into the sidebar

* override
	* Boolean: Setting to true forces a re-render even if the sidebar already has been loaded

### dtps.googleStream()
Loads assignments from all classes with a linked google classroom into a DTPS stream array

### dtps.googleAuth()
Shows a Google login screen, fetches classes from Google, links with PowerSchool classes, then calls dtps.googleStream

### dtps.render()
Called by dtps.init when all checks have passed, erases all PowerSchool HTML & CSS and injects the DTPS UI. Also used to do other startup things like fetch scripts and changelog info.
