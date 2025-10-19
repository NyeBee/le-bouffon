const { Events, Collection } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction, client) {
        if (!interaction.isChatInputCommand()) return;

        const command = client.commands.get(interaction.commandName);
        if (!command) {
            console.error(`Commande ${interaction.commandName} introuvable.`);
            return;
        }

        // Gestion des cooldowns
        const { cooldowns } = client;
        if (!cooldowns.has(command.data.name)) cooldowns.set(command.data.name, new Collection());

        const now = Date.now();
        const timestamps = cooldowns.get(command.data.name);
        const cooldownAmount = (command.cooldown ?? 3) * 1000;

        if (timestamps.has(interaction.user.id)) {
            const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;
            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return interaction.reply({
                    content: `Veuillez patienter ${timeLeft.toFixed(1)} seconde(s) avant de réutiliser la commande \`${command.data.name}\`.`,
                    flags: 1 << 6 // EPHEMERAL
                });
            }
        }

        timestamps.set(interaction.user.id, now);
        setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

        try {
            // On laisse chaque commande décider si elle a besoin de deferReply()
            await command.execute(interaction, client);

        } catch (error) {
            console.error(error);
            try {
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({
                        content: "Il y a eu une erreur lors de l'exécution de la commande !",
                        flags: 1 << 6
                    });
                } else {
                    await interaction.reply({
                        content: "Il y a eu une erreur lors de l'exécution de la commande !",
                        flags: 1 << 6
                    });
                }
            } catch (err) {
                console.error("Erreur lors de l'envoi du message d'erreur :", err);
            }
        }
    },
};
