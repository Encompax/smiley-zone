
function getTokens() {
    return parseInt(localStorage.getItem("tokenBalance") || "0");
  }
  
  function setTokens(amount) {
    localStorage.setItem("tokenBalance", amount);
  }
  
  function addTokens(amount) {
    const current = getTokens();
    setToke
  ns(current + amount);
  }
  
  function spendTokens(amount) {
    const current = getTokens();
    if (current >= amount) {
      setTokens(current - amount);
      return true;
    } else {
      alert("Not enough tokens!");
      return false;
    }
  }
  
  // Optional: expose globally for other scripts to use
  window.getTokens = getTokens;
  window.setTokens = setTokens;
  window.addTokens = addTokens;
  window.spendTokens = spendTokens;
  