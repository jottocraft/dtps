## dtps.changelog()
Displays the changelog modal. This function does not fetch changelog data.

## dtps.log(msg)
dtps.log should always be used instead of console.log. Used for debugging on without devtools.
* msg
  * String: message to log

## dtps.firstrun()
Displays the welcome to Project DTPS message in a native PowerSchool modal. Cannot be used after dtps.render has been called.

## dtps.alert(text, sub)
Displays an alert message in a native PowerSchool modal. Cannot be used after dtps.render has been called.
* text
  * String: alert title
* sub
  * String: alert message / text

## dtps.webReq(req, url, callback, q)
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
 
 
 ## more coming soon
 **i'm out of time right now. there is much more to be added soon**
