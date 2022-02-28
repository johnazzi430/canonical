import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
// import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
// import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCWSF2RKi-MhW6QtxAUjciKN9fpshHo3Kc",
  authDomain: "canonical-fb93b.firebaseapp.com",
  projectId: "canonical-fb93b",
  storageBucket: "canonical-fb93b.appspot.com",
  messagingSenderId: "703915093257",
  appId: "1:703915093257:web:e5f386cec7132e297237d8",
  measurementId: "G-01KEDY9ERR"
};

firebase.initializeApp(firebaseConfig);

export default firebase;
