import {
    auth,
    onAuthStateChanged,
    signOut
} from "./firebase-config.js";


onAuthStateChanged(auth, (user) => {

    if (!user) {

        window.location.href = "login.html";

        return;
    }


    console.log("Logged in user:", user);


    const userName = user.displayName || "FreeTime User";


    const nameElement = document.getElementById("userName");

    if (nameElement) {
        nameElement.textContent = userName;
    }


    const emailElement = document.getElementById("userEmail");

    if (emailElement) {
        emailElement.textContent = user.email;
    }

});


// Logout
window.logoutUser = async function () {

    try {

        await signOut(auth);

        window.location.href = "login.html";

    } catch (error) {

        console.error("Logout error:", error);

    }

};
