// docEditor.js
import { database } from "../utils/firebase-init.js";
import {
  ref,
  set,
  get,
  child,
  update
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// Simulated user ID (replace with auth.currentUser?.uid if using Firebase Auth)
const userId = localStorage.getItem("szaUserId") || generateUserId();

function generateUserId() {
  const id = "guest_" + Math.random().toString(36).substring(2, 10);
  localStorage.setItem("szaUserId", id);
  return id;
}

// DOM elements
const titleInput = document.getElementById("docTitle");
const editor = document.getElementById("editor");
const saveBtn = document.getElementById("saveDoc");

// Validate input
function validateInputs() {
  if (!titleInput.value.trim()) {
    alert("⚠️ Please enter a document title.");
    return false;
  }
  if (!editor.textContent.trim()) {
    alert("⚠️ Cannot save an empty document.");
    return false;
  }
  return true;
}

// Save document
function saveDocument() {
  if (!validateInputs()) return;

  const docData = {
    title: titleInput.value.trim(),
    content: editor.innerHTML,
    updated: Date.now()
  };

  const docRef = ref(database, `users/${userId}/docs/${docData.title}`);

  set(docRef, docData)
    .then(() => {
      alert("✅ Document saved successfully.");
    })
    .catch((error) => {
      console.error("Save failed:", error);
      alert("❌ Error saving document.");
    });
}

// Load existing document (optional feature)
function loadDocument(title) {
  const docRef = ref(database, `users/${userId}/docs/${title}`);

  get(docRef).then((snapshot) => {
    if (snapshot.exists()) {
      const doc = snapshot.val();
      titleInput.value = doc.title;
      editor.innerHTML = doc.content;
    } else {
      alert("⚠️ Document not found.");
    }
  });
}

// Bind save button
function bindEditorEvents() {
  if (saveBtn) {
    saveBtn.addEventListener("click", saveDocument);
  }

  // Optional: Load document from query string (e.g., #red?title=MeetingNotes)
  const hashParams = new URLSearchParams(window.location.hash.split("?")[1]);
  const titleToLoad = hashParams.get("title");
  if (titleToLoad) {
    loadDocument(titleToLoad);
  }
}

// Init on DOM load
window.addEventListener("DOMContentLoaded", bindEditorEvents);
