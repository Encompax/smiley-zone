// scripts/firebase-init.js

// 🔐 Your Firebase Project Config (replace with yours)
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
  
  // 📝 SIGNUP FUNCTION
  window.handleSignup = async function () {
    const name = document.getElementById("signupName").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value;
  
    try {
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;
  
      // Store profile in Firestore
      await db.collection("users").doc(user.uid).set({
        name,
        email,
        tokens: 0,
        highScores: {},
        purchases: [],
        documents: []
      });
  
      alert("✅ Account created!");
      window.location.hash = "#user"; // Redirect to profile
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
      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      const user = userCredential.user;
  
      alert("✅ Logged in!");
      window.location.hash = "#user";
    } catch (error) {
      console.error("❌ Login error:", error);
      alert(error.message);
    }
  };
  
  // 🚪 OPTIONAL: Logout function
  window.logoutUser = async function () {
    await auth.signOut();
    alert("🚪 Logged out!");
    window.location.hash = "#home";
  };
  