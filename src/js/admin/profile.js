export async function loadProfile() {
    try {
        console.log("Stored token:", localStorage.getItem("token")); // Debugging the token

        const res = await fetch("http://localhost:3000/profile", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: localStorage.getItem("token"),
            },
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch profile: ${res.status}`);
        }

        const data = await res.json();

        // Log the data for debugging
        console.log("Fetched profile data:", data);

        // Display the raw response in the browser for debugging
        const profileOutputElement = document.getElementById("profileOutput");
        if (profileOutputElement) {
            profileOutputElement.textContent = JSON.stringify(data, null, 2);
        } else {
            console.error("Element with id 'profileOutput' not found.");
        }
    } catch (error) {
        console.error("Error loading profile:", error);
        alert("Could not load profile. Please try again later.");
    }
}
