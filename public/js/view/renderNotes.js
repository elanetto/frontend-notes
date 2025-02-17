import { API_ENDPOINTS } from "../api/apiConfig.js";

export function renderNotes(notes) {
  const blog = document.getElementById("notes-box");

  if (!blog) {
    console.error("Element with ID 'notes-box' not found.");
    return;
  }

  // Get the logged-in user's name and token from local storage
  const token = localStorage.getItem("token");
  const loggedInUserName = localStorage.getItem("name");

  notes.forEach((note) => {
    const postElement = document.createElement("div");
    postElement.classList.add("note-post");

    const isNoteOwner = token && loggedInUserName === note.name;

    function formatDate(isoString) {
      const date = new Date(isoString);
      const day = date.getDate();
      const month = date.toLocaleString("en-GB", { month: "long" });
      const year = date.getFullYear();
    
      // Function to add ordinal suffix (st, nd, rd, th)
      function getOrdinal(n) {
        if (n > 3 && n < 21) return "th"; // Covers 11th - 19th
        switch (n % 10) {
          case 1: return "st";
          case 2: return "nd";
          case 3: return "rd";
          default: return "th";
        }
      }
    
      return `${day}${getOrdinal(day)} of ${month} ${year}`;
    }
    

    postElement.innerHTML = `
      <a href="${note.link}" target="_blank">
        <img src="${note.image}" alt="${note.title}" class="notes-image" />
        <div class="note-post-content">
          <h2 class="font-bold text-white notes-title">${note.title}</h2>
          <span class="line-under-title"></span>
          <div class="notes-sub-and-date">
            <span class="notes-subject">${note.subject}</span>
            <span class="notes-date">${formatDate(note.date)}</span>
          </div>
          <span class="line-under-title"></span>
          <p class="text-white notes-content-text">${note.content}</p>
        </div>
      </a>
      <div class="notes-bottom">
        <div class="avatar-name-card">
          <img src="${note.avatar}" alt="Avatar of ${note.name}" class="avatar-image" />
          <span class="text-white notes-author">${note.name}</span>
        </div>
        ${
          isNoteOwner
            ? `
            <div class="admin-card-buttons">
              <div class="delete-btn" data-id="${note.id}"></div>
              <div class="edit-btn" data-id="${note.id}"></div>
            </div>
            `
            : ""
        }
      </div>
    `;

    blog.appendChild(postElement);
  });

  // Attach event listeners to delete buttons
  const deleteButtons = document.querySelectorAll(".delete-btn");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", async (event) => {
      const noteId = button.dataset.id;
      const userConfirmed = confirm("Are you sure you want to delete this note?");

      if (userConfirmed) {
        try {
          const response = await fetch(`${API_ENDPOINTS.NOTES}/${noteId}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            alert("Note deleted successfully.");
            // Remove the note element from the DOM
            button.closest(".note-post").remove();
          } else {
            const error = await response.json();
            console.error("Failed to delete note:", error);
            alert(`Failed to delete note: ${error.error}`);
          }
        } catch (err) {
          console.error("Error deleting note:", err);
          alert("An error occurred. Please try again later.");
        }
      }
    });
  });

  // Attach event listeners to edit buttons
  const editButtons = document.querySelectorAll(".edit-btn");
  editButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const noteId = button.dataset.id;
      // Redirect to the edit post page with the note ID in the query string
      window.location.href = `/post/edit/index.html?id=${noteId}`;
    });
  });
}
