/**
 * Simple cooldown manager for commands
 */
class CooldownManager {
    constructor() {
      // Map structure: { 'commandName-userId': timestamp }
      this.cooldowns = new Map();
    }
    
    /**
     * Check if a command is on cooldown for a user
     * @param {string} commandName - Name of the command
     * @param {string} userId - User ID
     * @param {number} cooldownSeconds - Cooldown time in seconds
     * @returns {Object} Object with onCooldown status and timeLeft
     */
    checkCooldown(commandName, userId, cooldownSeconds) {
      const key = `${commandName}-${userId}`;
      const now = Date.now();
      const cooldownExpiration = this.cooldowns.get(key);
      
      // If no cooldown or cooldown has expired
      if (!cooldownExpiration || now >= cooldownExpiration) {
        return { 
          onCooldown: false, 
          timeLeft: 0 
        };
      }
      
      // Calculate remaining time
      const timeLeft = Math.ceil((cooldownExpiration - now) / 1000);
      return { 
        onCooldown: true, 
        timeLeft 
      };
    }
    
    /**
     * Set cooldown for a command and user
     * @param {string} commandName - Name of the command
     * @param {string} userId - User ID
     * @param {number} cooldownSeconds - Cooldown time in seconds
     */
    setCooldown(commandName, userId, cooldownSeconds) {
      const key = `${commandName}-${userId}`;
      const now = Date.now();
      this.cooldowns.set(key, now + (cooldownSeconds * 1000));
    }
    
    /**
     * Reset cooldown for a command and user
     * @param {string} commandName - Name of the command
     * @param {string} userId - User ID
     */
    resetCooldown(commandName, userId) {
      const key = `${commandName}-${userId}`;
      this.cooldowns.delete(key);
    }
  }
  
  // Create a singleton instance
  const cooldownManager = new CooldownManager();
  
  module.exports = cooldownManager;