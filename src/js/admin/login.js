const API_URL = "http://localhost:3000";

export async function loginUser(email, password) {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            alert("Login successful!");
            localStorage.setItem("token", data.token);  // Store JWT token
            console.log("Token:", data.token);
            window.location.href = "../account/"; // Redirect to profile page
        } else {
            alert(data.error || "Login failed!");
        }
    } catch (error) {
        console.error("Login error:", error);
        alert("An error occurred during login.");
    }
}
