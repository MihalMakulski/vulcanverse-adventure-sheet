import React from 'react';
import { BookKey } from '../types';

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: BookKey;
}

const MAP_TITLES: Record<BookKey, string> = {
  'hades': '1. The Houses of the Dead',
  'notos': '2. The Hammer of the Sun',
  'boreas': '3. The Wild Woods',
  'arcadia': '4. The Pillars of the Sky',
  'vulcan-city': '5. Workshop of the Gods'
};

export const MapModal: React.FC<MapModalProps> = ({ isOpen, onClose, book }) => {
  if (!isOpen) return null;

  // Sourcing from the local maps folder as requested
  // Using .png extension which is standard for high-quality map uploads
  const mapUrl = `maps/${book}.jpg`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 md:p-4 bg-stone-900/80 backdrop-blur-md">
      <div className="relative w-full max-w-5xl max-h-[95vh] rough-border overlay-paper bg-[#f4ece1] p-1 overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="flex justify-between items-center p-3 md:p-4 border-b border-stone-900/20 bg-[#ece2d3]">
          <h2 className="text-lg md:text-2xl font-sc text-stone-900 tracking-widest uppercase truncate pr-4">
            {MAP_TITLES[book]}
          </h2>
          <button 
            onClick={onClose}
            className="text-stone-900 hover:text-red-800 transition-colors text-3xl leading-none px-2 focus:outline-none"
            aria-label="Close Map"
          >
            &times;
          </button>
        </div>
        <div className="flex-1 overflow-auto bg-[#dcd2c3] scrollbar-hide flex items-start justify-center cursor-grab active:cursor-grabbing">
          <img 
            src={mapUrl} 
            alt={`${MAP_TITLES[book]} Map`} 
            className="max-w-none min-w-full md:max-w-full h-auto object-contain transition-transform duration-200"
            onError={(e) => {
              // Fallback text if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent && !parent.querySelector('.map-error')) {
                const errorMsg = document.createElement('div');
                errorMsg.className = 'map-error p-12 text-center font-sc text-stone-600';
                errorMsg.innerText = `Map file for "${MAP_TITLES[book]}" not found in maps/ directory.`;
                parent.appendChild(errorMsg);
              }
            }}
          />
        </div>
        <div className="p-3 bg-[#ece2d3] text-center text-[10px] md:text-xs text-stone-800 font-sc tracking-wider border-t border-stone-900/10">
          {window.innerWidth < 768 ? 'TAP & DRAG TO PAN • PINCH TO ZOOM' : 'USE SCROLLBARS TO EXPLORE THE REALM'}
        </div>
      </div>
      <div className="absolute inset-0 -z-10" onClick={onClose} title="Click to close" />
    </div>
  );
};