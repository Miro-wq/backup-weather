import { fetchAndDisplayWeatherForCity } from './weathercard.js';

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
  if (favoritesList) {
    favoritesList.innerHTML = '';
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites.forEach(city => {
      const li = document.createElement('li');
      li.textContent = city;
      const removeBtn = document.createElement('span');
      removeBtn.textContent = '×';
      removeBtn.classList.add('remove-favorite');
      removeBtn.addEventListener('click', () => {
        removeFromFavorites(city);
      });
      li.appendChild(removeBtn);
      favoritesList.appendChild(li);
    });
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

  if (cityInput) {
    console.log('City input element found.');
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
    console.log('Star icon element found.');
    starIcon.addEventListener('click', () => {
      const city = cityInput.value.trim();
      if (city) {
        addToFavorites(city);
      }
    });
  } else {
    console.warn('Star icon element not found.');
  }

  displayFavorites(); // Display favorites when the page loads
}
