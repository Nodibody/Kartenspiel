export interface Session {
  sessionId: string;
  players?: string[];
  cards?: PlayerCardTypes[];
  rechter?: Partial<CardType>;
  round1?: CardType[];
  round2?: CardType[];
  round3?: CardType[];
  round4?: CardType[];
  round5?: CardType[];
  roundNo?: number;
  nextPlayer?: string;
  winners?: string[];
}

export interface PlayerCardTypes {
  name: string;
  cards: CardType[];
}

export interface CardType {
  color: Color;
  level: number;
  levelString: string;
  player?: string;
}
export enum Color {
  Eichel = 'Eichel',
  Herz = 'Herz',
  Laub = 'Laub',
  Schelle = 'Schelle',
}
