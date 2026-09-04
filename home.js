import {
    auth,
    onAuthStateChanged,
    signOut
} from "./firebase-config.js";


// ================================
// CHECK LOGIN & LOAD USER
// ================================

onAuthStateChanged(auth, (user) => {

    // User is not logged in
    if (!user) {
        window.location.href = "login.html";
        return;
    }

    console.log("Logged in user:", user);

    const userName = user.displayName || "FreeTime User";
    const userEmail = user.email || "";

    // ================================
    // USER NAME
    // ================================

    const nameElement = document.getElementById("userName");

    if (nameElement) {
        nameElement.textContent = userName;
    }


    // ================================
    // USER EMAIL
    // ================================

    const emailElement = document.getElementById("userEmail");

    if (emailElement) {
        emailElement.textContent = userEmail;
    }


    // ================================
    // AVATARS
    // ================================

    // First letter of user's name
    const firstLetter = userName
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

});


// ================================
// LOGOUT
// ================================

window.logoutUser = async function () {

    try {

        await signOut(auth);

        window.location.href = "login.html";

    } catch (error) {

        console.error("Logout error:", error);

        alert("Logout failed. Please try again.");

    }

};
