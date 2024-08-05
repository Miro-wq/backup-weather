import moment from 'moment-timezone';
import { getWeatherByCityName } from '../apiOpenWeather.js';
import { getAuthorByCity, getQuoteByAuthor } from '../quotesApi.js';
import { getTimeZoneByCoordinates } from '../timezoneApi.js';

export async function fetchAdditionalWeatherData(city) {
  try {
    const weatherData = await getWeatherByCityName(city);
    const timeZoneData = await getTimeZoneByCoordinates(
      weatherData.coord.lat,
      weatherData.coord.lon
    );
    updateAdditionalWeatherCard(weatherData, timeZoneData.zoneName);

    const authorData = await getAuthorByCity(city);
    const quote = await getQuoteByAuthor(authorData);
    updateQuote(quote, authorData.author);
  } catch (error) {
    console.error('Error fetching additional weather data:', error);
  }
}

function updateAdditionalWeatherCard(weatherData, timeZoneId) {
  const weatherCard = document.getElementById('additional-weather-card');

  if (weatherCard) {
    // Actualizare timp și date folosind fusul orar
    const currentDate = moment().tz(timeZoneId);
    weatherCard.querySelector('.current-date').textContent =
      currentDate.format('YYYY-MM-DD');
    weatherCard.querySelector('.current-time').textContent =
      currentDate.format('HH:mm:ss');

    // Actualizare răsărit și apus folosind fusul orar
    const sunriseTime = moment
      .unix(weatherData.sys.sunrise)
      .tz(timeZoneId)
      .format('HH:mm:ss');
    const sunsetTime = moment
      .unix(weatherData.sys.sunset)
      .tz(timeZoneId)
      .format('HH:mm:ss');
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
