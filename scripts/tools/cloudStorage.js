// cloudStorage.js
import { getStorage, ref as storageRef, uploadBytes, listAll, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";
import { getDatabase, ref as dbRef, get } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const storage = getStorage();
const database = getDatabase();

const fileInput = document.getElementById("fileUpload");
const uploadBtn = document.getElementById("uploadBtn");
const fileList = document.getElementById("fileList");
const status = document.getElementById("uploadStatus");
const searchInput = document.getElementById("fileSearch");

const expandAllBtn = document.createElement("button");
expandAllBtn.textContent = "🔎 Expand All Metadata";
expandAllBtn.style.margin = "1rem auto";
expandAllBtn.style.display = "block";
expandAllBtn.style.padding = "0.5rem 1rem";
expandAllBtn.style.borderRadius = "0.5rem";
expandAllBtn.style.border = "none";
expandAllBtn.style.background = "#ffd700";
expandAllBtn.style.cursor = "pointer";
expandAllBtn.style.fontWeight = "bold";

expandAllBtn.addEventListener("click", () => {
  document.querySelectorAll(".meta-details").forEach((el) => {
    el.style.display = "block";
  });
});

fileList.parentElement.insertBefore(expandAllBtn, fileList);

const userId = localStorage.getItem("szaUserId") || generateUserId();
function generateUserId() {
  const id = "guest_" + Math.random().toString(36).substring(2, 10);
  localStorage.setItem("szaUserId", id);
  return id;
}

function uploadFiles() {
  const files = fileInput.files;
  if (!files.length) {
    status.textContent = "⚠️ Please select a file to upload.";
    return;
  }

  Array.from(files).forEach((file) => {
    const fileRef = storageRef(storage, `sza-cloud/${userId}/${file.name}`);
    uploadBytes(fileRef, file)
      .then(() => {
        status.textContent = `✅ Uploaded: ${file.name}`;
        loadFileList();
      })
      .catch((err) => {
        console.error("Upload error:", err);
        status.textContent = `❌ Upload failed: ${file.name}`;
      });
  });
}

function loadFileList(filter = "") {
  const userFolder = storageRef(storage, `sza-cloud/${userId}`);
  const metaRef = dbRef(database, `users/${userId}/cloudFiles`);
  fileList.innerHTML = "<li>Loading files...</li>";

  Promise.all([listAll(userFolder), get(metaRef)]).then(([fileRes, metaSnap]) => {
    const metaData = metaSnap.exists() ? metaSnap.val() : {};
    fileList.innerHTML = "";

    if (fileRes.items.length === 0) {
      fileList.innerHTML = "<li>No files uploaded yet.</li>";
      return;
    }

    fileRes.items.forEach((itemRef) => {
      getDownloadURL(itemRef).then((url) => {
        const nameKey = itemRef.name.replace(/\./g, "_");
        const meta = metaData[nameKey] || {};

        const combinedText = `${itemRef.name} ${meta.description || ""} ${(meta.tags || []).join(" ")}`.toLowerCase();
        if (!combinedText.includes(filter.toLowerCase())) return;

        const li = document.createElement("li");
        const metaSection = document.createElement("div");
        metaSection.innerHTML = `
          ${meta.description ? `📝 ${meta.description}<br/>` : ""}
          ${meta.tags?.length ? `🏷 ${meta.tags.join(", ")}` : ""}
        `;
        metaSection.style.display = "none";
        metaSection.classList.add("meta-details");

        const toggleBtn = document.createElement("button");
        toggleBtn.textContent = "🔽 Metadata";
        toggleBtn.style.marginTop = "0.5rem";
        toggleBtn.onclick = () => {
          metaSection.style.display = metaSection.style.display === "none" ? "block" : "none";
        };

        li.innerHTML = `
          <strong>${itemRef.name}</strong><br/>
          <a href="${url}" target="_blank">🔗 Download</a><br/>
        `;

        li.appendChild(toggleBtn);
        li.appendChild(metaSection);
        fileList.appendChild(li);
      });
    });
  });
}

window.addEventListener("DOMContentLoaded", () => {
  if (uploadBtn && fileInput) {
    uploadBtn.addEventListener("click", uploadFiles);
  }
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      loadFileList(e.target.value);
    });
  }
  loadFileList();
});