import React, { useState } from 'react';
import { CheckOutlined, HeartOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Carousel } from 'react-responsive-carousel';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Rating } from 'react-simple-star-rating';
import _ from 'lodash';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Chair from '../../image/chairNone.jpg';
import Newrating from '../../functions/rating';
import ProductItemList from './ProductItemList';
import RatingModal from './modal/RatingModal';

const SingleProduct = ({ product, onStarClick, userRating = 0 }) => {
  const { _id, title, description, images = [], price, ratings = [] } = product;
  const { user, cart } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    const existingIndex = cart.findIndex((item) => item._id === _id);
    let updatedCart;
    if (existingIndex >= 0) {
      updatedCart = cart.map((item, index) => (
        index === existingIndex ? { ...item, count: (item.count || 1) + 1 } : item
      ));
    } else {
      updatedCart = _.uniqWith([...cart, { ...product, count: 1 }], _.isEqual);
    }

    localStorage.setItem('cart', JSON.stringify(updatedCart));
    dispatch({ type: 'ADD_TO_CART', payload: updatedCart });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1500);
  };

  return (
    <section className="product-detail-grid">
      <div className="product-detail-gallery">
        {images.length ? (
          <Carousel
            showStatus={false}
            showThumbs={images.length > 1}
            infiniteLoop={images.length > 1}
            showIndicators={images.length > 1}
            swipeable
            emulateTouch
          >
            {images.map((image, index) => (
              <div className="detail-gallery-slide" key={image.public_id || image.url || index}>
                <img src={image.url} alt={`${title} view ${index + 1}`} />
              </div>
            ))}
          </Carousel>
        ) : (
          <div className="detail-gallery-fallback">
            <img src={Chair} alt={`${title} product preview`} />
          </div>
        )}
        <div className="detail-gallery-caption">A considered piece for everyday living</div>
      </div>

      <div className="product-detail-information">
        {product.category?.name && (
          <Link className="detail-category" to={`/category/${product.category.slug}`}>
            {product.category.name}
          </Link>
        )}
        <h1>{title}</h1>
        <div className="detail-rating-line">
          {ratings.length ? Newrating(product) : <span>No reviews yet</span>}
          <span>{ratings.length ? `${ratings.length} ${ratings.length === 1 ? 'review' : 'reviews'}` : 'Be the first to review'}</span>
        </div>
        <p className="detail-price">₦{Number(price || 0).toLocaleString()}</p>
        <p className="detail-description">{description || 'A considered piece for your home.'}</p>

        <div className="detail-specifications">
          <h2>Piece details</h2>
          <ProductItemList product={product} />
        </div>

        <div className="detail-purchase-actions">
          <button className={`store-button store-button-dark${added ? ' is-added' : ''}`} type="button" onClick={handleAddToCart}>
            {added ? <CheckOutlined /> : <ShoppingCartOutlined />}
            {added ? 'Added to bag' : 'Add to bag'}
          </button>
          <Link className="detail-save-link" to={user ? '/user/wishlist' : '/login'} aria-label="Save this piece">
            <HeartOutlined />
          </Link>
        </div>
        <div className="detail-rating-action">
          <span>{userRating ? 'Your rating' : 'Rate this piece'}</span>
          <RatingModal>
            <Rating
              name={_id}
              initialValue={userRating}
              onClick={onStarClick}
              allowFraction
              size={22}
            />
          </RatingModal>
        </div>
        <p className="detail-service-note">Need help with your order? Contact our team before purchase to confirm availability and delivery.</p>
      </div>
    </section>
  );
};

export default SingleProduct;