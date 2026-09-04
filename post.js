import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { app } from "./firebase.js";

const db = getFirestore(app);
const auth = getAuth(app);

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

        console.error("Post Error:", error);

        alert("Failed to publish post.");

        return false;
    }
};
