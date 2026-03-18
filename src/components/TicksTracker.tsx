import React, { useState } from 'react';

interface TicksTrackerProps {
  sectionsTicked: Array<Array<string>>;
  currentBook: string;
  updateField: () => Object;
}

export const TicksTracker: React.FC<TicksTrackerProps> = ({currentBook, sectionsTicked, updateField }) => {
  const [section, setSection] = useState("");
  const [notes, setNotes] = useState("");
  const sectionsTickedCopy = [...(sectionsTicked || [])];
  const ticksInCurrentBook = sectionsTickedCopy.filter(([,,book]) => book === currentBook);
  
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-end gap-2">
        <div className="flex flex-col gap-1">
          <label className="font-sc text-sm text-stone-800 tracking-wider uppercase pl-1">Tick section</label>
          <input 
            type="number" 
            value={section}
            onChange={({target}) => setSection(target.value)}
            className="w-full border-2 border-solid rounded-md overlay-paper text-black text-center p-1 outline-none focus:border-stone-900 transition-colors" 
          />  
        </div>
        <div className="flex flex-col gap-1">
          <label className="font-sc text-sm text-stone-800 tracking-wider uppercase pl-1">Notes</label>
          <input 
            type="text" 
            value={notes}
            onChange={({target}) => setNotes(target.value)}
            className="w-full border-2 border-solid rounded-md overlay-paper text-black text-center p-1 outline-none focus:border-stone-900 transition-colors" 
          />  
        </div>
        <button 
          className="w-9 h-9 flex shrink-0 items-center justify-center bg-stone-900/10 hover:bg-stone-900/20 transition-colors text-stone-900 border border-stone-900/30 rounded"
          onClick={() => {
            if (!section) return;
            const alreadyExistingTickIdx = sectionsTickedCopy.findIndex(([tickedSection,,book]) => (tickedSection === section) && (book === currentBook));
            
            if (alreadyExistingTickIdx !== -1) {
              updateField('ticks', [...sectionsTickedCopy.slice(0, alreadyExistingTickIdx), [section, notes, currentBook], ...sectionsTickedCopy.slice(alreadyExistingTickIdx + 1)]);
            } else {
              updateField('ticks', [...sectionsTickedCopy, [section, notes, currentBook]]);
            }
            
            setSection('');
            setNotes('');
          }}
        >
          +
        </button>
      </div>
      <div className="mt-3">Section ticks:</div>
      <div className="h-50 w-full border-2 border-solid rounded-md overlay-paper text-black p-2 overflow-x-auto">
        <ul className="flex flex-col gap-1 divide-y">
          { 
            !ticksInCurrentBook.length ?  
              <p>No ticks in this book yet.</p> :
            ticksInCurrentBook
              .sort((sectionA, sectionB) => +sectionA[0] - +sectionB[0])
              .map((sectionData) => {
                const [section, notes] = sectionData;
                  return (
                    <li key={section} className="flex justify-between p-1">
                      ✓ {`${section} ${notes ? ' - ' : ''} ${notes}`}
                        <button 
                          className="w-6 h-6 shrink-0 flex items-center justify-center bg-stone-900/10 hover:bg-stone-900/20 transition-colors text-stone-900 border border-stone-900/30 rounded"
                          onClick={() => {
                            const tickToDeleteIdx = sectionsTickedCopy.findIndex(([tickedSection,,book]) => (section === tickedSection) && (book === currentBook));
                            const newTicks = [...sectionsTickedCopy.slice(0, tickToDeleteIdx), ...sectionsTickedCopy.slice(tickToDeleteIdx + 1)];

                            updateField('ticks', newTicks);
                          }}
                      >
                        -
                      </button>
                    </li>
                  );
              })
            }
        </ul>
      </div>
    </div>
    
  );
};