import { initializeSearch } from './partials/searchBar';
import { initializeWeatherCard } from './partials/weathercard.js';
import { fetchAdditionalWeatherData } from './partials/additionalWeather.js';

document.addEventListener('DOMContentLoaded', async () => {
  initializeSearch(); // Inițializează bara de căutare
  initializeWeatherCard(); // Inițializează cardul meteo și afișează datele pentru București
  fetchAdditionalWeatherData();
});
