const axios = require('axios');
const redisClient = require('../RedisClient'); // 🔁 import Redis client

const subscribeStockHandler = (socket, symbols) => {
  const symbolList = Array.isArray(symbols) ? symbols : [symbols];
  console.log(`Subscribed to symbols: ${symbolList.join(', ')}`);

  const fetchStockPrice = async () => {
    console.log("Fetching updated stock prices...");

    try {
      const cachedData = await redisClient.get(`stocks:${symbolList.join(',')}`);
      if (cachedData) {
        console.log("🔁 Using cached stock data");
        const parsed = JSON.parse(cachedData);
        parsed.forEach((data) => socket.emit('stockUpdate', data));
        return;
      }

      // Fetch fresh data if not cached
      const response = await axios.get('https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/v2/get-quotes', {
        params: { region: 'US', symbols: symbolList.join(',') },
        headers: {
          'x-rapidapi-key': process.env.RAPID_API_KEY_ID,
          'x-rapidapi-host': 'apidojo-yahoo-finance-v1.p.rapidapi.com',
        },
      });

      const results = response.data.quoteResponse.result;
      const format = (val) => val !== undefined ? Number(val).toFixed(2) : null;
      console.log("🔁 Fetched stock data from API");
      const formattedData = results.map((data) => ({
        symbol: data.symbol,
        name: data.longName || data.symbol,
        price: format(data.regularMarketPrice),
        change: format(data.regularMarketChange),
        changePercent: format(data.regularMarketChangePercent),
        open: format(data.regularMarketOpen),
        high: format(data.regularMarketDayHigh),
        low: format(data.regularMarketDayLow),
        prevClose: format(data.regularMarketPreviousClose),
        volume: data.regularMarketVolume,
        fiftyTwoWeekHigh: format(data.fiftyTwoWeekHigh),
        fiftyTwoWeekLow: format(data.fiftyTwoWeekLow),
        marketCap: data.marketCap,
        beta: format(data.beta),
        PERatio: format(data.trailingPE),
        currency: data.financialCurrency,
      }));

      // Cache for 1 hour
      await redisClient.setEx(`stocks:${symbolList.join(',')}`, 600, JSON.stringify(formattedData));

      formattedData.forEach((data) => socket.emit('stockUpdate', data));
    } catch (err) {
      console.error('Failed to fetch stock:', err.message);
    }
  };

  fetchStockPrice();

  const intervalId = setInterval(fetchStockPrice, 60 * 60 * 1000); // 1 hour
  socket.on('disconnect', () => {
    clearInterval(intervalId);
    console.log('Client disconnected');
  });
};

module.exports = subscribeStockHandler;
