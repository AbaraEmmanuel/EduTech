import { showNotification } from './notification.js'; // Import from notification.js
import { auth, db } from './firebase.js'; // Import auth and db from firebase.js
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { setDoc, doc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

document.querySelector('.sign-up-form').addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent page reload

    showNotification('Processing...', 'Loading');

    const firstName = e.target['first-name'].value;
    const lastName = e.target['last-name'].value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const confirmPassword = e.target['confirm-password'].value;
    const role = e.target.role.value;


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


        // Redirect to the appropriate payment page based on the selected plan
        let paymentPage = '';
        switch (role) {
            case 'basicplan':
                paymentPage = 'basic_payment.html';
                break;
            case 'proplan':
                paymentPage = 'pro_payment.html';
                break;
            case 'premiumplan':
                paymentPage = 'premium_payment.html';
                break;
            default:
                paymentPage = 'error.html'; // Fallback in case of an unknown role
        }

                
        // Show notification on successful signup
        showNotification('Sign-up successful!', 'success');

        console.log('Redirecting to:', paymentPage);
        // Redirect after 2 seconds to allow time for the success notification
        setTimeout(() => {
            window.location.href = paymentPage;
        }, 3000);

    } catch (error) {
        showNotification(`Error: ${error.message}`, 'error');
    }
});
