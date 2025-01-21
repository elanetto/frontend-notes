document.addEventListener('DOMContentLoaded', async function () {
    const blog = document.getElementById('notes-box');

    try {
        const res = await fetch('http://localhost:3000/notes', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch posts: ${res.status}`);
        }

        const data = await res.json();

        data.forEach(notes => {
            const postElement = document.createElement('div');
            postElement.classList.add('note-post');

            postElement.innerHTML = `
            <a href="${notes.link}" target="_blank">
                <img src="${notes.image}" alt="${notes.title}" class="notes-image" />
                <div class="note-post-content">
                    <h2 class="font-bold text-white notes-title">${notes.title}</h2>
                    <p class="text-white notes-content-text">${notes.content}</p>
                </div>
            </a>
            `;

            blog.appendChild(postElement);
        });
    } catch (error) {
        console.error('Error fetching blog posts:', error);
    }
});