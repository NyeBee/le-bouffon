const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder().setName("utilisateur").setDescription("Donne des informations sur l'utilisateur."),
	async execute(interaction) {
		// interaction.user est l'objet représentant l'utilisateur qui a exécuté la commande
		// interaction.member est l'objet GuildMember, qui représente l'utilisateur dans la guilde spécifique
		await rest.put(Routes.applicationCommands(clientId), { body: commands });
		await interaction.reply(
			`Cette commande a été tapée par ${interaction.user.username}, qui a rejoins le server le ${interaction.member.joinedAt} !`,
		);
	},
};