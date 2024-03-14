import { useAuthContext } from '~/hooks/AuthContext';
import { SignIn, useAuth, useUser } from '@clerk/clerk-react';

function Login() {
  const { userId, orgId } = useAuth();
  const { user } = useUser();
  const { login } = useAuthContext();
  const id = orgId ? orgId : userId;
  if (id) {
    try {
      login({ email: id, password: id });
    } catch (e) {
      // handle error
      console.log(e);
    }
    return null;
  }
  return <SignIn />;
}
export default Login;
