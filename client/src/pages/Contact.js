import React, { useState } from 'react';
import { submitContactForm } from '../services/firebase';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitResult, setSubmitResult] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const result = await submitContactForm(formData);
      setSubmitResult(result);
      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitResult({ 
        success: false, 
        message: 'Error submitting form. Please try again.' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="contact-page">
        <div className="success-message">
          <h2>Thank You! 🎵</h2>
          <p>Your message has been sent successfully.</p>
          {submitResult.fallback && (
            <div className="fallback-notice">
              <p><small>Note: Using localStorage fallback (Firebase unavailable)</small></p>
            </div>
          )}
          <button onClick={() => setSubmitted(false)} className="btn-primary">
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="contact-page">
      <h1>Contact Us</h1>
      <p>Have questions or feedback? We'd love to hear from you!</p>
      
      <form className="contact-form" onSubmit={handleSubmit}>
        <label>
          Name *
          <input 
            type="text" 
            name="name" 
            value={formData.name}
            onChange={handleChange}
            required 
            disabled={submitting}
          />
        </label>
        
        <label>
          Email *
          <input 
            type="email" 
            name="email" 
            value={formData.email}
            onChange={handleChange}
            required 
            disabled={submitting}
          />
        </label>
        
        <label>
          Message *
          <textarea 
            name="message" 
            rows="5"
            value={formData.message}
            onChange={handleChange}
            required
            disabled={submitting}
            placeholder="Tell us about your music interests, questions, or feedback..."
          ></textarea>
        </label>
        
        <button 
          className="btn-primary" 
          type="submit"
          disabled={submitting}
        >
          {submitting ? 'Sending...' : 'Send Message'}
        </button>
      </form>

      {submitResult.message && !submitResult.success && (
        <div className="error-message">
          <p>{submitResult.message}</p>
        </div>
      )}
    </div>
  );
};

export default Contact;