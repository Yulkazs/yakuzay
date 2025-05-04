const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong and bot latency'),
  
  async execute(interaction) {
    // Calculate bot latency
    const response = await interaction.reply({ 
      content: 'Pinging...', 
      withResponse: true 
    });
    
    const latency = response.createdTimestamp - interaction.createdTimestamp;
    const apiLatency = Math.round(interaction.client.ws.ping);
    
    await interaction.editReply(`Pong! 🏓\nBot Latency: ${latency}ms\nAPI Latency: ${apiLatency}ms`);
  },
};