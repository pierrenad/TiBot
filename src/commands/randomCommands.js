module.exports = async (msg, args, command) => {
    switch (command) {
        case 'random': // random number in the given range
            if (!args.length) return;
            min = Math.ceil(args[0]);
            max = Math.floor(args[1]);
            if (args.length > 1) {
                rand = Math.floor(Math.random() * (max - min + 1)) + min;
                msg.reply(rand);
            }
            else { // if only one number given -> random between 0 and given number
                min = 0;
                max = Math.floor(args[0]);
                rand = Math.floor(Math.random() * max + 1);
                msg.reply(rand);
            }
            break;
        case 'flip': // flip a coin
            rand = Math.random();
            if (rand < 0.5)
                msg.reply("heads");
            else
                msg.reply("tails");
            break;
        default:
    }
}