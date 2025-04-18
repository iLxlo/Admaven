const mongoose = require('mongoose')

const User = mongoose.Schema({

    id: { type: String, required: true },
    Webhooks: { type: Array, default: [] },
    Telegram: { type: Array, default: [] }

    /* 
    Telegram.BotToken
    Telegram.BotChannel tek veri iki özellik </3
    */

})

module.exports = mongoose.model("userData", )