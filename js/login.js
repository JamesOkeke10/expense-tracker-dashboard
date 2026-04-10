document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const errorMessage = document.getElementById("errorMessage");

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(
        u => u.username === username && u.password === password
    );

    if (user) {
        localStorage.setItem("currentUser", JSON.stringify(user));
        window.location.href = "dashboard.html";
    } else {
        errorMessage.innerText = "Invalid username or password";
    }
});