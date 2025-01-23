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
            localStorage.setItem("token", data.token);
            console.log("Token:", data.token);

            // Fetch user profile after successful login
            const profileResponse = await fetch(API_ENDPOINTS.PROFILE, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${data.token}`,
                },
            });

            if (!profileResponse.ok) {
                throw new Error("Failed to fetch user profile.");
            }

            const userProfile = await profileResponse.json();

            // Log the user profile to check the structure
            console.log("User Profile:", userProfile);

            // Save user data to localStorage
            localStorage.setItem("name", userProfile.name || "Unknown User");
            localStorage.setItem("avatar", userProfile.avatar || "/assets/images/avatar/avatar-01.svg");
            localStorage.setItem("email", userProfile.email || "Unknown Email");

            console.log("User Profile Saved:", userProfile);

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



// import { API_ENDPOINTS } from "../api/apiConfig.js";

// export async function loginUser(email, password) {
//     if (!email || !password) {
//         alert("Please enter both email and password.");
//         return;
//     }

//     try {
//         const response = await fetch(API_ENDPOINTS.LOGIN, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ email, password }),
//         });

//         const data = await response.json();

//         if (response.ok) {
//             alert("Login successful!");
//             localStorage.setItem("token", data.token);
//             console.log("Token:", data.token);

//             // Fetch user profile after successful login
//             const profileResponse = await fetch(API_ENDPOINTS.PROFILE, {
//                 method: "GET",
//                 headers: {
//                     Authorization: `Bearer ${data.token}`,
//                 },
//             });

//             if (!profileResponse.ok) {
//                 throw new Error("Failed to fetch user profile.");
//             }

//             const userProfile = await profileResponse.json();

//             // Save user data to localStorage
//             localStorage.setItem("name", userProfile.name);
//             localStorage.setItem("avatar", userProfile.avatarUrl);
//             localStorage.setItem("email", userProfile.email);

//             console.log("User Profile Saved:", userProfile);

//             // Redirect to account page
//             window.location.href = "../account/";
//         } else {
//             alert(data.error || "Login failed!");
//         }
//     } catch (error) {
//         console.error("Login error:", error);
//         alert("An error occurred during login.");
//     }
// }



// import { API_ENDPOINTS } from "../api/apiConfig.js";

// export async function loginUser(email, password) {
//     if (!email || !password) {
//         alert("Please enter both email and password.");
//         return;
//     }

//     try {
//         const response = await fetch(API_ENDPOINTS.LOGIN, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ email, password }),
//         });

//         const data = await response.json();

//         if (response.ok) {
//             alert("Login successful!");
//             localStorage.setItem("token", data.token);
//             console.log("Token:", data.token);
//             window.location.href = "../account/";
//         } else {
//             alert(data.error || "Login failed!");
//         }
//     } catch (error) {
//         console.error("Login error:", error);
//         alert("An error occurred during login.");
//     }
// }