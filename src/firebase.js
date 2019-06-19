import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyA8fRk5udVuwZvX1M6-pWRNWoYFXdef9vk",
    authDomain: "maze-733de.firebaseapp.com",
    databaseURL: "https://maze-733de.firebaseio.com",
    projectId: "maze-733de",
    storageBucket: "maze-733de.appspot.com",
    messagingSenderId: "719616225065",
    appId: "1:719616225065:web:a41fa2ef598c6ba8"
};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const googleProvider = new firebase.auth.GoogleAuthProvider();

export const db = firebase.firestore();