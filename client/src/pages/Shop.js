import React, { useEffect, useMemo, useState } from 'react';
import {
  CarOutlined,
  CloseOutlined,
  DownOutlined,
  FilterOutlined,
  FormatPainterOutlined,
  SearchOutlined,
  StarOutlined,
  TagOutlined,
} from '@ant-design/icons';
import { Checkbox, Radio, Slider } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import ProductCard from '../components/cards/ProductCard';
import Star from '../components/forms/Star';
import { getCategories } from '../functions/category';
import { fetchProductByFilter, getProductsByCount } from '../functions/product';
import { getSubs } from '../functions/sub';

const colors = ['Red', 'Green', 'Orange', 'Grey', 'Blue', 'white'];
const brands = ['Corella', 'Shimsu', 'Samsung'];
const initialPrice = [0, 1000000];

const Shop = () => {
  const [products, setproducts] = useState([]);
  const [loading, setloading] = useState(true);
  const [price, setprice] = useState(initialPrice);
  const [categories, setcategories] = useState([]);
  const [subs, setsubs] = useState([]);
  const [brand, setbrand] = useState('');
  const [color, setcolor] = useState('');
  const [rating, setrating] = useState(0);
  const [sub, setsub] = useState(null);
  const [shipping, setshipping] = useState('');
  const [categoryIds, setcategoryIds] = useState([]);
  const [sort, setsort] = useState('featured');
  const [mobileFiltersOpen, setmobileFiltersOpen] = useState(false);
  const [requestError, setrequestError] = useState('');
  const dispatch = useDispatch();
  const { search } = useSelector((state) => ({ ...state }));
  const { text } = search;

  const loadAllProducts = () => {
    setloading(true);
    setrequestError('');
    getProductsByCount(100)
      .then((response) => setproducts(response.data || []))
      .catch(() => setrequestError('Products could not be loaded. Please try again.'))
      .finally(() => setloading(false));
  };

  const fetchProducts = (filter) => {
    setloading(true);
    setrequestError('');
    fetchProductByFilter(filter)
      .then((response) => setproducts(response.data || []))
      .catch(() => {
        setproducts([]);
        setrequestError('We could not apply that filter. Please try again.');
      })
      .finally(() => setloading(false));
  };

  useEffect(() => {
    loadAllProducts();
    getCategories().then((response) => setcategories(response.data || [])).catch(() => {});
    getSubs().then((response) => setsubs(response.data || [])).catch(() => {});
  }, []);

  useEffect(() => {
    if (!text) return undefined;
    const delayed = window.setTimeout(() => fetchProducts({ query: text }), 300);
    return () => window.clearTimeout(delayed);
  }, [text]);

  const resetFilters = () => {
    setprice(initialPrice);
    setcategoryIds([]);
    setbrand('');
    setcolor('');
    setrating(0);
    setsub(null);
    setshipping('');
  };

  const searchFilter = (filter, stateUpdate) => {
    dispatch({ type: 'SEARCH_QUERY', payload: { text: '' } });
    resetFilters();
    stateUpdate();
    fetchProducts(filter);
  };

  const applyPrice = () => {
    dispatch({ type: 'SEARCH_QUERY', payload: { text: '' } });
    setcategoryIds([]);
    setbrand('');
    setcolor('');
    setrating(0);
    setsub(null);
    setshipping('');
    fetchProducts({ price });
  };

  const handleCategories = (event) => {
    const nextIds = event.target.checked
      ? [...categoryIds, event.target.value]
      : categoryIds.filter((id) => id !== event.target.value);
    dispatch({ type: 'SEARCH_QUERY', payload: { text: '' } });
    setcategoryIds(nextIds);
    setprice(initialPrice);
    setbrand('');
    setcolor('');
    setrating(0);
    setsub(null);
    setshipping('');
    if (nextIds.length) fetchProducts({ category: nextIds });
    else loadAllProducts();
  };

  const handleRating = (rating) => {
    searchFilter({ stars: rating }, () => {
      setprice(initialPrice);
      setrating(rating);
    });
  };

  const handleBrand = (event) => {
    const value = event.target.value;
    searchFilter({ brand: value }, () => setbrand(value));
  };

  const handleColor = (event) => {
    const value = event.target.value;
    searchFilter({ color: value }, () => setcolor(value));
  };

  const handleShipping = (event) => {
    const value = event.target.value;
    searchFilter({ shipping: value }, () => setshipping(value));
  };

  const handleSub = (selectedSub) => {
    searchFilter({ sub: selectedSub._id }, () => setsub(selectedSub));
  };

  const clearAll = () => {
    dispatch({ type: 'SEARCH_QUERY', payload: { text: '' } });
    resetFilters();
    setsort('featured');
    loadAllProducts();
  };

  const activeFilters = [
    ...categoryIds.map((id) => ({
      key: `category-${id}`,
      label: categories.find((category) => category._id === id)?.name || 'Category',
      clear: () => {
        const nextIds = categoryIds.filter((categoryId) => categoryId !== id);
        setcategoryIds(nextIds);
        if (nextIds.length) fetchProducts({ category: nextIds });
        else loadAllProducts();
      },
    })),
    ...(price[0] !== initialPrice[0] || price[1] !== initialPrice[1]
      ? [{ key: 'price', label: `₦${price[0].toLocaleString()} - ₦${price[1].toLocaleString()}`, clear: () => { setprice(initialPrice); loadAllProducts(); } }]
      : []),
    ...(brand ? [{ key: 'brand', label: brand, clear: () => { setbrand(''); loadAllProducts(); } }] : []),
    ...(color ? [{ key: 'color', label: color, clear: () => { setcolor(''); loadAllProducts(); } }] : []),
    ...(rating ? [{ key: 'rating', label: `${rating}+ stars`, clear: () => { setrating(0); loadAllProducts(); } }] : []),
    ...(sub ? [{ key: 'sub', label: sub.name, clear: () => { setsub(null); loadAllProducts(); } }] : []),
    ...(shipping ? [{ key: 'shipping', label: `Shipping: ${shipping}`, clear: () => { setshipping(''); loadAllProducts(); } }] : []),
    ...(text ? [{ key: 'query', label: `Search: ${text}`, clear: () => { dispatch({ type: 'SEARCH_QUERY', payload: { text: '' } }); loadAllProducts(); } }] : []),
  ];

  const sortedProducts = useMemo(() => {
    const result = [...products];
    if (sort === 'price-asc') result.sort((a, b) => Number(a.price) - Number(b.price));
    if (sort === 'price-desc') result.sort((a, b) => Number(b.price) - Number(a.price));
    if (sort === 'name') result.sort((a, b) => a.title.localeCompare(b.title));
    return result;
  }, [products, sort]);

  return (
    <div className="shop-page">
      <header className="shop-intro">
        <p className="section-kicker">THE INNTERIOR COLLECTION</p>
        <h1>Find the piece that <em>feels like home.</em></h1>
        <p>Furniture and finishing touches chosen for the way you live.</p>
      </header>

      <div className="shop-toolbar">
        <button
          className={`shop-filter-toggle${mobileFiltersOpen ? ' is-open' : ''}`}
          type="button"
          onClick={() => setmobileFiltersOpen((open) => !open)}
          aria-expanded={mobileFiltersOpen}
        >
          <FilterOutlined /> Filters {activeFilters.length > 0 && <span>{activeFilters.length}</span>}
          <DownOutlined />
        </button>
        <p className="shop-result-count">
          {loading ? 'Finding pieces...' : <><strong>{sortedProducts.length}</strong> {sortedProducts.length === 1 ? 'piece' : 'pieces'}</>}
        </p>
        <label className="shop-sort-control">
          <span>Sort by</span>
          <select value={sort} onChange={(event) => setsort(event.target.value)}>
            <option value="featured">Featured</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="name">Name</option>
          </select>
        </label>
      </div>

      {activeFilters.length > 0 && (
        <div className="shop-active-filters" aria-label="Active filters">
          {activeFilters.map((filter) => (
            <button key={filter.key} type="button" onClick={filter.clear}>
              {filter.label} <CloseOutlined />
            </button>
          ))}
          <button className="shop-clear-all" type="button" onClick={clearAll}>Clear all</button>
        </div>
      )}

      <div className="shop-layout">
        <aside className={`shop-filters${mobileFiltersOpen ? ' is-open' : ''}`}>
          <div className="shop-filter-heading">
            <div><p className="section-kicker">REFINE</p><h2>Filters</h2></div>
            {activeFilters.length > 0 && <button type="button" onClick={clearAll}>Reset</button>}
          </div>

          <details className="shop-filter-group" open>
            <summary><span><TagOutlined /> Categories</span><DownOutlined /></summary>
            <div className="shop-filter-options">
              {categories.length ? categories.map((category) => (
                <Checkbox
                  key={category._id}
                  checked={categoryIds.includes(category._id)}
                  value={category._id}
                  onChange={handleCategories}
                >
                  {category.name}
                </Checkbox>
              )) : <span className="shop-filter-empty">Categories unavailable</span>}
            </div>
          </details>

          <details className="shop-filter-group" open>
            <summary><span>Price range</span><DownOutlined /></summary>
            <div className="shop-filter-options shop-price-filter">
              <div className="shop-price-labels"><span>₦{price[0].toLocaleString()}</span><span>₦{price[1].toLocaleString()}</span></div>
              <Slider range min={0} max={1000000} step={10000} value={price} onChange={setprice} />
              <button className="shop-apply-price" type="button" onClick={applyPrice}>Apply price</button>
            </div>
          </details>

          <details className="shop-filter-group">
            <summary><span><StarOutlined /> Customer rating</span><DownOutlined /></summary>
            <div className="shop-filter-options shop-rating-options">
              {[5, 4, 3, 2, 1].map((rating) => <Star key={rating} starClick={handleRating} count={rating} />)}
            </div>
          </details>

          <details className="shop-filter-group">
            <summary><span>Sub-category</span><DownOutlined /></summary>
            <div className="shop-filter-options shop-sub-options">
              {subs.length ? subs.map((item) => (
                <button key={item._id} className={sub?._id === item._id ? 'is-selected' : ''} type="button" onClick={() => handleSub(item)}>{item.name}</button>
              )) : <span className="shop-filter-empty">Sub-categories unavailable</span>}
            </div>
          </details>

          <details className="shop-filter-group">
            <summary><span><CarOutlined /> Shipping</span><DownOutlined /></summary>
            <div className="shop-filter-options shop-radio-options">
              <Radio.Group value={shipping} onChange={handleShipping}>
                <Radio value="Yes">Available</Radio>
                <Radio value="No">Unavailable</Radio>
              </Radio.Group>
            </div>
          </details>

          <details className="shop-filter-group">
            <summary><span><FormatPainterOutlined /> Colour</span><DownOutlined /></summary>
            <div className="shop-filter-options shop-color-options">
              {colors.map((item) => (
                <button
                  key={item}
                  className={`shop-color-swatch${color === item ? ' is-selected' : ''}`}
                  type="button"
                  onClick={() => handleColor({ target: { value: item } })}
                  aria-label={item}
                  title={item}
                >
                  <span className={`swatch-${item.toLowerCase()}`} />
                  {item}
                </button>
              ))}
            </div>
          </details>

          <details className="shop-filter-group">
            <summary><span>Brand</span><DownOutlined /></summary>
            <div className="shop-filter-options shop-radio-options">
              <Radio.Group value={brand} onChange={handleBrand}>
                {brands.map((item) => <Radio key={item} value={item}>{item}</Radio>)}
              </Radio.Group>
            </div>
          </details>
        </aside>

        <section className="shop-results" aria-live="polite">
          {loading ? (
            <div className="shop-state"><span className="shop-loader" /><p>Finding pieces for your space...</p></div>
          ) : requestError ? (
            <div className="shop-state shop-error-state"><SearchOutlined /><p>{requestError}</p><button type="button" onClick={loadAllProducts}>Try again</button></div>
          ) : sortedProducts.length ? (
            <div className="shop-product-grid">
              {sortedProducts.map((product) => <ProductCard key={product._id} product={product} />)}
            </div>
          ) : (
            <div className="shop-state shop-empty-state"><SearchOutlined /><h2>No pieces found</h2><p>Try changing your filters or start again with the full collection.</p><button type="button" onClick={clearAll}>Clear filters</button></div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Shop;