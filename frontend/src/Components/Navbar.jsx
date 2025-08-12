import { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { io } from 'socket.io-client';
const socket = io(import.meta.env.VITE_APP_BACKEND_LINK);

import { MdShowChart } from "react-icons/md";
import { AiOutlineStar } from 'react-icons/ai';
import { FaWallet } from 'react-icons/fa';
import { RiExchangeLine } from 'react-icons/ri';
import { CgProfile } from 'react-icons/cg';
import { CiWallet } from "react-icons/ci";
import { RiStairsFill } from "react-icons/ri";
import { IoIosLogOut } from "react-icons/io";


import { Code, Group, Box, Text, Flex, Button } from '@mantine/core';
import classes from './Navbar.module.css'

const data = [
    { link: '/stocks', label: 'Stock', icon: MdShowChart },
    { link: '/portfolio', label: 'Portfolio', icon: FaWallet },
    { link: '/profile', label: 'Profile', icon: CgProfile },
];

const Navbar = ({ opened, open, close }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [active, setActive] = useState();
    useEffect(() => {
        const matched = data.find(item => location.pathname.startsWith(item.link));
        if (matched) {
            setActive(matched.label);
        }
    }, [location.pathname]);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    }

    const userId = localStorage.getItem('userId')
    const [wallet, setWallet] = useState(0);
    const token = localStorage.getItem('token');
    useEffect(() => {
        if (userId) {
            socket.emit('wallet:get', userId);

            socket.on('wallet:result', (walletAmount) => {
                setWallet(walletAmount);
            });

            return () => {
                socket.off('wallet:result');
            };
        }
    }, [userId]);

    const links = data.map((item) => (
        <Link
            to={item.link}
            key={item.label}
            className={classes.link}
            data-active={item.label === active || undefined}
            onClick={() => setActive(item.label)}
        >
            <item.icon
                className={item.label === 'Portfolio' ? `${classes.linkIcon} ${classes.linkIconPortfolio}` : `${classes.linkIcon}`}
                style={{
                    color: 'white',
                    backgroundColor: 'transparent',
                    // borderRadius: '50%',
                    // padding: '6px',
                }}
                stroke={1.5}
            />
            {/* <img src={item.icon} alt={item.label} className={classes.linkIcon} />    */}
            <span>{item.label}</span>
        </Link>
    ));

    useEffect(() => {

    })

    return (
        <nav className={classes.navbar}>
            <div className={classes.navbarMain}>
                <Group className={classes.header} justify="space-between">
                    {/* <MantineLogo size={28} /> */}
                    {/* <Code fw={700}>v3.1.2.3.4.2</Code> */}
                    <Flex gap={10} align={'center'} c={'white'}>
                        <RiStairsFill color='white' />
                        <Text>TradeWise</Text>
                    </Flex>
                </Group>
                {links}
            </div>

            <Flex direction={'column'} gap={20}>
                <Flex gap={10} align={'center'} style={{ cursor: 'pointer' }} className={classes.link} onClick={() => handleLogout()}>
                    <IoIosLogOut color='white' style={{ height: '20px', width: '20px' }} />
                    <Text c={'white'}>Logout</Text>
                </Flex>
                {
                    localStorage.getItem('token') &&
                    <Button
                        onClick={open}
                        bg={'#363636'}
                        bd={'1px solid white'}
                        miw={'100%'}
                        p={5}
                        c={'white'}
                        style={{ borderRadius: '5px' }}
                    // display={'block'}
                    >
                        <Flex align={'center'} gap={4}>
                            <CiWallet style={{ width: '20px', height: '20px' }} />
                            <Text size='13px' w={'100%'} style={{
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                                textOverflow: 'ellipsis',
                            }}>Wallet: {wallet.toFixed(2)}</Text>
                        </Flex>
                    </Button>
                }
            </Flex>

            {/* <div className={classes.footer}>
                <a href="#" className={classes.link} onClick={(event) => event.preventDefault()}>
                    <IconSwitchHorizontal className={classes.linkIcon} stroke={1.5} />
                    <span>Change account</span>
                </a>

                <a href="#" className={classes.link} onClick={(event) => event.preventDefault()}>
                    <IconLogout className={classes.linkIcon} stroke={1.5} />
                    <span>Logout</span>
                </a>
            </div> */}
        </nav>
    );

}

export default Navbar;
