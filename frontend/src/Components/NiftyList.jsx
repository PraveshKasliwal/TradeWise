import React from 'react'
import styles from '../Pages/Stocks/Stocks.module.css'

import stockList from '../Data/Stock.json';
import { Flex } from '@mantine/core';

const NiftyList = () => {
    return (
        <div 
         className={styles.niftyContainer}
        >
            {stockList.slice(0, 6).map((stock, index) => (
                <div className={styles.niftyCard}>
                    <div className={styles.niftyCardName}>{stock.name}</div>
                    <div>{stock.price}</div>
                    <div
                        className={stock.change >= 0 ?
                            `${styles.niftyCardPositive} ${styles.niftyCardChange}` :
                            `${styles.niftyCardNegative} ${styles.niftyCardChange}`}
                    >
                        {stock.change} ({stock.changePercent}%)
                    </div>
                </div>
            ))}

        </div>
    )
}

export default NiftyList