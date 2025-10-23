const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, InteractionResponseFlags } = require('discord.js');
const fs = require('fs');

const filePath = './configBot.json';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('getconfig')
        .setDescription('Affiche les salons configurés pour le bot.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        // Vérifie la présence du fichier
        if (!fs.existsSync(filePath)) {
            return interaction.editReply('⚠️ Aucun fichier de configuration trouvé.');
        }

        let config;
        try {
            config = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        } catch (error) {
            console.error('Erreur lecture JSON :', error);
            return interaction.editReply('Erreur lors de la lecture du fichier de configuration.');
        }

        const vocalId = config.channelVocalId
            ? `<#${config.channelVocalId}>`
            : '❌ Non défini';
        const welcomeId = config.channelWelcomeId
            ? `<#${config.channelWelcomeId}>`
            : '❌ Non défini';

        const embed = new EmbedBuilder()
            .setColor('#5865F2')
            .setTitle('⚙️ Configuration actuelle du bot')
            .addFields(
                { name: 'Salon vocal de création : ', value: vocalId, inline: true },
                { name: 'Salon des notifications : ', value: welcomeId, inline: true },
            )
            .setTimestamp()
            .setFooter({ text: 'Configuration enregistrée dans configBot.json' });

        return interaction.editReply({ embeds: [embed] });
    },
};
