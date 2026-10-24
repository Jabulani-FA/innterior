import React, { useState, useEffect } from 'react'
import { auth } from './Firebase'
import { sendSignInLinkToEmail } from 'firebase/auth'
import {toast} from 'react-toastify'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ArrowRightOutlined, CheckOutlined, MailOutlined } from '@ant-design/icons';
import AuthShell from '../../components/auth/AuthShell';

const Register = () => {
  const [email, setemail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sentTo, setSentTo] = useState('')
  const navigate = useNavigate()
  const { user }  = useSelector((state) => ({...state}))

  useEffect(() => {
    if (user && user.token) {
        navigate('/')
    }
  }, [navigate, user]);
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const config = {
      url: `${window.location.origin}/register/complete`,
      handleCodeInApp: true,
    };
    try {
      await sendSignInLinkToEmail(auth, email, config)
      toast.success(`Email link has been sent to ${email}. Click link to complete registration.`)
      window.localStorage.setItem('emailForRegistration', email);
      setSentTo(email)
      setemail('')
    } catch (error) {
      const errorMessage = error.message;
      toast.error(`${errorMessage}`)
    } finally {
      setLoading(false)
    }
  };
  
  return (
    <AuthShell
      kicker="A HOME OF YOUR OWN"
      title={sentTo ? "Check your inbox." : "Let’s get you settled."}
      description={sentTo ? `We sent a secure sign-up link to ${sentTo}. Open it to finish creating your account.` : "Create an account to keep your favorite pieces and make every visit feel familiar."}
      step={1}
      footer={<>Already have an account? <Link to="/login">Sign in</Link></>}
    >
      {sentTo ? (
        <div className="auth-success-state" role="status">
          <span className="auth-success-icon"><CheckOutlined /></span>
          <div>
            <strong>Registration link sent</strong>
            <p>Use the link in your email to choose a password and complete setup.</p>
          </div>
          <button className="auth-text-button" type="button" onClick={() => setSentTo('')}>
            Use a different email <ArrowRightOutlined />
          </button>
        </div>
      ) : (
        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-field">
            <span>Email address</span>
            <input
              type="email"
              name="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setemail(e.target.value)}
              required
            />
          </label>
          <p className="auth-field-hint"><MailOutlined /> We’ll email you a secure link to finish setting up.</p>
          <button className="auth-submit" type="submit" disabled={!email || loading}>
            {loading ? 'Sending link...' : 'Send sign-up link'} <ArrowRightOutlined />
          </button>
        </form>
      )}
    </AuthShell>
  )
}

export default Register