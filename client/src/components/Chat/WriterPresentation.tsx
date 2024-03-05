import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { useDragHelpers } from '~/hooks';
import DragDropOverlay from './Input/Files/DragDropOverlay';

import store from '~/store';
import WriterSidePanel from '../SidePanel/WriterSidePanel';
import { TiptapCollabProvider } from '@hocuspocus/provider'
import * as Y from 'yjs'
import { useAIState } from '~/hooks/useAIState'
import { useBlockEditor } from '~/hooks/useBlockEditor';
import { EditorContext } from '~/context/EditorContext';

export default function WriterPresentation({
  children,
  useSidePanel = false,
  panel,
  fullName,
  hasCollab,
  ydoc,
  aiToken,
  provider
}: {
  children: React.ReactNode;
  panel?: React.ReactNode;
  useSidePanel?: boolean;
  aiToken: string;
  hasCollab: boolean
  fullName: string | null | undefined
  ydoc: Y.Doc
  provider?: TiptapCollabProvider | null | undefined
}) {
  const hideSidePanel = useRecoilValue(store.hideSidePanel);
  const { isOver, canDrop, drop } = useDragHelpers();

  const aiState = useAIState()

  const { editor, users, characterCount, collabState } = useBlockEditor({ aiToken, ydoc, provider,fullName })

  const displayedUsers = users.slice(0, 3)

  const providerValue = useMemo(() => {
    return {
      isAiLoading: aiState.isAiLoading,
      aiError: aiState.aiError,
      setIsAiLoading: aiState.setIsAiLoading,
      setAiError: aiState.setAiError,
    }
  }, [aiState])

  if (!editor) {
    return null
  }


  const isActive = canDrop && isOver;
  const resizableLayout = localStorage.getItem('react-resizable-panels:layout');
  const collapsedPanels = localStorage.getItem('react-resizable-panels:collapsed');

  const defaultLayout = resizableLayout ? JSON.parse(resizableLayout) : undefined;
  const defaultCollapsed = collapsedPanels ? JSON.parse(collapsedPanels) : undefined;

  const layout = () => (
    <div className="transition-width relative flex h-full w-full flex-1 flex-col items-stretch overflow-hidden bg-white pt-0 dark:bg-gray-800">
      <div className="flex h-full flex-col" role="presentation" tabIndex={0}>
        {children}
        {isActive && <DragDropOverlay />}
      </div>
    </div>
  );

  if (useSidePanel && !hideSidePanel) {
    return (
      <div
        ref={drop}
        className="relative flex w-full grow overflow-hidden bg-white dark:bg-gray-800"
      >
        <div className="relative flex flex-col flex-1 h-full overflow-hidden">
        <EditorContext.Provider value={providerValue}>
        <WriterSidePanel editor={editor} defaultLayout={defaultLayout} defaultCollapsed={defaultCollapsed}>
          <div className="flex h-full flex-col" role="presentation" tabIndex={0}>
            {children}
            {isActive && <DragDropOverlay />}
          </div>
        </WriterSidePanel>
        </EditorContext.Provider>
        </div>
      </div>
    );
  }

  return (
    <div ref={drop} className="relative flex w-full grow overflow-hidden bg-white dark:bg-gray-800">
      {layout()}
      {panel && panel}
    </div>
  );
}
