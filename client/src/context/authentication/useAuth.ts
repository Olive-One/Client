import { useContext } from 'react';
import { AuthContext, type AuthContextType } from './AuthProvider';

const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context as AuthContextType;
};

export default useAuth; 