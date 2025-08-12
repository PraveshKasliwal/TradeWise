import axios from 'axios';
import { useState } from 'react';
import { Flex, Modal, Button, Text, NumberInput, Box } from '@mantine/core';

import styles from './BuyModal.module.css';

const BuyModal = ({ opened, onClose, stock }) => {
  const [stockCount, setStockCount] = useState(1);
  // console.log(stock);

  const rawTotal = Number(stock?.price) * Number(stockCount);
  const total = rawTotal.toFixed(2);

  const rawFee = Math.max(20, rawTotal * 0.02);
  const platformFee = rawFee.toFixed(2);

  const finalTotal = (rawTotal + rawFee).toFixed(2);
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  const handleBuy = async () => {
    try {
      const transactionData = {
        userId, // Get this from context/auth
        stockSymbol: stock.symbol ?? stock.stockSymbol,
        stockName: stock.name,
        quantity: Number(stockCount),
        price: Number(stock.price),
        currency: stock.currency,
      };

      const res = await axios.post(`${import.meta.env.VITE_APP_BACKEND_LINK}/api/transaction/buy`, transactionData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.data.success) {
        alert('Buy successful!');
        onClose();
      } else {
        alert(res.data.message || 'Transaction failed');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred during the transaction');
    }
  };


  const currency = stock.currency === 'INR' ? '₹' : '$';
  return (
    <Modal
      opened={opened}
      title='Buy Stock'
      onClose={onClose}
      centered
      size="md"
      classNames={{
        content: styles.modalContent,
        header: styles.modalHeader
      }}
    // styles={{
    //   content: {
    //     backgroundColor: '#1a1a1a',
    //   },
    //   header: {
    //     color: 'white',
    //     backgroundColor: '#1a1a1a',
    //   },
    // }}
    >
      <Flex direction="column" gap={10}>
        <Text c="white">
          Stock: {stock?.name} ({stock?.symbol})
        </Text>
        <Text c={'white'}>
          {stock.price}
        </Text>

        <NumberInput
          value={stockCount}
          onChange={(value) => setStockCount(value)}
          label="Enter Qty."
          placeholder="Enter quantity"
          min={1}
          allowNegative={false}
          allowDecimal={false}
          classNames={{
            wrapper: styles.numberInputWrapper,
            input: styles.numberInputInput,
            label: styles.numberInputLabel,
            section: styles.numberInputSection
          }}
        // styles={{
        //   wrapper: {
        //     borderRadius: '20px',
        //   },
        //   input: {
        //     borderRadius: '20px',
        //     backgroundColor: '#363636',
        //     border: 'none',
        //     color: 'white',
        //     paddingLeft: '15px',
        //   },
        //   label: {
        //     fontWeight: 400,
        //     color: '#696969',
        //   },
        //   section: {
        //     border: 'none',
        //   },
        // }}
        />

        <Flex w={'100%'} c={'white'} direction={'column'} gap={5}>
          <Flex w={'100%'} justify={'space-between'}>
            <Text c="white">Total</Text>
            <Text>{currency}{total}</Text>
          </Flex>
          <Flex w={'100%'} justify={'space-between'}>
            <Text c="white">Platform Fee</Text>
            <Text>{currency}{platformFee}</Text>
          </Flex>
          <Box bd={'1px white solid'}></Box>
          <Flex w={'100%'} justify={'space-between'}>
            <Text c="white">Total</Text>
            <Text>{currency}{finalTotal}</Text>
          </Flex>
        </Flex>

        <Button
          bg="#363636"
          fw={400}
          radius="xl"
          w="20%"
          onClick={handleBuy}
        >
          BUY
        </Button>
      </Flex>
    </Modal>
  );
};

export default BuyModal;
