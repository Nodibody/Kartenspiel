export interface KartenTyp {
  color: string;
  levelString: string;
  level: number;
}
export interface PlayedCardType extends KartenTyp {
  player: string;
}
