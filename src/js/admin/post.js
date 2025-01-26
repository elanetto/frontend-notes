import { API_ENDPOINTS } from "../api/apiConfig.js";

document.querySelector('form').addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = document.querySelector('#title').value;
    const content = document.querySelector('#content').value;
    const image = document.querySelector('#image').value;
    const link = document.querySelector('#link').value;

    const body = {
        title: title,
        content: content,
        image: image,
        link: link,
    };

    const res = await fetch(API_ENDPOINTS.NOTES, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });
    
    const data = await res.json();
    console.log(data);
});