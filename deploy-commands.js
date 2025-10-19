const { REST, Routes } = require('discord.js');
const { clientId, guildId, token } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');

const commands = [];
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));
	// grab SlashCommandBuilder#toJSON() et sort les données pour chaque commande
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			commands.push(command.data.toJSON());
		} else {
			console.log(`[ATTENTION] La commande a ${filePath} manque des infos.`);
		}
	}
}

const rest = new REST().setToken(token);

(async () => {
	try {
		console.log(`Rafraîchissement de ${commands.length} applications (/) commandes.`);

		// refresh les commandes
		const data = await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });

		console.log(`Succès du rafraîchissement de ${data.length} applications (/) commandes.`);
	} catch (error) {
		// catch erreurs
		console.error(error);
	}
})();