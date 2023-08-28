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
    if (interaction.customId !== 'confirm') return;
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

      const embed = interaction.message.embeds[0];
      const channel = embed.fields[0].value
      const c = interaction.client.channels.cache.get(channel)
      await c.send({content:`<@${embed.fields[1].value}> Bot creation was cancelled`});
      
      console.log(embed)
    } catch (e) {
      console.log('Error handling create panel:', e);
      await interaction.followUp({content:`Error: ${e}`});
    }
  },
};
