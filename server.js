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
    var page;
    try {
        page = await getAssetFromKV(ctx.event);
    } catch(e) {
        return ctx.response.code = 404.1;
    }

    //Store response
    ctx.response.body = page.body;

    //Set headers from KV
    Object.assign(ctx.response.headers, Object.fromEntries(page.headers.entries()));

    ctx.response.code = page.status;
    ctx.response.description = "No error; The asset corresponding to the request was successfully returned";

    //Log entrypoint requests for analytics
    const ref = ctx.request.headers.get("referer") && new URL(ctx.request.headers.get("referer"));
    const isEntryPoint = ctx.url.pathname === "/init.js" || ctx.url.pathname.startsWith("/scripts/lms/");
    const isOriginatingFromThirdParty = ref && !ref.hostname.endsWith("powerplus.app") && !ref.hostname.endsWith("jottocraft.com");
    const isDtechFollowUp = (ref.hostname === "dtechhs.instructure.com") && (ctx.url.pathname === "/scripts/lms/canvas.js");

    if (isEntryPoint && isOriginatingFromThirdParty && !isDtechFollowUp) {
        const isInstructureHosted = ref.hostname.endsWith("instructure.com");
        const isDtechStudent = ref.hostname === "dtechhs.instructure.com";
        const onDNetwork = ctx.request.headers.get("cf-connecting-ip") === DTECH_IP;
    
        /**
         * Record analytics data:
         * - time
         * - user agent
         * - loaded entrypoint
         * - is on instructure.com
         * - is d.tech student
         * - is on d.tech oracle network
         * - country / region
         * - cloudflare colo datacenter
         */
        ctx.loggingEnabled = true;
        ctx.loggingProperties = {
            at: new Date().getTime(),
            ua: ctx.request.headers.get("user-agent") || "unknown",
            entry: ctx.url.pathname,
            isInstructureHosted: isInstructureHosted,
            isDtechStudent: isDtechStudent,
            onDNetwork: onDNetwork,
            country: ctx.event.request.cf.country,
            region: ctx.event.request.cf.regionCode,
            colo: ctx.event.request.cf.colo
        };
    }
});

addEventListener("fetch", (event) => {
    event.respondWith(server.handleRequest(event.request, event));
});