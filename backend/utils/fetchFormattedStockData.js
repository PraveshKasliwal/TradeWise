const axios = require('axios');
const redisClient = require('../RedisClient'); // 🔁 import Redis client

const fetchFormattedStockData = async (symbols) => {
  if (!Array.isArray(symbols)) {
    symbols = [symbols];
  }

  const results = [];
  const symbolsToFetch = [];

  for (const symbol of symbols) {
    const cached = await redisClient.get(`stock:${symbol}`);
    if (cached) {
      results.push(JSON.parse(cached));
      console.log(`Watchlist data fetcheed using redis`);
    } else {
      symbolsToFetch.push(symbol);
    }
  }

  if (symbolsToFetch.length > 0) {
    try {
      const response = await axios.get('https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/v2/get-quotes', {
        params: { region: 'US', symbols: symbolsToFetch.join(',') },
        headers: {
          'x-rapidapi-key': process.env.RAPID_API_KEY_ID,
          'x-rapidapi-host': 'apidojo-yahoo-finance-v1.p.rapidapi.com',
        },
      });

      const fetched = response.data.quoteResponse.result;
      const format = (val) => val !== undefined ? Number(val).toFixed(2) : null;

      for (const data of fetched) {
        const formatted = {
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
        };

        // Save in cache for 1 hour (3600 seconds)
        await redisClient.setEx(`stock:${data.symbol}`, 3600, JSON.stringify(formatted));

        results.push(formatted);
      }
    } catch (err) {
      console.error("API fetch failed:", err.message);
    }
  }

  return results;
};

module.exports = fetchFormattedStockData;
