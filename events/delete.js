const { Events, EmbedBuilder } = require("discord.js");
const QuickDB = require("quick.db");
const db = new QuickDB.QuickDB();

module.exports = {
    name: Events.InteractionCreate,
    async execute(client, interaction){
        
        if(interaction.customId == "delete"){
            
        const embed = new EmbedBuilder()
        .setTitle("**Ticket Deletion**")
        .setDescription("This ticket will be deleted in 5 seconds.");
        
        await interaction.reply({
            embeds: [embed]
        });
        }
    },
};