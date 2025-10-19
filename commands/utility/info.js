const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Donne des infos sur le serveur ou un utilisateur!')
        .addSubcommand(subcommand =>
            subcommand
                .setName('utilisateur')
                .setDescription('Info sur un utilisateur')
                .addUserOption(option =>
                    option
                        .setName('cible')
                        .setDescription('Utilisateur dont tu veux obtenir les infos')
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('serveur')
                .setDescription('Info sur le serveur')
        ),

    async execute(interaction) {
        // --- Sous-commande serveur ---
        if (interaction.options.getSubcommand() === 'serveur') {
            const { guild } = interaction;

            const serverEmbed = new EmbedBuilder()
                .setColor(0x0099ff)
                .setTitle(`Informations sur le serveur ${guild.name}`)
                .setThumbnail(guild.iconURL({ dynamic: true }))
                .addFields(
                    { name: 'Nom du serveur', value: guild.name, inline: true },
                    { name: 'Membres', value: `${guild.memberCount}`, inline: true },
                    { name: 'Créé le', value: guild.createdAt.toLocaleDateString('fr-FR'), inline: true },
                    { name: 'Propriétaire', value: `<@${guild.ownerId}>`, inline: true },
                )
                .setFooter({ text: `ID du serveur : ${guild.id}` })
                .setTimestamp();

            await interaction.reply({ embeds: [serverEmbed] });
        }

        // --- Sous-commande utilisateur ---
        else if (interaction.options.getSubcommand() === 'utilisateur') {
            const user = interaction.options.getUser('cible') || interaction.user;
            let member;

            try {
                member = await interaction.guild.members.fetch(user.id);
            } catch (err) {
                member = null;
            }

            const dateCreation = user.createdAt.toLocaleDateString('fr-FR', {year: 'numeric',month: 'long',day: 'numeric',});
            const userEmbed = new EmbedBuilder()
                .setColor(0x00ff99)
                .setTitle(`Informations sur ${user.username}`)
                .setThumbnail(user.displayAvatarURL({ dynamic: true }));

            if (member) {
                const dateArrivee = member.joinedAt.toLocaleDateString('fr-FR', {year: 'numeric',month: 'long',day: 'numeric',});
                userEmbed.addFields({
                    name: '',
                    value:
                        `**Nom d'utilisateur :** ${user.tag}` +
                        ` **ID :** ${user.id}\n` +
                        `**Compte créé le :** ${dateCreation}\n` +
                        ` **A rejoint le serveur le :** ${dateArrivee}`,
                    inline: false,
                });
            } else {
                userEmbed.addFields({
                    name: '',
                    value:
                        `**Nom d'utilisateur :** ${user.tag}` +
                        ` **ID :** ${user.id}\n` +
                        `**Compte créé le :** ${dateCreation}\n` +
                        ` **Présence sur le serveur :** Cet utilisateur n'est pas (ou plus) membre du serveur.`,
                    inline: false,
                });
            }

            userEmbed
                .setFooter({ text: `Demandé par ${interaction.user.username}` })
                .setTimestamp();

            await interaction.reply({ embeds: [userEmbed] });
        }
    },
};
