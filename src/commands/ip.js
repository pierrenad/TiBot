const Discord = require('discord.js');
var deciBin = require('decimal-to-binary');

module.exports = async (msg, args, command) => {

    // get arguments
    var ipMask = args[0].split('/');
    var ipBin = [];

    // split ip address with '.' 
    var splittedIp = ipMask[0].split('.')
    splittedIp.forEach(ip => {
        ipBin.push(deciBin.convertToBinary(ip));
    });

    // check if we need to add some 0 to get 8 bits
    var len;
    var toAdd = '';
    for (var j = 0; j < 4; j++) {
        toAdd = '';
        if (ipBin[j].length < 8) {
            len = 8 - ipBin[j].length;
            for (var i = 0; i < len; i++) {
                toAdd += '0';
            }
            ipBin[j] = toAdd + ipBin[j];
        }
    }

    // get the mask by bytes
    var maskBin = [];
    var mask = ipMask[1];
    if (mask <= 8) {
        maskBin[0] = '';
        for (var i = 0; i < mask; i++) {
            maskBin[0] += '1';
        }
        mask = 8 - mask;
        for (var i = 0; i < mask; i++) {
            maskBin[0] += '0';
        }
        maskBin[1] = '00000000';
        maskBin[2] = '00000000';
        maskBin[3] = '00000000';
    } else if (mask <= 16) {
        maskBin[0] = '11111111';
        mask -= 8;
        maskBin[1] = '';
        for (var i = 0; i < mask; i++) {
            maskBin[1] += '1';
        }
        mask = 8 - mask;
        for (var i = 0; i < mask; i++) {
            maskBin[1] += '0';
        }
        maskBin[2] = '00000000';
        maskBin[3] = '00000000';
    } else if (mask <= 24) {
        maskBin[0] = '11111111';
        maskBin[1] = '11111111';
        mask -= 16;
        maskBin[2] = '';
        for (var i = 0; i < mask; i++) {
            maskBin[2] += '1';
        }
        mask = 8 - mask;
        for (var i = 0; i < mask; i++) {
            maskBin[2] += '0';
        }
        maskBin[3] = '00000000';
    } else if (mask > 24 && mask <= 32) {
        maskBin[0] = '11111111';
        maskBin[1] = '11111111';
        maskBin[2] = '11111111';
        mask -= 24;
        maskBin[3] = '';
        for (var i = 0; i < mask; i++) {
            maskBin[3] += '1';
        }
        mask = 8 - mask;
        for (var i = 0; i < mask; i++) {
            maskBin[3] += '0';
        }
    } else {
        console.log('mauvais masque');
    }

    // get the mask address
    var maskIp = ['', '', '', ''];
    for (var i = 0; i < 4; i++) {
        maskIp[i] = deciBin.convertToDecimal(maskBin[i])
    }

    var maskAddr = maskIp[0] + '.' + maskIp[1] + '.' + maskIp[2] + '.' + maskIp[3];

    // get the network address & first host
    var network = ['', '', '', ''];
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 8; j++) {
            network[i] += ipBin[i].charAt(j) & maskBin[i].charAt(j);
        }
    }

    for (var i = 0; i < 4; i++) {
        network[i] = deciBin.convertToDecimal(network[i])
    }

    var networkAddr = network[0] + '.' + network[1] + '.' + network[2] + '.' + network[3];
    var firstHost = network[0] + '.' + network[1] + '.' + network[2] + '.' + (parseInt(network[3]) + 1).toString();

    // get broadcast address & last host
    var toPassAt1 = 32 - ipMask[1];
    var binaryJoined = '';
    for (var i = 0; i < 4; i++) {
        binaryJoined += ipBin[i];
    }

    // get the 1s for hosts bits
    binaryJoined = binaryJoined.substr(0, ipMask[1]);
    for (var i = 0; i < toPassAt1; i++) {
        binaryJoined += '1';
    }

    var broadcast = ['', '', '', ''];
    broadcast[0] = binaryJoined.substr(0, 8);
    broadcast[1] = binaryJoined.substr(8, 8);
    broadcast[2] = binaryJoined.substr(16, 8);
    broadcast[3] = binaryJoined.substr(24, 8);

    for (var i = 0; i < 4; i++) {
        broadcast[i] = deciBin.convertToDecimal(broadcast[i])
    }
    var lastHost = broadcast[0] + '.' + broadcast[1] + '.' + broadcast[2] + '.' + (parseInt(broadcast[3]) - 1).toString();
    var broadcast = network[0] + '.' + broadcast[1] + '.' + broadcast[2] + '.' + broadcast[3];

    // Show outputs
    const embed = new Discord.MessageEmbed()
        .setTitle('IP range')
        .setColor(0xff0000)
        .addFields(
            { name: 'Network address', value: networkAddr },
            { name: 'Mask address', value: maskAddr },
            { name: 'First host', value: firstHost },
            { name: 'Last host', value: lastHost },
            { name: 'Broadcast address', value: broadcast }
        );
    await msg.channel.send(embed);
}