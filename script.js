// ================================
// 🎉 Countdown
// ================================
const countdown = document.getElementById('countdown');
const eventDate = new Date('04/15/2026 22:00').getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const distance = eventDate - now;

    if (distance < 0) {
        countdown.innerHTML = "🎉 L'événement est arrivé ! 🎉";
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000*60*60));
    const minutes = Math.floor((distance % (1000*60*60)) / (1000*60));
    const seconds = Math.floor((distance % (1000*60)) / 1000);

    countdown.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
}
setInterval(updateCountdown, 1000);
updateCountdown(); // lancement immédiat

// ================================
// 💬 Messages d'amis
// ================================
const messageForm = document.getElementById('messageForm');
const messagesList = document.getElementById('messagesList');

if (messageForm && messagesList) {
    messageForm.addEventListener('submit', e => {
        e.preventDefault();
        const name = document.getElementById('name').value.trim();
        const message = document.getElementById('message').value.trim();

        if(name && message) {
            const messageDiv = document.createElement('div');
            messageDiv.innerHTML = `<strong>${name}:</strong> ${message}`;
            messagesList.appendChild(messageDiv);
            messageForm.reset();
            messagesList.scrollTop = messagesList.scrollHeight; // scroll auto
        }
    });
}

// ================================
// 🎬 Vidéo surprise
// ================================
const playButton = document.getElementById('playVideo');
const videoContainer = document.getElementById('videoContainer');

if (playButton && videoContainer) {
    playButton.addEventListener('click', () => {
        videoContainer.style.display = 'block';
        playButton.style.display = 'none';
    });
}

// ================================
// 🎊 Confettis en boucle
// ================================
function launchConfetti() {
    if(typeof confetti === "function") {
        confetti({ particleCount: 7, angle: 60, spread: 55, origin: { x: 0 } });
        confetti({ particleCount: 7, angle: 120, spread: 55, origin: { x: 1 } });
    }
}
setInterval(launchConfetti, 800);

// ================================
// 📧 Formulaire EmailJS
// ================================
if(emailjs && typeof emailjs.init === "function") {
    emailjs.init('service_rhgsonk'); // <-- Remplace par ton vrai User ID
}

const contactForm = document.getElementById('contact-form');
if(contactForm) {
    contactForm.addEventListener('submit', e => {
        e.preventDefault();
        emailjs.sendForm('service_rhgsonk', 'template_rhgsonk', contactForm)
            .then(() => {
                console.log('SUCCESS!');
                const successMsg = document.getElementById('success-message');
                if(successMsg) successMsg.style.display = 'block';
                contactForm.reset();
            }, err => {
                console.error('FAILED...', err);
                alert('Erreur d\'envoi. Réessaie ! 😢');
            });
    });
}
