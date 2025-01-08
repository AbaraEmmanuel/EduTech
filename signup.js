import { showNotification } from './notification.js';  // Import from notification.js
import { auth, db } from './firebase.js';  // Import auth and db from firebase.js
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { setDoc, doc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

document.querySelector('.sign-up-form').addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent page reload

    const firstName = e.target['first-name'].value;
    const lastName = e.target['last-name'].value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const confirmPassword = e.target['confirm-password'].value;
    const role = e.target.role.value;

    showNotification('Processing..', 'Loading');

    // Ensure passwords match
    if (password !== confirmPassword) {
        showNotification('Passwords do not match!', 'error');
        return;
    }

    try {
        // Firebase Authentication Sign Up
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Save user data to Firestore
        await setDoc(doc(db, 'users', user.uid), {
            firstName,
            lastName,
            password,
            email,
            role,
            createdAt: serverTimestamp(),
        });
        
        // Show notification on successful signup
        showNotification('Sign-up successful!', 'success');

        // Redirect to sign_in.html after 2 seconds (so user can see the success notification)
        setTimeout(() => {
            window.location.href = 'sign_in.html';  // Redirect to the sign-in page
        }, 2000);  // 2 seconds delay before redirecting

    } catch (error) {
        showNotification(`Error: ${error.message}`, 'error');
    }
});
