// import '../index.css';
import '../index.css'
import { Table, Flex, Center } from '@mantine/core';
import wishlistIcon from '../assets/addToWishlistIcon.png'

const StockTable = () => {
    const stocks = [
        {
            company: 'Apple Inc.',
            price: 193.42,
            change: 1.24,
            changePercent: 0.65
        },
        {
            company: 'Microsoft Corp.',
            price: 328.91,
            change: -0.55,
            changePercent: -0.17
        },
        {
            company: 'Meta Platforms',
            price: 312.66,
            change: 2.87,
            changePercent: 0.92
        },
        {
            company: 'Amazon.com Inc.',
            price: 131.45,
            change: -1.11,
            changePercent: -0.84
        },
    ];

    const rows = stocks.map((stock, index) => (
        <Table.Tr key={index}>
            <Table.Td>{stock.company}</Table.Td>
            {/* <Table.Td>Coming Soon</Table.Td> */}
            <Table.Td>
                {/* <Flex direction="column" align='center' justify='center'> */}
                <Flex align='center'>
                    ${stock.price.toFixed(2)}
                </Flex>
                <div className={stock.change >= 0 ? 'positive' : 'negative'}>
                    {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                </div>
                {/* </Flex> */}
            </Table.Td>
            <Table.Td>
                <Flex justify='center'>
                <button className="wishlist-button">
                    <img src={wishlistIcon} alt="wishlist" />
                </button>
                </Flex>
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <div className="stock-container">
            <Table
                withTableBorder
                c='white'
                style={{ border: '1px solid #ccc', borderRadius: '12px', overflow: 'hidden' }}
                className="stock-table"
            >
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Company</Table.Th>
                        {/* <Table.Th></Table.Th> */}
                        <Table.Th>
                            Market Price
                        </Table.Th>
                        <Table.Th ta='center'>Wishlist</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
            </Table>
        </div>
    );
};

export default StockTable;