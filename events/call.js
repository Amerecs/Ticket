const { Events, EmbedBuilder } = require("discord.js");
const config = require("../config.js");
const QuickDB = require("quick.db");
const db = new QuickDB.QuickDB();

module.exports = {
    name: Events.InteractionCreate,
    async execute(client, interaction){
        
        if(interaction.customId == "call"){
        const allowedRoles = await db.get(`admin_${interaction.channel.id}`);

const hasPermission = allowedRoles.some(roleId => interaction.member.roles.cache.has(roleId));

if (!hasPermission) {
  return interaction.reply({
    content: "ليس لديك صلاحية لاستلام هذه التذكرة.",
    ephemeral: true,
  });
}
        
        const ownerId = await db.get(`ticket_${interaction.channel.id}`);
        if(!ownerId){
            return interaction.reply({
                content: `لم يتم العثور على صاحب التذكرة`,
                ephemeral: true
            });
        }
            
        
        const member = await interaction.guild.members.fetch(ownerId);
        
        const embed = new EmbedBuilder()
        .setTitle("**🎟️ Ticket System**")
        .setDescription(`[🔔] Hello ${member}, you have a ticket open in <#${interaction.channel.id}>. Please respond to it.`);
        
        member.send({ embeds: [embed] });
        
        interaction.reply({
            content: `تم ارسال رسالة التذكير بنجاح`,
            ephemeral: true
        });
        }
    },
};