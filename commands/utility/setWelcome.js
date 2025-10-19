const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setwelcome')
        .setDescription('Définit le salon des notifications d\'arrivée et de départ.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addChannelOption(option =>
            option
                .setName('salon')
                .setDescription('Le salon où seront envoyées les notifications')
                .setRequired(true)
        ),

    async execute(interaction, client) {
        // deferReply pour éviter les erreurs de délai
        if (!interaction.deferred) await interaction.deferReply({ flags: 1 << 6 });

        const channel = interaction.options.getChannel('salon');

        // Stockage dans le client et fichier JSON
        client.welcomeChannel = channel.id;
        fs.writeFileSync('./welcomeConfig.json', JSON.stringify({ channelId: channel.id }, null, 2));

        // Réponse finale
        await interaction.editReply(`Le salon ${channel} est maintenant défini pour les notifications d\'arrivée et de départ.`);
    },
};
