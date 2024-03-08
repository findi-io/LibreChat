import { useDrop } from 'react-dnd';
import { NativeTypes } from 'react-dnd-html5-backend';
import type { DropTargetMonitor } from 'react-dnd';
import useFileHandling from './useFileHandling';
import { Editor } from '@tiptap/react';

export default function useDragHelpers(editor: Editor) {
  const { files, handleFiles } = useFileHandling();
  const [{ canDrop, isOver }, drop] = useDrop(
    () => ({
      accept: [NativeTypes.URL],
      drop(item: { files: URL[] }) {
        console.log('drop', item);
        item.files.forEach((url)=>editor.chain().focus().setImage({
          src: url.toString()
        }))
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

        return {
          isOver: monitor.isOver(),
          canDrop: monitor.canDrop(),
        };
      },
    }),
    [files],
  );

  return {
    canDrop,
    isOver,
    drop,
  };
}
