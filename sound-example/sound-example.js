const audioContext = new AudioContext()
const filter = new Filter(audioContext)

const loadSound = (path) => {
  const request = new XMLHttpRequest()
  request.open('GET', path, true)
  request.responseType = 'arraybuffer'

  const promise = new Promise((resolve, reject) => {
    request.onload = () => resolve(request.response)

    request.onerror = (error) => reject(error)
  })

  request.send()

  return promise
}

const playBuffer = (buffer) => {
  const startTime = audioContext.currentTime
  const signal = buffer.getChannelData(0).slice(1000, 1150)

  filter.filterSignal(signal, 'highpass', 15000)
    .then((filtered) => {
      plotGraph(signal, filtered)
    })

  const source = audioContext.createBufferSource()
  source.buffer = buffer

  source.connect(audioContext.destination)

  source.start(startTime)
  source.stop(startTime + 2)
}

const plotGraph = (signal, filtered) => {
  const context = document.querySelector('#canvas').getContext('2d')
  const axis = []

  signal.forEach((value, i) => { axis.push(i) })

  plot({
    signals: [signal, filtered],
    colors: ['orange', 'lightBlue'],
    axis,
    context,
    suggestedMin: 0,
    suggestedMax: 0.0005
  })
}

loadSound('../peels.mp3')
  .then((data) => {
    audioContext.decodeAudioData(
      data,
      (buffer) => {
        playBuffer(buffer)
      },
      (error) => console.error(error)
    )
  })
