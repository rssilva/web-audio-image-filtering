const COLORS = {
  orange: 'rgba(247, 158, 2, 1)',
  red: 'rgba(255, 0, 0, 1)',
  green: 'rgba(0, 255, 0, 1)',
  blue: 'rgba(0, 0, 255, 1)',
  lightBlue: 'rgba(27, 156, 229, 1)'
}

const getDataSets = (signals, colors) => {
  const datasets = signals.map((signal, index) => {
    const colorName = colors[index]

    return {
      data: signal,
      borderWidth: 1,
      fill: false,
      borderColor: COLORS[colorName],
      pointRadius: 0
    }
  })

  return datasets
}

const plot = ({signals, axis, context, colors, suggestedMin = 0, suggestedMax = 255}) => {
  const chart = new Chart(context, {
    type: 'line',
    data: {
      labels: axis,
      datasets: getDataSets(signals, colors)
    },
    options: {
      axes: {
        display: 'none'
      },
      legend: {
        display: false
      },
      animation: {
        duration: 0
      },
      elements: {
        line: {
          tension: 0
        }
      },
      scales: {
        xAxes: [],
        yAxes: [{
          ticks: {
            suggestedMin,
            suggestedMax
          }
        }]
      }
    }
  })

  return chart
}
