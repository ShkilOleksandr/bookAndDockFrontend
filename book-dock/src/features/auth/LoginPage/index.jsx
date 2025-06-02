// src/features/auth/LoginPage/index.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoginForm from '../LoginForm';
import styles from './LoginPage.module.css';

export default function LoginPage() {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const navigate = useNavigate();

  const handleLogin = async e => {
    e.preventDefault();
    setError('');

    // dev stub
    // if (email === 'admin2@example.com' && password === 'admin123') {
    //   localStorage.setItem('token', 'fake-jwt-token-for-dev');
    //   navigate('/');
    //   return;
    // }

    try {
      const { data } = await axios.post(
        'https://se2.lemonfield-889f35af.germanywestcentral.azurecontainerapps.io/api/Auth/login',
        { email, password }
      );
      localStorage.setItem('token', data.token);
      navigate('/');
    } catch {
      setError('Login failed: check your credentials');
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Admin Login</h2>
      <LoginForm
        email={email}
        password={password}
        setEmail={setEmail}
        setPassword={setPassword}
        error={error}
        onSubmit={handleLogin}
      />
    </div>
  );
}
