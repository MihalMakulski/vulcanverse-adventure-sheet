
import React, { useState, useCallback } from 'react';

export const DiceRoller: React.FC = () => {
  const [dice, setDice] = useState<[number, number]>([1, 1]);
  const [isRolling, setIsRolling] = useState(false);

  const rollDice = useCallback(() => {
    if (isRolling) return;
    setIsRolling(true);
    
    // Play vibration if supported
    if (window.navigator.vibrate) {
      window.navigator.vibrate(50);
    }

    // Simulate multiple rolls during animation
    let count = 0;
    const interval = setInterval(() => {
      setDice([Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1]);
      count++;
      if (count > 5) {
        clearInterval(interval);
        setIsRolling(false);
      }
    }, 80);
  }, [isRolling]);

  return (
    <div 
      onClick={rollDice}
      className="fixed bottom-6 right-6 z-50 flex flex-col items-center cursor-pointer group"
    >
      <div className="text-[10px] font-sc text-stone-700 opacity-0 group-hover:opacity-100 transition-opacity mb-1 uppercase tracking-widest">
        Tap to Roll
      </div>
      <div className={`flex gap-3 p-3 rough-border overlay-paper bg-white/40 shadow-xl transition-transform active:scale-95 ${isRolling ? 'rolling' : ''}`}>
        <DiceFace value={dice[0]} />
        <DiceFace value={dice[1]} />
      </div>
      <div className="mt-2 text-xl font-sc text-black drop-shadow-sm">
        {dice[0] + dice[1]}
      </div>
    </div>
  );
};

const DiceFace: React.FC<{ value: number }> = ({ value }) => {
  const getDots = (val: number) => {
    switch (val) {
      case 1: return [4];
      case 2: return [0, 8];
      case 3: return [0, 4, 8];
      case 4: return [0, 2, 6, 8];
      case 5: return [0, 2, 4, 6, 8];
      case 6: return [0, 2, 3, 5, 6, 8];
      default: return [];
    }
  };

  const dots = getDots(value);

  return (
    <div className="w-12 h-12 bg-stone-50 rounded-md grid grid-cols-3 grid-rows-3 p-1 border-2 border-stone-900/30">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="flex items-center justify-center">
          {dots.includes(i) && (
            <div className="w-2.5 h-2.5 bg-stone-900 rounded-full shadow-inner" />
          )}
        </div>
      ))}
    </div>
  );
};
