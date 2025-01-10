import { showNotification } from './notification.js'; // Import from notification.js
import { auth, db, storage } from './firebase.js'; // Import auth, db, and storage from firebase.js
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { setDoc, doc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { ref, uploadBytes } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js";

document.querySelector('.form-container form').addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent page reload

    showNotification('Processing your registration...', 'Loading');

    // Get form inputs
    const name = e.target.name.value;
    const email = e.target.email.value;
    const subjects = Array.from(e.target.subject.selectedOptions).map(option => option.value);
    const bio = e.target.bio.value;
    const videoFile = e.target.video.files[0]; // Video file

    // Validate inputs
    if (!videoFile) {
        showNotification('Please upload a video.', 'error');
        return;
    }

    try {
        // Firebase Authentication Sign Up
        const password = 'temporaryPassword123'; // Generate or prompt for a secure password
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Upload video to Firebase Storage
        const videoRef = ref(storage, `tutors/${user.uid}/intro_video.mp4`);
        await uploadBytes(videoRef, videoFile);
        showNotification('Video uploaded successfully!', 'success');

        // Save tutor data to Firestore
        await setDoc(doc(db, 'tutors', user.uid), {
            name,
            email,
            subjects,
            bio,
            videoPath: `tutors/${user.uid}/intro_video.mp4`,
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
