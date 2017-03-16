var WaveRecorder = require('./')
var WebFS = require('web-fs')

navigator.webkitTemporaryStorage.requestQuota(1024*1024*8, function(grantedBytes) {
  window.webkitRequestFileSystem(PERSISTENT, grantedBytes, onInit, onError)
})

function onInit(fileSystem){
  var fs = WebFS(fileSystem.root)
  var audioContext = new AudioContext()

  navigator.webkitGetUserMedia({audio:true}, function(stream) {
    
    // get the mic input
    var audioInput = audioContext.createMediaStreamSource(stream)
    var recorder = WaveRecorder(audioContext, {channels: 1})

    audioInput.connect(recorder.input)

    var filePath = 'test.wav'
    var fileStream = fs.createWriteStream(filePath)
    recorder.pipe(fileStream)

    // optionally go back and rewrite header with updated length
    recorder.on('header', function(header){ 

      fs.write(filePath, header, 0, header.length, 0, function(err){
        fs.readFile('test.wav', 'entry', function(err, entry){
          // play the file
          play(entry.toURL())
        })
      })

    })

    // record for 5 seconds then stop
    setTimeout(function(){
      recorder.end()
    }, 10000)

  }, onError)
}

function onError(err){
  throw err
}

function play(url){
  var player = document.createElement('audio')
  player.src = url
  player.autoplay = true
  document.body.appendChild(player)
}