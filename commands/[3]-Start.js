const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, EmbedBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');
const fetch = require('node-fetch');
const { Telegraf } = require('telegraf');

const backgroundFilePath = '../data/background.txt';
const urlFilePath = '../data/url.txt';
const titleFilePath = '../data/titles.txt';

let count = global.count

module.exports = {
    data: new SlashCommandBuilder()
        .setName('start')
        .setDescription('Fetch data and post to the webhook and Telegram'),

    async execute(interaction) {
        let whitelist = global.whitelist.get(interaction.client.user.id);
        if (!whitelist?.includes(interaction.user.id))
            return interaction.reply({ ephemeral: true, content: `:x: You do not have access to use this command.` });

        const backgrounds = fs.readFileSync(backgroundFilePath, 'utf8').trim().split('\n');
        const urls = fs.readFileSync(urlFilePath, 'utf8').trim().split('\n');
        const titles = fs.readFileSync(titleFilePath, 'utf8').trim().split('\n');

        const backgroundCount = backgrounds.length;
        const urlCount = urls.length;
        const titleCount = titles.length;

        let serverData = await global.server.get(interaction.user.id);
        const webhookURL = serverData?.find(x => x._v === "1")?.webhook || "Not Set";
        const telegramToken = serverData?.find(x => x._v === "0")?.telegram_token || "Not Set";
        const telegramChannel = serverData?.find(x => x._v === "0")?.telegram_channel || "Not Set";

        await interaction.reply({
            content: `Starting to send message to your:\n\n` +
                `**Webhook:** ${webhookURL}\n` +
                `**Telegram:** ${telegramToken} - ${telegramChannel}\n\n` +
                `I will post a total of: ${urlCount} post(s).\n\n` +
                `Currently, my database contains:\n- **Title(s):** ${titleCount}\n- **URL(s):** ${urlCount}\n- **Background(s):** ${backgroundCount}`,
            ephemeral: true
        });

        let userData = global.login.get(interaction.user.id);
        const telegramBot = new Telegraf(telegramToken);

        let currentIndex = 0;

        const sendMessage = async () => {
            if (currentIndex >= urlCount) {
                clearInterval(interval);
                await interaction.followUp({ content: 'Posting process completed!', ephemeral: true });
                return;
            }

            const background = backgrounds[currentIndex % backgroundCount];
            const title = titles[currentIndex % titleCount];
            const encodedUrlValue = encodeURIComponent(urls[currentIndex]);
            const apiToken = userData[0].api_token;
            const apiUrl = `https://publishers.ad-maven.com/api/public/content_locker?api_token=${apiToken}&title=${title}&url=${encodedUrlValue}&background=${background}`;

            try {
                const response = await fetch(apiUrl);
                const result = await response.json();
                const fullShortUrl = result.message[0].full_short;

                if (webhookURL !== "Not Set") {
                    // Create an embed with a button
                    const embed = new EmbedBuilder()
                    .setTitle(title)
                    .setDescription(`Click the link below to watch 👇\n[Link](${fullShortUrl})`)
                    .setImage(background)
                    .setColor('#0099ff');
                

                        const row = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setLabel('Click here & watch the link')
                                .setEmoji('🍑')
                                .setStyle(ButtonStyle.Link) // Button style for link
                                .setURL(fullShortUrl) // Link to your short URL
                        );                    

                    await interaction.client.channels.cache.get(webhookURL)
                        .send({ embeds: [embed], components: [row] })
                        .catch((e) => console.error('Error sending to Discord:', e));
                } else {
                    console.error('Webhook URL not found!');
                    await interaction.followUp({ content: 'Webhook URL not found!', ephemeral: true });
                }

                if (telegramToken && telegramChannel) {
                    try {
                        await telegramBot.telegram.sendPhoto(`@${telegramChannel}`, background, {
                            caption: `📸 **${title}**\n\nClick the link below to watch 👇\n[Link](${fullShortUrl})`,
                            parse_mode: 'Markdown',
                            reply_markup: {
                                inline_keyboard: [
                                    [
                                        {
                                            text: 'Click here & watch the link',
                                            url: fullShortUrl
                                        }
                                    ]
                                ]
                            }
                        });
                        console.log('Message sent to Telegram channel successfully!');
                    } catch (error) {
                        console.error('Error sending message to Telegram channel:', error);
                        await interaction.followUp({ content: `Failed to send message to Telegram: ${error.message}`, ephemeral: true });
                    }
                } else {
                    console.error('Telegram token or channel not set!');
                    await interaction.followUp({ content: 'Telegram token or channel not set!', ephemeral: true });
                }

            } catch (error) {
                console.error('Error:', error);
                await interaction.followUp({ content: `Error processing post ${currentIndex + 1}: ${error.message}`, ephemeral: true });
            }

            currentIndex++;
            count++
        };

        await sendMessage();
        const interval = setInterval(async () => {
            await sendMessage();
        }, 10000);

        setInterval(async () => {
            let veriableCounter = global.counter.get(interaction.client.user.id)
            if (veriableCounter) {      
                let total = veriableCounter + count
                let converterTotal = Math.floor(total / 2)
                global.counter.set(interaction.client.user.id, total)
                console.log("Güncel olarak paylaşılan link sayısı: " + converterTotal)
                interaction.client.channels.cache.get("1292054052825464845").wedit("1292224444235907155", { content: `# ${total}\n-# Total counter of posted links.` })
            } else {                     
                interaction.client.channels.cache.get("1292054052825464845").wsend({ content: `Link counter: 0`})
                global.counter.set(interaction.client.user.id, count)
            }
        }, 10 * 1000)
    }
}
