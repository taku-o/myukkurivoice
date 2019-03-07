self.addEventListener('install', (e) => {
  console.log('event install');
  e.waitUntil(
    caches.open('v1').then((cache) => {
      cache.addAll([
'https://taku-o.github.io/myukkurivoice-preview/cache.js',
'https://taku-o.github.io/myukkurivoice-preview/sw.js',
'https://taku-o.github.io/myukkurivoice-preview/assets/css/help.css',
'https://taku-o.github.io/myukkurivoice-preview/assets/icns/myukkurivoice.iconset/icon_256x256.png',
'https://taku-o.github.io/myukkurivoice-preview/assets/js/apps.help.js',
'https://taku-o.github.io/myukkurivoice-preview/assets/js/directive.include.js',
'https://taku-o.github.io/myukkurivoice-preview/assets/angular/angular.min.js',
'https://taku-o.github.io/myukkurivoice-preview/assets/angular/angular.min.js.map',
'https://taku-o.github.io/myukkurivoice-preview/assets/photon/dist/css/photon.css',
'https://taku-o.github.io/myukkurivoice-preview/assets/photon/dist/fonts/photon-entypo.woff',
'https://taku-o.github.io/myukkurivoice-preview/assets/photon/dist/fonts/photon-entypo.ttf',
      ])
    })
  )
});

self.addEventListener('fetch', (e) => {
  console.log('event fetch');
  e.respondWith(
    caches.match(e.request).then((response) => {
      if (response) {
  console.log('find cache');
  console.log(e.request);
          return response;
      } else {
  console.log('not find cache');
  console.log(e.request);
          return fetch(e.request);
      }
    })
  );
});
