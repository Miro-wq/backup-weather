import { Chart, registerables } from 'chart.js';
import { getWeatherDataForChart } from './weathercard.js';

Chart.register(...registerables);

const ctx = document.querySelector('#myChart').getContext('2d');
const chartShowBtn = document.querySelector('.chart-show-link');
const chartCloseBtn = document.querySelector('.chart-hide-link');
const chartContainer = document.querySelector('.chart-main-container');
const chartShowButtonContainer = document.querySelector(
  '.chart-show-button-container'
);

function chartDisplay() {
  chartShowButtonContainer.classList.toggle('is-closed');
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
    weatherChart.update(); // Actualizăm graficul
  } else {
    let chartData = getChartData(weather);
    weatherChart = new Chart(ctx, chartData); // Pasăm canvas-ul și obiectul de configurare complet
  }
  return weatherChart;
}

export async function loadAndRenderChart(city) {
  const weatherData = await getWeatherDataForChart(city);
  renderChart(weatherData);
  chartShowButtonContainer.style.display = 'block'; // Afișăm butonul Show Chart
  chartContainer.style.display = 'none'; // Ne asigurăm că graficul este ascuns inițial
}

// Example of test data (you can remove this when using real data)
const testWeatherData = {
  daysData: [
    {
      date: { month: 'Feb', day: '9', year: '2020' },
      forecasts: [
        { humidity: 45, pressure: 1012, temperature: -5, windSpeed: 1.5 },
        { humidity: 47, pressure: 1013, temperature: -4.5, windSpeed: 1.8 },
      ],
    },
    {
      date: { month: 'Feb', day: '10', year: '2020' },
      forecasts: [
        { humidity: 50, pressure: 1014, temperature: -4, windSpeed: 2 },
        { humidity: 52, pressure: 1016, temperature: -3.5, windSpeed: 2.2 },
      ],
    },
    {
      date: { month: 'Feb', day: '11', year: '2020' },
      forecasts: [
        { humidity: 55, pressure: 1018, temperature: -3, windSpeed: 3 },
        { humidity: 57, pressure: 1020, temperature: -2.5, windSpeed: 3.5 },
      ],
    },
    {
      date: { month: 'Feb', day: '12', year: '2020' },
      forecasts: [
        { humidity: 60, pressure: 1022, temperature: -2, windSpeed: 4 },
        { humidity: 62, pressure: 1024, temperature: -1.5, windSpeed: 4.5 },
      ],
    },
    {
      date: { month: 'Feb', day: '13', year: '2020' },
      forecasts: [
        { humidity: 65, pressure: 1025, temperature: -1, windSpeed: 5 },
        { humidity: 67, pressure: 1027, temperature: -0.5, windSpeed: 5.5 },
      ],
    },
  ],
};
// Renderizamos el gráfico con los datos de prueba
renderChart(testWeatherData);
