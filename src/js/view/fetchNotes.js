export async function fetchNotes() {
  try {
    const res = await fetch("/data/allNotes.json");
    if (!res.ok) {
      throw new Error(`Failed to fetch notes: ${res.status}`);
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching notes:", error);
    return [];
  }
}



// import { API_ENDPOINTS } from "../api/apiConfig.js";

// export async function fetchNotes(sort = "desc") {
//     try {
//         const res = await fetch(API_ENDPOINTS.NOTES_SORTED(sort), {
//             method: "GET",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//         });

//         if (!res.ok) {
//             throw new Error(`Failed to fetch posts: ${res.status}`);
//         }

//         const data = await res.json();
//         return data;
//     } catch (error) {
//         console.error("Error fetching notes:", error);
//         return [];
//     }
// }
