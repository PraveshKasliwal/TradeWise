import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MantineProvider } from '@mantine/core'
import { WatchlistProvider } from './Components/Watchlist/WatchlistContext.jsx'
import './index.css'
import App from './App.jsx'
import '@mantine/core/styles.css';


createRoot(document.getElementById('root')).render(
  <MantineProvider withGlobalStyles withNormalizeCSS>
      <WatchlistProvider>
        <App />
      </WatchlistProvider>
    </MantineProvider>,
)
