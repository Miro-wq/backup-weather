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
  const existingDetailedContainer = forecastContainer.querySelector('.detailed-forecast');

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

  const carouselItems = document.createElement('div');
  carouselItems.classList.add('carousel-items');

  for (let i = 1; i <= 7; i++) {
    const hourlyForecast = forecasts[index + i];
    if (hourlyForecast) {
      const hour = new Date(hourlyForecast.dt * 1000).getHours();
      const hourString = hour < 10 ? `0${hour}:00` : `${hour}:00`;
      const weatherIconUrl = getWeatherIconUrl(hourlyForecast.weather[0].icon);

      const hourlyCard = document.createElement('div');
      hourlyCard.classList.add('hourly-forecast-card');

      hourlyCard.innerHTML = `
        <h4 class="hourly">${hourString}</h4>
        <p class="hourly-icon"><img src="${weatherIconUrl}" alt="Weather Icon" /></p>
        <p class="hourly-temp">${Math.round(hourlyForecast.main.temp)}°</p>
        <p class="hourly-pressure">${hourlyForecast.main.pressure} mm</p>
        <p class="hourly-humidity">${hourlyForecast.main.humidity}%</p>
        <p class="hourly-wind">${hourlyForecast.wind.speed} m/s</p>
      `;

      carouselItems.appendChild(hourlyCard);
    }
  }

  const leftArrow = document.createElement('button');
  leftArrow.classList.add('carousel-arrow', 'left-arrow');
  leftArrow.innerHTML = '&lt;';
  leftArrow.addEventListener('click', () => scrollCarousel(-1));

  const rightArrow = document.createElement('button');
  rightArrow.classList.add('carousel-arrow', 'right-arrow');
  rightArrow.innerHTML = '&gt;';
  rightArrow.addEventListener('click', () => scrollCarousel(1));

  detailedContainer.appendChild(leftArrow);
  detailedContainer.appendChild(carouselItems);
  detailedContainer.appendChild(rightArrow);

  forecastContainer.appendChild(detailedContainer);

  fiveDaysContainer.classList.add('expanded');
  forecastElement.classList.add('expanded');

  // Ajustează înălțimea containerului
  forecastContainer.style.height = `${forecastContainer.scrollHeight}px`;

  let currentIndex = 0;

  function scrollCarousel(direction) {
    const maxIndex = Math.ceil(carouselItems.children.length / 3) - 1;
    currentIndex = Math.max(0, Math.min(currentIndex + direction, maxIndex));
    carouselItems.style.transform = `translateX(-${currentIndex * 70}%)`;
  }
}


function getWeatherIconUrl(iconCode) {
  return `https://openweathermap.org/img/wn/${iconCode}.png`;
}

export async function fetchAndDisplayWeatherForCity(city) {
  try {

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


//modiff Alex =========================================================================
export function switchToFiveDays() {
  const masterWeatherCard = document.querySelector('.master-weather-card');
  const fiveDaysContainer = document.querySelector('.five-days-container');

  // Eliminăm animațiile anterioare și aplicăm animația de ieșire pentru master-weather-card
  masterWeatherCard.classList.remove('slide-in');
  masterWeatherCard.classList.add('slide-out');

  // Așteptăm ca animația de ieșire să se termine
  setTimeout(() => {
    masterWeatherCard.style.display = 'none'; // Ascundem master-weather-card

    // Asigurăm că fiveDaysContainer nu este vizibil înainte de animație
    fiveDaysContainer.classList.remove('slide-in', 'slide-out');
    fiveDaysContainer.style.display = 'block'; // Afișăm five-days-container

    // Aplicăm animația de intrare pentru five-days-container
    fiveDaysContainer.classList.add('slide-in');
  }, 500); // Durata animației
}

export function switchToToday() {
  const masterWeatherCard = document.querySelector('.master-weather-card');
  const fiveDaysContainer = document.querySelector('.five-days-container');

  // Aplicăm animația de ieșire pentru five-days-container
  fiveDaysContainer.classList.remove('slide-in');
  fiveDaysContainer.classList.add('slide-out');

  // Așteptăm ca animația de ieșire să se termine
  setTimeout(() => {
    fiveDaysContainer.style.display = 'none'; // Ascundem five-days-container

    // Pregătim master-weather-card pentru intrare
    masterWeatherCard.classList.remove('slide-in', 'slide-out');
    masterWeatherCard.style.display = 'block'; // Afișăm master-weather-card

    // Aplicăm animația de intrare pentru master-weather-card
    masterWeatherCard.classList.add('slide-in');
  }, 500); // Durata animației
}
//=================================END=================================================