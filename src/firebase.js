// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebase from "firebase/compat/app";
import  "firebase/compat/auth";
import "firebase/compat/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyA-JhrUlf7cziZq9frtfxleHF6XjlDDfVM",
    authDomain: "clone-baafc.firebaseapp.com",
    projectId: "clone-baafc",
    storageBucket: "clone-baafc.appspot.com",
    messagingSenderId: "63896957933",
    appId: "1:63896957933:web:da17bceaf3790f5a2e6de4",
    measurementId: "G-EX3FBDJG9Z"
  };


const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebase.auth();

export { db, auth };