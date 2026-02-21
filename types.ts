
export type BookKey = 'arcadia' | 'boreas' | 'hades' | 'notos' | 'vulcan-city';

export interface HeroData {
  currentBook: BookKey;
  name: string;
  location: string;
  companion: string;
  god: string;
  
  charm: number;
  grace: number;
  ingenuity: number;
  strength: number;
  
  isWounded: boolean;
  
  glory: number;
  scars: number;
  money: number;
  blessings: number;
  
  possessions: string;
  codewords: string;
  titles: string;
  notes: string;
  ticks: string;
  vault: string;
}

export const INITIAL_SHEET_DATA: HeroData = {
  currentBook: 'hades',
  name: "",
  location: "",
  companion: "",
  god: "",
  
  charm: 0,
  grace: 0,
  ingenuity: 0,
  strength: 0,
  
  isWounded: false,
  
  glory: 0,
  scars: 0,
  money: 0,
  blessings: 0,
  
  possessions: "",
  codewords: "",
  titles: "",
  notes: "",
  ticks: "",
  vault: "",
};
