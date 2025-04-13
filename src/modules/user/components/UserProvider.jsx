import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Check for email in localStorage (simplified auth)
    const storedEmail = localStorage.getItem('userEmail');
    
    const fetchOrCreateUser = async () => {
      if (storedEmail) {
        try {
          // Get user by email
          const response = await fetch(`/api/users?email=${encodeURIComponent(storedEmail)}`);
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else {
            // Remove invalid email
            localStorage.removeItem('userEmail');
          }
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      }
      setIsLoading(false);
    };
    
    fetchOrCreateUser();
  }, []);
  
  const login = async (email) => {
    try {
      setIsLoading(true);
      // Create or get user
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        localStorage.setItem('userEmail', email);
      } else {
        throw new Error('Failed to login');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = () => {
    localStorage.removeItem('userEmail');
    setUser(null);
  };
  
  return (
    <UserContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export default UserProvider;