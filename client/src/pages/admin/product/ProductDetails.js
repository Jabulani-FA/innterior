import React, { useEffect, useState } from 'react';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProductCard from '../../../components/cards/ProductCard';
import SingleProduct from '../../../components/cards/SingleProduct';
import { getProduct, getRelated, productStar } from '../../../functions/product';

const ProductDetails = () => {
  const [product, setproduct] = useState(null);
  const [related, setrelated] = useState([]);
  const [loading, setloading] = useState(true);
  const [star, setstar] = useState(0);
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    let active = true;
    setloading(true);
    setproduct(null);
    setrelated([]);
    getProduct(slug)
      .then(async (response) => {
        if (!active) return;
        const loadedProduct = response.data;
        setproduct(loadedProduct);
        if (loadedProduct?._id) {
          const relatedResponse = await getRelated(loadedProduct._id);
          if (active) setrelated(relatedResponse.data || []);
        }
      })
      .catch(() => {
        if (active) toast.error('This product could not be loaded.');
      })
      .finally(() => active && setloading(false));

    return () => { active = false; };
  }, [slug]);

  useEffect(() => {
    if (!product?.ratings || !user?._id) {
      setstar(0);
      return;
    }
    const existingRating = product.ratings.find(
      (rating) => rating.postedBy?.toString() === user._id.toString()
    );
    setstar(existingRating?.star || 0);
  }, [product, user]);

  const onStarClick = async (rate) => {
    if (!user?.token) {
      toast.info('Sign in to rate this piece.');
      navigate('/login');
      return;
    }

    try {
      await productStar(product._id, rate, user.token);
      setstar(rate);
      const refreshed = await getProduct(slug);
      setproduct(refreshed.data);
      toast.success('Your rating has been saved.');
    } catch {
      toast.error('Your rating could not be saved.');
    }
  };

  return (
    <div className="product-detail-page">
      <Link className="detail-back-link" to="/shop">
        <ArrowLeftOutlined /> Back to collection
      </Link>
      {loading ? (
        <div className="detail-loading" role="status">Loading product details...</div>
      ) : product ? (
        <>
          <SingleProduct product={product} onStarClick={onStarClick} userRating={star} />
          <section className="related-products-section">
            <div className="related-heading">
              <div>
                <p className="section-kicker">COMPLETE THE ROOM</p>
                <h2>You may also like</h2>
              </div>
              <Link to="/shop">Shop all pieces <ArrowLeftOutlined /></Link>
            </div>
            {related.length ? (
              <div className="related-product-grid">
                {related.map((item) => <ProductCard key={item._id} product={item} />)}
              </div>
            ) : (
              <p className="related-empty">No related pieces to show just yet.</p>
            )}
          </section>
        </>
      ) : (
        <div className="detail-loading">This product is no longer available.</div>
      )}
    </div>
  );
};

export default ProductDetails;