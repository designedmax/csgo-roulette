стоп
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';

const ProfileContainer = styled.div`
  padding: 20px;
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

const ProfileInfo = styled.div`
  margin: 20px 0;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
`;

const HistoryItem = styled.div`
  padding: 10px;
  margin: 5px 0;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
`;

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

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('profile');
    return saved ? JSON.parse(saved) : {
      name: 'Пользователь',
      spins: 0,
      history: []
    };
  });

  return (
    <ProfileContainer>
      <BackButton to="/">← Назад</BackButton>
      
      <h2>Профиль</h2>
      
      <ProfileInfo>
        <h3>Имя: {profile.name}</h3>
        <p>Количество кручений: {profile.spins}</p>
      </ProfileInfo>

      <h3>История кручений:</h3>
      {profile.history.map((spin, index) => (
        <HistoryItem key={index}>
          <div>Тариф: {spin.tariff} руб</div>
          <div>Выигрыш: {spin.result}</div>
          <div>Дата: {new Date(spin.timestamp).toLocaleString()}</div>
        </HistoryItem>
      ))}
    </ProfileContainer>
  );
}