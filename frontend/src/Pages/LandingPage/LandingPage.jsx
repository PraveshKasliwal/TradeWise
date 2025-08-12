import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div onClick={() => navigate('/login')} style={{ cursor: 'pointer', color: 'blue' }}>
        Login
      </div>
      <p>
        This is a stock trading Application
      </p>
    </div>
  );
};

export default LandingPage;