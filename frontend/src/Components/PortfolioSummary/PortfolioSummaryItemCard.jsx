import React from 'react'

import { Flex, Text } from '@mantine/core'

const PortfolioSummaryItemCard = ({ heading, value, currency = null, indicator = false }) => {
    return (
        <div>
            <Flex direction={'column'} justify={'center'} align={'center'}>
                <Text c={'#adadad'}>{heading}</Text>
                <Text c={indicator ? (value >= 0 ? 'lightgreen' : 'salmon') : 'white'}>{currency != null && (currency === "USD" ? '$' : '₹')}{value}</Text>
            </Flex>
        </div>
    )
}

export default PortfolioSummaryItemCard