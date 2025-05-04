// Script to deploy slash commands to Discord
const fs = require('node:fs');
const path = require('node:path');
const { REST, Routes } = require('discord.js');
const config = require('./config.js');

const commands = [];
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

// Load all command data for registration
for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
  
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    
    if ('data' in command) {
      commands.push(command.data.toJSON());
    } else {
      console.log(`[WARNING] The command at ${filePath} is missing a required "data" property.`);
    }
  }
}

// Create and configure REST instance
const rest = new REST().setToken(config.token);

// Self-invoking async function to register commands
(async () => {
  try {
    console.log(`Started refreshing ${commands.length} application (/) commands.`);

    let data;
    
    if (config.guildId && config.isDevelopment) {
      // Guild-specific deployment (faster for testing)
      data = await rest.put(
        Routes.applicationGuildCommands(config.clientId, config.guildId),
        { body: commands },
      );
      console.log(`Successfully reloaded ${data.length} guild (/) commands.`);
    } else {
      // Global deployment (can take up to an hour to propagate)
      data = await rest.put(
        Routes.applicationCommands(config.clientId),
        { body: commands },
      );
      console.log(`Successfully reloaded ${data.length} global (/) commands.`);
    }
  } catch (error) {
    console.error(error);
  }
})();