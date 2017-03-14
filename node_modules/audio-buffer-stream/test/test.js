var test = require('tape')
var AudioBufferStream = require('../')
var AudioContext = global.AudioContext
var fs = require('fs')

var audioContext = new AudioContext()

test('2 channels, 32 bit', function (t) {
  var stream = AudioBufferStream({
    channels: 2,
    bitDepth: 32,
    sampleRate: audioContext.sampleRate
  })
  stream.pipe(fs.createWriteStream(__dirname + '/output.raw'))

  stream.on('finish', function () {
    fs.readFile(__dirname + '/output.raw', function (err, buffer) {
      t.not(err)
      t.ok(verifyOutput(buffer))
      t.end()
      quit()
    })
  })

  var count = 0
  var timer = setInterval(function () {
    count += 1
    stream.write(getAudioBuffer([-count, count], 256 * 8))
    if (count > 8) {
      clearInterval(timer)
      stream.end()
    }
  }, 30)
})

function getAudioBuffer (channelValues, length) {
  var audioBuffer = audioContext.createBuffer(channelValues.length, length, audioContext.sampleRate)
  for (var i = 0; i < channelValues.length; i++) {
    audioBuffer.getChannelData(i).fill(channelValues[i])
  }
  return audioBuffer
}

function quit () {
  require('remote').require('app').quit()
}

function bufferAsFloat32 (buffer) {
  return new Float32Array(new Uint8Array(buffer).buffer)
}

function verifyOutput (buffer) {
  var array = bufferAsFloat32(buffer)
  for (var i = 0; i < 8; i++) {
    for (var f = 0; f < 256 * 8; f++) {
      var offset = i * 256 * 8 * 2 + f * 2
      var val = i + 1
      if (array[offset] !== -val || array[offset + 1] !== val) {
        return false
      }
    }
  }
  return true
}
