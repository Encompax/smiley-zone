// tokenPurchase.js
import { database } from "../utils/firebase-init.js";
import {
  ref,
  get,
  set,
  update,
  child
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// Simulated current user ID (replace this with Firebase Auth user ID if available)
const userId = localStorage.getItem("szaUserId") || generateGuestId();

// Generate and persist guest ID if none exists
function generateGuestId() {
  const id = "guest_" + Math.random().toString(36).substring(2, 10);
  localStorage.setItem("szaUserId", id);
  return id;
}

// Reference to user token balance in Firebase
const balanceRef = ref(database, `users/${userId}/tokens`);

// Update DOM balance
function updateBalanceDisplay(balance) {
  const balanceEl = document.getElementById("tokenBalance");
  if (balanceEl) {
    balanceEl.textContent = balance;
  }
}

// Fetch balance from Firebase
function fetchTokenBalance() {
  get(balanceRef).then((snapshot) => {
    const balance = snapshot.exists() ? snapshot.val() : 0;
    updateBalanceDisplay(balance);
  });
}

// Add purchased tokens
function addTokens(amount) {
  get(balanceRef).then((snapshot) => {
    const current = snapshot.exists() ? snapshot.val() : 0;
    const newTotal = current + amount;

    set(balanceRef, newTotal)
      .then(() => {
        updateBalanceDisplay(newTotal);
        alert(`✅ You received ${amount} tokens!`);
      })
      .catch((error) => {
        console.error("Token update failed:", error);
        alert("❌ Token purchase failed. Try again.");
      });
  });
}

// Attach listeners to purchase buttons
function initTokenPurchaseButtons() {
  const buttons = document.querySelectorAll(".token-option");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tokens = parseInt(btn.dataset.tokens);
      // NOTE: In production, this would trigger a payment processor (e.g. Stripe)
      const confirmPurchase = confirm(
        `Confirm purchase of ${tokens} tokens?`
      );
      if (confirmPurchase) {
        addTokens(tokens);
      }
    });
  });
}

// Initialize logic after page loads
window.addEventListener("DOMContentLoaded", () => {
  fetchTokenBalance();
  initTokenPurchaseButtons();
});
