document.addEventListener("DOMContentLoaded", () => {

  // AUTH
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) {
    window.location.href = "index.html";
    return;
  }

  document.getElementById("welcomeUser").innerText =
    `Hi, ${currentUser.username}`;

  let transactions = JSON.parse(
    localStorage.getItem(`transactions_${currentUser.username}`)
  ) || [];

  const tableBody = document.querySelector("#transactionsTable tbody");

  // =========================
  //  STATS
  // =========================
  function updateStats(data) {
    document.getElementById("totalCount").innerText = data.length;

    const income = data
      .filter(t => t.type === "income")
      .reduce((a, b) => a + b.amount, 0);

    const expense = data
      .filter(t => t.type === "expense")
      .reduce((a, b) => a + b.amount, 0);

    document.getElementById("totalIncome").innerText = `$${income}`;
    document.getElementById("totalExpense").innerText = `$${expense}`;
  }

  // =========================
  //  RENDER
  // =========================
  function renderTransactions(data) {
    tableBody.innerHTML = "";

    if (!data.length) {
      tableBody.innerHTML =
        "<tr><td colspan='6'>No transactions found</td></tr>";
      updateStats([]);
      return;
    }

    data.slice().reverse().forEach(t => {
      const row = `
        <tr>
          <td>${t.date}</td>
          <td>${t.category}</td>
          <td>${t.type}</td>
          <td>$${t.amount}</td>
          <td>${t.description}</td>
          <td>
            <button onclick="editTransaction(${t.id})">Edit</button>
            <button class="delete-btn" onclick="deleteTransaction(${t.id})">Delete</button>
          </td>
        </tr>
      `;
      tableBody.innerHTML += row;
    });

    updateStats(data);
  }

  // =========================
  //  DELETE
  // =========================
  window.deleteTransaction = function (id) {
    transactions = transactions.filter(t => t.id !== id);

    localStorage.setItem(
      `transactions_${currentUser.username}`,
      JSON.stringify(transactions)
    );

    renderTransactions(transactions);
  };

  // =========================
  //  EDIT
  // =========================
  window.editTransaction = function (id) {
    const t = transactions.find(t => t.id === id);

    const newAmount = prompt("Edit amount:", t.amount);
    if (newAmount === null) return;

    t.amount = parseFloat(newAmount);

    localStorage.setItem(
      `transactions_${currentUser.username}`,
      JSON.stringify(transactions)
    );

    renderTransactions(transactions);
  };

  // =========================
  //  FILTER
  // =========================
  function filterData() {
    const search = document.getElementById("search").value.toLowerCase();
    const type = document.getElementById("filterType").value;
    const start = document.getElementById("startDate").value;
    const end = document.getElementById("endDate").value;

    const filtered = transactions.filter(t => {
      return (
        t.category.toLowerCase().includes(search) &&
        (type === "" || t.type === type) &&
        (!start || t.date >= start) &&
        (!end || t.date <= end)
      );
    });

    renderTransactions(filtered);
  }

  document.getElementById("search").addEventListener("input", filterData);
  document.getElementById("filterType").addEventListener("change", filterData);
  document.getElementById("startDate").addEventListener("change", filterData);
  document.getElementById("endDate").addEventListener("change", filterData);

  // LOGOUT
  window.logout = function () {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
  };

  renderTransactions(transactions);
});