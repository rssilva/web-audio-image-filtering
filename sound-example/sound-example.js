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
  const signal = buffer.getChannelData(0).slice(1100, 1200)

  filter.filterSignal(signal, 'highpass', 5000)
    .then((filtered) => {
      plot(signal, filtered)
    })

  const source = audioContext.createBufferSource()
  source.buffer = buffer

  source.connect(audioContext.destination)

  source.start(startTime)
  source.stop(startTime + 2)
}

const plot = (signal1, signal2) => {
  const canvas = document.querySelector('#canvas')
  const context = canvas.getContext('2d')
  const axis = []
  signal1.forEach((value, index) => axis.push(index))

  const chart = new Chart(context, {
    type: 'line',
    data: {
      labels: axis,
      datasets: [
        {
          data: signal1,
          borderWidth: 1,
          fill: false,
          borderColor: 'rgba(0, 200, 0, 1)'
        },
        {
          data: signal2,
          borderWidth: 1,
          fill: false,
          borderColor: 'rgba(200, 0, 0, 1)'
        }
      ]
    },
    options: {
      animation: {
        duration: 0
      },
      elements: {
        line: {
          tension: 0
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            suggestedMin: -0.0005,
            suggestedMax: 0.0005
          }
        }]
      }
    }
  })

  console.log(chart)
}

loadSound('../peels.mp3')
  .then((data) => {
    audioContext.decodeAudioData(
      data,
      (buffer) => playBuffer(buffer),
      (error) => console.error(error)
    )
  })
