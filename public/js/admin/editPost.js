import { API_ENDPOINTS } from "../api/apiConfig.js";

// Log to verify the script is connected to the HTML file
console.log("This is the editPost.js file");

// Get the post ID from the URL query string (e.g., ?id=123)
const params = new URLSearchParams(window.location.search);
const postId = params.get("id");
console.log("Editing post with ID:", postId);

if (!postId) {
    alert("No post ID found. Redirecting...");
    window.location.href = "/"; // Redirect if no ID is found
}

// Fetch post data and populate the form
async function fetchPostData() {
    try {
        const response = await fetch(API_ENDPOINTS.NOTE_BY_ID(postId));
        console.log("Response status:", response.status);
        if (!response.ok) throw new Error(`Failed to fetch post data: ${response.statusText}`);

        const post = await response.json();
        console.log("Fetched post data:", post);

        // Populate the form inputs
        document.querySelector("#title").value = post.title;
        document.querySelector("#content").value = post.content;
        document.querySelector("#image").value = post.image;
        document.querySelector("#link").value = post.link;

        // Render the preview of the note card
        renderPreview(post);

        // Ensure live preview is functional
        setupLivePreview();
    } catch (err) {
        console.error("Error fetching post data:", err);
        alert("Could not load post data. Please try again later.");
    }
}

// Render the preview beside the form
function renderPreview(post) {
    console.log("renderPreview called with:", post);

    if (!post.title || !post.content || !post.image || !post.link) {
        console.error("Incomplete post data passed to renderPreview:", post);
        return; // Exit if the post object is incomplete
    }

    const previewContainer = document.querySelector("#preview-container");
    previewContainer.innerHTML = `
        <div class="bg-gray-700 text-white rounded p-4">
            <a href="${post.link}" target="_blank">
                <img src="${post.image}" alt="${post.title}" class="notes-image w-full h-40 object-cover rounded" />
                <div class="note-post-content mt-4">
                    <h2 class="font-bold text-white notes-title">${post.title}</h2>
                    <p class="notes-content-text mt-2 break-words">${post.content}</p>
                </div>
            </a>
        </div>
    `;
}

// Update the preview as the user edits the form
function setupLivePreview() {
    const titleInput = document.querySelector("#title");
    const contentInput = document.querySelector("#content");
    const imageInput = document.querySelector("#image");
    const linkInput = document.querySelector("#link");

    [titleInput, contentInput, imageInput, linkInput].forEach((input) => {
        input.addEventListener("input", () => {
            console.log("Updating live preview...");

            const updatedPost = {
                title: titleInput.value,
                content: contentInput.value,
                image: imageInput.value,
                link: linkInput.value,
            };

            renderPreview(updatedPost);
        });
    });
}

// Handle form submission to update the post
document.querySelector("form").addEventListener("submit", async (e) => {
    e.preventDefault();

    console.log("Form submission triggered");

    const title = document.querySelector("#title").value;
    const content = document.querySelector("#content").value;
    const image = document.querySelector("#image").value;
    const link = document.querySelector("#link").value;

    console.log("Collected form data:", { title, content, image, link });

    const body = {
        title: title,
        content: content,
        image: image,
        link: link,
    };

    try {
        const response = await fetch(`${API_ENDPOINTS.NOTES}/${postId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}` // Token for authentication
            },
            body: JSON.stringify(body),
        });

        console.log("PUT Response status:", response.status);

        if (response.ok) {
            console.log("Displaying alert...");
            alert("Your note has been edited and saved! You will now be redirected back to the main page.");
            console.log("Redirecting...");
            setTimeout(() => {
                window.location.href = "/";
            }, 1000);        
        } else {
            const error = await response.json();
            console.error("Error response:", error);
            alert(`Failed to update post: ${error.error}`);
        }
    } catch (err) {
        console.error("Error updating post:", err);
        alert("An error occurred. Please try again later.");
    }
});

// Initial setup
fetchPostData();
