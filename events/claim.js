const { Events, PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();
const config = require("../config.js");

module.exports = {
  name: Events.InteractionCreate,
  async execute(client, interaction) {
    if (interaction.customId === "claim") {     
        
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
        
        const claimChannel = interaction.channel.id;

const claimedBy = await db.get(`claim_${claimChannel}`);
if (claimedBy && claimedBy !== interaction.user.id) {
  return interaction.reply({
    content: `يوجد شخص استلم هذه التذكرة بالفعل: <@${claimedBy}>`,
    ephemeral: true
  });
}

db.set(`claim_${claimChannel}`, interaction.user.id);

      await interaction.channel.permissionOverwrites.set([
        {
          id: interaction.guild.id,
          deny: [PermissionsBitField.Flags.ViewChannel],
        },
        {
          id: ownerId,
          allow: [PermissionsBitField.Flags.ViewChannel],
        },
        {
          id: interaction.user.id,
          allow: [PermissionsBitField.Flags.ViewChannel],
        },
      ]);
        
        const embed = new EmbedBuilder()
        .setTitle("**Ticket Claimed**")
        .setDescription(`This ticket has been claimed by <@${interaction.user.id}>`);
        
        const row = new ActionRowBuilder()
            .addComponents(
            new ButtonBuilder()
                .setCustomId("unclaim")
                .setLabel("الغاء الاستلام")
                .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                .setCustomId("call")
                .setLabel("تذكير")
                .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                .setCustomId("close")
                .setLabel("اغلاق")
                .setStyle(ButtonStyle.Danger)
            );
        
        
        await interaction.message.edit({
            components: [row]
        });
        
      return interaction.reply({
        embeds: [embed]
      });
    }
  },
};