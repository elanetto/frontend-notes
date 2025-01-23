export function renderNotes(notes) {
    const blog = document.getElementById("notes-box");

    if (!blog) {
        console.error("Element with ID 'notes-box' not found.");
        return;
    }

    notes.forEach((note) => {
        const postElement = document.createElement("div");
        postElement.classList.add("note-post");

        postElement.innerHTML = `
            <a href="${note.link}" target="_blank">
                <img src="${note.image}" alt="${note.title}" class="notes-image" />
                <div class="note-post-content">
                    <h2 class="font-bold text-white notes-title">${note.title}</h2>
                    <p class="text-white notes-content-text">${note.content}</p>
                </div>
                <div class="notes-bottom">
                    <div class="avatar-name-card">
                        <img src="${note.avatar}" alt="Avatar of ${note.name}" class="avatar-image" />
                        <span class="text-white notes-author">${note.name}</span>
                    </div>
                    <div class="admin-card-buttons">
                        <div class="delete-btn"></div>
                        <div class="edit-btn"></div>
                    </div>
                </div>
            </a>
        `;

        blog.appendChild(postElement);
    });
}
