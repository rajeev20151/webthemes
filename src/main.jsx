import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom';
import {HelmetProvider} from 'react-helmet-async';
import App from './App.jsx'
import "boxicons/css/boxicons.min.css";
import "./assets/css/index.css";
import '@fortawesome/fontawesome-free/css/all.min.css'
import ScrollToTop from "./components/ScrollToTop";
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <HelmetProvider>
      <AuthProvider>        
        <CartProvider>
        <ScrollToTop /> 
        <App />
       </CartProvider> 
      </AuthProvider>
      </HelmetProvider>       
    </BrowserRouter>
  </StrictMode>
)
