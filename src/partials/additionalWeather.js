import { getWeatherByCityName } from '../apiOpenWeather.js';
import { getAuthorByCity, getQuoteByAuthor } from '../quotesApi.js';

export async function fetchAdditionalWeatherData(city) {
  try {
    const weatherData = await getWeatherByCityName(city);
    updateAdditionalWeatherCard(weatherData);

    const authorData = await getAuthorByCity(city);
    const quote = await getQuoteByAuthor(authorData);
    updateQuote(quote, authorData.author);
  } catch (error) {
    console.error('Error fetching additional weather data:', error);
  }
}

function updateAdditionalWeatherCard(weatherData) {
  const weatherCard = document.getElementById('additional-weather-card');

  if (weatherCard) {
    // Actualizare timp și date
    const currentDate = new Date();
    weatherCard.querySelector('.current-date').textContent =
      currentDate.toLocaleDateString();
    weatherCard.querySelector('.current-time').textContent =
      currentDate.toLocaleTimeString();

    // Actualizare răsărit și apus
    const sunriseTime = new Date(
      weatherData.sys.sunrise * 1000
    ).toLocaleTimeString();
    const sunsetTime = new Date(
      weatherData.sys.sunset * 1000
    ).toLocaleTimeString();
    weatherCard.querySelector(
      '.sunrise-time'
    ).textContent = `Sunrise: ${sunriseTime}`;
    weatherCard.querySelector(
      '.sunset-time'
    ).textContent = `Sunset: ${sunsetTime}`;
  } else {
    console.error('Additional weather card element not found in the DOM');
  }
}

function updateQuote(quote, author) {
  const quoteCard = document.getElementById('quote-card');

  if (quoteCard) {
    quoteCard.querySelector('.quote-text').textContent = quote;
    quoteCard.querySelector('.quote-author').textContent = `— ${author}`;
  } else {
    console.error('Quote card element not found in the DOM');
  }
}
