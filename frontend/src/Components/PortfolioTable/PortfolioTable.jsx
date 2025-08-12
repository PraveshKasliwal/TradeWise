import React from 'react';
import { useState } from 'react';
import { Table, Text, Button, Flex } from '@mantine/core';

import { useDisclosure } from '@mantine/hooks';
import BuyModal from '../BuyModal/BuyModal';
import SellModal from '../SellModal/SellModal';

const PortfolioStockTable = ({ data }) => {
  // Prepare all rows ahead of time
  // console.log(data)
  const [selectedStock, setSelectedStock] = useState(null); // track selected 
  const [sellStock, setSellStock] = useState(null);
  const [sellOpened, { open: openSell, close: closeSell }] = useDisclosure(false);

  const handleSellClick = (stock) => {
    setSellStock(stock);
    openSell();
  };

  const handleBuyClick = (stock) => {
    setSelectedStock(stock);
    open();
  };
  const [opened, { open, close }] = useDisclosure(false);
  const rows = data?.map((stock, index) => {
    const avgPrice = parseFloat(stock.purchasedPrice).toFixed(2);
    const pnl = ((stock.price - stock.purchasedPrice) * stock.quantity).toFixed(2);
    const isProfit = pnl >= 0;
    const currency = stock.currency == 'INR' ? '₹' : '$';
    // console.log("currency: ", currency)
    return (
      <Table.Tr key={index} c={'#ababab'} h={'70px'}>
        <Table.Td c={'white'}>{stock.name}</Table.Td>
        <Table.Td>{stock.stockSymbol}</Table.Td>
        <Table.Td>{currency}{avgPrice}</Table.Td>
        <Table.Td>{currency}{stock.price}</Table.Td>
        <Table.Td>{stock.quantity}</Table.Td>
        <Table.Td>
          <Text c={isProfit ? 'lightgreen' : 'salmon'}>
            {isProfit ? '+' : ''}{pnl}
          </Text>
        </Table.Td>
        <Table.Td><Button bg={'#363636'} radius={'xl'} onClick={() => handleBuyClick(stock)}>Buy More</Button></Table.Td>
        <Table.Td><Button bg={'#363636'} radius={'xl'} onClick={() => handleSellClick(stock)}>Sell</Button></Table.Td>
      </Table.Tr>
    );
  });

  return (
    <Flex>
      {opened && (
        <BuyModal
          stock={selectedStock}
          onClose={close}
          opened={opened}
        />
      )}
      {sellOpened && (
        <SellModal
          stock={sellStock}
          opened={sellOpened}
          onClose={closeSell}
        />
      )}
      <Table c={'white'}>
        <Table.Thead bg={'#363636'}>
          <Table.Tr>
            <Table.Th>Company Name</Table.Th>
            <Table.Th>Stock Symbol</Table.Th>
            <Table.Th>Average Buy Price</Table.Th>
            <Table.Th>Current Price</Table.Th>
            <Table.Th>Quantity</Table.Th>
            <Table.Th>P&amp;L (₹)</Table.Th>
            <Table.Th></Table.Th>
            <Table.Th></Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Flex>
  );
};

export default PortfolioStockTable;