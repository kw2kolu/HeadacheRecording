import {clientsClaim as workbox_core_clientsClaim} from '/home/user/HeadacheRecording/node_modules/workbox-core/clientsClaim.mjs';
import {precacheAndRoute as workbox_precaching_precacheAndRoute} from '/home/user/HeadacheRecording/node_modules/workbox-precaching/precacheAndRoute.mjs';
import {cleanupOutdatedCaches as workbox_precaching_cleanupOutdatedCaches} from '/home/user/HeadacheRecording/node_modules/workbox-precaching/cleanupOutdatedCaches.mjs';
import {registerRoute as workbox_routing_registerRoute} from '/home/user/HeadacheRecording/node_modules/workbox-routing/registerRoute.mjs';
import {NavigationRoute as workbox_routing_NavigationRoute} from '/home/user/HeadacheRecording/node_modules/workbox-routing/NavigationRoute.mjs';
import {createHandlerBoundToURL as workbox_precaching_createHandlerBoundToURL} from '/home/user/HeadacheRecording/node_modules/workbox-precaching/createHandlerBoundToURL.mjs';/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */




self.skipWaiting();
workbox_core_clientsClaim();
/**
 * The precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
workbox_precaching_precacheAndRoute([
  {
    "url": "registerSW.js",
    "revision": "642c192137912cc45781ad38ccc1fdbe"
  },
  {
    "url": "index.html",
    "revision": "ec61d564ffc554cf4ab5ed00002cfe29"
  },
  {
    "url": "assets/typeof-B5XbjTb1.js",
    "revision": null
  },
  {
    "url": "assets/purify.es-6-uFcs4-.js",
    "revision": null
  },
  {
    "url": "assets/jspdf.es.min-xSiAuSi7.js",
    "revision": null
  },
  {
    "url": "assets/index.es-8T2uWeYy.js",
    "revision": null
  },
  {
    "url": "assets/index-_zh9Duj2.css",
    "revision": null
  },
  {
    "url": "assets/index-DGbII8DJ.js",
    "revision": null
  },
  {
    "url": "assets/html2canvas-zx_Cq3yJ.js",
    "revision": null
  },
  {
    "url": "icon-192.png",
    "revision": "63ce63793f9bcca33081ead60b1b35ca"
  },
  {
    "url": "icon-512.png",
    "revision": "29c6d0247ba64302ed1d1da10df8cdfe"
  },
  {
    "url": "manifest.webmanifest",
    "revision": "ba7f69fb13fdea140b08745e6c6e97af"
  }
], {});
workbox_precaching_cleanupOutdatedCaches();workbox_routing_registerRoute(new workbox_routing_NavigationRoute(workbox_precaching_createHandlerBoundToURL("index.html")));


