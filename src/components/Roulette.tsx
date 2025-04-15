import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from '@emotion/styled';

const RouletteContainer = styled.div`
  padding: 20px;
  text-align: center;
`;

const RouletteWheel = styled.div<{ spinning: boolean }>`
  width: 100%;
  height: 100px;
  margin: 20px 0;
  background: linear-gradient(90deg, #ff4d4d, #ffad4d, #4dff4d, #4d4dff);
  background-size: 400% 100%;
  animation: ${props => props.spinning ? 'spin 1s linear infinite' : 'none'};
  
  @keyframes spin {
    0% { background-position: 0% 50%; }
    100% { background-position: 100% 50%; }
  }
`;

const SpinButton = styled.button`
  padding: 15px 30px;
  font-size: 18px;
  background-color: #4a76a8;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  &:disabled {
    background-color: #cccccc;
  }
`;

const HistoryContainer = styled.div`
  margin-top: 20px;
  text-align: left;
`;

const BackButton = styled(Link)`
  display: inline-block;
  padding: 10px 20px;
  background-color: #4a76a8;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const skins = {
  100: ['P250 | Sand Dune', 'Nova | Rust Coat', 'MP9 | Storm', 'Five-SeveN | Forest Night'],
  300: ['AK-47 | Elite Build', 'M4A4 | Desert Storm', 'AWP | Safari Mesh', 'USP-S | Night Ops'],
  500: ['AK-47 | Redline', 'M4A4 | Dragon King', 'AWP | Electric Hive', 'Desert Eagle | Hypnotic'],
  1000: ['AK-47 | Asiimov', 'M4A4 | Neo-Noir', 'AWP | Wildfire', 'Desert Eagle | Blaze']
};

interface SpinHistory {
  tariff: number;
  result: string;
  timestamp: number;
}

export default function Roulette() {
  const { tariff } = useParams<{ tariff: string }>();
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string>('');
  const [history, setHistory] = useState<SpinHistory[]>(() => {
    const saved = localStorage.getItem(`history_${tariff}`);
    return saved ? JSON.parse(saved) : [];
  });

  const currentTariff = Number(tariff);
  const availableSkins = skins[currentTariff as keyof typeof skins] || [];

  useEffect(() => {
    localStorage.setItem(`history_${tariff}`, JSON.stringify(history));
  }, [history, tariff]);

  const spin = () => {
    setSpinning(true);
    setResult('');

    setTimeout(() => {
      const randomSkin = availableSkins[Math.floor(Math.random() * availableSkins.length)];
      setResult(randomSkin);
      setSpinning(false);
      
      const newSpin: SpinHistory = {
        tariff: currentTariff,
        result: randomSkin,
        timestamp: Date.now()
      };
      
      setHistory(prev => [newSpin, ...prev]);

      // Обновляем общую историю в профиле
      const profileData = localStorage.getItem('profile');
      if (profileData) {
        const profile = JSON.parse(profileData);
        profile.spins += 1;
        profile.history = [newSpin, ...profile.history];
        localStorage.setItem('profile', JSON.stringify(profile));
      }
    }, 2000);
  };

  return (
    <RouletteContainer>
      <BackButton to="/">← Назад</BackButton>
      <h2>Рулетка {currentTariff} руб</h2>
      <RouletteWheel spinning={spinning} />
      {result && <h3>Результат: {result}</h3>}
      <SpinButton onClick={spin} disabled={spinning}>
        {spinning ? 'Крутим...' : 'Крутить'}
      </SpinButton>
      
      <HistoryContainer>
        <h3>История кручений:</h3>
        {history.map((spin, index) => (
          <div key={index}>
            {spin.result} - {new Date(spin.timestamp).toLocaleString()}
          </div>
        ))}
      </HistoryContainer>
    </RouletteContainer>
  );
}