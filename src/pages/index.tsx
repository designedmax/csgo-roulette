import { useEffect, useState } from 'react';
import { WebApp } from '@twa-dev/sdk';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { ref, set } from 'firebase/database';
import { db, rtdb } from '../lib/firebase';
import RouletteWheel from '../components/RouletteWheel';
import WinningSkin from '../components/WinningSkin';
import { getRandomSkin, reserveSkin } from '../lib/marketApi';

interface GameResult {
  id: string;
  userId: string;
  result: boolean;
  skinId?: string;
  skinName?: string;
  date: Date;
}

interface Skin {
  id: string;
  name: string;
  price: number;
  image: string;
}

export default function Home() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [lastResult, setLastResult] = useState<GameResult | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [winningSkin, setWinningSkin] = useState<Skin | null>(null);

  useEffect(() => {
    // Initialize Telegram Web App
    WebApp.ready();
    
    // Get user data from Telegram
    const initData = WebApp.initDataUnsafe;
    if (initData.user) {
      setUserData(initData.user);
      loadLastResult(initData.user.id);
    }
  }, []);

  const loadLastResult = async (userId: string) => {
    const q = query(
      collection(db, 'games'),
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const lastGame = querySnapshot.docs[querySnapshot.docs.length - 1];
      setLastResult({
        id: lastGame.id,
        ...lastGame.data()
      } as GameResult);
    }
  };

  const handleSpinComplete = async () => {
    // 40% chance to win
    const isWin = Math.random() < 0.4;
    
    try {
      let skinData = null;
      if (isWin) {
        const skin = await getRandomSkin(100); // Max price 100 rubles
        if (skin) {
          const reserved = await reserveSkin(skin.id);
          if (reserved) {
            skinData = skin;
          }
        }
      }

      const gameResult = {
        userId: userData.id,
        result: isWin,
        skinId: skinData?.id,
        skinName: skinData?.name,
        date: new Date()
      };

      // Save to Firestore
      const docRef = await addDoc(collection(db, 'games'), gameResult);
      
      // Save to Realtime Database for real-time updates
      await set(ref(rtdb, `games/${docRef.id}`), gameResult);

      setLastResult({
        id: docRef.id,
        ...gameResult
      } as GameResult);

      if (isWin && skinData) {
        setWinningSkin(skinData);
        WebApp.showAlert(`Congratulations! You won ${skinData.name}!`);
      }
    } catch (error) {
      // Error handling without console.log
    } finally {
      setIsSpinning(false);
    }
  };

  const spinRoulette = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setWinningSkin(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">CS:GO Roulette</h1>
        
        <RouletteWheel isSpinning={isSpinning} onSpinComplete={handleSpinComplete} />
        
        {winningSkin && <WinningSkin skin={winningSkin} />}
        
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <p className="text-center mb-4">Win Chance: 40%</p>
          
          <button
            onClick={spinRoulette}
            disabled={isSpinning}
            className={`w-full py-3 px-6 rounded-lg font-bold transition-all
              ${isSpinning 
                ? 'bg-gray-600 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
              }`}
          >
            {isSpinning ? 'Spinning...' : 'Spin Roulette'}
          </button>
        </div>

        {lastResult && !winningSkin && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Last Result</h2>
            <p className="text-center">
              {lastResult.result 
                ? `🎉 You won ${lastResult.skinName || 'a skin'}!` 
                : '😢 Better luck next time!'}
            </p>
            <p className="text-center text-sm text-gray-400 mt-2">
              {new Date(lastResult.date).toLocaleString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 