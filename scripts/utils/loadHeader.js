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

  userInfo.innerHTML = "";

  // Clear right-side container (e.g., logout, token display)
  rightSide.innerHTML = "";

  if (user) {
    // Hide login/signup buttons
    if (loginBtn) loginBtn.style.display = "none";
    if (signupBtn) signupBtn.style.display = "none";

    // Create dropdown container
    const dropdownWrapper = document.createElement("div");
    dropdownWrapper.className = "user-dropdown";

    // Create label (username or email)
    const userLabel = document.createElement("button");
    userLabel.className = "dropdown-toggle";
    userLabel.textContent = user.displayName || user.email;

    // Toggle dropdown visibility
    userLabel.onclick = () => {
      dropdownMenu.classList.toggle("show");
    };

    // Create dropdown menu
    const dropdownMenu = document.createElement("div");
    dropdownMenu.className = "dropdown-menu";

    // Token Display (optional)
    const tokenDisplay = document.createElement("div");
    tokenDisplay.id = "header-token-balance";
    tokenDisplay.textContent = "🎟 Tokens: 0"; // Will be dynamically updated
    tokenDisplay.className = "dropdown-item";
    dropdownMenu.appendChild(tokenDisplay);

    // Logout Button
    const logoutBtn = document.createElement("button");
    logoutBtn.textContent = "🚪 Logout";
    logoutBtn.className = "dropdown-item";
    logoutBtn.onclick = () => firebase.auth().signOut();
    dropdownMenu.appendChild(logoutBtn);

    // Append to wrapper
    dropdownWrapper.appendChild(userLabel);
    dropdownWrapper.appendChild(dropdownMenu);
    userInfo.appendChild(dropdownWrapper);
  } else {
    // Show login/signup
    if (loginBtn) loginBtn.style.display = "inline-block";
    if (signupBtn) signupBtn.style.display = "inline-block";

    userInfo.innerHTML = `
      <a href="#login" style="color: white;">Log in</a> or 
      <a href="#signup" style="color: white;">Create an account</a>
    `;
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