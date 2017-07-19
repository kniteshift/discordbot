const Discord = require('discord.js');
const client = new Discord.Client();

const token = process.env.DISCORD_TOKEN;

// Load raw data
var fs = require('fs');
var counters = JSON.parse(fs.readFileSync("counters.json"));
var cp = JSON.parse(fs.readFileSync("cp.json"));

// Function that capitalizes the first word of input, for display purposes
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

// Returns a String list of recommended counters for the given Pokemon
function getCounters(pokemon) {
    var counterList;
    try {
        counterList = counters[pokemon];
    }
    catch(e) {
        return "Sorry, counters for "+pokemon.capitalize()+" aren't availabe at this time"
    }
    var reply = "";
    for (var i=0; i<counterList.length; i++) {
        reply = reply + counterList[i].capitalize() + ", ";
    }
    reply = reply.slice(0, -2);
    reply = "Counters for **" + pokemon.capitalize() + "** :" + pokemon + ":: " + reply;
    return reply;
}

// Returns the minimum/maximum CP for encounters with the given Pokemon after a raid
function getCP(pokemon) {
    // Check if Pokemon is valid
    try {
        row = cp[pokemon];
    } catch(e) {
        return "Sorry, CP for " + pokemon.capitalize() + " isn't available at this time";
    }
    return "**"+pokemon.capitalize()+"** :"+pokemon+": Raid CP @ Lv20: [min: **"+row["min"]+"**, max: **"+row["max"]+"**]";
}

// Bot setup
client.on('ready', () => {
  console.log('Ready to rock!');
});

client.on('message', message => {
    try {
        if (message.content.lastIndexOf('!cp', 0) === 0) {
            var pokemon = message.content.split(" ")[1].toLowerCase();
            var reply = getCP(pokemon);
            message.channel.send(reply);
        }

        if (message.content.lastIndexOf('!counter', 0) === 0) {
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

client.login(token);
