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
      // Actualizare card citat cu mesaje de eroare
      updateQuote('Quote not found', 'Author not found');
      return;
    }
    const quote = await getQuoteByAuthor(authorData);
    if (!quote) {
      // Actualizare card citat cu mesaje de eroare dacă nu se găsește citatul
      updateQuote('Quote not found', authorData.author);
      return;
    }
    // Actualizare card citat cu datele găsite
    updateQuote(quote, authorData.author);
  } catch (error) {
    console.error('Error fetching additional weather data:', error);
    // Actualizare card citat cu mesaje de eroare în caz de excepție
    updateQuote('Quote not found', 'Author not found');
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
    // Actualizare text citat și autor în cardul de citat
    quoteCard.querySelector('.quote-text').textContent = quote;
    quoteCard.querySelector('.quote-author').textContent = `— ${author}`;
  } else {
    console.error('Quote card element not found in the DOM');
  }
}
