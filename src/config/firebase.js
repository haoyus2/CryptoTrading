import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyDnYQ1ogBJN__MtAkJCyYZKpBLRwXBUrlw",
    authDomain: "tradingweb-fa6f7.firebaseapp.com",
    projectId: "tradingweb-fa6f7",
    storageBucket: "tradingweb-fa6f7.appspot.com",
    messagingSenderId: "725579078220",
    appId: "1:725579078220:web:85005865c4d1bcd373b2e9",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const auth = getAuth(app);

export { auth, app, db };
