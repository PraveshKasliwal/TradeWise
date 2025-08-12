import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_APP_BACKEND_LINK); // Adjust the URL as needed

import NiftyList from '../../Components/NiftyList';
import Chart from '../../Components/Chart';
import StockInfoCard from '../../Components/StockInfoCard';
import Transaction from '../../Components/Transaction/Transaction';
import BuyModal from '../../Components/BuyModal/BuyModal';
import TabSwitcher from '../../Components/TabSwitcher/TabSwitcher';
import SearchPanel from '../../Components/SearchPanel';
import WatchlistButton from '../../Components/Watchlist/WatchlistButton';
import IncomeStatementTable from '../../Components/StockFundamentals/IncomeStatementTable';

import { useDisclosure } from '@mantine/hooks';
import { Text, Flex, Button, Loader, SegmentedControl } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';

const StockDetails = () => {
  const { symbol } = useParams();
  const icon = <IconInfoCircle />;
  const [stock, setStock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);


  const [financeActiveTab, setFinanceActiveTab] = useState('Income Statement');
  const financeTabs = ['Income Statement', 'Balance Sheet', 'Cash Flow'];

  const tabs = ['Stock Info', 'Transaction'];
  const [activeTab, setActiveTab] = useState('Stock Info');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!symbol) return;

    setLoading(true);
    socket.emit('subscribeStock', [symbol]);

    const handleUpdate = (data) => {
      if (data.symbol === symbol) {
        setStock(data);
        setLoading(false);
      }
      else {
        console.warn("Received update for different symbol:", data.symbol);
      }
    };

    socket.on('stockUpdate', handleUpdate);
    return () => {
      socket.off('stockUpdate', handleUpdate);
    };
  }, [symbol]);

  if (loading) return (
    <Flex justify={'center'} align={'center'} w={'100%'}>
      <Loader color='#363636' />;
    </Flex>
  )

  return (
    <Flex
      direction='column' gap={20} miw={'100%'} maw={"100%"} w={"100%"}
      style={{ position: 'relative' }}
    >
      {opened && (
        <BuyModal
          stock={stock}
          onClose={close}
          onOpen={(qty) => {
            console.log(`Buying ${qty} shares of ${stock.symbol}`);
            setShowBuyModal(false);
            // TODO: Call backend API to create transaction
          }}
          opened={opened}
        />
      )}
      <Flex>
        <SearchPanel />
      </Flex>
      <NiftyList />
      <Flex direction={'column'} w={"70%"} p={'30px 0 30px 0'} c={'white'} gap={20}>
        <Flex className='MainInfoContainer' direction={'column'} gap={30}>
          <Flex justify={'space-between'}>
            <Text size='32px' fw={700}>{stock.name}</Text>
            <Flex gap={20}>
              <Button onClick={open} bg={'#363636'} radius={'xl'}>BUY</Button>
              {/* <Button bg={'#363636'} radius={'xl'}>SELL</Button> */}
              <WatchlistButton symbol={symbol} whichButton={"text"} />
              {/* <Button bg={'#363636'} radius={'xl'}>Add To Watchlist</Button> */}
            </Flex>
          </Flex>
          <Flex direction={'column'} gap={10} bg={'#363636'} p={20} style={{ borderRadius: '20px' }} >
            <Text size='24px' fw={600}>{stock.currency === 'INR' ? '₹' : '$'}{stock.price}</Text>
            <Text c={`${stock.change >= 0 ? 'lightgreen' : 'salmon'}`}>
              {stock.change}
              ({stock.changePercent})
            </Text>
          </Flex>
        </Flex>

        <div>
          <Chart symbol={stock.symbol} lineColor={stock.change >= 0 ? 'lightgreen' : 'salmon'} />
        </div>
        <Flex direction={'column'}>
          <TabSwitcher tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
          {
            activeTab === 'Stock Info' ?
              <StockInfoCard stock={stock} /> : <Transaction symbol={stock.symbol} />
          }

        </Flex>
        <Flex direction={'column'} gap={20}>
          <TabSwitcher tabs={financeTabs} activeTab={financeActiveTab} setActiveTab={setFinanceActiveTab} />
          {financeActiveTab === 'Income Statement' && (
            <IncomeStatementTable symbol={symbol} />
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default StockDetails;