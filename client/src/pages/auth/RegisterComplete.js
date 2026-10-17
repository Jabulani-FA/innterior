import { React, useState, useEffect }from 'react'
import { auth } from './Firebase'
import { getIdToken, signInWithEmailLink } from 'firebase/auth'
import {toast} from 'react-toastify'
import { updatePassword } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { Steps} from 'antd';
import { useSelector, useDispatch } from 'react-redux'
import { createOrUpdateUser } from '../../functions/auth';

const RegisterComplete = () => {
    const [email, setemail] = useState('')
    const [password, setpassword] = useState('')
    const navigate = useNavigate();
    const { user }  = useSelector((state) => ({...state}))
    const dispatch = useDispatch()

    useEffect(() => {
      if (user && user.token) {
        navigate('/')
      }
    }, [navigate, user]);
    const items = [
      {
        title: 'Register',
      },
      {
        title: 'Complete Registration',
      },
    ]
    useEffect(() => {
      setemail(window.localStorage.getItem('emailForRegistration', email));
    }, [email])
    
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!email || !password) {
        toast.error('Both Email and Password fields must be filled for registration')
        return
      }else if (password.length < 6) {
        toast.error('Password length must be at least 6 characters')
        return;
      }else {
        try {
            const result = await signInWithEmailLink(auth, email, window.location.href);
            console.log('Result', result);
            if (result.user.emailVerified) {
                // remove user email from local storage
                window.localStorage.removeItem('emailForRegistration')
                // get user id token
                let user  = auth.currentUser
                await updatePassword(user, password);
                const idTokenResult = await getIdToken(user)
                
                // redux store
                console.log('id token:', idTokenResult);
                console.log('user:', user);
                toast.success('Registration successful!');
                
                createOrUpdateUser(idTokenResult)
                .then((res) => {
                  dispatch({
                    type: 'LOGGED_IN_USER',
                    payload: {
                      name: res.data.name,
                      email: res.data.email,
                      token: idTokenResult,
                      role: res.data.role,
                      _id: res.data._id,
                    }
                  });
                })
                .catch((error) => console.log("Caught ", error))
                // redirect
                navigate('/')
            }
        }
        catch (error) {
            const errorMessage = error.message;
            toast.error(`${errorMessage}`,{
                position: toast.POSITION.TOP_RIGHT
            })
        }
      }
    };
    const RegisterCompleteForm = () =>
        <form onSubmit={handleSubmit}>
            <p>Complete Registration Form</p>
            <div className='form'>
                <input type='email' name='email' className='form-control' value={email} disabled={email.endsWith('.com')} onChange={e => setemail(e.target.value)}/>
            </div>
            <div className='form'>
                <input type='password' name='password' className='form-control' placeholder='Enter your password' value={password} onChange={e => setpassword(e.target.value)}/>
            </div>
            <button type='submit' className='btn btn-raised'>Register</button>
        </form>
    
    
  return (
    <div className='container p-5'>
      <div className='row'>
        <div className='col-md-6 offset-md-3'>
          <Steps
              direction='horizontal'
              current={1}
              items={items}
              block
              className='registerStep'
          />
          <h4>Complete Register</h4>
          {RegisterCompleteForm()}
        </div>   
      </div>
    </div>
  )
}

export default RegisterComplete