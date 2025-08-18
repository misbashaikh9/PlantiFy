import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignupPage from './components/SignupPage';
import SigninPage from './components/SigninPage';
import HomePage from './components/HomePage';
import Store from './components/Store';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import OrderSuccess from './components/OrderSuccess';
import Orders from './components/Orders';
import ContactUs from './components/ContactUs';
import ProfilePage from './components/ProfilePage';
import MagazinePage from './components/MagazinePage';
import SuggestionsPage from './components/SuggestionsPage';
import './styles/index.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/signin" element={<SigninPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/store" element={<Store />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/magazine" element={<MagazinePage />} />
          <Route path="/suggestions" element={<SuggestionsPage />} />
          <Route path="/" element={<Navigate to="/home" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
