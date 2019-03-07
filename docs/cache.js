if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/myukkurivoice-preview/sw.js')
    .then(function(registration) {
      console.log('serviceWorker registration successful', registration.scope);
    })
    .catch(function(error) {
      console.log('ServiceWorker registration failed', error);
    });
}
