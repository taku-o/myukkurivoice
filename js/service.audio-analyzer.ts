
// angular audio service
angular.module('AudioAnalyzerServices', []);

// Web Audio API base AudioService
class AudioAnalyzerService implements yubo.AudioAnalyzerService {
  public readonly FFT_SIZE: number = 1024;
  constructor(
  ) {}

  report(audioData: Uint8Array): void {
    // trim empty audio area
    const length = this.trimmedLength(audioData);
    const data = audioData.slice(0, length);

    // draw canvas
    const canvas = document.getElementById('canvas') as any;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = 'rgb(200, 200, 200)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgb(0, 0, 0)';

    ctx.beginPath();
    const sliceWidth = canvas.width * 1.0 / length;

    let x = 0;
    for (let i = 0; i < length; i++) {
      let v = data[i] / this.FFT_SIZE;
      let y = v * canvas.height;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      x += sliceWidth;
    }

    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
  }

  private trimmedLength(buffer: Uint8Array): number {
    let pos = 0;
    for (let i = buffer.length - 1; i >= 0; i--) {
      if (buffer[i] !== 0x00) {
        pos = i;
        break;
      }
    }
    return pos;
  }
}
angular.module('AudioAnalyzerServices')
  .service('AudioAnalyzerService', [
    AudioAnalyzerService,
  ]);

