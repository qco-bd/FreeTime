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


const db = getFirestore();

let currentUser = null;

let selectedBackground = "bg-1";


/* =========================
   AUTH
========================= */

onAuthStateChanged(auth, (user) => {

    if (!user) {

        window.location.href =
            "login.html";

        return;
    }

    currentUser = user;


    const name =
        user.displayName ||
        user.email?.split("@")[0] ||
        "FreeTime User";


    const email =
        user.email || "";


    const userName =
        document.getElementById("userName");

    const userEmail =
        document.getElementById("userEmail");


    if (userName) {

        userName.textContent =
            name;

    }


    if (userEmail) {

        userEmail.textContent =
            email;

    }


    const avatarURL =
        user.photoURL ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;


    [
        "headerAvatar",
        "welcomeAvatar",
        "createAvatar"
    ].forEach(id => {

        const img =
            document.getElementById(id);

        if (img) {

            img.src =
                avatarURL;

        }

    });


    setupBackgroundSelector();

    loadPosts();

});


/* =========================
   BACKGROUND SELECTOR
========================= */

function setupBackgroundSelector() {

    const options =
        document.querySelectorAll(
            ".bg-option"
        );


    options.forEach(option => {

        option.addEventListener(
            "click",
            () => {

                options.forEach(item => {

                    item.classList.remove(
                        "active"
                    );

                });


                option.classList.add(
                    "active"
                );


                selectedBackground =
                    option.dataset.background;


                updatePostPreview();

            }
        );

    });

}


/* =========================
   POST PREVIEW
========================= */

function updatePostPreview() {

    const textarea =
        document.getElementById(
            "postText"
        );

    if (!textarea) return;


    textarea.classList.remove(
        "bg-1",
        "bg-2",
        "bg-3",
        "bg-4",
        "bg-5",
        "bg-6",
        "bg-7"
    );

}


/* =========================
   CREATE POST
========================= */

const publishPostBtn =
    document.getElementById(
        "publishPostBtn"
    );


if (publishPostBtn) {

    publishPostBtn.addEventListener(
        "click",
        async () => {

            if (!currentUser) return;


            const postText =
                document.getElementById(
                    "postText"
                );


            const postStatus =
                document.getElementById(
                    "postStatus"
                );


            const text =
                postText?.value.trim();


            if (!text) {

                if (postStatus) {

                    postStatus.textContent =
                        "Please write something.";

                }

                return;
            }


            publishPostBtn.disabled =
                true;


            try {

                await addDoc(
                    collection(
                        db,
                        "posts"
                    ),
                    {

                        text: text,

                        uid:
                            currentUser.uid,

                        userName:
                            currentUser.displayName ||
                            currentUser.email?.split("@")[0] ||
                            "FreeTime User",

                        userEmail:
                            currentUser.email ||
                            "",

                        likes: 0,

                        comments: 0,

                        shares: 0,

                        background:
                            selectedBackground,

                        createdAt:
                            serverTimestamp()

                    }
                );


                postText.value = "";


                if (postStatus) {

                    postStatus.textContent =
                        "Post published successfully!";

                }


                setTimeout(() => {

                    if (postStatus) {

                        postStatus.textContent =
                            "";

                    }

                }, 2500);


            } catch (error) {

                console.error(
                    "Post error:",
                    error
                );


                if (postStatus) {

                    postStatus.textContent =
                        "Failed to publish post.";

                }

            } finally {

                publishPostBtn.disabled =
                    false;

            }

        }
    );

}


/* =========================
   LOAD POSTS
========================= */

function loadPosts() {

    const postsContainer =
        document.getElementById(
            "postsContainer"
        );


    if (!postsContainer) return;


    const postsQuery =
        query(
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

            postsContainer.innerHTML =
                "";


            snapshot.forEach(
                postDoc => {

                    renderPost(
                        postDoc.id,
                        postDoc.data(),
                        postsContainer
                    );

                }
            );

        },
        error => {

            console.error(
                "Posts error:",
                error
            );

        }
    );

}


