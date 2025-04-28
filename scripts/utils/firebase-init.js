// scripts/firebase-init.js (Firestore-based, full UID integration)

// 🔐 Your Firebase Project Config (replace with actual values)
const firebaseConfig = {
  apiKey: "AIzaSyC2B6MaIwuzSNPbCIfvDu3cfGC6vtweeDs",
  authDomain: "smiley-zone-arcade.firebaseapp.com",
  projectId: "smiley-zone-arcade",
  storageBucket: "smiley-zone-arcade.appspot.com",
  messagingSenderId: "638687747467",
  appId: "1:638687747467:web:b2c96791c7dba00448a38e"
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

// 💬 SEND GROUP CHAT MESSAGE
window.sendGroupMessage = async function (groupName, messageText) {
  const user = auth.currentUser;
  if (!user || !groupName || !messageText) return;

  try {
    await db.collection("groups").doc(groupName).collection("messages").add({
      sender: user.uid,
      text: messageText,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
  } catch (err) {
    console.error("❌ Failed to send message:", err);
  }
};

// 🔁 LOAD GROUP CHAT MESSAGES
window.loadGroupMessages = async function (groupName, renderCallback) {
  const messagesRef = db.collection("groups").doc(groupName).collection("messages").orderBy("timestamp", "asc");
  messagesRef.onSnapshot((snapshot) => {
    const messages = [];
    snapshot.forEach((doc) => messages.push(doc.data()));
    renderCallback(messages);
  });
};

// 👥 LOAD GROUP MEMBERS & ROLES
window.loadGroupMembers = async function (groupName, renderCallback) {
  try {
    const groupDoc = await db.collection("groups").doc(groupName).get();
    if (!groupDoc.exists) return;
    const groupData = groupDoc.data();

    const roles = groupData.roles || {};
    const members = groupData.members || [];

    const userDocs = await Promise.all(members.map(uid => db.collection("users").doc(uid).get()));
    const detailedMembers = userDocs.map(doc => ({
      uid: doc.id,
      name: doc.data().name || "(no name)",
      role: roles[doc.id] || "member"
    }));

    renderCallback(detailedMembers);
  } catch (err) {
    console.error("❌ Failed to load group members:", err);
  }
};

// 🚫 REMOVE GROUP MEMBER (Admin only)
window.removeGroupMember = async function (groupName, memberUID) {
  const user = auth.currentUser;
  if (!user || !groupName || !memberUID) return;

  const groupRef = db.collection("groups").doc(groupName);
  const groupDoc = await groupRef.get();
  const groupData = groupDoc.data();

  if (groupData.roles[user.uid] !== "admin") {
    alert("🚫 Only admins can remove members.");
    return;
  }

  try {
    await groupRef.update({
      members: firebase.firestore.FieldValue.arrayRemove(memberUID),
      [`roles.${memberUID}`]: firebase.firestore.FieldValue.delete()
    });
    alert("✅ Member removed.");
  } catch (err) {
    console.error("❌ Failed to remove member:", err);
  }
};
