self.addEventListener('install', (e: any/*ExtendableEvent*/) => {
  console.log('event install');
  e.waitUntil(
    caches.open('v1').then((cache) => {
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
        //'https://taku-o.github.io/myukkurivoice/assets/js/apps.help.js',
        //'https://taku-o.github.io/myukkurivoice/assets/js/directive.include.js',
        //'https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.6.6/angular.min.js',
        //'https://cdnjs.cloudflare.com/ajax/libs/photon/0.1.2-alpha/css/photon.css',
        //'https://cdnjs.cloudflare.com/ajax/libs/photon/0.1.2-alpha/fonts/photon-entypo.woff',
      ])
    })
  )
});

self.addEventListener('fetch', (e: any/*ExtendableEvent*/) => {
  console.log('event fetch');
  e.respondWith(
    caches.match(e.request).then((response) => {
      if (response) {
  console.log('find cache');
          return response;
          //return fetch(e.request);
      } else {
  console.log('not find cache');
          return fetch(e.request);
      }
    })
  );
});
