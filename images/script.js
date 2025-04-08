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
    {
      fact: "Ancient Athens made it illegal to cut down olive trees—even on your own land.",
           images: ["images/cutdownolive.png"]
         },
     {
           fact: "A pope once resigned voluntarily in the 13th century and was imprisoned by his successor.",
           images: ["images/poperesign.png"]
         },
     {
          
      fact: "The shortest war in history, between Britain and Zanzibar, lasted just 38 minutes.",
           images: ["images/shortwar.png"]
         },
     {
           fact: "Cleopatra lived closer in time to the iPhone than to the building of the Great Pyramid.",
           images: ["images/cleophone.png"]
         },
     {
          
      fact: "Isaac Newton stuck a needle in his eye socket to study how light and vision worked.",
           images: ["images/isaacneedle.png"]
         },
     {
           fact: "After his death in 1955, Albert Einstein’s brain was removed—without his family’s permission—by the pathologist Thomas Harvey, who kept it in jars and later distributed pieces to researchers.",
           images: ["images/einbrain.png"]
         },
     {
          
      fact: "King Gustav III of Sweden was shot at a masquerade ball in 1792—an event that later inspired operas and films.",
           images: ["images/gustav.png"]
         },
    // Add more here
  ];
  
  function displayRandomFact() {
    const randomFactIndex = Math.floor(Math.random() * facts.length);
    const selectedFact = facts[randomFactIndex];
    
    const imageIndex = Math.floor(Math.random() * selectedFact.images.length);
    
    document.getElementById('fact-text').textContent = selectedFact.fact;
    document.getElementById('fact-image').src = selectedFact.images[imageIndex];
  }
  
  