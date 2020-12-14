const eightBall = [
    'As I see it, yes.',
    'Ask again later.',
    'Better not tell you now.',
    'Cannot predict now.',
    'Concentrate and ask again.',
    'Dont\'t count on it.',
    'It is certain',
    'It is decidely so.'
]

module.exports = async (msg, args) => {
    if(!args.length) return; 
    const i = Math.floor(Math.random() * eightBall.length);
    const reply = eightBall[i];
    await msg.channel.send(`${msg.author} ${reply}`); 
}