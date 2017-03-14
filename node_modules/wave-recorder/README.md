wave-recorder
===

Pipe Web Audio API nodes into PCM Wave files.

## Install

```bash
$ npm install wave-recorder
```

## API

```js
var WaveRecorder = require('wave-recorder')
```

### `var recorder = WaveRecorder(options)`

Returns a stream. Pipe the stream to a file (you can use [web-fs](https://github.com/mmckegg/web-fs) or something similar).

#### options:
  - **`channels`**: (defaults to `2`)
  - **`bitDepth`**: can be `16` or `32` (defaults to `32`) 
  - **`silenceDuration`**: (optional) Specify the maximum duration (in seconds) of silence to record before pausing. Disabled if `0`.

### `recorder.input` (AudioNode)

Connect the audio you want to record to this node.

### `recorder.on('header', func)`

Called on every write with a new header containing an updated file length. You can write this to the start of the file, or ignore (most decoders can handle it, just the duration may appear incorrect).

## Example

```js
var WaveRecorder = require('wave-recorder')
var WebFS = require('web-fs')

navigator.webkitPersistentStorage.requestQuota(1024*1024, function(grantedBytes) {
  window.webkitRequestFileSystem(PERSISTENT, grantedBytes, onInit)
})

function onInit(fileSystem){
  var fs = WebFS(fileSystem.root)
  var audioContext = new AudioContext()

  navigator.webkitGetUserMedia({audio:true}, function(stream) {
    
    // get the mic input
    var audioInput = audioContext.createMediaStreamSource(stream)

    // create the recorder instance
    var recorder = WaveRecorder(audioContext, {
      channels: 2,
      bitDepth: 32
    })

    audioInput.connect(recorder.input)

    var filePath = 'test.wav'
    var fileStream = fs.createWriteStream(filePath)
    recorder.pipe(fileStream)

    // optionally go back and rewrite header with updated length
    recorder.on('header', function(header){ 
      var headerStream = fs.createWriteStream(path, {
        start: 0,
        flags: 'r+'
      })

      headerStream.write(header)
      headerStream.end()
    })

    // record for 10 seconds then stop
    setTimeout(function(){
      recorder.end()
    }, 10000)
  })
}
```