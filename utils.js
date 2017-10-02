const splitRGB = (data) => {
  const rgba = {
    r: [],
    g: [],
    b: [],
    a: []
  }

  for (let i = 0; i < data.length - 1; i += 4) {
    rgba.r.push(data[i])
    rgba.g.push(data[i + 1])
    rgba.b.push(data[i + 2])
    rgba.a.push(data[i + 3])
  }

  return rgba
}

const playSignal = (signal, callback) => {
  const audioContext = new AudioContext()
  const node = audioContext.createBufferSource()
  const buffer = audioContext.createBuffer(1, signal.length - 1, audioContext.sampleRate)
  const data = buffer.getChannelData(0)
  const gainOsc = audioContext.createGain()

  const processor = audioContext.createScriptProcessor(16384, 2, 2);
	processor.onaudioprocess = callback
  PROCESSOR = processor

  const filter = audioContext.createBiquadFilter()
  filter.type = 'highpass'
  filter.frequency.value = 5000
  // filter.Q.value = 0.2

  const length = signal.length

  for (let i = 0; i < length; i++) {
    data[i] = signal[i]
  }

  node.buffer = buffer
  node.connect(filter)
  // node.connect(audioContext.destination)
  filter.connect(processor)
  processor.connect(audioContext.destination)

  node.start(audioContext.currentTime)
}
