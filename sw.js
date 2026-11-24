
// ======================================
// GREEN VISION AI - OFFLINE CACHE
// ======================================

const CACHE_NAME = "green-vision-ai-v1";

// Các tài nguyên cần lưu ngoại tuyến
const APP_FILES = [

    "./",
    "./index.html",
    "./manifest.json",

    "./css/style.css",

    "./js/app.js",
    "./js/ai.js",
    "./js/camera.js",
    "./js/history.js",

    "./vendor/tf.min.js",
    "./vendor/teachablemachine-image.min.js",

    "./model/waste/model.json",
    "./model/waste/metadata.json",
    "./model/waste/weights.bin"
];

// Cài đặt và lưu tài nguyên
self.addEventListener("install", event => {

    event.waitUntil(

        caches.open(CACHE_NAME).then(cache => {

            return cache.addAll(APP_FILES);

        })

    );

    self.skipWaiting();
});

// Kích hoạt
self.addEventListener("activate", event => {

    event.waitUntil(

        caches.keys().then(keys => {

            return Promise.all(

                keys
                    .filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))

            );

        })

    );

    self.clients.claim();
});

// Truy xuất từ bộ nhớ đệm
self.addEventListener("fetch", event => {

    if (event.request.method !== "GET") return;

    const url = new URL(event.request.url);

    if (url.origin !== self.location.origin) return;

    event.respondWith(

        caches.match(event.request).then(cached => {

            if (cached) {
                return cached;
            }

            return fetch(event.request);

        })

    );
});
