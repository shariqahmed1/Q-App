import * as firebase from 'firebase';
const config = {
    apiKey: "AIzaSyC0R4st74gR7_1H6ybHKOYbsAqtLhltOIo",
    authDomain: "q-app-93882.firebaseapp.com",
    databaseURL: "https://q-app-93882.firebaseio.com",
    projectId: "q-app-93882",
    storageBucket: "q-app-93882.appspot.com",
    messagingSenderId: "695571379772"
  };
firebase.initializeApp(config);

export default firebase;