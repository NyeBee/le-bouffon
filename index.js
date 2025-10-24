const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, // pour le savoir sur le serveur en général
        GatewayIntentBits.GuildMembers, // pour guildMemberAdd / guildMemberRemove
        GatewayIntentBits.GuildMessages, // pour messageCreate
        GatewayIntentBits.MessageContent, // pour lire le contenu des messages
        GatewayIntentBits.GuildVoiceStates // pour voiceStateUpdate
    ]
});

// Collections pour commandes et cooldowns
client.commands = new Collection();
client.cooldowns = new Collection();

// ---------- Chargement des commandes ----------
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[ATTENTION] La commande à ${filePath} est manquante d'une propriété "data" ou "execute" requise.`);
        }
    }
}

// ---------- Chargement des événements ----------
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}

// ---------- Chargement du salon de notifications si existant ----------
if (fs.existsSync('./configBot.json')) {
    const data = JSON.parse(fs.readFileSync('./configBot.json', 'utf8'));
    client.channelWelcomeId = data.channelWelcomeId;
}

// Connexion du client
client.login(token);
