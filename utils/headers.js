const getHeaders = (token) => {
    return {
        'Authorization': token,
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept-Language': 'tr,en-US;q=0.9,en;q=0.8,tr-TR;q=0.7',
        'Referer': 'https://publishers.ad-maven.com/statistics'
    };
};

module.exports = getHeaders;
