import { fetchNotes } from "./fetchNotes.js";
import { renderNotes } from "./renderNotes.js";

document.addEventListener("DOMContentLoaded", async function () {
    const notes = await fetchNotes();
    renderNotes(notes);
});
