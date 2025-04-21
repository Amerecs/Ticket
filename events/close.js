const { Events, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js");

module.exports = {
    name: Events.InteractionCreate,
    async execute(client, interaction){
        
        if(interaction.customId === "close"){
            
        const modal = new ModalBuilder()
        .setCustomId("modall")
        .setTitle("Close Ticket");
        
        const reasons = new TextInputBuilder()
        .setCustomId("reason")
        .setLabel("Reason")
        .setStyle(TextInputStyle.Short)
        .setRequired(false);
        
        const row = new ActionRowBuilder()
        .addComponents(reasons);
        
        modal.addComponents(row);
        await interaction.showModal(modal);
        }
    },
};