const { SlashCommandBuilder } = require('@discordjs/builders');
const discord_js_1 = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('embed')
        .setDescription('Sends verify embed!')
        .addStringOption(option =>
            option.setName('title')
                .setDescription('Title for the embed')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('description')
                .setDescription('Description for the embed')
                .setRequired(true)
        ),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const title = interaction.options.getString('title');
        const description = interaction.options.getString('description');

        const embed = new discord_js_1.EmbedBuilder()
            .setTitle(title)
            .setDescription(description)
            .setColor('#3498db');

        const row = new discord_js_1.ActionRowBuilder()
            .addComponents(
                new discord_js_1.ButtonBuilder()
                    .setCustomId('skrim')
                    .setLabel('Verify')
                    .setStyle('1'),
            );

        await interaction.editReply({
            content: 'Embed Created!', // Changed from 'embeds' to 'content'
            ephemeral: true
        });

        await interaction.channel.send({
            embeds: [embed],
            components: [row]
        });
    },
};