import { fetchAndDisplayWeatherForCity, fetchAndDisplayWeatherForLocation } from './weathercard.js';
import { loadAndRenderChart } from './grafic.js';

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
  const favoritesList = document.getElementById('favorites-list');
  const favoritesDropdown = document.getElementById('favorites-dropdown');
  const favoritesToggle = document.getElementById('favorites-toggle');
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

  favoritesList.innerHTML = '';
  favoritesDropdown.innerHTML = '';

  favorites.forEach((city, index) => {
    const li = document.createElement('li');
    li.textContent = city;
    li.classList.add('favorite-item');
    li.addEventListener('click', () => {
      fetchAndDisplayWeatherForCity(city);
    });

    const removeBtn = document.createElement('span');
    removeBtn.textContent = '×';
    removeBtn.classList.add('remove-favorite');
    removeBtn.addEventListener('click', (event) => {
      event.stopPropagation();
      removeFromFavorites(city);
    });

    li.appendChild(removeBtn);

    if (index < 4) {
      favoritesList.appendChild(li);
    } else {
      const dropdownLi = li.cloneNode(true);
      dropdownLi.addEventListener('click', () => {
        fetchAndDisplayWeatherForCity(city);
      });
      favoritesDropdown.appendChild(dropdownLi);
    }
  });

  if (favorites.length > 4) {
    favoritesToggle.style.display = 'block';
    favoritesDropdown.style.display = 'none'; // Ascundem meniul derulant implicit
  } else {
    favoritesToggle.style.display = 'none';
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
  const favoritesToggle = document.getElementById('favorites-toggle');

  if (cityInput) {
    cityInput.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        const city = cityInput.value.trim();
        if (city) {
          fetchAndDisplayWeatherForCity(city);
          document.querySelector('.master-weather-card').style.display = 'block';
          document.querySelector('.five-days-container').style.display = 'block';
          document.querySelector('#forecast-container').style.display = 'block';
        }
      }
    });
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
    locationIcon.addEventListener('click', () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async position => {
            const { latitude, longitude } = position.coords;
            const cityName = await fetchAndDisplayWeatherForLocation(latitude, longitude);
            if (cityName) {
              loadAndRenderChart(cityName);
              document.querySelector('.master-weather-card').style.display = 'block';
              document.querySelector('.five-days-container').style.display = 'block';
              document.querySelector('#forecast-container').style.display = 'block';
            }
          },
          async error => {
            console.error('Error getting location:', error);
            const cityName = await fetchAndDisplayWeatherForCity('București');
            if (cityName) {
              loadAndRenderChart(cityName);
              document.querySelector('.master-weather-card').style.display = 'block';
              document.querySelector('.five-days-container').style.display = 'block';
              document.querySelector('#forecast-container').style.display = 'block';
            }
          }
        );
      } else {
        console.error('Geolocation is not supported by this browser');
        const cityName = await fetchAndDisplayWeatherForCity('București');
        if (cityName) {
          loadAndRenderChart(cityName);
          document.querySelector('.master-weather-card').style.display = 'block';
          document.querySelector('.five-days-container').style.display = 'block';
          document.querySelector('#forecast-container').style.display = 'block';
        }
      }
    });
  }

  if (favoritesToggle) {
    favoritesToggle.addEventListener('click', () => {
      const dropdown = document.getElementById('favorites-dropdown');
      dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
    });
  }

  displayFavorites(); // Display favorites when the page loads
}
