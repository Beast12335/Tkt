const {
  PermissionsBitField,
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
} = require('discord.js');
const mysql = require('mysql2/promise');

module.exports = {
  async execute(interaction) {
    if (!interaction.isButton()) return;
    if (interaction.customId !== 'create') return;
    await interaction.deferReply({ephemeral: true});
    try {
      if (
        !interaction.member.permissions.has(
          PermissionsBitField.Flags.ManageServer
        ) ||
        !interaction.member.permissions.has(
          PermissionsBitField.Flags.Administrator
        )
      ) {
        return interaction.followUp({
          content: "You don't have permission to interact with this button.",
          ephemeral: true,
        });
      }

      const connection = await mysql.createConnection(process.env.DB_URL);
      const [rows] = await connection.execute(
        'SELECT * FROM ticket_setup WHERE server = ?',
        [interaction.guild.id]
      );

      const embed = interaction.message.embeds[0];
      const panelMessageButton = new ButtonBuilder()
        .setCustomId('create_1')
        .setLabel('🅰️')
        .setStyle('Primary');

      const ticketChannelButton = new ButtonBuilder()
        .setCustomId('create_2')
        .setLabel('🅱️')
        .setStyle('Primary');

      const ticketOpeningCategoryButton = new ButtonBuilder()
        .setCustomId('create_3')
        .setLabel('🙅‍♂️')
        .setStyle('Primary');

      const ticketOpeningMessageButton = new ButtonBuilder()
        .setCustomId('create_4')
        .setLabel('4️⃣')
        .setStyle('Primary');

      const autoSaveTranscriptButton = new ButtonBuilder()
        .setCustomId('create_5')
        .setLabel('5️⃣')
        .setStyle('Primary');

      const ticketTranscriptChannelButton = new ButtonBuilder()
        .setCustomId('create_6')
        .setLabel('4️⃣')
        .setStyle('Primary');

      const buttonRow = new ActionRowBuilder().addComponents(
        panelMessageButton,
        ticketChannelButton,
        ticketOpeningCategoryButton,
        ticketOpeningMessageButton,
        autoSaveTranscriptButton
      );
      const button2 = new ActionRowBuilder().addComponents(
        ticketTranscriptChannelButton
      );

      embed.setDescription(
        `I. Panel Message\nII. Ticket Channel\nIII. Ticket Opening Category\nIV. Ticket Opening Message\nV. Auto Save Transcript\nVI. Ticket Transcript Channel`
      );

      await interaction.editReply({
        embeds: [embed],
        components: [buttonRow, button2],
      });
    } catch (e) {
      console.log('Error handling create panel:', error);
    }
  },
};
