// ==========================
// Firebase SDK Imports
// ==========================

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

import {
    getFirestore,
    doc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";


// ==========================
// Firebase Config
// ==========================

const firebaseConfig = {
    apiKey: "AIzaSyBigxFWJGMGUpPIhUZO3SFvgf_465K91b4",
    authDomain: "computer-club-puc.firebaseapp.com",
    projectId: "computer-club-puc",
    storageBucket: "computer-club-puc.firebasestorage.app",
    messagingSenderId: "792589716414",
    appId: "1:792589716414:web:7b6e7ed089c0a31b1947ef"
};

// ==========================
// Initialize Firebase
// ==========================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

// ==========================
// Current User
// ==========================

let currentUser = null;

// ==========================
// Check Login
// ==========================

onAuthStateChanged(auth, (user) => {

    if (!user) {

        alert("Please login first.");

        window.location.href = "login.html";

        return;
    }

    currentUser = user;

    // Auto fill email field
    const emailInput = document.getElementById("inputEmail");

    if (emailInput) {

        emailInput.value = user.email;
        emailInput.readOnly = true;

    }

});

// ==========================
// Registration Form
// ==========================

const form = document.getElementById("puccInterestForm");

if (form) {

    form.addEventListener("submit", async (e) => {

        e.preventDefault();

        if (!currentUser) {

            alert("User not logged in.");
            return;

        }

        const fullName = document.getElementById("inputName").value.trim();

        const studentId = document.getElementById("inputStudentId").value.trim();

        const department = document.getElementById("selectDept").value;

        const preferredWing = document.getElementById("selectWing").value;

        const membership = document.querySelector(
            'input[name="membershipTier"]:checked'
        )?.value;

        const transactionId = document.getElementById("inputTxnId").value.trim();

        if (
            fullName === "" ||
            studentId === "" ||
            transactionId === ""
        ) {

            alert("Please fill all required fields.");

            return;

        }

        try {

            await setDoc(doc(db, "users", currentUser.uid), {

                uid: currentUser.uid,

                fullName: fullName,

                email: currentUser.email,

                studentId: studentId,

                department: department,

                preferredWing: preferredWing,

                membership: membership,

                transactionId: transactionId,

                createdAt: serverTimestamp()

            });

            alert("Registration Successful!");

            form.reset();

            // Keep email after reset
            document.getElementById("inputEmail").value = currentUser.email;

            window.location.href = "dashboard.html";

        }

        catch (error) {

            console.error(error);

            alert("Error : " + error.message);

        }

    });

}