/* =========================
   RENDER POST
========================= */

function renderPost(
    postId,
    post,
    container
) {

    const userName =
        post.userName ||
        "FreeTime User";


    const avatar =
        `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=random`;


    const article =
        document.createElement(
            "article"
        );


    article.className =
        "post-card";


    const hasBackground =
        post.background &&
        post.background.startsWith(
            "bg-"
        );


    article.innerHTML = `

        <div class="post-header">

            <img
                class="post-avatar"
                src="${avatar}"
                alt="${escapeHTML(userName)}"
            >

            <div>

                <strong>
                    ${escapeHTML(userName)}
                </strong>

                <small>
                    ${formatDate(post.createdAt)}
                </small>

            </div>

        </div>


        <div
            class="post-content ${
                hasBackground
                    ? `text-background ${post.background}`
                    : ""
            }"
        >

            <p>
                ${escapeHTML(post.text || "")}
            </p>

        </div>


        <div class="post-stats">

            <span>
                ❤️
                <span id="likes-${postId}">
                    ${post.likes || 0}
                </span>
            </span>

            <span>
                💬
                <span id="comments-${postId}">
                    ${post.comments || 0}
                </span>
            </span>

            <span>
                ↗️
                <span id="shares-${postId}">
                    ${post.shares || 0}
                </span>
            </span>

        </div>


        <div class="post-actions">

            <button
                class="like-btn"
                id="like-btn-${postId}"
            >
                🤍 Like
            </button>


            <button
                class="comment-toggle-btn"
                data-post-id="${postId}"
            >
                💬 Comment
            </button>


            <button
                class="share-btn"
                data-post-id="${postId}"
            >
                ↗️ Share
            </button>

        </div>


        <div
            class="comments-area"
            id="comments-area-${postId}"
            style="display:none;"
        >

            <div
                class="comments-list"
                id="comments-list-${postId}"
            ></div>


            <div class="comment-box">

                <input
                    type="text"
                    id="comment-input-${postId}"
                    placeholder="Write a comment..."
                >

                <button
                    class="comment-send-btn"
                    data-post-id="${postId}"
                >
                    Post
                </button>

            </div>

        </div>

    `;


    container.appendChild(
        article
    );


    setupLike(postId);

    setupCommentToggle(postId);

    setupCommentSend(postId);

    setupShare(postId);

    loadComments(postId);

}


/* =========================
   LIKE
========================= */

