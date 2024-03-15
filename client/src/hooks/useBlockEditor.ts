import { useContext, useEffect, useMemo, useState } from 'react';

import { Editor, useEditor } from '@tiptap/react';
import Collaboration from '@tiptap/extension-collaboration';
import CollabHistory from '@tiptap-pro/extension-collaboration-history';

import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
import { TiptapCollabProvider, WebSocketStatus } from '@hocuspocus/provider';
import * as Y from 'yjs';
import { ExtensionKit } from '~/extensions/extension-kit';
import { EditorContext } from '../context/EditorContext';
import { userColors, userNames } from '../lib/constants';
import { randomElement } from '../lib/utils';
import { EditorUser } from '~/components/BlockEditor/types';

import { Ai } from '~/extensions';

const TIPTAP_AI_APP_ID = process.env.NEXT_PUBLIC_TIPTAP_AI_APP_ID;
const TIPTAP_AI_BASE_URL =
  process.env.NEXT_PUBLIC_TIPTAP_AI_BASE_URL || 'https://api.tiptap.dev/v1/ai';

declare global {
  interface Window {
    editor: Editor | null;
  }
}
let lastProvider: TiptapCollabProvider | null | undefined = null;
export const useBlockEditor = ({
  aiToken,
  ydoc,
  fullName,
  avatar,
  provider,
}: {
  aiToken: string;
  ydoc: Y.Doc;
  fullName: string | null | undefined;
  avatar: string | null | undefined;
  provider?: TiptapCollabProvider | null | undefined;
}) => {
  const [collabState, setCollabState] = useState<WebSocketStatus>(WebSocketStatus.Connecting);
  const { setIsAiLoading, setAiError } = useContext(EditorContext);
  if (lastProvider) {
    lastProvider.disconnect();
  }
  lastProvider = provider;
  const editor = useEditor(
    {
      autofocus: true,
      onCreate: ({ editor }) => {
        provider?.on('synced', () => {
          if (editor.isEmpty) {
            editor.commands.setContent('');
          }
        });
      },
      extensions: [
        ...ExtensionKit({
          provider,
        }),
        CollabHistory.configure({
          provider,
        }),
        Collaboration.configure({
          document: ydoc,
        }),
        CollaborationCursor.configure({
          provider,
          user: {
            name: fullName,
            avatar: avatar,
            color: randomElement(userColors),
          },
        }),
        Ai.configure({
          appId: TIPTAP_AI_APP_ID,
          token: aiToken,
          baseUrl: TIPTAP_AI_BASE_URL,
          autocompletion: true,
          onLoading: () => {
            setIsAiLoading(true);
            setAiError(null);
          },
          onSuccess: () => {
            setIsAiLoading(false);
            setAiError(null);
          },
          onError: (error) => {
            setIsAiLoading(false);
            setAiError(error.message);
          },
        }),
      ],
      editorProps: {
        attributes: {
          autocomplete: 'off',
          autocorrect: 'off',
          autocapitalize: 'off',
          class: 'min-h-full',
        },
      },
    },
    [ydoc, provider],
  );

  const users = useMemo(() => {
    if (!editor?.storage.collaborationCursor?.users) {
      return [];
    }

    return editor.storage.collaborationCursor?.users.map((user: EditorUser) => {
      const names = user.name?.split(' ');
      const firstName = names?.[0];
      const lastName = names?.[names.length - 1];
      const initials = `${firstName?.[0] || '?'}${lastName?.[0] || '?'}`;

      return { ...user, initials: initials.length ? initials : '?' };
    });
  }, [editor?.storage.collaborationCursor?.users]);

  const characterCount = editor?.storage.characterCount || { characters: () => 0, words: () => 0 };

  useEffect(() => {
    provider?.on('status', (event: { status: WebSocketStatus }) => {
      setCollabState(event.status);
    });
  }, [provider]);

  useEffect(() => {
    editor?.commands.updateUser({
      name: fullName,
      color: randomElement(userColors),
      avatar: avatar,
    });
  }, [fullName, avatar]);

  window.editor = editor;

  return { editor, users, characterCount, collabState };
};
