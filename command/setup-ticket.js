const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, PermissionsBitField } = require("discord.js");
const config = require("../config.js");

module.exports = {
  name: "setup-ticket",
  async execute(message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return;

    const embed = new EmbedBuilder()
      .setAuthor({
        name: message.guild.name,
        iconURL: message.guild.iconURL({ format: "png" })
      })
      .setDescription(config.desc || "اختر القسم لفتح تذكرة")
      .setColor("Random");

    const options = Object.entries(config.sections).map(([key, section]) => ({
      label: section.name,
      value: key
    }));

    const row = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("select")
        .addOptions(options)
    );

    message.channel.send({ embeds: [embed], components: [row] });

  }
};