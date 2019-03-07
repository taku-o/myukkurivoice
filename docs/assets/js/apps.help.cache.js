if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/myukkurivoice-preview/assets/js/apps.help.sw.js', {scope: "/myukkurivoice-preview/"})
    .then(function(registration) {
      console.log('serviceWorker registration successful', registration.scope);
    })
    .catch(function(error) {
      console.log('ServiceWorker registration failed', error);
    });
}
