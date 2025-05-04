const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const config = require('../config.js');

/**
 * Error types for custom error handling
 */
const ErrorType = {
  PERMISSION: 'PERMISSION',       // User lacks permissions
  COMMAND_COOLDOWN: 'COOLDOWN',   // Command on cooldown
  INVALID_ARGUMENT: 'ARGUMENT',   // Invalid command arguments
  API_ERROR: 'API',               // External API failure
  INTERNAL: 'INTERNAL',           // Internal bot error
  INTERACTION: 'INTERACTION'      // Discord interaction error
};

/**
 * Handles different types of errors during command execution
 * @param {Object} interaction - Discord interaction object
 * @param {Error|Object} error - Error object or custom error object
 * @param {string} [errorType=ErrorType.INTERNAL] - Type of error from ErrorType enum
 */
async function handleCommandError(interaction, error, errorType = ErrorType.INTERNAL) {
  console.error(`Error in command ${interaction.commandName}:`, error);
  
  // Create base error embed
  const errorEmbed = new EmbedBuilder()
    .setColor(config.colors.error)
    .setTitle('Error')
    .setTimestamp()
    .setFooter({ 
      text: interaction.client.user.username, 
      iconURL: interaction.client.user.displayAvatarURL() 
    });
  
  // Customize based on error type
  switch (errorType) {
    case ErrorType.PERMISSION:
      errorEmbed
        .setTitle('Permission Denied')
        .setDescription('You do not have permission to use this command.')
        .addFields({ 
          name: 'Required Permission', 
          value: error.requiredPermission || 'Moderator role' 
        });
      break;
      
    case ErrorType.COMMAND_COOLDOWN:
      errorEmbed
        .setTitle('Command on Cooldown')
        .setDescription(`This command is on cooldown.`)
        .addFields({ 
          name: 'Try Again', 
          value: `You can use this command again in ${error.timeLeft || 'a few'} seconds.` 
        });
      break;
      
    case ErrorType.INVALID_ARGUMENT:
      errorEmbed
        .setTitle('Invalid Arguments')
        .setDescription('The command was used with invalid arguments.')
        .addFields({ 
          name: 'Details', 
          value: error.message || 'Please check the command usage and try again.' 
        });
      break;
      
    case ErrorType.API_ERROR:
      errorEmbed
        .setTitle('External Service Error')
        .setDescription('There was an error with an external service.')
        .addFields({ 
          name: 'Details', 
          value: error.message || 'Please try again later.' 
        });
      break;
        
    case ErrorType.INTERACTION:
      errorEmbed
        .setTitle('Interaction Failed')
        .setDescription('There was an error processing your request.')
        .addFields({ 
          name: 'Details', 
          value: error.message || 'Please try again later.' 
        });
      break;
      
    case ErrorType.INTERNAL:
    default:
      errorEmbed
        .setTitle('Bot Error')
        .setDescription('An internal error occurred while executing this command.')
        .addFields({ 
          name: 'What happened?', 
          value: 'This issue has been logged. Please try again later.' 
        });
      break;
  }
  
  // Send the error message
  try {
    // Check if interaction can be replied to
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ embeds: [errorEmbed], ephemeral: true });
    } else {
      await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
  } catch (replyError) {
    console.error('Failed to send error message:', replyError);
  }
}

/**
 * Checks if a user has the required permissions for a command
 * @param {Object} interaction - Discord interaction object
 * @param {Array<string>} requiredPermissions - Array of Discord permission flags
 * @param {Array<string>} [requiredRoles=[]] - Array of role IDs or names
 * @returns {boolean} Whether user has permission
 */
function checkPermissions(interaction, requiredPermissions = [], requiredRoles = []) {
  const member = interaction.member;
  
  // Always allow the bot owner
  if (interaction.user.id === config.ownerId) {
    return true;
  }
  
  // Check for Discord permissions
  if (requiredPermissions.length > 0) {
    const missingPermissions = requiredPermissions.filter(
      permission => !member.permissions.has(PermissionsBitField.Flags[permission])
    );
    
    if (missingPermissions.length === 0) {
      return true;
    }
  }
  
  // Check for roles if specified
  if (requiredRoles.length > 0) {
    const hasRole = requiredRoles.some(roleId => {
      // Check if it's a role ID or name
      if (isNaN(roleId)) {
        // It's a role name
        return member.roles.cache.some(role => role.name.toLowerCase() === roleId.toLowerCase());
      } else {
        // It's a role ID
        return member.roles.cache.has(roleId);
      }
    });
    
    if (hasRole) {
      return true;
    }
  }
  
  // If no permissions or roles match, and requiredPermissions or requiredRoles arrays are not empty,
  // then the user doesn't have permission
  return (requiredPermissions.length === 0 && requiredRoles.length === 0);
}

module.exports = {
  ErrorType,
  handleCommandError,
  checkPermissions
};