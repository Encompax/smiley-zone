// cloudExport.js
import { getStorage, ref as storageRef, uploadBytes } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";
import { getDatabase, ref as dbRef, set } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// Firebase services
const storage = getStorage();
const database = getDatabase();

// DOM references
const sendToCloudBtn = document.getElementById("sendToCloud");
const editor = document.getElementById("editor");
const titleInput = document.getElementById("docTitle");

const userId = localStorage.getItem("szaUserId") || generateUserId();
function generateUserId() {
  const id = "guest_" + Math.random().toString(36).substring(2, 10);
  localStorage.setItem("szaUserId", id);
  return id;
}

// Main upload logic
function handleExportToCloud() {
  if (!titleInput.value.trim()) {
    alert("⚠️ Please enter a document title first.");
    return;
  }

  const format = prompt("📤 Export format (txt, doc, pdf):", "txt");
  if (!["txt", "doc", "pdf"].includes(format)) {
    alert("❌ Invalid format. Use txt, doc, or pdf.");
    return;
  }

  const description = prompt("✏️ Optional description of this document:", "");
  const tagString = prompt("🏷 Add tags (comma-separated):", "");
  const tags = tagString ? tagString.split(",").map(tag => tag.trim()) : [];

  const fileName = `${titleInput.value.trim().replace(/\s+/g, "_")}.${format}`;
  const filePath = `sza-cloud/${userId}/${fileName}`;
  const metadataPath = `users/${userId}/cloudFiles/${fileName.replace(/\./g, "_")}`;
  let blob;

  // Handle PDF generation async
  if (format === "pdf") {
    import("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js").then(({ jsPDF }) => {
      const pdf = new jsPDF();
      pdf.text(editor.innerText, 10, 10);
      const pdfBlob = pdf.output("blob");

      uploadToFirebase(filePath, pdfBlob, fileName, format, description, tags, metadataPath);
    });
    return;
  }

  if (format === "txt") {
    blob = new Blob([editor.innerText], { type: "text/plain" });
  } else if (format === "doc") {
    blob = new Blob(["<html><body>" + editor.innerHTML + "</body></html>"], {
      type: "application/msword"
    });
  }

  uploadToFirebase(filePath, blob, fileName, format, description, tags, metadataPath);
}

// Upload file & metadata
function uploadToFirebase(path, blob, fileName, format, description, tags, metadataPath) {
  const fileRef = storageRef(storage, path);
  uploadBytes(fileRef, blob)
    .then(() => {
      // Save metadata to Realtime DB
      const fileMeta = {
        title: fileName,
        format,
        description,
        tags,
        timestamp: Date.now()
      };
      return set(dbRef(database, metadataPath), fileMeta);
    })
    .then(() => {
      alert("✅ Uploaded and logged to cloud storage.");
      location.hash = "#yellow";
    })
    .catch((err) => {
      console.error(err);
      alert("❌ Upload failed.");
    });
}

// Init
window.addEventListener("DOMContentLoaded", () => {
  if (sendToCloudBtn) {
    sendToCloudBtn.addEventListener("click", handleExportToCloud);
  }
});
