/**
 * Power+ Production Server v2
 * (c) jottocraft 2022-2023. All rights reserved.
 */

import { getAssetFromKV, NotFoundError, MethodNotAllowedError } from '@cloudflare/kv-asset-handler';
import manifestJSON from '__STATIC_CONTENT_MANIFEST';
import UAParser from "ua-parser-js";

const assetManifest = JSON.parse(manifestJSON);

async function logAnalyticsEvent(url, request, env, ctx) {
  //Collect statistics about this event
  const entrypoint = url.pathname.split("/").pop();
  const colo = request.cf.colo;
  const canvasInstance = new URL(request.headers.get("Referer")).hostname;
  const uh = url.searchParams.get("uh").substring(0, 32);
  const country = request.cf.country;
  const region = request.cf.regionCode;
  const deviceOS = new UAParser(request.headers.get("User-Agent")).getOS().name;
  const isp = request.cf.asOrganization;

  //Record statistics
  env.STATS.writeDataPoint({
    blobs: [
      canvasInstance,
      entrypoint,
      country,
      region,
      colo,
      deviceOS,
      isp
    ],
    indexes: [uh]
  });
}

async function serveKV(request, env, ctx) {
  const url = new URL(request.url);

  try {
    const res = await getAssetFromKV(
      {
        request,
        waitUntil: (promise) => ctx.waitUntil(promise)
      },
      {
        ASSET_NAMESPACE: env.__STATIC_CONTENT,
        ASSET_MANIFEST: assetManifest
      }
    );

    ctx.waitUntil((async function () {
      //Log analytics event
      if (
        url.pathname.startsWith("/scripts/lms/")
        && url.pathname.endsWith(".js")
        && (url.searchParams.get("upstream") !== "true")
        && url.searchParams.get("uh")
        && (url.searchParams.get("uh") !== "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855") //filter empty/garbage data (crx <3.1.2)
      ) {
        logAnalyticsEvent(url, request, env, ctx);
      }
    })());

    return res;
  } catch (e) {
    if (e instanceof NotFoundError) {
      return env.HTTP_STATUS_PAGES.fetch("https://http-status-pages.jottocraft.com/?status=404&brand=dtps");
    } else if (e instanceof MethodNotAllowedError) {
      return env.HTTP_STATUS_PAGES.fetch("https://http-status-pages.jottocraft.com/?status=405&brand=dtps");
    } else {
      return env.HTTP_STATUS_PAGES.fetch("https://http-status-pages.jottocraft.com/?status=500&brand=dtps");
    }
  }
}

export default {
  async fetch(request, env, ctx) {
    return await serveKV(request, env, ctx);
  }
};
