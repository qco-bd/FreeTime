import {
    getFirestore,
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import { auth, app } from "./firebase.js";

const db = getFirestore(app);


/* ================================
   SAVE POST
================================ */

window.savePostToFirebase = async function (
    text,
    background
) {

    const user = auth.currentUser;

    if (!user) {
        alert("Please login first.");
        return false;
    }


    /* Check text */

    if (!text || text.trim() === "") {

        alert("Please write something.");

        return false;
    }


    try {

        const userName =
            user.displayName ||
            user.email?.split("@")[0] ||
            "FreeTime User";


        const userPhoto =
            user.photoURL || "";


        await addDoc(
            collection(db, "posts"),
            {

                uid: user.uid,

                name: userName,

                photoURL: userPhoto,

                text: text.trim(),

                background:
                    background || "",

                createdAt:
                    serverTimestamp()

            }
        );


        alert(
            "Post published successfully!"
        );


        return true;


    } catch (error) {

        console.error(
            "Firebase Post Error:",
            error
        );


        alert(
            "Failed to publish post.\n\n" +
            error.message
        );


        return false;
    }
};
