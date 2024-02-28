import { useAuthContext } from '~/hooks/AuthContext';
import { SignOutButton, SignedIn } from '@clerk/clerk-react';
import { LogOutIcon } from '../svg';
import { useLocalize } from '~/hooks';
function Error() {
  const { logout } = useAuthContext();
  const localize = useLocalize();
  return;
  <>
    <h3>error happended</h3>
    <a href="/login">retry</a>
    <SignedIn>
      <SignOutButton signOutCallback={() => logout()}>
        <button className="flex w-full cursor-pointer items-center gap-3 px-3 py-3 text-sm text-white transition-colors duration-200 hover:bg-gray-700">
          <LogOutIcon />
          {localize('com_nav_log_out')}
        </button>
      </SignOutButton>
    </SignedIn>
  </>;
}
export default Error;
