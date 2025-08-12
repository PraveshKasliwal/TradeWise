const axios = require('axios');

exports.getStockData = async (req, res) => {
  const { symbol } = req.params;
  // console.log(symbol);
  const fetchStock = async (sym) => {
    const options = {
      method: 'GET',
      url: 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/v2/get-quotes',
      params: {
        region: 'US',
        symbols: sym
      },
      headers: {
        'x-rapidapi-key': process.env.RAPID_API_KEY_ID,
        'x-rapidapi-host': 'apidojo-yahoo-finance-v1.p.rapidapi.com'
      }
    };

    return await axios.request(options);
  };

  try {
    let response;
    try {
      response = await fetchStock(symbol);
    } catch (err) {
      console.log('here is the error:', err);
    }

    const data = response.data.quoteResponse.result?.[0];

    if (!data) {
      return res.status(404).json({
        message: `Stock data for symbol '${symbol}' not found.`,
      });
    }

    const format = (value) => value !== undefined ? Number(value).toFixed(2) : null;

    res.json({
      symbol: data.symbol,
      name: data.longName || symbol,
      price: format(data.regularMarketPrice),
      change: format(data.regularMarketChange),
      changePercent: format(data.regularMarketChangePercent),
      open: format(data.regularMarketOpen),
      high: format(data.regularMarketDayHigh),
      low: format(data.regularMarketDayLow),
      prevClose: format(data.regularMarketPreviousClose),
      volume: data.regularMarketVolume || null,
      fiftyTwoWeekHigh: format(data.fiftyTwoWeekHigh),
      fiftyTwoWeekLow: format(data.fiftyTwoWeekLow),
      marketCap: data.marketCap,
      beta: format(data.beta),
      PERatio: format(data.trailingPE),
      currency: data.financialCurrency || null,
      // industry: summary.industryDisp,
      // sector: summary.sectorDisp,
      // info: summary.longBusinessSummary
    });

  } catch (err) {
    res.status(500).json({
      message: "Error fetching stock data from Yahoo Finance.",
      error: err.message
    });
  }
};

exports.getMultipleStockData = async (req, res) => {
  const { symbols } = req.body;
  // console.log("Received symbols:", symbols);

  if (!Array.isArray(symbols) || symbols.length === 0) {
    return res.status(400).json({
      message: "No stock symbols provided",
    });
  }

  const fetchStock = async (symbols) => {
    const options = {
      method: 'GET',
      url: 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/v2/get-quotes',
      params: {
        region: 'US',
        symbols: symbols.join(','),
      },
      headers: {
        'x-rapidapi-key': process.env.RAPID_API_KEY_ID,
        'x-rapidapi-host': 'apidojo-yahoo-finance-v1.p.rapidapi.com',
      },
    };

    try {
      return await axios.request(options);
    } catch (err) {
      console.error("Yahoo API Error:", err.response?.data || err.message);
      throw err; // rethrow for catch block
    }
  };

  try {
    const response = await fetchStock(symbols);
    const result = response.data.quoteResponse.result;
    const format = (value) => (value !== undefined ? Number(value).toFixed(2) : null);

    const formatted = result.map((data) => ({
      symbol: data.symbol,
      name: data.longName || data.symbol,
      price: format(data.regularMarketPrice),
      change: format(data.regularMarketChange),
      changePercent: format(data.regularMarketChangePercent),
      open: format(data.regularMarketOpen),
      high: format(data.regularMarketDayHigh),
      low: format(data.regularMarketDayLow),
      prevClose: format(data.regularMarketPreviousClose),
      volume: data.regularMarketVolume || null,
      fiftyTwoWeekHigh: format(data.fiftyTwoWeekHigh),
      fiftyTwoWeekLow: format(data.fiftyTwoWeekLow),
      marketCap: data.marketCap,
      beta: format(data.beta),
      PERatio: format(data.trailingPE),
      currency: data.financialCurrency || null,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Internal Server Error:", err);
    res.status(500).json({
      message: "Failed to fetch stock data in bulk.",
      error: err.message,
    });
  }
};

exports.getSearchStock = async (req, res) => {
  const { searchField } = req.body;

  const fetchStock = async (symbol) => {
    const options = {
      method: 'GET',
      url: 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/auto-complete',
      params: {
        region: 'US',
        q: symbol
      },
      headers: {
        'x-rapidapi-key': process.env.RAPID_API_KEY_ID,
        'x-rapidapi-host': 'apidojo-yahoo-finance-v1.p.rapidapi.com'
      }
    };

    try {
      return await axios.request(options);
    } catch (err) {
      console.error("Yahoo API Error:", err.response?.data || err.message);
      throw err;
    }
  };

  try {
    const response = await fetchStock(searchField);
    const data = response.data.quotes;
    res.json(data);
  } catch (err) {
    console.error("Internal Server Error:", err);
    res.status(500).json({
      message: "Failed to fetch stock suggestions.",
      error: err.message,
    });
  }
};

exports.getStockChartData = async (req, res) => {
  try {
    const { symbol, interval, range } = req.body;

    const response = await axios.get(
      "https://yh-finance.p.rapidapi.com/stock/v3/get-chart",
      {
        params: {
          interval,
          symbol,
          range,
          region: "US",
        },
        headers: {
          "x-rapidapi-key": process.env.RAPID_API_KEY_ID,
          "x-rapidapi-host": "yh-finance.p.rapidapi.com"
        }
      }
    );


    res.json(response.data);
  } catch (error) {
    console.error("Backend error:", error.message);
    res.status(500).json({ error: "Failed to fetch chart data" });
  }
};

exports.getIncomeStatement = async (req, res) => {
  const { symbol } = req.params;
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
  console.log(`Fetching income statement for ${symbol} using API key: ${apiKey}`);

  try {
    const response = await axios.get('https://www.alphavantage.co/query', {
      params: { function: 'INCOME_STATEMENT', symbol, apikey: apiKey }
    });

    // console.log(`response: ${JSON.stringify(response.data, null, 2)}`);

    // console.log(`response: ${JSON.stringify(response.data, null, 2)}`)
    res.json(response.data.annualReports.slice(0, 4)); // latest 4 years :contentReference[oaicite:2]{index=2}
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch income data' });
  }
};

// exports.getNiftyData = async (req, res) => {
//   try {
//     const response = await axios.get(
//       'https://query1.finance.yahoo.com/v7/finance/quote',
//       { params: { symbols: '^NSEI' } }
//     );

//     const data = response.data.quoteResponse.result[0];

//     if (!data) {
//       return res.status(404).json({ message: "NIFTY data not found." });
//     }

//     res.json({
//       symbol: data.symbol,
//       name: data.shortName,
//       price: data.regularMarketPrice,
//       change: data.regularMarketChange,
//       changePercent: data.regularMarketChangePercent
//     });
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching NIFTY data.", error: err.message });
//   }
// };