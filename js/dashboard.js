//  AUTH CHECK
const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser) {
  window.location.href = "index.html";
}

//  SHOW USER
document.getElementById("welcomeUser").innerText = `Hi, ${currentUser.username}`;

//  LOAD USER TRANSACTIONS
let transactions = JSON.parse(
  localStorage.getItem(`transactions_${currentUser.username}`)
) || [];

//  ADD TRANSACTION
document.getElementById("transactionForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const newTransaction = {
    id: Date.now(),
    date: document.getElementById("date").value,
    type: document.getElementById("type").value,
    category: document.getElementById("category").value,
    amount: parseFloat(document.getElementById("amount").value),
    description: document.getElementById("description").value
  };

  transactions.push(newTransaction);
  saveData();
  renderAll();
  this.reset();
});

//  SAVE DATA
function saveData() {
  localStorage.setItem(
    `transactions_${currentUser.username}`,
    JSON.stringify(transactions)
  );
}

//  UPDATE SUMMARY
function updateSummary() {
  const income = transactions
    .filter(t => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  const expense = transactions
    .filter(t => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = income - expense;

  document.getElementById("income").innerText = `$${income}`;
  document.getElementById("expense").innerText = `$${expense}`;
  document.getElementById("balance").innerText = `$${balance}`;
}

//  RENDER TABLE
function renderTransactions() {
  const tbody = document.querySelector("#transactionsTable tbody");
  tbody.innerHTML = "";

  if (transactions.length === 0) {
    tbody.innerHTML = "<tr><td colspan='6'>No transactions yet</td></tr>";
    return;
  }

  transactions.slice().reverse().forEach(t => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${t.date}</td>
      <td>${t.category}</td>
      <td>${t.type}</td>
      <td>$${t.amount}</td>
      <td>${t.description}</td>
      <td><button onclick="deleteTransaction(${t.id})">Delete</button></td>
    `;

    tbody.appendChild(row);
  });
}

//  DELETE
function deleteTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  saveData();
  renderAll();
}

// CHART
let chart;

function renderChart() {
  const categoryTotals = {};

  transactions.forEach(t => {
    if (t.type === "expense") {
      categoryTotals[t.category] =
        (categoryTotals[t.category] || 0) + t.amount;
    }
  });

  const labels = Object.keys(categoryTotals);
  const data = Object.values(categoryTotals);

  if (chart) chart.destroy();

  chart = new Chart(document.getElementById("categoryChart"), {
    type: "doughnut",
    data: {
      labels: labels,
      datasets: [{ data: data }]
    }
  });
}

//  RENDER ALL
function renderAll() {
  updateSummary();
  renderTransactions();
  renderChart();
}

//  LOGOUT
function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
}

//  INIT
renderAll();
