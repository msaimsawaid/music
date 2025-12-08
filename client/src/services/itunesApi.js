// iTunes Search API - No API key required!
const ITUNES_BASE_URL = 'https://itunes.apple.com/search';

// Search for songs
export const searchMusic = async (query, limit = 10) => {
  try {
    const response = await fetch(
      `${ITUNES_BASE_URL}?term=${encodeURIComponent(query)}&media=music&entity=song&limit=${limit}`
    );

    if (!response.ok) {
      throw new Error(`iTunes API error: ${response.status}`);
    }

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('iTunes API failed:', error);
    return [];
  }
};

// Get popular songs
export const getPopularSongs = async () => {
  try {
    const response = await fetch(
      `${ITUNES_BASE_URL}?term=pop&media=music&entity=song&limit=8`
    );

    if (!response.ok) {
      throw new Error(`iTunes API error: ${response.status}`);
    }

    const data = await response.json();
    return data.results || getFallbackSongs();
  } catch (error) {
    console.error('iTunes API failed, using fallback:', error);
    return getFallbackSongs();
  }
};

// Get featured albums
export const getFeaturedAlbums = async () => {
  try {
    const response = await fetch(
      `${ITUNES_BASE_URL}?term=album&media=music&entity=album&limit=6&attribute=featuredTerm`
    );

    if (!response.ok) {
      throw new Error(`iTunes API error: ${response.status}`);
    }

    const data = await response.json();
    return data.results || getFallbackAlbums();
  } catch (error) {
    console.error('iTunes API failed, using fallback:', error);
    return getFallbackAlbums();
  }
};

// Fallback data
const getFallbackSongs = () => [
  {
    trackName: 'Blinding Lights',
    artistName: 'The Weeknd',
    artworkUrl100: '/assets/album1.jpg',
    previewUrl: '#'
  },
  {
    trackName: 'Flowers',
    artistName: 'Miley Cyrus', 
    artworkUrl100: '/assets/album2.jpg',
    previewUrl: '#'
  }
];

const getFallbackAlbums = () => [
  {
    collectionName: 'Midnights',
    artistName: 'Taylor Swift',
    artworkUrl100: '/assets/album1.jpg'
  },
  {
    collectionName: 'Harry\'s House',
    artistName: 'Harry Styles',
    artworkUrl100: '/assets/album2.jpg'
  }
];