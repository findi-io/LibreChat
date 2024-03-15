import { memo, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { ChatContext } from '~/Providers';

import { useChatHelpers } from '~/hooks';
import ChatForm from './Input/ChatForm';

import Footer from './Footer';
import WriterPresentation from './WriterPresentation';
import { useUser } from '@clerk/clerk-react';
import { TiptapCollabProvider } from '@hocuspocus/provider';
import * as Y from 'yjs';

function WriterView({ index = 0 }: { index?: number }) {
  const { conversationId } = useParams();

  const chatHelpers = useChatHelpers(index, conversationId);

  const [provider, setProvider] = useState<TiptapCollabProvider | null>(null);
  const [collabToken, setCollabToken] = useState<string | null>(null);
  const [aiToken, setAiToken] = useState<string | null>(null);
  const { user } = useUser();
  const hasCollab = true;

  useEffect(() => {
    // fetch data
    const dataFetch = async () => {
      const data = await (
        await fetch('/api/collaboration', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })
      ).json();

      const { token } = data;

      // set state when the data received
      setCollabToken(token);
    };
    dataFetch();
  }, []);

  useEffect(() => {
    // fetch data

    setAiToken('test');
  }, []);

  const ydoc = useMemo(() => new Y.Doc(), [conversationId]);

  useLayoutEffect(() => {
    if (hasCollab && collabToken) {
      if (provider) {
        provider.disconnect();
      }
      setProvider(
        new TiptapCollabProvider({
          name: `doc_${conversationId}`,
          appId: '8MZ0X19X',
          token: collabToken,
          document: ydoc,
        }),
      );
    }
  }, [setProvider, collabToken, ydoc, conversationId, hasCollab]);

  if ((hasCollab && (!collabToken || !provider)) || !aiToken) {
    return;
  }

  return (
    <ChatContext.Provider value={chatHelpers}>
      <WriterPresentation
        avatar={user?.imageUrl}
        useSidePanel={true}
        fullName={user?.fullName}
        aiToken={aiToken}
        hasCollab={hasCollab}
        ydoc={ydoc}
        provider={provider}
      >
        <div className="w-full border-t-0 pl-0 pt-2 dark:border-white/20 md:w-[calc(100%-.5rem)] md:border-t-0 md:border-transparent md:pl-0 md:pt-0 md:dark:border-transparent">
          <ChatForm index={index} />
          <Footer />
        </div>
      </WriterPresentation>
    </ChatContext.Provider>
  );
}

export default memo(WriterView);
