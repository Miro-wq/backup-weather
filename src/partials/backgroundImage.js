import { getRandomImages } from '../apiPixabay.js';

export async function setBackgroundForCity(city) {
  try {
    const imageData = await getRandomImages(city, 1, 3); // Cerem trei imagini pentru a evita erorile de validare
    const backgroundElement = document.getElementById('background-image');
    if (
      imageData &&
      imageData.hits &&
      imageData.hits.length > 0 &&
      backgroundElement
    ) {
      backgroundElement.style.backgroundImage = `url(${imageData.hits[0].webformatURL})`;
      backgroundElement.style.backgroundSize = 'cover';
      backgroundElement.style.backgroundPosition = 'center';
      backgroundElement.style.height = '100vh';
      backgroundElement.style.width = '100vw';
      backgroundElement.style.position = 'fixed';
      backgroundElement.style.zIndex = '-1';
    } else {
      console.error('No images found or background element not found.');
    }
  } catch (error) {
    console.error('Error fetching image from Pixabay API:', error);
  }
}
