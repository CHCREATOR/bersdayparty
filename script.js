// Countdown
const countdown = document.getElementById('countdown');
const eventDate = new Date('05/05/2026 22:00').getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const distance = eventDate - now;

    if (distance < 0) {
        countdown.innerHTML = "Bientôt";
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    countdown.innerHTML = `${day}d  ${hours}h    ${minutes}m    ${seconds}s`;

    //${hours}h  :  ${minutes}m  :  ${seconds}s
}
setInterval(updateCountdown, 1000);

// Messages d'amis
const messageForm = document.getElementById('messageForm');
const messagesList = document.getElementById('messagesList');

messageForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const message = document.getElementById('message').value;

    const messageDiv = document.createElement('div');
    messageDiv.innerHTML = `<strong>${name}:</strong> ${message}`;
    messagesList.appendChild(messageDiv);

    messageForm.reset();
});

// Vidéo surprise
const playButton = document.getElementById('playVideo');
const videoContainer = document.getElementById('videoContainer');

if (playButton) {
  playButton.addEventListener('click', function() {
    videoContainer.style.display = 'block';
    playButton.style.display = 'none';
});
}

// Confettis en boucle
function launchConfetti() {
    confetti({
        particleCount: 7,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
    });
    confetti({
        particleCount: 7,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
    });
}
setInterval(launchConfetti, 800);

// Initialise EmailJS
emailjs.init('service_rhgsonk'); // <-- Mets ton vrai User ID EmailJS ici

const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', function(e) {
    e.preventDefault();

    emailjs.sendForm('service_rhgsonk', 'service_rhgsonk', this)
        .then(function() {
            console.log('SUCCESS!');
            document.getElementById('success-message').style.display = 'block';
            contactForm.reset();
        }, function(error) {
            console.log('FAILED...', error);
            alert('Erreur d\'envoi. Réessaie ! 😢');
        });
});
