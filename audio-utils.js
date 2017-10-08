const playSignal = (signal = [], audioContext, sampleRate) => {
  const signalLength = signal.length

  // This node will be used as the source to play the signal
  const node = audioContext.createBufferSource()

  // Let's create the buffer to be assigned to the above node
  // The arguments are: the number of channels, the length of the buffer, which
  //  is the same from the signal and the sample rate
  // Sample Rate is basically how many samples the sound array contains per second
  //  if sample rate is 3000 and you want to build a signal with 2 seconds, you'll need
  //  an array with length equals to 6000
  const buffer = audioContext.createBuffer(1, signalLength, sampleRate)

  // This is the data on the buffer, as we created an empty one, this a empty array so far
  const data = buffer.getChannelData(0)

  // Let's write the values from our signal to the buffer...
  for (let i = 0; i < signalLength; i += 1) {
    data[i] = signal[i]
  }

  // then assign the buffer to the node.buffer prop
  node.buffer = buffer

  // let's connect the buffer to the audioContext.destination, which means the speakers
  //  audioContext is the context that you need to handle all this fancy stuff Web Audio API related :)
  node.connect(audioContext.destination)

  // now we start to play!
  node.start(audioContext.currentTime)
}

const loadSound = (path, audioContext) => {
  const request = new XMLHttpRequest()
  request.open('GET', path, true)
  request.responseType = 'arraybuffer'

  const promise = new Promise((resolve, reject) => {
    request.onload = () => {
      audioContext.decodeAudioData(
        request.response,
        (buffer) => resolve(buffer),
        (error) => console.error(error)
      )
    }

    request.onerror = (error) => reject(error)
  })

  request.send()

  return promise
}

const playBuffer = (buffer, audioContext) => {
  const startTime = audioContext.currentTime

  const source = audioContext.createBufferSource()
  source.buffer = buffer

  source.connect(audioContext.destination)

  source.start(startTime)
  source.stop(startTime + 2)
}
