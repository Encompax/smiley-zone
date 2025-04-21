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

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
