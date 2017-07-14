const Discord = require('discord.js');
const client = new Discord.Client();

const token = process.env.DISCORD_TOKEN;

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

function getCounters(pokemon) {
    var reply = "";
    if (pokemon in counters) {
        curCounters = counters[pokemon];
        for (var i=0; i<curCounters.length; i++) {
            reply = reply + curCounters[i].capitalize() + ", ";
        }
        reply = reply.slice(0, -2);
    }
    return reply;
}

var counters = {
    "arcanine": ["golem", "rhydon", "vaporeon", "feraligatr", "kingdra", "dragonite", "tyranitar"],
    "alakazam": ["tyranitar", "houndoom", "scizor", "pinsir", "dragonite", "gyarados", "snorlax"],
    "machamp": ["espeon", "alakazam", "exeggutor", "dragonite", "gengar", "charizard"],
    "gengar": ["tyranitar", "houndoom", "golem", "rhydon", "gyarados", "dragonite", "crobat"],
    "vaporeon": ["exeggutor", "venusaur", "tangela", "victreebel", "vileplume", "jolteon", "sunflora"],
    "jolteon": ["golem", "rhydon", "sandslash", "donphan", "nidoking", "dragonite", "gengar"],
    "flareon": ["omastar", "golem", "rhydon", "vaporeon", "feraligatr", "gyarados", "dragonite"],
    "venusaur": ["flareon", "charizard", "arcanine", "dragonite", "exeggutor", "espeon", "alakazam"],
    "charizard": ["golem", "omastar", "rhydon", "tyranitar", "vaporeon", "feraligatr", "kingdra"],
    "blastoise": ["jolteon", "venusaur", "exeggutor", "victreebel", "vileplume", "tangela", "magneton"],
    "rhydon": ["vaporeon", "exeggutor", "venusaur", "victreebel", "vileplume", "tangela", "feraligatr"],
    "lapras": ["machamp", "heracross", "jolteon", "magneton", "exeggutor", "poliwrath", "omastar"],
    "snorlax": ["machamp", "heracross", "ursaring", "dragonite", "poliwrath", "alakazam"],
    "tyranitar": ["machamp", "poliwrath", "heracross", "primeape", "hitmonlee", "vaporeon"]
};


client.on('ready', () => {
  console.log('I am ready!');
});

client.on('message', message => {
    try {
        if (message.content.lastIndexOf('!cp', 0) === 0) {
            var pokemon = message.content.split(" ")[1].toLowerCase();
            var cp = {
                "muk": {"min": 1474, "max": 1548},
                "exeggutor": {"min": 1589, "max": 1666},
                "weezing": {"min": 1180, "max": 1247},
                "electabuzz": {"min": 1188, "max": 1255},
                "magmar": {"min": 1220, "max": 1288},
                "arcanine": {"min": 1546, "max": 1622},
                "alakazam": {"min": 1569, "max": 1649},
                "machamp": {"min": 1574, "max": 1650},
                "gengar": {"min": 1420, "max": 1496},
                "vaporeon": {"min": 1724, "max": 1804},
                "jolteon": {"min": 1484, "max": 1560},
                "flareon": {"min": 1581, "max": 1659},
                "venusaur": {"min": 1395, "max": 1467},
                "charizard": {"min": 1461, "max": 1535},
                "blastoise": {"min": 1241, "max": 1309},
                "rhydon": {"min": 1804, "max": 1886},
                "lapras": {"min": 1414, "max": 1487},
                "snorlax": {"min": 1833, "max": 1917},
                "tyranitar": {"min": 2011, "max": 2097}
            };
            var row;
            var reply = "";
            try {
                row = cp[pokemon];
            } catch(e) {
                reply = "Sorry, CP for " + pokemon.capitalize() + " isn't available at this time";
                message.channel.send(reply);
            }
            reply = "**"+pokemon.capitalize()+"** :"+pokemon+": CP @ Lv20: [**"+row["min"]+"** min, **"+row["max"]+"** max]";
            if (pokemon in counters) {
                reply = reply + "\n__Counters__: " + getCounters(pokemon);
            }
            message.channel.send(reply);
        }

        if (message.content.lastIndexOf('!counter', 0) === 0) {
            var pokemon = message.content.split(" ")[1].toLowerCase();
            var reply = "";
            var curCounters;
            try {
                curCounters = getCounters(pokemon);
            } catch(e) {
                reply = "Sorry, I don't have counters for " + pokemon.capitalize();
                message.channel.send(reply);
            }
            var reply = "**Counters for " + pokemon.capitalize() + "** :" + pokemon + "::" + curCounters;
            message.channel.send(reply);
        }
    } catch(e) {
            message.channel.sendMessage("error. bot is sorry");
            console.log(e);
            return;
    }
});

client.login(token);

