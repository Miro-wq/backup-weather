const API_KEY = '24587351-f51ecbfdd1a1ed72c58205b43';
const BASE_URL = 'https://pixabay.com/api';

// Funcție generală pentru cereri către Pixabay API
async function fetchFromAPI(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `Network response was not ok. Status: ${response.status}`
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch API Error:', error);
    throw error;
  }
}

// Obține imagini după un cuvânt cheie
async function searchImages(query, page = 1, perPage = 20) {
  try {
    const url = `${BASE_URL}/?key=${API_KEY}&q=${query}&image_type=photo&page=${page}&per_page=${perPage}`;
    console.log('Fetching images from URL:', url);
    const data = await fetchFromAPI(url);

    // Filtrare imagini de rezoluție superioară (mai mare decât HD)
    const highResImages = data.hits.filter(
      image => image.imageWidth >= 3840 && image.imageHeight >= 2160
    );

    if (highResImages.length === 0) {
      console.warn(`No high-resolution images found for query "${query}".`);
    }

    return highResImages;
  } catch (error) {
    console.error(`Error searching images with query "${query}":`, error);
    throw error;
  }
}

// Obține videouri după un cuvânt cheie
async function searchVideos(query, page = 1, perPage = 20) {
  try {
    const url = `${BASE_URL}/videos/?key=${API_KEY}&q=${query}&page=${page}&per_page=${perPage}`;
    console.log('Fetching videos from URL:', url);
    return await fetchFromAPI(url);
  } catch (error) {
    console.error(`Error searching videos with query "${query}":`, error);
    throw error;
  }
}

// Obține detalii despre o imagine după ID
async function getImageDetails(imageId) {
  try {
    const url = `${BASE_URL}/?key=${API_KEY}&id=${imageId}`;
    console.log('Fetching image details from URL:', url);
    return await fetchFromAPI(url);
  } catch (error) {
    console.error(`Error fetching image details with ID "${imageId}":`, error);
    throw error;
  }
}

// Obține imagini populare
async function getPopularImages(
  category = '',
  editorsChoice = false,
  page = 1,
  perPage = 20
) {
  try {
    const url = `${BASE_URL}/?key=${API_KEY}&order=popular&category=${category}&editors_choice=${editorsChoice}&page=${page}&per_page=${perPage}`;
    console.log('Fetching popular images from URL:', url);
    return await fetchFromAPI(url);
  } catch (error) {
    console.error(
      `Error fetching popular images with category "${category}" and editorsChoice "${editorsChoice}":`,
      error
    );
    throw error;
  }
}

// Obține videouri populare
async function getPopularVideos(
  category = '',
  editorsChoice = false,
  page = 1,
  perPage = 20
) {
  try {
    const url = `${BASE_URL}/videos/?key=${API_KEY}&order=popular&category=${category}&editors_choice=${editorsChoice}&page=${page}&per_page=${perPage}`;
    console.log('Fetching popular videos from URL:', url);
    return await fetchFromAPI(url);
  } catch (error) {
    console.error(
      `Error fetching popular videos with category "${category}" and editorsChoice "${editorsChoice}":`,
      error
    );
    throw error;
  }
}

// Obține imagini aleatorii
async function getRandomImages(query, page = 1, perPage = 3) {
  try {
    const url = `${BASE_URL}/?key=${API_KEY}&q=${query}&image_type=photo&per_page=${perPage}&page=${page}`;
    const data = await fetchFromAPI(url);

    // Verificăm dacă există imagini în răspuns
    if (data.hits && data.hits.length > 0) {
      // Sortăm imaginile în funcție de rezoluție (lățime * înălțime)
      const sortedImages = data.hits.sort((a, b) => {
        const resolutionA = a.imageWidth * a.imageHeight;
        const resolutionB = b.imageWidth * b.imageHeight;
        return resolutionB - resolutionA; // sortare descrescătoare
      });

      // Returnăm imagini sortate
      return sortedImages;
    } else {
      console.warn(`No images found for query "${query}".`);
      return [];
    }
  } catch (error) {
    console.error(`Error fetching random images with query "${query}":`, error);
    throw error;
  }
}

// Obține videouri aleatorii
async function getRandomVideos(category = '', page = 1, perPage = 20) {
  try {
    const url = `${BASE_URL}/videos/?key=${API_KEY}&order=latest&category=${category}&page=${page}&per_page=${perPage}`;
    console.log('Fetching random videos from URL:', url);
    return await fetchFromAPI(url);
  } catch (error) {
    console.error(
      `Error fetching random videos with category "${category}":`,
      error
    );
    throw error;
  }
}

// Obține imagini după culoare
async function getImagesByColor(color, page = 1, perPage = 20) {
  try {
    const url = `${BASE_URL}/?key=${API_KEY}&colors=${color}&image_type=photo&page=${page}&per_page=${perPage}`;
    console.log('Fetching images by color from URL:', url);
    return await fetchFromAPI(url);
  } catch (error) {
    console.error(`Error fetching images by color "${color}":`, error);
    throw error;
  }
}

// Obține videouri după culoare (dacă este suportat)
async function getVideosByColor(color, page = 1, perPage = 20) {
  try {
    const url = `${BASE_URL}/videos/?key=${API_KEY}&colors=${color}&page=${page}&per_page=${perPage}`;
    console.log('Fetching videos by color from URL:', url);
    return await fetchFromAPI(url);
  } catch (error) {
    console.error(`Error fetching videos by color "${color}":`, error);
    throw error;
  }
}

export {
  searchImages, // Obține imagini după un cuvânt cheie
  searchVideos, // Obține videouri după un cuvânt cheie
  getImageDetails, // Obține detalii despre o imagine după ID
  getPopularImages, // Obține imagini populare
  getPopularVideos, // Obține videouri populare
  getRandomImages, // Obține imagini aleatorii
  getRandomVideos, // Obține videouri aleatorii
  getImagesByColor, // Obține imagini după culoare
  getVideosByColor, // Obține videouri după culoare (dacă este suportat)
};
