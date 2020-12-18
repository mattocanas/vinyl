import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
  apiKey: 'AIzaSyDr4Tla09gu1oV5sOXM0xZ8cVrj28WnLmo',
  authDomain: 'vinyl-932d1.firebaseapp.com',
  projectId: 'vinyl-932d1',
  storageBucket: 'vinyl-932d1.appspot.com',
  messagingSenderId: '420772807801',
  appId: '1:420772807801:web:b7aea027f42e09a3e940a8',
  measurementId: 'G-RKXR95T2CJ',
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export {db, auth, storage};
