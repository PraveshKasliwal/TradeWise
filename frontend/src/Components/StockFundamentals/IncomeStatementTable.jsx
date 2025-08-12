import React, { useEffect, useState } from 'react';
import { Table, Loader, Flex, Text } from '@mantine/core';
import axios from 'axios';

const IncomeStatementTable = ({ symbol }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_APP_BACKEND_LINK}/api/stocks/fundamentals/income/${symbol}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      .then((res) => setData(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [symbol]);

  const formatBillion = (num) => {
    if (!num || isNaN(num)) return '-';
    return `${(Number(num) / 1_000_000_000).toFixed(2)}B`;
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" my="xl">
        <Loader size="lg" />
      </Flex>
    );
  }

  if (!data.length) {
    return (
      <Flex justify="center" align="center" my="xl">
        <Text c="dimmed">No income data available.</Text>
      </Flex>
    );
  }

  return (
    <Table withTableBorder verticalSpacing="sm" fontSize="sm" ta={'center'}>
      <Table.Thead>
        <Table.Tr>
          <Table.Th ta={'center'}>Year</Table.Th>
          <Table.Th ta={'center'}>Total Revenue</Table.Th>
          <Table.Th ta={'center'}>Gross Profit</Table.Th>
          <Table.Th ta={'center'}>Operating Income</Table.Th>
          <Table.Th ta={'center'}>Net Income</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {data.map((report) => (
          <Table.Tr key={report.fiscalDateEnding}>
            <Table.Td>{new Date(report.fiscalDateEnding).getFullYear()}</Table.Td>
            <Table.Td>{formatBillion(report.totalRevenue)}</Table.Td>
            <Table.Td>{formatBillion(report.grossProfit)}</Table.Td>
            <Table.Td>{formatBillion(report.operatingIncome)}</Table.Td>
            <Table.Td>{formatBillion(report.netIncome)}</Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
};

export default IncomeStatementTable;
