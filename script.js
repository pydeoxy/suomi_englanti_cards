let cards = [];
let currentCard = 0;
let isFront = true;

// Load CSV data
fetch('words.csv')
    .then(response => response.text())
    .then(data => {
        // Parse CSV
        const rows = data.split('\n').slice(1); // Skip header
        cards = rows.map(row => {
            const [finnish, english] = row.split(',');
            return {
                finnish: finnish.trim(),
                english: english.trim(),
                image: `images/${english.toLowerCase().replace(/ /g, '_')}.jpg`
            };
        }).filter(card => card.finnish && card.english);
        
        shuffleCards();
        showCard();
    });

function shuffleCards() {
    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }
}

function showCard() {
    const card = cards[currentCard];
    const imgElement = document.getElementById('front-image');
    const finnishText = document.getElementById('finnish-text');
    const englishText = document.getElementById('english-text');
    
    // Load image
    imgElement.src = card.image;
    imgElement.onerror = () => { 
        imgElement.style.display = 'none'; 
    };
    
    finnishText.textContent = card.finnish;
    englishText.textContent = card.english;
    document.getElementById('card').classList.remove('flipped');
    isFront = true;
}

document.getElementById('flip-btn').addEventListener('click', () => {
    document.getElementById('card').classList.toggle('flipped');
    isFront = !isFront;
});