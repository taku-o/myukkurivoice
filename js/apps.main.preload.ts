// pre loading required data before angularjs rendering.
var app = require('electron').remote.app;
var _monitor, monitor = () => { _monitor = _monitor || require('electron-performance-monitor'); return _monitor; };
var _log, log         = () => { _log = _log || require('electron-log'); return _log; };

var CONSOLELOG = process.env.CONSOLELOG != null;
var MONITOR = process.env.MONITOR != null;

// replace renderer console log
if (CONSOLELOG) {
  const remoteConsole = require('electron').remote.require('console');
  /* eslint-disable-next-line no-global-assign */
  console = remoteConsole;
}
// perfomance monitoring
if (MONITOR) { log().warn(monitor().format('apps.main', '---- start')); }

var dataJsonFile = `${app.getPath('userData')}/data.json`;
var dataJson: yubo.YVoice[] = null;
try {
  if (MONITOR) { log().warn(monitor().format('apps.main', 'pre load called')); }
  dataJson = require(dataJsonFile);
  if (MONITOR) { log().warn(monitor().format('apps.main', 'pre load done')); }
} catch (e) {
  dataJson = [];
}
delete require.cache[dataJsonFile];

