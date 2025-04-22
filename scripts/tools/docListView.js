// docListView.js
import { database } from "../utils/firebase-init.js";
import {
  ref,
  get,
  child
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const userId = localStorage.getItem("szaUserId");
const listContainer = document.createElement("div");
listContainer.className = "doc-list";
listContainer.innerHTML = `<h3>🗂 Saved Documents</h3><ul id="docList"></ul>`;
document.querySelector(".red-docs").prepend(listContainer);

// Load all saved documents for current user
function loadDocList() {
  const listRef = ref(database, `users/${userId}/docs`);
  const ul = document.getElementById("docList");

  get(listRef).then((snapshot) => {
    if (!snapshot.exists()) {
      ul.innerHTML = "<li>No saved documents yet.</li>";
      return;
    }

    ul.innerHTML = "";
    const docs = snapshot.val();

    Object.keys(docs).forEach((title) => {
      const li = document.createElement("li");
      const btn = document.createElement("button");
      btn.textContent = `📄 ${title}`;
      btn.addEventListener("click", () => loadDoc(title));
      li.appendChild(btn);
      ul.appendChild(li);
    });
  });
}

// Load document into editor
function loadDoc(title) {
  const titleInput = document.getElementById("docTitle");
  const editor = document.getElementById("editor");
  const docRef = ref(database, `users/${userId}/docs/${title}`);

  get(docRef).then((snapshot) => {
    if (snapshot.exists()) {
      const doc = snapshot.val();
      titleInput.value = doc.title;
      editor.innerHTML = doc.content;
    }
  });
}

window.addEventListener("DOMContentLoaded", loadDocList);
