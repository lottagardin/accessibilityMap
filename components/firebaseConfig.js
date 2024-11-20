import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyC3ZgozDqDYmks5MpawmwnMcQOJxFNAADw",
    authDomain: "saavutettavuuskartta.firebaseapp.com",
    databaseURL: "https://saavutettavuuskartta-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "saavutettavuuskartta",
    storageBucket: "saavutettavuuskartta.appspot.com",
    messagingSenderId: "265841574148",
    appId: "1:265841574148:web:6dff64a34a92d4fdd69051",
    measurementId: "G-53PHSPP9BP"
};

export const app = initializeApp(firebaseConfig);