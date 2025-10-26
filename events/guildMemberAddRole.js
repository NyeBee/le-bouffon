const { AttachmentBuilder } = require('discord.js');
const path = require('path');

module.exports = {
    name: 'guildMemberAdd',
    async execute(member, client) {
        // essaie de récupérer le welcomeRoleId depuis la configuration
        const config = client.config || require(path.join(__dirname, '..', 'configBot.json'));
        const welcomeRoleId = config.welcomerole || config.welcomeRoleId || config.welcome_role || config.welcomeRole;
        if (!welcomeRoleId) return console.error('L\'ID du rôle de bienvenue n\'est pas défini dans la configuration');

        // trouve le rôle dans le cache ou fetch s'il n'est pas en cache
        let role = member.guild.roles.cache.get(welcomeRoleId);
        if (!role) role = await member.guild.roles.fetch(welcomeRoleId).catch(() => null);
        if (!role) return console.error('Pas de rôle de bienvenue trouvé avec l\'ID fourni');

        try {
            await member.roles.add(role);
            console.log(`Rôle de bienvenue attribué à ${member.user.tag}`);
        } catch (err) {
            console.error('Erreur:', err);
        }
    },
};
