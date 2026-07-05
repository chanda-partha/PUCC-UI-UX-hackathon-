import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";

import {
    getAuth,
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

const firebaseConfig = {

    apiKey: "AIzaSyBigxFWJGMGUpPIhUZO3SFvgf_465K91b4",

    authDomain: "computer-club-puc.firebaseapp.com",

    projectId: "computer-club-puc",

    storageBucket: "computer-club-puc.firebasestorage.app",

    messagingSenderId: "792589716414",

    appId: "1:792589716414:web:7b6e7ed089c0a31b1947ef"

};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

document.getElementById("signupForm")

    .addEventListener("submit", async (e) => {

        e.preventDefault();

        const email = document.getElementById("signupEmail").value;

        const pass = document.getElementById("signupPassword").value;

        const confirm = document.getElementById("confirmPassword").value;

        if (pass !== confirm) {

            alert("Passwords do not match.");

            return;

        }

        try {

            await createUserWithEmailAndPassword(auth, email, pass);

            alert("Account Created Successfully!");

            window.location = "join.html";

        }

        catch (error) {

            alert(error.message);

        }

    });