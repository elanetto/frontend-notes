import { loginUser } from "./login.js";
import { registerUser } from "./register.js";
import { logoutUser } from "./logout.js";
import { fetchUserProfile } from "./profile.js";
import { updateProfileUI } from "./updateProfileUI.js";

document.addEventListener("DOMContentLoaded", () => {
    const profilePageContainer = document.getElementById("profilePage");
    if (profilePageContainer) {
        fetchUserProfile()
            .then((user) => {
                if (user) {
                    updateProfileUI(user);
                }
            })
            .catch((error) => {
                console.error("Error updating the profile UI:", error);
            });
    }

    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            const email = document.getElementById("loginEmail").value;
            const password = document.getElementById("loginPassword").value;

            await loginUser(email, password);
        });
    }

    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
        registerForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            const name = document.getElementById("registerName").value;
            const email = document.getElementById("registerEmail").value;
            const password = document.getElementById("registerPassword").value;

            await registerUser(name, email, password);
        });
    }

    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            logoutUser();
        });
    }
});
