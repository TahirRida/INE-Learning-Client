import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/login.css';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { getToken, setToken } from '../../utils/TokenContext';
import baseURL from '../../utils/fetchConfig';


const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [notAdmin, setNotAdmin] = useState('');
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${baseURL}/auth/signin`, {
        username,
        password,
      });
      setToken(response.data.token);
      const role = response.data.roles[0]
      const token = getToken();
      localStorage.setItem('username', username);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      console.log('role:', response.data.roles[0])
      if (role == "ROLE_ADMIN") {
        navigate('/adminpage')
      }
      setNotAdmin('Not and Admin account')
    } catch (error) {
      setError('Username or password incorrect');
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
      <div className={'container active'}>
        <div className='form-container sign-up'>
          <form onSubmit={(e) => handleSignIn(e)}>
            <h1>Admin Console</h1>
            <input type='text' placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)} />
            <input type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type='submit'>Sign In</button>
            {error && <p>{error}</p>}
            {notAdmin && <p>{notAdmin}</p>}
          </form>
        </div>
        <div className='form-container sign-in'>
        </div>
        <div className='toggle-container'>
          <div className='toggle'>
            <div className='toggle-panel toggle-left'>
              <h1>Hello Admin!</h1>
              <p style={{ fontSize: '18px', fontStyle: 'oblique' }}>Enter your personal details to use all site features as an administrator</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
