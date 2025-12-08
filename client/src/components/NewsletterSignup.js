import React, { useState } from 'react';
import { subscribeToNewsletter } from '../services/firebase';

const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(''); // 'success', 'error', 'loading'
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setStatus('error');
      setMessage('Please enter your email address');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setStatus('error');
      setMessage('Please enter a valid email address');
      return;
    }

    setStatus('loading');
    setMessage('Subscribing...');

    try {
      const result = await subscribeToNewsletter(email);
      
      if (result.success) {
        setStatus('success');
        setMessage('Thank you for subscribing to our newsletter!');
        setEmail('');
        
        // Clear success message after 5 seconds
        setTimeout(() => {
          setStatus('');
          setMessage('');
        }, 5000);
      }
    } catch (error) {
      setStatus('error');
      setMessage('Failed to subscribe. Please try again.');
      console.error('Newsletter subscription error:', error);
    }
  };

  return (
    <div className="newsletter-signup">
      <h3>🎵 Stay Updated with Music World</h3>
      <p>Get the latest music releases, artist news, and exclusive content delivered to your inbox.</p>
      
      <form onSubmit={handleSubmit} className="newsletter-form">
        <div className="input-group">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="newsletter-input"
            disabled={status === 'loading'}
          />
          <button 
            type="submit" 
            className="btn-primary"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
          </button>
        </div>
      </form>

      {message && (
        <div className={`newsletter-message ${status}`}>
          {message}
          {status === 'success' && (
            <span style={{marginLeft: '8px'}}>🎉</span>
          )}
        </div>
      )}
    </div>
  );
};

export default NewsletterSignup;