// audio-sentiment/utils/makeSineWav.ts
// tạo WAV PCM16 mono 16kHz: sine 440Hz – dùng cho nút Demo
export function makeSineWav(
  durationSec = 1,
  freq = 440,
  sampleRate = 16000
): Blob {
  const numSamples = Math.floor(durationSec * sampleRate);
  const bytesPerSample = 2;
  const blockAlign = 1 * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = numSamples * bytesPerSample;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  let o = 0;
  const writeStr = (s: string) => {
    for (let i = 0; i < s.length; i++) view.setUint8(o++, s.charCodeAt(i));
  };

  writeStr("RIFF");
  view.setUint32(o, 36 + dataSize, true);
  o += 4;
  writeStr("WAVE");
  writeStr("fmt ");
  view.setUint32(o, 16, true);
  o += 4;
  view.setUint16(o, 1, true);
  o += 2;
  view.setUint16(o, 1, true);
  o += 2;
  view.setUint32(o, sampleRate, true);
  o += 4;
  view.setUint32(o, byteRate, true);
  o += 4;
  view.setUint16(o, blockAlign, true);
  o += 2;
  view.setUint16(o, 16, true);
  o += 2;
  writeStr("data");
  view.setUint32(o, dataSize, true);
  o += 4;

  for (let n = 0; n < numSamples; n++) {
    const t = n / sampleRate;
    const s = Math.sin(2 * Math.PI * freq * t) * 0.4;
    const v = Math.max(-1, Math.min(1, s));
    view.setInt16(o, v * 32767, true);
    o += 2;
  }

  return new Blob([buffer], { type: "audio/wav" });
}
