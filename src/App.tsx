import React, { useState, useEffect, useCallback, useRef } from 'react';
import { INITIAL_SHEET_DATA, HeroData, BookKey } from '../types';
import { StatBox } from './components/StatBox';
import { TextAreaField } from './components/TextAreaField';
import { DiceRoller } from './components/DiceRoller';
import { MapModal } from './components/MapModal';

const STORAGE_KEY = 'vulcanverse_adventure_sheet';

const BOOKS: { key: BookKey; label: string }[] = [
  { key: 'hades', label: '1. The Houses of the Dead' },
  { key: 'notos', label: '2. The Hammer of the Sun' },
  { key: 'arcadia', label: '3. The Wild Woods' },
  { key: 'boreas', label: '4. The Pillars of the Sky' },
  { key: 'vulcan-city', label: '5. Workshop of the Gods' },
];

const App: React.FC = () => {
  const [data, setData] = useState<HeroData>(INITIAL_SHEET_DATA);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setData({ ...INITIAL_SHEET_DATA, ...parsed });
      } catch (e) {
        console.error("Failed to parse saved data", e);
      }
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, [data, isInitialized]);

  const updateField = useCallback((field: keyof HeroData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  }, []);

  const resetSheet = useCallback(() => {
    if (confirm("Are you sure you want to reset your adventure sheet? This cannot be undone.")) {
      setData(INITIAL_SHEET_DATA);
    }
  }, []);

  const downloadSheet = useCallback(() => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const filename = `vulcanverse-hero-${data.name.toLowerCase().replace(/\s+/g, '-') || 'unnamed'}-${timestamp}.json`;
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [data]);

  const importSheet = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content);
        // Basic validation/merging with initial data structure
        setData({ ...INITIAL_SHEET_DATA, ...parsed });
        alert('Character sheet imported successfully!');
      } catch (error) {
        console.error('Failed to parse imported file', error);
        alert('Failed to import sheet. Invalid file format.');
      }
    };
    reader.readAsText(file);
    // Reset input value to allow importing the same file again if needed
    event.target.value = '';
  }, []);

  const triggerImport = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  if (!isInitialized) return null;

  return (
    <div className="min-h-screen fantasy-bg flex flex-col items-center">
      {/* Header */}
      <header className="w-full max-w-2xl px-4 py-8 flex flex-col items-center">
        <h1 className="text-[1.5rem] text-center text-black font-sc tracking-[0.15em] uppercase drop-shadow-sm leading-tight">
          VulcanVerse
        </h1>
        <p className="font-sc text-stone-700 text-xs tracking-widest mt-1">ADVENTURE SHEET</p>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-2xl px-4 flex flex-col gap-8 pb-12">
        
        {/* Identity & Location */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="font-sc text-sm text-stone-800 tracking-wider uppercase pl-1">Name</label>
            <input 
              className="w-full rough-border overlay-paper text-2xl font-sc text-black p-3 outline-none focus:border-stone-900 transition-colors"
              value={data.name}
              onChange={(e) => updateField('name', e.target.value)}
            />
          </div>
        </section>
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="font-sc text-sm text-stone-800 tracking-wider uppercase pl-1">Current Location</label>
            <input 
              className="w-full rough-border overlay-paper text-xl font-sc text-black p-3 outline-none focus:border-stone-900 transition-colors"
              value={data.location}
              onChange={(e) => updateField('location', e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-sc text-sm text-stone-800 tracking-wider uppercase pl-1">Companion</label>
            <input 
              className="w-full rough-border overlay-paper text-xl font-sc text-black p-3 outline-none focus:border-stone-900 transition-colors"
              value={data.companion}
              onChange={(e) => updateField('companion', e.target.value)}
            />
          </div>
        </section>

        {/* Attributes Section */}
        <section className="flex flex-col gap-2">
          <h3 className="font-sc text-stone-900 text-lg tracking-widest uppercase border-b border-stone-900/10 pb-1">Attributes</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatBox label="Charm" value={data.charm} onChange={(v) => updateField('charm', v)} min={-99} />
            <StatBox label="Grace" value={data.grace} onChange={(v) => updateField('grace', v)} min={-99} />
            <StatBox label="Ingenuity" value={data.ingenuity} onChange={(v) => updateField('ingenuity', v)} min={-99} />
            <StatBox label="Strength" value={data.strength} onChange={(v) => updateField('strength', v)} min={-99} />
          </div>
        </section>

        {/* Wound Toggle */}
        <section className="flex flex-col gap-2">
          <div 
            onClick={() => updateField('isWounded', !data.isWounded)}
            className={`w-full rough-border overlay-paper p-4 cursor-pointer flex items-center justify-between transition-colors ${data.isWounded ? 'bg-red-900/15 border-red-950' : 'hover:bg-stone-900/5'}`}
          >
            <span className={`font-sc text-lg tracking-widest uppercase ${data.isWounded ? 'text-red-950 font-bold' : 'text-stone-900'}`}>
              WOUND
            </span>
            <div className={`w-8 h-8 rough-border flex items-center justify-center ${data.isWounded ? 'bg-red-950 border-red-950' : 'bg-transparent'}`}>
              {data.isWounded && <div className="w-4 h-4 bg-white rotate-45" />}
            </div>
          </div>
          <p>When ticked deduct 1 from any attribute rolls</p>
        </section>

        {/* Economy & Status Row */}
        <section className="flex flex-col gap-2">
          <h3 className="font-sc text-stone-900 text-lg tracking-widest uppercase border-b border-stone-900/10 pb-1">Status & Wealth</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatBox label="Glory" value={data.glory} onChange={(v) => updateField('glory', v)} />
            <StatBox label="Scars" value={data.scars} onChange={(v) => updateField('scars', v)} />
            <StatBox label="Money" value={data.money} onChange={(v) => updateField('money', v)} />
            <StatBox label="Blessings" value={data.blessings} onChange={(v) => updateField('blessings', v)} />  
          </div>
        </section>

        {/* Freeform Fields */}
        <div className="flex flex-col gap-6">
          <TextAreaField 
            label="Possessions (maximum of 20)" 
            value={data.possessions} 
            onChange={(v) => updateField('possessions', v)}
            rows={4}
          />
          
          <TextAreaField 
            label="Codewords" 
            value={data.codewords} 
            onChange={(v) => updateField('codewords', v)}
            rows={3}
          />

          <TextAreaField 
            label="Titles" 
            value={data.titles} 
            onChange={(v) => updateField('titles', v)}
            rows={3}
          />

          <TextAreaField 
            label="Adventure Notes" 
            value={data.notes} 
            onChange={(v) => updateField('notes', v)}
            rows={8}
          />
        </div>

        {/* Bottom Controls */}
        <section className="mt-8 pt-12 border-t border-stone-900/10 flex flex-col gap-6">
          <div className="flex flex-col gap-1 w-full">
            <label className="font-sc text-xs text-stone-800 tracking-wider uppercase pl-1">Current Book</label>
            <select 
              className="w-full rough-border overlay-paper font-sc text-lg text-black p-3 outline-none focus:border-stone-900 bg-transparent"
              value={data.currentBook}
              onChange={(e) => updateField('currentBook', e.target.value as BookKey)}
            >
              {BOOKS.map(b => (
                <option key={b.key} value={b.key} className="bg-[#f4ece1]">{b.label}</option>
              ))}
            </select>
          </div>

          <div className="w-full flex flex-col sm:flex-row justify-between items-stretch gap-4">
            <button 
              onClick={() => setIsMapOpen(true)}
              className="flex-1 py-4 rough-border overlay-paper font-sc text-stone-900 uppercase tracking-[0.2em] hover:bg-stone-900/5 transition-all active:translate-y-0.5"
            >
              Open Map
            </button>
            <button 
              onClick={resetSheet}
              className="px-6 py-4 rough-border overlay-paper font-sc text-red-950 uppercase text-xs hover:text-red-700 transition-all"
            >
              Reset Sheet
            </button>
          </div>

          {/* Download & Import Buttons */}
          <div className="flex gap-4">
            <button 
              onClick={downloadSheet}
              className="flex-1 py-4 rough-border overlay-paper font-sc text-stone-900 uppercase tracking-[0.1em] hover:bg-stone-900/5 transition-all active:translate-y-0.5 text-sm"
            >
              Download Sheet (.json)
            </button>
            <button 
              onClick={triggerImport}
              className="flex-1 py-4 rough-border overlay-paper font-sc text-stone-900 uppercase tracking-[0.1em] hover:bg-stone-900/5 transition-all active:translate-y-0.5 text-sm"
            >
              Import Sheet
            </button>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={importSheet}
              accept=".json"
              className="hidden"
            />
          </div>
        </section>
      </main>

      {/* Widgets */}
      <DiceRoller />
      <MapModal isOpen={isMapOpen} onClose={() => setIsMapOpen(false)} book={data.currentBook} />

      {/* Footer Branding */}
      <footer className="w-full py-12 text-center text-stone-900/50 font-sc text-xs tracking-wider">
        Inspired by <a href="https://daelsepara.github.io/vulcanversejs/" target="_blank" rel="noopener noreferrer" className="underline hover:text-stone-900 transition-colors">vulcanversejs</a>
        to use with <a href="https://fabledlands.blogspot.com/p/vulcanverse-solo-roleplaying-gamebooks.html" target="_blank" rel="noopener noreferrer" className="underline hover:text-stone-900 transition-colors">Vulcanverse solo roleplaying gamebooks</a> by Dave Morris & Jamie Thomson 
      </footer>
    </div>
  );
};

export default App;