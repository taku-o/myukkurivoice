// pre loading required data before angularjs rendering.
var app = require('electron').remote.app;
var _monitor :any, monitor = () => { _monitor = _monitor || require('electron-performance-monitor'); return _monitor; };
var _log :any, log         = () => { _log = _log || require('electron-log'); return _log; };

var CONSOLELOG = process.env.CONSOLELOG != null;
var MONITOR = process.env.MONITOR != null;

// replace renderer console log
if (CONSOLELOG) {
  const remoteConsole = require('electron').remote.require('console');
  /* eslint-disable-next-line no-global-assign */
  console = remoteConsole;
  delete log().transports['file'];
}
// perfomance monitoring
if (MONITOR) { log().warn(monitor().format('apps.main', '---- start')); }

// pre loading data.json
try {
  if (MONITOR) { log().warn(monitor().format('apps.main', 'pre load called')); }
  (window as any).dataJson = require(`${app.getPath('userData')}/data.json`);
  if (MONITOR) { log().warn(monitor().format('apps.main', 'pre load done')); }
} catch (e) {
  (window as any).dataJson = [];
}
delete require.cache[`${app.getPath('userData')}/data.json`];

