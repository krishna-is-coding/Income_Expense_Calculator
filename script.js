// =======================
// STATE
// =======================
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let editId = null;

// =======================
// DOM ELEMENTS
// =======================
const descInput = document.getElementById("desc");
const amountInput = document.getElementById("amount");
const listEl = document.getElementById("list");
const balanceEl = document.getElementById("balance");
const incomeEl = document.getElementById("totalIncome");
const expenseEl = document.getElementById("totalExpense");

const addBtn = document.getElementById("addBtn");
const resetBtn = document.getElementById("resetBtn");
const filterRadios = document.querySelectorAll("input[name='filter']");

// =======================
// EVENT LISTENERS
// =======================
addBtn.addEventListener("click", addTransaction);
resetBtn.addEventListener("click", resetForm);
filterRadios.forEach(r => r.addEventListener("change", renderList));

// =======================
// FUNCTIONS
// =======================

// Currency Formatter
function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

// Add or Update Transaction
function addTransaction() {
  const desc = descInput.value.trim();
  const amount = +amountInput.value;
  const type = document.querySelector("input[name='type']:checked").value;

  if (!desc || amount <= 0) {
    alert("Please enter valid description and amount");
    return;
  }

  if (editId) {
    transactions = transactions.map(t =>
      t.id === editId ? { ...t, desc, amount, type } : t
    );
    editId = null;
  } else {
    transactions.push({
      id: Date.now(),
      desc,
      amount,
      type,
    });
  }

  saveAndRender();
  resetForm();
}

// Reset Form
function resetForm() {
  descInput.value = "";
  amountInput.value = "";
  document.querySelector("input[name='type'][value='income']").checked = true;
  editId = null;
}

// Render List
function renderList() {
  const filter = document.querySelector("input[name='filter']:checked").value;
  listEl.innerHTML = "";

  const filtered = transactions.filter(t =>
    filter === "all" ? true : t.type === filter
  );

  if (filtered.length === 0) {
    listEl.innerHTML = "<li class='empty'>No transactions found</li>";
    calculateTotals();
    return;
  }

  filtered.forEach(t => {
    const li = document.createElement("li");
    li.className = t.type;
    li.innerHTML = `
      <span>${t.desc} - <strong>${formatCurrency(t.amount)}</strong></span>
      <div class="btn-group">
        <button class="edit-btn" onclick="editTransaction(${t.id})">Edit</button>
        <button class="del-btn" onclick="deleteTransaction(${t.id})">Delete</button>
      </div>
    `;
    listEl.appendChild(li);
  });

  calculateTotals();
}

// Edit
function editTransaction(id) {
  const item = transactions.find(t => t.id === id);
  editId = id;

  descInput.value = item.desc;
  amountInput.value = item.amount;
  document.querySelector(`input[name='type'][value='${item.type}']`).checked = true;
}

// Delete
function deleteTransaction(id) {
  if (!confirm("Delete this transaction?")) return;
  transactions = transactions.filter(t => t.id !== id);
  saveAndRender();
}

// Totals
function calculateTotals() {
  const income = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  incomeEl.textContent = formatCurrency(income);
  expenseEl.textContent = formatCurrency(expense);
  balanceEl.textContent = formatCurrency(income - expense);
}

// Save + Render
function saveAndRender() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
  renderList();
}

// Initial Load
renderList();
