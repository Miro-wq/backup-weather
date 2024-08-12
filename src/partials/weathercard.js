import {
  getWeatherByCoordinates,
  getReverseGeocoding,
  getWeatherByCityName,
  getWeatherForecastByCityName,
} from '../apiOpenWeather.js';
import { setBackgroundForCity } from './backgroundImage.js';
import {
  fetchAdditionalWeatherData,
  hideAdditionalWeatherCard,
} from './additionalWeather.js';
import { loadAndRenderChart } from './grafic.js';

// Ascundem elementele inițial
const forecastContainer = document.getElementById('forecast-container');
const masterWeatherCard = document.querySelector('.weather-card');
const buttonContainer = document.querySelector('.button-container');
const fiveDaysContainer = document.querySelector('.five-days-container');
const hiddenButtonContainer = document.querySelector(
  '.button-container-hidden'
);

if (forecastContainer) {
  forecastContainer.style.display = 'none';
}
if (masterWeatherCard) {
  masterWeatherCard.style.display = 'none';
}
if (buttonContainer) {
  buttonContainer.style.display = 'none';
}
if (fiveDaysContainer) {
  fiveDaysContainer.style.display = 'none';
}
if (hiddenButtonContainer) {
  hiddenButtonContainer.style.display = 'none';
}

export function displayWeatherDataOnCard(data) {
  const cityNameElement = document.getElementById('city-name');
  const temperatureElement = document.getElementById('temperature');
  const descriptionElement = document.getElementById('description');
  const minTempElement = document.getElementById('min-temp');
  const maxTempElement = document.getElementById('max-temp');
  const chartContainer = document.getElementById('chart-container');

  if (
    cityNameElement &&
    temperatureElement &&
    descriptionElement &&
    minTempElement &&
    maxTempElement &&
    masterWeatherCard
  ) {
    cityNameElement.textContent = data.name;
    temperatureElement.textContent = `${Math.round(data.main.temp)}`;
    descriptionElement.innerHTML = `<img src="${getWeatherIconUrl(
      data.weather[0].icon
    )}" alt="${data.weather[0].description}" title="${
      data.weather[0].description
    }">`;
    minTempElement.textContent = `${Math.round(data.main.temp_min)} °C`;
    maxTempElement.textContent = `${Math.round(data.main.temp_max)} °C`;

    setBackgroundForCity(data.name);

    // Asigură-te că doar cardul de "today" este vizibil
    masterWeatherCard.style.display = 'block';
    buttonContainer.style.display = 'block';
    hiddenButtonContainer.style.display = 'none';
    forecastContainer.style.display = 'none';
    fiveDaysContainer.style.display = 'none';
    if (chartContainer) {
      chartContainer.style.display = 'none';
    }

    if (data.name) {
      fetchAdditionalWeatherData(data.name);
    } else {
      console.error('City name is undefined');
    }
  } else {
    console.error('Unul sau mai multe elemente nu au fost găsite în DOM');
  }
}

export function displayFiveDayForecast(data) {
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

      //ATENTIE CONTINE STILIZARI!!! A NU SE MODIFICA ===========================
      forecastElement.innerHTML = `
        <h3 class="date">${dayName}</h3>
        <p class="date">${dateString}</p>
        <img src="${getWeatherIconUrl(forecast.weather[0].icon)}" alt="${
        forecast.weather[0].description
      }">
      <div class="five-days-forecast">
        <p class="temp temp-min">${Math.round(forecast.main.temp_min)}°</p>
        <p class="temp temp-max">${Math.round(forecast.main.temp_max)}°</p>
        </div>
        <p class="more-info">more info</p>
      `;
//PANA AICI===========================================================================
      forecastElement
        .querySelector('.more-info')
        .addEventListener('click', () => {
          handleMoreInfoClick(forecastElement, data.list, index);
        });

      forecastContainer.appendChild(forecastElement);
    }
  });

  hideAdditionalWeatherCard();

  // Asigură-te că doar cardul "five days" este vizibil
  fiveDaysContainer.style.display = 'flex';
  forecastContainer.style.display = 'flex';
  hiddenButtonContainer.style.display = 'block';
  buttonContainer.style.display = 'none';
  masterWeatherCard.style.display = 'none';
  if (chartContainer) {
    chartContainer.style.display = 'block';
  }
}

