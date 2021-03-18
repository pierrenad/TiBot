const Discord = require('discord.js');
const servers = require('../bot').servers;
const imageSearch = require('image-search-google');
const client = new imageSearch(process.env.CSE_ID, process.env.IMAGE_SEARCH_KEY);

module.exports = async (msg, args, command) => {
    var server = servers[msg.guild.id];

    var image;
    const options = { page: 1 };
    client.search(args.join(' '), options)
        .then(images => {
            /*
            [{
                'url': item.link,
                'thumbnail':item.image.thumbnailLink,
                'snippet':item.title,
                'context': item.image.contextLink
            }]
             */
            image = images;
        })
        .catch(error => console.log(error));
    console.log(image);

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
                    **'+ server.prefix + 'clearqueue**\tPermet de vider la queue.\n\
                    **'+ server.prefix + 'ip**\tCalcule le range d\'ips.\n\
                    **'+ server.prefix + '8ball**\tRépond à votre question.\n'
            }
        );
    await msg.channel.send(embed);
}