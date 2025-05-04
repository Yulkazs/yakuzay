// Fix for Duplicate Commands

// 1. Create a script to delete all commands (put this in src/delete-commands.js)
const { REST, Routes } = require('discord.js');
const config = require('./config.js');

const rest = new REST().setToken(config.token);

// Self-invoking async function to delete commands
(async () => {
  try {
    console.log('Started deleting application commands.');

    // Delete guild commands if guildId is provided
    if (config.guildId) {
      await rest.put(
        Routes.applicationGuildCommands(config.clientId, config.guildId),
        { body: [] }
      );
      console.log('Successfully deleted all guild commands.');
    }

    // Delete global commands
    await rest.put(
      Routes.applicationCommands(config.clientId),
      { body: [] }
    );
    console.log('Successfully deleted all global commands.');
    
    console.log('All commands have been deleted. Run deploy-commands.js to register them again.');
  } catch (error) {
    console.error(error);
  }
})();

// 2. Run this script to delete all commands:
// node src/delete-commands.js

// 3. Make a decision: Deploy globally OR to a specific guild
// Modify src/deploy-commands.js to avoid deploying both ways:

// For testing, use ONLY guild-specific deployment:
/*
if (config.guildId) {
  data = await rest.put(
    Routes.applicationGuildCommands(config.clientId, config.guildId),
    { body: commands },
  );
  console.log(`Successfully reloaded ${data.length} guild (/) commands.`);
}
*/

// OR for production, use ONLY global deployment:
/*
data = await rest.put(
  Routes.applicationCommands(config.clientId),
  { body: commands },
);
console.log(`Successfully reloaded ${data.length} global (/) commands.`);
*/

// 4. After updating deploy-commands.js, run it again:
// node src/deploy-commands.js

// Note: Global commands can take up to an hour to propagate,
// while guild commands update almost instantly