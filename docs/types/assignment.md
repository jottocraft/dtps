Represents an assignment in DTPS. Assignments usually found in the stream key of a [DTPS class](https://dtps.readthedocs.io/en/latest/types/class).

Properties

* class
	* Number: The number of the assignment's class
* col
	* String: The color of the assignment's class
* due
	* String: The human string of the assignment's due date
* dueDate
	* String: The ISO string of the assignment's due date (use this instead of due when doing new Date())
* id
	* String: The assignment's PowerSchool ID
* loc
	* String: The location of the assignment's class
* subject
	* String: The subject of the assignment's class
* title
	* String: The assignment's title
* turnedIn
	* Boolean: Represents if the assignment has been turned in in PowerSchool.
* grade
	* String: The assignment's grade represented as a fraction
* letter
	* String: The assignment's letter grade
* weight
	* String: The assignment's grade weight