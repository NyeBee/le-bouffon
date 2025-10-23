const { ChannelType, PermissionsBitField } = require('discord.js');
const fs = require('fs');

const configPath = './configBot.json';

module.exports = {
    name: 'voiceStateUpdate',

    async execute(oldState, newState, client) {
        // Charger la config pour récupérer le salon principal
        if (!fs.existsSync(configPath)) return;
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

        const mainVoiceId = config.channelVocalId;
        if (!mainVoiceId) return;

        // Création d’un salon temporaire
        if (newState.channelId === mainVoiceId) {
            const guild = newState.guild;
            const member = newState.member;

            // Crée un salon temporaire dans la même catégorie que le salon principal
            const mainChannel = guild.channels.cache.get(mainVoiceId);
            const tempChannel = await guild.channels.create({
                name: `Salon de ${member.displayName}`,
                type: ChannelType.GuildVoice,
                parent: mainChannel?.parentId || null,
                userLimit: 3,
                permissionOverwrites: [
                    {
                        id: guild.roles.everyone,
                        allow: [PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.ViewChannel],
                    },
                    {
                        id: member.id,
                        allow: [PermissionsBitField.Flags.MoveMembers, PermissionsBitField.Flags.ManageChannels],
                    },
                ],
            });

            // Déplace le membre dedans
            await member.voice.setChannel(tempChannel).catch(() => {});
            console.log(`Salon temporaire créé : ${tempChannel.name}`);
        }

        // Suppression automatique quand vide 
        const oldChannel = oldState.channel;
        if (
            oldChannel &&
            oldChannel.id !== config.channelVocalId && // pas le salon principal
            oldChannel.type === ChannelType.GuildVoice &&
            oldChannel.name.startsWith('Salon de ') && // simple vérification
            oldChannel.members.size === 0
        ) {
            await oldChannel.delete().catch(() => {});
            console.log(`Salon temporaire supprimé : ${oldChannel.name}`);
        }
    },
};
