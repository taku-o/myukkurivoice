"use strict";
var _fs, fs = function () { _fs = _fs || require('fs'); return _fs; };
var _temp, temp = function () { _temp = _temp || require('temp').track(); return _temp; };
var _WaveRecorder, WaveRecorder = function () { _WaveRecorder = _WaveRecorder || require('wave-recorder'); return _WaveRecorder; };
// angular audio service
angular.module('yvoiceAudioService', ['yvoiceMessageService', 'yvoiceUtilService'])
    .factory('AudioService1', ['$q', 'MessageService', function ($q, MessageService) {
        // Audio base AudioService
        var audio = null;
        return {
            play: function (bufWav, options, parallel) {
                if (parallel === void 0) { parallel = false; }
                var d = $q.defer();
                if (!bufWav) {
                    MessageService.syserror('再生する音源が渡されませんでした。');
                    d.reject(null);
                    return d.promise;
                }
                if (!parallel) {
                    if (audio) {
                        audio.pause();
                    }
                }
                var fsprefix = "_myubop" + Date.now().toString(36);
                temp().open(fsprefix, function (err, info) {
                    if (err) {
                        MessageService.syserror('一時作業ファイルを作れませんでした。', err);
                        d.reject(null);
                        return;
                    }
                    fs().writeFile(info.path, bufWav, function (err) {
                        if (err) {
                            MessageService.syserror('一時作業ファイルの書き込みに失敗しました。', err);
                            d.reject(err);
                            return;
                        }
                        var inAudio = null;
                        if (parallel) {
                            inAudio = new Audio('');
                        }
                        else {
                            audio = new Audio('');
                            inAudio = audio;
                        }
                        inAudio.autoplay = false;
                        inAudio.src = info.path;
                        inAudio.onended = function () {
                            d.resolve('ok');
                        };
                        inAudio.play();
                    });
                });
                return d.promise;
            },
            stop: function () {
                if (!audio) {
                    return;
                }
                audio.pause();
            },
            record: function (wavFilePath, bufWav, options) {
                var d = $q.defer();
                if (!wavFilePath) {
                    MessageService.syserror('音声ファイルの保存先が指定されていません。');
                    d.reject(null);
                    return d.promise;
                }
                if (!bufWav) {
                    MessageService.syserror('保存する音源が渡されませんでした。');
                    d.reject(null);
                    return d.promise;
                }
                fs().writeFile(wavFilePath, bufWav, function (err) {
                    if (err) {
                        MessageService.syserror('音声ファイルの書き込みに失敗しました。', err);
                        d.reject(err);
                        return;
                    }
                    d.resolve('ok');
                });
                return d.promise;
            }
        };
    }])
    .factory('AudioService2', ['$q', '$timeout', 'MessageService', 'AppUtilService',
    function ($q, $timeout, MessageService, AppUtilService) {
        // Web Audio API base AudioService
        // @ts-ignore
        var audioCtx = new window.AudioContext();
        var sourceNode = null;
        function toArrayBuffer(bufWav) {
            var aBuffer = new ArrayBuffer(bufWav.length);
            var view = new Uint8Array(aBuffer);
            for (var i = 0; i < bufWav.length; ++i) {
                view[i] = bufWav[i];
            }
            return aBuffer;
        }
        return {
            play: function (bufWav, options, parallel) {
                if (parallel === void 0) { parallel = false; }
                var d = $q.defer();
                if (!bufWav) {
                    MessageService.syserror('再生する音源が渡されませんでした。');
                    d.reject(null);
                    return d.promise;
                }
                if (!parallel) {
                    if (sourceNode) {
                        sourceNode.stop(0);
                        sourceNode = null;
                    }
                }
                var aBuffer = toArrayBuffer(bufWav);
                audioCtx.decodeAudioData(aBuffer).then(function (decodedData) {
                    // report duration
                    AppUtilService.reportDuration(decodedData.duration + (options.writeMarginMs / 1000.0));
                    // source
                    var inSourceNode = null;
                    if (parallel) {
                        inSourceNode = audioCtx.createBufferSource();
                    }
                    else {
                        sourceNode = audioCtx.createBufferSource();
                        inSourceNode = sourceNode;
                    }
                    inSourceNode.buffer = decodedData;
                    inSourceNode.onended = function () {
                        // onendedのタイミングでは出力が終わっていない
                        $timeout(function () {
                            d.resolve('ok');
                        }, options.writeMarginMs);
                    };
                    var nodeList = [];
                    // playbackRate
                    if (options.playbackRate && options.playbackRate != 1.0) {
                        inSourceNode.playbackRate.value = options.playbackRate;
                    }
                    // detune
                    if (options.detune && options.detune != 0) {
                        inSourceNode.detune.value = options.detune;
                    }
                    // gain
                    var gainNode = audioCtx.createGain();
                    gainNode.gain.value = options.volume;
                    nodeList.push(gainNode);
                    // connect
                    var lastNode = inSourceNode;
                    angular.forEach(nodeList, function (node) {
                        lastNode.connect(node);
                        lastNode = node;
                    });
                    lastNode.connect(audioCtx.destination);
                    // and start
                    inSourceNode.start(0);
                })["catch"](function (err) {
                    MessageService.syserror('音源の再生に失敗しました。', err);
                    d.reject(err);
                    return;
                });
                return d.promise;
            },
            stop: function () {
                if (sourceNode) {
                    sourceNode.stop(0);
                    sourceNode = null;
                }
            },
            record: function (wavFilePath, bufWav, options) {
                var d = $q.defer();
                if (!wavFilePath) {
                    MessageService.syserror('音声ファイルの保存先が指定されていません。');
                    d.reject(null);
                    return d.promise;
                }
                if (!bufWav) {
                    MessageService.syserror('保存する音源が渡されませんでした。');
                    d.reject(null);
                    return d.promise;
                }
                var aBuffer = toArrayBuffer(bufWav);
                audioCtx.decodeAudioData(aBuffer).then(function (decodedData) {
                    // report duration
                    AppUtilService.reportDuration(decodedData.duration + (options.writeMarginMs / 1000.0));
                    // source
                    var inSourceNode = audioCtx.createBufferSource();
                    inSourceNode.buffer = decodedData;
                    inSourceNode.onended = function () {
                        // onendedのタイミングでは出力が終わっていない
                        $timeout(function () {
                            recorder.end();
                            d.resolve('ok');
                        }, options.writeMarginMs);
                    };
                    var nodeList = [];
                    // playbackRate
                    if (options.playbackRate && options.playbackRate != 1.0) {
                        inSourceNode.playbackRate.value = options.playbackRate;
                    }
                    // detune
                    if (options.detune && options.detune != 0) {
                        inSourceNode.detune.value = options.detune;
                    }
                    // gain
                    var gainNode = audioCtx.createGain();
                    gainNode.gain.value = options.volume;
                    nodeList.push(gainNode);
                    // recorder
                    var recorder = WaveRecorder()(audioCtx, {
                        channels: 1,
                        bitDepth: 16
                    });
                    recorder.pipe(fs().createWriteStream(wavFilePath));
                    // connect
                    var lastNode = inSourceNode;
                    angular.forEach(nodeList, function (node) {
                        lastNode.connect(node);
                        lastNode = node;
                    });
                    lastNode.connect(recorder.input);
                    // and start
                    inSourceNode.start(0);
                })["catch"](function (err) {
                    MessageService.syserror('音源の再生に失敗しました。', err);
                    d.reject(err);
                    return;
                });
                return d.promise;
            }
        };
    }]);
