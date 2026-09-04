import {
    getFirestore,
    collection,
    query,
    orderBy,
    onSnapshot,
    doc,
    setDoc,
    deleteDoc,
    getDocs,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import { auth, app } from "./firebase.js";

const db = getFirestore(app);


/* ================================
   HTML SECURITY
================================ */

function escapeHTML(text) {
    const div = document.createElement("div");
    div.textContent = text || "";
    return div.innerHTML;
}


/* ================================
   USER INFO
================================ */

function getUserName(user) {
    if (!user) return "FreeTime User";

    return user.displayName ||
           user.email?.split("@")[0] ||
           "FreeTime User";
}


function getUserPhoto(user) {
    if (user && user.photoURL) {
        return user.photoURL;
    }

    return "";
}


/* ================================
   LIKE SYSTEM
================================ */

async function getLikeCount(postId) {

    const snapshot = await getDocs(
        collection(db, "posts", postId, "likes")
    );

    return snapshot.size;
}


async function hasUserLiked(postId) {

    const user = auth.currentUser;

    if (!user) return false;

    const snapshot = await getDocs(
        collection(db, "posts", postId, "likes")
    );

    return snapshot.docs.some(
        item => item.id === user.uid
    );
}


async function toggleLike(
    postId,
    button,
    countElement
) {

    const user = auth.currentUser;

    if (!user) {
        alert("Please login first.");
        return;
    }

    const likeRef = doc(
        db,
        "posts",
        postId,
        "likes",
        user.uid
    );

    try {

        const liked = await hasUserLiked(postId);

        if (liked) {

            await deleteDoc(likeRef);

            button.classList.remove("liked");

        } else {

            await setDoc(likeRef, {
                uid: user.uid,
                createdAt: serverTimestamp()
            });

            button.classList.add("liked");
        }

        const count =
            await getLikeCount(postId);

        countElement.textContent =
            `${count} ${count === 1 ? "Like" : "Likes"}`;

    } catch (error) {

        console.error(
            "Like Error:",
            error
        );

        alert(
            "Unable to update Like."
        );
    }
}


/* ================================
   COMMENT SYSTEM
================================ */

async function loadComments(
    postId,
    commentsContainer
) {

    const commentsQuery = query(
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

            commentsContainer.innerHTML = "";

            snapshot.forEach(
                (commentDoc) => {

                    const comment =
                        commentDoc.data();

                    const item =
                        document.createElement("div");

                    item.className =
                        "freetime-comment";

                    item.innerHTML = `
                        <div class="freetime-comment-avatar">
                            U
                        </div>

                        <div class="freetime-comment-body">

                            <strong>
                                FreeTime User
                            </strong>

                            <p>
                                ${escapeHTML(comment.text)}
                            </p>

                        </div>
                    `;

                    commentsContainer.appendChild(
                        item
                    );
                }
            );
        }
    );
}


async function addComment(
    postId,
    input
) {

    const user = auth.currentUser;

    if (!user) {
        alert("Please login first.");
        return;
    }

    const text =
        input.value.trim();

    if (!text) {
        alert(
            "Please write a comment."
        );
        return;
    }

    try {

        await addDoc(
            collection(
                db,
                "posts",
                postId,
                "comments"
            ),
            {
                uid: user.uid,

                name:
                    getUserName(user),

                photoURL:
                    getUserPhoto(user),

                text: text,

                createdAt:
                    serverTimestamp()
            }
        );

        input.value = "";

    } catch (error) {

        console.error(
            "Comment Error:",
            error
        );

        alert(
            "Unable to post comment."
        );
    }
}


/* ================================
   POST CARD
================================ */

