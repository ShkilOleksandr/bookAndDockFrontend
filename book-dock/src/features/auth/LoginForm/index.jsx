// src/features/auth/LoginForm/index.jsx
import React from 'react';
import styles from './LoginForm.module.css';

export default function LoginForm({
  email,
  password,
  setEmail,
  setPassword,
  error,
  onSubmit
}) {
  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <input
        className={styles.input}
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <input
        className={styles.input}
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <button className={styles.button} type="submit">
        Log In
      </button>
      {error && <p className={styles.error}>{error}</p>}
    </form>
  );
}
