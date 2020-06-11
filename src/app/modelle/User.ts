export interface User extends FirebaseUser {
  uid: string;
}
export interface FirebaseUser {
  name: string;
  password: string;
}
