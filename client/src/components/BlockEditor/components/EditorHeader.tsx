import { Icon } from '~/components/ui/Icon'
import { EditorInfo } from './EditorInfo'
import { EditorUser } from '../types'
import { WebSocketStatus } from '@hocuspocus/provider'
import { Toolbar } from '~/components/ui/Toolbar'
import { Link } from 'react-router-dom'
import { cn, cardStyle } from '~/utils/';
import { Editor } from '@tiptap/core'
import Button from '~/components/Input/Generations/Button'

export type EditorHeaderProps = {
  isSidebarOpen?: boolean
  toggleSidebar?: () => void
  characters: number
  words: number
  editor: Editor
  conversationId: string | null | undefined
  collabState: WebSocketStatus
  users: EditorUser[]
}

export const EditorHeader = ({
  characters,
  collabState,
  users,
  words,
  isSidebarOpen,
  toggleSidebar,
  conversationId,
  editor,
}: EditorHeaderProps) => {
  return (
    <div className="flex flex-row items-center justify-between flex-none py-2 pl-1 pr-3 text-black bg-white border-b border-neutral-200 dark:bg-black dark:text-white dark:border-neutral-800">
      <div className="flex flex-row gap-x-1.5 items-center">
        <div className="flex items-center gap-x-1.5">
          <Link
          type="button"
          className={cn(
            cardStyle,
            'min-w-4 z-50 flex h-[40px] flex-none items-center justify-center px-3 focus:ring-0 focus:ring-offset-0',
            'hover:bg-gray-50 radix-state-open:bg-gray-50 dark:hover:bg-black/10 dark:radix-state-open:bg-black/20'
          )} to={`/c/${conversationId}`}                >
            Chat Mode
          </Link>
          <Link target='_blank' to={`/p/${conversationId}`} onClick={()=>console.log(editor.getHTML())}>Save</Link>
          <Link target='_blank' to={`/p/${conversationId}`} onClick={()=>console.log(editor.getHTML())}>Restore</Link>
          
        </div>
      </div>
      <EditorInfo characters={characters} words={words} collabState={collabState} users={users} />
    </div>
  )
}
