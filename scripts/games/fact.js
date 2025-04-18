window.initFact = function () {
  const facts = [
    { text: "Winston Churchill was once hit by a car in New York and apologized to the driver.", image: "winswreck.png" },
    { text: "Ancient Athens made it illegal to cut down olive trees—even on your own land.", image: "cutdownolive.png" },
    { text: "Napoleon was once attacked by a horde of bunnies during a hunting trip.", image: "naprabbit.png" },
    { text: "A pope once resigned voluntarily in the 13th century and was imprisoned by his successor.", image: "poperesign.png" },
    { text: "The shortest war in history, between Britain and Zanzibar, lasted just 38 minutes.", image: "shortwar.png" },
    { text: "Cleopatra lived closer in time to the iPhone than to the building of the Great Pyramid.", image: "cleophone.png" },
    { text: "Isaac Newton stuck a needle in his eye socket to study how light and vision worked.", image: "isaacneedle.png" },
    { text: "Einstein’s brain was removed without permission and stored in jars for research.", image: "einbrain.png" },
    { text: "King Gustav III of Sweden was shot at a masquerade ball in 1792.", image: "gustav.png" },
    { text: "The Eiffel Tower can grow up to 6 inches taller in summer due to metal expansion.", image: "eiffelsix.png" }
  ];

  const display = document.getElementById("factDisplay");
  const img = document.getElementById("factImage");
  const button = document.querySelector("button[onclick='generateFact()']');

  if (!display || !img || !button) {
    console.warn("⚠️ Missing DOM elements for fact game.");
    return;
  }

  function generateFact() {
    const f = facts[Math.floor(Math.random() * facts.length)];
    display.textContent = f.text;
    img.src = `images/${f.image}`;
    img.alt = f.text;
    img.style.display = "block";
  }

  window.generateFact = generateFact;
  button.onclick = generateFact;

  console.log("✅ Fact game initialized successfully.");
};


