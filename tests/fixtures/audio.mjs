export function makeWav(seconds = 12) {
  const rate = 8000;
  const samples = Math.round(rate * seconds);
  const wav = Buffer.alloc(44 + samples * 2);
  wav.write('RIFF', 0); wav.writeUInt32LE(wav.length - 8, 4);
  wav.write('WAVEfmt ', 8); wav.writeUInt32LE(16, 16);
  wav.writeUInt16LE(1, 20); wav.writeUInt16LE(1, 22);
  wav.writeUInt32LE(rate, 24); wav.writeUInt32LE(rate * 2, 28);
  wav.writeUInt16LE(2, 32); wav.writeUInt16LE(16, 34);
  wav.write('data', 36); wav.writeUInt32LE(samples * 2, 40);
  for (let i = 0; i < samples; i++) wav.writeInt16LE(Math.round(1000 * Math.sin(2 * Math.PI * 440 * i / rate)), 44 + i * 2);
  return wav;
}

// HTTP Range support is essential for testing actual HTMLMediaElement seeking.
export function fulfillAudio(route, body) {
  const headers = { 'accept-ranges': 'bytes' };
  const range = /^bytes=(\d+)-(\d*)$/.exec(route.request().headers().range ?? '');
  if (!range) return route.fulfill({ contentType: 'audio/wav', body, headers });
  const start = Number(range[1]);
  const end = Math.min(body.length - 1, range[2] ? Number(range[2]) : body.length - 1);
  if (start > end) return route.fulfill({ status: 416, headers: { 'content-range': `bytes */${body.length}` } });
  return route.fulfill({ status: 206, contentType: 'audio/wav',
    headers: { ...headers, 'content-range': `bytes ${start}-${end}/${body.length}` }, body: body.subarray(start, end + 1) });
}
