import React, { useState, useRef, useEffect } from 'react';
import { getAIResponse } from '../services/aiService';

const AIChat = () => {
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your music assistant. Ask me about artists, genres, or get recommendations! 🎵", sender: 'ai' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const aiResponse = await getAIResponse(input);
      setMessages(prev => [...prev, { text: aiResponse, sender: 'ai' }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { 
        text: "Sorry, I'm having trouble responding right now. Please try again!", 
        sender: 'ai' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="ai-chat">
      <h2>🎵 Ask AI Music Assistant</h2>
      <div className="chat-container">
        <div className="messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
          {loading && (
            <div className="message ai">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSend} className="chat-input">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about music, artists, genres, or recommendations..."
            disabled={loading}
          />
          <button type="submit" disabled={loading || !input.trim()}>
            {loading ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
      
      {/* Quick suggestion buttons */}
      <div className="chat-suggestions">
        <p>Try asking:</p>
        <div className="suggestion-buttons">
          <button onClick={() => setInput("Recommend some pop artists")}>
            Pop Recommendations
          </button>
          <button onClick={() => setInput("What's good rock music?")}>
            Rock Music
          </button>
          <button onClick={() => setInput("Latest music trends")}>
            Latest Trends
          </button>
        </div>
      </div>
    </section>
  );
};

export default AIChat;