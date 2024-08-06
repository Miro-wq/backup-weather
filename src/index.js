import { initializeSearch } from './partials/searchBar';
import {
  initializeWeatherCard,
  fetchAndDisplayWeatherForCity,
} from './partials/weathercard.js';
import { loadAndRenderChart } from './partials/grafic.js';

document.addEventListener('DOMContentLoaded', async () => {
  initializeSearch();
  await initializeWeatherCard();
});
