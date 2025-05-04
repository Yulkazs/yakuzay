const { ActivityType } = require('discord.js');
const config = require('../config.js');

module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`Ready! Logged in as ${client.user.tag}`);
    
    // Set bot status and activity
    client.user.setPresence({
      activities: [{ 
        name: config.status,
        type: ActivityType.Watching 
      }],
      status: 'online',
    });
    
    // Log some stats
    console.log(`Serving ${client.guilds.cache.size} servers`);
    console.log(`Loaded ${client.commands.size} commands`);
  },
};