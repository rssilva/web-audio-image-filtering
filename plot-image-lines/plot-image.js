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

  plot({
    signals: [imageData.data.slice(0, 200)],
    axis: axis.slice(0, 200),
    context: graphContext1,
    colors: ['orange']
  })

  const withoutAlpha = removeAlpha(imageData.data)

  plot({
    signals: [withoutAlpha.slice(0, 150)],
    axis: axis.slice(0, 150),
    context: graphContext2,
    colors: ['orange']
  })

  const splitted = splitRGB(imageData.data)

  plot({
    signals: [
      splitted.red.slice(0, 400),
      splitted.green.slice(0, 400),
      splitted.blue.slice(0, 400)
    ],
    axis: axis.slice(0, 400),
    context: graphContext3,
    colors: ['red', 'green', 'blue']
  })

  plot({
    signals: [
      splitted.red.slice(80000, 80400),
      splitted.green.slice(80000, 80400),
      splitted.blue.slice(80000, 80400)
    ],
    axis: axis.slice(0, 400),
    context: graphContext4,
    colors: ['red', 'green', 'blue']
  })
}
