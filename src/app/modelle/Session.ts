import { KartenTyp, PlayedCardType } from './KartenTyp';

export interface Session extends FirestoreSession {
  sessionId: string;
}
export interface FirestoreSession {
  players?: string[];
  cards?: { name: string; cards: KartenTyp[] }[];
  round1?: PlayedCardType[];
  round2?: PlayedCardType[];
  round3?: PlayedCardType[];
  round4?: PlayedCardType[];
  round5?: PlayedCardType[];
  winners?: string[];
  roundNo?: number;
  nextPlayer?: string;
}
