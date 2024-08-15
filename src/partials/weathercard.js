
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

// Elemente globale reutilizabile
const forecastContainer = document.getElementById('forecast-container');
const masterWeatherCard = document.querySelector('.weather-card');
const buttonContainer = document.querySelector('.button-container');
const fiveDaysContainer = document.querySelector('.five-days-container');
const hiddenButtonContainer = document.querySelector(
  '.button-container-hidden'
);

// Ascunde toate elementele la inițializarea paginii
function hideInitialElements() {
  toggleElementDisplay(forecastContainer, 'none');
  toggleElementDisplay(masterWeatherCard, 'none');
  toggleElementDisplay(buttonContainer, 'none');
  toggleElementDisplay(fiveDaysContainer, 'none');
  toggleElementDisplay(hiddenButtonContainer, 'none');
}

// Funcție de utilitate pentru a schimba vizibilitatea elementelor
function toggleElementDisplay(element, displayStyle) {
  if (element) {
    element.style.display = displayStyle;
  }
}

// Funcție de utilitate pentru a adăuga animații la afișarea elementelor
function addAnimation(element, animationName) {
  element.classList.add('animate__animated', animationName);
  element.addEventListener('animationend', () => {
    element.classList.remove('animate__animated', animationName);
  });
}

// Funcție pentru a afișa datele meteo curente pe card
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

    // Afișează elementele relevante cu animații
    toggleElementDisplay(masterWeatherCard, 'block');
    addAnimation(masterWeatherCard, 'animate__fadeInUp');

    toggleElementDisplay(buttonContainer, 'block');
    addAnimation(buttonContainer, 'animate__fadeInUp');

    toggleElementDisplay(hiddenButtonContainer, 'none');
    toggleElementDisplay(forecastContainer, 'none');
    toggleElementDisplay(fiveDaysContainer, 'none');
    toggleElementDisplay(chartContainer, 'none');

    fetchAdditionalWeatherData(data.name);
  } else {
    console.error('Unul sau mai multe elemente nu au fost găsite în DOM');
  }
}

