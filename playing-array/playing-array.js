// Let's add a canvas to see the graphs, a textarea to write the equation
//  and a button to start playing
const context = document.querySelector('#canvas').getContext('2d')
const textArea = document.querySelector('#function-area')
const button = document.querySelector('#play-button')

const audioContext = new AudioContext()

const SAMPLE_RATE = 3000

// Setting the duration interval in seconds which the sound will be played
const duration = 1

// Time increment is the interval between each sample
//  so we are determining that each second will have 3000 values
const increment = 1 / SAMPLE_RATE

// on every button click
button.addEventListener('click', () => {
  let signal = []
  let axis = []

  // t will have the time in seconds
  for (let t = 0; t < duration - increment; t += increment) {
    // maybe the JS 👮 will arrest me for this, but let's get the string on the textArea
    // and use eval to calculate the amplitude
    const value = eval(textArea.value.trim())

    // then we store it to the signal array
    signal.push(value)
    axis.push(t)
  }

  // and let's call the playSignal function that was explained earlier
  playSignal(signal, audioContext, SAMPLE_RATE)

  // then we plot to the canvas
  plot({
    context,
    axis: axis.slice(0, 100),
    signals: [signal],
    colors: ['orange'],
    suggestedMin: -1,
    suggestedMax: 1
  })
})