function setupLike(postId) {

    const button =
        document.getElementById(
            `like-btn-${postId}`
        );


    if (!button) return;


    checkUserLike(
        postId,
        button
    );


    button.addEventListener(
        "click",
        async () => {

            if (!currentUser) return;


            button.disabled =
                true;


            try {

                const likeRef =
                    doc(
                        db,
                        "posts",
                        postId,
                        "likes",
                        currentUser.uid
                    );


                const likeSnapshot =
                    await getDoc(
                        likeRef
                    );


                const postRef =
                    doc(
                        db,
                        "posts",
                        postId
                    );


                if (
                    likeSnapshot.exists()
                ) {

                    await deleteDoc(
                        likeRef
                    );


                    await updateDoc(
                        postRef,
                        {
                            likes:
                                increment(-1)
                        }
                    );


                    button.innerHTML =
                        "🤍 Like";


                } else {

                    await setDoc(
                        likeRef,
                        {

                            uid:
                                currentUser.uid,

                            userName:
                                currentUser.displayName ||
                                currentUser.email?.split("@")[0] ||
                                "FreeTime User",

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


                    button.innerHTML =
                        "❤️ Liked";

                }


            } catch (error) {

                console.error(
                    "Like error:",
                    error
                );

            } finally {

                button.disabled =
                    false;

            }

        }
    );

}


/* =========================
   CHECK LIKE
========================= */

async function checkUserLike(
    postId,
    button
) {

    if (!currentUser) return;


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
            await getDoc(
                likeRef
            );


        button.innerHTML =
            snapshot.exists()
                ? "❤️ Liked"
                : "🤍 Like";


    } catch (error) {

        console.error(error);

    }

}


/* =========================
   COMMENT TOGGLE
========================= */

function setupCommentToggle(
    postId
) {

    const button =
        document.querySelector(
            `.comment-toggle-btn[data-post-id="${postId}"]`
        );


    if (!button) return;


    button.addEventListener(
        "click",
        () => {

            const area =
                document.getElementById(
                    `comments-area-${postId}`
                );


            if (!area) return;


            area.style.display =
                area.style.display ===
                "none"
                    ? "block"
                    : "none";

        }
    );

}


/* =========================
   ADD COMMENT
========================= */

function setupCommentSend(
    postId
) {

    const button =
        document.querySelector(
            `.comment-send-btn[data-post-id="${postId}"]`
        );


    const input =
        document.getElementById(
            `comment-input-${postId}`
        );


    if (!button || !input)
        return;


    button.addEventListener(
        "click",
        async () => {

            if (!currentUser)
                return;


            const text =
                input.value.trim();


            if (!text) return;


            button.disabled =
                true;


            try {

                await addDoc(
                    collection(
                        db,
                        "posts",
                        postId,
                        "comments"
                    ),
                    {

                        text: text,

                        uid:
                            currentUser.uid,

                        userName:
                            currentUser.displayName ||
                            currentUser.email?.split("@")[0] ||
                            "FreeTime User",

                        createdAt:
                            serverTimestamp(),

                        parentId:
                            null

                    }
                );


                await updateDoc(
                    doc(
                        db,
                        "posts",
                        postId
                    ),
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

            } finally {

                button.disabled =
                    false;

            }

        }
    );

}


/* =========================
   LOAD COMMENTS
========================= */

function loadComments(
    postId
) {

    const commentsList =
        document.getElementById(
            `comments-list-${postId}`
        );


    if (!commentsList) return;


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
        snapshot => {

            commentsList.innerHTML =
                "";


            snapshot.forEach(
                commentDoc => {

                    const comment =
                        commentDoc.data();


                    if (
                        comment.parentId !==
                        null
                    ) {
                        return;
                    }


                    renderComment(
                        postId,
                        commentDoc.id,
                        comment,
                        commentsList
                    );

                }
            );

        },
        error => {

            console.error(
                "Comments error:",
                error
            );

        }
    );

}


/* =========================
   COMMENT
========================= */

function renderComment(
    postId,
    commentId,
    comment,
    container
) {

    const div =
        document.createElement(
            "div"
        );


    div.className =
        "comment-item";


    div.innerHTML = `

        <div class="comment-content">

            <strong>
                ${escapeHTML(
                    comment.userName ||
                    "FreeTime User"
                )}
            </strong>

            <p>
                ${escapeHTML(
                    comment.text || ""
                )}
            </p>

            <small>
                ${formatDate(
                    comment.createdAt
                )}
            </small>

        </div>


        <div class="comment-actions">

            <button
                class="reply-btn"
                data-comment-id="${commentId}"
            >
                ↩️ Reply
            </button>

        </div>


        <div
            class="reply-box"
            id="reply-box-${commentId}"
            style="display:none;"
        >

            <input
                type="text"
                id="reply-input-${commentId}"
                placeholder="Write a reply..."
            >

            <button
                class="reply-send-btn"
                data-post-id="${postId}"
                data-comment-id="${commentId}"
            >
                Reply
            </button>

        </div>


        <div
            class="replies-list"
            id="replies-${commentId}"
        ></div>

    `;


    container.appendChild(
        div
    );


    setupReplyButton(
        commentId
    );


    setupReplySend(
        postId,
        commentId
    );


    loadReplies(
        postId,
        commentId
    );

}


/* =========================
   REPLY BUTTON
========================= */

function setupReplyButton(
    commentId
) {

    const button =
        document.querySelector(
            `.reply-btn[data-comment-id="${commentId}"]`
        );


    if (!button) return;


    button.addEventListener(
        "click",
        () => {

            const box =
                document.getElementById(
                    `reply-box-${commentId}`
                );


            if (!box) return;


            box.style.display =
                box.style.display ===
                "none"
                    ? "flex"
                    : "none";

        }
    );

}


/* =========================
   ADD REPLY
========================= */

function setupReplySend(
    postId,
    commentId
) {

    const button =
        document.querySelector(
            `.reply-send-btn[data-comment-id="${commentId}"]`
        );


    const input =
        document.getElementById(
            `reply-input-${commentId}`
        );


    if (!button || !input)
        return;


    button.addEventListener(
        "click",
        async () => {

            if (!currentUser)
                return;


            const text =
                input.value.trim();


            if (!text) return;


            button.disabled =
                true;


            try {

                await addDoc(
                    collection(
                        db,
                        "posts",
                        postId,
                        "comments"
                    ),
                    {

                        text: text,

                        uid:
                            currentUser.uid,

                        userName:
                            currentUser.displayName ||
                            currentUser.email?.split("@")[0] ||
                            "FreeTime User",

                        createdAt:
                            serverTimestamp(),

                        parentId:
                            commentId

                    }
                );


                await updateDoc(
                    doc(
                        db,
                        "posts",
                        postId
                    ),
                    {
                        comments:
                            increment(1)
                    }
                );


                input.value = "";


            } catch (error) {

                console.error(
                    "Reply error:",
                    error
                );

            } finally {

                button.disabled =
                    false;

            }

        }
    );

}


/* =========================
   LOAD REPLIES
========================= */

function loadReplies(
    postId,
    commentId
) {

    const container =
        document.getElementById(
            `replies-${commentId}`
        );


    if (!container) return;


    const q =
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
        q,
        snapshot => {

            container.innerHTML =
                "";


            snapshot.forEach(
                replyDoc => {

                    const reply =
                        replyDoc.data();


                    if (
                        reply.parentId !==
                        commentId
                    ) {
                        return;
                    }


                    const div =
                        document.createElement(
                            "div"
                        );


                    div.className =
                        "reply-item";


                    div.innerHTML = `

                        <strong>
                            ${escapeHTML(
                                reply.userName ||
                                "FreeTime User"
                            )}
                        </strong>

                        <p>
                            ${escapeHTML(
                                reply.text || ""
                            )}
                        </p>

                        <small>
                            ${formatDate(
                                reply.createdAt
                            )}
                        </small>

                    `;


                    container.appendChild(
                        div
                    );

                }
            );

        }
    );

}


