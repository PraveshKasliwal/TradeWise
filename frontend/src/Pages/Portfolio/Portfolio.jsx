import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import { Flex } from '@mantine/core';
import { Flex, LoadingOverlay } from '@mantine/core';


import SearchPanel from '../../Components/SearchPanel';
import NiftyList from '../../Components/NiftyList';
import PortfolioSummary from '../../Components/PortfolioSummary/PortfolioSummary';
import PortfolioStockTable from '../../Components/PortfolioTable/PortfolioTable';
import Transaction from '../../Components/Transaction/Transaction';

import './Portfolio.css';

const Portfolio = () => {
  const [detailedPortfolio, setDetailedPortfolio] = useState([]);
  const userId = localStorage.getItem('userId');
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        setLoading(true); // Start loader

        if (!userId) return;

        const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_LINK}/api/user/portfolio/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const userPortfolio = response.data.userPortfolio;

        if (userPortfolio.length === 0) {
          setDetailedPortfolio([]);
          setLoading(false);
          return;
        }

        const symbols = userPortfolio.map((item) => item.stockSymbol);

        const stockRes = await axios.post(`${import.meta.env.VITE_APP_BACKEND_LINK}/api/stocks/bulk`, { symbols }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const fullStockData = stockRes.data;

        const mapped = userPortfolio.map((item) => {
          const stockInfo = fullStockData.find((s) => s.symbol === item.stockSymbol) || {};
          return {
            ...item,
            name: stockInfo.name || item.stockSymbol,
            price: parseFloat(stockInfo.price) || 0,
            currency: stockInfo.currency || 'N/A',
          };
        });

        setDetailedPortfolio(mapped);
      } catch (err) {
        console.error('Error fetching portfolio:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, [userId]);

  return (
    <div style={{ position: 'relative' }}>
      <LoadingOverlay
        visible={loading}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 2, backgroundColor: '#1a1a1a' }}
        loaderProps={{ color: '#04b488', size: 'lg' }}
      />
      <Flex direction='column' gap={20} miw={'100%'} maw={'100%'} w={'100%'}>
        <Flex>
          <SearchPanel />
        </Flex>
        <NiftyList />
        <Flex w={'70%'} direction={'column'} gap={20}>
          <PortfolioSummary portfolio={detailedPortfolio} />
          <Flex bd={'1px solid #474747'} bdrs={'15px'} style={{ overflow: 'hidden' }}>
            <PortfolioStockTable data={detailedPortfolio} />
          </Flex>
          <Flex>
            <Transaction />
          </Flex>
        </Flex>
      </Flex>
    </div>
  );
};

export default Portfolio;