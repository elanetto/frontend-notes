import bcrypt from "bcrypt";

const newPassword = "new_password_here"; // Replace with the password you want to hash
bcrypt.hash(newPassword, 10, (err, hash) => {
    if (err) {
        console.error("Error hashing password:", err);
        return;
    }
    console.log("Hashed password:", hash);
});
