import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyAatpoCHMMqVm9VcFKOYdIHOa1nhiG_x1M",
    authDomain: "freetime-794a8.firebaseapp.com",
    projectId: "freetime-794a8",
    storageBucket: "freetime-794a8.firebasestorage.app",
    messagingSenderId: "972310400799",
    appId: "1:972310400799:web:0c925fbe7ed29f6c39ea2a"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export {
    auth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile
};
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


const firebaseConfig = {
    apiKey: "AIzaSyAatpoCHMMqVm9VcFKOYdIHOa1nhiG_x1M",
    authDomain: "freetime-794a8.firebaseapp.com",
    projectId: "freetime-794a8",
    storageBucket: "freetime-794a8.firebasestorage.app",
    messagingSenderId: "972310400799",
    appId: "1:972310400799:web:0c925fbe7ed29f6c39ea2a"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


export {
    auth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    onAuthStateChanged,
    signOut
};
