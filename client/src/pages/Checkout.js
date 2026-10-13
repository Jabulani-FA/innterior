import React, { useState } from 'react';
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  LockOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const currency = (amount) => `₦${Number(amount || 0).toLocaleString()}`;

const Checkout = () => {
  const cart = useSelector((state) => state.cart);
  const user = useSelector((state) => state.user);
  const [detailsReviewed, setdetailsReviewed] = useState(false);
  const [delivery, setdelivery] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    notes: '',
  });
  const subtotal = cart.reduce((total, item) => total + Number(item.price || 0) * Number(item.count || 1), 0);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setdelivery((current) => ({ ...current, [name]: value }));
  };

  const handleReview = (event) => {
    event.preventDefault();
    setdetailsReviewed(true);
  };

  if (!cart.length) {
    return (
      <div className="checkout-page">
        <Link className="detail-back-link" to="/cart"><ArrowLeftOutlined /> Back to bag</Link>
        <section className="checkout-empty-state">
          <p className="section-kicker">CHECKOUT</p>
          <h1>Your bag is empty.</h1>
          <p>Add a piece to your bag before starting checkout.</p>
          <Link className="store-button store-button-dark" to="/shop">Browse the collection <ArrowRightOutlined /></Link>
        </section>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-heading">
        <div>
          <p className="section-kicker">A FEW DETAILS BEFORE WE ARRANGE DELIVERY</p>
          <h1>Review your order.</h1>
          <p>Share where your pieces are going. The store will confirm availability and delivery details.</p>
        </div>
        <Link className="detail-back-link" to="/cart"><ArrowLeftOutlined /> Edit bag</Link>
      </div>

      <div className="checkout-progress" aria-label="Checkout progress">
        <span className="is-current"><b>01</b> Delivery details</span>
        <i />
        <span className={detailsReviewed ? 'is-current' : ''}><b>02</b> Order review</span>
        <i />
        <span><b>03</b> Payment</span>
      </div>

      <div className="checkout-layout">
        <section className="checkout-main-panel">
          {!detailsReviewed ? (
            <form className="checkout-form" onSubmit={handleReview}>
              <div className="checkout-section-heading">
                <span>01</span><div><h2>Delivery contact</h2><p>We’ll use these details to confirm your order and delivery.</p></div>
              </div>
              <div className="checkout-fields">
                <label><span>Full name</span><input name="name" autoComplete="name" value={delivery.name} onChange={handleChange} required /></label>
                <label><span>Email address</span><input type="email" name="email" autoComplete="email" value={delivery.email} onChange={handleChange} required /></label>
                <label><span>Phone number</span><input type="tel" name="phone" autoComplete="tel" value={delivery.phone} onChange={handleChange} required /></label>
                <label className="checkout-field-wide"><span>Delivery address</span><input name="address" autoComplete="street-address" value={delivery.address} onChange={handleChange} required /></label>
                <label><span>City / area</span><input name="city" autoComplete="address-level2" value={delivery.city} onChange={handleChange} required /></label>
                <label className="checkout-field-wide"><span>Delivery notes <small>OPTIONAL</small></span><textarea name="notes" value={delivery.notes} onChange={handleChange} rows="3" placeholder="Landmarks or instructions for the store" /></label>
              </div>
              <button className="store-button store-button-dark checkout-review-button" type="submit">Review order <ArrowRightOutlined /></button>
            </form>
          ) : (
            <section className="checkout-review-panel" aria-live="polite">
              <div className="checkout-section-heading">
                <span>02</span><div><h2>Delivery details</h2><p>Review the information you entered.</p></div>
              </div>
              <dl className="checkout-contact-summary">
                <div><dt>Contact</dt><dd>{delivery.name}<br />{delivery.email}<br />{delivery.phone}</dd></div>
                <div><dt>Deliver to</dt><dd>{delivery.address}<br />{delivery.city}</dd></div>
                {delivery.notes && <div><dt>Notes</dt><dd>{delivery.notes}</dd></div>}
              </dl>
              <button className="checkout-edit-details" type="button" onClick={() => setdetailsReviewed(false)}>Edit delivery details</button>
              <div className="checkout-payment-notice">
                <SafetyCertificateOutlined />
                <div><strong>Payment isn’t available yet</strong><p>This store has no active payment or order-confirmation service connected. Your details have not been sent and no order has been placed.</p></div>
              </div>
              <button className="store-button store-button-dark checkout-pay-button" type="button" disabled title="Payment service is not configured">
                <LockOutlined /> Payment setup required
              </button>
            </section>
          )}
        </section>

        <aside className="checkout-order-summary">
          <p className="section-kicker">YOUR SELECTION</p>
          <h2>Order summary</h2>
          <div className="checkout-order-items">
            {cart.map((item) => (
              <div className="checkout-order-item" key={item._id}>
                <img src={item.images?.[0]?.url || '/Innterior.png'} alt={item.title || 'Furniture piece'} />
                <div><strong>{item.title}</strong><span>Qty {item.count || 1}</span></div>
                <b>{currency(Number(item.price || 0) * Number(item.count || 1))}</b>
              </div>
            ))}
          </div>
          <div className="checkout-totals">
            <div><span>Items subtotal</span><strong>{currency(subtotal)}</strong></div>
            <div><span>Delivery</span><span>To be confirmed</span></div>
            <div className="checkout-total"><span>Subtotal</span><strong>{currency(subtotal)}</strong></div>
          </div>
          <p className="checkout-summary-note">Delivery cost and timing will be confirmed for your location before payment.</p>
        </aside>
      </div>
    </div>
  );
};

export default Checkout;
