import {
    auth,
    onAuthStateChanged,
    signOut
} from "./firebase-config.js";

import {
    getFirestore,
    collection,
    addDoc,
    query,
    orderBy,
    onSnapshot,
    serverTimestamp,
    doc,
    updateDoc,
    increment
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ========================================
// FIRESTORE
// ========================================

const db = getFirestore();


// ========================================
// ELEMENTS
// ========================================

const postsContainer =
    document.getElementById("postsContainer");

const postText =
    document.getElementById("postText");

const publishPostBtn =
    document.getElementById("publishPostBtn");

const postStatus =
    document.getElementById("postStatus");


// ========================================
// CURRENT USER
// ========================================

let currentUser = null;


// ========================================
// LOGIN CHECK
// ========================================

onAuthStateChanged(auth, (user) => {

    if (!user) {

        window.location.href = "login.html";

        return;
    }

    currentUser = user;

    const userName =
        user.displayName || "FreeTime User";

    const userEmail =
        user.email || "";

    // Name
    const nameElement =
        document.getElementById("userName");

    if (nameElement) {
        nameElement.textContent = userName;
    }


    // Email
    const emailElement =
        document.getElementById("userEmail");

    if (emailElement) {
        emailElement.textContent = userEmail;
    }


    // First letter
    const firstLetter =
        userName
            .trim()
            .charAt(0)
            .toUpperCase() || "U";


    const welcomeAvatar =
        document.getElementById("welcomeAvatar");

    if (welcomeAvatar) {
        welcomeAvatar.textContent = firstLetter;
    }


    const createAvatar =
        document.getElementById("createAvatar");

    if (createAvatar) {
        createAvatar.textContent = firstLetter;
    }


    const headerAvatar =
        document.getElementById("headerAvatar");

    if (headerAvatar) {
        headerAvatar.textContent = firstLetter;
    }


    // Load posts
    loadPosts();

});


// ========================================
// CREATE POST
// ========================================

if (publishPostBtn) {

    publishPostBtn.addEventListener(
        "click",
        async () => {

            if (!currentUser) {
                return;
            }

            const text =
                postText.value.trim();


            if (!text) {

                showStatus(
                    "Please write something first.",
                    false
                );

                return;
            }


            try {

                publishPostBtn.disabled = true;

                publishPostBtn.textContent =
                    "Posting...";


                await addDoc(
                    collection(db, "posts"),
                    {

                        text: text,

                        uid: currentUser.uid,

                        userName:
                            currentUser.displayName ||
                            "FreeTime User",

                        userEmail:
                            currentUser.email || "",

                        likes: 0,

                        comments: 0,

                        shares: 0,

                        createdAt:
                            serverTimestamp()

                    }
                );


                postText.value = "";

                showStatus(
                    "Post published successfully! 🎉",
                    true
                );


            } catch (error) {

                console.error(
                    "Post error:",
                    error
                );

                showStatus(
                    "Could not publish the post.",
                    false
                );

            }


            publishPostBtn.disabled = false;

            publishPostBtn.textContent =
                "Post";

        }

    );

}


// ========================================
// LOAD POSTS
// ========================================

function loadPosts() {

    if (!postsContainer) {
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

                    <div
                        style="
                            background:white;
                            padding:25px;
                            text-align:center;
                            border-radius:14px;
                            color:#6b7280;
                            margin-bottom:15px;
                        "
                    >

                        No posts yet.

                        <br>

                        Be the first to post! 🎉

                    </div>

                `;

                return;
            }


            snapshot.forEach(
                (postSnapshot) => {

                    const post =
                        postSnapshot.data();

                    const postId =
                        postSnapshot.id;

                    createPostElement(
                        postId,
                        post
                    );

                }
            );

        },

        (error) => {

            console.error(
                "Loading posts error:",
                error
            );

            postsContainer.innerHTML = `

                <div
                    style="
                        background:#fee2e2;
                        color:#dc2626;
                        padding:15px;
                        border-radius:12px;
                        text-align:center;
                    "
                >

                    Could not load posts.

                    <br>

                    Check your Firestore settings.

                </div>

            `;

        }

    );

}


// ========================================
// CREATE POST ELEMENT
// ========================================

function createPostElement(
    postId,
    post
) {

    const article =
        document.createElement("article");

    article.className = "post";


    const userName =
        post.userName ||
        "FreeTime User";


    const firstLetter =
        userName
            .trim()
            .charAt(0)
            .toUpperCase() || "U";


    const likes =
        Number(post.likes || 0);


    const comments =
        Number(post.comments || 0);


    const shares =
        Number(post.shares || 0);


    article.innerHTML = `

        <div class="post-header">

            <div class="post-avatar">
                ${escapeHTML(firstLetter)}
            </div>

            <div>

                <div class="post-user">
                    ${escapeHTML(userName)}
                </div>

                <div class="post-time">
                    ${formatTime(post.createdAt)}
                </div>

            </div>

        </div>


        <div class="post-content">
            ${escapeHTML(post.text || "")}
        </div>


        <div class="post-stats">

            <span id="likes-${postId}">
                ${likes} Likes
            </span>

            <span>
                ${comments} Comments ·
                ${shares} Shares
            </span>

        </div>


        <div class="post-buttons">

            <button
                type="button"
                class="like-btn"
                data-id="${postId}"
            >
                ❤️ Like
            </button>


            <button
                type="button"
                class="comment-btn"
            >
                💬 Comment
            </button>


            <button
                type="button"
                class="share-btn"
                data-id="${postId}"
            >
                ↗️ Share
            </button>

        </div>

    `;


    // LIKE

    const likeButton =
        article.querySelector(".like-btn");


    likeButton.addEventListener(
        "click",
        async () => {

            try {

                const postRef =
                    doc(
                        db,
                        "posts",
                        postId
                    );


                await updateDoc(
                    postRef,
                    {
                        likes:
                            increment(1)
                    }
                );


            } catch (error) {

                console.error(
                    "Like error:",
                    error
                );

            }

        }
    );


    // SHARE

    const shareButton =
        article.querySelector(".share-btn");


    shareButton.addEventListener(
        "click",
        async () => {

            try {

                const postRef =
                    doc(
                        db,
                        "posts",
                        postId
                    );


                await updateDoc(
                    postRef,
                    {
                        shares:
                            increment(1)
                    }
                );


                if (
                    navigator.clipboard
                ) {

                    await navigator.clipboard.writeText(
                        window.location.href
                    );

                }


            } catch (error) {

                console.error(
                    "Share error:",
                    error
                );

            }

        }
    );


    // COMMENT

    const commentButton =
        article.querySelector(
            ".comment-btn"
        );


    commentButton.addEventListener(
        "click",
        () => {

            alert(
                "Comment system will be added next. 💬"
            );

        }
    );


    postsContainer.appendChild(article);

}


// ========================================
// STATUS MESSAGE
// ========================================

function showStatus(
    text,
    success
) {

    if (!postStatus) {
        return;
    }


    postStatus.textContent =
        text;


    postStatus.style.color =
        success
            ? "green"
            : "#dc2626";


    setTimeout(
        () => {

            postStatus.textContent = "";

        },
        3000
    );

}


// ========================================
// TIME
// ========================================

function formatTime(
    timestamp
) {

    if (!timestamp) {
        return "Just now";
    }


    try {

        const date =
            timestamp.toDate();


        return date.toLocaleString();

    } catch {

        return "Just now";

    }

}


// ========================================
// SECURITY
// ========================================

function escapeHTML(
    text
) {

    const div =
        document.createElement("div");

    div.textContent =
        String(text);

    return div.innerHTML;

}


// ========================================
// LOGOUT
// ========================================

window.logoutUser =
    async function () {

        try {

            await signOut(auth);

            window.location.href =
                "login.html";

        } catch (error) {

            console.error(
                "Logout error:",
                error
            );

            alert(
                "Logout failed. Please try again."
            );

        }

    };
