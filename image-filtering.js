const canvas1 = document.querySelector('#canvas')
const context1 = canvas1.getContext('2d')

const canvasResult = document.querySelector('#canvas-result')
const contextResult = canvasResult.getContext('2d')

const RECORDED = []
let PROCESSOR
let TOTAL_SIZE = 0

const baseImage = new Image()
baseImage.src = 'lena.jpg'

baseImage.onload = () => {
  const { width, height } = context1.canvas
  context1.drawImage(baseImage, 0, 0, width, height)

  const imageData = context1.getImageData(0, 0, context1.canvas.width, context1.canvas.height)
  const splitted = splitRGB(imageData.data)

  TOTAL_SIZE = splitted.r.length
  playSignal(splitted.r, onAudioProcess)
}

const onAudioProcess = (ev) => {
  const inputBuffer = ev.inputBuffer
  const inputData = inputBuffer.getChannelData(0)
  const length = inputData.length

  for (let sample = 0; sample < length; sample++) {
    RECORDED.push( inputData[sample] )
  }

  if (RECORDED.length >= TOTAL_SIZE) {
    PROCESSOR.disconnect()
    plotFiltered(RECORDED, contextResult)
  }
}

const plotFiltered = (signal, plotContext) => {
  const { width, height } = plotContext.canvas

  const imgData = plotContext.getImageData(0, 0, width, height)
  const dataArr = new Uint8ClampedArray(imgData.data.length)

  for (let i = 0; i < imgData.data.length - 1; i += 4) {
    dataArr[i] = signal[Math.floor(i/4)] * 2
    dataArr[i + 1] = 0
    dataArr[i + 2] = 0
    dataArr[i + 3] = 255
  }

  imgData.data.set(dataArr)
  plotContext.putImageData(imgData, 0, 0)
}
