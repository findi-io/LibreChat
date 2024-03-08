import { useDrop } from 'react-dnd';
import { NativeTypes } from 'react-dnd-html5-backend';
import type { DropTargetMonitor } from 'react-dnd';
import useFileHandling from './useFileHandling';
import { Editor } from '@tiptap/react';
import API from '~/lib/api';

export default function useEditorDragHelpers(editor: Editor) {
  let pos = 0 
  const [{ canDrop, isOver }, drop] = useDrop(
    () => ({
      accept: [NativeTypes.FILE,NativeTypes.HTML],
      drop(item: { files?: File[], html?: string }) {
        console.log('drop', item);
        if(item.files) {
          item.files.forEach(async (file)=>{
            const url = await API.uploadImage(file)
            editor?.commands.setImage({ src: url })
          })
        }
        if(item.html) {
          editor?.chain().focus().insertContentAt(pos, item.html).run()
        }
      },
      canDrop() {
        // console.log('canDrop', item.files, item.items);
        return true;
      },
      // hover() {
      //   // console.log('hover', item.files, item.items);
      // },
      collect: (monitor: DropTargetMonitor) => {
        // const item = monitor.getItem() as File[];
        // if (item) {
        //   console.log('collect', item.files, item.items);
        // }
        pos = editor?.state.selection.anchor
        return {
          isOver: monitor.isOver(),
          canDrop: monitor.canDrop(),
        };
      },
    }),
    [editor],
  );

  return {
    canDrop,
    isOver,
    drop,
  };
}
