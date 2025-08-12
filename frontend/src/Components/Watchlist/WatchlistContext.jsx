// WatchlistContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const WatchlistContext = createContext();
const socket = io(import.meta.env.VITE_APP_BACKEND_LINK); // adjust URL

export const WatchlistProvider = ({ children }) => {
  const [watchlist, setWatchlist] = useState([]);
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!userId) return;

    axios.get(`${import.meta.env.VITE_APP_BACKEND_LINK}/api/watchlist/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => setWatchlist(res.data))
      .catch(err => console.log(err));

    socket.emit("join", userId);

    socket.on("watchlist:updated", (data) => {
      setWatchlist(data);
    });

    return () => {
      socket.off("watchlist:updated");
    };
  }, [userId]);

  const addToWatchlist = async (symbol) => {
    const res = await axios.post(`${import.meta.env.VITE_APP_BACKEND_LINK}/api/watchlist/add`, { symbol, userId }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    setWatchlist(res.data.watchlist);
    socket.emit("watchlist:update", { userId, updated: res.data.watchlist });
  };

  const removeFromWatchlist = async (symbol) => {
    const res = await axios.post(`${import.meta.env.VITE_APP_BACKEND_LINK}/api/watchlist/remove`, { symbol, userId }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    setWatchlist(res.data.watchlist);
    socket.emit("watchlist:update", { userId, updated: res.data.watchlist });
  };

  return (
    <WatchlistContext.Provider value={{ watchlist, addToWatchlist, removeFromWatchlist }}>
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => useContext(WatchlistContext);
