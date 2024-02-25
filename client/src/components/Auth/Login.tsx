import { RedirectToSignIn, useAuth } from '@clerk/clerk-react';
import { useAuthContext } from '~/hooks/AuthContext';

function Login() {
  const { userId } = useAuth();
  const { login } = useAuthContext();
  console.log(userId);
  if (userId) {
    login({ email: 'hello@test.com', password: 'world' });
  }
  return <RedirectToSignIn afterSignInUrl={'/c/new'} />;
}
export default Login;
