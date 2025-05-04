const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const path = require('path');
const config = require('../../config.js');

module.exports = {
    data: new SlashCommandBuilder()
      .setName('help')
      .setDescription('Displays help information about the bot'),
  
    async execute(interaction) {
  
      const imagePath = path.join(__dirname, '../../images/YakuzayHelp.png');
      const helpImage = new AttachmentBuilder(imagePath);
  
      const helpEmbed = new EmbedBuilder()
        .setColor(config.colors.primary)
        .setAuthor({ 
          name: 'Yakuzay Bot Help Menu', 
          iconURL: interaction.client.user.displayAvatarURL() 
        })
        .setTitle('Available Commands')
        .setDescription('Here are all the available commands:')
        .setThumbnail(interaction.client.user.displayAvatarURL())
        .setImage('attachment://YakuzayHelp.png')
        .setTimestamp()
        .setFooter({ 
          text: `Requested by ${interaction.user.username}`, 
          iconURL: interaction.user.displayAvatarURL() 
        });
  
      return await interaction.reply({
        embeds: [helpEmbed],
        files: [helpImage]
      });
    },
};