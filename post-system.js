// ==========================================
// FreeTime - Post System
// ==========================================

import {
    getFirestore,
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {
    getAuth,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";


// Firebase App
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";


// ==========================================
// FIREBASE CONFIG
// ==========================================

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.firebasestorage.app",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);


// ==========================================
// CREATE POST
// ==========================================

async function createPost() {

    const textBox = document.getElementById("postText");

    if (!textBox) {
        console.error("postText element not found.");
        return;
    }

    const text = textBox.value.trim();

    if (!text) {
        alert("Please write something before posting.");
        return;
    }


    const user = auth.currentUser;

    if (!user) {
        alert("Please login first.");
        return;
    }


    try {

        await addDoc(collection(db, "posts"), {

            uid: user.uid,

            name: user.displayName || "FreeTime User",

            email: user.email || "",

            photoURL: user.photoURL || "",

            text: text,

            background: "default",

            likes: 0,

            comments: 0,

            shares: 0,

            createdAt: serverTimestamp()

        });


        // Clear textarea
        textBox.value = "";


        alert("Post published successfully!");


    } catch (error) {

        console.error("Post creation error:", error);

        alert("Failed to publish post.");

    }

}


// ==========================================
// MAKE FUNCTION AVAILABLE
// ==========================================

window.createPost = createPost;


// ==========================================
// CHECK LOGIN
// ==========================================

onAuthStateChanged(auth, (user) => {

    if (user) {

        console.log("Logged in:", user.uid);

    } else {

        console.log("No user logged in.");

    }

});
