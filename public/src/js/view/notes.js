import { fetchNotes } from "./fetchNotes.js";
import { renderNotes } from "./renderNotes.js";

document.addEventListener("DOMContentLoaded", async function () {
    const notes = await fetchNotes();
    renderNotes(notes);

    const token = localStorage.getItem("token");
    const navButtons = document.getElementById("nav-buttons");

    if (token && navButtons) {
        const accountButton = document.createElement("a");
        accountButton.href = "/account/account/";
        accountButton.className = "text-white hover:text-gray-400 ml-4";
        accountButton.innerText = "Account Page";
        navButtons.appendChild(accountButton);
    }
});
