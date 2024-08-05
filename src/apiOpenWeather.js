const API_KEY = 'c28b86768a874c70b1ecd1343e8f0f24';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_BASE_URL = 'https://api.openweathermap.org/geo/1.0';
const MAP_BASE_URL = 'https://tile.openweathermap.org/map';

async function fetchFromAPI(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTPS error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch API Error:', error);
    throw error;
  }
}

// Obține datele meteo actuale pentru un oraș specificat
async function getWeatherByCityName(city) {
  try {
    const url = `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`;
    return await fetchFromAPI(url);
  } catch (error) {
    console.error(`Error getting weather by city name "${city}":`, error);
    throw error;
  }
}

// Obține datele meteo actuale pentru coordonate geografice specificate
async function getWeatherByCoordinates(lat, lon) {
  try {
    const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    return await fetchFromAPI(url);
  } catch (error) {
    console.error(
      `Error getting weather by coordinates (lat: ${lat}, lon: ${lon}):`,
      error
    );
    throw error;
  }
}

// Obține prognoza meteo pe 5 zile la intervale de 3 ore pentru un oraș specificat
async function getWeatherForecastByCityName(city) {
  try {
    const url = `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`;
    return await fetchFromAPI(url);
  } catch (error) {
    console.error(
      `Error getting weather forecast by city name "${city}":`,
      error
    );
    throw error;
  }
}

// Obține prognoza meteo pe 5 zile la intervale de 3 ore pentru coordonate geografice specificate
async function getWeatherForecastByCoordinates(lat, lon) {
  try {
    const url = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    return await fetchFromAPI(url);
  } catch (error) {
    console.error(
      `Error getting weather forecast by coordinates (lat: ${lat}, lon: ${lon}):`,
      error
    );
    throw error;
  }
}

// Obține indicele UV pentru coordonate geografice specificate
async function getUVIndex(lat, lon) {
  try {
    const url = `${BASE_URL}/uvi?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    return await fetchFromAPI(url);
  } catch (error) {
    console.error(
      `Error getting UV index for coordinates (lat: ${lat}, lon: ${lon}):`,
      error
    );
    throw error;
  }
}

// Obține datele despre poluarea aerului pentru coordonate geografice specificate
async function getAirPollution(lat, lon) {
  try {
    const url = `${BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    return await fetchFromAPI(url);
  } catch (error) {
    console.error(
      `Error getting air pollution data for coordinates (lat: ${lat}, lon: ${lon}):`,
      error
    );
    throw error;
  }
}

// Obține coordonatele geografice pentru un oraș specificat
async function getGeocoding(city) {
  try {
    const url = `${GEO_BASE_URL}/direct?q=${city}&appid=${API_KEY}`;
    return await fetchFromAPI(url);
  } catch (error) {
    console.error(`Error getting geocoding for city "${city}":`, error);
    throw error;
  }
}

// Obține numele locației pentru coordonate geografice specificate (geocodare inversă)
async function getReverseGeocoding(lat, lon) {
  try {
    const url = `${GEO_BASE_URL}/reverse?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    return await fetchFromAPI(url);
  } catch (error) {
    console.error(
      `Error getting reverse geocoding for coordinates (lat: ${lat}, lon: ${lon}):`,
      error
    );
    throw error;
  }
}

// Obține hărți meteo pentru straturi specifice (precipitații, nori, temperatură etc.)
async function getWeatherMap(layer, zoom, x, y) {
  try {
    const url = `${MAP_BASE_URL}/${layer}/${zoom}/${x}/${y}.png?appid=${API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTPS error! status: ${response.status}`);
    }
    return response;
  } catch (error) {
    console.error(
      `Error getting weather map (layer: ${layer}, zoom: ${zoom}, x: ${x}, y: ${y}):`,
      error
    );
    throw error;
  }
}

// Obține prognoza pentru poluarea aerului pentru coordonate geografice specificate
async function getAirPollutionForecast(lat, lon) {
  try {
    const url = `${BASE_URL}/air_pollution/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    return await fetchFromAPI(url);
  } catch (error) {
    console.error(
      `Error getting air pollution forecast for coordinates (lat: ${lat}, lon: ${lon}):`,
      error
    );
    throw error;
  }
}

// Obține istoricul poluării aerului pentru coordonate geografice specificate între datele de start și end (în format UNIX timestamp)
async function getAirPollutionHistory(lat, lon, start, end) {
  try {
    const url = `${BASE_URL}/air_pollution/history?lat=${lat}&lon=${lon}&start=${start}&end=${end}&appid=${API_KEY}`;
    return await fetchFromAPI(url);
  } catch (error) {
    console.error(
      `Error getting air pollution history for coordinates (lat: ${lat}, lon: ${lon}, start: ${start}, end: ${end}):`,
      error
    );
    throw error;
  }
}

// Obține URL-ul iconiței meteo
function getWeatherIconUrl(iconCode) {
  return `https://openweathermap.org/img/wn/${iconCode}.png`;
}

export {
  getWeatherByCityName, // Obține datele meteo actuale pentru un oraș specificat
  getWeatherByCoordinates, // Obține datele meteo actuale pentru coordonate geografice specificate
  getWeatherForecastByCityName, // Obține prognoza meteo pe 5 zile la intervale de 3 ore pentru un oraș specificat
  getWeatherForecastByCoordinates, // Obține prognoza meteo pe 5 zile la intervale de 3 ore pentru coordonate geografice specificate
  getUVIndex, // Obține indicele UV pentru coordonate geografice specificate
  getAirPollution, // Obține datele despre poluarea aerului pentru coordonate geografice specificate
  getGeocoding, // Obține coordonatele geografice pentru un oraș specificat
  getReverseGeocoding, // Obține numele locației pentru coordonate geografice specificate (geocodare inversă)
  getWeatherMap, // Obține hărți meteo pentru straturi specifice (precipitații, nori, temperatură etc.)
  getAirPollutionForecast, // Obține prognoza pentru poluarea aerului pentru coordonate geografice specificate
  getAirPollutionHistory, // Obține istoricul poluării aerului pentru coordonate geografice specificate între datele de start și end (în format UNIX timestamp)
  getWeatherIconUrl, // Obține URL-ul iconiței meteo
};
