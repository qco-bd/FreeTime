function showSignup() {
    document.getElementById("loginBox").classList.add("hidden");
    document.getElementById("signupBox").classList.remove("hidden");

    clearMessage();
}


function showLogin() {
    document.getElementById("signupBox").classList.add("hidden");
    document.getElementById("loginBox").classList.remove("hidden");

    clearMessage();
}


function showMessage(message, success = false) {

    const box = document.getElementById("message");

    box.textContent = message;

    box.style.color = success ? "green" : "red";
}


function clearMessage() {
    document.getElementById("message").textContent = "";
}


// LOGIN
function loginUser() {

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    if (!email || !password) {
        showMessage("Please enter your email and password.");
        return;
    }

    showMessage("Logging in...", true);

    auth.signInWithEmailAndPassword(email, password)
        .then(() => {

            showMessage("Login successful!", true);

            setTimeout(() => {
                window.location.href = "home.html";
            }, 700);

        })
        .catch((error) => {

            showMessage(getFirebaseError(error.code));

        });
}


// SIGNUP
function signupUser() {

    const name = document.getElementById("signupName").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value;

    if (!name || !email || !password) {
        showMessage("Please fill in all fields.");
        return;
    }

    if (password.length < 6) {
        showMessage("Password must be at least 6 characters.");
        return;
    }

    showMessage("Creating your account...", true);

    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {

            const user = userCredential.user;

            return user.updateProfile({
                displayName: name
            });

        })
        .then(() => {

            showMessage("Account created successfully!", true);

            setTimeout(() => {
                window.location.href = "home.html";
            }, 700);

        })
        .catch((error) => {

            showMessage(getFirebaseError(error.code));

        });
}


// FIREBASE ERROR HANDLER
function getFirebaseError(code) {

    switch (code) {

        case "auth/email-already-in-use":
            return "This email is already registered.";

        case "auth/invalid-email":
            return "Please enter a valid email address.";

        case "auth/weak-password":
            return "Password is too weak.";

        case "auth/user-not-found":
            return "No account found with this email.";

        case "auth/wrong-password":
            return "Incorrect password.";

        case "auth/too-many-requests":
            return "Too many attempts. Please try again later.";

        default:
            return "Something went wrong. Please try again.";
    }
      }
