import { memo, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useParams, useLocation } from 'react-router-dom';
import { useGetMessagesByConvoId } from 'librechat-data-provider/react-query';
import { ChatContext, useFileMapContext } from '~/Providers';
import MessagesView from './Messages/MessagesView';
import { useChatHelpers, useSSE } from '~/hooks';
import { Spinner } from '~/components/svg';
import ChatForm from './Input/ChatForm';
import { buildTree } from '~/utils';
import Landing from './Landing';
import Header from './Header';
import Footer from './Footer';
import store from '~/store';
import WriterPresentation from './WriterPresentation';
import { useUser } from '@clerk/clerk-react';
import { TiptapCollabProvider } from '@hocuspocus/provider';
import * as Y from 'yjs';

function WriterView({ index = 0 }: { index?: number }) {
  const { conversationId } = useParams();
  const submissionAtIndex = useRecoilValue(store.submissionByIndex(0));
  useSSE(submissionAtIndex);

  const fileMap = useFileMapContext();

  const { data: messagesTree = null, isLoading } = useGetMessagesByConvoId(conversationId ?? '', {
    select: (data) => {
      const dataTree = buildTree({ messages: data, fileMap });
      return dataTree?.length === 0 ? null : dataTree ?? null;
    },
    enabled: !!fileMap,
  });

  const chatHelpers = useChatHelpers(index, conversationId);

  const [provider, setProvider] = useState<TiptapCollabProvider | null>(null);
  const [collabToken, setCollabToken] = useState<string | null>(null);
  const [aiToken, setAiToken] = useState<string | null>(null);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const { user } = useUser();
  const hasCollab = parseInt(searchParams.get('noCollab') as string) !== 1;

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
        {isLoading && conversationId !== 'new' ? (
          <div className="flex h-screen items-center justify-center">
            <Spinner className="opacity-0" />
          </div>
        ) : messagesTree && messagesTree.length !== 0 ? (
          <MessagesView messagesTree={messagesTree} Header={<Header />} />
        ) : (
          <Landing Header={<Header />} />
        )}
        <div className="w-full border-t-0 pl-0 pt-2 dark:border-white/20 md:w-[calc(100%-.5rem)] md:border-t-0 md:border-transparent md:pl-0 md:pt-0 md:dark:border-transparent">
          <ChatForm index={index} />
          <Footer />
        </div>
      </WriterPresentation>
    </ChatContext.Provider>
  );
}

export default memo(WriterView);
