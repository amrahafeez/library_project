# The Wah Reading Room — Library Book Record Application

[![CI/CD Pipeline](https://github.com/amrahafeez/library_project/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/amrahafeez/library_project/actions/workflows/ci-cd.yml)

A responsive, client-side Library Book Record web application built with vanilla **HTML5**, **CSS3**, and **JavaScript (ES6)**.

---

## Features

- **Book Catalog Management**: Add new books with title, author, ISBN, and category.
- **Checkout & Return System**: Issue books to borrowers with custom due dates, and mark books returned.
- **Real-Time Statistics**: Live counter showing total titles, books on shelf, checked out, and overdue titles.
- **Search & Filter**: Search books by title or author, and filter by status (*All*, *On the shelf*, *Checked out*).
- **Persistent Storage**: Retains catalogue state across sessions using browser `localStorage`.
- **Dynamic Theming**: Toggle between light and dark reading themes.
- **Responsive Layout**: Designed for seamless use across desktop and mobile viewports.

---

## DevOps & CI/CD Pipeline

This repository implements automated Continuous Integration and Continuous Deployment (CI/CD) via **GitHub Actions**:

1. **Automated CI Checks**:
   - Integrity validation for core application files (`index.html`, `style.css`, `script.js`).
   - JavaScript syntax checking (`node --check script.js`).
2. **Automated CD Deployment**:
   - Automatically builds and deploys the latest version from the `main` branch to **GitHub Pages**.

---

## Local Development & Testing

1. **Clone the repository**:
   ```bash
   git clone https://github.com/amrahafeez/library_project.git
   cd library_project
   ```

2. **Run locally**:
   - Open `index.html` in any modern web browser, or serve using a local server (e.g. VS Code Live Server or `npx serve`).

3. **Validate syntax**:
   ```bash
   node --check script.js
   ```

---

## Project Structure

```text
├── index.html              # Core application layout and semantic UI
├── style.css               # Styling, custom theme tokens & responsive design
├── script.js               # Application logic, state management & DOM bindings
├── .gitignore              # Git ignore configuration
└── .github/
    └── workflows/
        └── ci-cd.yml       # GitHub Actions CI/CD workflow
```
