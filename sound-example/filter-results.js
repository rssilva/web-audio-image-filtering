const context1 = document.querySelector('#canvas1').getContext('2d')
const context2 = document.querySelector('#canvas2').getContext('2d')
const context3 = document.querySelector('#canvas3').getContext('2d')
const audioContext = new AudioContext()
const filter = new Filter(audioContext)
const SAMPLE_RATE = 8000

let signal = []
const tAxis = []
const duration = 1
const increment = 1 / SAMPLE_RATE

for (let t = 0; t < duration; t += increment) {
  const value = Math.sin(6.283 * (50 + 500 * t) * t)

  signal.push(value)
  tAxis.push(t)
}

plot({
  context: context1,
  colors: ['orange'],
  suggestedMin: -1.2,
  suggestedMax: 1.2,
  signals: [signal],
  axis: tAxis.slice(0, 1500)
})

filter
  .filterSignal(signal, 'lowpass', 400, SAMPLE_RATE)
  .then((result) => {
    plot({
      context: context2,
      colors: ['orange', 'lightBlue'],
      suggestedMin: -1.2,
      suggestedMax: 1.2,
      signals: [signal, result],
      axis: tAxis.slice(0, 1500)
    })
  })

filter
  .filterSignal(signal, 'highpass', 700, SAMPLE_RATE)
  .then((result) => {
    plot({
      context: context3,
      colors: ['orange', 'lightBlue'],
      suggestedMin: -1.2,
      suggestedMax: 1.2,
      signals: [signal, result],
      axis: tAxis.slice(0, 1500)
    })
  })
