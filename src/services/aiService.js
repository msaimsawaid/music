// Hugging Face Inference API - FREE TIER
const HF_API_KEY = 'your_hugging_face_api_key_here'; // Get from https://huggingface.co/settings/tokens
const HF_API_URL = 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-large';

// Alternative: Use a free text generation API
const FREE_AI_API = 'https://api.openai-proxy.org/v1/chat/completions'; // Free proxy

// Mock responses for music-related queries
const musicResponses = {
  'hello': "Hello! I'm your music assistant. I can help you discover new music, recommend artists, or answer questions about different genres!",
  'recommend': "Based on your taste, I'd recommend checking out: The Weeknd, Dua Lipa, and Arctic Monkeys. They have great recent releases!",
  'rock': "Great choice! For rock music, I suggest: Arctic Monkeys, The Strokes, Foo Fighters, and Royal Blood.",
  'pop': "Pop music favorites include: Taylor Swift, Dua Lipa, Ed Sheeran, and Ariana Grande. Their latest albums are amazing!",
  'jazz': "For jazz lovers: Miles Davis, John Coltrane, Norah Jones, and Kamasi Washington are excellent choices.",
  'hip hop': "Hip hop recommendations: Kendrick Lamar, Drake, J. Cole, and Travis Scott have defined the modern era.",
  'classical': "Classical masterpieces: Beethoven, Mozart, Bach, and Chopin. For modern classical, try Ludovico Einaudi.",
  'help': "I can help you with: music recommendations, artist information, genre exploration, and finding similar artists!",
  'thanks': "You're welcome! Happy listening! 🎵"
};

export const getAIResponse = async (userMessage) => {
  const lowerMessage = userMessage.toLowerCase();
  
  // Check for specific music-related keywords
  for (const [keyword, response] of Object.entries(musicResponses)) {
    if (lowerMessage.includes(keyword)) {
      return response;
    }
  }

  try {
    // Option 1: Hugging Face API (requires free API key)
    if (HF_API_KEY && HF_API_KEY !== 'your_hugging_face_api_key_here') {
      const response = await fetch(HF_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HF_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: userMessage,
          parameters: {
            max_length: 100,
            temperature: 0.7
          }
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return data[0]?.generated_text || "I'm not sure how to respond to that. Ask me about music!";
      }
    }

    // Option 2: Fallback to mock intelligent responses
    return generateSmartResponse(userMessage);
    
  } catch (error) {
    console.error('AI API Error:', error);
    return generateSmartResponse(userMessage);
  }
};

const generateSmartResponse = (message) => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('what') && lowerMessage.includes('music')) {
    return "I can help you explore various music genres! Try asking about specific genres like rock, pop, jazz, or artists you enjoy.";
  }
  
  if (lowerMessage.includes('best') || lowerMessage.includes('top')) {
    return "Music is subjective, but some critically acclaimed artists include: Beyoncé, Kendrick Lamar, Taylor Swift, and The Beatles. What genre are you interested in?";
  }
  
  if (lowerMessage.includes('new') || lowerMessage.includes('latest')) {
    return "For the latest music, check out recent releases from: Olivia Rodrigo, Billie Eilish, Harry Styles, and Lil Nas X. They're making waves in the industry!";
  }
  
  if (lowerMessage.includes('similar to') || lowerMessage.includes('like')) {
    return "I'd be happy to recommend similar artists! Could you tell me which artist or band you currently enjoy?";
  }
  
  if (lowerMessage.includes('genre') || lowerMessage.includes('type')) {
    return "Popular music genres include: Pop, Rock, Hip-Hop, Jazz, Classical, Electronic, R&B, and Country. Which one interests you?";
  }
  
  // Default response for music-related chat
  return "As your music assistant, I specialize in helping you discover new artists, explore genres, and find music you'll love. Try asking me about specific artists, genres, or for recommendations! 🎶";
};