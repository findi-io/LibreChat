import { useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { EModelEndpoint } from 'librechat-data-provider';
import {
  useGetModelsQuery,
  useGetStartupConfig,
  useGetEndpointsQuery,
} from 'librechat-data-provider/react-query';
import type { TPreset } from 'librechat-data-provider';
import { useNewConvo, useAppStartup, useAssistantListMap } from '~/hooks';
import { getDefaultModelSpec, getModelSpecIconURL } from '~/utils';
import { useGetConvoIdQuery } from '~/data-provider';
import ChatView from '~/components/Chat/ChatView';
import useAuthRedirect from './useAuthRedirect';
import { Spinner } from '~/components/svg';
import store from '~/store';

export default function ChatRoute() {
  const { data: startupConfig } = useGetStartupConfig();
  const { isAuthenticated, user } = useAuthRedirect();
  useAppStartup({ startupConfig, user });
  const navigate = useNavigate();
  const index = 0;
  const { conversationId } = useParams();

  const { conversation } = store.useCreateConversationAtom(index);
  const { newConversation } = useNewConvo();
  const hasSetConversation = useRef(false);

  const modelsQuery = useGetModelsQuery({
    enabled: isAuthenticated,
    refetchOnMount: 'always',
  });
  const initialConvoQuery = useGetConvoIdQuery(conversationId ?? '', {
    enabled: isAuthenticated && conversationId !== 'new',
  });
  const endpointsQuery = useGetEndpointsQuery({ enabled: isAuthenticated });
  const assistantListMap = useAssistantListMap();

  useEffect(() => {
    if (
      startupConfig &&
      conversationId === 'new' &&
      endpointsQuery.data &&
      modelsQuery.data &&
      !modelsQuery.data?.initial &&
      !hasSetConversation.current
    ) {
      const spec = getDefaultModelSpec(startupConfig.modelSpecs?.list);

      newConversation({
        modelsData: modelsQuery.data,
        template: conversation ? conversation : undefined,
        ...(spec
          ? {
            preset: {
              ...spec.preset,
              iconURL: getModelSpecIconURL(spec),
              spec: spec.name,
            },
          }
          : {}),
      });

      hasSetConversation.current = true;
    } else if (
      startupConfig &&
      initialConvoQuery.data &&
      endpointsQuery.data &&
      modelsQuery.data &&
      !modelsQuery.data?.initial &&
      !hasSetConversation.current
    ) {
      newConversation({
        template: initialConvoQuery.data,
        /* this is necessary to load all existing settings */
        preset: initialConvoQuery.data as TPreset,
        modelsData: modelsQuery.data,
        keepLatestMessage: true,
      });
      hasSetConversation.current = true;
    } else if (
      startupConfig &&
      !hasSetConversation.current &&
      !modelsQuery.data?.initial &&
      conversationId === 'new' &&
      assistantListMap[EModelEndpoint.assistants] &&
      assistantListMap[EModelEndpoint.azureAssistants]
    ) {
      const spec = getDefaultModelSpec(startupConfig.modelSpecs?.list);
      newConversation({
        modelsData: modelsQuery.data,
        template: conversation ? conversation : undefined,
        ...(spec
          ? {
            preset: {
              ...spec.preset,
              iconURL: getModelSpecIconURL(spec),
              spec: spec.name,
            },
          }
          : {}),
      });
      hasSetConversation.current = true;
    } else if (
      startupConfig &&
      !hasSetConversation.current &&
      !modelsQuery.data?.initial &&
      assistantListMap[EModelEndpoint.assistants] &&
      assistantListMap[EModelEndpoint.azureAssistants]
    ) {
      newConversation({
        template: initialConvoQuery.data,
        preset: initialConvoQuery.data as TPreset,
        modelsData: modelsQuery.data,
        keepLatestMessage: true,
      });
      hasSetConversation.current = true;
    }
    /* Creates infinite render if all dependencies included due to newConversation invocations exceeding call stack before hasSetConversation.current becomes truthy */
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // if it's running in plugin, get the real conversationId
    if(window.Asc && window.Asc.plugin && window.Asc.plugin.info) {
      if(conversationId === 'new') {
        fetch(`/conversation?doc=${window.Asc.plugin.info.documentId}`, {
          method: 'GET',
        }).then(response => {
          if (response.ok) {
            response.text().then(data => {
              if(data !== 'new') {
                navigate(`/c/${data}`);
              }
            });
          }
        });
      }else {
        fetch(`/conversation?doc=${window.Asc.plugin.info.documentId}&title=${window.Asc.plugin.info.documentTitle}&conversationId=${conversationId}`, {
          method: 'POST',
        });
      }

    }
  }, [
    startupConfig,
    initialConvoQuery.data,
    endpointsQuery.data,
    modelsQuery.data,
    assistantListMap,
  ]);

  if (endpointsQuery.isLoading || modelsQuery.isLoading) {
    return <Spinner className="m-auto text-black dark:text-white" />;
  }

  if (!isAuthenticated) {
    return null;
  }

  // if not a conversation
  if (conversation?.conversationId === 'search') {
    return null;
  }
  // if conversationId not match
  if (conversation?.conversationId !== conversationId && !conversation) {
    return null;
  }
  // if conversationId is null
  if (!conversationId) {
    return null;
  }

  return <ChatView index={index} />;
}
