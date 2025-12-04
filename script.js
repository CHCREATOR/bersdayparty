/* ================================
   ✅ Compteur automatique (robuste)
   ================================ */

/* --- Création / style du bloc countdown si nécessaire --- */
(function createCountdownElement() {
    if (!document.getElementById('countdown')) {
        const countdown = document.createElement('div');
        countdown.id = 'countdown';
        countdown.style.cssText = `
            font-family: 'Poppins', sans-serif;
            text-align: center;
            margin: 30px auto;
            padding: 18px 22px;
            border-radius: 14px;
            background: rgba(0,0,0,0.25);
            color: white;
            box-shadow: 0 12px 35px rgba(0,0,0,0.25);
            max-width: 900px;
            font-size: 1.25rem;
        `;
        const calendrier = document.querySelector('.calendrier');
        if (calendrier && calendrier.parentNode) {
            calendrier.parentNode.insertBefore(countdown, calendrier);
        } else {
            const header = document.querySelector('header');
            if (header && header.nextSibling) header.parentNode.insertBefore(countdown, header.nextSibling);
            else document.body.insertBefore(countdown, document.body.firstChild);
        }
    }
})();

/* --- Liste des anniversaires (JULIE SUPPRIMÉE) --- */
const anniversaires = [
    { nom: "Charly", date: "15-03" },
    { nom: "Romane", date: "22-03" },
    { nom: "Telissa", date: "14-05" },
    { nom: "Manon", date: "14-05" },
    { nom: "Zoé", date: "04-06" },
    { nom: "Constance", date: "08-06" },
    { nom: "Hugo", date: "06-10" },
    { nom: "Zozo", date: "30-10" },
    { nom: "Matys", date: "30-11" }
];

/* Helper : transforme "JJ-MM" en Date pour l'année donnée */
function dateFromDayMonth(dayMonth, year) {
    const parts = dayMonth.split('-');
    if (parts.length !== 2) return null;
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    return new Date(year, month, day, 0, 0, 0, 0);
}

/* Trouve le prochain anniversaire */
function getNextAnniversaire() {
    const now = new Date();
    const year = now.getFullYear();
    let prochain = null;

    anniversaires.forEach(a => {
        const dThisYear = dateFromDayMonth(a.date, year);
        if (!dThisYear) return;

        let candidate = dThisYear;
        const todayStart = new Date(year, now.getMonth(), now.getDate(), 0, 0, 0, 0);

        if (candidate < todayStart) {
            candidate = dateFromDayMonth(a.date, year + 1);
        }

        if (!prochain || candidate < prochain.date) {
            prochain = { nom: a.nom, date: candidate };
        }
    });

    return prochain;
}

const countdownEl = document.getElementById('countdown');
let prochainAnniv = getNextAnniversaire();
console.log('Prochain anniversaire :', prochainAnniv);

/* Mise à jour du compteur */
function formatTimePart(n) {
    return String(n).padStart(2, '0');
}

function updateCountdown() {
    if (!prochainAnniv) {
        if (countdownEl) countdownEl.innerHTML = 'Aucun anniversaire enregistré.';
        return;
    }

    const now = new Date();
    const diff = prochainAnniv.date - now;

    const sameDay =
        now.getDate() === prochainAnniv.date.getDate() &&
        now.getMonth() === prochainAnniv.date.getMonth() &&
        now.getFullYear() === prochainAnniv.date.getFullYear();

    if (sameDay) {
        countdownEl.innerHTML = `🎉 C'est aujourd'hui l'anniversaire de <strong>${prochainAnniv.nom}</strong> ! 🎉`;
        if (typeof confetti === 'function') {
            try { confetti({ particleCount: 120, spread: 120, origin: { y: 0.6 } }); } catch(e) {}
        }
        setTimeout(() => {
            prochainAnniv = getNextAnniversaire();
        }, 60000);
        return;
    }

    if (diff <= 0) {
        prochainAnniv = getNextAnniversaire();
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000*60*60));
    const minutes = Math.floor((diff % (1000*60*60)) / (1000*60));
    const seconds = Math.floor((diff % (1000*60)) / 1000);

    countdownEl.innerHTML = `
         <strong>${prochainAnniv.nom}</strong> — ${prochainAnniv.date.toLocaleDateString()}<br>
        ⏰ Dans ${days}j ${formatTimePart(hours)}h ${formatTimePart(minutes)}m ${formatTimePart(seconds)}s
    `;
}

updateCountdown();
setInterval(updateCountdown, 1000);

/* Confettis preview */
function launchConfettiPreview() {
    if (typeof confetti === 'function' && prochainAnniv) {
        const now = new Date();
        const diff = prochainAnniv.date - now;
        if (diff > 0 && diff < 86400000) {
            try { confetti({ particleCount: 30, spread: 60, origin: { y: 0.6 } }); } catch(e) {}
        }
    }
}
setInterval(launchConfettiPreview, 15000);

/* Messages d'amis */
const messageForm = document.getElementById('messageForm');
const messagesList = document.getElementById('messagesList');
if (messageForm && messagesList) {
    messageForm.addEventListener('submit', e => {
        e.preventDefault();
        const name = (document.getElementById('name') || {}).value || 'Anonyme';
        const message = (document.getElementById('message') || {}).value || '';
        if (message.trim() === '') return;
        const div = document.createElement('div');
        div.innerHTML = `<strong>${name}:</strong> ${message}`;
        messagesList.appendChild(div);
        messageForm.reset();
        messagesList.scrollTop = messagesList.scrollHeight;
    });
}

/* Vidéo surprise */
const playButton = document.getElementById('playVideo');
const videoContainer = document.getElementById('videoContainer');
if (playButton && videoContainer) {
    playButton.addEventListener('click', () => {
        videoContainer.style.display = 'block';
        playButton.style.display = 'none';
    });
}

/* EmailJS */
if (typeof emailjs !== 'undefined' && typeof emailjs.init === 'function') {
    try { emailjs.init('service_rhgsonk'); } catch (e) {}
}
const contactForm = document.getElementById('contact-form');
if (contactForm && typeof emailjs !== 'undefined' && typeof emailjs.sendForm === 'function') {
    contactForm.addEventListener('submit', e => {
        e.preventDefault();
        emailjs.sendForm('service_rhgsonk', 'template_rhgsonk', contactForm)
            .then(() => {
                const successMsg = document.getElementById('success-message');
                if (successMsg) successMsg.style.display = 'block';
                contactForm.reset();
            }).catch(() => {
                alert('Erreur d\'envoi.');
            });
    });
}
