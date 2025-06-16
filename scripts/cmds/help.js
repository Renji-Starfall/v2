const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");
const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;

module.exports = {
  config: {
    name: "help",
    version: "2.0",
    author: "🅁🄴🄽🄹🄸 🅂🅃🄰🅁🄵🄰🄻🄻",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Affiche le menu d'aide et les informations des commandes",
      fr: "Display help menu and command information"
    },
    longDescription: {
      en: "Affiche toutes les commandes disponibles ou les détails d'une commande spécifique",
      fr: "Show all available commands or details of specific command"
    },
    category: "system",
    guide: {
      en: "{pn} [nom_commande]",
      fr: "{pn} [nom_commande]"
    },
    priority: 1,
  },

  onStart: async function ({ message, args, event, threadsData, role }) {
    const { threadID } = event;
    const prefix = getPrefix(threadID);

    if (args.length === 0) {
      // Génération du menu principal
      const categories = {};
      let msg = `╭─── 𝗛𝗘𝗟𝗣 𝗠𝗘𝗡𝗨 ────⊷\n│\n│ ⚡ 𝗣𝗿𝗲𝗳𝗶𝘅: ${prefix}\n│\n│ 📜 𝗖𝗮𝘁𝗲𝗴𝗼𝗿𝗶𝗲𝘀:\n│`;

      // Organiser les commandes par catégorie
      for (const [name, value] of commands) {
        if (value.config.role > 1 && role < value.config.role) continue;

        const category = value.config.category?.en || value.config.category || "Uncategorized";
        if (!categories[category]) categories[category] = [];
        categories[category].push(name);
      }

      // Afficher les catégories et commandes
      Object.entries(categories).forEach(([category, cmdList]) => {
        if (category.toLowerCase() !== "info") {
          msg += `\n│ ┌─「 ${category.toUpperCase()} 」\n│ │`;
          
          // Afficher 3 commandes par ligne
          for (let i = 0; i < cmdList.length; i += 3) {
            const cmds = cmdList.slice(i, i + 3).map(cmd => `✧ ${cmd}`.padEnd(15));
            msg += `\n│ │ ${cmds.join(" ")}`;
          }
        }
      });

      // Pied de page
      msg += `\n│\n│ 📌 𝗧𝗶𝗽𝘀: ${prefix}help [nom_commande] pour les détails\n`;
      msg += `│ 🛠️ 𝗣𝗿𝗼𝗯𝗹è𝗺𝗲? Utilisez ${prefix}callad\n`;
      msg += `│\n│ 👑 𝗖𝗿é𝗮𝘁𝗲𝘂𝗿: 🅁🄴🄽🄹🄸 🅂🅃🄰🅁🄵🄰🄻🄻\n`;
      msg += `│ 🔗 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸: fb.com/61557674704673\n`;
      msg += `│\n╰────────────⊷\n`;
      msg += `💎 Écrivez #renjigc pour rejoindre notre communauté 💎`;

      return message.reply({
        body: msg,
        // Optionnel: ajouter une pièce jointe avec une image de fond
        // attachment: await createHelpImage(categories) 
      });
    } else {
      // Affichage détaillé d'une commande spécifique
      const commandName = args[0].toLowerCase();
      const command = commands.get(commandName) || commands.get(aliases.get(commandName));

      if (!command) {
        return message.reply(`⚠️ Commande "${commandName}" introuvable. Utilisez ${prefix}help pour voir la liste.`);
      }

      const config = command.config;
      const response = `╭─── 𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗜𝗡𝗙𝗢 ────⊷
│
│ 𝗡𝗼𝗺: ${config.name} ${config.version ? `(v${config.version})` : ''}
│ 𝗔𝗹𝗶𝗮𝘀: ${config.aliases?.join(", ") || "Aucun"}
│ 𝗖𝗮𝘁é𝗴𝗼𝗿𝗶𝗲: ${config.category || "Général"}
│
│ 𝗗𝗲𝘀𝗰𝗿𝗶𝗽𝘁𝗶𝗼𝗻:
│ ${config.longDescription?.en || config.shortDescription?.en || "Aucune description"}
│
│ 𝗨𝘁𝗶𝗹𝗶𝘀𝗮𝘁𝗶𝗼𝗻:
│ ${(config.guide?.en || "{pn}").replace(/{pn}/g, prefix)}
│
│ 𝗔𝘂𝘁𝗲𝘂𝗿: ${config.author || "Inconnu"}
│ 𝗖𝗼𝗼𝗹𝗱𝗼𝘄𝗻: ${config.countDown || 1} seconde(s)
│ 𝗣𝗲𝗿𝗺𝗶𝘀𝘀𝗶𝗼𝗻: ${getRoleText(config.role)}
│
╰────────────⊷`;

      return message.reply(response);
    }
  }
};

function getRoleText(role) {
  const roles = {
    0: "👤 Utilisateur",
    1: "👮 Admin de groupe", 
    2: "🛡️ Admin du bot",
    3: "👑 Propriétaire du bot"
  };
  return roles[role] || "❓ Inconnue";
}

// Fonction optionnelle pour créer une image de fond
async function createHelpImage(categories) {
  // Implémentez votre logique de génération d'image ici
  // Retourne une promesse résolue avec un stream d'image
}
