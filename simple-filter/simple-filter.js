const audioContext = new AudioContext()
const select = document.querySelector('#filter-selector')
const frequencyRange = document.querySelector('#frequency-range')
const currentFrequency = document.querySelector('#current-frequency')

let sourceNode = null
let filter = null

select.addEventListener('change', () => {
  disconnect(sourceNode)
  play(audioContext, sourceNode)
})

frequencyRange.addEventListener('change', () => {
  currentFrequency.value = frequencyRange.value
  disconnect(sourceNode)
  play(audioContext, sourceNode)
})

loadSound('../peels.mp3', audioContext)
  .then((buffer) => {
    sourceNode = getSourceNode(audioContext, buffer)
    play(audioContext, sourceNode)

    sourceNode.start(audioContext.currentTime)
  })

const getSourceNode = (audioContext, buffer) => {
  const source = audioContext.createBufferSource()

  source.buffer = buffer
  source.looping = true

  return source
}

const getFilter = (audioContext, type, frequency) => {
  const filter = audioContext.createBiquadFilter()

  filter.type = type
  filter.frequency.value = frequency

  return filter
}

const play = (audioContext, sourceNode) => {
  if (filter) {
    filter.disconnect()
  }

  filter = getFilter(audioContext, select.value, frequencyRange.value)

  sourceNode.connect(filter)
  filter.connect(audioContext.destination)
}

const disconnect = (sourceNode) => {
  sourceNode.disconnect()
  filter.disconnect()
}
