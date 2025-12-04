/* ================================
   ✅ Compteur automatique (robuste)
   - Utilise day/month parsing (indépendant du timezone odd)
   - Gère "aujourd'hui" et passe immédiatement au suivant
   - Ajoute le bloc #countdown s'il n'existe pas
   - Affiche des logs pour aider au debug
   ================================ */

/* --- Création / style du bloc countdown si nécessaire --- */
(function createCountdownElement() {
    if (!document.getElementById('countdown')) {
        const countdown = document.createElement('div');
        countdown.id = 'countdown';
        // style de base (tu peux mettre ça dans style.css si tu veux)
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
        // place avant la grille du calendrier si possible
        const calendrier = document.querySelector('.calendrier');
        if (calendrier && calendrier.parentNode) {
            calendrier.parentNode.insertBefore(countdown, calendrier);
        } else {
            // sinon on l'insère après le header
            const header = document.querySelector('header');
            if (header && header.nextSibling) header.parentNode.insertBefore(countdown, header.nextSibling);
            else document.body.insertBefore(countdown, document.body.firstChild);
        }
    }
})();

/* --- Liste des anniversaires : utiliser format "JJ-MM" pour répétition annuelle --- */
const anniversaires = [
    { nom: "Charly", date: "15-03" },      // 15 Mars (toi)
    { nom: "Romane", date: "22-03" },
    { nom: "Telissa", date: "14-05" },
    { nom: "Manon", date: "14-05" },
    { nom: "Zoé", date: "04-06" },
    { nom: "Constance", date: "08-06" },
    { nom: "Hugo", date: "06-10" },
    { nom: "Zozo", date: "30-10" },
    { nom: "Matys", date: "30-11" },
];

/* Helper : transforme "JJ-MM" en Date pour l'année donnée */
function dateFromDayMonth(dayMonth, year) {
    const parts = dayMonth.split('-');
    if (parts.length !== 2) return null;
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // JS month 0-11
    return new Date(year, month, day, 0, 0, 0, 0);
}

/* Trouve le prochain anniversaire à partir d'aujourd'hui */
function getNextAnniversaire() {
    const now = new Date();
    const year = now.getFullYear();
    let prochain = null;

    anniversaires.forEach(a => {
        const dThisYear = dateFromDayMonth(a.date, year);
        if (!dThisYear) return;
        // si la date de cette année est déjà passée (strictement < maintenant), on prend l'année suivante
        let candidate = dThisYear;
        // compare date sans l'heure (on veut considérer "aujourd'hui" comme événement)
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0,0,0,0);
        const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23,59,59,999);

        if (candidate < todayStart) {
            candidate = dateFromDayMonth(a.date, year + 1);
        }

        // on garde le candidat le plus proche dans le futur
        if (!prochain || candidate < prochain.date) {
            prochain = { nom: a.nom, date: candidate };
        }
    });

    // sécurité : si aucun trouvé (liste vide), retourne null
    return prochain;
}

/* Récupère element countdown et commence le cycle */
const countdownEl = document.getElementById('countdown');
if (!countdownEl) {
    console.error('Element #countdown introuvable — le script ne peut pas afficher le compteur.');
}

// état global du prochain anniv
let prochainAnniv = getNextAnniversaire();
console.log('Prochain anniversaire initial :', prochainAnniv);

/* Met à jour l'affichage du countdown chaque seconde */
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

    // Cas "aujourd'hui"
    const sameDay = (now.getDate() === prochainAnniv.date.getDate() && now.getMonth() === prochainAnniv.date.getMonth() && now.getFullYear() === prochainAnniv.date.getFullYear());
    if (sameDay) {
        if (countdownEl) countdownEl.innerHTML = `🎉 C'est aujourd'hui l'anniversaire de <strong>${prochainAnniv.nom}</strong> ! 🎉`;
        // lance confettis si la fonction existe
        if (typeof confetti === 'function') {
            try { confetti({ particleCount: 120, spread: 120, origin: { y: 0.6 } }); } catch(e) { console.warn(e); }
        }
        // on attend 60s puis on recalcule le suivant pour éviter freeze sur "aujourd'hui"
        setTimeout(() => {
            prochainAnniv = getNextAnniversaire();
            console.log('Passage au prochain après aujourd\'hui :', prochainAnniv);
        }, 60 * 1000);
        return;
    }

    if (diff <= 0) {
        // edge-case : si diff négatif (peut arriver pour petites différences), on recalcule
        prochainAnniv = getNextAnniversaire();
        console.log('Recalcul suite à diff <= 0 :', prochainAnniv);
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000*60*60));
    const minutes = Math.floor((diff % (1000*60*60)) / (1000*60));
    const seconds = Math.floor((diff % (1000*60)) / 1000);

    if (countdownEl) {
        countdownEl.innerHTML = `
             <strong>${prochainAnniv.nom}</strong> — ${prochainAnniv.date.toLocaleDateString()}<br>
            ⏰ Dans ${days}j ${formatTimePart(hours)}h ${formatTimePart(minutes)}m ${formatTimePart(seconds)}s
        `;
    }
}

/* Lancement de l'interval */
updateCountdown();
const countdownInterval = setInterval(updateCountdown, 1000);

/* --- Confettis "preview" si <24h --- */
function launchConfettiPreview() {
    if (typeof confetti === 'function' && prochainAnniv) {
        const now = new Date();
        const diff = prochainAnniv.date - now;
        if (diff > 0 && diff < 24 * 60 * 60 * 1000) {
            try { confetti({ particleCount: 30, spread: 60, origin: { y: 0.6 } }); } catch(e) { console.warn(e); }
        }
    }
}
setInterval(launchConfettiPreview, 15 * 1000);

/* ================================
   Anciennes fonctionnalités (safe-checks)
   Elles n'exécutent une action que si l'élément existe — pas d'erreur si absent.
   ================================ */

/* Messages d'amis (optionnel) */
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
} else {
    console.log('messageForm ou messagesList non présent — section messages désactivée.');
}

/* Vidéo surprise (optionnel) */
const playButton = document.getElementById('playVideo');
const videoContainer = document.getElementById('videoContainer');
if (playButton && videoContainer) {
    playButton.addEventListener('click', () => {
        videoContainer.style.display = 'block';
        playButton.style.display = 'none';
    });
} else {
    console.log('Bouton vidéo ou container non détecté — vidéo désactivée.');
}

/* EmailJS safe init (optionnel) */
if (typeof emailjs !== 'undefined' && emailjs && typeof emailjs.init === 'function') {
    try { emailjs.init('service_rhgsonk'); } catch (e) { console.warn('EmailJS init failed', e); }
}
const contactForm = document.getElementById('contact-form');
if (contactForm && typeof emailjs !== 'undefined' && emailjs && typeof emailjs.sendForm === 'function') {
    contactForm.addEventListener('submit', e => {
        e.preventDefault();
        emailjs.sendForm('service_rhgsonk', 'template_rhgsonk', contactForm)
            .then(() => {
                const successMsg = document.getElementById('success-message');
                if (successMsg) successMsg.style.display = 'block';
                contactForm.reset();
            }).catch(err => {
                console.error('EmailJS send failed', err);
                alert('Erreur d\'envoi. Réessaie ! 😢');
            });
    });
} else {
    console.log('EmailJS non configuré ou contact-form absent — envoi désactivé.');
}

