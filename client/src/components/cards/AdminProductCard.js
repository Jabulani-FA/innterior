import React from 'react';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const AdminProductCard = ({ product, handleRemove }) => {
  const { title, description, images, slug, price, quantity } = product;

  return (
    <article className="admin-product-card">
      <Link className="admin-product-image" to={`/product-details/${slug}`}>
        <img
          src={images && images.length ? images[0].url : '/Innterior.png'}
          alt={title || 'Product'}
        />
      </Link>
      <div className="admin-product-content">
        <h3 title={title}>{title}</h3>
        <p>{description || 'No product description added.'}</p>
        <strong>₦{Number(price || 0).toLocaleString()}</strong>
        <span className="admin-stock-note">{quantity ?? 0} in stock</span>
      </div>
      <div className="admin-product-actions">
        <Link to={`/admin/product/${slug}`} aria-label={`Edit ${title}`} title="Edit product">
          <EditOutlined />
        </Link>
        {handleRemove && (
          <button type="button" onClick={() => handleRemove(slug)} aria-label={`Delete ${title}`} title="Delete product">
            <DeleteOutlined />
          </button>
        )}
      </div>
    </article>
  );
};

export default AdminProductCard;