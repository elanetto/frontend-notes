export function updateProfileUI(user) {
    const profileNameElement = document.getElementById("profileName");
    const profileAvatarElement = document.getElementById("profileAvatar");

    const avatar = localStorage.getItem("avatar");
    const name = localStorage.getItem("name");
    const email = localStorage.getItem("email");

    if (profileNameElement) {
        profileNameElement.textContent = name || "Unknown User";
    } else {
        console.error("Profile name element not found in the DOM.");
    }

    if (profileAvatarElement) {
        profileAvatarElement.src = avatar || "/assets/images/avatar/avatar-01.svg";
    } else {
        console.error("Profile avatar element not found in the DOM.");
    }
}
