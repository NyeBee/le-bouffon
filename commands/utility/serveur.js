const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder().setName("serveur").setDescription("Donne des informations sur le serveur."),
	async execute(interaction) {
		// Répond avec le nom et le nombre de membres du serveur
		await rest.put(Routes.applicationCommands(clientId), { body: commands });
		await interaction.reply(
			`Le nom de ce serveur est : ${interaction.guild.name}. Nous sommes actuellement ${interaction.guild.memberCount} membres.`,
		);
	},
};