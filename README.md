<details type="reasoning" done="true" duration="1">
<summary>Thought for 1 seconds</summary>
> Alright, I'll create a README.md file for the AdMaven Auto Poster project. Let me organize the structure:
> 
> 1. Project logo/banner
> 2. Introduction
> 3. Features
> 4. Setup instructions 
> 5. Configuration
> 6. Usage guide
> 7. Commands
> 8. Troubleshooting
> 9. FAQ
> 10. Support
> 11. License
> 
> I'll format it with proper Markdown syntax, including code blocks, tables, lists, and emphases where appropriate.
> 
> Let's create a comprehensive README.md:
</details>
# AdMaven Auto Poster

<p align="center">
  <img src="https://i.imgur.com/YourLogoHere.png" alt="AdMaven Auto Poster Logo" width="500"/>
  <br>
  <b>Automated Discord & Telegram Posting System for AdMaven Publishers</b>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#installation">Installation</a> •
  <a href="#configuration">Configuration</a> •
  <a href="#usage">Usage</a> •
  <a href="#commands">Commands</a> •
  <a href="#support">Support</a>
</p>

<p align="center">
  <a href="https://discord.gg/poj">
    <img src="https://img.shields.io/discord/YourDiscordServerID?color=5865F2&logo=discord&logoColor=white" alt="Discord">
  </a>
  <img src="https://img.shields.io/badge/version-1.0.0-blue.svg" alt="Version">
  <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License">
</p>

## 🌟 Features

- **Multi-platform Posting**: Automatically post to Discord and Telegram simultaneously
- **Content Management**: Manage URLs, titles, backgrounds, and descriptions 
- **Customizable Templates**: Fully customize how your posts appear
- **Advanced Scheduling**: Set up complex posting schedules to maximize engagement
- **Analytics Integration**: Direct integration with AdMaven statistics API
- **Webhook Support**: Post directly to Discord via webhooks
- **User-friendly Interface**: Simple commands and elegant console display

## 📥 Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v16.x or higher)
- Discord Bot Token
- Telegram Bot Token (optional, for Telegram posting)
- AdMaven Publisher Account

### Quick Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/admaven-auto-poster.git
   cd admaven-auto-poster
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure the bot**
   Create a `config.js` file in the root directory:
   ```javascript
   module.exports = {
       DISCORD_TOKEN: 'YOUR_DISCORD_BOT_TOKEN',
       API_LINKS: {
           STATS: 'https://publishers.ad-maven.com/api/statistics_filters',
           USER: 'https://publishers.ad-maven.com/api/user',
           REVENUE: 'https://publishers.ad-maven.com/api/revenue',
           PAYMENTS: 'https://publishers.ad-maven.com/api/user_payment_method'
       },
       LOGINS_FILE: './logins.json',
       Developers: ["YOUR_DISCORD_USER_ID", "ANOTHER_ADMIN_ID"]
   };
   ```

4. **Start the bot**
   ```bash
   node index.js
   ```

## ⚙️ Configuration

### AdMaven Credentials

You'll need to configure your AdMaven authentication token using the bot's `/login` command.

### Content Files

The bot uses several content files that you can customize:

- **url.txt**: Contains MEGA.nz links to be shared in posts (800+ links included by default)
- **titles.txt**: Custom titles for your posts
- **backgrounds.txt**: URLs of background images for your posts
- **descriptions.txt**: Custom descriptions for your posts

### Advanced Configuration

For advanced users, you can modify the following files:
- `Database/settingsData.json`: Configure posting intervals, message templates, etc.
- `Database/serverData.json`: Server-specific configurations

## 🚀 Usage

### First-time Setup

1. **Login to AdMaven**
   ```
   /login your_admaven_auth_token
   ```

2. **Configure Posting Destinations**
   ```
   /set
   ```
   This will prompt you to set up:
   - Discord webhook URL
   - Telegram bot token and chat ID
   - Post description templates

3. **Start Posting**
   ```
   /start
   ```

### Content Management

- Add MEGA.nz links to `url.txt` (one per line)
- Add titles to `titles.txt` (one per line)
- Add background image URLs to `backgrounds.txt` (one per line)

The bot will randomly select from these files to create varied posts.

## 🔥 Commands

| Command | Description | Usage |
|---------|-------------|-------|
| `/login` | Configure AdMaven authentication | `/login your_auth_token` |
| `/account` | View your AdMaven account details | `/account` |
| `/set` | Configure posting settings | `/set` |
| `/start` | Start the posting process | `/start` |
| `/whitelist` | Manage whitelisted users | `/whitelist add/remove user_id` |

## 🔧 Troubleshooting

### Common Issues

- **Bot not responding to commands**: Ensure your Discord bot has proper permissions and the `applications.commands` scope
- **Posting fails**: Verify your webhook URLs and auth tokens are correct
- **No content being posted**: Check that your content files (url.txt, titles.txt, etc.) are properly formatted and not empty

### Logs

Check the console output for detailed logs and error messages.

## ❓ FAQ

**Q: How frequently does the bot post?**  
A: You can configure posting intervals in the settings using the `/set` command.

**Q: Can I use this with multiple AdMaven accounts?**  
A: Yes, you can switch between accounts using the `/login` command.

**Q: Is this approved by AdMaven?**  
A: This is an unofficial tool. Make sure to comply with AdMaven's terms of service.

## 📞 Support

Need help? Join our Discord server for support:

[![Discord Banner](https://discordapp.com/api/guilds/YourDiscordServerID/widget.png?style=banner2)](https://discord.gg/poj)

## 📃 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Developed with ❤️ by <a href="https://github.com/ilxlo">ilxlo</a>
</p>
