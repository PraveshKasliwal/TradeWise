import { useState, useEffect } from 'react';
import axios from 'axios';

import Navbar from '../Components/Navbar';
import { useDisclosure } from '@mantine/hooks';
import { Flex } from '@mantine/core';

import WalletModal from './WalletModal/WalletModal';

import '../index.css';

// TODO: Change index.css to module css

const MainPage = ({ children }) => {

    const [opened, { open, close }] = useDisclosure(false);
    return (
        <Flex gap={20} className='mainPage'>
            {
                opened && <WalletModal opened={opened} close={close} open={open} />
            }
            <Navbar opened={opened} close={close} open={open} />
            <Flex
                flex={1}
                className='sidePage'
            >
                {children}
            </Flex>
        </Flex>
    );
}

export default MainPage;