import { API_ENDPOINTS } from "../api/apiConfig.js";

document.querySelector("form").addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const title = document.querySelector("#title").value.trim();
    const content = document.querySelector("#content").value.trim();
    const image = document.querySelector("#image").value.trim();
    let link = document.querySelector("#link").value.trim();
  
    // Ensure the link includes the protocol
    if (!/^https?:\/\//i.test(link)) {
      link = `https://${link}`;
    }
  
    // Retrieve the user ID from localStorage
    const userId = localStorage.getItem("user_id");
    console.log("User ID from localStorage:", userId);
  
    if (!userId) {
      alert("You must be logged in to create a post!");
      window.location.href = "/login.html";
      return;
    }
  
    const body = {
      title: title,
      content: content,
      image: image,
      link: link, // Processed link
      user_id: userId,
    };
  
    try {
      const res = await fetch(API_ENDPOINTS.NOTES, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(body),
      });
  
      const data = await res.json();
  
      if (res.ok) {
        console.log("Post created successfully:", data);
        alert("Your note has been saved!");
        window.location.href = "/";
      } else {
        console.error("Error creating post:", data.error);
        alert(`Failed to create post: ${data.error || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Error creating post:", err);
      alert("An error occurred. Please try again later.");
    }
  });
  