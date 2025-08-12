import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { LoadingOverlay, Flex, Box, Input, TextInput, Accordion, Text, px } from '@mantine/core';

import { useDisclosure } from '@mantine/hooks';

import stockList from '../../Data/Stock.json';
import styles from './Stocks.module.css';

import NiftyList from '../../Components/NiftyList';
import StocksSuggestionCard from '../../Components/StocksSuggestionCard';
import StockTable from '../../Components/StockTable';
import WatchlistTable from '../../Components/WatchListTable';
import SearchPanel from '../../Components/SearchPanel';

const socket = io(import.meta.env.VITE_APP_BACKEND_LINK);

const Stocks = () => {
    const [visible, { toggle }] = useDisclosure(false);
    const [loadData, setLoadData] = useState(false);

    const [watchlist, setWatchlist] = useState([]);
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!userId) return;

        socket.emit("join", userId); // join user room
        socket.emit("watchlist:get", userId); // initial

        socket.on("watchlist:updated", (updatedList) => {
            setWatchlist(updatedList);
        });

        return () => {
            socket.off("watchlist:updated");
        };
    }, [userId]);

    // const mostTradedSymbols = ['RPOWER.NS', 'AAPL', 'ASUR', 'NVDA'];
    // const mostTradedSymbols = ['COALINDIA.NS'];
    const mostTradedSymbols = ['AAPL'];
    const topGainersSymbols = ['AAL', 'AAM', 'AMZN', 'AVAV'];

    return (
        <Flex direction='column' gap={20}
            miw={'100%'} maw={"100%"} w={"100%"}
        >
            <Flex className={styles.searchSection}>
                <SearchPanel />
            </Flex>
            <NiftyList />
            <Flex gap={40} w={'100%'}>
                <Flex direction='column' gap={20} miw={700}>
                    <StocksSuggestionCard
                        heading="Most traded on Groww"
                        stocks={mostTradedSymbols}
                        setLoadData={setLoadData}
                    />

                    {/* <StocksSuggestionCard
                        heading="Top Gainers Today"
                        stocks={topGainersSymbols}
                        setLoadData={setLoadData}
                    /> */}

                    <div>
                        {/* <StockChart symbol='meta' /> */}
                        <StockTable />
                    </div>
                </Flex>
                <Flex>
                    <Box>
                        <Accordion
                            bg='#1a1a1a'
                            classNames={{
                                control: styles.accordionControl,
                                item: styles.accordionItem,
                                label: styles.accordionLabel,
                                panel: styles.accordionPanel
                            }}
                            bd='none'
                            variant="contained"
                        >
                            <Accordion.Item c='white' value="photos">
                                <Accordion.Control c='white'>
                                    My WatchList
                                </Accordion.Control>
                                <Accordion.Panel bg='#363636'><WatchlistTable watchlist={watchlist} loadData={loadData} /></Accordion.Panel>
                            </Accordion.Item>
                        </Accordion>
                    </Box>
                </Flex>
            </Flex>
        </Flex>
    );
}

export default Stocks;