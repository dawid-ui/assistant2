const CONFIG = {
  apparence: {
    couleurs: {},
    formes: {},
    polices: {}
  },

  assistant: {
    nom: "Mon Assistant",
    avatarEmoji: "🤖",
    messageAccueil: "Salut ! Je suis connecté.",
    promptSysteme:
      "Tu es un assistant utile et clair. Réponds en français."
  },

  chat: {
    mode: "api",
    api: {
      endpoint:
        "https://assistant-30ki.onrender.com/api/chat",
      modele: "openai/gpt-oss-120b"
    }
  },

  image: {
    mode: "pollinations",
    pollinations: {
      construireUrl: (prompt) =>
        `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=768&height=768&nologo=true`
    }
  },

  emojis: ["😀", "👍", "🔥", "🎨", "🤖"],

  stockage: {
    mode: "memoire"
  }
};
