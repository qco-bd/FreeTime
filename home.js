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
    increment,
    setDoc,
    deleteDoc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


/* ========================================
   FIRESTORE
======================================== */

const db = getFirestore();


/* ========================================
   ELEMENTS
======================================== */

const postsContainer =
    document.getElementById("postsContainer");

const postText =
    document.getElementById("postText");

const publishPostBtn =
    document.getElementById("publishPostBtn");

const postStatus =
    document.getElementById("postStatus");


/* ========================================
   CURRENT USER
======================================== */

let currentUser = null;


/* ========================================
   LOGIN
======================================== */

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


    const nameElement =
        document.getElementById("userName");

    if (nameElement) {
        nameElement.textContent = userName;
    }


    const emailElement =
        document.getElementById("userEmail");

    if (emailElement) {
        emailElement.textContent = userEmail;
    }


    const firstLetter =
        userName.trim().charAt(0).toUpperCase() || "U";


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


    loadPosts();

});


/* ========================================
   CREATE POST
======================================== */

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


/* ========================================
   LOAD POSTS
======================================== */

function loadPosts() {

    if (!postsContainer) {
        return;
    }


    const postsQuery =
        query(
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
                        <br><br>
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


/* ========================================
   CREATE POST ELEMENT
======================================== */

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

            <span class="likes-count">
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
            >
                ↗️ Share
            </button>

        </div>


        <!-- COMMENT AREA -->

        <div
            class="comment-area"
            style="
                display:none;
                padding:10px 14px 14px;
                border-top:1px solid #eeeeee;
            "
        >

            <div
                class="comments-list"
                style="
                    margin-bottom:10px;
                "
            ></div>


            <div
                style="
                    display:flex;
                    gap:7px;
                    align-items:center;
                "
            >

                <input
                    type="text"
                    class="comment-input"
                    placeholder="Write a comment..."
                    style="
                        flex:1;
                        border:none;
                        outline:none;
                        background:#f0f2f5;
                        border-radius:20px;
                        padding:10px 13px;
                        font-size:13px;
                    "
                >


                <button
                    type="button"
                    class="comment-submit"
                    style="
                        border:none;
                        background:#1877f2;
                        color:white;
                        padding:9px 12px;
                        border-radius:8px;
                        cursor:pointer;
                        font-weight:bold;
                    "
                >
                    Post
                </button>

            </div>

        </div>

    `;


    /* ====================================
       LIKE SYSTEM
    ==================================== */

    const likeButton =
        article.querySelector(".like-btn");


    const likesCount =
        article.querySelector(".likes-count");


    checkUserLike(
        postId,
        likeButton
    );


    likeButton.addEventListener(
        "click",
        async () => {

            if (!currentUser) {
                return;
            }


            try {

                likeButton.disabled = true;


                const likeRef =
                    doc(
                        db,
                        "posts",
                        postId,
                        "likes",
                        currentUser.uid
                    );


                const likeSnapshot =
                    await getDoc(likeRef);


                const postRef =
                    doc(
                        db,
                        "posts",
                        postId
                    );


                if (likeSnapshot.exists()) {

                    /*
                     USER ALREADY LIKED
                     REMOVE LIKE
                    */

                    await deleteDoc(likeRef);


                    await updateDoc(
                        postRef,
                        {
                            likes:
                                increment(-1)
                        }
                    );


                    likeButton.textContent =
                        "❤️ Like";

                    likeButton.style.color =
                        "#4b5563";


                } else {

                    /*
                     NEW LIKE
                    */

                    await setDoc(
                        likeRef,
                        {

                            uid:
                                currentUser.uid,

                            createdAt:
                                serverTimestamp()

                        }
                    );


                    await updateDoc(
                        postRef,
                        {
                            likes:
                                increment(1)
                        }
                    );


                    likeButton.textContent =
                        "❤️ Liked";

                    likeButton.style.color =
                        "#1877f2";

                }


            } catch (error) {

                console.error(
                    "Like error:",
                    error
                );

            }


            likeButton.disabled = false;

        }
    );


    /* ====================================
       SHARE
    ==================================== */

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

                    alert(
                        "Post link copied! 🔗"
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


    /* ====================================
       COMMENT BUTTON
    ==================================== */

    const commentButton =
        article.querySelector(
            ".comment-btn"
        );


    const commentArea =
        article.querySelector(
            ".comment-area"
        );


    commentButton.addEventListener(
        "click",
        () => {

            if (
                commentArea.style.display ===
                "none"
            ) {

                commentArea.style.display =
                    "block";

                loadComments(
                    postId,
                    article
                );

            } else {

                commentArea.style.display =
                    "none";

            }

        }
    );


    /* ====================================
       SUBMIT COMMENT
    ==================================== */

    const commentInput =
        article.querySelector(
            ".comment-input"
        );


    const commentSubmit =
        article.querySelector(
            ".comment-submit"
        );


    commentSubmit.addEventListener(
        "click",
        async () => {

            await submitComment(
                postId,
                commentInput
            );

        }
    );


    commentInput.addEventListener(
        "keydown",
        async (event) => {

            if (
                event.key === "Enter"
            ) {

                event.preventDefault();

                await submitComment(
                    postId,
                    commentInput
                );

            }

        }
    );


    postsContainer.appendChild(article);

}


/* ========================================
   CHECK USER LIKE
======================================== */

async function checkUserLike(
    postId,
    likeButton
) {

    if (!currentUser) {
        return;
    }


    try {

        const likeRef =
            doc(
                db,
                "posts",
                postId,
                "likes",
                currentUser.uid
            );


        const snapshot =
            await getDoc(likeRef);


        if (snapshot.exists()) {

            likeButton.textContent =
                "❤️ Liked";

            likeButton.style.color =
                "#1877f2";

        } else {

            likeButton.textContent =
                "❤️ Like";

            likeButton.style.color =
                "#4b5563";

        }


    } catch (error) {

        console.error(
            "Checking like error:",
            error
        );

    }

}


/* ========================================
   SUBMIT COMMENT
======================================== */

async function submitComment(
    postId,
    input
) {

    if (!currentUser) {
        return;
    }


    const text =
        input.value.trim();


    if (!text) {
        return;
    }


    try {

        const commentsRef =
            collection(
                db,
                "posts",
                postId,
                "comments"
            );


        await addDoc(
            commentsRef,
            {

                text: text,

                uid:
                    currentUser.uid,

                userName:
                    currentUser.displayName ||
                    "FreeTime User",

                createdAt:
                    serverTimestamp()

            }
        );


        const postRef =
            doc(
                db,
                "posts",
                postId
            );


        await updateDoc(
            postRef,
            {
                comments:
                    increment(1)
            }
        );


        input.value = "";


    } catch (error) {

        console.error(
            "Comment error:",
            error
        );

        alert(
            "Could not post comment."
        );

    }

}


/* ========================================
   LOAD COMMENTS
======================================== */

function loadComments(
    postId,
    article
) {

    const commentsList =
        article.querySelector(
            ".comments-list"
        );


    if (!commentsList) {
        return;
    }


    const commentsQuery =
        query(
            collection(
                db,
                "posts",
                postId,
                "comments"
            ),
            orderBy(
                "createdAt",
                "asc"
            )
        );


    onSnapshot(
        commentsQuery,
        (snapshot) => {

            commentsList.innerHTML = "";


            if (snapshot.empty) {

                commentsList.innerHTML = `

                    <div
                        style="
                            color:#6b7280;
                            font-size:12px;
                            padding:5px 0;
                        "
                    >
                        No comments yet.
                    </div>

                `;

                return;
            }


            snapshot.forEach(
                (commentSnapshot) => {

                    const comment =
                        commentSnapshot.data();


                    const commentBox =
                        document.createElement(
                            "div"
                        );


                    commentBox.style.cssText = `
                        background:#f0f2f5;
                        border-radius:10px;
                        padding:8px 10px;
                        margin-bottom:7px;
                    `;


                    const name =
                        comment.userName ||
                        "FreeTime User";


                    commentBox.innerHTML = `

                        <div
                            style="
                                font-size:12px;
                                font-weight:bold;
                                margin-bottom:3px;
                            "
                        >
                            ${escapeHTML(name)}
                        </div>

                        <div
                            style="
                                font-size:13px;
                                line-height:1.4;
                            "
                        >
                            ${escapeHTML(
                                comment.text || ""
                            )}
                        </div>

                    `;


                    commentsList.appendChild(
                        commentBox
                    );

                }
            );

        },

        (error) => {

            console.error(
                "Comment loading error:",
                error
            );

        }

    );

}


/* ========================================
   STATUS
======================================== */

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


/* ========================================
   TIME
======================================== */

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


/* ========================================
   ESCAPE HTML
======================================== */

function escapeHTML(
    text
) {

    const div =
        document.createElement("div");


    div.textContent =
        String(text);


    return div.innerHTML;

}


/* ========================================
   LOGOUT
======================================== */

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
