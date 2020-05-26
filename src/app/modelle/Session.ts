import { KartenTyp } from './KartenTyp';

export interface Session extends FirestoreSession {
  sessionId: string;
}
export interface FirestoreSession {
  players?: string[];
  cards?: { name: string; cards: KartenTyp[] }[];
  rounds?: KartenTyp[][];
  winner?: string;
}
