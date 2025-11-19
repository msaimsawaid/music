export const fetchMusicData = async () => {
  try {
    const response = await fetch('https://api.example.com/music');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching music data:', error);
    return null;
  }
};