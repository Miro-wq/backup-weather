import {
  fetchAndDisplayWeatherForCity,
  fetchAndDisplayWeatherForLocation,
} from './weathercard.js';
import { loadAndRenderChart } from './grafic.js'; // Importă funcția loadAndRenderChart

let favoritesList;

function addToFavorites(city) {
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  if (!favorites.includes(city)) {
    favorites.push(city);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    displayFavorites();
    alert(`${city} has been added to your favorites.`);
  } else {
    alert(`${city} is already in your favorites.`);
  }
}

function displayFavorites() {
  favoritesList = document.getElementById('favorites-list');
  const showMoreBtn = document.getElementById('show-more-btn');
  const showLessBtn = document.getElementById('show-less-btn');
  if (favoritesList) {
    favoritesList.innerHTML = '';
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites.forEach((city, index) => {
      const li = document.createElement('li');
      li.textContent = city;
      li.addEventListener('click', () => {
        fetchAndDisplayWeatherForCity(city);
      });
      const removeBtn = document.createElement('span');
      removeBtn.textContent = '×';
      removeBtn.classList.add('remove-favorite');
      removeBtn.addEventListener('click', event => {
        event.stopPropagation(); // Optează evenimentul de click pe listă
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
  } else {
    console.warn('Star icon element not found.');
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
  } else {
    console.warn('Location icon element not found.');
  }

  if (showMoreBtn) {
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
