
import React from 'react';

interface StatBoxProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  step?: number;
  isLarge?: boolean;
  isFreeForm?: boolean
}

export const StatBox: React.FC<StatBoxProps> = ({ label, value, onChange, min = 0, max = 99, step = 1, isLarge = false, isFreeForm = false }) => {
  return (
    <div className={`flex flex-col items-center justify-center p-2 border-2 border-solid rounded-md overlay-paper ${isLarge ? 'min-w-[100px]' : 'min-w-[70px]'}`}>
      <span className="text-xs font-sc uppercase tracking-widest text-stone-800 mb-1">{label}</span>
      
        { isFreeForm ? 
          <input 
            type="number" 
            value={value}
            onChange={({ target }) => onChange(target.value)}
            className="w-full border-2 border-solid rounded-md overlay-paper text-black text-center p-1 outline-none focus:border-stone-900 transition-colors" 
          /> 
          :  
          <div className="flex items-center gap-2">
            <button 
              onClick={() => onChange(Math.max(min, value - step))}
              className="w-8 h-8 flex items-center justify-center bg-stone-900/10 hover:bg-stone-900/20 transition-colors text-stone-900 border border-stone-900/30 rounded"
            >
              -
            </button>
            <span className={`font-sc ${isLarge ? 'text-3xl' : 'text-xl'} text-black`}>{value}</span>
            <button 
              onClick={() => onChange(Math.min(max, value + step))}
              className="w-8 h-8 flex items-center justify-center bg-stone-900/10 hover:bg-stone-900/20 transition-colors text-stone-900 border border-stone-900/30 rounded"
            >
              +
            </button>
        </div> }
    </div>
  );
};
