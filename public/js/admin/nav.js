document.addEventListener("DOMContentLoaded", () => {
    const navList = document.querySelector("nav ul"); // Select the `<ul>` inside `<nav>`
    const token = localStorage.getItem("token"); // Check if the user is logged in

    // Clear any existing nav items
    navList.innerHTML = "";

    if (token) {
        // If logged in, show "Account Page"
        navList.innerHTML = `
            <li class="mr-4">
                <a href="/account/account/" class="text-white hover:text-gray-400">
                    Account Page
                </a>
            </li>
            <li class="mr-4">
                <button id="logout-btn" class="text-white hover:text-gray-400">
                    Logout
                </button>
            </li>
        `;
    } else {
        // If not logged in, show "Login"
        navList.innerHTML = `
            <li class="mr-4">
                <a href="/account/login/" class="text-white hover:text-gray-400">
                    Login
                </a>
            </li>
        `;
    }

    // Add logout functionality
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("token"); // Remove the token
            window.location.href = "/"; // Redirect to home after logout
        });
    }
});
