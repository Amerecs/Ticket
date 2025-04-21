const { Events, PermissionsBitField, EmbedBuilder } = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
    name: Events.InteractionCreate,
    async execute(client, interaction) {
        if (!interaction.isButton()) return;

        if (interaction.customId == "open") {
            const ownerId = await db.get(`ticket_${interaction.channel.id}`);
if (!ownerId || !interaction.guild.members.cache.has(ownerId)) {
    return interaction.reply({
        content: "تعذر العثور على صاحب التذكرة أو أنه غير موجود في السيرفر.",
        ephemeral: true
    });
}
           const allowedRoles = await db.get(`admin_${interaction.channel.id}`);

 try {
     await interaction.channel.permissionOverwrites.set([
        {
            id: interaction.guild.id,
            deny: [PermissionsBitField.Flags.ViewChannel],
        },
        {
            id: ownerId,
            allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
        },
        ...allowedRoles.map(roleId => ({
            id: roleId,
            allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
        })),
    ]);
} catch (error) {
    console.error("حدث خطأ أثناء تعديل الصلاحيات:", error);
    return interaction.reply({
        content: "حدث خطأ أثناء تعديل الصلاحيات.",
        ephemeral: true
    });
}

            const embed = new EmbedBuilder()
                .setTitle("**Ticket Opened**")
                .setDescription("The ticket has been opened.")
                .setColor("Green");

            await interaction.message.edit({
                embeds: [embed],
                components: [],
            });
            
            await interaction.channel.setName(`${interaction.channel.name.replace('🔒', '🎫')}`);
            
        }
    },
};