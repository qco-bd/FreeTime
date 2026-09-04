import {
    auth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile
} from "./firebase-config.js";

window.showSignup = function () {
    document.getElementById("loginBox").classList.add("hidden");
    document.getElementById("signupBox").classList.remove("hidden");
};

window.showLogin = function () {
    document.getElementById("signupBox").classList.add("hidden");
    document.getElementById("loginBox").classList.remove("hidden");
};

function message(text, success = false) {
    const box = document.getElementById("message");
    box.textContent = text;
    box.style.color = success ? "green" : "red";
}

window.signupUser = async function () {
    const name = document.getElementById("signupName").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value;

    if (!name || !email || !password) {
        message("Please fill in all fields.");
        return;
    }

    try {
        message("Creating account...", true);

        const result = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

        await updateProfile(result.user, {
            displayName: name
        });

        message("Account created successfully!", true);

        setTimeout(() => {
            location.href = "home.html";
        }, 800);

    } catch (error) {
        message(error.message);
    }
};

window.loginUser = async function () {
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    if (!email || !password) {
        message("Please enter email and password.");
        return;
    }

    try {
        message("Logging in...", true);

        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        message("Login successful!", true);

        setTimeout(() => {
            location.href = "home.html";
        }, 700);

    } catch (error) {
        message("Incorrect email or password.");
    }
};
