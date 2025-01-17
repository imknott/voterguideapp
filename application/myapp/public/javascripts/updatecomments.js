const socket = io();

// Listen for new comments
socket.on('updateComments', (data) => {
    const commentsSection = document.getElementById('comments-section');

    // Append the new comment to the comments section
    const commentDiv = document.createElement('div');
    commentDiv.className = 'comment';
    commentDiv.innerHTML = `
        <strong>${data.username}</strong>: ${data.commentText}
        <small>${new Date(data.timestamp).toLocaleString()}</small>
    `;
    commentsSection.prepend(commentDiv);
});