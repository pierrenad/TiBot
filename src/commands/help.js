const Discord = require('discord.js');
const servers = require('../bot').servers;

module.exports = async (msg, args, command) => {
    var server = servers[msg.guild.id];
    const embed = new Discord.MessageEmbed()
        .setTitle('TiBot Help')
        .setColor(0xff0000)
        .addFields(
            {
                name: 'Commands', value: '\
                    **'+ server.prefix + 'play**\tLance une musique demandée via l\'argument.\n\
                    **'+ server.prefix + 'skip**\tPasse à la musique suivante si il y en a dans la queue.\n\
                    **'+ server.prefix + 'pause**\tMet la musique sur pause.\n\
                    **'+ server.prefix + 'resume**\tReprend la musique.\n\
                    **'+ server.prefix + 'leave**\tQuitte le channel vocal.\n\
                    **'+ server.prefix + 'queue**\tPermet de visualiser les titres ajoutés dans la queue.\n\
                    **'+ server.prefix + 'clearQueue**\tPermet de vider la queue.\n\
                    **'+ server.prefix + 'ip**\tCalcule le range d\'ips.\n\
                    **'+ server.prefix + '8ball**\tRépond à votre question.\n'
            }
        );
    await msg.channel.send(embed);
}