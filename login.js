import {
    auth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile
} from "./firebase-config.js";


function message(text, success = false) {

    const box = document.getElementById("message");

    if (!box) return;

    box.textContent = text;
    box.style.color = success ? "green" : "red";
}


/* =========================
   LOGIN / SIGNUP BOX SWITCH
========================= */

window.showSignup = function () {

    const loginBox = document.getElementById("loginBox");
    const signupBox = document.getElementById("signupBox");

    if (loginBox) {
        loginBox.classList.add("hidden");
    }

    if (signupBox) {
        signupBox.classList.remove("hidden");
    }
};


window.showLogin = function () {

    const loginBox = document.getElementById("loginBox");
    const signupBox = document.getElementById("signupBox");

    if (signupBox) {
        signupBox.classList.add("hidden");
    }

    if (loginBox) {
        loginBox.classList.remove("hidden");
    }
};


/* =========================
   CREATE ACCOUNT
========================= */

async function signupUser() {

    const nameElement = document.getElementById("signupName");
    const emailElement = document.getElementById("signupEmail");
    const passwordElement = document.getElementById("signupPassword");

    if (!nameElement || !emailElement || !passwordElement) {
        return;
    }

    const name = nameElement.value.trim();
    const email = emailElement.value.trim();
    const password = passwordElement.value;

    if (!name || !email || !password) {
        message("Please fill in all fields.");
        return;
    }

    if (password.length < 6) {
        message("Password must be at least 6 characters.");
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
            window.location.href = "home.html";
        }, 800);

    } catch (error) {

        console.error(error);

        if (error.code === "auth/email-already-in-use") {
            message("This email is already registered.");
        }
        else if (error.code === "auth/invalid-email") {
            message("Please enter a valid email address.");
        }
        else if (error.code === "auth/weak-password") {
            message("Password is too weak. Use at least 6 characters.");
        }
        else {
            message(error.message);
        }
    }
}


/* =========================
   LOGIN
========================= */

async function loginUser() {

    const emailElement = document.getElementById("loginEmail");
    const passwordElement = document.getElementById("loginPassword");

    if (!emailElement || !passwordElement) {
        return;
    }

    const email = emailElement.value.trim();
    const password = passwordElement.value;

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
            window.location.href = "home.html";
        }, 700);

    } catch (error) {

        console.error(error);

        message("Incorrect email or password.");
    }
}


/* =========================
   BUTTON SUPPORT
========================= */

window.signupUser = signupUser;
window.loginUser = loginUser;


/* =========================
   SIGNUP FORM
========================= */

const signupForm = document.getElementById("signupForm");

if (signupForm) {

    signupForm.addEventListener("submit", function (event) {

        event.preventDefault();

        signupUser();

    });
}


/* =========================
   LOGIN FORM
========================= */

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function (event) {

        event.preventDefault();

        loginUser();

    });
        }
