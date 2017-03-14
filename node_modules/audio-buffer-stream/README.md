audio-buffer-stream
===

Get a PCM stream from input AudioBuffers (Web Audio API). Can be used to implement a streaming audio recorder.

## Install via [npm](https://www.npmjs.com/package/audio-buffer-stream)

```bash
$ npm install audio-buffer-stream
```

## API

```js
var AudioBufferStream = require('audio-buffer-stream')
```

### `var stream = AudioBufferStream(opts)`

Create a transform stream that accepts AudioBuffer objects written in and outputs a raw PCM stream as buffers.

#### `opts`
- `bitDepth`: specify the bit depth of the output stream (`16` or `32`)
- `channels`: number of channels interleaved in the output stream (defaults `2`)
- `chunkLength`: avoid tying up the event loop by specifying a max per tick (defaults `256`)
- `opt.silenceDuration`: when specified (`> 0`) will remove silences greater than specified in seconds.

### `stream.write(audioBuffer)`

### `stream.pipe(destination, opts)`

### `stream.end()`

## License

MIT
