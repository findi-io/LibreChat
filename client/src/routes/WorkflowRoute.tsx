import { useEffect } from 'react';
import { useAuth, useSession } from '@clerk/clerk-react';
export default function WorkflowRoute() {
  const { session } = useSession();
  const { userId, orgId } = useAuth();
  useEffect(() => {
    console.log('load activepieces');
    session?.getToken({ template: orgId ? 'ap_org' : 'ap_user' }).then((result) => {
      activepieces.configure({
        prefix: '/workflow',
        instanceUrl: 'https://workflow.chatlog.ai',
        jwtToken: result,
        embedding: {
          containerId: 'ap_container',
          builder: {
            disableNavigation: false,
          },
          dashboard: {
            hideSidebar: true,
          },
          hideFolders: true,
        },
      });
    });
  }, [orgId, userId]);
  return <div id="ap_container" className="h-full w-full"></div>;
}
