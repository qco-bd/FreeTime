const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

if (loginForm) {

loginForm.addEventListener("submit", function(event) {

    event.preventDefault();

    alert("Firebase Authentication will be connected in the next step.");

});

}

if (signupForm) {

signupForm.addEventListener("submit", function(event) {

    event.preventDefault();

    alert("Firebase Authentication will be connected in the next step.");

});

}
