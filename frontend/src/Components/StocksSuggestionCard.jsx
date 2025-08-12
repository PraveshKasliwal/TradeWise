import { useEffect, useState, useRef } from 'react';
import styles from '../Pages/Stocks/Stocks.module.css';
import StockCard from './StockCard/StockCard';
import axios from 'axios';
import { io } from 'socket.io-client';
import { LoadingOverlay, Flex } from '@mantine/core';

const socket = io(import.meta.env.VITE_APP_BACKEND_LINK); // Connect once at top

const StocksSuggestionCard = ({ heading, stocks, setLoadData }) => {
    const [stockDataList, setStockDataList] = useState([]);
    const [loading, setLoading] = useState(true);
    const subscribedRef = useRef(false);

    useEffect(() => {
        if (!stocks || stocks.length === 0) return;

        socket.emit('subscribeStock', stocks);
        subscribedRef.current = true;

        
        const updateMap = {};

        socket.on('stockUpdate', (data) => {
            // console.log("🟢 Received update:", data);
            updateMap[data.symbol] = data;

            const updatedList = stocks.map(sym => updateMap[sym]).filter(Boolean);
            setStockDataList(updatedList);
            setLoading(false);
        });

        return () => {
            socket.off('stockUpdate');
        };
    }, [stocks]);


    // useEffect(() => {
    //     console.log('stockDataList', stockDataList);
    // }, [stockDataList]);

    return (
        <div className={styles.stocksSuggestionContainer}>
            <h3>{heading}</h3>

            <div
                className={styles.stockCardsContainer}
                style={{ position: 'relative', minHeight: '150px', minWidth: '500px' }}
            >
                <LoadingOverlay
                    visible={loading}
                    zIndex={1000}
                    overlayProps={{ radius: 'sm', blur: 2, backgroundColor: '#1a1a1a' }}
                    loaderProps={{ color: '#04b488', size: 'lg' }}
                />
                {stockDataList.map((stock, index) => (
                    <StockCard key={index} stockData={stock} />
                ))}
            </div>
        </div>
    );
};

export default StocksSuggestionCard;
