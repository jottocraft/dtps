### Experimental features
* Features marked with a experiment icon are incomplete. Do not submit issues related to any of these features. These features should only appear if you are a Project DTPS tester or if you are on a pre-release version of Project DTPS.

### Contributing (PRs and code)
Please make sure to read the Project DTPS docs before making PRs

Project DTPS docs: [dtps.rtfd.io](dtps.rtfd.io)

* Do not submit PRs to add/edit/remove any profile badges. Profile badges should only be created and distributed by jottocraft.
* Only submit PRs that edit dev.js. Never edit/make a PR for init.js. init.js will be updated to match dev.js for the next release. Use the [dev bookmark](https://dtps.js.org/devbookmark.txt) to use dev.js to access the new features early.
* Never change build numbers, version numbers, changelogs, or releases. Releases, changelogs, version numbers, etc. are all determined by jottocraft.
* Never change any core components Project DTPS (never change name, attempt a redesign, new icon, major reworks, etc.). Open an issue for something related to that instead.
* If you feel like your PR needs an exception for one of these guidelines or you are unsure about any of these, submit the PR anyways. I'd rather reject a PR than lose a good idea that slightly bends the guidelines.

### Milestones and Releases
* I call the dev version of DTPS dev and not beta or alpha because they really don't represent the final release, which could change drastically from the dev version. It just means it has the latest code from whatever I'm working on. The dev version number is not always accurate and can change. When I release something, I just copy the dev code to stable and give it a version number.
* Issues marked with a milestone may not accuratly represent the release they will be included in; they are just targets. If a milestone is marked with a release number right after the release number of the latest dev version in development, it just means it will be in a release after the one in active development, not the one right after (i.e. if the latest stable is v1.2.0 and latest dev is v1.4.0, and an issue gets a milestone of v1.5.0 that just means it will be after v1.4.0. It might be in v1.5.0, or might be pushed back to a later release)
