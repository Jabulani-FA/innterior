import React, { useState, useEffect } from 'react'
import { auth } from './Firebase';
import { toast } from 'react-toastify';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined, ArrowRightOutlined, CheckOutlined, MailOutlined } from '@ant-design/icons';
import AuthShell from '../../components/auth/AuthShell';

const ForgotPassword = () => {
    const [email, setemail] = useState('')
    const [loading, setloading] = useState(false)
    const [sentTo, setSentTo] = useState('')
    const navigate = useNavigate()
    const { user }  = useSelector((state) => ({...state}))

    useEffect(() => {
        if (user && user.token) {
            navigate('/')
        }
    }, [navigate, user]);
    const resetPassword = (e) => {
        e.preventDefault();
        setloading(true)
        const config = {
            url: `${window.location.origin}/login`,
            handleCodeInApp: true,
        };
        sendPasswordResetEmail(auth, email, config)
        .then(() =>{
            toast.success(`Reset link has been sent to ${email}. Click link to change password.`)
            window.localStorage.setItem('emailForPasswordReset', email);
            setSentTo(email)
            setemail('')
            setloading(false)
          
        })
        .catch((error) => {
            const errorMessage = error.message;
            toast.error(`${errorMessage}`)
            setloading(false)
        })
    }

    return (
        <AuthShell
            kicker="ACCOUNT ACCESS"
            title={sentTo ? "Your reset link is on its way." : "Let’s get you back in."}
            description={sentTo ? `We sent password reset instructions to ${sentTo}. Follow the link in that email to choose a new password.` : "Enter the email address connected to your account and we’ll send a secure reset link."}
            footer={<Link to="/login"><ArrowLeftOutlined /> Back to sign in</Link>}
        >
            {sentTo ? (
                <div className="auth-success-state" role="status">
                    <span className="auth-success-icon"><CheckOutlined /></span>
                    <div>
                        <strong>Check your email</strong>
                        <p>If the address is registered, reset instructions will arrive shortly.</p>
                    </div>
                    <button className="auth-text-button" type="button" onClick={() => setSentTo('')}>
                        Try another address <ArrowRightOutlined />
                    </button>
                </div>
            ) : (
                <form className="auth-form" onSubmit={resetPassword}>
                    <label className="auth-field">
                        <span>Email address</span>
                        <input
                            type="email"
                            name="email"
                            autoComplete="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setemail(e.target.value)}
                            autoFocus
                            required
                        />
                    </label>
                    <p className="auth-field-hint"><MailOutlined /> The reset link will be sent to this address.</p>
                    <button className="auth-submit" type="submit" disabled={!email || loading}>
                        {loading ? 'Sending instructions...' : 'Send reset link'} <ArrowRightOutlined />
                    </button>
                </form>
            )}
        </AuthShell>
    )
}

export default ForgotPassword