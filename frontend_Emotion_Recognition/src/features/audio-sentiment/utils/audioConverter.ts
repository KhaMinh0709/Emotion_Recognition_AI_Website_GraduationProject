/**
 * Convert any audio file/blob to WAV format using Web Audio API
 * Supports: MP3, WebM, OGG, M4A, AAC, FLAC, etc.
 */

/**
 * Convert audio File or Blob to WAV format
 * @param input - Audio File or Blob (any format)
 * @returns WAV Blob
 */
export async function convertToWav(input: File | Blob): Promise<Blob> {
  try {
    // Read audio file as ArrayBuffer
    const arrayBuffer = await input.arrayBuffer();

    // Create AudioContext
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

    // Decode audio data
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    // Convert to WAV
    const wavBlob = audioBufferToWav(audioBuffer);

    // Close audio context to free resources
    await audioContext.close();

    return wavBlob;
  } catch (error) {
    console.error("Error converting audio to WAV:", error);
    throw new Error(`Cannot convert audio to WAV: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Convert AudioBuffer to WAV Blob
 * @param audioBuffer - AudioBuffer from Web Audio API
 * @returns WAV Blob
 */
function audioBufferToWav(audioBuffer: AudioBuffer): Blob {
  const numberOfChannels = audioBuffer.numberOfChannels;
  const sampleRate = audioBuffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;

  // Convert to mono if stereo
  let audioData: Float32Array;
  if (numberOfChannels === 2) {
    // Mix stereo to mono
    const left = audioBuffer.getChannelData(0);
    const right = audioBuffer.getChannelData(1);
    audioData = new Float32Array(left.length);
    for (let i = 0; i < left.length; i++) {
      audioData[i] = (left[i] + right[i]) / 2;
    }
  } else {
    // Already mono
    audioData = audioBuffer.getChannelData(0);
  }

  const dataLength = audioData.length * (bitDepth / 8);
  const buffer = new ArrayBuffer(44 + dataLength);
  const view = new DataView(buffer);

  // Write WAV header
  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + dataLength, true);
  writeString(view, 8, "WAVE");
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true); // fmt chunk size
  view.setUint16(20, format, true); // audio format (1 = PCM)
  view.setUint16(22, 1, true); // number of channels (mono)
  view.setUint32(24, sampleRate, true); // sample rate
  view.setUint32(28, sampleRate * (bitDepth / 8), true); // byte rate
  view.setUint16(32, bitDepth / 8, true); // block align
  view.setUint16(34, bitDepth, true); // bits per sample
  writeString(view, 36, "data");
  view.setUint32(40, dataLength, true);

  // Write audio data
  floatTo16BitPCM(view, 44, audioData);

  return new Blob([buffer], { type: "audio/wav" });
}

/**
 * Write string to DataView
 */
function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

/**
 * Convert Float32Array to 16-bit PCM
 */
function floatTo16BitPCM(view: DataView, offset: number, input: Float32Array) {
  for (let i = 0; i < input.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, input[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
}

/**
 * Get audio file info (for debugging)
 */
export async function getAudioInfo(input: File | Blob): Promise<{
  duration: number;
  sampleRate: number;
  numberOfChannels: number;
  length: number;
}> {
  const arrayBuffer = await input.arrayBuffer();
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  await audioContext.close();

  return {
    duration: audioBuffer.duration,
    sampleRate: audioBuffer.sampleRate,
    numberOfChannels: audioBuffer.numberOfChannels,
    length: audioBuffer.length,
  };
}

