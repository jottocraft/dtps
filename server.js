/**
 * Power+ Server
 * (c) jottocraft 2022
 */

const { default : YggdrasilServer } = require("@jottocraft/yggdrasil");
const { firestoreLogger } = require("@jottocraft/yggdrasil/lib/loggers");
const { getAssetFromKV } = require("@cloudflare/kv-asset-handler");

const server = new YggdrasilServer({
    brand: {
        title: "Power+",
        logo: "https://powerplus.app/icon.svg",
        favicon: "https://powerplus.app/favicon.png",
        statusPage: {
            href: "https://status.jottocraft.com",
            name: "jottocraft status page"
        }
    },
    statusCodes: {
        200.1: "Success",
        404.1: "Page not found; An asset corresponding to this request could not be found"
    },
    databases: {
        firestore: {
            ...(JSON.parse(FIRESTORE_SERVICE)),
            projectID: "yggdrasil-db",
            root: "OA/jottocraft/DATA/yggdrasil/SITES/dtps",
            serviceAccount: "yggdrasil-man@yggdrasil-db.iam.gserviceaccount.com"
        }
    },
    logger: firestoreLogger
});

server.route({
    method: "GET",
    path: "*"
}, async ctx => {
    try {
        const page = await getAssetFromKV(ctx.event);

        //Store response
        ctx.response.body = page.body;

        //Set headers from KV
        Object.assign(ctx.response.headers, Object.fromEntries(page.headers.entries()));

        ctx.response.code = 200.1;

        //Log entrypoint requests for analytics
        const ref = ctx.request.headers.get("referer") && new URL(ctx.request.headers.get("referer"));
        const isEntryPoint = ctx.url.pathname === "/init.js" || ctx.url.pathname.startsWith("/scripts/lms/");
        const isOriginatingFromThirdParty = ref && !ref.hostname.endsWith("powerplus.app") && !ref.hostname.endsWith("jottocraft.com");
        const isDtechFollowUp = (ref.hostname === "dtechhs.instructure.com") && (ctx.url.pathname === "/scripts/lms/canvas.js");

        if (isEntryPoint && isOriginatingFromThirdParty && !isDtechFollowUp) {
            //Record User-Agent, requested entrypoint, institution, country, state, and the Cloudflare colocation/datacenter handling the request
            ctx.loggingEnabled = true;
            ctx.loggingProperties = {
                at: new Date().getTime(),
                ua: ctx.request.headers.get("user-agent") || "unknown",
                entry: ctx.url.pathname,
                institution: ref.hostname,
                country: ctx.event.request.cf.country,
                region: ctx.event.request.cf.regionCode,
                colo: ctx.event.request.cf.colo
            };
        }
    } catch(e) {
        ctx.response.code = 404.1;
    }
});

addEventListener("fetch", (event) => {
    event.respondWith(server.handleRequest(event.request, event));
});