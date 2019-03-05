"use strict";
self.addEventListener('install', function (e) {
    console.log('event install');
    e.waitUntil(caches.open('v1').then(function (cache) {
        cache.addAll([
            'https://taku-o.github.io/myukkurivoice-preview/help',
            'https://taku-o.github.io/myukkurivoice-preview/help.sw.register.js',
            'https://taku-o.github.io/myukkurivoice-preview/assets/js/apps.help.js',
            'https://taku-o.github.io/myukkurivoice-preview/assets/js/directive.include.js',
            'https://taku-o.github.io/myukkurivoice-preview/assets/css/help.css',
            'https://taku-o.github.io/myukkurivoice-preview/_help/about.html',
            'https://taku-o.github.io/myukkurivoice-preview/_help/backup.html',
            'https://taku-o.github.io/myukkurivoice-preview/_help/contact.html',
            'https://taku-o.github.io/myukkurivoice-preview/_help/dataconfig.html',
            'https://taku-o.github.io/myukkurivoice-preview/_help/dictionary.html',
            'https://taku-o.github.io/myukkurivoice-preview/_help/dragout.html',
            'https://taku-o.github.io/myukkurivoice-preview/_help/funclist.html',
            'https://taku-o.github.io/myukkurivoice-preview/_help/help.html',
            'https://taku-o.github.io/myukkurivoice-preview/_help/history.html',
            'https://taku-o.github.io/myukkurivoice-preview/_help/license.html',
            'https://taku-o.github.io/myukkurivoice-preview/_help/multivoice.html',
            'https://taku-o.github.io/myukkurivoice-preview/_help/play.html',
            'https://taku-o.github.io/myukkurivoice-preview/_help/shortcut.html',
            'https://taku-o.github.io/myukkurivoice-preview/_help/trouble.html',
            'https://taku-o.github.io/myukkurivoice-preview/_help/tuna.html',
            'https://taku-o.github.io/myukkurivoice-preview/_help/uninstall.html',
            'https://taku-o.github.io/myukkurivoice-preview/_help/update.html',
            'https://taku-o.github.io/myukkurivoice-preview/_help/voicecode.html',
            'https://taku-o.github.io/myukkurivoice-preview/_help/writing.html',
        ]);
    }));
});
self.addEventListener('fetch', function (e) {
    console.log('event fetch');
    e.respondWith(caches.match(e.request).then(function (response) {
        if (response) {
            console.log('find cache');
            return response;
        }
        else {
            console.log('not find cache');
            console.log(e.request);
            return fetch(e.request.clone());
        }
    }));
});
