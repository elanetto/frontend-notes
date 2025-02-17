export function logoutUser() {
    console.log("Clearing all localStorage items and logging out...");
    localStorage.clear();
    window.location.href = "../../../index.html";
}
