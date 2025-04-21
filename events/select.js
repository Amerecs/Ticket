const { Events, ChannelType, PermissionsBitField, EmbedBuilder, ButtonStyle, ButtonBuilder, ActionRowBuilder } = require('discord.js');
const config = require("../config.js");
const QuickDB = require("quick.db");
const db = new QuickDB.QuickDB();
const fs = require("fs");
const path = require("path");

module.exports = {
    name: Events.InteractionCreate,
    async execute(client, interaction) {
        if (!interaction.isStringSelectMenu()) return;

        const selectedKey = interaction.values[0];
        const section = config.sections[selectedKey];

        if (!section) {
            return interaction.reply({ content: "القسم غير موجود!", ephemeral: true });
        }

        const category = interaction.guild.channels.cache.get(section.category);

        if (!category) {
            return interaction.reply({ content: "الكاتجوري غير موجود!", ephemeral: true });
        }
        
        config.ticketNumbers++;
    const ticketNumber = config.ticketNumbers;
        
        try {
            const ticketChannel = await interaction.guild.channels.create({
                name: `🎫・${ticketNumber}`,
                type: ChannelType.GuildText,
                parent: section.category,
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: [PermissionsBitField.Flags.ViewChannel],
                    },
                    ...section.roleId.map((roleId) => ({
                        id: roleId,
                        allow: [PermissionsBitField.Flags.ViewChannel],
                    })),
                    {
                        id: interaction.user.id,
                        allow: [PermissionsBitField.Flags.ViewChannel],
                    },
                ],
            });
           
            
            const owner = interaction.user;
            const channelID = interaction.channel.id;
const admins = section.roleId.map(id => `<@&${id}>`).join(', ');
const date = new Date();
const formattedDate = `<t:${Math.floor(date.getTime() / 1000)}:F>`;
const sectionName = `${section.name}`;


const ticketEmbed = new EmbedBuilder()
  .setColor("Random")
  .setThumbnail(owner.displayAvatarURL({ format: "png" }))
  .setDescription(`
[👤] : **Ticket Owner**
${owner}

[🛡️] : **Ticket Admins**
${admins}

[📅] : **Ticket Date**
${formattedDate}

[🔢] : **Ticket Number**
${config.ticketNumbers}

[❓] : **Ticket Section**
${sectionName}
`);
            
            const row = new ActionRowBuilder()
            .addComponents(
            new ButtonBuilder()
                .setCustomId("claim")
                .setLabel("استلام")
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
            
            await db.set(`ticket_${ticketChannel.id}`, interaction.user.id);
            await db.set(`admin_${ticketChannel.id}`, section.roleId);
await db.set(`time_${ticketChannel.id}`, Math.floor(Date.now() / 1000));

            
            await ticketChannel.send({
    content: `${interaction.user} | ${section.roleId.map(id => `<@&${id}>`).join(", ")}`,
                embeds: [ticketEmbed],
                components: [row],
});

            const updatedConfig = `
module.exports = {
  "token": "${config.token}",
  "prefix": "${config.prefix}",
  "ticketNumbers": ${config.ticketNumbers},
  "banner": "${config.banner}",
"desc": "${config.desc}",
"log": "${config.log",
  "sections": ${JSON.stringify(config.sections, null, 2)}
};
`.trim();

    fs.writeFileSync(path.join(__dirname, "../config.js"), updatedConfig);
            
            await interaction.reply({
                content: `تم إنشاء التذكرة: ${ticketChannel}`,
                ephemeral: true,
            });
            

        } catch (err) {
            console.error("Error creating ticket channel:", err);
            return interaction.reply({ content: "حدث خطأ أثناء فتح التذكرة.", ephemeral: true });
        }
    },
};
