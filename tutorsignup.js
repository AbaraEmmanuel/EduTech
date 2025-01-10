import { showNotification } from './notification.js';

document.addEventListener('DOMContentLoaded', () => {
    const videoInput = document.getElementById('video');

    if (videoInput) {
        videoInput.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                console.log('File selected:', file.name);
                const video = document.createElement('video');
                video.preload = 'metadata';

                video.onloadedmetadata = function() {
                    console.log('Video metadata loaded. Duration:', video.duration);
                    window.URL.revokeObjectURL(video.src);
                    if (video.duration > 120) {
                        // Trigger the notification
                        showNotification('The video exceeds the 2-minute limit. Please upload a shorter video.', 'error');
                        event.target.value = ''; // Clear the file input
                    }
                };

                video.onerror = function() {
                    console.error('Error loading video metadata.');
                    showNotification('Unable to process the video file. Please try again.', 'error');
                };

                video.src = URL.createObjectURL(file);
            }
        });
    } else {
        console.error('Video input element not found.');
        showNotification('Error: Video input element not found.', 'error');
    }
});
