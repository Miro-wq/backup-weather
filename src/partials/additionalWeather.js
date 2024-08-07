import moment from 'moment-timezone';
import { getWeatherByCityName } from '../apiOpenWeather.js';
import { getAuthorByCity, getQuoteByAuthor } from '../quotesApi.js';
import { getTimeZoneByCoordinates } from '../timezoneApi.js';

export async function fetchAdditionalWeatherData(city) {
  console.log('fetchAdditionalWeatherData called');
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

    function getOrdinalSuffix(day) {
      if (day > 3 && day < 21) return 'th';
      switch (day % 10) {
        case 1:
          return 'st';
        case 2:
          return 'nd';
        case 3:
          return 'rd';
        default:
          return 'th';
      }
    }

    const day = currentDate.date();
    const dayOfWeek = currentDate.format('ddd');
    const month = currentDate.format('MMMM');
    const formattedDate = `${day}<sup>${getOrdinalSuffix(
      day
    )}</sup> ${dayOfWeek}`;

    weatherCard.querySelector('.current-date').innerHTML = formattedDate;
    weatherCard.querySelector('.current-month').textContent = month;
    weatherCard.querySelector('.current-time').textContent =
      currentDate.format('HH:mm:ss');

    // Testare cu date hardcodate
    const sunriseTime = moment
      .tz('2024-08-07 06:30:00', timeZoneId)
      .format('HH:mm');
    const sunsetTime = moment
      .tz('2024-08-07 20:00:00', timeZoneId)
      .format('HH:mm');

    weatherCard.querySelector('.sunrise-time').innerHTML = sunriseTime;
    weatherCard.querySelector('.sunset-time').innerHTML = sunsetTime;
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
