const headerContainer = document.createElement("div");
headerContainer.id = "site-header";
headerContainer.style.cssText = `
  background-color: #1E90FF;
  color: white;
  padding: 0.75rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 999;
  font-family: 'Baloo 2', cursive;
`;


const rightSide = document.createElement("div");
rightSide.style.display = "flex";
rightSide.style.alignItems = "center";
rightSide.style.gap = "1rem";

const userInfo = document.createElement("div");
userInfo.style.fontSize = "1rem";

headerContainer.appendChild(bannerImg);
headerContainer.appendChild(userInfo);
headerContainer.appendChild(rightSide);
document.body.insertBefore(headerContainer, document.body.firstChild);

function updateHeader(user) {
  userInfo.innerHTML = user
    ? `👋 Welcome, <strong>${user.displayName || user.email}</strong>`
    : "🎮 Welcome to Smiley-Zone Arcade!";

  rightSide.innerHTML = "";

  if (user) {
    const tokenDisplay = document.createElement("span");
    tokenDisplay.id = "header-token-balance";
    tokenDisplay.style.marginRight = "1rem";
    tokenDisplay.textContent = `💰 Tokens: ...`;

    const logoutBtn = document.createElement("button");
    logoutBtn.textContent = "🚪 Log Out";
    logoutBtn.onclick = () => logoutUser();
    logoutBtn.style.cssText =
      "background-color: #ffd966; border: none; padding: 0.5rem 1rem; border-radius: 0.5rem; cursor: pointer; font-weight: bold;";

    rightSide.appendChild(tokenDisplay);
    rightSide.appendChild(logoutBtn);
  } else {
    const loginBtn = document.createElement("a");
    loginBtn.href = "#login";
    loginBtn.textContent = "🔐 Log In";
    loginBtn.style.cssText =
      "color: white; background-color: #ffd966; padding: 0.5rem 1rem; border-radius: 0.5rem; text-decoration: none; font-weight: bold;";
    rightSide.appendChild(loginBtn);
  }
}

// ✅ Ensure Firebase is initialized first
if (typeof firebase !== "undefined" && firebase.auth) {
  firebase.auth().onAuthStateChanged(async (user) => {
    updateHeader(user);

    if (user) {
      try {
        const doc = await firebase.firestore().collection("users").doc(user.uid).get();
        const data = doc.data();
        const headerToken = document.getElementById("header-token-balance");
        if (headerToken && data.tokens !== undefined) {
          headerToken.textContent = `💰 Tokens: ${data.tokens}`;
        }
      } catch (err) {
        console.warn("⚠️ Unable to load token balance for header:", err);
      }
    }
  });
} else {
  console.warn("⚠️ Firebase not available yet.");
}


  