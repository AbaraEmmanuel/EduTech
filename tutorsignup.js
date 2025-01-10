import { showNotification } from './notification.js';

document.addEventListener('DOMContentLoaded', () => {
    const videoInput = document.getElementById('video');

    if (videoInput) {
        videoInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                console.log('File selected:', file.name); // Debug: Confirm file is selected
                
                const video = document.createElement('video');
                video.preload = 'metadata';

                // Event listener for metadata loading
                video.onloadedmetadata = () => {
                    console.log('Video duration:', video.duration); // Debug: Check duration
                    window.URL.revokeObjectURL(video.src);

                    if (video.duration > 120) {
                        console.log('Triggering notification...'); // Debug: Check notification trigger
                        showNotification('The video exceeds the 2-minute limit. Please upload a shorter video.', 'error');
                        event.target.value = ''; // Clear the input
                    }
                };

                // Error handling for metadata loading
                video.onerror = () => {
                    console.error('Error loading video metadata.'); // Debug: Log error
                    showNotification('Unable to process the video file. Please try again.', 'error');
                };

                video.src = URL.createObjectURL(file);
            }
        });
    } else {
        console.error('Video input element not found.'); // Debug: Log missing input
        showNotification('Error: Video input element not found.', 'error');
    }
});
showNotification('Testing notification from tutorsignup.js', 'success');