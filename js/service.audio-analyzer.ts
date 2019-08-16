
// angular audio service
angular.module('AudioAnalyzerServices', []);

// Web Audio API base AudioService
class AudioAnalyzerService implements yubo.AudioAnalyzerService {
  constructor(
  ) {}

  report(data: Uint8Array): void {
    const canvas = document.getElementById('canvas') as any;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = 'rgb(200, 200, 200)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgb(0, 0, 0)';

    ctx.beginPath();
    const sliceWidth = canvas.width * 1.0 / data.length;

    let x = 0;
    for (let i = 0; i < data.length; i++) {
      let v = data[i] / 128.0;
      let y = v * canvas.height / 2;

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
}
angular.module('AudioAnalyzerServices')
  .service('AudioAnalyzerService', [
    AudioAnalyzerService,
  ]);

