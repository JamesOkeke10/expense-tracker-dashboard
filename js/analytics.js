document.addEventListener("DOMContentLoaded", () => {

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) {
    window.location.href = "index.html";
    return;
  }

  document.getElementById("welcomeUser").innerText =
    `Hi, ${currentUser.username}`;

  const transactions = JSON.parse(
    localStorage.getItem(`transactions_${currentUser.username}`)
  ) || [];

  // =========================
  //  TOTALS
  // =========================
  const income = transactions
    .filter(t => t.type === "income")
    .reduce((a, b) => a + b.amount, 0);

  const expense = transactions
    .filter(t => t.type === "expense")
    .reduce((a, b) => a + b.amount, 0);

  document.getElementById("totalIncome").innerText = `$${income}`;
  document.getElementById("totalExpense").innerText = `$${expense}`;
  document.getElementById("balance").innerText = `$${income - expense}`;

  // =========================
  //  CATEGORY DATA
  // =========================
  const categoryTotals = {};

  transactions.forEach(t => {
    if (t.type === "expense") {
      categoryTotals[t.category] =
        (categoryTotals[t.category] || 0) + t.amount;
    }
  });

  // =========================
  //  CHARTS
  // =========================
  new Chart(document.getElementById("categoryChart"), {
    type: "doughnut",
    data: {
      labels: Object.keys(categoryTotals),
      datasets: [{
        data: Object.values(categoryTotals)
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });

  // =========================
  //  MONTHLY TREND
  // =========================
  const monthlyData = {};

  transactions.forEach(t => {
    const month = t.date.slice(0, 7);

    if (!monthlyData[month]) {
      monthlyData[month] = { income: 0, expense: 0 };
    }

    monthlyData[month][t.type] += t.amount;
  });

  const months = Object.keys(monthlyData).sort();

  new Chart(document.getElementById("trendChart"), {
    type: "line",
    data: {
      labels: months,
      datasets: [
        {
          label: "Income",
          data: months.map(m => monthlyData[m].income)
        },
        {
          label: "Expense",
          data: months.map(m => monthlyData[m].expense)
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });

  // =========================
  // 🧠 SMART INSIGHTS ENGINE
  // =========================
  const insights = [];

  if (transactions.length === 0) {
    insights.push("📭 No data yet. Start adding transactions.");
  }

  // Income vs Expense
  if (expense > income) {
    insights.push("⚠️ You're spending more than you earn.");
  } else if (income > expense) {
    insights.push(" You are saving money.");
  }

  // Top Category
  const sortedCategories = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1]);

  if (sortedCategories.length > 0) {
    const [topCat, amount] = sortedCategories[0];
    insights.push(` Highest spending is on ${topCat} ($${amount}).`);
  }

  // Average Expense
  const avgExpense =
    expense / (transactions.filter(t => t.type === "expense").length || 1);

  if (avgExpense > 100) {
    insights.push(" Your average expense is quite high.");
  }

  // Weekend Behavior
  const weekendSpending = transactions.filter(t => {
    const day = new Date(t.date).getDay();
    return day === 0 || day === 6;
  });

  if (weekendSpending.length > transactions.length / 2) {
    insights.push(" You spend more on weekends.");
  }

  // Monthly Growth
  if (months.length >= 2) {
    const last = monthlyData[months[months.length - 1]].expense;
    const prev = monthlyData[months[months.length - 2]].expense;

    if (last > prev) {
      insights.push(" Your spending increased this month.");
    } else {
      insights.push(" Your spending decreased this month.");
    }
  }

  // =========================
  //  RENDER INSIGHTS
  // =========================
  const list = document.getElementById("insightsList");

  insights.forEach(text => {
    const li = document.createElement("li");
    li.className = "insight-card";
    li.textContent = text;
    list.appendChild(li);
  });

  // LOGOUT
  window.logout = function () {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
  };

});
