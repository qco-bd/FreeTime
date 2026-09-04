import {
    getFirestore,
    collection,
    query,
    orderBy,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import { app } from "./firebase.js";

const db = getFirestore(app);

const postsQuery = query(
    collection(db, "posts"),
    orderBy("createdAt", "desc")
);

onSnapshot(postsQuery, (snapshot) => {

    console.log("FreeTime Posts:", snapshot.size);

    snapshot.forEach((doc) => {

        const post = doc.data();

        console.log({
            id: doc.id,
            uid: post.uid,
            text: post.text,
            background: post.background,
            createdAt: post.createdAt
        });

    });

}, (error) => {

    console.error("Feed Error:", error);

});
