(() => {
  const db = firebase.database();
  const userId = localStorage.getItem("szaUserId") || "guest_" + Math.random().toString(36).substring(2, 10);
  localStorage.setItem("szaUserId", userId);

  const titleInput = () => document.getElementById("docTitle");
  const contentInput = () => document.getElementById("docContent");
  const saveBtn = () => document.getElementById("saveDocBtn");

  function saveToFirebase() {
    const title = titleInput()?.value.trim();
    const content = contentInput()?.value.trim();

    if (!title || !content) {
      alert("❗ Title and content cannot be empty.");
      return;
    }

    const docData = {
      title,
      content,
      timestamp: Date.now()
    };

    const newDocRef = db.ref(`users/${userId}/documents`).push();
    newDocRef.set(docData)
      .then(() => alert("✅ Document saved to cloud!"))
      .catch(err => console.error("❌ Failed to save document:", err));
  }

  document.addEventListener("DOMContentLoaded", () => {
    if (saveBtn()) {
      saveBtn().addEventListener("click", saveToFirebase);
    }
  });
})();