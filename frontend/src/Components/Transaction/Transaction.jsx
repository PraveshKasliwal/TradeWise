import React, { useState, useEffect } from 'react';
import { Flex, Text, Table, Loader } from '@mantine/core';
import axios from 'axios';

const Transaction = ({ symbol }) => {
  const userId = localStorage.getItem('userId');
  const [transactionData, setTransactionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchTransactionData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_APP_BACKEND_LINK}/api/user/transaction/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        let transactions = res.data.transactions || [];

        // 🔍 Filter by symbol if provided
        if (symbol) {
          transactions = transactions.filter(txn => txn.stockSymbol === symbol);
        }

        setTransactionData(transactions);
      } catch (err) {
        console.error("Error fetching transaction data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchTransactionData();
    }
  }, [userId, symbol]);

  const rows = transactionData.map((txn) => (
    <Table.Tr key={txn._id} c={'#ababab'} h={'70px'}>
      <Table.Td>{new Date(txn.transactionDate).toLocaleDateString()}</Table.Td>
      <Table.Td>{txn.stockSymbol}</Table.Td>
      <Table.Td>{txn.stockName}</Table.Td>
      <Table.Td>{txn.quantity}</Table.Td>
      <Table.Td>{txn.price.toFixed(2)}</Table.Td>
      <Table.Td>{txn.totalAmount.toFixed(2)}</Table.Td>
      <Table.Td style={{ color: txn.type === 'BUY' ? 'lightgreen' : 'salmon' }}>{txn.type}</Table.Td>
    </Table.Tr>
  ));

  return (
    <Flex direction="column" gap="md" p="md">
      <Text size="xl" fw={600} c={'white'}>
        {symbol ? `Transactions for ${symbol}` : 'All Transactions'}
      </Text>

      {loading ? (
        <Loader color="blue" />
      ) : (
        <Flex bd={'1px solid #474747'} bdrs={'15px'} style={{ overflow: 'hidden' }}>
          <Table c={'white'}>
            <Table.Thead>
              <Table.Tr bg={'#363636'}>
                <Table.Th>Date</Table.Th>
                <Table.Th>Symbol</Table.Th>
                <Table.Th>Name</Table.Th>
                <Table.Th>Qty</Table.Th>
                <Table.Th>Price</Table.Th>
                <Table.Th>Total</Table.Th>
                <Table.Th>Type</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {rows.length > 0 ? rows : (
                <Table.Tr>
                  <Table.Td colSpan={7} style={{ textAlign: 'center' }}>
                    No transactions found
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </Flex>
      )}
    </Flex>
  );
};

export default Transaction;