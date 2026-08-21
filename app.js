/* ============================================================
   APP.JS — LE MOTEUR
   ============================================================
   Ce fichier lit CONFIG (défini dans config.js) et fait tourner
   l'interface. Tu n'as normalement pas besoin d'y toucher pour
   personnaliser l'assistant — modifie plutôt config.js.

   Si tu veux étendre les fonctionnalités (nouvelles commandes,
   nouveaux outils, etc.), les points d'extension marqués
   "🔧 EXTENSION" ci-dessous sont faits pour ça.
   ============================================================ */
if (!window.CONFIG) {
  throw new Error(
    "CONFIG n'a pas été chargé. Vérifie que config.js est bien présent."
  );
}

const CONFIG = window.CONFIG;
const etat = {
  messages: [] // { role: "user" | "bot", type: "texte" | "image", contenu: string }
};

/* ---------- Références DOM ---------- */
const filChat = document.getElementById("filChat");
const champSaisie = document.getElementById("champSaisie");
const btnEnvoyer = document.getElementById("btnEnvoyer");
const btnEmoji = document.getElementById("btnEmoji");
const btnImage = document.getElementById("btnImage");
const emojiPicker = document.getElementById("emojiPicker");
const btnParametres = document.getElementById("btnParametres");
const panneauParametres = document.getElementById("panneauParametres");
const selectModeChat = document.getElementById("selectModeChat");
const selectModeImage = document.getElementById("selectModeImage");

/* ============================================================
   INITIALISATION — applique CONFIG à l'interface
   ============================================================ */
function initialiser() {
  appliquerApparence();

  document.getElementById("avatar").textContent = CONFIG.assistant.avatarEmoji;
  document.getElementById("nomAssistant").textContent = CONFIG.assistant.nom;
  document.title = CONFIG.assistant.nom;

  selectModeChat.value = CONFIG.chat.mode;
  selectModeImage.value = CONFIG.image.mode;
  majStatut();

  construireEmojiPicker();

  ajouterMessage("bot", "texte", CONFIG.assistant.messageAccueil);
}

/* Applique les couleurs/formes/polices de CONFIG.apparence aux variables CSS */
function appliquerApparence() {
  const a = CONFIG.apparence;
  if (!a) return;
  const racine = document.documentElement.style;

  const c = a.couleurs || {};
  if (c.fond) racine.setProperty("--bg", c.fond);
  if (c.panneau) racine.setProperty("--panel", c.panneau);
  if (c.texte) racine.setProperty("--ink", c.texte);
  if (c.texteAtténué) racine.setProperty("--ink-soft", c.texteAtténué);
  if (c.bordure) racine.setProperty("--line", c.bordure);
  if (c.accentPrincipal) racine.setProperty("--pine", c.accentPrincipal);
  if (c.accentPrincipalFonce) racine.setProperty("--pine-deep", c.accentPrincipalFonce);
  if (c.accentSecondaire) racine.setProperty("--violet", c.accentSecondaire);
  if (c.bulleBot) racine.setProperty("--bubble-bot", c.bulleBot);
  if (c.bulleUtilisateur) racine.setProperty("--bubble-user", c.bulleUtilisateur);
  if (c.texteBulleUtilisateur) racine.setProperty("--bubble-user-ink", c.texteBulleUtilisateur);

  const f = a.formes || {};
  if (f.rayonCoins) racine.setProperty("--radius", f.rayonCoins);

  const p = a.polices || {};
  if (p.titres) racine.setProperty("--police-titres", p.titres);
  if (p.texte) racine.setProperty("--police-texte", p.texte);
  if (p.statutEtCode) racine.setProperty("--police-code", p.statutEtCode);
}

/* ============================================================
AFFICHAGE DES MESSAGES
function majStatut() {
  document.getElementById("statutMode").textContent =
    `chat: ${CONFIG.chat.mode} · image: ${CONFIG.image.mode}`;
}

/* ============================================================
   AFFICHAGE DES MESSAGES
   ============================================================ */
function ajouterMessage(role, type, contenu) {
  etat.messages.push({ role, type, contenu });

  const bulle = document.createElement("div");
  bulle.className = `msg msg--${role}`;

  if (type === "image") {
    const img = document.createElement("img");
    img.src = contenu;
    img.alt = "Image générée";
    bulle.appendChild(img);
  } else {
    bulle.textContent = contenu;
  }

  filChat.appendChild(bulle);
  filChat.scrollTop = filChat.scrollHeight;
  return bulle;
}

function afficherEnCoursDeFrappe() {
  const bulle = document.createElement("div");
  bulle.className = "msg msg--bot msg--typing";
  bulle.textContent = "…";
  bulle.id = "indicateurFrappe";
  filChat.appendChild(bulle);
  filChat.scrollTop = filChat.scrollHeight;
}

function retirerEnCoursDeFrappe() {
  const el = document.getElementById("indicateurFrappe");
  if (el) el.remove();
}

/* ============================================================
   ENVOI D'UN MESSAGE TEXTE
   ============================================================ */
