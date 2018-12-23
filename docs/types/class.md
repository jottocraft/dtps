Represents a class in DTPS. All the classes are in an array at [dtps.classes](https://dtps.readthedocs.io/en/latest/refrence/variables/#dtpsclasses).

Properties

* abbrv
	* String: The class abbriviation shown in PowerSchool (i.e. FE)
* col
	* String: The color of the class as a PowerSchool class color string (i.e. filter_4)
* google
	* Object: The Google Classroom data of a Google Classroom associated with the PowerSchool class
* grade
	* String: The overall class grade as a percentage as a number out of 100 (i.e. 89.76)
* id
	* String: The PowerSchool class ID. (i.e. 9915843)
* letter
	* String: The overall class grade as a letter grade.
* loc
	* String: The class location used in URLs. Used to make web requests to fetch PowerSchool class data. (i.e. thu/freshmanenglish)
* name
	* String: The class name as shown in PowerSchool (i.e. English 1 MASTER)
* num
	* Number: The class number and location/index of the class in the [dtps.classes](https://dtps.readthedocs.io/en/latest/refrence/variables/#dtpsclasses) array.
* stream
	* Array: The class's assignment stream represented as an array of [assignment objects](https://dtps.readthedocs.io/en/latest/types/assignment). IDs pulled from streamitems.
* streamitems
	* Array: The class's assignment stream represented as an array of assignment IDs. Only used for adding assignment IDs to the assignments array in stream.
* streamlist
	* Array: The class's assignment stream represented as an array of HTML elements. Used when a class isn't fully loaded so you can't quit call [dtps.renderStream](https://dtps.readthedocs.io/en/latest/refrence/functions/#dtpsrenderstreamstream-searchres) just yet.
* subject
	* String: The class's subject as detected by DTPS. If DTPS cannot detect the subject of the class, the class name is used instead. The class subject is used instead of the class name in DTPS.
* weights
	* Array: Represents all the grading weights in the class and all of the weights' assignments. Used for [dtps.gradebook](https://dtps.readthedocs.io/en/latest/refrence/functions/#dtpsgradebooknum).