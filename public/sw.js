/// Closet by Junassan — Service Worker
/// Network-first for navigation, stale-while-revalidate for static assets.

const CACHE = "closet-v1";
const OFFLINE = "/offline.html";

const PRECACHE = [OFFLINE, "/manifest.json", "/icons/icon.svg"];

// Install — precache the offline shell.
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE))
  );
  self.skipWaiting();
});

// Activate — clean old caches.
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch strategy.
self.addEventListener("fetch", (e) => {
  const { request } = e;
  const url = new URL(request.url);

  // Skip non-GET, cross-origin, and Supabase/API calls.
  if (request.method !== "GET") return;
  if (url.origin !== self.location.origin) return;

  // Navigation requests — network first, offline fallback.
  if (request.mode === "navigate") {
    e.respondWith(
      fetch(request).catch(() => caches.match(OFFLINE))
    );
    return;
  }

  // Static assets (JS, CSS, fonts, images) — stale-while-revalidate.
  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/icons/") ||
    url.pathname.endsWith(".woff2") ||
    url.pathname.endsWith(".woff")
  ) {
    e.respondWith(
      caches.open(CACHE).then((cache) =>
        cache.match(request).then((cached) => {
          const fetching = fetch(request).then((response) => {
            if (response.ok) cache.put(request, response.clone());
            return response;
          });
          return cached || fetching;
        })
      )
    );
    return;
  }
});
