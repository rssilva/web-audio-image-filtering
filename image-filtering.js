const canvas1 = document.querySelector('#canvas')
const context1 = canvas1.getContext('2d')

const canvasResult = document.querySelector('#canvas-result')
const contextResult = canvasResult.getContext('2d')

const imageFilter = new Filter(new AudioContext())

const baseImage = new Image()
baseImage.src = 'lena.jpg'

baseImage.onload = () => {
  const { width, height } = context1.canvas
  context1.drawImage(baseImage, 0, 0, width, height)

  const imageData = context1.getImageData(0, 0, context1.canvas.width, context1.canvas.height)
  const splitted = splitRGB(imageData.data)

  Promise.all([
    imageFilter.filterSignal(splitted.red, 'highpass', 4000),
    imageFilter.filterSignal(splitted.green, 'highpass', 4000),
    imageFilter.filterSignal(splitted.blue, 'highpass', 4000)
  ])
    .then((values) => {
      const arr = mountRGB({
        red: values[0],
        green: values[1],
        blue: values[2],
        alpha: splitted.alpha
      })
      console.log(arr)
      plotFiltered(arr, contextResult)
    })
}
