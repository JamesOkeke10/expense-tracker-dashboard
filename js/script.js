// Check if user is logged in
if (!localStorage.getItem("isLoggedIn")) {
    window.location.href = "index.html";
}

document.getElementById("logout").addEventListener("click", function () {
    localStorage.removeItem("isLoggedIn");
    window.location.href = "index.html";
});

// Store transactions in localStorage to persist data across sessions
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let spendingData = JSON.parse(localStorage.getItem("spendingData")) || [0, 0, 0, 0, 0, 0]; // Default categories: Food, Transport, Entertainment, Bills, Shopping, Other
let categories = ['Food', 'Transport', 'Entertainment', 'Bills', 'Shopping', 'Other'];

// Update the chart when the page loads
updateChart();

// Handle form submission for adding transactions
document.getElementById("transactionForm").addEventListener("submit", function (e) {
    e.preventDefault();

    // Get form data
    const category = document.getElementById("category").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const description = document.getElementById("description").value;

    // Save transaction
    const transaction = { date: new Date().toISOString().split('T')[0], category, amount, description };
    transactions.push(transaction);

    // Update spending data
    const categoryIndex = categories.indexOf(category);
    spendingData[categoryIndex] += amount;

    // Save to localStorage
    localStorage.setItem("transactions", JSON.stringify(transactions));
    localStorage.setItem("spendingData", JSON.stringify(spendingData));

    // Clear form
    document.getElementById("transactionForm").reset();

    // Update the balance and chart
    updateBalance();
    updateChart();
});

// Update the current balance on the dashboard
function updateBalance() {
    const total = spendingData.reduce((acc, amount) => acc + amount, 0);
    document.getElementById("balance").textContent = `$${total.toFixed(2)}`;
}

// Update the chart with new data
function updateChart() {
    const ctx = document.getElementById('spendingChart').getContext('2d');
    const spendingChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: categories,
            datasets: [{
                label: 'Amount Spent ($)',
                data: spendingData,
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Initialize balance and chart when page loads
updateBalance();
