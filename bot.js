const Discord = require('discord.js');
const client = new Discord.Client();

const TOKEN = process.env.DISCORD_TOKEN;
const BOT_CHANNEL = "professor-willow" // restrict bot usage to this channel

// Load raw data
var fs = require('fs');
var counters = JSON.parse(fs.readFileSync("counters.json"));
var cp = JSON.parse(fs.readFileSync("cp.json"));
var emoji = JSON.parse(fs.readFileSync("emoji.json"));

// ** Helper functions: **
// Capitalizes the first word of input, for display purposes
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

function appropriateChannel(message) {
    if (message.channel.name != BOT_CHANNEL) {
        message.reply("Please use this command in "+BOT_CHANNEL+" instead, thanks!");
        return false;
    }
    return true;
}

function getEmoji(pokemon) {
    if (pokemon == 'ho-oh') {
        pokemon = "hooh"; // special case for ho-oh
    }
    var emojiStr = "";
    try {
        emojiStr = emoji[pokemon];
    }
    catch(e) {
        return ""; // no emoji for this pokemon, don't print anything
    }
    return emojiStr + " "; // add a space to keep things lookin' good
}

// Returns a String list of recommended counters for the given Pokemon
function getCounters(pokemon) {
    var counterHash = counters[pokemon];
    if (counterHash == null || Object.keys(counterHash).length == 0) {
        return "Sorry, counters for "+pokemon.capitalize()+" aren't availabe at this time";
    }
    var reply = "";
    for (counter in counterHash) {
        // Underline when the counter Pokemon have movesets listed
        var u = "";
        if (Object.keys(counterHash[counter]).length > 0) {
            isLegendary = true; // For now, having a hash bigger than 0 means it's legendary. No movesets for regular raid bosses yet
            u = "__";
        }
        reply = reply + "\n" + u + counter.capitalize() + u;
        for (var i=0; i<counterHash[counter].length; i++) {
            if (i == 0) reply = reply + "\n"; // add a newline between 
            reply = reply + "- "+counterHash[counter][i]+"\n";
        }
    }

    reply = "Counters for **" + pokemon.capitalize() + "** " + getEmoji(pokemon) +"\n" + reply;
    return reply;
}

// Returns the minimum/maximum CP for encounters with the given Pokemon after a raid
function getCP(pokemon) {
    // Check if Pokemon is valid
    try {
        row = cp[pokemon];
        if (row == null || row == undefined) throw Exception;

    } catch(e) {
        return "Sorry, CP for " + pokemon.capitalize() + " isn't available at this time";
    }
    return "**"+pokemon.capitalize()+"** "+getEmoji(pokemon)+"Raid CP @ Lv20: [min: **"+row["min"]+"**, max: **"+row["max"]+"**]";
}

// Bot setup
client.on('ready', () => {
  console.log('Ready to rock!');
});

client.on('message', message => {
    try {
        if (message.content.toLowerCase().lastIndexOf('!cp', 0) === 0) {
            if (!appropriateChannel(message)) {
                return;
            }
            var pokemon = message.content.split(" ")[1].toLowerCase();
            var reply = getCP(pokemon);
            message.channel.send(reply);
        }

        if (message.content.toLowerCase().lastIndexOf('!counter', 0) === 0) {
            if (!appropriateChannel(message)) {
                return;
            }
            var pokemon = message.content.split(" ")[1].toLowerCase();
            var reply = getCounters(pokemon);
            message.channel.send(reply);
        }
    } catch(e) {
            message.channel.send("error. bot is sorry");
            console.log(e);
            return;
    }
});

client.login(TOKEN);
