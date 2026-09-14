import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom';
import {HelmetProvider} from 'react-helmet-async';
import {Provider} from 'react-redux';
import {store} from './store';
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import "boxicons/css/boxicons.min.css";
import "./assets/css/index.css";
import '@fortawesome/fontawesome-free/css/all.min.css'
import ScrollToTop from "./components/ScrollToTop";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <HelmetProvider>
              <ScrollToTop />
              <App />
            </HelmetProvider>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </Provider>
  </StrictMode>
)