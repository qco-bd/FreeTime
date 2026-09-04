import { auth } from "./firebase.js";

document.addEventListener("DOMContentLoaded", () => {

    console.log("FreeTime Post Connector Ready");

    /*
     * Try to detect common Create Post buttons
     */
    const buttons = document.querySelectorAll(
        "#postBtn, #createPostBtn, .post-btn, .create-post-btn, [data-action='post']"
    );

    buttons.forEach((button) => {

        button.addEventListener("click", async (event) => {

            event.preventDefault();

            const user = auth.currentUser;

            if (!user) {
                alert("Please login first.");
                return;
            }

            /*
             * Find post text
             */
            const textInput =
                document.querySelector(
                    "#postText, #postContent, #postInput, textarea"
                );

            if (!textInput) {
                alert("Post text box not found.");
                return;
            }

            const text =
                textInput.value.trim();

            if (!text) {
                alert("Please write something.");
                textInput.focus();
                return;
            }

            /*
             * Find selected background
             */
            let background = "";

            const selectedBackground =
                document.querySelector(
                    ".background-option.selected, .bg-option.selected, [data-selected='true']"
                );

            if (selectedBackground) {

                background =
                    selectedBackground.dataset.background ||
                    selectedBackground.style.background ||
                    selectedBackground.style.backgroundImage ||
                    "";
            }

            /*
             * Save to Firebase
             */
            if (typeof window.savePostToFirebase === "function") {

                const success =
                    await window.savePostToFirebase(
                        text,
                        background
                    );

                if (success) {

                    textInput.value = "";

                    /*
                     * Close common modal
                     */
                    const modal =
                        document.querySelector(
                            "#postModal, .post-modal, .create-post-modal"
                        );

                    if (modal) {
                        modal.style.display = "none";
                    }
                }

            } else {

                alert(
                    "Post system is not loaded yet. Please refresh the page."
                );
            }

        });

    });

});
