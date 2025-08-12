import React, { useEffect, useState } from 'react';
import { Flex, Table, Text } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

import styles from '../Pages/Stocks/Stocks.module.css';

const socket = io(import.meta.env.VITE_APP_BACKEND_LINK);

const WatchlistTable = ({ watchlist, loadData }) => {
    const navigate = useNavigate();
    const [stockDataList, setStockDataList] = useState([]);

    useEffect(() => {
        if (!watchlist || watchlist.length === 0) return;

        const symbols = watchlist.map(item => item.stockSymbol);
        socket.emit("watchlist:stockData", symbols);

        socket.on("watchlist:stockData:result", (data) => {
            setStockDataList(data);
        });

        return () => {
            socket.off("watchlist:stockData:result");
        };
    }, [watchlist]);

    const rows = stockDataList.map((stock, index) => (
        <Table.Tr
            key={index}
            className={styles.watchListTable}
            onClick={() => navigate(`/stock/${stock.symbol}`)}
            style={{ cursor: 'pointer' }}
        >
            <Table.Td className={styles.watchListTableNameRow}>
                {stock.name}
            </Table.Td>
            <Table.Td>${stock.price}</Table.Td>
            <Table.Td>
                <Text size='15px' c={stock.change >= 0 ? 'lightgreen' : 'salmon'} component='div'>
                    <Flex direction='column' gap={5}>
                        <div style={{ marginBottom: '4px' }}>
                            {stock.change >= 0 ? '+' : ''}{stock.change}
                        </div>
                        <div style={{ opacity: 0.8 }}>
                            ({stock.changePercent})
                        </div>
                    </Flex>
                </Text>
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <Table bdrs={100} c='white' highlightOnHover highlightOnHoverColor='#1a1a1a'>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th>Name</Table.Th>
                    <Table.Th>Price</Table.Th>
                    <Table.Th>Change</Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
        </Table>
    );
};

export default WatchlistTable;
