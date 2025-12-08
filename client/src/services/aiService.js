// Pure API-only AI Service - No pre-saved data
const FREE_AI_API_URL = 'https://api.openai-proxy.org/v1/chat/completions';

export const getAIResponse = async (userMessage) => {
  console.log('🎵 AI Query:', userMessage);
  
  try {
    const response = await fetch(FREE_AI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a music expert assistant. You know about international music, Pakistani music, Bollywood music, artists, songs, and genres. Provide accurate, specific information about music. Always mention specific artist names, song titles, and details when possible.'
          },
          {
            role: 'user', 
            content: userMessage
          }
        ],
        max_tokens: 200,
        temperature: 0.8
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content;
    
    if (!aiResponse) {
      throw new Error('No response from AI');
    }

    console.log('✅ AI Response:', aiResponse);
    return aiResponse;
    
  } catch (error) {
    console.error('❌ AI API error:', error);
    
    // Try alternative free API
    try {
      const fallbackResponse = await tryAlternativeAPI(userMessage);
      return fallbackResponse;
    } catch (fallbackError) {
      console.error('❌ All APIs failed:', fallbackError);
      return "I'm currently experiencing high demand. Please try again in a moment or ask another music question! 🎵";
    }
  }
};

// Alternative free API
const tryAlternativeAPI = async (userMessage) => {
  try {
    const response = await fetch('https://chat-gpt-ai-chat-bot.p.rapidapi.com/ask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': 'your-rapidapi-key-here', // You can get free key from rapidapi.com
        'X-RapidAPI-Host': 'chat-gpt-ai-chat-bot.p.rapidapi.com'
      },
      body: JSON.stringify({
        query: `As a music expert, answer this: ${userMessage}. Provide specific music information.`
      }),
    });

    if (!response.ok) {
      throw new Error('Alternative API failed');
    }

    const data = await response.json();
    return data.response || "I can help with music questions! Try asking about artists, songs, or genres. 🎶";
    
  } catch (error) {
    throw new Error('All APIs unavailable');
  }
};