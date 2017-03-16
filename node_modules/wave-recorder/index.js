var WaveStream = require('wav/lib/writer')
var AudioBufferStream = require('audio-buffer-stream')
var Buffer = require('buffer').Buffer
var util = require('util')
var extend = require('xtend')

module.exports = WaveRecorder
util.inherits(WaveRecorder, WaveStream);

function WaveRecorder(audioContext, opt) {
  if (!(this instanceof WaveRecorder)){
    return new WaveRecorder(audioContext, opt)
  }

  var self = this
  opt = extend({
    sampleRate: audioContext.sampleRate,
    channels: 2,
    bitDepth: 32,
    chunkLength: 256,
    bufferLength: 8192,
    silenceDuration: null
  }, opt)

  WaveStream.call(this, {
    sampleRate: audioContext.sampleRate,
    bitDepth: opt.bitDepth,
    channels: opt.channels,
    format: opt.bitDepth === 32 ? 3 : 1
  })

  var audioStream = AudioBufferStream(opt)
  audioStream.pipe(self)
  audioStream.on('chunk', self.emit.bind(self, 'chunk'))

  this.input = audioContext.createScriptProcessor(opt.bufferLength, opt.channels, 1)
  this.input.onaudioprocess = function (e) {
    audioStream.write(e.inputBuffer)
  }

  this.on('end', function(){
    self.input.onaudioprocess = null
    self.input = null
  })

  // required to make data flow, will be 0
  this.input.connect(audioContext.destination)
}
