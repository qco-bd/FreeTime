// ==========================================
// FreeTime Verification + Ads Access System
// ==========================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    getFirestore,
    doc,
    setDoc,
    getDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


// ==========================================
// FIREBASE CONFIG
// ==========================================
// এখানে তোমার FreeTime Firebase Config বসাও

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.firebasestorage.app",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};


// ==========================================
// INITIALIZE FIREBASE
// ==========================================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);


// ==========================================
// FREETIME VERIFICATION CODE
// ==========================================

const VERIFICATION_CODE = "freetimeqco12";


// ==========================================
// CURRENT USER
// ==========================================

let currentUser = null;


// ==========================================
// GET USER PROFILE
// ==========================================

async function getUserProfile(uid) {

    try {

        const userRef =
            doc(db, "users", uid);

        const userSnap =
            await getDoc(userRef);

        if (userSnap.exists()) {

            return userSnap.data();

        }

        return null;

    } catch (error) {

        console.error(
            "Profile error:",
            error
        );

        return null;
    }
}


// ==========================================
// CHECK VERIFICATION STATUS
// ==========================================

async function checkVerification() {

    if (!currentUser) {
        return;
    }


    const profile =
        await getUserProfile(
            currentUser.uid
        );


    if (!profile) {

        updateVerificationUI(false);

        return;
    }


    const isVerified =
        profile.verified === true;


    const adsAccess =
        profile.adsAccess === true;


    updateVerificationUI(
        isVerified
    );


    updateAdsUI(
        adsAccess
    );

}


// ==========================================
// ACTIVATE VERIFICATION
// ==========================================

async function activateVerification() {

    if (!currentUser) {

        alert(
            "Please login first."
        );

        return;
    }


    const input =
        document.getElementById(
            "verificationCode"
        );


    if (!input) {

        alert(
            "Verification input not found."
        );

        return;
    }


    const enteredCode =
        input.value.trim();


    if (!enteredCode) {

        alert(
            "Please enter your verification code."
        );

        return;
    }


    if (
        enteredCode.toLowerCase() !==
        VERIFICATION_CODE.toLowerCase()
    ) {

        alert(
            "Invalid FreeTime verification code."
        );

        return;
    }


    const button =
        document.getElementById(
            "verifyAccountBtn"
        );


    if (button) {

        button.disabled = true;

        button.textContent =
            "Verifying...";
    }


    try {

        await setDoc(

            doc(
                db,
                "users",
                currentUser.uid
            ),

            {

                uid:
                    currentUser.uid,

                verified:
                    true,

                adsAccess:
                    true,

                verifiedAt:
                    serverTimestamp()

            },

            {
                merge: true
            }

        );


        input.value = "";


        updateVerificationUI(
            true
        );


        updateAdsUI(
            true
        );


        alert(
            "Congratulations! Your FreeTime account is now verified."
        );


    } catch (error) {

        console.error(
            "Verification error:",
            error
        );


        alert(
            "Verification failed. Please try again."
        );

    }


    if (button) {

        button.disabled = false;

        button.textContent =
            "Verify";
    }

}


// ==========================================
// VERIFIED BADGE
// ==========================================

function updateVerificationUI(
    isVerified
) {

    const badges =
        document.querySelectorAll(
            ".verified-badge"
        );


    badges.forEach(
        (badge) => {

            if (isVerified) {

                badge.style.display =
                    "inline-flex";

            } else {

                badge.style.display =
                    "none";

            }

        }
    );


    const singleBadge =
        document.getElementById(
            "verifiedBadge"
        );


    if (singleBadge) {

        singleBadge.style.display =
            isVerified
                ? "inline-flex"
                : "none";

    }

}


// ==========================================
// ADS ACCESS UI
// ==========================================

function updateAdsUI(
    hasAdsAccess
) {

    const adsElements =
        document.querySelectorAll(
            ".ads-access"
        );


    adsElements.forEach(
        (element) => {

            element.style.display =
                hasAdsAccess
                    ? "block"
                    : "none";

        }
    );

}


// ==========================================
// AUTH STATE
// ==========================================

onAuthStateChanged(
    auth,
    async (user) => {

        currentUser = user;


        if (user) {

            console.log(
                "FreeTime user logged in:",
                user.uid
            );


            await checkVerification();

        } else {

            updateVerificationUI(
                false
            );

            updateAdsUI(
                false
            );

        }

    }
);


// ==========================================
// VERIFY BUTTON
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const verifyButton =
            document.getElementById(
                "verifyAccountBtn"
            );


        if (verifyButton) {

            verifyButton.addEventListener(
                "click",
                activateVerification
            );

        }

    }
);


// ==========================================
// GLOBAL FUNCTION
// ==========================================

window.activateVerification =
    activateVerification;
