import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import AuthProvider from './components/AuthProvider.jsx'
import CartProvider from './components/CartProvider.jsx'
import WishlistProvider from './components/WishlistProvider.jsx'
import './index.css'
import App from './App.jsx'
import LanguageProvider from './components/LanguageProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <LanguageProvider>
              <App />
            </LanguageProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
