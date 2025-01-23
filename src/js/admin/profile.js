import { API_ENDPOINTS } from "../api/apiConfig.js";

export async function fetchUserProfile() {
    const token = localStorage.getItem("token");

    if (!token) {
        console.error("No token provided. User might not be logged in.");
        alert("You are not logged in. Redirecting to login page.");
        window.location.href = "../login.html";
        return null;
    }

    try {
        const response = await fetch(API_ENDPOINTS.PROFILE, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch user profile");
        }

        const user = await response.json();
        return user;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        alert("An error occurred while fetching your profile. Please try again.");
        return null;
    }
}
