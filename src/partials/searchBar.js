import {
  fetchAndDisplayWeatherForCity,
  fetchAndDisplayWeatherForLocation,
} from './weathercard.js';
import { loadAndRenderChart } from './grafic.js'; // Importă funcția loadAndRenderChart

let favoritesList;

function capitalizeCityName(city) {
  return city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();
}

function addToFavorites(city) {
  city = capitalizeCityName(city); // Capitalizează numele orașului
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  if (!favorites.includes(city)) {
    favorites.push(city);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    displayFavorites();
    alert(`${city} a fost adăugat la favorite.`);
  } else {
    alert(`${city} este deja în lista de favorite.`);
  }
}

function displayFavorites() {
  favoritesList = document.getElementById('favorites-list');
  const showMoreBtn = document.getElementById('show-more-btn');
  const showLessBtn = document.getElementById('show-less-btn');
  if (favoritesList) {
    favoritesList.innerHTML = '';
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites.forEach(city => {
      const li = document.createElement('li');
      li.classList.add('favorite-item');
      li.textContent = city;
      li.addEventListener('click', () => {
        fetchAndDisplayWeatherForCity(city);
      });

      const removeBtn = document.createElement('span');
      removeBtn.classList.add('remove-favorite');
      removeBtn.addEventListener('click', event => {
        event.stopPropagation();
        removeFromFavorites(city);
      });

      li.appendChild(removeBtn);
      favoritesList.appendChild(li);
    });

    const items = favoritesList.querySelectorAll('li');
    items.forEach((item, index) => {
      item.style.display = index < 4 ? 'inline-block' : 'none';
    });
    showMoreBtn.style.display = favorites.length > 4 ? 'block' : 'none';
    showLessBtn.style.display = 'none';
  }
}

function removeFromFavorites(city) {
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  favorites = favorites.filter(favorite => favorite !== city);
  localStorage.setItem('favorites', JSON.stringify(favorites));
  displayFavorites();
}

export function initializeSearch() {
  const cityInput = document.getElementById('city-input');
  const starIcon = document.getElementById('star-icon');
  const locationIcon = document.getElementById('location-icon');
  const showMoreBtn = document.getElementById('show-more-btn');
  const showLessBtn = document.getElementById('show-less-btn');
  const searchForm = document.getElementById('search-form');

  if (searchForm) {
    searchForm.style.width = '0';
    searchForm.style.overflow = 'hidden';
    setTimeout(() => {
      searchForm.style.transition = 'width 1s ease-in-out';
      searchForm.style.width = '100%';
    }, 100);
  }

  if (cityInput) {
    cityInput.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        const city = cityInput.value.trim();
        if (city) {
          fetchAndDisplayWeatherForCity(city);
        }
      }
    });
  } else {
    console.warn('City input element not found.');
  }

  if (starIcon) {
    starIcon.addEventListener('click', () => {
      const city = cityInput.value.trim();
      if (city) {
        addToFavorites(city);
      }
    });
  }

  if (locationIcon) {
    locationIcon.addEventListener('click', async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async position => {
            const { latitude, longitude } = position.coords;
            const cityName = await fetchAndDisplayWeatherForLocation(
              latitude,
              longitude
            );
            if (cityName) {
              loadAndRenderChart(cityName);
            }
          },
          async error => {
            console.error('Error getting location:', error);
            const cityName = await fetchAndDisplayWeatherForCity('București');
            if (cityName) {
              loadAndRenderChart(cityName);
            }
          }
        );
      } else {
        console.error('Geolocation is not supported by this browser');
        const cityName = await fetchAndDisplayWeatherForCity('București');
        if (cityName) {
          loadAndRenderChart(cityName);
        }
      }
    });
  }

  if (showMoreBtn) {
    showMoreBtn.innerHTML = `
      <svg width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 2L8 6L4 10" stroke="white" stroke-width="2"/>
      </svg>
    `;

    showMoreBtn.addEventListener('click', () => {
      const favoriteItems = favoritesList.querySelectorAll('li');
      favoriteItems.forEach(item => {
        item.style.display = 'inline-block';
      });
      showMoreBtn.style.display = 'none';
      showLessBtn.style.display = 'block';
    });
  }

  if (showLessBtn) {
    showLessBtn.innerHTML = `
      <svg width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 2L4 6L8 10" stroke="white" stroke-width="2"/>
      </svg>
    `;

    showLessBtn.addEventListener('click', () => {
      const favoriteItems = favoritesList.querySelectorAll('li');
      favoriteItems.forEach((item, index) => {
        item.style.display = index < 4 ? 'inline-block' : 'none';
      });
      showMoreBtn.style.display = 'block';
      showLessBtn.style.display = 'none';
    });
  }

  displayFavorites(); // Display favorites when the page loads
}
