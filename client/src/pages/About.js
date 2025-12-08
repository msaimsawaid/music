import React, { useState, useEffect } from 'react';
import musicData from '../data/musicData.json';

const About = () => {
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    setTeamMembers(musicData.teamMembers);
  }, []);

  return (
    <div className="about-page">
      {/* About Hero */}
      <section className="about-hero">
        <img src="assets/about-hero.jpg" alt="About Music World" />
        <div className="about-text">
          <h1>About Music World</h1>
          <p>Music World is a demo music site built to demonstrate layout techniques and to be a foundation for future API integrations.</p>
          <ul>
            <li>Semantic HTML and responsive design</li>
            <li>Separate Flexbox and Grid implementations</li>
          </ul>
        </div>
      </section>

      {/* Team Section */}
      <section className="team">
        <h2>Our Team</h2>
        <div className="team-grid">
          {teamMembers.map(member => (
            <div key={member.id} className="team-member">
              <img src={member.image} alt={member.name} />
              <h3>{member.name}</h3>
              <p>{member.role}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;