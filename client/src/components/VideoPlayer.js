import React from 'react';

const VideoPlayer = () => {
  return (
    <section className="video-section">
      <h2>Featured Music Video</h2>
      <div className="video-container">
        <video 
          width="100%" 
          height="400" 
          controls
          style={{ borderRadius: '12px' }}
        >
          <source src="/assets/The Sins - Emotional Nasheed By Muhammad al Muqit.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </section>
  );
};

export default VideoPlayer;