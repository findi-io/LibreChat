import { SignIn, useAuth, useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const { userId } = useAuth();
  const navigate = useNavigate();
  if (userId) {
    navigate('/', { replace: true });
  }
  return <SignIn />;
}
export default Login;
