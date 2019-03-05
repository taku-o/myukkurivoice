"use strict";
self.addEventListener('install', function (e) {
    console.log('event install');
    e.waitUntil(caches.open('v1').then(function (cache) {
        cache.addAll([
            'https://taku-o.github.io/myukkurivoice/help',
            'https://taku-o.github.io/myukkurivoice/_help/about.html',
            'https://taku-o.github.io/myukkurivoice/_help/backup.html',
            'https://taku-o.github.io/myukkurivoice/_help/contact.html',
            'https://taku-o.github.io/myukkurivoice/_help/dataconfig.html',
            'https://taku-o.github.io/myukkurivoice/_help/dictionary.html',
            'https://taku-o.github.io/myukkurivoice/_help/dragout.html',
            'https://taku-o.github.io/myukkurivoice/_help/funclist.html',
            'https://taku-o.github.io/myukkurivoice/_help/help.html',
            'https://taku-o.github.io/myukkurivoice/_help/history.html',
            'https://taku-o.github.io/myukkurivoice/_help/license.html',
            'https://taku-o.github.io/myukkurivoice/_help/multivoice.html',
            'https://taku-o.github.io/myukkurivoice/_help/play.html',
            'https://taku-o.github.io/myukkurivoice/_help/shortcut.html',
            'https://taku-o.github.io/myukkurivoice/_help/trouble.html',
            'https://taku-o.github.io/myukkurivoice/_help/tuna.html',
            'https://taku-o.github.io/myukkurivoice/_help/uninstall.html',
            'https://taku-o.github.io/myukkurivoice/_help/update.html',
            'https://taku-o.github.io/myukkurivoice/_help/voicecode.html',
            'https://taku-o.github.io/myukkurivoice/_help/writing.html',
            'https://taku-o.github.io/myukkurivoice/assets/css/help.css',
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
            return fetch(e.request);
        }
    }));
});
