import firebase from 'firebase/app'
//con este import estamos habilitando el uso de la base de datos
import 'firebase/firestore'


const firebaseConfig = {
    apiKey: "AIzaSyBttHxmRfy3rogILvlSA377grn5Em8XnUs",
    authDomain: "restaurants-e88ff.firebaseapp.com",
    projectId: "restaurants-e88ff",
    storageBucket: "restaurants-e88ff.appspot.com",
    messagingSenderId: "272434749016",
    appId: "1:272434749016:web:160387bd28ee8f3af8b42d"
  }

  // Initialize Firebase
export const firebaseApp = firebase.initializeApp(firebaseConfig);