function createPostCard(post) {

    const card =
        document.createElement("article");

    card.className =
        "freetime-post-card";


    /* Background */

    if (post.background) {

        card.style.background =
            post.background;
    }


    /* User */

    const user =
        auth.currentUser;

    const userName =
        post.name ||
        getUserName(user);

    const userPhoto =
        post.photoURL ||
        getUserPhoto(user);


    const avatarHTML =
        userPhoto

        ? `
            <img
                src="${escapeHTML(userPhoto)}"
                alt="Profile"
                class="freetime-profile-photo"
            >
          `

        : `
            <div class="freetime-avatar">
                ${escapeHTML(
                    userName
                        .charAt(0)
                        .toUpperCase()
                )}
            </div>
          `;


    /* Time */

    const time =
        post.createdAt &&
        typeof post.createdAt.toDate === "function"

        ? post.createdAt
            .toDate()
            .toLocaleString()

        : "Just now";


    card.innerHTML = `

        <div class="freetime-post-header">

            ${avatarHTML}

            <div>

                <strong>
                    ${escapeHTML(userName)}
                </strong>

                <small>
                    ${escapeHTML(time)}
                </small>

            </div>

        </div>


        <div class="freetime-post-text">

            ${escapeHTML(post.text)}

        </div>


        <div class="freetime-like-count">

            <span class="like-count">
                Loading...
            </span>

        </div>


        <div class="freetime-post-actions">

            <button
                type="button"
                class="like-button">

                ❤️ Like

            </button>


            <button
                type="button"
                class="comment-button">

                💬 Comment

            </button>


            <button
                type="button"
                class="share-button">

                ↗ Share

            </button>

        </div>


        <div class="freetime-comments-section">

            <div
                class="freetime-comments-list">
            </div>


            <div class="freetime-comment-form">

                <input
                    type="text"
                    class="comment-input"
                    placeholder="Write a comment..."
                    maxlength="500"
                >


                <button
                    type="button"
                    class="comment-submit">

                    Post

                </button>

            </div>

        </div>

    `;


    /* Elements */

    const likeButton =
        card.querySelector(
            ".like-button"
        );

    const countElement =
        card.querySelector(
            ".like-count"
        );

    const commentButton =
        card.querySelector(
            ".comment-button"
        );

    const commentsSection =
        card.querySelector(
            ".freetime-comments-section"
        );

    const commentsContainer =
        card.querySelector(
            ".freetime-comments-list"
        );

    const input =
        card.querySelector(
            ".comment-input"
        );

    const submitButton =
        card.querySelector(
            ".comment-submit"
        );


    /* Like */

    likeButton.addEventListener(
        "click",
        () => {

            toggleLike(
                post.id,
                likeButton,
                countElement
            );

        }
    );


    /* Comment */

    commentButton.addEventListener(
        "click",
        () => {

            commentsSection
                .classList
                .toggle("show");

            if (
                commentsSection
                    .classList
                    .contains("show")
            ) {

                input.focus();
            }
        }
    );


    /* Submit Comment */

    submitButton.addEventListener(
        "click",
        () => {

            addComment(
                post.id,
                input
            );

        }
    );


    /* Enter */

    input.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Enter"
            ) {

                addComment(
                    post.id,
                    input
                );
            }
        }
    );


    /* Like Count */

    getLikeCount(
        post.id
    ).then(
        (count) => {

            countElement.textContent =
                `${count} ${
                    count === 1
                        ? "Like"
                        : "Likes"
                }`;
        }
    );


    /* Comments */

    loadComments(
        post.id,
        commentsContainer
    );


    return card;
}


/* ================================
   FEED CONTAINER
================================ */

function findFeedContainer() {

    const selectors = [

        "#postsContainer",

        "#feed",

        "#postFeed",

        ".posts-container",

        ".post-feed",

        ".feed"

    ];


    for (
        const selector of selectors
    ) {

        const element =
            document.querySelector(
                selector
            );

        if (element) {
            return element;
        }
    }


    return null;
}


/* ================================
   LOAD POSTS
================================ */

function loadPosts() {

    const postsQuery = query(

        collection(
            db,
            "posts"
        ),

        orderBy(
            "createdAt",
            "desc"
        )
    );


    onSnapshot(
        postsQuery,
        (snapshot) => {

            const feed =
                findFeedContainer();


            if (!feed) {

                console.warn(
                    "FreeTime: postsContainer not found."
                );

                return;
            }


            feed.innerHTML = "";


            snapshot.forEach(
                (docSnapshot) => {

                    const post = {

                        id:
                            docSnapshot.id,

                        ...docSnapshot.data()

                    };


                    feed.appendChild(
                        createPostCard(
                            post
                        )
                    );

                }
            );

        },


        (error) => {

            console.error(
                "FreeTime Feed Error:",
                error
            );

        }
    );
}


/* ================================
   AUTH STATE
================================ */

auth.onAuthStateChanged(
    (user) => {

        if (user) {

            console.log(
                "FreeTime logged in:",
                getUserName(user)
            );

            loadPosts();

        }

    }
);
