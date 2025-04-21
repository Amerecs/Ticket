const { Client, GatewayIntentBits, Collection, ChannelType, PermissionsBitField, ActivityType } = require('discord.js');
const fs = require('fs');
const path = require('path');
const QuickDB = require("quick.db");
const db = new QuickDB.QuickDB();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences
    ]
});


const { token, prefix } = require("./config.js");

client.command = new Collection();

const messageFiles = fs.readdirSync(path.join(__dirname, 'command')).filter(file => file.endsWith('.js'));

for (const file of messageFiles) {
    const message = require(`./command/${file}`);
    client.command.set(message.name, message);
};

const eventsFiles = fs.readdirSync("./events").filter((file) => file.endsWith(".js"));

for (const file of eventsFiles) {
    const event = require(`./events/${file}`);
    client.on(event.name, async (...args) => {
        await event.execute(client, ...args);
    });
};

client.on('messageCreate', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(1).split(/ +/);
    const messageName = args.shift().toLowerCase();  

    const messagess = client.command.get(messageName) || client.command.find(cmd => cmd.alliases && cmd.alliases.includes(messageName));

    if (!messagess) return;

    try {
        messagess.execute(message, args, client);
    } catch (error) {
        console.error(error);
        message.reply(error);
    }
});




client.once("ready", async () => {
console.log("ready " + client.user.username);
    client.user.setActivity("Wick Studio", {
type: ActivityType.Playing
});
});


client.login(token);