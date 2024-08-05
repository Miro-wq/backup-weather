import { initializeSearch } from './partials/searchBar';
import { initializeWeatherCard } from './partials/weathercard.js';
import { renderChart, weatherData } from './partials/grafic.js';

document.addEventListener('DOMContentLoaded', async () => {
  initializeSearch();
  initializeWeatherCard();
  renderChart(weatherData);
});
