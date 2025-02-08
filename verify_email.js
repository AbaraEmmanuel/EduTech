import { auth } from './firebasetutors.js';
import { sendEmailVerification, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

async function sendVerificationEmail(user) {
    if (!user) {
        console.error('No user is logged in.');
        document.getElementById('verify-message').innerText = 'No user found. Please sign in again.';
        return;
    }

    try {
        await sendEmailVerification(user);
        console.log('Verification email sent.');
        document.getElementById('verify-message').innerText = '✅ Verification email sent! Check your inbox.';
    } catch (error) {
        console.error('Error sending verification email:', error);
        document.getElementById('verify-message').innerText = '⚠️ Error sending email. Try again later.';
    }
}

// Wait for Firebase to check if a user is logged in
onAuthStateChanged(auth, (user) => {
    if (user) {
        document.getElementById('resendVerification').addEventListener('click', () => sendVerificationEmail(user));
    } else {
        console.error('User is not logged in.');
    }
});
