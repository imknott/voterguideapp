const socket = io(); // Connect to the server via WebSocket

// Listen for new comments sent by the server
socket.on('updateComments', (newComment) => {
    if (!newComment || !newComment.username || !newComment.commentText || !newComment.timestamp) {
        console.error('Received malformed comment data:', newComment);
        return;
    }

    const commentsContainer = document.getElementById('comments-container');
    if (!commentsContainer) {
        console.error('Comments container not found.');
        return;
    }

    // Create a new comment element
    const commentElement = document.createElement('div');
    commentElement.classList.add('comment');
    commentElement.innerHTML = `
        <strong>${newComment.username}</strong> 
        <p>${newComment.commentText}</p>
        <small>${new Date(newComment.timestamp).toLocaleString()}</small>
    `;

    // Prepend the new comment with a highlight effect
    commentElement.classList.add('highlight');
    commentsContainer.prepend(commentElement);

    // Remove the highlight after a few seconds
    setTimeout(() => {
        commentElement.classList.remove('highlight');
    }, 2000);

    // Limit the total number of displayed comments
    const maxComments = 50;
    while (commentsContainer.children.length > maxComments) {
        commentsContainer.removeChild(commentsContainer.lastChild);
    }
});

// Handle connection status
socket.on('connect', () => {
    console.log('Connected to the server.');
});

socket.on('disconnect', () => {
    console.warn('Disconnected from the server.');
    const statusMessage = document.getElementById('status-message');
    if (statusMessage) {
        statusMessage.textContent = 'Connection lost. Trying to reconnect...';
        statusMessage.style.color = 'red';
    }
});

socket.on('reconnect', () => {
    console.log('Reconnected to the server.');
    const statusMessage = document.getElementById('status-message');
    if (statusMessage) {
        statusMessage.textContent = 'Connected';
        statusMessage.style.color = 'green';
    }
});

// Sending a new comment to the server
const commentForm = document.getElementById('comment-form');
if (commentForm) {
    commentForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const messageInput = document.getElementById('comment-input');
        if (!messageInput) {
            console.error('Message input field not found.');
            return;
        }

        const commentText = messageInput.value.trim();
        if (commentText) {
            // Construct the new comment object
            const newComment = {
                username: 'YourUsername', // Replace with actual username or pull from session
                commentText,
                timestamp: new Date().toISOString()
            };

            // Emit the new comment to the server
            socket.emit('newMessage', newComment);

            // Clear the input field
            messageInput.value = '';
        }
    });
}
