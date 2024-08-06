import { getWeatherDataForChart } from './weathercard.js';

const ctx = document.querySelector('#myChart').getContext('2d');
const chartShowBtn = document.querySelector('.chart-show-link');
const chartCloseBtn = document.querySelector('.chart-hide-link');
const chartContainer = document.querySelector('.chart-main-container');

function chartDisplay() {
  chartShowBtn.parentElement.classList.toggle('is-closed');
  chartContainer.classList.toggle('is-closed');
  chartContainer.style.display = chartContainer.classList.contains('is-closed')
    ? 'none'
    : 'block';
}

chartShowBtn.addEventListener('click', chartDisplay);
chartCloseBtn.addEventListener('click', chartDisplay);

const average = values => {
  const sum = values.reduce((previous, current) => (current += previous));
  const avg = sum / values.length;
  return Number(avg.toFixed(1));
};

function getChartData(weather) {
  let chartData = {};
  chartData.days = weather.daysData.map(
    e => e.date.month + ' ' + e.date.day + ', ' + e.date.year
  );
  chartData.humidity = weather.daysData.map(e =>
    average(e.forecasts.map(i => i.humidity))
  );
  chartData.pressure = weather.daysData.map(e =>
    average(e.forecasts.map(i => i.pressure))
  );
  chartData.temperature = weather.daysData.map(e =>
    average(e.forecasts.map(i => i.temperature))
  );
  chartData.speed = weather.daysData.map(e =>
    average(e.forecasts.map(i => i.windSpeed))
  );
  let chartMain = {
    type: 'line',
    data: {
      labels: chartData.days,
      datasets: [
        {
          label: ' — Temperature, C°',
          backgroundColor: 'rgb(255, 107, 8)',
          borderColor: 'rgb(255, 107, 8)',
          data: chartData.temperature,
          fill: false,
        },
        {
          hidden: true,
          label: ' —  Humidity, %    ',
          backgroundColor: 'rgb(10, 6, 234)',
          borderColor: 'rgb(10, 6, 234)',
          data: chartData.humidity,
          fill: false,
        },
        {
          hidden: true,
          label: '—  Speed, m/s',
          backgroundColor: 'rgb(235, 155, 5)',
          borderColor: 'rgb(235, 155, 5)',
          data: chartData.speed,
          fill: false,
        },
        {
          hidden: true,
          label: ' —  Pressure, m/m',
          backgroundColor: 'rgb(5, 120, 6)',
          borderColor: 'rgb(5, 120, 6)',
          data: chartData.pressure,
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'AVERAGE:',
          color: 'rgba(255, 255, 255, 0.54)',
          align: 'start',
          position: 'top',
        },
        legend: {
          align: 'center',
          labels: {
            boxWidth: 12,
            boxHeight: 12,
            padding: 10,
            font: {
              size: 15,
            },
          },
        },
      },
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: '',
            color: '#911',
            font: {
              family: 'Comic Sans MS',
              size: 20,
              lineHeight: 1.2,
            },
            padding: { top: 20, left: 0, right: 0, bottom: 0 },
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.54)',
          },
          ticks: {
            color: 'rgba(255, 255, 255, 0.54)',
          },
        },
        y: {
          display: true,
          title: {
            display: true,
            text: 'Value of indicators',
            color: 'rgba(255, 255, 255, 0.54)',
            font: {
              family: 'Lato',
              size: 14,
              lineHeight: 1.2,
            },
            padding: { top: 30, left: 0, right: 0, bottom: 0 },
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.54)',
          },
          ticks: {
            color: 'rgba(255, 255, 255, 0.54)',
            min: -5.0,
            max: -1.0,
          },
        },
      },
    },
  };
  return chartMain;
}

let weatherChart;

function renderChart(weather) {
  if (weatherChart) {
    weatherChart.data.datasets = getChartData(weather).data.datasets;
    weatherChart.update();
  } else {
    let chartData = getChartData(weather);
    weatherChart = new Chart(ctx, chartData);
  }
  return weatherChart;
}

async function loadAndRenderChart(city) {
  const weatherData = await getWeatherDataForChart(city);
  if (weatherData) {
    renderChart(weatherData);
  }
}

export { chartDisplay, average, getChartData, renderChart, loadAndRenderChart };
