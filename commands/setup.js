const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField, ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require('discord.js');
const mysql = require('mysql2/promise');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription('Set up the tickets')
    .setDefaultPermission(false), // Disable by default
  async execute(interaction) {
    await interaction.deferReply()
    const userPermissions = interaction.member.permissions;
    if (!userPermissions.has(PermissionsBitField.Flags.ADMINISTRATOR) || !userPermissions.has(PermissionsBitField.Flags.ManageServer)) {
      return interaction.followUp({ content: 'You don\'t have permission to use this command.', ephemeral: true });
    }

    const connection = await mysql.createConnection(process.env.DB_URL);
    const [rows] = await connection.execute('SELECT * FROM ticket_setup WHERE server = ?', [interaction.guild.id]);

    const createButton = new ButtonBuilder()
      .setCustomId('create')
      .setLabel('Create Panel')
      .setStyle('Success');

    const editButton = new ButtonBuilder()
      .setCustomId('edit')
      .setLabel('Edit Panel Settings')
      .setStyle('Primary')
      .setDisabled(true);

    const deleteButton = new ButtonBuilder()
      .setCustomId('delete')
      .setLabel('Delete Panel')
      .setStyle('Danger')
      .setDisabled(true);

    const sendButton = new ButtonBuilder()
      .setCustomId('send')
      .setLabel('Send Panel')
      .setStyle('Secondary')
      .setDisabled(true);

    const urlButton = new ButtonBuilder()
      .setLabel('↗️')
      .setStyle('Link')
      .setURL('https://discord.gg/mulancup');

    const buttonRow = new ActionRowBuilder()
      .addComponents(createButton, editButton, deleteButton, sendButton, urlButton);

    let embedDescription;
    if (rows.length > 0) {
      editButton.setDisabled(false);
      deleteButton.setDisabled(false);
      sendButton.setDisabled(false);
      for(let i=0;i<rows.length;i++){
        embedDescription = embedDescription + `${i+1} ${rows[0].panel_name} - <#${rows[0].channel}> \n`
          }
    }else{
      embedDescription = 'Create a panel to get started';
    }

    const embed = new EmbedBuilder()
      .setTitle('Ticket Bot Advanced Setup')
      .setURL('https://discord.gg/mulancup')
      .setDescription(embedDescription)
      .setColor('Random') // Yellowish color
      .setThumbnail(interaction.guild.iconURL())
      .setFooter({
        text: interaction.guild.name,
        iconURL: interaction.guild.iconURL(),
      });

    await interaction.followUp({ embeds: [embed], components: [buttonRow]});

    setTimeout(() => {
      createButton.setDisabled(true);
      editButton.setDisabled(true);
      deleteButton.setDisabled(true);
      sendButton.setDisabled(true);

      const updatedRow = new ActionRowBuilder()
        .addComponents(createButton, editButton, deleteButton, sendButton,);

      interaction.editReply({ embeds: [embed], components: [updatedRow] });
    }, 300000); // 5 minutes (300,000 milliseconds)
  },
};
