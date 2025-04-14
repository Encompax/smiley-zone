
const facts = [
  { text: "Winston Churchill was once hit by a car in New York and apologized to the driver.", image: "winswreck.png" },
  { text: "Ancient Athens made it illegal to cut down olive trees—even on your own land.", image: "cutdownolive.png" },
  { text: "Napoleon was once attacked by a horde of bunnies during a hunting trip.", image: "naprabbit.png" },
  { text: "A pope once resigned voluntarily in the 13th century and was imprisoned by his successor.", image: "poperesign.png" },
  { text: "The shortest war in history, between Britain and Zanzibar, lasted just 38 minutes.", image: "shortwar.png" },
{ text: "Cleopatra lived closer in time to the iPhone than to the building of the Great Pyramid.", image: "cleophone.png" },
{ text: "Isaac Newton stuck a needle in his eye socket to study how light and vision worked.", image: "isaacneedle.png" },
{ text: "After his death in 1955, Albert Einstein’s brain was removed—without his family’s permission—by the pathologist Thomas Harvey, who kept it in jars and later distributed pieces to researchers.", image: "einbrain.png" },
{ text: "King Gustav III of Sweden was shot at a masquerade ball in 1792—an event that later inspired operas and films.", image: "gustav.png" },
  { text: "The Eiffel Tower can grow up to 6 inches taller in summer due to metal expansion.", image: "eiffelsix.png" }
];

function generateFact() {
  const randomIndex = Math.floor(Math.random() * facts.length);
  const selectedFact = facts[randomIndex];
  document.getElementById("factDisplay").textContent = selectedFact.text;
  const image = document.getElementById("factImage");
  image.src = "images/" + selectedFact.image;
  image.alt = selectedFact.text;
  image.style.display = "block";
}
