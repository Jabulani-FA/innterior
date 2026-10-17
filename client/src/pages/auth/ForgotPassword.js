import React from 'react'
import { useState, useEffect } from 'react'
import { auth } from './Firebase';
import { toast } from 'react-toastify';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setemail] = useState('')
    const [loading, setloading] = useState(false)
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
            url: 'http://localhost:3000/login',
            handleCodeInApp: true,
        };
        sendPasswordResetEmail(auth, email, config)
        .then(() =>{
            toast.success(`Reset link has been sent to ${email}. Click link to change password.`)
            window.localStorage.setItem('emailForPasswordReset', email);
            // ...
            setemail('')
            setloading(false)
          
        })
        .catch((error) => {
            const errorMessage = error.message;
            toast.error(`${errorMessage}`)
            setloading(false)
        })
    }

    const ForgotPasswordForm = () =>
        <form onSubmit={resetPassword}>
            <p>Reset Your Password</p>
            <div className='form' >
                <input type='email' name='email' className='form-control' value={email} placeholder='Enter your Email' onChange={e => setemail(e.target.value)} autoFocus/>
                <button type='submit' className='btn btn-raised' 
                style={{
                    width: '100%',
                    marginTop: '20px',
                }}
                >Reset Password</button>
            </div>
        </form>    
    return (
        <div className='container p-5'>
            <div className='row'>
                <div className='col-md-6 offset-md-3'>
                    {loading?<h4 className='text-danger'>Loading...</h4>:<h4>Forgot Password</h4>}
                    {ForgotPasswordForm()}
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword