const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set')
        .setDescription('Set up your webhook and Telegram bot'),

    async execute(interaction) {
        let whitelist = global.whitelist.get(interaction.client.user.id);
        if (!whitelist?.includes(interaction.user.id)) 
            return interaction.reply({ ephemeral: true, content: `:x: You do not have access to use this command.` });

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('connect_discord_webhook')
                .setLabel('Connect Discord Webhook')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('connect_telegram_bot')
                .setLabel('Connect a Telegram Bot')
                .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()  // New button to set description message
                .setCustomId('set_description')
                .setLabel('Set Description Message')
                .setStyle(ButtonStyle.Secondary)
        );

        await interaction.reply({
            ephemeral: true,
            content: 'Please select an option:\n-# Support server: https://discord.gg/poj',
            components: [row]
        });
    },
};
