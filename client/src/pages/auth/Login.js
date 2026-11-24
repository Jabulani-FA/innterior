import React, { useState, useEffect } from 'react'
import { auth } from './Firebase';
import { toast } from 'react-toastify';
import {MailOutlined, GoogleOutlined, LoadingOutlined } from '@ant-design/icons';
import { getIdToken, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { useSelector } from 'react-redux';
import { createOrUpdateUser} from '../../functions/auth';
import AuthShell from '../../components/auth/AuthShell';


const Login = () => {
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const [loading, setLoading] = useState(false)

  let dispatch = useDispatch()
  let navigate = useNavigate()
  let location = useLocation()
  const { user }  = useSelector((state) => ({...state}))
  
  useEffect(() => {
    let intended = location.state
    if (intended) {
      return
    }
    else{
      if (user && user.token) {
      navigate('/')
    }
    }
    
  }, [user, navigate, location.state])

  const roleBasedRedirect = (res) => {
    let intended = location.state
    if (intended) {
      navigate(intended.from)
    }
    else{
      if (res.data.role === "admin") {
        // console.log('admin');
        navigate('/admin/dashboard')
      } else{
        // console.log('subscriber');
        navigate('/user/history')
      }
    }
  } 

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    //console.table(email, password)
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const idToken = await getIdToken(userCredential.user)
      const res = await createOrUpdateUser(idToken)
      dispatch({
        type: 'LOGGED_IN_USER',
        payload: {
          name: res.data.name,
          email: res.data.email,
          token: idToken,
          role: res.data.role,
          _id: res.data._id,
        }
      })
      roleBasedRedirect(res)
    } catch (error) {
      toast.error(error.response?.data?.error || error.message || 'Unable to sign in.')
    } finally {
      setLoading(false)
    }
  }

  const googleLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider())
      const idToken = await getIdToken(result.user)
      const res = await createOrUpdateUser(idToken)
      dispatch({
        type: 'LOGGED_IN_USER',
        payload: {
          name: res.data.name,
          email: res.data.email,
          token: idToken,
          role: res.data.role,
          _id: res.data._id,
        }
      })
      roleBasedRedirect(res)
    } catch (error) {
      toast.error(error.response?.data?.error || error.message || 'Unable to sign in with Google.')
    }
  }

  // The user fills the login form
  return (
    <AuthShell
      kicker="WELCOME BACK"
      title="Good to have you home."
      description="Sign in to pick up where your next room begins."
      footer={<>New to Innterior? <Link to="/register">Create an account</Link></>}
    >
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
        <label className="auth-field">
          <span>Password</span>
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setpassword(e.target.value)}
            minLength={6}
            required
          />
        </label>
        <div className="auth-form-meta">
          <span>At least 6 characters</span>
          <Link to="/forgot/password">Forgot password?</Link>
        </div>
        <Button
          htmlType="submit"
          className="auth-submit"
          disabled={!email || password.length < 6 || loading}
          block
        >
          {loading ? <LoadingOutlined /> : <MailOutlined />}
          {loading ? 'Signing in...' : 'Continue with email'}
        </Button>
        <div className="auth-divider"><span>OR</span></div>
        <Button htmlType="button" className="auth-google" onClick={googleLogin} block>
          <GoogleOutlined /> Continue with Google
        </Button>
      </form>
    </AuthShell>
  )
}

export default Login