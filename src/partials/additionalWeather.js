import moment from 'moment-timezone';
import { getWeatherByCityName } from '../apiOpenWeather.js';
import { getAuthorByCity, getQuoteByAuthor } from '../quotesApi.js';
import { getTimeZoneByCoordinates } from '../timezoneApi.js';

export async function fetchAdditionalWeatherData(city) {
  if (!city) {
    console.error('City is not defined');
    return;
  }

  try {
    const weatherData = await getWeatherByCityName(city);
    if (!weatherData || !weatherData.coord) {
      console.error('Invalid weather data received');
      return;
    }

    const timeZoneData = await getTimeZoneByCoordinates(
      weatherData.coord.lat,
      weatherData.coord.lon
    );
    updateAdditionalWeatherCard(weatherData, timeZoneData.zoneName);

    const authorData = await getAuthorByCity(city);
    if (!authorData) {
      updateQuote('Quote not found', 'Author not found');
      return;
    }
    const quote = await getQuoteByAuthor(authorData);
    if (!quote) {
      updateQuote('Quote not found', authorData.author);
      return;
    }
    updateQuote(quote, authorData.author);
  } catch (error) {
    console.error('Error fetching additional weather data:', error);
    updateQuote('Quote not found', 'Author not found');
  }
}

function updateAdditionalWeatherCard(weatherData, timeZoneId) {
  const weatherCard = document.getElementById('additional-weather-card');

  if (weatherCard) {
    const currentDate = moment().tz(timeZoneId);
    weatherCard.querySelector('.current-date').textContent =
      currentDate.format('YYYY-MM-DD');
    weatherCard.querySelector('.current-time').textContent =
      currentDate.format('HH:mm:ss');

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
    ).innerHTML = `<img src="sunrise.svg" alt="Sunrise Icon"> ${sunriseTime}`;
    weatherCard.querySelector(
      '.sunset-time'
    ).innerHTML = `<img src="sunset.svg" alt="Sunset Icon"> ${sunsetTime}`;

    // Afișează cardul de vreme suplimentară
    weatherCard.style.display = 'block';
  } else {
    console.error('Additional weather card element not found in the DOM');
  }
}

function updateQuote(quote, author) {
  const quoteCard = document.getElementById('quote-card');

  if (quoteCard) {
    quoteCard.querySelector('.quote-text').textContent = quote;
    quoteCard.querySelector('.quote-author').textContent = `— ${author}`;

    // Afișează cardul de citat
    quoteCard.style.display = 'block';
  } else {
    console.error('Quote card element not found in the DOM');
  }
}
