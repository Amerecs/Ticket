const { Events, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require("discord.js");
const QuickDB = require("quick.db");
const db = new QuickDB.QuickDB();
const config = require("../config.js");

module.exports = {
    name: Events.InteractionCreate,
    async execute(client, interaction) {
        if (!interaction.isModalSubmit() || interaction.customId !== "modall") return;

        const reason = interaction.fields.getTextInputValue("reason");
        const channelId = interaction.channel.id;

        const claimed = await db.get(`claim_${channelId}`);
        const ownerId = await db.get(`ticket_${channelId}`);
        const openTime = await db.get(`time_${channelId}`);
        const closeTime = `<t:${Math.floor(Date.now() / 1000)}:F>`;


        await interaction.channel.setName(interaction.channel.name.replace('🎫', '🔒'));

        const embed = new EmbedBuilder()
            .setAuthor({
                name: interaction.guild.name,
                iconURL: interaction.guild.iconURL({ dynamic: true })
            })
            .setTitle("**Ticket Closed**")
            .addFields(
                { name: "**Opened By**", value: `<@${ownerId}>`, inline: true },
                { name: "**Claimed By**", value: claimed ? `<@${claimed}>` : "No one", inline: true },
                { name: "**Closed By**", value: `<@${interaction.user.id}>`, inline: true },
                { name: "**Open Time**", value: `<t:${Math.floor(interaction.channel.createdTimestamp / 1000)}:F>`, inline: true },
                { name: "**Close Time**", value: closeTime, inline: true },
                { name: "**Close Reason**", value: reason || "No reason provided", inline: false }
            );


        const logChannel = client.channels.cache.get(config.log);
        if (logChannel) {
            logChannel.send({ embeds: [embed] }).catch(console.error);
        }


        try {
            const member = await interaction.guild.members.fetch(ownerId);
            await member.send({ embeds: [embed] });
        } catch (error) {
            console.error(`Could not DM the ticket owner (${ownerId}):`, error);
        }


        const embedClose = new EmbedBuilder()
            .setTitle("**Ticket Closed**")
            .setDescription("The ticket has been closed.");

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId("open").setLabel("فتح").setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId("delete").setLabel("حذف").setStyle(ButtonStyle.Secondary)
        );

        await interaction.reply({
            embeds: [embedClose],
            components: [row]
        });


        await interaction.channel.permissionOverwrites.set([
            {
                id: interaction.guild.id,
                deny: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
            }
        ]);
    }
};