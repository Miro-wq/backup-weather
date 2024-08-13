import { initializeSearch } from './partials/searchBar';
import {
  initializeWeatherCard,
  fetchAndDisplayWeatherForCity,
} from './partials/weathercard.js';
import { loadAndRenderChart } from './partials/grafic.js';

// Importăm funcțiile de animație
//import { switchToFiveDays, switchToToday } from './partials/animations.js';

document.addEventListener('DOMContentLoaded', async () => {
  initializeSearch();
  await initializeWeatherCard();

  // Adăugăm evenimentele pentru butoane
  document
    .getElementById('today-weather')
    .addEventListener('click', switchToToday);
  document
    .getElementById('five-day-forecast')
    .addEventListener('click', switchToFiveDays);
  document
    .getElementById('today-weather-forecast')
    .addEventListener('click', switchToToday);
  document
    .getElementById('five-day-forecast-weather')
    .addEventListener('click', switchToFiveDays);
});
