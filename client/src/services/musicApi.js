// Using iTunes API as a free music API
export const searchMusic = async (query) => {
  try {
    const response = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=10`
    );
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error fetching music:', error);
    throw error;
  }
};

// Alternative: Last.fm API (you'll need to sign up for free API key)
export const getTopTracks = async () => {
  try {
    // This is a mock - replace with actual API call
    const mockData = [
      { name: "Blinding Lights", artist: "The Weeknd" },
      { name: "Shape of You", artist: "Ed Sheeran" },
      { name: "Dance Monkey", artist: "Tones and I" }
    ];
    return mockData;
  } catch (error) {
    console.error('Error fetching top tracks:', error);
    throw error;
  }
};