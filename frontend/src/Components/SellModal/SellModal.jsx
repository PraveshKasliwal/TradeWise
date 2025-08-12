import { Modal, Button, Flex, NumberInput, Text } from '@mantine/core';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SellModal = ({ opened, onClose, stock }) => {
  const navigate = useNavigate();
  const [sellQty, setSellQty] = useState(1);
  const avgPrice = stock?.purchasedPrice;
  const currentPrice = stock?.price;
  const profitLoss = ((currentPrice - avgPrice) * sellQty).toFixed(2);
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');
  // console.log("SellModal stock:", stock);
  const handleSell = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_APP_BACKEND_LINK}/api/transaction/sell`, {
        userId,
        stockSymbol: stock.stockSymbol ?? stock.symbol,
        stockName: stock.name,
        quantity: sellQty,
        price: currentPrice,
        currency: stock.currency,
      },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

      if (res.data.success) {
        alert('Sell successful!');
        window.location.reload();
        onClose();
      } else {
        alert(res.data.message || 'Sell failed');
      }
    } catch (err) {
      console.error(err);
      alert('Error selling stock');
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Sell Stock" centered>
      <Flex direction="column" gap={10}>
        <Text>Stock: {stock?.name} ({stock?.stockSymbol ?? stock?.symbol})</Text>
        <Text>Avg Buy Price: ₹{avgPrice}</Text>
        <Text>Current Price: ₹{currentPrice}</Text>

        <NumberInput
          label="Quantity to Sell"
          min={1}
          max={stock.quantity}
          value={sellQty}
          onChange={setSellQty}
        />

        <Text color={profitLoss >= 0 ? 'lightgreen' : 'salmon'}>
          P&L: {profitLoss >= 0 ? '+' : ''}₹{profitLoss}
        </Text>

        <Button onClick={handleSell} color="salmon">Sell</Button>
      </Flex>
    </Modal>
  );
};

export default SellModal;
