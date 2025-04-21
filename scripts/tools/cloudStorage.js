// cloudStorage.js
import { getStorage, ref as storageRef, uploadBytes, listAll, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

// Initialize Firebase Storage
const storage = getStorage();

// DOM Elements
const fileInput = document.getElementById("fileUpload");
const uploadBtn = document.getElementById("uploadBtn");
const fileList = document.getElementById("fileList");
const status = document.getElementById("uploadStatus");

// Simulated user or session folder (can later use auth.uid)
const userFolder = localStorage.getItem("szaUserId") || generateUserId();

function generateUserId() {
  const id = "guest_" + Math.random().toString(36).substring(2, 10);
  localStorage.setItem("szaUserId", id);
  return id;
}

// Upload handler
function uploadFiles() {
  const files = fileInput.files;
  if (!files.length) {
    status.textContent = "⚠️ Please select a file to upload.";
    return;
  }

  Array.from(files).forEach((file) => {
    const fileRef = storageRef(storage, `sza-cloud/${userFolder}/${file.name}`);
    uploadBytes(fileRef, file)
      .then(() => {
        status.textContent = `✅ Uploaded: ${file.name}`;
        loadFileList(); // Refresh
      })
      .catch((err) => {
        console.error("Upload error:", err);
        status.textContent = `❌ Upload failed: ${file.name}`;
      });
  });
}

// Load uploaded files
function loadFileList() {
  const userRef = storageRef(storage, `sza-cloud/${userFolder}`);
  fileList.innerHTML = "<li>Loading...</li>";

  listAll(userRef)
    .then((res) => {
      fileList.innerHTML = "";
      if (res.items.length === 0) {
        fileList.innerHTML = "<li>No files uploaded yet.</li>";
      }

      res.items.forEach((itemRef) => {
        getDownloadURL(itemRef).then((url) => {
          const li = document.createElement("li");
          const link = document.createElement("a");
          link.href = url;
          link.textContent = itemRef.name;
          link.target = "_blank";

          li.appendChild(link);
          fileList.appendChild(li);
        });
      });
    })
    .catch((err) => {
      console.error("List error:", err);
      fileList.innerHTML = "<li>❌ Error loading file list.</li>";
    });
}

// Bind listeners
function initCloudStorage() {
  if (uploadBtn && fileInput) {
    uploadBtn.addEventListener("click", uploadFiles);
  }

  loadFileList(); // Initial load
}

// Initialize after DOM loads
window.addEventListener("DOMContentLoaded", initCloudStorage);
