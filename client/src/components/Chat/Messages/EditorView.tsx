import { useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { TMessage } from 'librechat-data-provider';
import ScrollToBottom from '~/components/Messages/ScrollToBottom';
import { useScreenshot, useMessageScrolling } from '~/hooks';
import { CSSTransition } from 'react-transition-group';
import { EditorContent, PureEditorContent } from '@tiptap/react'
import { ColumnsMenu } from '~/extensions/MultiColumn/menus'
import { TableColumnMenu, TableRowMenu } from '~/extensions/Table/menus'

import { LinkMenu } from '~/components/menus2'
import { TextMenu } from '~/components/menus2/TextMenu'
import { ContentItemMenu } from '~/components/menus2/ContentItemMenu'
import ImageBlockMenu from '~/extensions/ImageBlock/components/ImageBlockMenu'
import { EditorHeader } from '~/components/BlockEditor/components/EditorHeader';

export default function EditorView({
  messagesTree: _messagesTree,
  Header,
  editor,
  displayedUsers,
  characterCount,
  collabState,
}: {
  messagesTree?: TMessage[] | null;
  Header?: ReactNode;
  editor: any;
  displayedUsers: any;
  characterCount: any;
  collabState: any;
}) {
  const { screenshotTargetRef } = useScreenshot();
  const [currentEditId, setCurrentEditId] = useState<number | string | null>(-1);
  const menuContainerRef = useRef(null)
  const editorRef = useRef<PureEditorContent | null>(null)

  const {
    conversation,
    scrollableRef,
    messagesEndRef,
    showScrollButton,
    handleSmoothToRef,
    debouncedHandleScroll,
  } = useMessageScrolling(_messagesTree);

  const { conversationId } = conversation ?? {};

  return (
    <div className="flex-1 overflow-hidden overflow-y-auto">
      <div className="dark:gpt-dark-gray relative h-full">
        <div
          onScroll={debouncedHandleScroll}
          ref={scrollableRef}
          style={{
            height: '100%',
            overflowY: 'auto',
            width: '100%',
          }}
        >
          <div className="flex flex-col pb-9 text-sm dark:bg-transparent">
            <EditorHeader
              editor={editor}
              conversationId={conversationId}
              characters={characterCount.characters()}
              collabState={collabState}
              users={displayedUsers}
              words={characterCount.words()}

            />
              <EditorContent editor={editor} >
                <ContentItemMenu editor={editor} />
                <LinkMenu editor={editor} appendTo={menuContainerRef} />
                <TextMenu editor={editor} />
                <ColumnsMenu editor={editor} appendTo={menuContainerRef} />
                <TableRowMenu editor={editor} appendTo={menuContainerRef} />
                <TableColumnMenu editor={editor} appendTo={menuContainerRef} />
                <ImageBlockMenu editor={editor} appendTo={menuContainerRef} />
              </EditorContent>

            <div
              className="dark:gpt-dark-gray group h-0 w-full flex-shrink-0 dark:border-gray-900/50"
              ref={messagesEndRef}
            />
          </div>
        </div>
        <CSSTransition
          in={showScrollButton}
          timeout={400}
          classNames="scroll-down"
          unmountOnExit={false}
          // appear
        >
          {() => showScrollButton && <ScrollToBottom scrollHandler={handleSmoothToRef} />}
        </CSSTransition>
      </div>
    </div>
  );
}
