Object.defineProperty(window, "s", {
    writable: false,
    value: {
        name: "Power+",
        description: "Stay on top of your coursework ~at a glance~ and with real-time ~CBL~ grade calculation.",
        productImage: "/assets/productImage.png",
        colors: { brand: "#d4a426", brandDark: "#b78e23" },
        copyright: "(c) jottocraft 2018-2021. [source code](https://github.com/jottocraft/dtps) [license](https://github.com/jottocraft/dtps/blob/main/LICENSE)",
        links: [
            { name: "Get the extension", type: "main", newWindow: true, icon: "extension", href: "https://chrome.google.com/webstore/detail/power%20/pakgdifknldaiglefmpkkgfjndemfapo" },
            { name: "Demo", icon: "exit_to_app", href: "/demo" }
        ],
        sections: [
            {
                type: "split",
                left: {
                    image: "/assets/todo.svg",
                    icon: "dashboard",
                    title: "Manage your coursework",
                    text: "Power+ shows upcoming assignments, a calendar, announcements, and updates at a glance."
                }, right: {
                    image: "/assets/calculator.svg",
                    icon: "calculate",
                    title: "CBL Grade Calculation",
                    text: "Power+ calculates CBL class grades at Design Tech High School with support for what-if grades."
                }
            },
            {
                type: "full",
                image: "/assets/server.svg",
                icon: "security",
                title: "Privacy",
                paragraph: true,
                text: [
                    "#Processing of Personal Information and Preferences#",
                    "- Power+ does not collect any personal information. All personal information shown in Power+ is fetched directly from Canvas to your device. All processing of personal information (such as CBL grade calculation) is done on-device.",
                    "- Prefrences and grade history are stored on-device and are not associated with your Canvas account.",
                    "- Power+ is completely open-source on [GitHub](https://github.com/jottocraft/dtps).",

                    "#Web Analytics#",
                    "- Power+ uses Cloudflare Web Analytics to count page views, load times, browsers, devices, and Canvas instances used with Power+.",
                    "- Data collected using Cloudflare Web Analytics is not associated with individual users or IP addresses and does not collect any personal information.",
                    "- To learn more about Cloudflare Web Analytics, visit [cloudflare.com/web-analytics](https://www.cloudflare.com/web-analytics/). If you have any questions or concerns about your privacy on Power+ please contact me at [privacy@jottocraft.com](mailto:privacy@jottocraft.com)."
                ].join("\n")
            }
        ]
    }
});