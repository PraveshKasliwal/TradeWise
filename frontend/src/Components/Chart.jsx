import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';
import { Button, Group } from '@mantine/core';

const Chart = ({ symbol, lineColor }) => {
  const [data, setData] = useState([]);
  const [range, setRange] = useState('1d');
  const token = localStorage.getItem('token');

  const getInterval = (range) => {
    switch (range) {
      case '1d': return '1m';
      case '1mo': return '1d';
      case '3mo': return '1d';
      case '6mo': return '1d';
      case '1y': return '1d';
      default: return '1d';
    }
  };

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await axios.post(`${import.meta.env.VITE_APP_BACKEND_LINK}/api/stocks/chart`, {
          symbol: symbol,
          interval: getInterval(range),
          range: range
        },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

        const result = response.data.chart.result[0];
        const timestamps = result.timestamp;
        const prices = result.indicators.quote[0].close;

        const formattedData = timestamps.map((ts, index) => ({
          time: new Date(ts * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          price: prices[index]
        })).filter(p => p.price != null);

        setData(formattedData);
      } catch (error) {
        console.error("Error fetching chart data", error);
      }
    };

    fetchChartData();
  }, [symbol, range]);

  const ranges = ['1d', '1M', '3mo', '6mo', '1y'];

  return (
    <div style={{ width: '700px', height: '480px' }}>
      <ResponsiveContainer width="100%" height={435}>
        <LineChart data={data}>
          <XAxis dataKey="time" hide={false} tick={false} axisLine={false} />
          <YAxis domain={['dataMin - 1', 'dataMax + 1']} hide={true} />
          <Tooltip
            formatter={(value) => [`₹${value?.toFixed(2)}`, 'Price']}
            labelFormatter={(label) => `Time: ${label}`}
          />
          <Line type="monotone" dataKey="price" stroke={lineColor} strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>

      <Group mt="sm">
        {ranges.map((r) => (
          <Button
            key={r}
            size="xs"
            color='#363636'
            variant={r === range ? "filled" : "light"}
            onClick={() => setRange(r)}
          >
            {r}
          </Button>
        ))}
      </Group>
    </div>
  );
};

export default Chart;
