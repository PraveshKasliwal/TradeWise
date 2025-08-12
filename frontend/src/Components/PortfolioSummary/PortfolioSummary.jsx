import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Text, Flex, LoadingOverlay } from '@mantine/core';
import PortfolioSummaryItemCard from './PortfolioSUmmaryItemCard';
import styles from './PortfolioSummary.module.css';

const PortfolioSummary = ({ portfolio }) => {
    const [summary, setSummary] = useState(null);
    const [currency, setCurrency] = useState();
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const calculateSummary = async () => {
            if (!portfolio?.length) {
                setLoading(false);
                return;
            }

            let totalInvested = 0;
            let totalCurrent = 0;

            for (let stock of portfolio) {
                const { stockSymbol, quantity, purchasedPrice } = stock;
                try {
                    const res = await axios.get(`${import.meta.env.VITE_APP_BACKEND_LINK}/api/stocks/${stockSymbol}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    const currentPrice = parseFloat(res.data.price);
                    setCurrency(res.data.currency);
                    totalInvested += quantity * purchasedPrice;
                    totalCurrent += quantity * currentPrice;
                } catch (err) {
                    console.error(`Failed to fetch ${stockSymbol}`, err);
                }
            }

            const profitLoss = totalCurrent - totalInvested;
            const percentChange = (profitLoss / totalInvested) * 100;
            const totalStocks = portfolio.length;
            const totalQuantity = portfolio.reduce((sum, stock) => sum + stock.quantity, 0);

            setSummary({
                totalInvested: totalInvested.toFixed(2),
                totalCurrent: totalCurrent.toFixed(2),
                profitLoss: profitLoss.toFixed(2),
                percentChange: percentChange.toFixed(2),
                totalStocks,
                totalQuantity,
            });

            setLoading(false);
        };

        calculateSummary();
    }, [portfolio]);

    return (
        <Card
            shadow="sm"
            padding="lg"
            radius="md"
            c="white"
            w="100%"
            mih="300px"
            className={styles.portfolioSumm}
            styles={{ root: { backgroundColor: '#363636', position: 'relative' } }}
        >

            {!loading && summary ? (
                <Flex direction="column" align="center" className={styles.portfolioSumm}>
                    <Text size="lg" fw={700} mb="md">Portfolio Summary</Text>
                    <div className={styles.container}>
                        <PortfolioSummaryItemCard heading='Investment' value={summary.totalInvested} currency={currency} />
                        <PortfolioSummaryItemCard heading='Current Value' value={summary.totalCurrent} currency={currency} />
                        <PortfolioSummaryItemCard heading='Profit/Loss' value={summary.profitLoss} indicator={true} />
                        <PortfolioSummaryItemCard heading='% Profit/Loss' value={summary.percentChange} indicator={true} />
                        <PortfolioSummaryItemCard heading='Total Stocks Company Held' value={summary.totalStocks} />
                        <PortfolioSummaryItemCard heading='Total Stocks Own' value={summary.totalQuantity} />
                    </div>
                </Flex>
            ) : !loading && (
                <Flex direction="column" align="center" justify="center" h="100%">
                    <LoadingOverlay
                        visible={loading}
                        zIndex={1000}
                        overlayProps={{ radius: 'sm', blur: 2, backgroundColor: '#1a1a1a' }}
                        loaderProps={{ color: 'white', size: 'lg' }}
                    />
                </Flex>
            )}
        </Card>
    );
};

export default PortfolioSummary;