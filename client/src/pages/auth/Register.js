import React, { useState, useEffect } from 'react'
import { auth } from './Firebase'
import {sendSignInLinkToEmail } from 'firebase/auth'
import {toast} from 'react-toastify'
import { Steps} from 'antd';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Register = () => {
  const [email, setemail] = useState('')
  const navigate = useNavigate()
  const { user }  = useSelector((state) => ({...state}))

  useEffect(() => {
    if (user && user.token) {
        navigate('/')
    }
  }, [navigate, user]);
  
  const handleSubmit = (e) => {
    e.preventDefault()
    const config = {
      url: 'http://localhost:3000/register/complete',
      handleCodeInApp: true,
    };
    sendSignInLinkToEmail(auth, email, config)
    .then(() =>{
      toast.success(`Email link has been sent to ${email}. Click link to complete registration.`)
      window.localStorage.setItem('emailForRegistration', email);
      // ...
      setemail('')
    })
    .catch((error) => {
      const errorMessage = error.message;
      toast.error(`${errorMessage}`)
    })
    
  };
  const items = [
    {
      title: 'Register',
    },
    {
      title: 'Complete Registration',
    },
  ]
  const RegisterForm = () =>
    <form onSubmit={handleSubmit}>
      <p>Register Form</p>
      <input type='email' name='email' className='form-control' placeholder='Enter your Email' value={email} onChange={e => setemail(e.target.value)}/>
      <button type='submit' className='btn btn-raised'>Register</button>
    </form>
  
  return (
    <div className='container p-5'>
      <div className='row'>
        <div className='col-md-6 offset-md-3'>
          <Steps
            direction='horizontal'
            current={0}
            items={items}
            block
            className='registerStep'
          />
          <h4>Register</h4>
          {RegisterForm()}
        </div>   
      </div>
    </div>
  )
}

export default Register