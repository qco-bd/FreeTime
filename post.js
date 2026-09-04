import {
    getFirestore,
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import { auth, app } from "./firebase.js";

const db = getFirestore(app);

window.savePostToFirebase = async function (text, background) {

    const user = auth.currentUser;

    if (!user) {
        alert("Please login first.");
        return false;
    }

    if (!text || text.trim() === "") {
        alert("Please write something.");
        return false;
    }

    try {

        await addDoc(collection(db, "posts"), {
            uid: user.uid,
            text: text.trim(),
            background: background || "",
            createdAt: serverTimestamp()
        });

        alert("Post published successfully!");

        return true;

    } catch (error) {

        console.error("Firebase Post Error:", error);

        alert("Failed to publish post:\n\n" + error.message);

        return false;
    }
};


/*
   FreeTime Post System Loaded
*/

console.log("FreeTime Post System loaded successfully.");
