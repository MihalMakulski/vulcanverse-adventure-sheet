
import React from 'react';

interface TextAreaFieldProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  rows?: number;
}

export const TextAreaField: React.FC<TextAreaFieldProps> = ({ label, value, onChange, placeholder, rows = 4 }) => {
  return (
    <div className="flex flex-col w-full gap-1">
      <label className="font-sc text-sm text-stone-800 tracking-wider uppercase pl-1">{label}</label>
      <textarea
        className="w-full rough-border overlay-paper text-black p-3 outline-none focus:border-stone-900 transition-colors resize-none placeholder:text-stone-500"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
      />
    </div>
  );
};
