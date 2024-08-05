const apiKey = '4TPI5C97IE3Q'; // Cheia ta API

export async function getTimeZoneByCoordinates(lat, lon) {
  const response = await fetch(
    `https://api.timezonedb.com/v2.1/get-time-zone?key=${apiKey}&format=json&by=position&lat=${lat}&lng=${lon}`
  );
  const data = await response.json();
  if (data.status === 'OK') {
    return data;
  } else {
    throw new Error('Error fetching timezone data');
  }
}
