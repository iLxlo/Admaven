const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const config = require('../config.js');
const getHeaders = require('../utils/headers.js');  
const fetchAccountData = require('../utils/fetchAccountData.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('account')
        .setDescription('View your AdMaven account information'),
    
    async execute(interaction) {

        let whitelist = global.whitelist.get(interaction.client.user.id)
        if(!whitelist?.includes(interaction.user.id)) return interaction.reply({ ephemeral: true, content: `:x: You do not have access to use this command.` })

        const userId = interaction.user.id;
        const logins = global.login.get(userId)

        if (!logins || !Array.isArray(logins) || logins.length === 0) {
            return interaction.reply({ content: 'You are not logged in. Please use /login to set your authorization token.', ephemeral: true });
        }
        
        const token = logins[0]?.token || undefined
    

        const headers = getHeaders(token);

        await interaction.deferReply({ ephemeral: true });

        try {
            const { description } = await fetchAccountData(headers);

            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('Account Information')
                .setDescription(description)
                .setFooter({ text: 'Your information has been retrieved successfully. | https://discord.gg/poj' });

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            await interaction.editReply({ content: 'There was an error fetching your account information.', ephemeral: true });
        }
    },
};
