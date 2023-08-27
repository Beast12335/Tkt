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
        .setLabel(' ')
        .setStyle('Secondary')
        .setEmoji('🇦');

      const ticketChannelButton = new ButtonBuilder()
        .setCustomId('create_2')
        .setLabel(' ')
        .setStyle('Secondary')
        .setEmoji('🇧');

      const ticketOpeningCategoryButton = new ButtonBuilder()
        .setCustomId('create_3')
        .setLabel(' ')
        .setStyle('Secondary')
        .setEmoji('🇨');

      const ticketOpeningMessageButton = new ButtonBuilder()
        .setCustomId('create_4')
        .setLabel(' ')
        .setStyle('Secondary')
        .setEmoji('🇩');

      const autoSaveTranscriptButton = new ButtonBuilder()
        .setCustomId('create_5')
        .setLabel(' ')
        .setStyle('Secondary')
        .setEmoji('🇪');

      const ticketTranscriptChannelButton = new ButtonBuilder()
        .setCustomId('create_6')
        .setLabel(' ')
        .setStyle('Secondary')
        .setEmoji('🇫');
      const staffRoleButton = new ButtonBuilder()
      .setCustomId('create_7')
      .setLabel(' ') 
      .setStyle('Secondary')
      .setEmoji('🇬');

      const backButton = new ButtonBuilder()
      .setCustomId('create_8')
      .setLabel('Go Back') 
      .setStyle('Danger');
      
      const saveButton = new ButtonBuilder()
      .setCustomId('create_9')
      .setLabel('Save') 
      .setStyle('Success')
      .setDisabled(true);

      const buttonRow = new ActionRowBuilder().addComponents(
        panelMessageButton,
        ticketChannelButton,
        ticketOpeningCategoryButton,
        ticketOpeningMessageButton,
        autoSaveTranscriptButton
      );
      const button2 = new ActionRowBuilder().addComponents(
        ticketTranscriptChannelButton,staffRoleButton,backButton,saveButton
      );

      const emb = EmbedBuilder.from(embed).setDescription(
        ':regional_indicator_a: **Ticket Channel:** \n `None` \n :regional_indicator_b: **Ticket Category:** \n `None` \n :regional_indicator_c: **Panel Message:** \n `Not set` \n :regional_indicator_d: **Ticket Opening Message:** \n `Not set` \n :regional_indicator_e: **Staff Roles:** \n `Not set` \n :regional_indicator_f: **Auto Transcript:** \n `False` \n :regional_indicator_g: **Ticket Logs channel:** \n `Not set`'
      );

      await interaction.editReply({
        embeds: [emb],
        components: [buttonRow, button2],
      });
      console.log(interaction.message.embeds[0])
    } catch (e) {
      console.log('Error handling create panel:', e);
      await interaction.followUp({content:`Error: ${e}`});
    }
  },
};
