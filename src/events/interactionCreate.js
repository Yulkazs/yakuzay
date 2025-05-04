const { ErrorType, handleCommandError } = require('../utils/errorHandler');

module.exports = {
  name: 'interactionCreate',
  once: false,
  async execute(interaction) {
    // Skip if not a command interaction
    if (!interaction.isCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      console.error(`No command matching ${interaction.commandName} was found.`);
      return;
    }

    try {
      // Check for permission requirements if they exist
      if (command.permissions) {
        const { checkPermissions } = require('../utils/errorHandler');
        const hasPermission = checkPermissions(
          interaction, 
          command.permissions.permissions || [], 
          command.permissions.roles || []
        );

        if (!hasPermission) {
          return handleCommandError(interaction, {
            requiredPermission: command.permissions.permissions?.join(', ') || 
                               command.permissions.roles?.join(', ') || 
                               'Required permissions not specified'
          }, ErrorType.PERMISSION);
        }
      }
      
      // Check for command cooldown
      if (command.cooldown) {
        const cooldownManager = require('../utils/cooldownManager');
        const { onCooldown, timeLeft } = cooldownManager.checkCooldown(
          command.data.name,
          interaction.user.id,
          command.cooldown
        );
        
        if (onCooldown) {
          return handleCommandError(interaction, {
            timeLeft: timeLeft
          }, ErrorType.COMMAND_COOLDOWN);
        }
        
        // Set cooldown if not already on cooldown
        cooldownManager.setCooldown(
          command.data.name, 
          interaction.user.id, 
          command.cooldown
        );
      }

      // Execute the command
      await command.execute(interaction);
    } catch (error) {
      console.error(`Error executing ${interaction.commandName}`);
      console.error(error);
      
      // Determine error type if possible
      let errorType = ErrorType.INTERNAL;
      
      if (error.code) {
        // Handle Discord API error codes
        switch (error.code) {
          case 10062: // Unknown interaction
          case 10008: // Unknown message
            errorType = ErrorType.INTERACTION;
            break;
          default:
            errorType = ErrorType.INTERNAL;
        }
      }
      
      // Use our error handler
      await handleCommandError(interaction, error, errorType);
    }
  },
};