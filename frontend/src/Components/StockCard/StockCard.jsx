import '../../index.css';
import { useNavigate } from 'react-router-dom';
import { Flex, Avatar } from '@mantine/core';
import WatchlistButton from '../Watchlist/WatchlistButton';

const StockCard = ({ stockData }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/stock/${encodeURIComponent(stockData.symbol)}`);
  };

  const currency = stockData.currency === 'USD' ? '$' : '₹';
  // console.log(stockData);
  // console.log(stockData.curreny);
  // Get initials from stock name
  const getInitials = (name) => {
    if (!name) return '';
    const words = name.trim().split(' ');
    if (words.length === 1) return words[0][0].toUpperCase();
    return (words[0][0] + words[1][0]).toUpperCase();
  };

  return (
    <div
      className="stock-card"
      onClick={handleClick}
      style={{ cursor: 'pointer', position: 'relative' }}
    >
      <div className='stock-card-info'>
        <div className='stock-card-img-name-container'>
          <Avatar
            radius="xl"
            size="md"
            color="blue"
            style={{ marginRight: '10px' }}
          >
            {getInitials(stockData.name)}
          </Avatar>
          <div className='stock-card-name'>{stockData.name}</div>
        </div>
        <div className='stock-card-price-container'>
          <Flex className='stock-card-price'>{currency}{stockData.price}</Flex>
          <div className={stockData.change >= 0 ? 'positive stock-card-change' : 'negative stock-card-change'}>
            {stockData.change} ({stockData.changePercent}%)
          </div>
        </div>
      </div>
      <div className='stock-cart-wishlist-btn' onClick={(e) => e.stopPropagation()}>
        <WatchlistButton symbol={stockData.symbol} whichButton={'icon'} />
      </div>
    </div>
  );
};

export default StockCard;
