// src/hooks/useUser.js
import { useState, useEffect } from 'react';

const useUser = () => {
  const [username, setUsername] = useState(() => {
    return localStorage.getItem('username') || '';
  });

  const setUser = (newUsername) => {
    setUsername(newUsername);
    localStorage.setItem('username', newUsername);
  };

  const clearUser = () => {
    setUsername('');
    localStorage.removeItem('username');
  };

  return { username, setUser, clearUser };
};

export default useUser;