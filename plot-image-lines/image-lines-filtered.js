const canvas = document.querySelector('#canvas')
const context = canvas.getContext('2d')

const graphContext1 = document.querySelector('#graph').getContext('2d')
const graphContext2 = document.querySelector('#graph2').getContext('2d')
const graphContext3 = document.querySelector('#graph3').getContext('2d')
const graphContext4 = document.querySelector('#graph4').getContext('2d')

const baseImage = new Image()
baseImage.src = '../lena.jpg'

baseImage.onload = () => {
  const { width, height } = context.canvas

  context.drawImage(baseImage, 0, 0, width, height)

  const imageData = context.getImageData(0, 0, width, height)

  const axis = []

  imageData.data.forEach((val, i) => {
    axis.push(i)
  })

  const imageFilter = new Filter(new AudioContext())

  const splitted = splitRGB(imageData.data)

  imageFilter.filterSignal(splitted.red, 'highpass', 4000)
    .then((filtered) => {
      plot({
        signals: [
          splitted.red.slice(80000, 80400),
          filtered.slice(80000, 80400)
        ],
        axis: axis.slice(0, 400),
        context: graphContext1,
        colors: ['red', 'lightBlue']
      })
    })
}