async function envoyerMessage() {
  const texte = champSaisie.value.trim();
  if (!texte) return;

  ajouterMessage("user", "texte", texte);
  champSaisie.value = "";
  ajusterHauteurSaisie();
  btnEnvoyer.disabled = true;
  afficherEnCoursDeFrappe();

  try {
    const reponse = await obtenirReponseChat(texte);
    retirerEnCoursDeFrappe();
    ajouterMessage("bot", "texte", reponse);
  } catch (err) {
    retirerEnCoursDeFrappe();
    ajouterMessage("bot", "texte", `⚠️ Erreur : ${err.message}`);
  } finally {
    btnEnvoyer.disabled = false;
  }
}

/* ============================================================
   🔧 EXTENSION — MOTEUR DE CHAT
   Deux modes : "demo" (aucune config) et "api" (ta vraie API).
   ============================================================ */
async function obtenirReponseChat(texte) {
  if (CONFIG.chat.mode === "demo") {
    return reponseDemo(texte);
  }

  if (CONFIG.chat.mode === "api") {
    const res = await fetch(CONFIG.chat.api.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        modele: CONFIG.chat.api.modele,
        promptSysteme: CONFIG.assistant.promptSysteme,
        messages: etat.messages
          .filter(m => m.type === "texte")
          .map(m => ({ role: m.role === "user" ? "user" : "assistant", contenu: m.contenu }))
      })
    });
    if (!res.ok) throw new Error(`Le serveur relais a répondu ${res.status}`);
    const data = await res.json();
    // Adapte cette ligne au format que renvoie TON relais
    return data.reponse ?? data.message ?? JSON.stringify(data);
  }

  throw new Error(`Mode de chat inconnu : ${CONFIG.chat.mode}`);
}

/* Réponses simulées, juste pour tester l'interface sans rien brancher */
function reponseDemo(texte) {
  const t = texte.toLowerCase();
  if (t.includes("bonjour") || t.includes("salut")) {
    return "Salut ! (Ceci est une réponse de démo — branche une vraie API dans config.js pour des réponses réelles.)";
  }
  if (t.includes("image") || t.includes("dessine")) {
    return "Pour générer une image, clique plutôt sur le bouton 🎨 juste à côté du champ de texte !";
  }
  return `Mode démo : j'ai bien reçu « ${texte} ». Configure CONFIG.chat.mode = "api" (dans config.js) pour de vraies réponses IA.`;
}

/* ============================================================
   GÉNÉRATION D'IMAGES
   ============================================================ */
async function genererImage() {
  const prompt = window.prompt("Décris l'image à générer :");
  if (!prompt) return;

  ajouterMessage("user", "texte", `🎨 ${prompt}`);
  afficherEnCoursDeFrappe();

  try {
    const url = await obtenirUrlImage(prompt);
    retirerEnCoursDeFrappe();
    ajouterMessage("bot", "image", url);
  } catch (err) {
    retirerEnCoursDeFrappe();
    ajouterMessage("bot", "texte", `⚠️ Erreur image : ${err.message}`);
  }
}

/* 🔧 EXTENSION — MOTEUR D'IMAGES */
async function obtenirUrlImage(prompt) {
  if (CONFIG.image.mode === "pollinations") {
    // Gratuit, open source, sans clé API — fonctionne immédiatement.
    return CONFIG.image.pollinations.construireUrl(prompt);
  }

  if (CONFIG.image.mode === "api") {
    const res = await fetch(CONFIG.image.api.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });
    if (!res.ok) throw new Error(`Le serveur relais a répondu ${res.status}`);
    const data = await res.json();
    return data.url; // adapte selon ce que renvoie ton relais
  }

  throw new Error(`Mode d'image inconnu : ${CONFIG.image.mode}`);
}

/* ============================================================
   EMOJIS
   ============================================================ */
function construireEmojiPicker() {
  emojiPicker.innerHTML = "";
  CONFIG.emojis.forEach(emoji => {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = emoji;
    b.addEventListener("click", () => {
      champSaisie.value += emoji;
      champSaisie.focus();
    });
    emojiPicker.appendChild(b);
  });
}

function basculerEmojiPicker() {
  emojiPicker.hidden = !emojiPicker.hidden;
}

/* ============================================================
   ÉVÉNEMENTS
   ============================================================ */
btnEnvoyer.addEventListener("click", envoyerMessage);

champSaisie.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    envoyerMessage();
  }
});

champSaisie.addEventListener("input", ajusterHauteurSaisie);
function ajusterHauteurSaisie() {
  champSaisie.style.height = "auto";
  champSaisie.style.height = Math.min(champSaisie.scrollHeight, 120) + "px";
}

btnEmoji.addEventListener("click", basculerEmojiPicker);
btnImage.addEventListener("click", genererImage);

btnParametres.addEventListener("click", () => {
  panneauParametres.hidden = !panneauParametres.hidden;
});

selectModeChat.addEventListener("change", (e) => {
  CONFIG.chat.mode = e.target.value;
  majStatut();
});

selectModeImage.addEventListener("change", (e) => {
  CONFIG.image.mode = e.target.value;
  majStatut();
});

/* ---------- Démarrage ---------- */
initialiser();
