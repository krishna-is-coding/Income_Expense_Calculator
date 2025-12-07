let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

function updateStorage() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Format currency
function formatCurrency(amount) {
    return "$" + amount.toLocaleString();
}

// Add Transaction
function addTransaction() {
    let type = document.querySelector('input[name="type"]:checked').value;
    let desc = document.getElementById("desc").value.trim();
    let amount = Number(document.getElementById("amount").value);

    if (!desc || amount <= 0) return alert("Enter a valid description and positive amount");

    transactions.push({ id: Date.now(), type, desc, amount });

    updateStorage();
    renderList();
    resetForm();
}

// Reset Form
function resetForm() {
    document.getElementById("desc").value = "";
    document.getElementById("amount").value = "";
    document.querySelector('input[name="type"][value="income"]').checked = true;
}

// Render List
function renderList() {
    let filter = document.querySelector('input[name="filter"]:checked').value;

    let filtered = transactions.filter(t => {
        if (filter === "all") return true;
        return t.type === filter;
    });

    document.getElementById("list").innerHTML = filtered.map(t => `
    <li class="${t.type}">
      ${t.desc} : <strong>${formatCurrency(t.amount)}</strong>
      <span class="button-group">
        <button class="edit-btn" onclick="editItem(${t.id})">Edit</button>
        <button class="del-btn" onclick="deleteItem(${t.id})">Delete</button>
      </span>
    </li>
    `).join("");

    calculateTotals();
}

// Edit Item
function editItem(id) {
    let item = transactions.find(t => t.id === id);
    document.getElementById("desc").value = item.desc;
    document.getElementById("amount").value = item.amount;
    document.querySelector(`input[name="type"][value="${item.type}"]`).checked = true;

    deleteItem(id);
}

// Delete Item
function deleteItem(id) {
    if (!confirm("Are you sure you want to delete this transaction?")) return;
    transactions = transactions.filter(t => t.id !== id);
    updateStorage();
    renderList();
}

// Calculate Totals
function calculateTotals() {
    let income = transactions.filter(t => t.type === 'income')
                .reduce((acc, cur) => acc + cur.amount, 0);

    let expense = transactions.filter(t => t.type === 'expense')
                .reduce((acc, cur) => acc + cur.amount, 0);

    document.getElementById("totalIncome").innerText = formatCurrency(income);
    document.getElementById("totalExpense").innerText = formatCurrency(expense);
    document.getElementById("balance").innerText = formatCurrency(income - expense);
}

// Initial render
renderList();
