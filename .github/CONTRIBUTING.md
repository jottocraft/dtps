## Contributing to Power+
Power+ is open-source and open to contributions on GitHub. This document will provide several important details on how Power+ is developed and additional information about debugging Power+.

### DevTools
If you have PowerPoints enabled, developer tools will not work properly. You will need to disable PowerPoints in order to debug Power+.

### Documentation
If you want to know how Power+ works, you can use the following sources:
* The [Canvas API](https://canvas.instructure.com/doc/api/). All web requests in Power+ use the dtps.webReq function.
* Code comments in dev.js

### Pull request guidelines
* All PRs must be made in dev.js and dev.css. PRs made to the stable Power+ files will not be accepted.
* PRs cannot give, take change, add, or remove Power+ badges
* Never change any version info (i.e. version numbers) in a PR
* PRs should generally include only small bugfixes and minor changes. PRs that make major changes will not be accepted. If you want to add a new feature to Power+, open an issue. This is just so I know how everything in Power+ works, and for consistency.
* Any PRs that intentionally attempt to steal user data or include tracking, advertisements/monetization, malware, bloatware, etc. will cause the PR to be instantly denied and the user will get banned from contributing to Power+ and all of my other repositories. No exceptions. The only tracking software used in Power+ is Google Analytics.

### Release schedule
A new major stable release of Power+ typically occurs at the beginning of every month. To use the very latest code, make sure you are using the dev version of Power+. Version numbers and features included in the dev channel are pretty much meaningless. The build number matters much more. Minor releases (0.0.x) are rare and only occur if major bugfixs needs to be pushed to stable ASAP. Minor fixes for the stable version don't always have a new release number. Releases both have a version number and a month (v1.5.0 can also be called the Febuary 2019 update).

#### Questions / Additional Information
If you want to know any additional information or if you have questions about contributing to Power+, please email me at [hello@jottocraft.com](mailto:hello@jottocraft.com).
