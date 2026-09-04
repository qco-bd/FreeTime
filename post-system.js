// ==========================================
// FreeTime - Post System
// ==========================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    getFirestore,
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


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


// ==========================================
// FIREBASE INITIALIZE
// ==========================================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);


// ==========================================
// HTML ELEMENTS
// ==========================================

const postText = document.getElementById("postText");

const publishPostBtn =
    document.getElementById("publishPostBtn");

const postStatus =
    document.getElementById("postStatus");


// ==========================================
// CURRENT USER
// ==========================================

let currentUser = null;


onAuthStateChanged(auth, (user) => {

    currentUser = user;

    if (user) {

        console.log(
            "FreeTime user:",
            user.uid
        );

    } else {

        console.log(
            "No user logged in."
        );

    }

});


// ==========================================
// CREATE POST
// ==========================================

async function publishPost() {

    if (!currentUser) {

        postStatus.textContent =
            "Please login first.";

        return;
    }


    const text =
        postText.value.trim();


    if (!text) {

        postStatus.textContent =
            "Please write something.";

        return;
    }


    publishPostBtn.disabled = true;

    publishPostBtn.textContent =
        "Posting...";


    try {

        await addDoc(
            collection(db, "posts"),
            {

                uid: currentUser.uid,

                name:
                    currentUser.displayName ||
                    "FreeTime User",

                email:
                    currentUser.email ||
                    "",

                photoURL:
                    currentUser.photoURL ||
                    "",

                text: text,

                background: "default",

                likes: 0,

                comments: 0,

                shares: 0,

                createdAt:
                    serverTimestamp()

            }
        );


        postText.value = "";


        postStatus.textContent =
            "Post published successfully!";


        console.log(
            "FreeTime post published."
        );


    } catch (error) {

        console.error(
            "Post Error:",
            error
        );


        postStatus.textContent =
            "Failed to publish post.";

    }


    publishPostBtn.disabled = false;

    publishPostBtn.textContent =
        "Post";

}


// ==========================================
// BUTTON
// ==========================================

if (publishPostBtn) {

    publishPostBtn.addEventListener(
        "click",
        publishPost
    );

}


// ==========================================
// GLOBAL
// ==========================================

window.publishPost =
    publishPost;
