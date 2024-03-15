import { createContext } from 'react';

interface IEditorContext {
  isAiLoading: boolean;
  aiError?: string | null;
  // eslint-disable-next-line @typescript-eslint/ban-types
  setIsAiLoading: Function;
  // eslint-disable-next-line @typescript-eslint/ban-types
  setAiError: Function;
}

export const EditorContext = createContext<IEditorContext>({
  isAiLoading: false,
  aiError: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setIsAiLoading: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setAiError: () => {},
});
