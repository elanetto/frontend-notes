import { login } from './admin/login.js';
import { fetchNotes } from './view/getNotes.js';




document.addEventListener('DOMContentLoaded', () => {

    fetchNotes();

    login();

});
