// notes.js
import { fetchNotes } from "./fetchNotes.js";
import { renderNotes } from "./renderNotes.js";

document.addEventListener("DOMContentLoaded", async function () {
    const notes = await fetchNotes(); // Fetch notes from the API
    renderNotes(notes); // Render the fetched notes into the DOM
});
