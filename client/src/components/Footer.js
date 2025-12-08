import React from 'react';
import NewsletterSignup from './NewsletterSignup';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Music World</h3>
          <p>Your ultimate destination for music discovery and entertainment.</p>
        </div>
        
        <div className="footer-section">
          <NewsletterSignup />
        </div>
        
        <div className="footer-section">
          <div className="footer-links">
            <a href="/terms">Terms</a> · <a href="/privacy">Privacy</a>
          </div>
          <div className="copyright">
            © 2025 Music World. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;