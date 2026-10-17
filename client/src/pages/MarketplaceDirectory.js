import React, { useEffect, useState } from 'react';
import { ArrowRightOutlined, EnvironmentOutlined, ShopOutlined, TeamOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { getPublicMakers } from '../functions/applications';

const MarketplaceDirectory = () => {
  const [view, setview] = useState('talents');
  const [vendors, setvendors] = useState([]);
  const [talents, settalents] = useState([]);
  const [loading, setloading] = useState(true);
  const [error, seterror] = useState('');

  useEffect(() => {
    Promise.all([getPublicMakers('vendors'), getPublicMakers('talents')])
      .then(([vendorResponse, talentResponse]) => {
        setvendors(vendorResponse.data || []);
        settalents(talentResponse.data || []);
      })
      .catch(() => seterror('Makers could not be loaded right now.'))
      .finally(() => setloading(false));
  }, []);

  const people = view === 'vendors' ? vendors : talents;

  return (
    <div className="makers-page">
      <header className="makers-heading">
        <p className="section-kicker">THE PEOPLE BEHIND THE PIECES</p>
        <h1>Meet the <em>makers.</em></h1>
        <p>Discover verified home retailers and interior design professionals in the Innterior community.</p>
      </header>
      <div className="makers-toolbar">
        <div className="makers-tabs" role="tablist" aria-label="Marketplace members">
          <button type="button" role="tab" aria-selected={view === 'talents'} className={view === 'talents' ? 'is-active' : ''} onClick={() => setview('talents')}><TeamOutlined /> Design talent <span>{talents.length}</span></button>
          <button type="button" role="tab" aria-selected={view === 'vendors'} className={view === 'vendors' ? 'is-active' : ''} onClick={() => setview('vendors')}><ShopOutlined /> Vendors <span>{vendors.length}</span></button>
        </div>
        <Link to="/user/role-application">Apply to join <ArrowRightOutlined /></Link>
      </div>
      {loading ? <div className="makers-empty">Loading verified marketplace profiles...</div> : error ? <div className="makers-empty">{error}</div> : people.length ? (
        <div className="maker-grid">
          {people.map((person) => (
            <article className="maker-card" key={person._id}>
              <div className="maker-card-top"><span className="maker-verified-mark">VERIFIED</span><span>{view === 'vendors' ? <ShopOutlined /> : <TeamOutlined />}</span></div>
              <h2>{view === 'vendors' ? person.shopName : person.displayName}</h2>
              <p className="maker-area"><EnvironmentOutlined /> {person.serviceArea || 'Nigeria'}</p>
              <p className="maker-description">{person.description || (view === 'vendors' ? 'A verified Innterior marketplace shop.' : 'A verified interior design professional.')}</p>
              <div className="maker-tags">
                {(view === 'vendors' ? person.productTypes : person.specialties)?.slice(0, 4).map((tag) => <span key={tag}>{tag}</span>)}
              </div>
              {view === 'talents' && person.portfolioLink && <a className="maker-profile-link" href={person.portfolioLink} target="_blank" rel="noreferrer">View portfolio <ArrowRightOutlined /></a>}
              {view === 'talents' && person.startingPrice > 0 && <span className="maker-starting-price">From ₦{Number(person.startingPrice).toLocaleString()}</span>}
            </article>
          ))}
        </div>
      ) : (
        <div className="makers-empty"><span>{view === 'vendors' ? <ShopOutlined /> : <TeamOutlined />}</span><h2>No verified {view} yet</h2><p>Approved profiles will appear here after our verification review.</p><Link className="store-button store-button-dark" to="/user/role-application">Apply to join <ArrowRightOutlined /></Link></div>
      )}
    </div>
  );
};

export default MarketplaceDirectory;
