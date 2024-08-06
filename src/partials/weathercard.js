import {
  getWeatherByCoordinates,
  getReverseGeocoding,
  getWeatherByCityName,
  getWeatherForecastByCityName,
} from '../apiOpenWeather.js';
import { setBackgroundForCity } from './backgroundImage.js';
import { fetchAdditionalWeatherData } from './additionalWeather.js';
import { loadAndRenderChart } from './grafic.js'; // Importăm funcția loadAndRenderChart

export function displayWeatherDataOnCard(data) {
  const cityNameElement = document.getElementById('city-name');
  const temperatureElement = document.getElementById('temperature');
  const descriptionElement = document.getElementById('description');
  const humidityElement = document.getElementById('humidity');
  const minTempElement = document.getElementById('min-temp');
  const maxTempElement = document.getElementById('max-temp');
  const weatherCardElement = document.getElementById('weather-card');
  const forecastContainer = document.getElementById('forecast-container');
  const chartContainer = document.getElementById('chart-container');

  if (
    cityNameElement &&
    temperatureElement &&
    descriptionElement &&
    humidityElement &&
    minTempElement &&
    maxTempElement &&
    weatherCardElement
  ) {
    cityNameElement.textContent = data.name;
    temperatureElement.textContent = `${Math.round(data.main.temp)}`;
    descriptionElement.innerHTML = `<img src="${getWeatherIconUrl(
      data.weather[0].icon
    )}" alt="${data.weather[0].description}" title="${
      data.weather[0].description
    }">`;
    humidityElement.textContent = `Humidity: ${data.main.humidity}%`;
    minTempElement.textContent = `${Math.round(data.main.temp_min)} °C`;
    maxTempElement.textContent = `${Math.round(data.main.temp_max)} °C`;

    setBackgroundForCity(data.name);

    if (forecastContainer) {
      forecastContainer.style.display = 'none';
    }
    if (chartContainer) {
      chartContainer.style.display = 'none';
    }

    // Verificăm dacă `data.name` este definit
    if (data.name) {
      fetchAdditionalWeatherData(data.name);
    } else {
      console.error('City name is undefined');
    }
  } else {
    console.error('One or more elements not found in the DOM');
  }
}

export function displayFiveDayForecast(data) {
  const forecastContainer = document.getElementById('forecast-container');
  const chartContainer = document.getElementById('chart-container');
  const forecastLocationElement = document.getElementById('forecast-location');

  forecastContainer.innerHTML = '';

  forecastLocationElement.textContent = data.city.name;
  forecastLocationElement.style.display = 'block';

  data.list.forEach((forecast, index) => {
    if (index % 8 === 0) {
      const forecastElement = document.createElement('div');
      forecastElement.classList.add('forecast-day');

      const date = new Date(forecast.dt * 1000);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
      const dateString = date.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
      });

      forecastElement.innerHTML = `
      
        <h3 class="date">${dayName}</h3>
        <p class="date">${dateString}</p>
        <img src="${getWeatherIconUrl(forecast.weather[0].icon)}" alt="${
        forecast.weather[0].description
      }">
        <p class="temp temp-min">${Math.round(forecast.main.temp_min)}°C</p>
        <p class="temp temp-max">${Math.round(forecast.main.temp_max)}°C</p>
        <p class="more-info">more info</p>
      `;

      forecastContainer.appendChild(forecastElement);
    }
  });

  if (forecastContainer) {
    forecastContainer.style.display = 'flex';
    forecastContainer.style.justifyContent = 'space-around';
  }
  if (chartContainer) {
    chartContainer.style.display = 'block';
  }
}

function getWeatherIconUrl(iconCode) {
  return `https://openweathermap.org/img/wn/${iconCode}.png`;
}

export async function fetchAndDisplayWeatherForCity(city) {
  try {
    const data = await getWeatherByCityName(city);
    displayWeatherDataOnCard(data);
    await loadAndRenderChart(data.name); // Actualizăm graficul cu numele orașului
    return data.name;
  } catch (error) {
    console.error('Error fetching weather data:', error);
  }
}

export async function fetchAndDisplayWeatherForLocation(lat, lon) {
  try {
    const data = await getWeatherByCoordinates(lat, lon);
    const locationData = await getReverseGeocoding(lat, lon);
    data.name = locationData[0].name;
    displayWeatherDataOnCard(data);
    await loadAndRenderChart(data.name); // Actualizăm graficul cu numele orașului
    return data.name;
  } catch (error) {
    console.error('Error fetching weather data:', error);
  }
}

export function initializeWeatherCard() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async position => {
        const { latitude, longitude } = position.coords;
        const cityName = await fetchAndDisplayWeatherForLocation(
          latitude,
          longitude
        );
        if (cityName) {
          loadAndRenderChart(cityName);
        }
      },
      async error => {
        console.error('Error getting location:', error);
        const cityName = await fetchAndDisplayWeatherForCity('București');
        if (cityName) {
          loadAndRenderChart(cityName);
        }
      }
    );
  } else {
    console.error('Geolocation is not supported by this browser');
    fetchAndDisplayWeatherForCity('București').then(cityName => {
      if (cityName) {
        loadAndRenderChart(cityName);
      }
    });
  }

  const todayButton = document.getElementById('today-weather');
  const fiveDayButton = document.getElementById('five-day-forecast');
  const showChartButton = document.getElementById('show-chart');
  const chartContent = document.getElementById('chart-content');
  const forecastLocationElement = document.getElementById('forecast-location');

  if (todayButton) {
    todayButton.addEventListener('click', async () => {
      const city = document.getElementById('city-name').textContent;
      const cityName = await fetchAndDisplayWeatherForCity(city);
      todayButton.focus();
      if (forecastLocationElement) {
        forecastLocationElement.style.display = 'none';
      }
      if (cityName) {
        loadAndRenderChart(cityName);
      }
    });
  }

  if (fiveDayButton) {
    fiveDayButton.addEventListener('click', async () => {
      const city = document.getElementById('city-name').textContent;
      try {
        const data = await getWeatherForecastByCityName(city);
        displayFiveDayForecast(data);
        fiveDayButton.focus();
      } catch (error) {
        console.error('Error fetching 5-day forecast data:', error);
      }
    });
  }

  if (showChartButton) {
    showChartButton.addEventListener('click', () => {
      chartContent.innerHTML = '<p>Aici va fi afișat graficul cu vremea.</p>';
      showChartButton.focus();
    });
  }
}

// Noua funcție pentru a exporta datele pentru grafic
export async function getWeatherDataForChart(city) {
  try {
    const data = await getWeatherForecastByCityName(city);
    const formattedData = {
      daysData: data.list
        .filter((_, index) => index % 8 === 0)
        .map((forecast, index) => ({
          date: {
            month: new Date(forecast.dt * 1000).toLocaleString('en-US', {
              month: 'short',
            }),
            day: new Date(forecast.dt * 1000).getDate(),
            year: new Date(forecast.dt * 1000).getFullYear(),
          },
          forecasts: data.list.slice(index * 8, (index + 1) * 8).map(entry => ({
            humidity: entry.main.humidity,
            pressure: entry.main.pressure,
            temperature: entry.main.temp,
            windSpeed: entry.wind.speed,
          })),
        })),
    };
    return formattedData;
  } catch (error) {
    console.error('Error fetching weather data for chart:', error);
  }
}
