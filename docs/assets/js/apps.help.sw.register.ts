if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/assets/js/apps.help.sw.worker.js')
    .then((registration) => {
      console.log('serviceWorker registration successful', registration.scope);
    })
    .catch((error: Error) => {
      console.log('ServiceWorker registration failed', error);
    });
}
