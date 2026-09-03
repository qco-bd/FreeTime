const openPost = document.getElementById("openPost");
const closePost = document.getElementById("closePost");

const postModal = document.getElementById("postModal");


openPost.addEventListener("click", () => {

    postModal.classList.add("show");

});


closePost.addEventListener("click", () => {

    postModal.classList.remove("show");

});


postModal.addEventListener("click", (event) => {

    if (event.target === postModal) {

        postModal.classList.remove("show");

    }

});
