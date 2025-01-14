import { showNotification } from './notification.js'; // Import from notification.js
import { auth, db } from './firebase.js'; // Import auth and db from firebase.js
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { setDoc, doc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

document.querySelector('.form-container form').addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent page reload

    showNotification('Processing your registration...', 'Loading');

    // Get form inputs
    const name = e.target.name.value;
    const email = e.target.email.value;
    const subjects = Array.from(e.target.subject.selectedOptions).map(option => option.value);
    const bio = e.target.bio.value;
    const videoUrl = e.target.videoUrl.value.trim(); // YouTube video URL

    // Validate inputs
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    if (!youtubeRegex.test(videoUrl)) {
        showNotification('Please provide a valid YouTube video URL.', 'error');
        return;
    }

    try {
        // Firebase Authentication Sign Up
        const password = 'temporaryPassword123'; // Generate or prompt for a secure password
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Save tutor data to Firestore
        await setDoc(doc(db, 'tutors', user.uid), {
            name,
            email,
            subjects,
            bio,
            videoUrl, // Save the YouTube video URL
            createdAt: serverTimestamp(),
        });

        showNotification('Tutor sign-up successful!', 'success');

        // Redirect to the tutors dashboard or confirmation page
        setTimeout(() => {
            window.location.href = 'tutor_dashboard.html';
        }, 3000);
    } catch (error) {
        showNotification(`Error: ${error.message}`, 'error');
    }
});
