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

const bannerImg = document.createElement("img");
bannerImg.src = "images/smileyz-banner-horizontal.png"; // Make sure the path is correct
bannerImg.alt = "Smiley-Zone Banner";
bannerImg.style.maxWidth = "100%";
bannerImg.style.height = "auto";
bannerImg.style.margin = "1rem 0";

headerContainer.appendChild(bannerImg);
headerContainer.appendChild(userInfo);
headerContainer.appendChild(rightSide);
document.body.insertBefore(headerContainer, document.body.firstChild);

function updateHeader(user) {
  const loginBtn = document.getElementById("loginBtn");
  const signupBtn = document.getElementById("signupBtn");

  // 🎮 Show user greeting or guest prompt
  userInfo.innerHTML = user
    ? `🎮 <strong>${user.displayName || user.email}</strong>`
    : `🎮 <a href="#login" style="color: white;">Log in</a> or <a href="#signup" style="color: white;">create an account</a>`;

  // 👤 Show/hide login and signup buttons
  if (user) {
    if (loginBtn) loginBtn.style.display = "none";
    if (signupBtn) signupBtn.style.display = "none";
  } else {
    if (loginBtn) loginBtn.style.display = "inline-block";
    if (signupBtn) signupBtn.style.display = "inline-block";
  }

  // 🎯 Clear right-side container and rebuild (e.g., tokens, logout button)
  rightSide.innerHTML = "";

  if (user) {
    const tokenDisplay = document.createElement("span");
    tokenDisplay.id = "header-token-balance";
    tokenDisplay.style.marginRight = "1rem";
    tokenDisplay.textContent = "💰 Tokens: ...";
    rightSide.appendChild(tokenDisplay);

    const logoutBtn = document.createElement("button");
    logoutBtn.textContent = "🚪 Log Out";
    logoutBtn.style = "color: white; background-color: #ff6961; padding: 0.5rem 1rem; border: none; border-radius: 0.5rem; cursor: pointer;";
    logoutBtn.onclick = () => logoutUser();
    rightSide.appendChild(logoutBtn);
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