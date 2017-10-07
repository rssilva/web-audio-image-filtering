class Filter {
  constructor (audioContext) {
    this.audioContext = audioContext
  }

  filterSignal (signal, type = 'highpass', frequency = 10000) {
    const node = this.audioContext.createBufferSource()
    const buffer = this.audioContext.createBuffer(1, signal.length, this.audioContext.sampleRate)
    const data = buffer.getChannelData(0)
    const processed = []

    const filter = this.audioContext.createBiquadFilter()
    filter.type = type
    filter.frequency.value = frequency
    // filter.Q.value = 0.2

    const processorNode = this.audioContext.createScriptProcessor(4096, 2, 2)

    const length = signal.length

    const promise = new Promise((resolve, reject) => {
      processorNode.onaudioprocess = this.onAudioProcess.bind(this, processed, processorNode, length, resolve)
    })

    for (let i = 0; i < length; i++) {
      data[i] = signal[i]
    }

    node.buffer = buffer
    node.connect(filter)
    // node.connect(this.audioContext.destination)
    filter.connect(processorNode)
    processorNode.connect(this.audioContext.destination)

    node.start(this.audioContext.currentTime)

    return promise
  }

  onAudioProcess (processed, processorNode, finalLength, resolve, ev) {
    const inputBuffer = ev.inputBuffer
    const inputData = inputBuffer.getChannelData(0)
    const length = inputData.length

    for (let sample = 0; sample < length; sample++) {
      processed.push(inputData[sample])
    }

    if (processed.length >= finalLength) {
      processorNode.disconnect()
      resolve(processed)
    }
  }
}
