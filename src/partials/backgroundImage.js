import { getRandomImages } from '../apiPixabay.js';

const fallbackImages = [
  'https://cdn.pixabay.com/photo/2021/12/19/12/27/road-6881040_640.jpg',
  'https://cdn.pixabay.com/photo/2017/06/22/11/54/town-2430571_640.jpg',
  'https://cdn.pixabay.com/photo/2022/01/13/00/05/sunset-6934166_640.jpg',
];

export async function setBackgroundForCity(city) {
  const backgroundImageElement = document.getElementById('background-image');
  const backgroundVideoElement = document.getElementById('background-video');

  // Ascunde videoclipul și afișează imaginea de fundal
  if (backgroundVideoElement) backgroundVideoElement.style.display = 'none';
  if (backgroundImageElement) backgroundImageElement.style.display = 'block';

  try {
    const imageData = await getRandomImages(city, 1, 3); // Cerem trei imagini pentru a evita erorile de validare

    if (backgroundImageElement) {
      if (imageData && imageData.hits && imageData.hits.length > 0) {
        backgroundImageElement.style.backgroundImage = `url(${imageData.hits[0].webformatURL})`;
      } else {
        console.warn(
          'No images found for the specified city. Using fallback image.'
        );
        const randomFallbackImage =
          fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
        backgroundImageElement.style.backgroundImage = `url(${randomFallbackImage})`;
      }

      backgroundImageElement.style.backgroundSize = 'cover';
      backgroundImageElement.style.backgroundPosition = 'center';
      backgroundImageElement.style.height = '100vh';
      backgroundImageElement.style.width = '100vw';
      backgroundImageElement.style.position = 'fixed';
      backgroundImageElement.style.zIndex = '-1';
    } else {
      console.error('Background element not found.');
    }
  } catch (error) {
    console.error('Error fetching image from Pixabay API:', error);

    // În cazul unei erori la fetch, folosim și fallback
    const randomFallbackImage =
      fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
    if (backgroundImageElement) {
      backgroundImageElement.style.backgroundImage = `url(${randomFallbackImage})`;
      backgroundImageElement.style.backgroundSize = 'cover';
      backgroundImageElement.style.backgroundPosition = 'center';
      backgroundImageElement.style.height = '100vh';
      backgroundImageElement.style.width = '100vw';
      backgroundImageElement.style.position = 'fixed';
      backgroundImageElement.style.zIndex = '-1';
    }
  }
}

export function setDefaultBackgroundVideo() {
  const backgroundImageElement = document.getElementById('background-image');
  const backgroundVideoElement = document.getElementById('background-video');

  // Ascunde imaginea și afișează videoclipul de fundal
  if (backgroundImageElement) backgroundImageElement.style.display = 'none';
  if (backgroundVideoElement) backgroundVideoElement.style.display = 'block';

  if (backgroundVideoElement) {
    backgroundVideoElement.style.objectFit = 'cover';
    backgroundVideoElement.style.height = '100vh';
    backgroundVideoElement.style.width = '100vw';
    backgroundVideoElement.style.position = 'fixed';
    backgroundVideoElement.style.zIndex = '-1';

    // Adăugăm evenimentul pentru a face videoclipul să o ia de la capăt când se termină
    backgroundVideoElement.addEventListener('ended', () => {
      backgroundVideoElement.currentTime = 0;
      backgroundVideoElement.play();
    });
  } else {
    console.error('Background video element not found.');
  }
}
