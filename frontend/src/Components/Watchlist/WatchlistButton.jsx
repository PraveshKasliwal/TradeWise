import { useWatchlist } from './WatchlistContext';
import { TbCirclePlus, TbCircleCheck } from "react-icons/tb";



import { Button, Flex } from '@mantine/core';

const WatchlistButton = ({ symbol, whichButton }) => {
    const { watchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();

    // console.log(`watchlist: ${JSON.stringify(watchlist, null, 2)}`);

    const isInWatchlist = watchlist.some(item => item.stockSymbol === symbol);

    const toggleWatchlist = () => {
        if (isInWatchlist) {
            removeFromWatchlist(symbol);
        } else {
            addToWatchlist(symbol);
        }
    };
    // console.log(isInWatchlist ? `Removing ${symbol} from watchlist` : `Adding ${symbol} to watchlist`);

    return (
        <Flex onClick={toggleWatchlist}>
            {whichButton === 'icon' ? (
                isInWatchlist ?
                    <TbCircleCheck color="#00b586" style={{ height: '24px', width: '24px' }} /> :
                    <TbCirclePlus color='#00b586' style={{ height: '24px', width: '24px' }} />) :
                <Button bg={'#363636'} radius={'xl'}>
                    {isInWatchlist ? 'Remove from watchlist' : 'Add to Watchlist'}
                </Button>
            }
        </Flex>
    );
};

export default WatchlistButton;
