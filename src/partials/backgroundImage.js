import { getRandomImages } from '../apiPixabay.js';

const fallbackImages = [
  'https://cdn.pixabay.com/photo/2021/12/19/12/27/road-6881040_640.jpg',
  'https://cdn.pixabay.com/photo/2017/06/22/11/54/town-2430571_640.jpg',
  'https://cdn.pixabay.com/photo/2022/01/13/00/05/sunset-6934166_640.jpg',
];

export async function setBackgroundForCity(city) {
  try {
    const imageData = await getRandomImages(city, 1, 3); // Cerem trei imagini pentru a evita erorile de validare
    const backgroundElement = document.getElementById('background-image');

    if (backgroundElement) {
      if (imageData && imageData.hits && imageData.hits.length > 0) {
        backgroundElement.style.backgroundImage = `url(${imageData.hits[0].webformatURL})`;
      } else {
        console.warn(
          'No images found for the specified city. Using fallback image.'
        );
        const randomFallbackImage =
          fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
        backgroundElement.style.backgroundImage = `url(${randomFallbackImage})`;
      }

      backgroundElement.style.backgroundSize = 'cover';
      backgroundElement.style.backgroundPosition = 'center';
      backgroundElement.style.height = '100vh';
      backgroundElement.style.width = '100vw';
      backgroundElement.style.position = 'fixed';
      backgroundElement.style.zIndex = '-1';
    } else {
      console.error('Background element not found.');
    }
  } catch (error) {
    console.error('Error fetching image from Pixabay API:', error);

    // În cazul unei erori la fetch, folosim și fallback
    const backgroundElement = document.getElementById('background-image');
    if (backgroundElement) {
      const randomFallbackImage =
        fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
      backgroundElement.style.backgroundImage = `url(${randomFallbackImage})`;
      backgroundElement.style.backgroundSize = 'cover';
      backgroundElement.style.backgroundPosition = 'center';
      backgroundElement.style.height = '100vh';
      backgroundElement.style.width = '100vw';
      backgroundElement.style.position = 'fixed';
      backgroundElement.style.zIndex = '-1';
    }
  }
}
