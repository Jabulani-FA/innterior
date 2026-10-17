import React, { useEffect, useState } from 'react';
import { ArrowRightOutlined, CheckCircleOutlined, ClockCircleOutlined, PlusOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { getMarketplaceProfile, getVendorProducts, updateMarketplaceProfile } from '../functions/applications';
import { removeProduct } from '../functions/product';

const MarketplaceDashboard = ({ role }) => {
  const user = useSelector((state) => state.user);
  const [profile, setprofile] = useState(null);
  const [products, setproducts] = useState([]);
  const [loading, setloading] = useState(true);
  const [saving, setsaving] = useState(false);
  const [form, setform] = useState({});

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const response = await getMarketplaceProfile(user.token);
        if (!active) return;
        setprofile(response.data.profile);
        setform(response.data.profile || {});
        if (role === 'vendor') {
          const vendorProducts = await getVendorProducts(user.token);
          if (active) setproducts(vendorProducts.data || []);
        }
      } catch (error) {
        if (active) toast.error(error.response?.data?.message || 'Marketplace profile could not be loaded.');
      } finally {
        if (active) setloading(false);
      }
    };
    load();
    return () => { active = false; };
  }, [user?.token, role]);

  const saveProfile = async (event) => {
    event.preventDefault();
    setsaving(true);
    try {
      const response = await updateMarketplaceProfile(user.token, form);
      setprofile(response.data.profile);
      toast.success('Marketplace profile updated.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Profile could not be updated.');
    } finally {
      setsaving(false);
    }
  };

  const handleRemove = async (slug) => {
    if (!window.confirm('Remove this product from your shop?')) return;
    try {
      await removeProduct(slug, user.token);
      setproducts((current) => current.filter((product) => product.slug !== slug));
      toast.success('Product removed.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Product could not be removed.');
    }
  };

  if (loading) return <p className="marketplace-loading">Loading your marketplace profile...</p>;
  if (!profile) return <section className="marketplace-unavailable"><SafetyCertificateOutlined /><h1>Profile not active</h1><p>Marketplace tools appear once an administrator completes your verification.</p><Link className="store-button store-button-dark" to="/user/role-application">View application status <ArrowRightOutlined /></Link></section>;

  const isVendor = role === 'vendor';
  const titleKey = isVendor ? 'shopName' : 'displayName';
  const listKey = isVendor ? 'productTypes' : 'specialties';
  const listValue = Array.isArray(form[listKey]) ? form[listKey].join(', ') : '';

  return (
    <div className="marketplace-dashboard">
      <header className="marketplace-dashboard-heading">
        <div><p className="section-kicker">{isVendor ? 'YOUR SHOP' : 'YOUR PROFESSIONAL PROFILE'}</p><h1>Welcome, {profile[titleKey] || user.name}.</h1><p>{isVendor ? 'Manage your product listings and shop details.' : 'Keep your services and talent profile current for new enquiries.'}</p></div>
        <span className="marketplace-verified"><CheckCircleOutlined /> Verified &amp; active</span>
      </header>

      <form className="marketplace-profile-form" onSubmit={saveProfile}>
        <div className="marketplace-section-heading"><div><p className="section-kicker">PUBLIC PROFILE</p><h2>{isVendor ? 'Shop information' : 'Professional information'}</h2></div></div>
        <div className="market-form-grid">
          <label><span>{isVendor ? 'Shop name' : 'Display name'}</span><input value={form[titleKey] || ''} onChange={(event) => setform((current) => ({ ...current, [titleKey]: event.target.value }))} required /></label>
          <label><span>Phone</span><input value={form.phone || ''} onChange={(event) => setform((current) => ({ ...current, phone: event.target.value }))} /></label>
          <label><span>Service area</span><input value={form.serviceArea || ''} onChange={(event) => setform((current) => ({ ...current, serviceArea: event.target.value }))} /></label>
          {!isVendor && <label><span>Portfolio</span><input type="url" value={form.portfolioLink || ''} onChange={(event) => setform((current) => ({ ...current, portfolioLink: event.target.value }))} /> </label>}
          {!isVendor && <label><span>Starting price (NGN)</span><input type="number" min="0" value={form.startingPrice || ''} onChange={(event) => setform((current) => ({ ...current, startingPrice: event.target.value }))} /></label>}
          {!isVendor && <label><span>Availability</span><input value={form.availability || ''} onChange={(event) => setform((current) => ({ ...current, availability: event.target.value }))} /></label>}
          <label className="market-field-wide"><span>{isVendor ? 'Product types' : 'Specialties'} <small>Comma separated</small></span><input value={listValue} onChange={(event) => setform((current) => ({ ...current, [listKey]: event.target.value.split(',').map((item) => item.trim()).filter(Boolean) }))} /></label>
          <label className="market-field-wide"><span>Introduction</span><textarea rows="4" value={form.description || ''} onChange={(event) => setform((current) => ({ ...current, description: event.target.value }))} /></label>
        </div>
        <div className="marketplace-save-row"><button className="store-button store-button-dark" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save profile'}</button><span><SafetyCertificateOutlined /> Verification details are held separately from this public profile.</span></div>
      </form>

      {isVendor ? (
        <section className="vendor-products-section">
          <div className="marketplace-section-heading"><div><p className="section-kicker">SHOP CATALOG</p><h2>Your products <span>{products.length}</span></h2></div><Link className="store-button store-button-dark" to="/vendor/products/new"><PlusOutlined /> Add product</Link></div>
          {products.length ? <div className="vendor-product-list">{products.map((product) => <article key={product._id} className="vendor-product-row"><img src={product.images?.[0]?.url || '/Innterior.png'} alt={product.title} /><div><strong>{product.title}</strong><span>{product.category?.name || 'Uncategorized'} · {product.quantity || 0} in stock</span></div><b>₦{Number(product.price || 0).toLocaleString()}</b><Link to={`/vendor/products/${product.slug}`}>Edit</Link><button type="button" onClick={() => handleRemove(product.slug)}>Remove</button></article>)}</div> : <div className="vendor-empty-products"><p>Your product catalogue is empty.</p><Link to="/vendor/products/new">Add your first product <ArrowRightOutlined /></Link></div>}
        </section>
      ) : (
        <section className="talent-availability-panel"><div><p className="section-kicker">TALENT SERVICES</p><h2>Enquiries are managed through your published profile.</h2><p>Keep your portfolio and service area current. Booking and escrow payments remain disabled until a compliant payment provider is connected.</p></div><span className="talent-escrow-status"><ClockCircleOutlined /> Escrow provider required</span></section>
      )}
    </div>
  );
};

export default MarketplaceDashboard;
