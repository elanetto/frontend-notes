import { API_ENDPOINTS } from "../api/apiConfig.js";

export async function fetchNotes() {
    try {
        const res = await fetch(API_ENDPOINTS.NOTES, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch posts: ${res.status}`);
        }

        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching notes:", error);
        return [];
    }
}
