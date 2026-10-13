import React from 'react';
import { ArrowRightOutlined, ClockCircleOutlined, ShoppingOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import UserNav from '../../components/nav/UserNav';

const History = () => (
  <div className="account-page">
    <UserNav />
    <main className="account-content">
      <header className="account-page-heading">
        <div>
          <p className="section-kicker">YOUR ACCOUNT</p>
          <h1>Order history</h1>
          <p>Keep track of the pieces you’ve ordered and what happens next.</p>
        </div>
      </header>
      <section className="history-empty-state">
        <span className="history-empty-icon"><ClockCircleOutlined /></span>
        <p className="section-kicker">NOTHING TO SHOW YET</p>
        <h2>Your orders will live here.</h2>
        <p>Orders will appear here once checkout and order confirmation are connected to your account.</p>
        <Link className="store-button store-button-dark" to="/shop"><ShoppingOutlined /> Browse the collection <ArrowRightOutlined /></Link>
      </section>
    </main>
  </div>
);

export default History;