// ===============================
// Firebase Imports
// ===============================

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";

import {
    getAuth,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    setPersistence,
    browserLocalPersistence,
    browserSessionPersistence,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";


// ===============================
// Firebase Config
// ===============================

const firebaseConfig = {

    apiKey: "AIzaSyBigxFWJGMGUpPIhUZO3SFvgf_465K91b4",

    authDomain: "computer-club-puc.firebaseapp.com",

    projectId: "computer-club-puc",

    storageBucket: "computer-club-puc.firebasestorage.app",

    messagingSenderId: "792589716414",

    appId: "1:792589716414:web:7b6e7ed089c0a31b1947ef"

};

// ===============================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

// ===============================
// Already Logged In?
// ===============================

onAuthStateChanged(auth, (user) => {

    if (user) {

        window.location.href = "dashboard.html";

    }

});

// ===============================
// Login
// ===============================

const form = document.getElementById("loginForm");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value;

    const remember =
        document.getElementById("remember").checked;

    try {

        // Remember Me

        await setPersistence(

            auth,

            remember

                ? browserLocalPersistence

                : browserSessionPersistence

        );

        // Login

        await signInWithEmailAndPassword(

            auth,

            email,

            password

        );

        alert("Login Successful!");

        window.location.href = "dashboard.html";

    }

    catch (error) {

        switch (error.code) {

            case "auth/user-not-found":

                alert("No account found.");

                break;

            case "auth/wrong-password":

                alert("Incorrect password.");

                break;

            case "auth/invalid-email":

                alert("Invalid email.");

                break;

            case "auth/invalid-credential":

                alert("Invalid email or password.");

                break;

            case "auth/too-many-requests":

                alert("Too many attempts. Try again later.");

                break;

            default:

                alert(error.message);

        }

    }

});

// ===============================
// Forgot Password
// ===============================

document.getElementById("forgotPassword")

    .addEventListener("click", async (e) => {

        e.preventDefault();

        const email =
            document.getElementById("email").value.trim();

        if (email === "") {

            alert("Enter your email first.");

            return;

        }

        try {

            await sendPasswordResetEmail(auth, email);

            alert("Password reset email sent.");

        }

        catch (error) {

            alert(error.message);

        }

    });