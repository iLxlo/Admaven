const axios = require('axios');
const config = require('../config.js');

const fetchUserData = async (headers) => {
    try {
        const userResponse = await axios.get(config.API_LINKS.USER, { headers });
        const revenueResponse = await axios.get(config.API_LINKS.REVENUE, { headers });
        const paymentResponse = await axios.get(config.API_LINKS.PAYMENTS, { headers });
        const statsResponse = await axios.get(config.API_LINKS.STATS, { headers });

        const userData = userResponse.data.message;
        const revenueData = revenueResponse.data.message;
        const paymentData = paymentResponse.data.message;
        const statisticsData = statsResponse.data.message;

        return userData
    } catch (error) {
    }
};

module.exports = fetchUserData;
