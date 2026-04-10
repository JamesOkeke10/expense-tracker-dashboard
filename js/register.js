document.getElementById("registerForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("newUsername").value;
    const password = document.getElementById("newPassword").value;

    let users = JSON.parse(localStorage.getItem("users")) || [];

    // CHECK IF USER EXISTS
    const existingUser = users.find(u => u.username === username);

    if (existingUser) {
        alert("User already exists!");
        return;
    }

    const newUser = { username, password };

    users.push(newUser);

    localStorage.setItem("users", JSON.stringify(users));

    alert("Registration successful! You can now login.");

    window.location.href = "index.html";
});