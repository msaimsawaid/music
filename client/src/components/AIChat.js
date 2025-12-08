import React, { useState, useRef, useEffect } from 'react';
import { getAIResponse } from '../services/aiService';

const AIChat = () => {
  const [messages, setMessages] = useState([
    { 
      text: "Hello! I'm your AI Music Assistant powered by real AI. Ask me about artists, genres, song recommendations, or anything music-related! 🎵", 
      sender: 'ai' 
    }
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
      console.log('📤 Sending to AI:', input);
      const aiResponse = await getAIResponse(input);
      console.log('📥 Received from AI:', aiResponse);
      
      setMessages(prev => [...prev, { text: aiResponse, sender: 'ai' }]);
    } catch (error) {
      console.error('❌ Chat error:', error);
      setMessages(prev => [...prev, { 
        text: "I'm having trouble connecting right now. Please try asking your music question again! 🎵", 
        sender: 'ai' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const quickQuestions = [
    "Tell me about Atif Aslam",
    "Recommend pop artists",
    "Latest music trends 2024",
    "Who is Taylor Swift?",
    "Best hip hop songs",
    "What is Coke Studio?"
  ];

  return (
    <section className="ai-chat">
      <h2>🎵 AI Music Assistant (Real AI Powered)</h2>
      <p style={{ textAlign: 'center', color: 'var(--muted)', marginBottom: '1rem' }}>
        Powered by Hugging Face AI • No pre-saved data • Real-time responses
      </p>
      
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
              <span style={{marginLeft: '10px', color: 'var(--muted)', fontSize: '0.9rem'}}>
                Consulting music knowledge...
              </span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <form onSubmit={handleSend} className="chat-input">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about music artists, songs, genres, recommendations..."
            disabled={loading}
          />
          <button type="submit" disabled={loading || !input.trim()}>
            {loading ? 'AI Thinking...' : 'Ask AI'}
          </button>
        </form>
      </div>
      
      <div className="chat-suggestions">
        <p>Try these music questions:</p>
        <div className="suggestion-buttons">
          {quickQuestions.map((question, index) => (
            <button 
              key={index}
              onClick={() => setInput(question)}
              disabled={loading}
            >
              {question}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AIChat;