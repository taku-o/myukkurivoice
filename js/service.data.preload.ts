var app = require('electron').remote.app;
var _monitor, monitor = () => { _monitor = _monitor || require('electron-performance-monitor'); return _monitor; };
var _log, log         = () => { _log = _log || require('electron-log'); return _log; };

var MONITOR = process.env.MONITOR != null;

var dataJsonFile = `${app.getPath('userData')}/data.json`;
var dataJson: yubo.YVoice[] = null;
try {
  if (MONITOR) { log().warn(monitor().format('s.data.pre', 'load json called')); }
  dataJson = require(dataJsonFile);
  delete require.cache[dataJsonFile];
  if (MONITOR) { log().warn(monitor().format('s.data.pre', 'load json done')); }
} catch (e) {
  dataJson = [];
}

