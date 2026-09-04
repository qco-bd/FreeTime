import { auth } from "./firebase.js";

document.addEventListener("DOMContentLoaded", () => {

    console.log("FreeTime Post Connector loaded.");

    document.addEventListener("click", async (event) => {

        const button = event.target.closest(
            "#postBtn, #createPostBtn, .post-btn, .create-post-btn"
        );

        if (!button) return;

        const user = auth.currentUser;

        if (!user) {
            alert("Please login first.");
            return;
        }

        console.log("Create Post button detected.");

    });

});
