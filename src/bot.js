/***************************
 * Created by pierrenad
 * 
 * Maid Bot with discord js
 ***************************/

require('dotenv').config(); // get the environment variables into process.env
const Discord = require('discord.js');
const client = new Discord.Client();
const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});
const prefix = ['³'];
// exports.prefix = prefix;
const servers = {};
exports.servers = servers;

const commandHandler = require('./commands');

client.once('ready', async () => {
    var tableExists = false;
    const cli = await pool.connect();
    var result = await cli.query('select * from pg_tables where schemaname=\'public\';');
    result.rows.forEach(table => {
        if (table.tablename === 'servers') {
            tableExists = true;
        }
    });
    if (!tableExists) {
        await cli.query('CREATE TABLE servers (id bigint NOT NULL, queue json, channels json, roles json, prefix text);');
    }

    var guildFound;
    var server; 
    client.guilds.cache.forEach(async (guild) => {
        var dbServer = await cli.query(`SELECT * FROM servers WHERE id=${guild.id};`);
        if (dbServer.rows.length) {
            guildFound = dbServer.rows[0];
            servers[guild.id] = { 
                queue: [],
                channels: guildFound.channels,
                roles: guildFound.roles,
                prefix: guildFound.prefix
            }
            server = servers[guild.id];
        }
    })
    cli.release();

    console.log('Here I am');
    // set status
    client.user.setPresence({ status: "online", activity: { name: server ? server.prefix : prefix[0] + 'help | v1.0' } });
});

client.on('message', commandHandler);

client.on('guildCreate', async (guild) => {
    var guildFound;
    const cli = await pool.connect();
    var dbServer = await cli.query(`SELECT * FROM servers WHERE id=${guild.id};`);
    if (dbServer.rows.length) {
        guildFound = dbServer.rows[0];
        servers[guild.id] = { 
            queue: [],
            channels: guildFound.channels,
            roles: guildFound.roles,
            prefix: guildFound.prefix
        }
    }
    if (!guildFound) {
        await cli.query(`INSERT INTO servers VALUES (${guild.id}, '{"items": []}', '{"items": []}', '{"items": []}', '$');`); 
        var infos = await cli.query(`SELECT * FROM servers WHERE id=${guild.id};`);
        servers[guild.id] = { 
            queue: [],
            channels: infos.rows[0].channels,
            roles: infos.rows[0].roles,
            prefix: infos.rows[0].prefix
        }
    }
    var server = servers[guild.id];

    const embed = new Discord.MessageEmbed()
        .setTitle('Merci de m\'avoir ajouté !')
        .setColor(0xff0000)
        .setThumbnail(client.user.avatarURL())
        .addField(
            'Configuration', `N\'hésitez pas à consulter l\'aide via la commande ${server.prefix}help.\n\
            Vous pouvez configurer les channels si vous souhaiter utiliser les options se trouvant dans ${server.prefix}helpAdmin :\n\
            Configurez un channel de règlement si vous souhaitez que les nouveaux membres acceptent certains règles pour accéder à un rôle supérieur. \
            Pour cela vous devrez aussi configurer le rôle affecté aux nouveaux et le rôle affecté à ceux qui ont accepté les règles\n\n\
            Channel ai permet de faire des appels au bot (ex: musique, etc)\n\n\
            Channel assisstant est le channel va annoncer des événements (ex: arrivée d'un nouveau membre)\n\n\
            Tout ceci n'est pas obligatoire, vous pouvez utiliser le bot sans devoir tout configurer.`
        );
    await guild.systemChannel.send(embed);
    // await guild.channels.cache.find(chan => chan.type === 'text').send(embed);
});

// new member get a role and send message to welcome the member
client.on('guildMemberAdd', async function (member) {
    if (member.user.bot) return;
    var server = servers[member.guild.id];
    if (server.roles.items.find(item => item.name === 'newMember')) { // if new member role is set 
        const role = member.guild.roles.cache.find(role => role.id === server.roles.items.find(item => item.name === 'newMember').id);
        member.roles.add(role);
    }
    const embed = new Discord.MessageEmbed()
        .setAuthor(member.user.tag, member.user.avatarURL())
        .setColor(0xff0000)
        .setDescription("A rejoint **" + member.guild.name + "**\nBienvenue **" + member.user.tag + "** !")
        .setFooter(`Voici notre ${member.guild.memberCount}eme membre`, member.guild.iconURL());
    try {
        await member.guild.channels.cache.find(chan => chan.id === server.channels.items.find(item => item.name === 'assistant').id).send(embed);
    }
    catch (e) {
        try {
            await member.guild.systemChannel.send(embed);
        }
        catch (e) {
            await member.guild.channels.cache.find(chan => chan.type === 'text').send(embed);
        }
    }
});

// on reaction -> change the role of the member
client.on('messageReactionAdd', async function (reaction, user) {
    if (user.bot) return;
    var server = servers[reaction.message.guild.id];
    if (server.channels.items.find(item => item.name === 'rules') && reaction.message.channel.id === server.channels.items.find(item => item.name === 'rules').id) {
        if (server.roles.items.find(item => item.name === 'accepted') && server.roles.items.find(item => item.name === 'newMember')) {
            const addRole = reaction.message.channel.guild.roles.cache.find(role => role.id === server.roles.items.find(item => item.name === 'accepted').id);
            const delRole = reaction.message.channel.guild.roles.cache.find(role => role.id === server.roles.items.find(item => item.name === 'newMember').id);
            var member = reaction.message.guild.members.cache.get(user.id);
            if (!member.roles.cache.has(delRole.id)) return; // if not a new member
            if (!member.roles.cache.has(addRole.id))
                await member.roles.add(addRole);
            if (member.roles.cache.has(delRole.id)) {
                await member.roles.remove(delRole);
            }
        }
    }
});
client.on('raw', packet => {
    // We don't want this to run on unrelated packets
    if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t)) return;
    // Grab the channel to check the message from
    const channel = client.channels.cache.get(packet.d.channel_id);
    // There's no need to emit if the message is cached, because the event will fire anyway for that
    if (channel.messages.cache.has(packet.d.message_id)) return;
    // Since we have confirmed the message is not cached, let's fetch it
    channel.messages.fetch(packet.d.message_id).then(message => {
        // Emojis can have identifiers of name:id format, so we have to account for that case as well
        const emoji = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;
        // This gives us the reaction we need to emit the event properly, in top of the message object
        const reaction = message.reactions.cache.get(emoji);
        // Adds the currently reacting user to the reaction's users collection.
        if (reaction) reaction.users.cache.set(packet.d.user_id, client.users.cache.get(packet.d.user_id));
        // Check which type of event it is before emitting
        if (packet.t === 'MESSAGE_REACTION_ADD') {
            client.emit('messageReactionAdd', reaction, client.users.cache.get(packet.d.user_id));
        }
        if (packet.t === 'MESSAGE_REACTION_REMOVE') {
            client.emit('messageReactionRemove', reaction, client.users.cache.get(packet.d.user_id));
        }
    });
});

client.login(process.env.BOT_TOKEN);