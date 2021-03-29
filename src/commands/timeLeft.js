const Discord = require('discord.js');
const startTime = require('../bot').startTime;

module.exports = async (msg, args, command) => {
    const time2 = new Date();

    let difference = time2.getTime() - startTime.getTime(); // need to be tested
    var left = (550 * 60 * 60 * 1000) - (difference);

    var timeLeft = new Date();
    timeLeft.setTime(left);

    const embed = new Discord.MessageEmbed()
        .setTitle('Time left')
        .setColor(0xff0000)
        .addFields(
            { name: 'I\'m down in', value: (timeLeft.getDate() - 1) + " days " + timeLeft.getHours() + " hours " + timeLeft.getMinutes() + " min" },
        );
    await msg.channel.send(embed);
}