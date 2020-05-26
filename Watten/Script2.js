// JavaScript source code
public class Card implements Comparable<Card>{
	
	private final Farbe farbe;
	private final Rang rang;
	
	
	public enum Farbe{
		HERZ, EICHEL, SCHELLEN, LAUB;
	}
	public enum Rang{
		SECHS, SIEBEN, ACHT, NEUN, ZEHN, UNTER, OBER, KÖNIG, SAU;
		
		public int rang(){
			return this.ordinal() + 2;
		}
	}
	
	public Card(Rang rang, Farbe farbe){
		this.rang = rang;
		this.farbe = farbe;
	}

	public int compareTo(Card card){
		return this.rang.compareTo(card.rang);
	}

	public Rang getRank() {
		return rang;
	}

	public Farb getSuit() {
		return farbe;
	}
	
	public String toString(){
		return "" + rang + " "+ farbe;
	}
	
	public static void main(String [] args){
		Card c = new Card(Rang.ZWEI, Farbe.HERZ);
		Card c2 = new Card(Rang.ZEHN,Farbe.HERZ);
		
		System.out.println(c);
		System.out.println(c.rang.compareTo(c2.rang));
	}
}