/* =========================
   SHARE
========================= */

function setupShare(
    postId
) {

    const button =
        document.querySelector(
            `.share-btn[data-post-id="${postId}"]`
        );


    if (!button) return;


    button.addEventListener(
        "click",
        async () => {

            try {

                await updateDoc(
                    doc(
                        db,
                        "posts",
                        postId
                    ),
                    {
                        shares:
                            increment(1)
                    }
                );


                if (
                    navigator.share
                ) {

                    await navigator.share({

                        title:
                            "FreeTime Post",

                        text:
                            "Check out this post on FreeTime!",

                        url:
                            window.location.href

                    });

                } else {

                    await navigator.clipboard.writeText(
                        window.location.href
                    );

                    alert(
                        "Post link copied!"
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

}


/* =========================
   LOGOUT
========================= */

window.logoutUser =
    async function () {

        try {

            await signOut(
                auth
            );


            window.location.href =
                "login.html";


        } catch (error) {

            console.error(
                "Logout error:",
                error
            );

        }

    };


/* =========================
   SECURITY
========================= */

function escapeHTML(
    value
) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        value;


    return div.innerHTML;

}


/* =========================
   DATE
========================= */

function formatDate(
    timestamp
) {

    if (!timestamp) {

        return "Just now";

    }


    try {

        return timestamp
            .toDate()
            .toLocaleString(
                "en-BD",
                {
                    dateStyle:
                        "medium",

                    timeStyle:
                        "short"
                }
            );

    } catch {

        return "Just now";

    }

}
