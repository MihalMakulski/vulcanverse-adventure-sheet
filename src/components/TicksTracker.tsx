import React, { useState } from 'react';

interface TicksTrackerProps {
  sectionsTicked: Array<Array<string>>;
  onAddSextion: () => void;
}

export const TicksTracker: React.FC<TicksTrackerProps> = ({ sectionsTicked, updateField }) => {
  const [section, setSection] = useState("");
  const [notes, setNotes] = useState("");

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-end gap-2">
        <div className="flex flex-col gap-1">
          <label className="font-sc text-sm text-stone-800 tracking-wider uppercase pl-1">Section</label>
          <input 
            type="number" 
            value={section}
            onChange={({target}) => setSection(target.value)}
            className="w-full rough-border overlay-paper text-black text-center p-1 outline-none focus:border-stone-900 transition-colors" 
          />  
        </div>
        <div className="flex flex-col gap-1">
          <label className="font-sc text-sm text-stone-800 tracking-wider uppercase pl-1">Notes</label>
          <input 
            type="text" 
            value={notes}
            onChange={({target}) => setNotes(target.value)}
            className="w-full rough-border overlay-paper text-black text-center p-1 outline-none focus:border-stone-900 transition-colors" 
          />  
        </div>
        <button 
          className="w-9 h-9 flex items-center justify-center bg-stone-900/10 hover:bg-stone-900/20 transition-colors text-stone-900 border border-stone-900/30 rounded"
          onClick={() => {
            if (!section) return;
            const filteredTicks = (sectionsTicked || []).filter((sectionData) => sectionData[0] !== section);

            updateField('ticks', [...filteredTicks, [section, notes]]);
            setSection('');
            setNotes('');
          }}
        >
          +
        </button>
      </div>
      <div className="mt-3">Section ticks:</div>
      <div className="h-50 w-full rough-border overlay-paper text-black p-3 overflow-y-auto overflow-x-hidden">
        <ul className="flex flex-col gap-1 divide-y">
          {[...(sectionsTicked || [])].sort((sectionA, sectionB) => +sectionA[0] - +sectionB[0]).map((sectionData) => {
            const [section, notes] = sectionData;
            return (
              <li key={section} className="flex justify-between p-1">
                ✓ {`${section} ${notes ? ' - ' : ''} ${notes}`}
                  <button 
                    className="w-6 h-6 flex items-center justify-center bg-stone-900/10 hover:bg-stone-900/20 transition-colors text-stone-900 border border-stone-900/30 rounded"
                    onClick={() => {
                      const newTicks = (sectionsTicked || []).filter((sectionData) => sectionData[0] !== section);

                      updateField('ticks', newTicks);
                    }}
                >
                  -
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
    
  );
};