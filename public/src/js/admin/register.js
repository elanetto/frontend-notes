const API_URL = "http://localhost:3000";

export async function registerUser(name, email, password, avatar) {
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, email, password, avatar }),
        });

        const data = await response.json();

        if (response.ok) {
            alert("Registration successful! Please log in.");
        } else {
            alert(data.error || "Registration failed!");
        }
    } catch (error) {
        console.error("Registration error:", error);
        alert("An error occurred during registration.");
    }
}
