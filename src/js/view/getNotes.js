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
                <div class="notes-bottom">
                    <div class="avatar-name-card">
                        <img src="${notes.avatar}" alt="Avatar of ${notes.name}" class="avatar-image" />
                        <span class="text-white notes-author">${notes.name}</span>
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
    } catch (error) {
        console.error('Error fetching blog posts:', error);
    }
});





// export async function fetchNotes() {
//     const blog = document.getElementById('notes-box');

//     try {
//         const res = await fetch('http://localhost:3000/notes', {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//         });

//         if (!res.ok) {
//             throw new Error(`Failed to fetch posts: ${res.status}`);
//         }

//         const data = await res.json();

//         data.forEach(notes => {
//             const postElement = document.createElement('div');
//             postElement.classList.add('note-post');

//             postElement.innerHTML = `
//             <a href="${notes.link}" target="_blank">
//                 <img src="${notes.image}" alt="${notes.title}" class="notes-image" />
//                 <div class="note-post-content">
//                     <h2 class="font-bold text-white notes-title">${notes.title}</h2>
//                     <p class="text-white notes-content-text">${notes.content}</p>
//                 </div>
//                 <div class="notes-bottom">
//                     <div class="avatar-name-card">
//                         <img src="${notes.avatar}" alt="Avatar of ${notes.name}" class="avatar-image" />
//                         <span class="text-white notes-author">${notes.name}</span>
//                     </div>
//                     <div class="admin-card-buttons">
//                         <div class="delete-btn"></div>
//                         <div class="edit-btn"></div>
//                     </div>
//                 </div>
//             </a>
//             `;

//             blog.appendChild(postElement);
//         });
//     } catch (error) {
//         console.error('Error fetching blog posts:', error);
//     }
// }
