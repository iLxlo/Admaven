const axios = require('axios');
const config = require('../config.js');

const fetchAccountData = async (headers) => {
    try {
        const userResponse = await axios.get(config.API_LINKS.USER, { headers });
        const revenueResponse = await axios.get(config.API_LINKS.REVENUE, { headers });
        const paymentResponse = await axios.get(config.API_LINKS.PAYMENTS, { headers });
        const statsResponse = await axios.get(config.API_LINKS.STATS, { headers });

        const userData = userResponse.data.message;
        const revenueData = revenueResponse.data.message;
        const paymentData = paymentResponse.data.message;
        const statisticsData = statsResponse.data.message;

        const linkLockerIds = Object.entries(statisticsData.tags_names_map)
            .filter(([id, name]) => name.includes('My Link Locker'))
            .map(([id, name]) => `\`${id} ${name.replace(id, '').trim()}\``)
            .join('\n') || 'No Link Locker IDs found';
            
        const paymentInfo = paymentData[0];
        const description = `
        # **User Info:** 
        **Username:** \`${userData.first_name || 'N/A'} ${userData.last_name || ''}\`
        **Email:** || \`${userData.username || 'N/A'}\` ||
        **API User Token:** || \`${userData.api_user_token || 'N/A'}\` || 
    
        # **Revenue Info:**
        **Yesterday's Revenue:** \`$ ${revenueData.revenue_yesterday.toFixed(2) || 'N/A'}\`
        **This Month Revenue:** \`$ ${revenueData.revenue_this_month.toFixed(2) || 'N/A'}\`
        **Last Month Revenue:** \`$ ${revenueData.revenue_last_month.toFixed(2) || 'N/A'}\`
        **Overall Revenue:** \`$ ${revenueData.revenue_overall.toFixed(2) || 'N/A'}\`
        
        # **Payment Info:**
        **Payment Email:** \`${paymentInfo.payment_email || 'N/A'}\`
        **Payment Period:** \`${paymentInfo.payment_period || 'N/A'}\`
    
        # **All IDs:**
        ${linkLockerIds}
    `;    
        console.log(userResponse);
        return { description };
    } catch (error) {
        console.error('Error fetching data:', error);
        throw new Error('Error fetching account data');
    }
};

module.exports = fetchAccountData;
