я меня iлmport { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { useState, useEffect } from 'react';
import Roulette from './components/Roulette';
import Profile from './components/Profile';

interface SpinHistory {
  tariff: number;
  result: string;
  timestamp: number;
}

interface UserProfile {
  name: string;
  spins: number;
  history: SpinHistory[];
}

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const TariffButton = styled.button`
  width: 100%;
  padding: 15px;
  margin: 10px 0;
  font-size: 18px;
  background-color: #4a76a8;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  &:hover {
    background-color: #3d6898;
  }
`;

const ProfileButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 10px;
  background-color: #4a76a8;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
`;

function App() {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('profile');
    return saved ? JSON.parse(saved) : {
      name: 'Пользователь',
      spins: 0,
      history: []
    };
  });

  useEffect(() => {
    localStorage.setItem('profile', JSON.stringify(profile));
  }, [profile]);

  return (
    <Router>
      <Container>
        <Routes>
          <Route path="/" element={
            <div>
              <Link to="/profile">
                <ProfileButton>👤</ProfileButton>
              </Link>
              <h1>CS:GO Рулетка Скинов</h1>
              <Link to="/roulette/100"><TariffButton>100 руб</TariffButton></Link>
              <Link to="/roulette/300"><TariffButton>300 руб</TariffButton></Link>
              <Link to="/roulette/500"><TariffButton>500 руб</TariffButton></Link>
              <Link to="/roulette/1000"><TariffButton>1000 руб</TariffButton></Link>
            </div>
          } />
          <Route path="/roulette/:tariff" element={<Roulette />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;