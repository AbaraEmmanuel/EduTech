import { showNotification } from './notification.js';
import { auth, db } from './firebasetutors.js';
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { setDoc, doc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { sendVerificationEmail, setupResendButton } from './verify_email.js';

document.querySelector('.form-container form').addEventListener('submit', async (e) => {
    e.preventDefault();

    showNotification('Processing your registration...', 'Loading');

    const name = e.target.name.value.trim();
    const email = e.target.email.value.trim();
    const subjects = Array.from(e.target.subject.selectedOptions).map(option => option.value);
    const bio = e.target.bio.value.trim();
    const videoUrl = e.target.videoUrl.value.trim();
    const gender = e.target.gender.value;

    if (!name || !email || !bio || !videoUrl || !gender) {
        showNotification('Please fill in all the fields.', 'error');
        return;
    }

    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    if (!youtubeRegex.test(videoUrl)) {
        showNotification('Please provide a valid YouTube link.', 'error');
        return;
    }

    try {
        const password = 'temporaryPassword123'; 
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await setDoc(doc(db, 'tutors', user.uid), {
            name,
            email,
            subjects,
            bio,
            videoUrl,
            gender,
            password,
            createdAt: serverTimestamp(),
        });

        // Send email verification
        await sendVerificationEmail(user);

        showNotification('Tutor sign-up successful! A verification email has been sent.', 'success');

        // Display confirmation message with resend button
        const confirmationMessage = `
            <div class="confirmation-message">
                <p>Thank you for signing up, <strong>${name}</strong>!</p>
                <p>We have received your application and will contact you via email at <strong>${email}</strong> within the next 48 hours.</p>
                <p><strong>Please check your email and verify your account to proceed.</strong></p>
                <p id="verify-message">📩 <span style="color: green;">Verification email sent!</span> Please check your inbox.</p>
                <button id="resend-verification">🔄 Resend Verification Email</button>
            </div>
        `;
        document.querySelector('.form-container').innerHTML = confirmationMessage;
    
        setTimeout(() => setupResendButton(user), 500);  // Delay to ensure button exists


    } catch (error) {
        console.error('Error signing up:', error);
        showNotification('Something went wrong. Please try again later.', 'error');
    }
});
