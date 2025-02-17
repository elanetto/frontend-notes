import { API_ENDPOINTS } from "../api/apiConfig.js";

export async function loginUser(email, password) {
    if (!email || !password) {
        alert("Please enter both email and password.");
        return;
    }

    try {
        const response = await fetch(API_ENDPOINTS.LOGIN, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            alert("Login successful!");
            
            // Save token and user data to localStorage
            localStorage.setItem("token", data.token);
            console.log("Token:", data.token);

            // Save user data
            const user = data.user;
            console.log("User:", user);
            localStorage.setItem("user_id", user.id || "Unknown ID");
            localStorage.setItem("name", user.name || "Unknown User");
            localStorage.setItem("avatar", user.avatar || "/assets/images/avatar/avatar-01.svg");
            localStorage.setItem("email", user.email || "Unknown Email");

            console.log("User data saved to localStorage");

            // Redirect to account page
            window.location.href = "../account/";
        } else {
            alert(data.error || "Login failed!");
        }
    } catch (error) {
        console.error("Login error:", error);
        alert("An error occurred during login.");
    }
}
