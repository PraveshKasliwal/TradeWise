import React, { useState, useEffect } from 'react';
import { Modal, Text, Flex, Button, Input } from '@mantine/core';
import axios from 'axios';

const WalletModal = ({ opened, close }) => {
    const [amount, setAmount] = useState('');
    const [isRazorpayReady, setIsRazorpayReady] = useState(false);
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    const [wallet, setWallet] = useState();

    useEffect(() => {
        if (userId) {
            const res = axios.get(`${import.meta.env.VITE_APP_BACKEND_LINK}/api/wallet/get-wallet/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(res => setWallet(res.data.wallet))
                .catch(err => console.error('Failed to fetch wallet:', err));
        }
    }, []);

    // Load Razorpay script
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => setIsRazorpayReady(true);
        script.onerror = () => alert('Failed to load Razorpay SDK');
        document.body.appendChild(script);
    }, []);

    const handleAddAmount = async () => {
        if (!isRazorpayReady) {
            alert('Razorpay SDK not loaded yet');
            return;
        }

        try {
            const result = await axios.post(`${import.meta.env.VITE_APP_BACKEND_LINK}/api/wallet/create-order`, { amount }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const { order } = result.data;

            const options = {
                key: import.meta.env.VITE_APP_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: 'INR',
                name: 'Wallet Top-Up',
                description: 'Add to Wallet',
                order_id: order.id,
                handler: async function (response) {
                    const verify = await axios.post(`${import.meta.env.VITE_APP_BACKEND_LINK}/api/wallet/verify-payment`, {
                        response,
                        amount,
                        userId
                    },
                        {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        });

                    if (verify.data.success) {
                        alert('Payment successful and wallet updated!');
                        close();
                    } else {
                        alert('Payment verification failed');
                    }
                },
                prefill: {
                    name: 'User Name',
                },
                theme: {
                    color: '#3399cc',
                },
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

        } catch (err) {
            console.error('checkout error', err);
            alert('Error in payment');
        }
    };


    return (
        <Modal opened={opened} onClose={close} title="Wallet">
            <Text>Amount: ₹{wallet?.toFixed?.(2) ?? 'Loading...'}</Text>
            <Flex direction="column" gap="sm" mt="md">
                <Text>Add Amount</Text>
                <Input
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
                <Button onClick={handleAddAmount}>Add Amount</Button>
            </Flex>
        </Modal>
    );
};

export default WalletModal;