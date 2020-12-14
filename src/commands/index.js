const servers = require('../bot').servers;
const help = require('./help');
const helpAdmin = require('./help');
const eightBall = require('./8ball');
const play = require('./music');
const leave = require('./music');
const pause = require('./music');
const resume = require('./music');
const skip = require('./music');
const queue = require('./music');
const clearqueue = require('./music');

const commands = {
    help,
    helpAdmin,
    '8ball': eightBall,
    play,
    pause,
    resume,
    leave,
    skip,
    queue,
    clearqueue,
}

module.exports = async (msg) => {
    if (msg.author.bot) return;
    var server = servers[msg.guild.id];
    const args = msg.content.split(' '); // split with spaces 
    if (args.length == 0 || args[0].charAt(0) !== server.prefix) return;
    // if (args.length == 0 || args[0].charAt(0) !== server.prefix && args[0].charAt(0) !== '/') return; // for the tests
    const command = args.shift().substr(1); // remove first argument from the array and remove '!'
    if (Object.keys(commands).includes(command)) {
        commands[command](msg, args, command);
    }
}