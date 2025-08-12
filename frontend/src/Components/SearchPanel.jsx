import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextInput, Flex, Text } from '@mantine/core';
import { CiSearch } from "react-icons/ci";
import { IoMdArrowBack } from "react-icons/io";
import axios from 'axios';
import styles from '../Pages/Stocks/Stocks.module.css';

const SearchPanel = () => {
    const [query, setQuery] = useState('');
    const [suggestionList, setSuggestionList] = useState([]);
    const [search, setSearch] = useState(false);
    const token = localStorage.getItem('token');
    

    const navigate = useNavigate();

    const handleKeyDown = async (e) => {
        if (e.key === 'Enter') {
            if (query.trim().length === 0) return;
            try {
                setSearch(true); // Open suggestion box
                const res = await axios.post(`${import.meta.env.VITE_APP_BACKEND_LINK}/api/stocks/search`,
                    {
                        searchField: query,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                setSuggestionList(res.data);
            } catch (err) {
                console.error("Search fetch error:", err);
            }
        }
    };

    return (
        <>
            <TextInput
                classNames={{
                    input: styles.textInputInput,
                    section: styles.textAreaSection,
                    wrapper: styles.textInputWrapper
                }}
                placeholder="Search stocks..."
                leftSection={
                    search ? (
                        <IoMdArrowBack
                            onClick={() => {
                                setSearch(false);
                                setQuery('');
                                setSuggestionList([]);
                            }}
                            color='#adadad'
                            size={24}
                        />
                    ) : (
                        <CiSearch color='#adadad' size={24} />
                    )
                }
                radius="15px"
                size="sm"
                w={"100%"}
                onKeyDown={handleKeyDown}
                onChange={(e) => setQuery(e.target.value)}
                value={query}
            />

            {search && suggestionList.length > 0 && (
                <Flex className={styles.searchResult} gap={10} p={"20px 0px 20px 40px"} wrap={"wrap"}>
                    {suggestionList.map((stock, index) => (
                        <Flex
                            key={index}
                            w={"fit-content"}
                            direction={"column"}
                            className={styles.searchCard}
                            onClick={() => navigate(`/stock/${encodeURIComponent(stock.symbol)}`)}
                        >
                            <Text className={styles.searchTextEllipsis} ta={"start"} size="11px" fw={500}>
                                {stock.shortname || stock.name || stock.symbol} ({stock.symbol})
                            </Text>
                            <Text className={styles.searchTextEllipsis} c={'#adadad'} ta={"start"} size={'11px'} fw={500}>
                                {stock.sectorDisp || stock.exchDisp || '—'}
                            </Text>
                        </Flex>
                    ))}
                </Flex>
            )}
        </>
    );
};

export default SearchPanel;