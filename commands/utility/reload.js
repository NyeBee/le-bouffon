const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('reload')
		.setDescription('Rafraîchit les commandes.')
		.addStringOption((option) => option.setName('commande').setDescription('La commande pour rafraîchir le bot').setRequired(true)),
	async execute(interaction) {
		const commandName = interaction.options.getString('commande', true).toLowerCase();
		const command = interaction.client.commands.get(commandName);
		if (!command) {
			return interaction.reply(`Il n'y a pas de commande avec le nom \`${commandName}\`!`);
		} else {
            delete require.cache[require.resolve(`./${command.data.name}.js`)];
            try {
	            const newCommand = require(`./${command.data.name}.js`);
	            interaction.client.commands.set(newCommand.data.name, newCommand);
	            await interaction.reply(`La commande \`${newCommand.data.name}\` a été rafraîchie !`);
            } catch (error) {
                console.error(error);
                await interaction.reply(
                    `Il y a eu une erreur lors du rafraîchissement de la commande \`${command.data.name}\`:\n\`${error.message}\``,
                );
            }
        }
	},
};