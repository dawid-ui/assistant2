const CONFIG = {
  apparence: {
    couleurs: {},
    formes: {},
    polices: {}
  },

  assistant: {
    nom: "Mon Assistant",
    avatarEmoji: "🤖",
    messageAccueil: "Salut ! Je suis ton assistant.",
    promptSysteme: "Tu es un assistant utile. Réponds en français."
  },

  chat: {
    mode: "api",
    api: {
      endpoint: "https://assistant-30ki.onrender.com/api/chat",
      modele: "llama-3.3-70b-versatile"
    }
  },

  image: {
    mode: "pollinations",
    pollinations: {
      construireUrl: (prompt) =>
        https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=768&height=768&nologo=true
    },
    api: {
      endpoint: "http://localhost:3000/api/image"
    }
  },

  emojis: [
    "😀", "😂", "😍", "🤔", "😎", "👍", "👎", "🙏",
    "🎉", "🔥", "💡", "✅", "❌", "❤️", "🚀", "🎨", "🤖"
  ],

  stockage: {
    mode: "memoire"
  }
};
