const { createCanvas, loadImage, GlobalFonts } = require('@napi-rs/canvas');
const { AttachmentBuilder } = require('discord.js');
const { request } = require('undici');
const path = require('path');

module.exports = {
    name: 'guildMemberAdd',
    async execute(member, client) {
        const channel = member.guild.channels.cache.get(client.welcomeChannel);
        if (!channel) return console.error('Channel de bienvenue introuvable');

        const canvas = createCanvas(1024, 500);
        const ctx = canvas.getContext('2d');

        // Charger la police Montserrat ExtraBold
        GlobalFonts.registerFromPath(
            path.join(__dirname, 'Montserrat-ExtraBold.ttf'),
            'Montserrat'
        );

        // Charger le fond
        const background = await loadImage('https://i.pinimg.com/564x/67/05/08/6705086df60e7d987767b8fd10a2dfa2.jpg');
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        // Avatar
        const { body } = await request(member.user.displayAvatarURL({ extension: 'png', size: 512 }));
        const avatar = await loadImage(await body.arrayBuffer());

        const avatarX = 512;
        const avatarY = 170;
        const avatarRadius = 130;

        // Cercle pour l’avatar
        ctx.save();
        ctx.beginPath();
        ctx.arc(avatarX, avatarY, avatarRadius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(avatar, avatarX - avatarRadius, avatarY - avatarRadius, avatarRadius * 2, avatarRadius * 2);
        ctx.restore();

        // Contour de l’avatar
        ctx.beginPath();
        ctx.arc(avatarX, avatarY, avatarRadius, 0, Math.PI * 2);
        ctx.lineWidth = 8;
        ctx.strokeStyle = '#ffffff';
        ctx.stroke();

        // Paramètres communs
        ctx.textAlign = 'center';
        ctx.fillStyle = '#ffffff';

        // Appliquer une ombre réaliste
        ctx.shadowColor = 'rgba(0, 0, 0, 0.6)'; // couleur de l’ombre
        ctx.shadowBlur = 10;                     // diffusion
        ctx.shadowOffsetX = 2;                   // léger décalage horizontal
        ctx.shadowOffsetY = 4;                   // décalage vertical

        // Texte principal "BIENVENUE"
        ctx.font = 'bold 72px "Montserrat"';
        ctx.fillText('BIENVENUE', 512, 390);

        // Texte secondaire : nom d’utilisateur
        ctx.font = 'bold 40px "Montserrat"';
        ctx.fillText(member.displayName.toUpperCase(), 512, 440);

        // Désactiver l’ombre pour les prochains dessins
        ctx.shadowColor = 'transparent';

        // Création et envoi de l’image
        const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'welcome.png' });
        await channel.send({ files: [attachment] });
    },
};
