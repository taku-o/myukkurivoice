var Transform = require('stream').Transform
var extend = require('xtend')
module.exports = AudioBufferStream

function AudioBufferStream (opt) {
  var stream = new Transform(extend(opt, {
    writableObjectMode: true
  }))

  opt = extend({
    sampleRate: 44100,
    channels: 2,
    bitDepth: 32,
    chunkLength: 256,
    silenceDuration: null
  }, opt)

  var bytesPerChannel = opt.bitDepth / 8
  var bytesPerFrame = bytesPerChannel * opt.channels

  if (opt.bitDepth !== 32 && opt.bitDepth !== 16) {
    throw new Error('bitDepth must be either 16 or 32')
  }

  var onDone = null

  stream._write = function (audioBuffer, enc, done) {
    onDone = done
    var slices = audioBuffer.length / opt.chunkLength
    for (var i = 0; i < slices; i++) {
      var start = i * opt.chunkLength
      var end = (i + 1) * opt.chunkLength
      var slice = []
      for (var c = 0; c < opt.channels; c++) {
        var data = audioBuffer.getChannelData(c % audioBuffer.numberOfChannels)
        slice[c] = data.subarray(start, end)
      }
      enqueue(slice)
    }
  }

  var chunkId = 0
  var queue = []
  var silentFor = opt.silenceDuration || 0
  var processing = false

  function enqueue (data) {
    queue.push(data)
    if (!processing) {
      processing = true
      process.nextTick(nextChunk)
    }
  }

  function nextChunk () {
    var data = queue.shift()

    var isSilent = true
    var buffer = new Buffer(data[0].length * bytesPerFrame)
    for (var c = 0; c < opt.channels; c++) {
      var channel = data[c]
      var channelOffset = c * bytesPerChannel
      for (var i = 0; i < channel.length; i++) {
        var offset = i * bytesPerFrame + channelOffset

        if (opt.bitDepth === 32) {
          buffer.writeFloatLE(channel[i], offset)
        } else if (opt.bitDepth === 16) {
          write16BitPCM(buffer, offset, channel[i])
        }

        if (isSilent && hasSignal(channel[i])) {
          isSilent = false
        }
      }
    }

    if (isSilent) {
      silentFor += data[0].length / opt.sampleRate
    } else {
      silentFor = 0
    }

    if (!isSilent || !opt.silenceDuration || opt.silenceDuration > silentFor) {
      stream.push(buffer)
      stream.emit('chunk', chunkId, true)
    } else {
      stream.emit('chunk', chunkId, false)
    }

    chunkId += 1

    if (queue.length) {
      processing = true
      process.nextTick(nextChunk)
    } else {
      processing = false
      onDone && onDone()
    }
  }

  return stream
}

function write16BitPCM (output, offset, data) {
  var s = Math.max(-1, Math.min(1, data))
  output.writeInt16LE(Math.floor(s < 0 ? s * 0x8000 : s * 0x7FFF), offset)
}

function hasSignal (value) {
  return value > 0.0001 || value < -0.0001
}
