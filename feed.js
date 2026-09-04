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

function escapeHTML(text) {
    const div = document.createElement("div");
    div.textContent = text || "";
    return div.innerHTML;
}

function createPostCard(post) {

    const card = document.createElement("article");

    card.className = "freetime-post-card";

    if (post.background) {
        card.style.background = post.background;
    }

    const time = post.createdAt
        ? post.createdAt.toDate().toLocaleString()
        : "Just now";

    card.innerHTML = `
        <div class="freetime-post-header">
            <div class="freetime-avatar">
                <span>U</span>
            </div>

            <div>
                <strong>FreeTime User</strong>
                <small>${time}</small>
            </div>
        </div>

        <div class="freetime-post-text">
            ${escapeHTML(post.text)}
        </div>

        <div class="freetime-post-actions">
            <button type="button">❤️ Like</button>
            <button type="button">💬 Comment</button>
            <button type="button">↗ Share</button>
        </div>
    `;

    return card;
}

function findFeedContainer() {

    const selectors = [
        "#postsContainer",
        "#feed",
        "#postFeed",
        ".posts-container",
        ".post-feed",
        ".feed"
    ];

    for (const selector of selectors) {

        const element = document.querySelector(selector);

        if (element) {
            return element;
        }
    }

    return null;
}

onSnapshot(postsQuery, (snapshot) => {

    const feed = findFeedContainer();

    if (!feed) {
        console.warn(
            "FreeTime: Feed container not found. " +
            "Add an element with id='postsContainer'."
        );
        return;
    }

    feed.innerHTML = "";

    snapshot.forEach((doc) => {

        const post = doc.data();

        const card = createPostCard({
            id: doc.id,
            ...post
        });

        feed.appendChild(card);
    });

}, (error) => {

    console.error("FreeTime Feed Error:", error);

});
