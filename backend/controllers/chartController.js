const axios = require('axios');

exports.getChart =  async (req, res) => {
    const symbol = req.params.symbol;
    const rangeParam = req.query.range || '1D';

    // map frontend range to Yahoo Finance API params
    const rangeMap = {
        '1D': { range: '1d', interval: '1m' },
        '1M': { range: '1mo', interval: '1d' },
        '6M': { range: '6mo', interval: '1d' },
        '1Y': { range: '1y', interval: '1d' },
        'ALL': { range: 'max', interval: '1wk' }
    };

    const { range, interval } = rangeMap[rangeParam] || rangeMap['1D'];

    try {
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=${interval}&range=${range}`;
        // console.log(symbol)
        const response = await axios.get(url);
        const data = response.data;

        if (!data.chart || data.chart.error) {
            return res.status(500).json({ error: 'Error fetching data from Yahoo' });
        }

        const timestamps = data.chart.result[0].timestamp;
        const prices = data.chart.result[0].indicators.quote[0].close;

        const chartData = timestamps.map((time, index) => {
            // formatting time according to interval
            const date = new Date(time * 1000);
            const timeLabel =
                interval === '1m'
                    ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : date.toLocaleDateString();

            return {
                time: timeLabel,
                price: prices[index]
            };
        });

        res.json(chartData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}