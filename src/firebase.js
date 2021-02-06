import firebase from "firebase";
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCnyTI86LqBSgTWkGXE4DQg220eV0yGxMQ",
  authDomain: "wheresapp-98e94.firebaseapp.com",
  databaseURL: "https://wheresapp-98e94.firebaseio.com",
  projectId: "wheresapp-98e94",
  storageBucket: "wheresapp-98e94.appspot.com",
  messagingSenderId: "562796182008",
  appId: "1:562796182008:web:81aac45091cc962bc63e0d",
  measurementId: "G-BB35DZP80B"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
const gprovider = new firebase.auth.GoogleAuthProvider();
const fprovider = new firebase.auth.FacebookAuthProvider();
export { auth, gprovider, fprovider, storage };
export default db;

