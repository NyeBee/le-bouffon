const { SlashCommandBuilder, PermissionFlagsBits, ChannelType  } = require('discord.js');
const fs = require('fs');

const filePath = './configBot.json';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setwelcomerole')
        .setDescription('Définit le rôle des nouveaux arrivants.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addRoleOption(option =>
            option
                .setName('role')
                .setDescription('Le rôle à attribuer aux nouveaux arrivants')
                .setRequired(true)
        ),

    async execute(interaction, client) {
        // deferReply pour éviter les erreurs de délai
        if (!interaction.deferred) await interaction.deferReply({ flags: 1 << 6 });

        const role = interaction.options.getRole('role');

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
        config.welcomeRoleId = role.id;

        // Réécriture du fichier mis à jour
        try {
            fs.writeFileSync(filePath, JSON.stringify(config, null, 2));
        } catch (error) {
            console.error('Erreur lors de l\'écriture du fichier :', error);
            return interaction.editReply('Impossible d\'enregistrer la configuration.');
        }
        // client.welcomeRole = role.id;

        // Réponse finale
        await interaction.editReply(`Le rôle ${role} est maintenant défini pour les nouveaux arrivants.`);
    },
};