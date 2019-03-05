"use strict";
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/assets/js/apps.help.sw.worker.js')
        .then(function (registration) {
        console.log('serviceWorker registration successful', registration.scope);
    })["catch"](function (error) {
        console.log('ServiceWorker registration failed', error);
    });
}
