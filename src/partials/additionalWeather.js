import moment from 'moment-timezone'; // Biblioteca pt manipularea timpului.
import { getWeatherByCityName } from '../apiOpenWeather.js';
import { getTimeZoneByCoordinates } from '../timezoneApi.js';

export async function fetchAdditionalWeatherData(city) {
  if (!city) {
    console.error('City is not defined');
    return;
  }

  try {
    const weatherData = await getWeatherByCityName(city); // Obținem datele meteo pentru orașul dat.
    if (!weatherData || !weatherData.coord) {
      console.error('Invalid weather data received'); // Afișăm eroare dacă datele meteo sunt invalide.
      return;
    }

    const timeZoneData = await getTimeZoneByCoordinates(
      weatherData.coord.lat,
      weatherData.coord.lon
    ); // Obținere fus orar pe baza coordonatelor.
    updateAdditionalWeatherCard(weatherData, timeZoneData.zoneName); // Actualizare card meteo suplimentar cu datele meteo și fusul orar.

    const quoteData = await fetchRandomQuote(); // Obținere citat aleatoriu.
    if (!quoteData) {
      updateQuote('Quote not found', 'Author not found'); // Actualizare card de citate dacă nu a fost găsit un citat.
      showAdditionalWeatherCard();
      return;
    }
    updateQuote(quoteData.content, quoteData.author); // Actualizare card de citate.
    showAdditionalWeatherCard();
  } catch (error) {
    console.error('Error fetching additional weather data:', error);
    updateQuote('Quote not found', 'Author not found');
    showAdditionalWeatherCard(); // Afișare card suplimentar chiar și în caz de eroare.
  }
}

async function fetchRandomQuote() {
  try {
    const response = await fetch('https://api.quotable.io/random'); // Cerere pentru a obține un citat aleatoriu.
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching quote:', error);
    return null;
  }
}

function updateAdditionalWeatherCard(weatherData, timeZoneId) {
  const weatherCard = document.getElementById('additional-weather-card');

  if (weatherCard) {
    const currentDate = moment().tz(timeZoneId); // Obținem data și ora curentă în fusul orar specificat.

    // Funcție pentru a obține sufixul ordinal al zilei.
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

    // Actualizare elementele card meteo cu datele obținute.
    weatherCard.querySelector('.current-date').innerHTML = formattedDate;
    weatherCard.querySelector('.current-month').textContent = month;
    weatherCard.querySelector('.current-time').textContent =
      currentDate.format('HH:mm:ss');

    // Obținere și actualizare ore de răsărit și apus.
    const sunriseTime = moment
      .unix(weatherData.sys.sunrise)
      .tz(timeZoneId)
      .format('HH:mm');
    const sunsetTime = moment
      .unix(weatherData.sys.sunset)
      .tz(timeZoneId)
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

export function showAdditionalWeatherCard() {
  const additionalWeatherCard = document.getElementById(
    'additional-weather-card'
  );
  const quoteCard = document.getElementById('quote-card');

  if (additionalWeatherCard && quoteCard) {
    additionalWeatherCard.style.display = 'block';
    quoteCard.style.display = 'block';

    // Eliminare clase de animație pentru a reseta starea inițială.
    additionalWeatherCard.classList.remove(
      'animate__animated',
      'animate__fadeOutLeft'
    );
    quoteCard.classList.remove('animate__animated', 'animate__fadeOutRight');

    // Forțare reflow pentru a reseta animațiile.
    void additionalWeatherCard.offsetWidth;
    void quoteCard.offsetWidth;

    // Adăugare clase pentru animații.
    additionalWeatherCard.classList.add(
      'animate__animated',
      'animate__fadeInLeft'
    );
    quoteCard.classList.add('animate__animated', 'animate__fadeInRight');
  }
}

export function hideAdditionalWeatherCard() {
  const additionalWeatherCard = document.getElementById(
    'additional-weather-card'
  );
  const quoteCard = document.getElementById('quote-card');

  if (additionalWeatherCard && quoteCard) {
    additionalWeatherCard.style.display = 'none';
    quoteCard.style.display = 'none';

    // Eliminare clase de animație pentru a reseta starea inițială.
    additionalWeatherCard.classList.remove(
      'animate__animated',
      'animate__fadeInLeft'
    );
    quoteCard.classList.remove('animate__animated', 'animate__fadeInRight');
  }
}

// Ascundem inițial cardul suplimentar.
hideAdditionalWeatherCard();
