// scripts/utils/firebase-init.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBpiQAyL9ZUNxeRsSlB0DAc__uVxNyMRDU",
  authDomain: "smiley-zone-arcade.firebaseapp.com",
  databaseURL: "https://smiley-zone-arcade-default-rtdb.firebaseio.com", // You'll get this once DB is enabled
  projectId: "smiley-zone-arcade",
  storageBucket: "smiley-zone-arcade.appspot.com",
  messagingSenderId: "638687747467",
  appId: "1:638687747467:web:b2c96791c7dba00448a38e"
};
// 📩 INVITE MEMBER TO GROUP
window.inviteToGroup = async function (groupName) {
  const admin = auth.currentUser;
  if (!admin) {
    alert("⚠️ You must be logged in.");
    window.location.hash = "#login";
    return;
  }

  const inviteEmail = prompt("Enter the email of the user you want to invite:");
  if (!inviteEmail) return;

  try {
    // Step 1: Find the user by email
    const usersRef = db.collection("users");
    const querySnapshot = await usersRef.where("email", "==", inviteEmail).limit(1).get();

    if (querySnapshot.empty) {
      alert("❌ No user found with that email.");
      return;
    }

    const invitedUserDoc = querySnapshot.docs[0];
    const invitedUID = invitedUserDoc.id;

    // Step 2: Add user to group
    const groupRef = db.collection("groups").doc(groupName);
    await groupRef.update({
      members: firebase.firestore.FieldValue.arrayUnion(invitedUID),
      [`roles.${invitedUID}`]: "member"
    });

    // Step 3: Add group to invited user's profile
    await db.collection("users").doc(invitedUID).update({
      groups: firebase.firestore.FieldValue.arrayUnion(groupName)
    });

    alert(`✅ ${inviteEmail} has been invited to ${groupName}.`);
  } catch (err) {
    console.error("❌ Failed to invite user:", err);
    alert("Failed to invite user.");
  }
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
