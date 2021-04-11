import firebase from 'firebase/app';
import 'firebase/auth';

export const logout = () => {
  return firebase.auth().signOut();
};