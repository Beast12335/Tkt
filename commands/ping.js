const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Check the bot\'s ping'),
  async execute(interaction) {
    await interaction.deferReply()
    const embed = new EmbedBuilder()
      .setTitle('Ping')
      .setDescription(`🏓 Pong! Latency is ${Math.round(interaction.client.ws.ping)}ms.`)
      .setColor('#00FF00'); // Green color

    try {
      await interaction.followUp({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      interaction.followUp({ content: 'An error occurred while sending the response.', ephemeral: true });
    }
  },
};
