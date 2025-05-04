const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong and bot latency'),
  
  async execute(interaction) {
    // Start by deferring the reply
    await interaction.deferReply();
    
    // Calculate bot latency
    const botLatency = Date.now() - interaction.createdTimestamp;
    const apiLatency = Math.round(interaction.client.ws.ping);
    
    await interaction.editReply(`Pong! 🏓\nBot Latency: ${botLatency}ms\nAPI Latency: ${apiLatency}ms`);
  },
};