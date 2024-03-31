import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/login.css';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { getToken, setToken } from '../../utils/TokenContext';
import baseURL from '../../utils/fetchConfig';


const LoginPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${baseURL}/auth/signin`, {
        username,
        password,
      });
      setToken(response.data.token);
      const token = getToken();
      localStorage.setItem('username', username);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      navigate('/feed');
    } catch (error) {
      setError('Username or password incorrect');
    }
  };


  const handleSignUp = async () => {
    try {
      const response = await axios.post(`${baseURL}/auth/signup`, {
        username,
        email,
        password,
      });
      console.log('Sign up successful:', response.data);
    } catch (error) {
      console.error('Sign up failed:', error.response.data);
    }
  };
  const navigateToHome = () => {
    navigate('/');
  };

  return (
    <div className='login-page'>
      <button className='home-button' onClick={navigateToHome}>
        <FiArrowLeft />
        Home
      </button>
      <div className={`container ${isSignUp ? 'active' : ''}`}>
        <div className='form-container sign-up'>
          <form onSubmit={(e) => { e.preventDefault(); handleSignUp(); }}>
            <h1>Create Account</h1>
            <input type='text' placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)} />
            <input type='email' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type='submit'>Sign Up</button>
          </form>
        </div>
        <div className='form-container sign-in'>
          <form onSubmit={(e) => handleSignIn(e)}>
            <h1>Sign in</h1>
            <input type='text' placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)} />
            <input type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type='submit'>Sign In</button>
            {error && <p>{error}</p>}
          </form>
        </div>
        <div className='toggle-container'>
          <div className='toggle'>
            <div className='toggle-panel toggle-left'>
              <h1>Welcome Back!</h1>
              <p>Enter your personal details to use all site features</p>
              <button className='sign' onClick={() => setIsSignUp(false)}>
                Sign In
              </button>
              {error && <p>{error}</p>}
            </div>
            <div className='toggle-panel toggle-right'>
              <h1>Hello, INE !</h1>
              <p>Register with your personal details to use all site features</p>
              <button className='sign' onClick={() => setIsSignUp(true)}>
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
