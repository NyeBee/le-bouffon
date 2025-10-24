const { SlashCommandBuilder, PermissionFlagsBits, ChannelType  } = require('discord.js');
const fs = require('fs');

const filePath = './configBot.json';

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
                .addChannelTypes(ChannelType.GuildText)
        ),

    async execute(interaction, client) {
        // deferReply pour éviter les erreurs de délai
        if (!interaction.deferred) await interaction.deferReply({ flags: 1 << 6 });

        const channel = interaction.options.getChannel('salon');

        // Lecture du fichier config existant
        let config = {};
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf8');
            try {
                config = JSON.parse(data);
            } catch (error) {
                console.error('Erreur de lecture du JSON :', error);
                return interaction.editReply('Erreur lors de la lecture du fichier de configuration.');
            }
        }

        // Modification ou ajout de la clé
        config.channelWelcomeId = channel.id;

        // Réécriture du fichier mis à jour
        try {
            fs.writeFileSync(filePath, JSON.stringify(config, null, 2));
        } catch (error) {
            console.error('Erreur lors de l\'écriture du fichier :', error);
            return interaction.editReply('Impossible d\'enregistrer la configuration.');
        }
        // client.welcomeChannel = channel.id;

        // Réponse finale
        await interaction.editReply(`Le salon ${channel} est maintenant défini pour les notifications d\'arrivée et de départ.`);
    },
};
