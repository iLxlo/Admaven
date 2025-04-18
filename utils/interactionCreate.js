const fs = require('fs');
const { Events, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ButtonStyle, ButtonBuilder } = require('discord.js');
const { Telegraf } = require('telegraf');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if(interaction.isButton()) {

            if (interaction.customId === 'connect_discord_webhook') {
                const modal = new ModalBuilder()
                    .setCustomId('discord_webhook_modal')
                    .setTitle('Connect Discord Webhook');

                const channelInput = new TextInputBuilder()
                    .setCustomId('channel_id')
                    .setLabel('Enter Channel ID')
                    .setStyle(TextInputStyle.Short)
                    .setPlaceholder('Channel ID');

                const row = new ActionRowBuilder().addComponents(channelInput);
                modal.addComponents(row);

                await interaction.showModal(modal);
            }
            if (interaction.customId === 'set_description') {
                const modal = new ModalBuilder()
                    .setCustomId('description_modal')
                    .setTitle('Set Description Message');

                const descriptionInput = new TextInputBuilder()
                    .setCustomId('description_text')
                    .setLabel('Enter Description')
                    .setStyle(TextInputStyle.Paragraph)
                    .setPlaceholder('e.g., [click here to visit link]({link})')
                    .setRequired(true);

                const row = new ActionRowBuilder().addComponents(descriptionInput);
                modal.addComponents(row);

                await interaction.showModal(modal);
            }

            if (interaction.customId === 'connect_telegram_bot') {
                const modal = new ModalBuilder()
                    .setCustomId('telegram_bot_modal')
                    .setTitle('Connect Telegram Bot');

                const tokenInput = new TextInputBuilder()
                    .setCustomId('telegram_token')
                    .setLabel('Enter Telegram Bot Token')
                    .setStyle(TextInputStyle.Short)
                    .setPlaceholder('Telegram Bot Token');

                const channelInput = new TextInputBuilder()
                    .setCustomId('telegram_channel')
                    .setLabel('Enter Telegram Channel @username')
                    .setStyle(TextInputStyle.Short)
                    .setPlaceholder('@channel_username');

                const row = new ActionRowBuilder().addComponents(tokenInput);
                const row2 = new ActionRowBuilder().addComponents(channelInput);
                modal.addComponents(row, row2);

                await interaction.showModal(modal);
            }
        }

        /* Modal Handling */
        if (interaction.isModalSubmit()) {
            if (interaction.customId === 'description_modal') {
                try {
                    console.log('Modal Fields:', JSON.stringify(interaction.fields));

                    const descriptionText = interaction.fields.getTextInputValue('description_text');
                    console.log('Retrieved Description:', descriptionText);
                    global.descriptions = global.descriptions || [];

                    global.descriptions.push({
                        userId: interaction.user.id,
                        description: descriptionText,
                    });

                    console.log('Global Descriptions:', JSON.stringify(global.descriptions, null, 2));

                    await interaction.reply({
                        ephemeral: true,
                        content: `Description message saved successfully! You can use it in your posts.`,
                    });

                } catch (error) {
                    console.error('Error processing modal submission:', error);
                    await interaction.reply({
                        ephemeral: true,
                        content: `An error occurred while saving the description. Please try again.`,
                    });
                }
            }
            

            if (interaction.customId === 'telegram_bot_modal') {
                const telegramToken = interaction.fields.getTextInputValue('telegram_token');
                const telegramChannel = interaction.fields.getTextInputValue('telegram_channel');

                let checkedVeriable = global.server.get(interaction.user.id);
                if (checkedVeriable?.find(x => x._v === "0")) {
                    let index = checkedVeriable.findIndex(x => x._v === "0");
                    checkedVeriable[index].telegram_token = telegramToken;
                    checkedVeriable[index].telegram_channel = telegramChannel;
                    global.server.set(interaction.user.id, checkedVeriable);

                    console.log(`[TELEGRAM] ${interaction.user.id} ID kullanıcısının telegram token ve kanal verisi güncellendi!`);

                } else {
                    global.server.push(interaction.user.id, { _v: "0", telegram_token: telegramToken, telegram_channel: telegramChannel });
                }

                const telegramBot = new Telegraf(telegramToken);
                const botInfo = await telegramBot.telegram.getMe();

                const groupIdsToCheck = [telegramChannel]; 
                const adminGroups = [];

                for (const groupId of groupIdsToCheck) {
                    try {
                        const admins = await telegramBot.telegram.getChatAdministrators(groupId);

                        const isAdmin = admins.some(admin => admin.user.id === botInfo.id);

                        if (isAdmin) {
                            const groupInfo = await telegramBot.telegram.getChat(groupId);
                            adminGroups.push(groupInfo.title);
                        }
                    } catch (error) {
                        console.error(`Error fetching group: ${groupId}`, error);
                    }
                }

                const groupsList = adminGroups.length ? adminGroups.join('\n- ') : 'No groups with admin permissions found';
                const groupsCount = adminGroups.length;

                await interaction.update({
                    content: `Telegram bot connected successfully as \`${botInfo.username}\` with admin permissions in the following groups:\n- ${groupsList}.\nTelegram channel set to: \`${telegramChannel}\``,
                    ephemeral: true,
                });

                const announcementChannelId = '1292069088310460426';
                const announcementChannel = interaction.client.channels.cache.get(announcementChannelId);

                if (announcementChannel) {
                    await announcementChannel.send(`:white_check_mark: Successfully connected the Telegram bot \`${botInfo.username}\` with admin permissions in the following groups (${groupsCount}):\n- ${groupsList}`);
                } else {
                    console.error('Announcement channel not found!');
                }
            }
            
        }
    }
};
