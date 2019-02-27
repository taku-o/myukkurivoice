// pre loading required data before angularjs rendering.
var app = require('electron').remote.app;
var _monitor, monitor = () => { _monitor = _monitor || require('electron-performance-monitor'); return _monitor; };
var _log, log         = () => { _log = _log || require('electron-log'); return _log; };

var MONITOR = process.env.MONITOR != null;

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