function handleMoreInfoClick(forecastElement, forecasts, index) {
  const existingDetailedContainer =
    forecastContainer.querySelector('.detailed-forecast');

  if (existingDetailedContainer) {
    existingDetailedContainer.remove();
    forecastContainer.style.height = '';
    fiveDaysContainer.classList.remove('expanded');
    forecastElement.classList.remove('expanded');
    return;
  }

  const detailedElements = forecastContainer.querySelectorAll('.detailed-forecast');
detailedElements.forEach(element => element.remove());

const forecastElements = forecastContainer.querySelectorAll('.forecast-day');
forecastElements.forEach(element => element.classList.remove('expanded'));

const detailedContainer = document.createElement('div');
detailedContainer.classList.add('detailed-forecast');
detailedContainer.style.display = 'flex';
detailedContainer.style.flexWrap = 'wrap';
detailedContainer.style.justifyContent = 'space-around';
detailedContainer.style.width = '100%';
detailedContainer.style.marginTop = '20px';

for (let i = 1; i <= 7; i++) {
  const hourlyForecast = forecasts[index + i];
  if (hourlyForecast) {
    const hour = new Date(hourlyForecast.dt * 1000).getHours();
    const hourString = hour < 10 ? `0${hour}:00` : `${hour}:00`;
    const weatherIconUrl = getWeatherIconUrl(hourlyForecast.weather[0].icon);

    const hourlyCard = document.createElement('div');
    hourlyCard.classList.add('hourly-forecast-card');
    // hourlyCard.style.border = '1px solid rgba(255, 255, 255, 0.2)';
    // hourlyCard.style.borderRadius = '25px';
    // hourlyCard.style.width = '120px';
    // hourlyCard.style.height = '218px';
    // hourlyCard.style.margin = '5px';
    // hourlyCard.style.textAlign = 'center';
    // hourlyCard.style.boxSizing = 'border-box';

    hourlyCard.innerHTML = `
      <h4 class="hourly">${hourString}</h4>
      <p class="hourly-icon"><img src="${weatherIconUrl}" alt="Weather Icon" /></p>
      <p class="hourly-temp">${Math.round(hourlyForecast.main.temp)}°</p>
      <p class="hourly-pressure">${hourlyForecast.main.pressure} mm</p>
      <p class="hourly-humidity">${hourlyForecast.main.humidity}%</p>
      <p class="hourly-wind">${hourlyForecast.wind.speed} m/s</p>
    `;

    detailedContainer.appendChild(hourlyCard);
  }
}

forecastContainer.appendChild(detailedContainer);


  forecastContainer.appendChild(detailedContainer);
  fiveDaysContainer.classList.add('expanded');
  forecastElement.classList.add('expanded');

  forecastContainer.style.height = `${forecastContainer.scrollHeight}px`;
}

function getWeatherIconUrl(iconCode) {
  return `https://openweathermap.org/img/wn/${iconCode}.png`;
}

export async function fetchAndDisplayWeatherForCity(city) {
  try {
    // Resetează la "today" când se schimbă orașul
    resetToTodayView();

    const data = await getWeatherByCityName(city);
    displayWeatherDataOnCard(data);
    await loadAndRenderChart(data.name);
    return data.name;
  } catch (error) {
    console.error('Eroare la preluarea datelor meteo:', error);
  }
}

export async function fetchAndDisplayWeatherForLocation(lat, lon) {
  try {
    // Resetează la "today" când se schimbă locația
    resetToTodayView();

    const data = await getWeatherByCoordinates(lat, lon);
    const locationData = await getReverseGeocoding(lat, lon);
    data.name = locationData[0].name;
    displayWeatherDataOnCard(data);
    await loadAndRenderChart(data.name);
    return data.name;
  } catch (error) {
    console.error('Eroare la preluarea datelor meteo:', error);
  }
}

function resetToTodayView() {
  // Afișează vizualizarea "today"
  const todayButton = document.getElementById('today-weather');
  const fiveDayButton = document.getElementById('five-day-forecast');
  const weatherCardElement = document.getElementById('weather-card');
  const forecastContainer = document.getElementById('forecast-container');
  const forecastLocationElement = document.getElementById('forecast-location');
  const hiddenButtonContainer = document.querySelector(
    '.button-container-hidden'
  );

  if (todayButton) todayButton.classList.add('active');
  if (fiveDayButton) fiveDayButton.classList.remove('active');
  if (weatherCardElement) weatherCardElement.style.display = 'block';
  if (forecastContainer) forecastContainer.style.display = 'none';
  if (forecastLocationElement) forecastLocationElement.style.display = 'none';
  if (hiddenButtonContainer) hiddenButtonContainer.style.display = 'none';
}

