import React, { useEffect, useState } from 'react';
import { CheckCircleOutlined, ClockCircleOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Link } from "react-router-dom"
import { getMyApplications, roleApplication } from '../../../functions/applications';

const emptyForm = {
  role: 'vendor',
  fullName: '',
  email: '',
  phone: '',
  businessName: '',
  portfolioLink: '',
  description: '',
  serviceArea: '',
  specialties: '',
  productTypes: '',
  identityReference: '',
  businessRegistrationReference: '',
  payoutProvider: '',
  payoutAccountName: '',
  termsAccepted: false,
};

const statusLabel = { pending: 'Under review', approved: 'Approved', declined: 'Not approved', suspended: 'Suspended' };

const RoleApplicationPage = () => {
  const { user } = useSelector((state) => ({ ...state }));
  const [form, setform] = useState({ ...emptyForm, fullName: user?.name || '', email: user?.email || '' });
  const [applications, setapplications] = useState([]);
  const [loading, setloading] = useState(true);
  const [submitting, setsubmitting] = useState(false);

  const refreshApplications = async () => {
    try {
      const response = await getMyApplications(user.token);
      setapplications(response.data || []);
    } catch {
      setapplications([]);
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    let active = true;
    getMyApplications(user.token)
      .then((response) => active && setapplications(response.data || []))
      .catch(() => active && setapplications([]))
      .finally(() => active && setloading(false));
    return () => { active = false; };
  }, [user?.token]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setsubmitting(true);
    try {
      const payload = {
        ...form,
        specialties: form.specialties.split(',').map((value) => value.trim()).filter(Boolean),
        productTypes: form.productTypes.split(',').map((value) => value.trim()).filter(Boolean),
      };
      await roleApplication(user.token, payload);
      toast.success('Application submitted for verification.');
      setform({ ...emptyForm, fullName: user?.name || '', email: user?.email || '' });
      await refreshApplications();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Application could not be submitted.');
    } finally {
      setsubmitting(false);
    }
  };

  const setField = (event) => {
    const { name, value, checked, type } = event.target;
    setform((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  };

  const pendingOrActive = applications.filter((application) => ['pending', 'approved'].includes(application.status));

  return (
    <div className="market-application-page">
      <header className="market-page-heading">
        <p className="section-kicker">JOIN THE INNTERIOR MARKETPLACE</p>
        <h1>Apply as a <em>vendor or talent.</em></h1>
        <p>We review identity, business or portfolio information, and payout details before a marketplace profile is activated.</p>
      </header>

      {pendingOrActive.map((application) => (
        <section className="application-status-banner" key={application._id}>
          {application.status === 'approved' ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
          <div>
            <strong>{application.role === 'vendor' ? 'Vendor' : 'Talent'} application: {statusLabel[application.status]}</strong>
            <span>{application.reviewNotes || (application.status === 'pending' ? 'Your profile and marketplace tools will activate after verification is complete.' : 'Your marketplace profile is active.')}</span>
          </div>
        </section>
      ))}

      {!loading && pendingOrActive.length > 0 ? (
        pendingOrActive.some((application) => application.status === 'approved') ? (
          <Link className="store-button store-button-dark application-dashboard-link" to={user.role === 'vendor' ? '/vendor/dashboard' : '/talent/dashboard'}>Open your marketplace profile <span aria-hidden="true">→</span></Link>
        ) : null
      ) : (
        <form className="market-application-form" onSubmit={handleSubmit}>
          <div className="market-form-section">
            <div className="market-form-section-heading"><span>01</span><div><h2>Marketplace role</h2><p>Choose the profile you want reviewed.</p></div></div>
            <div className="market-role-choice">
              <label className={form.role === 'vendor' ? 'is-selected' : ''}><input type="radio" name="role" value="vendor" checked={form.role === 'vendor'} onChange={setField} /><strong>Vendor</strong><span>List products and manage your shop.</span></label>
              <label className={form.role === 'talent' ? 'is-selected' : ''}><input type="radio" name="role" value="talent" checked={form.role === 'talent'} onChange={setField} /><strong>Talent</strong><span>Present your design services and portfolio.</span></label>
            </div>
          </div>

          <div className="market-form-section">
            <div className="market-form-section-heading"><span>02</span><div><h2>Contact and profile</h2><p>Information for your marketplace profile.</p></div></div>
            <div className="market-form-grid">
              <label><span>Full name</span><input name="fullName" required maxLength="120" value={form.fullName} onChange={setField} /></label>
              <label><span>Account email</span><input type="email" name="email" required value={form.email} readOnly /></label>
              <label><span>Phone</span><input type="tel" name="phone" required maxLength="40" value={form.phone} onChange={setField} /></label>
              <label><span>{form.role === 'vendor' ? 'Shop / business name' : 'Professional display name'}</span><input name="businessName" required maxLength="140" value={form.businessName} onChange={setField} /></label>
              <label><span>Service / delivery area</span><input name="serviceArea" maxLength="160" value={form.serviceArea} onChange={setField} placeholder="City, region" /></label>
              {form.role === 'talent' ? (
                <>
                  <label><span>Portfolio URL</span><input type="url" name="portfolioLink" required value={form.portfolioLink} onChange={setField} placeholder="https://" /></label>
                  <label className="market-field-wide"><span>Design specialties <small>Comma separated</small></span><input name="specialties" value={form.specialties} onChange={setField} placeholder="Residential, space planning, styling" /></label>
                </>
              ) : (
                <label className="market-field-wide"><span>Product types <small>Comma separated</small></span><input name="productTypes" required value={form.productTypes} onChange={setField} placeholder="Seating, lighting, textiles" /></label>
              )}
              <label className="market-field-wide"><span>Profile introduction</span><textarea name="description" required rows="4" maxLength="3000" value={form.description} onChange={setField} placeholder="Tell customers what you offer and what makes your work distinctive." /></label>
            </div>
          </div>

          <div className="market-form-section">
            <div className="market-form-section-heading"><span>03</span><div><h2>Verification details</h2><p>References are stored privately and only shown to authorized reviewers. Do not enter passwords or full payment card details.</p></div></div>
            <div className="market-form-grid">
              <label><span>Identity verification reference</span><input name="identityReference" required maxLength="120" value={form.identityReference} onChange={setField} placeholder="Reference from your verification process" /></label>
              {form.role === 'vendor' && <label><span>Business registration reference</span><input name="businessRegistrationReference" required maxLength="120" value={form.businessRegistrationReference} onChange={setField} /></label>}
              <label><span>Payout provider</span><input name="payoutProvider" required maxLength="80" value={form.payoutProvider} onChange={setField} placeholder="Bank / licensed payout provider" /></label>
              <label><span>Account holder name</span><input name="payoutAccountName" required maxLength="120" value={form.payoutAccountName} onChange={setField} /></label>
            </div>
            <label className="market-terms-check"><input type="checkbox" name="termsAccepted" checked={form.termsAccepted} onChange={setField} required /><span>I confirm these details are accurate and agree to marketplace review and seller/talent terms.</span></label>
          </div>

          <div className="market-submit-row"><span><SafetyCertificateOutlined /> Submission does not activate marketplace access. Admin verification is required.</span><button className="store-button store-button-dark" type="submit" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit for verification'}</button></div>
        </form>
      )}
    </div>
  );
};

export default RoleApplicationPage;