// ------ Codul pentru funcția displayFiveDayForecast ------
export function displayFiveDayForecast(data) {
  const chartContainer = document.getElementById('chart-container');
  const forecastLocationElement = document.getElementById('forecast-location');

  forecastContainer.innerHTML = ''; // Resetează conținutul containerului

  forecastLocationElement.textContent = data.city.name;
  toggleElementDisplay(forecastLocationElement, 'block');

  // Creăm containerul pentru carduri cu overflow și săgețile
  const overflowContainer = document.createElement('div');
  overflowContainer.classList.add('overflow-five-days-container');

  const leftArrow = document.createElement('button');
  leftArrow.classList.add('arrow', 'arrow-left');
  leftArrow.innerHTML = '&#9664;';

  const rightArrow = document.createElement('button');
  rightArrow.classList.add('arrow', 'arrow-right');
  rightArrow.innerHTML = '&#9654;';

  const cardsContainer = document.createElement('div');
  cardsContainer.classList.add('overflow-five-days');

  // Adăugăm săgețile și containerul de carduri în containerul de overflow
  overflowContainer.appendChild(leftArrow);
  overflowContainer.appendChild(cardsContainer);
  overflowContainer.appendChild(rightArrow);

  // Adăugăm containerul de overflow în forecastContainer
  forecastContainer.appendChild(overflowContainer);

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
      <div class="five-days-forecast">
        <p class="temp temp-min">${Math.round(forecast.main.temp_min)}°</p>
        <p class="temp temp-max">${Math.round(forecast.main.temp_max)}°</p>
        </div>
        <p class="more-info">more info</p>
      `;

      forecastElement
        .querySelector('.more-info')
        .addEventListener('click', () => {
          handleMoreInfoClick(forecastElement, data.list, index);
        });

      // Adăugăm cardurile în containerul de overflow
      cardsContainer.appendChild(forecastElement);
    }
  });

  hideAdditionalWeatherCard();

  // Afișează elementele relevante cu animații
  toggleElementDisplay(fiveDaysContainer, 'flex');
  addAnimation(fiveDaysContainer, 'animate__fadeInUp');

  toggleElementDisplay(forecastContainer, 'flex');
  addAnimation(forecastContainer, 'animate__fadeInUp');

  toggleElementDisplay(hiddenButtonContainer, 'block');
  addAnimation(hiddenButtonContainer, 'animate__fadeInUp');

  toggleElementDisplay(buttonContainer, 'none');
  toggleElementDisplay(masterWeatherCard, 'none');
  if (chartContainer) {
    toggleElementDisplay(chartContainer, 'block');
    addAnimation(chartContainer, 'animate__fadeInUp');
  }

  // --- Codul pentru gestionarea scroll-ului ---
  let scrollAmount = 0;
  const scrollStep = overflowContainer.clientWidth / 2;

  rightArrow.addEventListener('click', () => {
    const maxScroll =
      cardsContainer.scrollWidth - overflowContainer.clientWidth;
    scrollAmount += scrollStep;
    if (scrollAmount > maxScroll) scrollAmount = maxScroll;
    cardsContainer.style.transform = `translateX(-${scrollAmount}px)`;
    updateArrows();
  });

  leftArrow.addEventListener('click', () => {
    scrollAmount -= scrollStep;
    if (scrollAmount < 0) scrollAmount = 0;
    cardsContainer.style.transform = `translateX(-${scrollAmount}px)`;
    updateArrows();
  });

  function updateArrows() {
    leftArrow.disabled = scrollAmount === 0;
    rightArrow.disabled =
      scrollAmount >=
      cardsContainer.scrollWidth - overflowContainer.clientWidth;
  }

  updateArrows(); // La inițializare

  // --- Sfârșitul codului pentru gestionarea scroll-ului ---
}

// ------ Codul pentru funcția handleMoreInfoClick ------
function handleMoreInfoClick(forecastElement, forecasts, index) {
  const existingDetailedContainer =
    forecastContainer.querySelector('.detailed-forecast');

  if (existingDetailedContainer) {
    existingDetailedContainer.remove();
    forecastContainer.style.height = 'auto';
    fiveDaysContainer.classList.remove('expanded');
    forecastElement.classList.remove('expanded');
    return;
  }

  const detailedElements =
    forecastContainer.querySelectorAll('.detailed-forecast');
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
  forecastContainer.style.height = 'auto';

  let currentIndex = 0;

  function scrollCarousel(direction) {
    const maxIndex = Math.ceil(carouselItems.children.length / 3) - 1;
    currentIndex = Math.max(0, Math.min(currentIndex + direction, maxIndex));
    carouselItems.style.transform = `translateX(-${currentIndex * 70}%)`;
  }
}

// Funcție pentru a obține și afișa datele meteo pentru un oraș specific
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

// Funcție pentru a obține și afișa datele meteo pe baza coordonatelor geografice
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

// Funcție pentru a reseta vizualizarea la datele meteo de azi
function resetToTodayView() {
  toggleElementDisplay(masterWeatherCard, 'none');
  toggleElementDisplay(forecastContainer, 'none');
  toggleElementDisplay(hiddenButtonContainer, 'none');

  const todayButton = document.getElementById('today-weather');
  const fiveDayButton = document.getElementById('five-day-forecast');
  if (todayButton) todayButton.classList.add('active');
  if (fiveDayButton) fiveDayButton.classList.remove('active');
}

// Inițializează cardul meteo și evenimentele asociate acestuia
export async function initializeWeatherCard() {
  hideInitialElements(); // Asigură-te că toate elementele sunt ascunse inițial

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

  addButtonEventListeners();
}

// Adaugă evenimente pentru butoanele din pagină
function addButtonEventListeners() {
  const todayButton = document.getElementById('today-weather');
  const fiveDayButton = document.getElementById('five-day-forecast');
  const todayButtonForecast = document.getElementById('today-weather-forecast');
  const fiveDayButtonForecast = document.getElementById(
    'five-day-forecast-weather'
  );
  const forecastLocationElement = document.getElementById('forecast-location');

  if (todayButton) {
    todayButton.addEventListener('click', async () => {
      resetToTodayView();
      const city = document.getElementById('city-name').textContent;
      const cityName = await fetchAndDisplayWeatherForCity(city);
      todayButton.focus();
      toggleElementDisplay(forecastLocationElement, 'none');
      toggleElementDisplay(masterWeatherCard, 'block');
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
      toggleElementDisplay(forecastLocationElement, 'none');
      toggleElementDisplay(forecastContainer, 'none');
      toggleElementDisplay(masterWeatherCard, 'block');
      if (cityName) {
        loadAndRenderChart(cityName);
      }

      toggleElementDisplay(hiddenButtonContainer, 'none');
      toggleElementDisplay(buttonContainer, 'block');
    });
  }

  if (fiveDayButton) {
    fiveDayButton.addEventListener('click', async () => {
      const city = document.getElementById('city-name').textContent;
      try {
        const data = await getWeatherForecastByCityName(city);
        displayFiveDayForecast(data);
        fiveDayButton.focus();
        toggleElementDisplay(masterWeatherCard, 'none');
        toggleElementDisplay(forecastContainer, 'flex');
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
        toggleElementDisplay(masterWeatherCard, 'none');
        toggleElementDisplay(forecastContainer, 'flex');
      } catch (error) {
        console.error(
          'Eroare la preluarea datelor de prognoză pentru 5 zile:',
          error
        );
      }

      toggleElementDisplay(hiddenButtonContainer, 'block');
      toggleElementDisplay(buttonContainer, 'none');
    });
  }
}

// Funcție pentru a obține datele meteo formatate pentru grafic
export async function getWeatherDataForChart(city) {
  try {
    const data = await getWeatherForecastByCityName(city);
    return formatWeatherDataForChart(data);
  } catch (error) {
    console.error('Eroare la preluarea datelor pentru grafic:', error);
  }
}

// Formatează datele meteo pentru a fi afișate în grafic
function formatWeatherDataForChart(data) {
  return {
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
}

// Funcție pentru a obține URL-ul pentru iconița meteo
function getWeatherIconUrl(iconCode) {
  return `https://openweathermap.org/img/wn/${iconCode}.png`;
}

// Inițializare
initializeWeatherCard();
