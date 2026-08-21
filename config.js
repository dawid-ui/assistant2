/* ============================================================
   CONFIG.JS — CONFIGURATION DE L'ASSISTANT
   ============================================================ */

window.CONFIG = {

  /* ==========================================================
     1. APPARENCE
     ========================================================== */

  apparence: {
    couleurs: {
      fond: "#EEEEE6",
      panneau: "#FFFFFF",
      texte: "#1E2622",
      texteAtténué: "#5B6660",
      bordure: "#DBDBCF",
      accentPrincipal: "#35594C",
      accentPrincipalFonce: "#223D33",
      accentSecondaire: "#6E5A96",
      bulleBot: "#FFFFFF",
      bulleUtilisateur: "#223D33",
      texteBulleUtilisateur: "#F3F1E7"
    },

    formes: {
      rayonCoins: "14px"
    },

    polices: {
      titres: "'Fraunces', serif",
      texte: "'Inter', system-ui, sans-serif",
      statutEtCode: "'JetBrains Mono', monospace"
    }
  },


  /* ==========================================================
     2. IDENTITÉ DE L'ASSISTANT
     ========================================================== */

  assistant: {
    nom: "Mon Assistant",
    avatarEmoji: "🤖",

    messageAccueil:
      "Salut ! Je suis ton assistant. Pose-moi une question, ou demande-moi une image 🎨",

    promptSysteme: `
Tu es un assistant utile, clair et amical.
Réponds en français par défaut.
`.trim()
  },


  /* ==========================================================
     3. MOTEUR DE CHAT
     ========================================================== */

  chat: {
    mode: "api",

    api: {
      endpoint: "https://assistant-30ki.onrender.com/api/chat",
      modele: "openai/gpt-oss-120b"
    }
  },


  /* ==========================================================
     4. GÉNÉRATION D'IMAGES
     ========================================================== */

  image: {
    mode: "pollinations",

    pollinations: {
      construireUrl: function (prompt) {
        return (
          "https://image.pollinations.ai/prompt/" +
          encodeURIComponent(prompt) +
          "?width=768&height=768&nologo=true"
        );
      }
    },

    api: {
      endpoint: "http://localhost:3000/api/image"
    }
  },


  /* ==========================================================
     5. EMOJIS
     ========================================================== */

  emojis: [
    "😀",
    "😂",
    "😍",
    "🤔",
    "😎",
    "😢",
    "😡",
    "👍",
    "👎",
    "🙏",
    "🎉",
    "🔥",
    "💡",
    "✅",
    "❌",
    "❤️",
    "🚀",
    "🎨",
    "🖼️",
    "🤖",
    "📌",
    "⭐",
    "👀",
    "💬",
    "🕒",
    "📎",
    "🧠",
    "🛠️",
    "📷",
    "🎵"
  ],


  /* ==========================================================
     6. STOCKAGE
     ========================================================== */

  stockage: {
    mode: "memoire"
  }

};
