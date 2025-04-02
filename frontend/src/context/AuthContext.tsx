import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: any;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          // Verify token and get user data
          const response = await axios.get('http://localhost:5001/api/users/profile', {
            headers: { 'x-auth-token': storedToken }
          });
          setUser(response.data);
          setToken(storedToken);
        } catch (err) {
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post('http://localhost:5001/api/users/login', {
        email,
        password
      });
      
      const { token } = response.data;
      localStorage.setItem('token', token);
      setToken(token);
      
      // Get user profile
      const profileResponse = await axios.get('http://localhost:5001/api/users/profile', {
        headers: { 'x-auth-token': token }
      });
      
      setUser(profileResponse.data);
      navigate('/dashboard');
    } catch (err) {
      throw err; // Let the component handle the error
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}