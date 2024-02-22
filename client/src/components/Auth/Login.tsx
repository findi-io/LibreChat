import { useAuthContext } from '~/hooks/AuthContext';
import { SignIn, useAuth, useUser } from '@clerk/clerk-react';

function Login() {
  const { userId } = useAuth();
  const { user } = useUser();
  const { login } = useAuthContext();
  if (userId && user && user.primaryEmailAddress) {
    try {
      login({ email: user.primaryEmailAddress.emailAddress, password: userId });
    } catch (e) {
      // handle error
    }
    return null;
  }
  return <SignIn />;
}
export default Login;
