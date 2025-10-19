const { Events, MessageFlags } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (!interaction.isChatInputCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);
        const { cooldowns } = interaction.client;

        if (!cooldowns.has(command.data.name)) {
	        cooldowns.set(command.data.name, new Collection());
        }

        const now = Date.now();
        const timestamps = cooldowns.get(command.data.name);
        const defaultCooldownDuration = 3;
        const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1_000;

        if (timestamps.has(interaction.user.id)) {
	        const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

	        if (now < expirationTime) {
	        	const timeLeft = (expirationTime - now) / 1000;
	        	return interaction.reply({
	        		content: `Veuillez patienter ${timeLeft.toFixed(1)} seconde(s) avant de réutiliser la commande \`${command.data.name}\`.`,
	        		flags: MessageFlags.Ephemeral,
	        	});
	        }
        }

        timestamps.set(interaction.user.id, now);
        setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

		if (!command) {
			console.error(`Aucune commande correspondant a : ${interaction.commandName} n'a été trouvée.`);
			return;
		}

		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(error);
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({
					content: `Il y a eu une erreur lors de l'éxécution de la commande!`,
					flags: MessageFlags.Ephemeral,
				});
			} else {
				await interaction.reply({
					content: `Il y a eu une erreur lors de l'éxécution de la commande!`,
					flags: MessageFlags.Ephemeral,
				});
			}
		}
	},
};


