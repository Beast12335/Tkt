const {
  PermissionsBitField,
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
} = require('discord.js');
const mysql = require('mysql2/promise');

module.exports = {
  name:'interactionCreate',
  async execute(interaction) {
    if (!interaction.isButton()) return;
    if (interaction.customId !== 'create') return;
    await interaction.deferUpdate();
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
        .setLabel(''🅰')
        .setStyle('Secondary');

      const ticketChannelButton = new ButtonBuilder()
        .setCustomId('create_2')
        .setLabel('🅱')
        .setStyle('Secondary');

      const ticketOpeningCategoryButton = new ButtonBuilder()
        .setCustomId('create_3')
        .setLabel('🅲')
        .setStyle('Secondary');

      const ticketOpeningMessageButton = new ButtonBuilder()
        .setCustomId('create_4')
        .setLabel('🅳')
        .setStyle('Secondary');

      const autoSaveTranscriptButton = new ButtonBuilder()
        .setCustomId('create_5')
        .setLabel('🅴')
        .setStyle('Secondary');

      const ticketTranscriptChannelButton = new ButtonBuilder()
        .setCustomId('create_6')
        .setLabel('🅵')
        .setStyle('Secondary');
      const staffRoleButton = new ButtonBuilder()
      .setCustomId('create_7')
      .setLabel'('🅶') 
      .setStyle('Secondary');

      const buttonRow = new ActionRowBuilder().addComponents(
        panelMessageButton,
        ticketChannelButton,
        ticketOpeningCategoryButton,
        ticketOpeningMessageButton,
        autoSaveTranscriptButton
      );
      const button2 = new ActionRowBuilder().addComponents(
        ticketTranscriptChannelButton,staffRoleButton
      );

      const emb = EmbedBuilder.from(embed).setDescription(
        'I. Ticket Channel \n `None` \n II. Ticket Category \n `None` \n III. Panel Message \n `Not set` \n IV. Ticket Opening Message\n `Not set` \n V. Staff Roles \n `Not set` \n VI. Auto Transcript \n `False` \n VII. Ticket Logs channel \n `Not set`'
      );

      await interaction.editReply({
        embeds: [emb],
        components: [buttonRow, button2],
      });
    } catch (e) {
      console.log('Error handling create panel:', e);
      await interaction.followUp({content:`Error: ${e}`});
    }
  },
};
