// Configuration file for Yakuzay
require('dotenv').config();

module.exports = {
  // Bot credentials from environment variables
  token: process.env.TOKEN,
  clientId: process.env.CLIENT_ID,
  guildId: process.env.GUILD_ID, // Optional - for guild-specific command deployment
  
  // Bot configuration
  prefix: '!', // For potential prefix commands if used alongside slash commands
  
  // Owner information
  ownerId: process.env.OWNER_ID || '',
  
  // Custom settings
  status: 'Yakuzay at your service!',
  activityType: 'WATCHING',

  // Colors for embeds
  colors: {
    primary: '#5865F2',   // Discord blurple
    success: '#00BA3A',   // Green
    warning: '#FEE75C',   // Yellow
    error: '#C91104',     // Red
    info: '#5865F2',      // Blurple
    embed: '#242429',     // Dark gray for embed backgrounds
    default: '#DFD0B7'    // Default color for embeds
  },
  
  // Development/production mode
  isDevelopment: process.env.NODE_ENV !== 'production',
  
  // Logging level
  logLevel: process.env.LOG_LEVEL || 'info'
};