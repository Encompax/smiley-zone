// scripts/firebase-init.js (Firestore-based, full UID integration)

// 🔐 Your Firebase Project Config (replace with actual values)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
  };
  
  // 🔧 Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const db = firebase.firestore();
  
  // ✅ Global UID handler
  let currentUserUID = null;
  auth.onAuthStateChanged(async (user) => {
    if (user) {
      currentUserUID = user.uid;
      console.log("✅ Authenticated UID:", currentUserUID);
      if (typeof initUser === "function") initUser();
    } else {
      currentUserUID = null;
    }
  });
  
  // 📝 SIGNUP FUNCTION
  window.handleSignup = async function () {
    const name = document.getElementById("signupName").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value;
  
    try {
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;
  
      await db.collection("users").doc(user.uid).set({
        name,
        email,
        tokens: 0,
        highScores: {},
        purchases: [],
        documents: [],
        groups: [],
        createdAt: Date.now()
      });
  
      alert("✅ Account created!");
      window.location.hash = "#user";
    } catch (error) {
      console.error("❌ Signup error:", error);
      alert(error.message);
    }
  };
  
  // 🔐 LOGIN FUNCTION
  window.handleLogin = async function () {
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;
  
    try {
      await auth.signInWithEmailAndPassword(email, password);
      alert("✅ Logged in!");
      window.location.hash = "#user";
    } catch (error) {
      console.error("❌ Login error:", error);
      alert(error.message);
    }
  };
  
  // 🚪 LOGOUT FUNCTION
  window.logoutUser = async function () {
    await auth.signOut();
    alert("🚪 Logged out!");
    window.location.hash = "#home";
  };
  
  // 💾 SAVE USER PROFILE
  window.saveUserProfile = async function () {
    const user = auth.currentUser;
    if (!user) {
      alert("⚠️ You must be logged in to save your profile.");
      window.location.hash = "#login";
      return;
    }
  
    const name = document.getElementById("userName").value.trim();
    const bio = document.getElementById("userBio").value.trim();
  
    try {
      await db.collection("users").doc(user.uid).set({
        name,
        bio,
        updatedAt: Date.now()
      }, { merge: true });
  
      alert("✅ Profile saved!");
      if (typeof initUser === "function") initUser();
    } catch (err) {
      console.error("❌ Failed to save profile:", err);
      alert("Failed to save profile.");
    }
  };
  
  // 🔄 INIT USER PROFILE VIEW
  window.initUser = async function () {
    const user = auth.currentUser;
    if (!user) return;
  
    try {
      const doc = await db.collection("users").doc(user.uid).get();
      if (!doc.exists) return;
      const data = doc.data();
  
      document.getElementById("userName").value = data.name || "";
      document.getElementById("userBio").value = data.bio || "";
      document.getElementById("userEmail").textContent = user.email || "N/A";
      document.getElementById("userTokens").textContent = data.tokens ?? 0;
      document.getElementById("tokenBalance").textContent = data.tokens ?? 0;
  
      const highScoresEl = document.getElementById("userHighScores");
      highScoresEl.innerHTML = "";
      for (const [game, score] of Object.entries(data.highScores || {})) {
        highScoresEl.innerHTML += `<li>${game}: ${score}</li>`;
      }
  
      const purchasesEl = document.getElementById("userPurchases");
      purchasesEl.innerHTML = "";
      for (const item of data.purchases || []) {
        purchasesEl.innerHTML += `<li>${item}</li>`;
      }
  
      const documentsEl = document.getElementById("userDocuments");
      documentsEl.innerHTML = "";
      for (const docId of data.documents || []) {
        documentsEl.innerHTML += `<li>${docId}</li>`;
      }
  
      const groupsEl = document.getElementById("userGroupList");
      groupsEl.innerHTML = "";
      for (const group of data.groups || []) {
        const li = document.createElement("li");
        li.textContent = group;
        groupsEl.appendChild(li);
      }
  
    } catch (err) {
      console.error("❌ Error loading user profile:", err);
    }
  };