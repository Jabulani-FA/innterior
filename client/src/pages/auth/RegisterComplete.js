import { React, useState, useEffect }from 'react'
import { auth } from './Firebase'
import { getIdToken, signInWithEmailLink } from 'firebase/auth'
import {toast} from 'react-toastify'
import { updatePassword } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { createOrUpdateUser } from '../../functions/auth';
import AuthShell from '../../components/auth/AuthShell';

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
    useEffect(() => {
      setemail(window.localStorage.getItem('emailForRegistration') || '');
    }, [])
    
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
      <form className='auth-form' onSubmit={handleSubmit}>
        <label className='auth-field'>
          <span>Email address</span>
                <input type='email' name='email' autoComplete='email' value={email} readOnly={Boolean(email)} onChange={e => setemail(e.target.value)} required/>
        </label>
        <label className='auth-field'>
          <span>Create a password</span>
          <input type='password' name='password' autoComplete='new-password' placeholder='At least 6 characters' value={password} onChange={e => setpassword(e.target.value)} minLength={6} required/>
        </label>
        <button type='submit' className='auth-submit'>Finish creating account</button>
        </form>
    
    
  return (
    <AuthShell
      kicker='ONE LAST STEP'
      title='Make yourself at home.'
      description='Choose a password to finish creating your Innterior account.'
      step={2}
    >
      {RegisterCompleteForm()}
    </AuthShell>
  )
}

export default RegisterComplete