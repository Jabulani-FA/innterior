import React, { useState } from 'react';
import { CheckOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import _ from 'lodash';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import Newrating from '../../functions/rating';

const ProductCard = ({ product }) => {
  const { title, description, images, slug, price } = product;
  const [added, setAdded] = useState(false);
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    let cart = [];
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('cart')) {
        cart = JSON.parse(localStorage.getItem('cart'));
      }
      cart.push({ ...product, count: 1 });
    }

    const unique = _.uniqWith(cart, _.isEqual);
    localStorage.setItem('cart', JSON.stringify(unique));
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
    dispatch({ type: 'ADD_TO_CART', payload: unique });
  };

  return (
    <article className="product-card">
      <Link className="product-card-image" to={`/product-details/${slug}`}>
        <img
          src={images && images.length ? images[0].url : '/Innterior.png'}
          alt={title || 'Innterior furniture'}
        />
        <span className="product-image-action">View piece</span>
      </Link>
      <div className="product-card-content">
        <div className="product-rating">
          {product.ratings && product.ratings.length > 0 ? (
            Newrating(product)
          ) : (
            <span>No ratings yet</span>
          )}
        </div>
        <Link className="product-card-title" to={`/product-details/${slug}`}>
          {title}
        </Link>
        <p className="product-card-description">
          {description
            ? `${description.substring(0, 58)}${description.length > 58 ? '...' : ''}`
            : 'Made for the way you live.'}
        </p>
        <div className="product-card-footer">
          <strong>{price ? `₦${Number(price).toLocaleString()}` : 'Explore details'}</strong>
          <button
            className={`product-add-button${added ? ' is-added' : ''}`}
            type="button"
            onClick={handleAddToCart}
            aria-label={`Add ${title} to bag`}
            title={added ? 'Added to bag' : 'Add to bag'}
          >
            {added ? <CheckOutlined /> : <ShoppingCartOutlined />}
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
