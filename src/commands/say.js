module.exports = async (msg, args, command) => {
    if (!args.length) return;

    var totalSentence;
    totalSentence = args.join(' ');
    totalSentence.replace(" !", "!");
    totalSentence.replace(" .", ".");
    totalSentence.replace(" ?", "?");

    var sentences = totalSentence.match(/[^.!?]+.?|./g);
    var words;
    var letters;
    var translated = '';
    var countWords = 0;
    var update = '';

    for (var s = 0; s < sentences.length; s++) {
        words = sentences[s].split(" ");

        words.forEach(word => {
            letters = word.split('');
            if (letters.length >= 1) {
                for (var i = 0; i < letters.length; i++) {
                    if ((letters[i] < 'A' || letters[i] > 'Z') && (letters[i] < 'a' || letters[i] > 'z') && (letters[i] < '0' || letters[i] > '9')) {
                        if (letters[i] === '\'') {
                            letters.splice(i, 1, " ");
                        }
                        if (letters[i] != 'ç' && letters[i] != 'é' && letters[i] != 'è' && letters[i] != 'à' && letters[i] != 'ù' && letters[i] != ' ' && letters[i] !== '.'
                            && letters[i] !== '!' && letters[i] !== '?' && letters[i] !== '@' && letters[i] != 'ê')
                            letters.splice(i, 1, '');
                    }
                    update += letters[i];
                }
                update += ' ';
            }
        });
        words = update.split(" ");

        words.forEach(word => {
            letters = word.split('');
            for (var i = 0; i < letters.length; i++) {
                if ((letters[i] < 'A' || letters[i] > 'Z') && (letters[i] < 'a' || letters[i] > 'z') && (letters[i] < '0' || letters[i] > '9') && letters[i] !== '.'
                    && letters[i] !== '!' && letters[i] !== '?' && letters[i] != 'ç' && letters[i] != 'é' && letters[i] != 'è' && letters[i] != 'à' && letters[i] != 'ù'
                    && letters[i] != '@' && letters[i] != 'ê') {
                    letters[i] = ' ';
                }
            }

            if (letters[letters.length - 1] === '.' || letters[letters.length - 1] === '!' || letters[letters.length - 1] === '?') {
                if (letters.length > 3) {
                    if (letters[0] === letters[0].toUpperCase()) {
                        temp = letters[0].toLowerCase();
                        letters[0] = letters[1].toUpperCase();
                        letters[1] = temp;
                    } else {
                        temp = letters[0];
                        letters[0] = letters[1];
                        letters[1] = temp;
                    }

                    if (letters.length >= 5) {
                        temp = letters[letters.length - 3];
                        letters[letters.length - 3] = letters[letters.length - 2];
                        letters[letters.length - 2] = temp;
                    }
                }
                else if (letters.length == 3) {
                    if (letters[0] === letters[0].toUpperCase()) {
                        temp = letters[0].toLowerCase();
                        letters[0] = letters[1].toUpperCase();
                        letters[1] = temp;
                    } else {
                        temp = letters[0];
                        letters[0] = letters[1];
                        letters[1] = temp;
                    }
                }
            } else {
                if (letters.length > 2) {
                    if (letters[0] === letters[0].toUpperCase()) {
                        temp = letters[0].toLowerCase();
                        letters[0] = letters[1].toUpperCase();
                        letters[1] = temp;
                    } else {
                        temp = letters[0];
                        letters[0] = letters[1];
                        letters[1] = temp;
                    }

                    if (letters.length >= 4) {
                        temp = letters[letters.length - 2];
                        letters[letters.length - 2] = letters[letters.length - 1];
                        letters[letters.length - 1] = temp;
                    }
                }
                else if (letters.length == 2) {
                    if (letters[0] === letters[0].toUpperCase()) {
                        temp = letters[0].toLowerCase();
                        letters[0] = letters[1].toUpperCase();
                        letters[1] = temp;
                    } else {
                        temp = letters[0];
                        letters[0] = letters[1];
                        letters[1] = temp;
                    }
                }
            }

            var tempString = letters.join("");

            countWords++;
            if (countWords % 2 == 1) {
                translated += tempString;
            }
            else translated += tempString.toLowerCase() + " ";
        });
        update = '';
    }

    await msg.channel.send(`${msg.author}: ${translated}`);
    msg.delete();
}