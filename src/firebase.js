import firebase from 'firebase'

const firebaseConfig = {
  apiKey: "AIzaSyBuxal4uHZHMKny3CVfQobRD6A6THlGlXM",
  authDomain: "netflixe-clone2.firebaseapp.com",
  projectId: "netflixe-clone2",
  storageBucket: "netflixe-clone2.appspot.com",
  messagingSenderId: "259038655341",
  appId: "1:259038655341:web:4c21514a49e30a1858e064"
};

const firebaseApp = firebase.initializeApp(firebaseConfig)
const db = firebaseApp.firestore()
const auth = firebase.auth()

export { auth }
export default db