export async function initializeWeatherCard() {
  document
    .getElementById('location-icon')
    .addEventListener('click', async () => {
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
            console.error('Eroare la obținerea locației:', error);
            const cityName = await fetchAndDisplayWeatherForCity('București');
            if (cityName) {
              loadAndRenderChart(cityName);
            }
          }
        );
      } else {
        console.error('Geolocația nu este suportată de acest browser');
        const cityName = await fetchAndDisplayWeatherForCity('București');
        if (cityName) {
          loadAndRenderChart(cityName);
        }
      }
    });

  const todayButton = document.getElementById('today-weather');
  const fiveDayButton = document.getElementById('five-day-forecast');
  const todayButtonForecast = document.getElementById('today-weather-forecast');
  const fiveDayButtonForecast = document.getElementById(
    'five-day-forecast-weather'
  );
  const forecastContainer = document.getElementById('forecast-container');
  const weatherCardElement = document.getElementById('weather-card');
  const hiddenButtonContainer = document.querySelector(
    '.button-container-hidden'
  );
  const forecastLocationElement = document.getElementById('forecast-location');

  if (todayButton) {
    todayButton.addEventListener('click', async () => {
      resetToTodayView();

      const city = document.getElementById('city-name').textContent;
      const cityName = await fetchAndDisplayWeatherForCity(city);
      todayButton.focus();
      if (forecastLocationElement) {
        forecastLocationElement.style.display = 'none';
      }
      if (weatherCardElement) {
        weatherCardElement.style.display = 'block';
      }
      if (cityName) {
        loadAndRenderChart(cityName);
      }
    });
  }

  if (todayButtonForecast) {
    todayButtonForecast.addEventListener('click', async () => {
      resetToTodayView();

      const city = document.getElementById('city-name').textContent;
      const cityName = await fetchAndDisplayWeatherForCity(city);
      todayButtonForecast.focus();
      if (forecastLocationElement) {
        forecastLocationElement.style.display = 'none';
      }
      if (forecastContainer) {
        forecastContainer.style.display = 'none';
      }
      if (weatherCardElement) {
        weatherCardElement.style.display = 'block';
      }
      if (cityName) {
        loadAndRenderChart(cityName);
      }

      // Ascunde butoanele din five-days-container și arată butoanele din master-weather-card
      hiddenButtonContainer.style.display = 'none';
      buttonContainer.style.display = 'block';
    });
  }

  if (fiveDayButton) {
    fiveDayButton.addEventListener('click', async () => {
      const city = document.getElementById('city-name').textContent;
      try {
        const data = await getWeatherForecastByCityName(city);
        displayFiveDayForecast(data);
        fiveDayButton.focus();
        if (weatherCardElement) {
          weatherCardElement.style.display = 'none';
        }
        if (forecastContainer) {
          forecastContainer.style.display = 'flex';
        }
      } catch (error) {
        console.error(
          'Eroare la preluarea datelor de prognoză pentru 5 zile:',
          error
        );
      }
    });
  }

  if (fiveDayButtonForecast) {
    fiveDayButtonForecast.addEventListener('click', async () => {
      const city = document.getElementById('city-name').textContent;
      try {
        const data = await getWeatherForecastByCityName(city);
        displayFiveDayForecast(data);
        fiveDayButtonForecast.focus();
        if (weatherCardElement) {
          weatherCardElement.style.display = 'none';
        }
        if (forecastContainer) {
          forecastContainer.style.display = 'flex';
        }
      } catch (error) {
        console.error(
          'Eroare la preluarea datelor de prognoză pentru 5 zile:',
          error
        );
      }

      // Arată butoanele din five-days-container și ascunde butoanele din master-weather-card
      hiddenButtonContainer.style.display = 'block';
      buttonContainer.style.display = 'none';
    });
  }
}

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
            pressure: entry.main.pressure,
            temperature: entry.main.temp,
            windSpeed: entry.wind.speed,
          })),
        })),
    };
    return formattedData;
  } catch (error) {
    console.error('Eroare la preluarea datelor pentru grafic:', error);
  }
}
