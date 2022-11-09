/**
 * Power+ Production Server v2
 * (c) jottocraft 2022. All rights reserved.
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
  const uh = url.searchParams.get("uh");
  const country = request.cf.country;
  const region = request.cf.regionCode;
  const deviceOS = new UAParser(request.headers.get("User-Agent")).getOS().name;
  const isp = request.cf.asOrganization;

  //Record statistics
  env.EVENTS.writeDataPoint({
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
      ) {
        logAnalyticsEvent(url, request, env, ctx);
      }
    })());

    return res;
  } catch (e) {
    if (e instanceof NotFoundError) {
      url.pathname = "/404.html";
      return await getAssetFromKV(
        {
          request: new Request(url, request),
          waitUntil: (promise) => ctx.waitUntil(promise)
        },
        {
          ASSET_NAMESPACE: env.__STATIC_CONTENT,
          ASSET_MANIFEST: assetManifest
        }
      );
    } else if (e instanceof MethodNotAllowedError) {
      return new Response('Error 405 Method Not Allowed', { status: 405 });
    } else {
      return new Response('Error 500 An unexpected error occurred', { status: 500 });
    }
  }
}

export default {
  async fetch(request, env, ctx) {
    return await serveKV(request, env, ctx);
  }
};
