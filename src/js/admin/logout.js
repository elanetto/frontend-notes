export function logoutUser() {
    localStorage.removeItem("token");  // Remove the token
    alert("Logged out successfully!");
    window.location.href = "index.html";  // Redirect to login page
}
