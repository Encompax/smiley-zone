const facts = [
    {
      fact: "Napoleon was once attacked by rabbits during a celebratory hunt...",
      images: ["images/naprabbit.png"]
    },
    {
      fact: "Winston Churchill was once hit by a car in New York for looking the wrong way while crossing the street.",
      images: ["images/winswreck.png"]
    },
    {
      fact: "The Eiffel Tower grows over 6 inches taller during summer due to heat expansion.",
      images: ["images/eiffelsix.png"]
    },
    // Add more here
  ];
  
  function displayRandomFact() {
    const randomFact = facts[Math.floor(Math.random() * facts.length)];
    const image = randomFact.images[Math.floor(Math.random() * randomFact.images.length)];
    
    document.getElementById("fact-text").textContent = randomFact.fact;
    document.getElementById("fact-image").src = image;
  }
  