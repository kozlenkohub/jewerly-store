import React from 'react';

const Hero = () => {
  return (
    <div style={{ width: '100%', height: '100vh', overflow: 'hidden' }}>
      <video
        src="https://www.w3schools.com/html/mov_bbb.mp4"
        autoPlay
        loop
        muted
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    </div>
  );
};

export default Hero;
