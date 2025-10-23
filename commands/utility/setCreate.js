const { SlashCommandBuilder, PermissionFlagsBits, ChannelType, InteractionResponseFlags } = require('discord.js');
const fs = require('fs');

const filePath = './configBot.json';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setcreate')
        .setDescription('Définit le salon vocal qui crée de nouveaux salons temporaires.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addChannelOption(option =>
            option
                .setName('salon')
                .setDescription('Le salon vocal à utiliser pour la création automatique.')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildVoice)
        ),

    async execute(interaction, client) {
        await interaction.deferReply({ flags: InteractionResponseFlags.Ephemeral });

        const channel = interaction.options.getChannel('salon');

        if (channel.type !== ChannelType.GuildVoice) {
            return interaction.editReply('❌ Veuillez sélectionner un salon vocal valide.');
        }

        let config = {};
        if (fs.existsSync(filePath)) {
            try {
                config = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            } catch (error) {
                console.error('Erreur de lecture du JSON :', error);
                return interaction.editReply('Erreur lors de la lecture du fichier de configuration.');
            }
        }

        config.channelVocalId = channel.id;

        try {
            fs.writeFileSync(filePath, JSON.stringify(config, null, 2));
        } catch (error) {
            console.error('Erreur lors de l\'écriture du fichier :', error);
            return interaction.editReply('Impossible d\'enregistrer la configuration.');
        }

        client.createChannel = channel.id;
        return interaction.editReply(`✅ Le salon ${channel} est maintenant défini pour la création automatique.`);
    },
};
