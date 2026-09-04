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

    const userName = user.displayName || "FreeTime User";
    const userEmail = user.email || "";

    document.getElementById("userName").textContent = userName;
    document.getElementById("userEmail").textContent = userEmail;

    document.getElementById("userNameSide").textContent = userName;
    document.getElementById("userEmailSide").textContent = userEmail;
});

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
