// ==========================================
// FreeTime - Post Feed System
// ==========================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    getFirestore,
    collection,
    query,
    orderBy,
    onSnapshot
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
// INITIALIZE FIREBASE
// ==========================================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);


// ==========================================
// POSTS CONTAINER
// ==========================================

const postsContainer =
    document.getElementById("postsContainer");


// ==========================================
// LOAD POSTS
// ==========================================

function loadPosts() {

    if (!postsContainer) {
        console.error(
            "postsContainer not found."
        );
        return;
    }


    const postsQuery = query(
        collection(db, "posts"),
        orderBy("createdAt", "desc")
    );


    onSnapshot(
        postsQuery,
        (snapshot) => {

            postsContainer.innerHTML = "";


            if (snapshot.empty) {

                postsContainer.innerHTML = `
                    <div class="no-posts">
                        <p>No posts yet.</p>
                        <span>Be the first to post something!</span>
                    </div>
                `;

                return;
            }


            snapshot.forEach((doc) => {

                const post =
                    doc.data();

                const postId =
                    doc.id;


                createPostCard(
                    post,
                    postId
                );

            });

        },

        (error) => {

            console.error(
                "Post feed error:",
                error
            );

            postsContainer.innerHTML = `
                <div class="post-error">
                    <p>Unable to load posts.</p>
                </div>
            `;

        }
    );

}


// ==========================================
// CREATE POST CARD
// ==========================================

function createPostCard(post, postId) {

    const postElement =
        document.createElement("article");

    postElement.className =
        "freetime-post";


    // Profile image

    const profileImage =
        post.photoURL ||
        "https://via.placeholder.com/50";


    // User name

    const userName =
        post.name ||
        "FreeTime User";


    // Post text

    const postText =
        post.text || "";


    // Background

    const background =
        post.background ||
        "default";


    postElement.innerHTML = `

        <div class="post-header">

            <img
                class="post-avatar"
                src="${profileImage}"
                alt="Profile"
            >

            <div class="post-user-info">

                <strong>
                    ${escapeHTML(userName)}
                </strong>

                <span>
                    FreeTime User
                </span>

            </div>

            <button
                class="post-menu"
                type="button"
            >
                ⋯
            </button>

        </div>


        <div
            class="post-content post-background-${background}"
        >

            <p>
                ${escapeHTML(postText)}
            </p>

        </div>


        <div class="post-stats">

            <span>
                ❤️ ${post.likes || 0}
            </span>

            <span>
                💬 ${post.comments || 0}
            </span>

            <span>
                ↗️ ${post.shares || 0}
            </span>

        </div>


        <div class="post-actions">

            <button
                type="button"
                class="post-action like-btn"
                data-post-id="${postId}"
            >
                ❤️ Like
            </button>

            <button
                type="button"
                class="post-action comment-btn"
                data-post-id="${postId}"
            >
                💬 Comment
            </button>

            <button
                type="button"
                class="post-action share-btn"
                data-post-id="${postId}"
            >
                ↗️ Share
            </button>

        </div>

    `;


    postsContainer.appendChild(
        postElement
    );

}


// ==========================================
// HTML SECURITY
// ==========================================

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


// ==========================================
// AUTH CHECK
// ==========================================

onAuthStateChanged(
    auth,
    (user) => {

        if (user) {

            console.log(
                "FreeTime feed active."
            );

            loadPosts();

        } else {

            if (postsContainer) {

                postsContainer.innerHTML = `
                    <div class="no-posts">
                        <p>Please login to view posts.</p>
                    </div>
                `;

            }

        }

    }
);
