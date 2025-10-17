const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder().setName("serveur").setDescription("Donne des informations sur le serveur."),
	async execute(interaction) {
		// interaction.guild is the object representing the Guild in which the command was run
		await interaction.reply(
			`Le nom de ce serveur est : ${interaction.guild.name}. Nous sommes actuellement ${interaction.guild.memberCount} membres.`,
		);
	},
};