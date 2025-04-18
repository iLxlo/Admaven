const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const config = require('../config.js');
const fetchUserData = require('../utils/fetchUserData');
const getHeaders = require('../utils/headers');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('login')
        .setDescription('Login with your AdMaven authorization token')
        .addStringOption(option =>
            option.setName('authorization')
                .setDescription('Your AdMaven authorization token')
                .setRequired(true)),
    
    async execute(interaction) {
        
        let whitelist = global.whitelist.get(interaction.client.user.id)
        if(!whitelist?.includes(interaction.user.id)) return interaction.reply({ ephemeral: true, content: `:x: You do not have access to use this command.` })

        try {
            await interaction.deferReply({ ephemeral: true });

            const userId = interaction.user.id;
            const token = interaction.options.getString('authorization');

            const headers = getHeaders(token);
            const userData = await fetchUserData(headers);

            if (!userData || userData === 500 || !userData.api_user_token) {
                return interaction.editReply({
                    content: "The provided token is invalid. Please check and try again.",
                    ephemeral: true
                });
            }
            
/*            const logins = JSON.parse(fs.readFileSync(config.LOGINS_FILE));
            logins[userId] = token;
            fs.writeFileSync(config.LOGINS_FILE, JSON.stringify(logins));*/

            let checkedLogin = global.login.get(userId)
            if(checkedLogin?.find(x => x._v === "0")) {

                let index = checkedLogin.findIndex(x => x._v === "0")
                checkedLogin[index].token = token
                checkedLogin[index].api_token = userData.api_user_token
                global.login.set(userId, checkedLogin)

                console.log(`${userId} ID kullanıcısının tokeni değişti, veritabanı güncellendi!`)

            } else {
            global.login.push(userId, { _v: "0", token: token, api_token: userData.api_user_token})
            }
            
            await interaction.editReply({
                content: `Your token has been set successfully\n|| ${token} ||\nAPI User Token: || ${userData.api_user_token} ||\nTo check your account, use /account`,
                ephemeral: true
            });
        } catch (error) {
            console.error('Error executing command:', error);
            await interaction.editReply({
                content: 'An error occurred while processing your request. Please try again later.',
                ephemeral: true
            });
        }
    },
};
