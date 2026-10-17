import React, { useEffect, useState } from 'react';
import { CheckOutlined, CloseOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { getApplicationsForReview, roleApplicationDecision } from '../../../functions/applications';

const checksByRole = {
  vendor: [
    ['identity', 'Identity reference reviewed'],
    ['business', 'Business registration reviewed'],
    ['payout', 'Payout account name/provider reviewed'],
    ['terms', 'Marketplace terms accepted'],
  ],
  talent: [
    ['identity', 'Identity reference reviewed'],
    ['portfolio', 'Portfolio reviewed'],
    ['payout', 'Payout account name/provider reviewed'],
    ['terms', 'Marketplace terms accepted'],
  ],
};

const AdminApplications = () => {
  const user = useSelector((state) => state.user);
  const [applications, setapplications] = useState([]);
  const [verification, setverification] = useState({});
  const [reviewNotes, setreviewNotes] = useState({});
  const [loading, setloading] = useState(true);
  const [savingId, setsavingId] = useState('');
  const [filter, setfilter] = useState('pending');

  const loadApplications = async () => {
    try {
      const response = await getApplicationsForReview(user.token);
      setapplications(response.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not load applications.');
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    let active = true;
    getApplicationsForReview(user.token)
      .then((response) => active && setapplications(response.data || []))
      .catch((error) => active && toast.error(error.response?.data?.message || 'Could not load applications.'))
      .finally(() => active && setloading(false));
    return () => { active = false; };
  }, [user?.token]);

  const checksFor = (application) => verification[application._id] || application.verification || {};

  const updateDecision = async (application, status) => {
    setsavingId(application._id);
    try {
      await roleApplicationDecision(user.token, application._id, {
        status,
        verification: checksFor(application),
        reviewNotes: reviewNotes[application._id] ?? application.reviewNotes ?? '',
      });
      toast.success(status === 'approved' ? 'Verified profile activated.' : `Application ${status}.`);
      await loadApplications();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Review could not be saved.');
    } finally {
      setsavingId('');
    }
  };

  const visible = applications.filter((application) => filter === 'all' || application.status === filter);

  return (
    <div className="admin-applications-page">
      <header className="admin-page-header">
        <div><p className="section-kicker">MARKETPLACE TRUST</p><h1>Vendor &amp; talent review</h1><p>Verify each required item before activating a marketplace profile.</p></div>
        <label className="admin-filter-select"><span>Show</span><select value={filter} onChange={(event) => setfilter(event.target.value)}><option value="pending">Pending</option><option value="approved">Approved</option><option value="declined">Declined</option><option value="all">All applications</option></select></label>
      </header>
      <div className="admin-review-notice"><SafetyCertificateOutlined /><span>Approval activates vendor or talent tools. It does not configure payment, custody, or escrow.</span></div>
      {loading ? <p className="admin-review-empty">Loading applications...</p> : visible.length ? (
        <div className="admin-application-list">
          {visible.map((application) => {
            const normalizedRole = application.role === 'furniture-seller' ? 'vendor' : application.role === 'interior-decorator' ? 'talent' : application.role;
            const checks = checksFor(application);
            const roleChecks = checksByRole[normalizedRole] || [];
            const allVerified = roleChecks.every(([key]) => checks[key] === true);
            return (
              <article className="admin-application-card" key={application._id}>
                <div className="admin-application-title">
                  <div><span className={`application-role-tag role-${normalizedRole}`}>{normalizedRole}</span><h2>{application.businessName || application.fullName}</h2><p>{application.fullName} · {application.email} · {application.phone}</p></div>
                  <span className={`application-status status-${application.status}`}>{application.status}</span>
                </div>
                <div className="application-detail-grid">
                  <div><span>Area</span><strong>{application.serviceArea || 'Not specified'}</strong></div>
                  <div><span>Payout provider / account name</span><strong>{application.payoutProvider} · {application.payoutAccountName}</strong></div>
                  {normalizedRole === 'vendor' ? (
                    <>
                      <div><span>Business reference</span><strong>{application.businessRegistrationReference || 'Not supplied'}</strong></div>
                      <div><span>Product types</span><strong>{application.productTypes?.join(', ') || 'Not specified'}</strong></div>
                    </>
                  ) : (
                    <>
                      <div><span>Portfolio</span><strong>{application.portfolioLink || 'Not supplied'}</strong></div>
                      <div><span>Specialties</span><strong>{application.specialties?.join(', ') || 'Not specified'}</strong></div>
                    </>
                  )}
                  <div><span>Identity reference</span><strong>{application.identityReference || 'Not supplied'}</strong></div>
                </div>
                <p className="application-description">{application.description}</p>
                <div className="application-verification-list">
                  {roleChecks.map(([key, label]) => (
                    <label key={key}><input type="checkbox" checked={checks[key] === true} disabled={application.status === 'approved' || (key === 'terms' && checks[key] !== true)} onChange={(event) => setverification((current) => ({ ...current, [application._id]: { ...checks, [key]: event.target.checked } }))} /><span>{label}</span></label>
                  ))}
                </div>
                <label className="application-review-notes"><span>Review note for applicant</span><textarea rows="2" value={reviewNotes[application._id] ?? application.reviewNotes ?? ''} onChange={(event) => setreviewNotes((current) => ({ ...current, [application._id]: event.target.value }))} /></label>
                <div className="admin-application-actions">
                  {application.status !== 'approved' && <button type="button" className="store-button store-button-dark" disabled={!allVerified || savingId === application._id} onClick={() => updateDecision(application, 'approved')}><CheckOutlined /> Verify &amp; activate</button>}
                  {application.status === 'pending' && <button type="button" className="admin-decline-button" disabled={savingId === application._id} onClick={() => updateDecision(application, 'declined')}><CloseOutlined /> Decline</button>}
                  {application.status === 'approved' && <button type="button" className="admin-decline-button" disabled={savingId === application._id} onClick={() => updateDecision(application, 'suspended')}><CloseOutlined /> Suspend profile</button>}
                  <small>{allVerified ? 'All checks complete.' : 'Complete all checks to activate.'}</small>
                </div>
              </article>
            );
          })}
        </div>
      ) : <div className="admin-review-empty">No {filter === 'all' ? '' : `${filter} `}applications.</div>}
    </div>
  );
};

export default AdminApplications;
