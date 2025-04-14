
const facts = [
  { text: "Winston Churchill was once hit by a car in New York and apologized to the driver.", image: "churchill-hit-by-car.png" },
  { text: "Ancient Egyptians used slabs of stone as pillows.", image: "egyptian-stone-pillows.png" },
  { text: "Napoleon was once attacked by a horde of bunnies during a hunting trip.", image: "napoleon-vs-bunnies.png" },
  { text: "The Terracotta Army was discovered by farmers digging a well in 1974.", image: "terracotta-army-discovery.png" },
  { text: "During the Victorian era, people used to take photos with their deceased relatives.", image: "victorian-post-mortem.png" },
  { text: "The Eiffel Tower can grow up to 6 inches taller in summer due to metal expansion.", image: "eiffel-tower-summer.png" }
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
