// ============================================================
// The Wah Reading Room — Library Book Record Application
// ============================================================

const STORAGE_KEY = "libraryBooks";
const THEME_KEY = "libraryTheme";

const SPINE_COLORS = {
  "Fiction": "var(--spine-fiction)",
  "Non-Fiction": "var(--spine-nonfiction)",
  "Science": "var(--spine-science)",
  "History": "var(--spine-history)",
  "Other": "var(--spine-other)"
};

// ---- Element references ----
const bookForm = document.getElementById("bookForm");
const titleInput = document.getElementById("title");
const authorInput = document.getElementById("author");
const isbnInput = document.getElementById("isbn");
const categoryInput = document.getElementById("category");

const shelf = document.getElementById("shelf");
const emptyMessage = document.getElementById("emptyMessage");
const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");

const statTotal = document.getElementById("statTotal");
const statAvailable = document.getElementById("statAvailable");
const statIssued = document.getElementById("statIssued");
const statOverdue = document.getElementById("statOverdue");

const themeToggle = document.getElementById("themeToggle");

const issueModal = document.getElementById("issueModal");
const borrowerName = document.getElementById("borrowerName");
const dueDateInput = document.getElementById("dueDate");
const modalCancel = document.getElementById("modalCancel");
const modalConfirm = document.getElementById("modalConfirm");

let books = [];
let pendingIssueId = null;

// ---- Persistence ----
function loadBooks() {
  const stored = localStorage.getItem(STORAGE_KEY);
  books = stored ? JSON.parse(stored) : [];
}

function saveBooks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

// ---- Theme ----
function loadTheme() {
  const saved = localStorage.getItem(THEME_KEY) || "light";
  document.documentElement.setAttribute("data-theme", saved);
  themeToggle.textContent = saved === "dark" ? "◑" : "◐";
}

themeToggle.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem(THEME_KEY, next);
  themeToggle.textContent = next === "dark" ? "◑" : "◐";
});

// ---- Helpers ----
function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function isOverdue(book) {
  if (book.status !== "Issued" || !book.dueDate) return false;
  const today = new Date().toISOString().split("T")[0];
  return book.dueDate < today;
}

function todayPlus(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

// ---- Rendering ----
function render() {
  const query = searchInput.value.toLowerCase().trim();
  const statusValue = statusFilter.value;

  const visible = books.filter(book => {
    const matchesQuery =
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query);
    const matchesStatus = statusValue === "all" || book.status === statusValue;
    return matchesQuery && matchesStatus;
  });

  shelf.innerHTML = "";
  emptyMessage.style.display = visible.length === 0 ? "block" : "none";

  visible.forEach(book => {
    const overdue = isOverdue(book);
    const card = document.createElement("div");
    card.className = "book-card";

    const badgeHtml = overdue
      ? `<span class="badge badge-overdue">Overdue</span>`
      : book.status === "Available"
        ? `<span class="badge badge-available">On the shelf</span>`
        : `<span class="badge badge-issued">Checked out</span>`;

    const dueNoteHtml = book.status === "Issued" && book.dueDate
      ? `<p class="due-note">Due ${book.dueDate} &middot; ${escapeHtml(book.borrower || "Unknown")}</p>`
      : "";

    card.innerHTML = `
      <div class="spine" style="background:${SPINE_COLORS[book.category] || SPINE_COLORS.Other}"></div>
      <div class="book-body">
        <p class="book-title">${escapeHtml(book.title)}</p>
        <p class="book-author">${escapeHtml(book.author)}</p>
        <p class="book-isbn">ISBN ${escapeHtml(book.isbn)}</p>
        <div class="badge-row">${badgeHtml}<span class="book-isbn">${escapeHtml(book.category)}</span></div>
        ${dueNoteHtml}
      </div>
      <div class="card-actions">
        <button class="btn-toggle" data-action="toggle" data-id="${book.id}">
          ${book.status === "Available" ? "Check out" : "Return"}
        </button>
        <button class="btn-delete" data-action="delete" data-id="${book.id}">Delete</button>
      </div>
    `;

    shelf.appendChild(card);
  });

  updateStats();
}

function updateStats() {
  statTotal.textContent = books.length;
  statAvailable.textContent = books.filter(b => b.status === "Available").length;
  statIssued.textContent = books.filter(b => b.status === "Issued").length;
  statOverdue.textContent = books.filter(isOverdue).length;
}

// ---- Add book ----
bookForm.addEventListener("submit", e => {
  e.preventDefault();

  const newBook = {
    id: Date.now().toString(),
    title: titleInput.value.trim(),
    author: authorInput.value.trim(),
    isbn: isbnInput.value.trim(),
    category: categoryInput.value,
    status: "Available",
    borrower: "",
    dueDate: ""
  };

  if (!newBook.title || !newBook.author || !newBook.isbn) return;

  books.unshift(newBook);
  saveBooks();
  render();
  bookForm.reset();
  titleInput.focus();
});

// ---- Card actions (event delegation) ----
shelf.addEventListener("click", e => {
  const btn = e.target.closest("button");
  if (!btn) return;
  const id = btn.getAttribute("data-id");
  const action = btn.getAttribute("data-action");
  const book = books.find(b => b.id === id);
  if (!book) return;

  if (action === "delete") {
    books = books.filter(b => b.id !== id);
    saveBooks();
    render();
  }

  if (action === "toggle") {
    if (book.status === "Available") {
      openIssueModal(id);
    } else {
      book.status = "Available";
      book.borrower = "";
      book.dueDate = "";
      saveBooks();
      render();
    }
  }
});

// ---- Issue modal ----
function openIssueModal(id) {
  pendingIssueId = id;
  borrowerName.value = "";
  dueDateInput.value = todayPlus(14);
  issueModal.classList.remove("hidden");
  borrowerName.focus();
}

function closeIssueModal() {
  pendingIssueId = null;
  issueModal.classList.add("hidden");
}

modalCancel.addEventListener("click", closeIssueModal);

modalConfirm.addEventListener("click", () => {
  const book = books.find(b => b.id === pendingIssueId);
  if (!book) return closeIssueModal();

  book.status = "Issued";
  book.borrower = borrowerName.value.trim() || "Unknown";
  book.dueDate = dueDateInput.value || todayPlus(14);

  saveBooks();
  closeIssueModal();
  render();
});

issueModal.addEventListener("click", e => {
  if (e.target === issueModal) closeIssueModal();
});

// ---- Search & filter ----
searchInput.addEventListener("input", render);
statusFilter.addEventListener("change", render);

// ---- Init ----
loadTheme();
loadBooks();
render();

// Intentional syntax error for Assignment Step 9 (CI Failure Demonstration)
const triggerCIFailure = ;

