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
    const imgElement = document.getElementById('card-image');
    const textElement = document.getElementById('card-text');
    
    // Load image
    imgElement.src = card.image;
    imgElement.onerror = () => { 
        imgElement.style.display = 'none'; 
    };
    
    textElement.textContent = card.finnish;
    document.getElementById('card').classList.remove('flipped');
    isFront = true;
}

document.getElementById('flip-btn').addEventListener('click', () => {
    const card = cards[currentCard];
    const textElement = document.getElementById('card-text');
    const cardElement = document.getElementById('card');
    
    textElement.textContent = isFront ? card.english : card.finnish;
    cardElement.classList.toggle('flipped');
    isFront = !isFront;
});

document.getElementById('next-btn').addEventListener('click', () => {
    currentCard = (currentCard + 1) % cards.length;
    showCard();
});