const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const config = require('../config.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('whitelist')
        .setDescription('test')
        .addSubcommand(subcommand =>
            subcommand.setName('add').setDescription(`✅ Add a user to the whitelist`).addUserOption(option => option.setName('user').setDescription('user to add').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand.setName('remove').setDescription(`❌ Remove a user to the whitelist`).addUserOption(option => option.setName('user').setDescription('user to remove').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand.setName('list').setDescription(`📰 List of whitelisted users`)
        ),
    
    async execute(interaction) {

        if(!config.Developers.includes(interaction.user.id)) return interaction.reply({ ephemeral: true, content: `:x: Only the developer team and above can use this command.` })

        let embed = new EmbedBuilder()
        .setColor('#2c2c34')
        .setTitle(`${interaction.client.user.username} - Whitelist`)
        .setFooter({
          text: `Support server: https://discord.gg/poj`
        })
        .setTimestamp()

        let whitelist = global.whitelist.get(interaction.client.user.id)

        switch(interaction.options._subcommand) {

            case "add":
                if(whitelist?.includes(interaction.options.get('user').user.id)) return interaction.reply({ ephemeral: true, embeds: [embed.setDescription(`\`❌\` This user is already whitelisted.`)], ephemeral: true })
                else interaction.reply({ ephemeral: true, embeds: [embed.setDescription(`\`✅\` Added ${interaction.options.get('user').user} to the whitelist.`)] })
                global.whitelist.push(interaction.client.user.id, interaction.options.get('user').user.id)

            break;

            case "remove":
                if(!whitelist?.includes(interaction.options.get('user').user.id)) return interaction.reply({ ephemeral: true, embeds: [embed.setDescription(`\`❌\` This user is not whitelisted.`)], ephemeral: true })
                else interaction.reply({ ephemeral: true, embeds: [embed.setDescription(`\`✅\` Removed ${interaction.options.get('user').user} from the whitelist.`)] })
                global.whitelist.pull(interaction.client.user.id, interaction.options.get('user').user.id)
            break;

            case "list":
                interaction.reply({ ephemeral: true, embeds: [embed.setDescription(`${whitelist.length > 0 ? whitelist.map((x, i) => `\` ${i+1} \` \`${interaction.client.users.resolve(x) ? interaction.client.users.resolve(x).globalName ?? interaction.client.users.resolve(x).username : `Deleted User`}\` - \`${x}\``).join("\n") : "There are no users added to the whitelist"}`)]})
            break;

        }

    },
};
