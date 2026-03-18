import { useReducer, useCallback, useRef } from "react";

// Initial state mein history limit add karna safety ke liye zaroori hai
const MAX_HISTORY = 50;

function reducer(store, action) {
  switch (action.type) {
    case "PUSH": {
      const newUndo = [...store.undoStack, action.command];
      return {
        undoStack: newUndo.slice(-MAX_HISTORY), // Prevent memory overflow
        redoStack: [],
      };
    }
    case "UNDO": {
      if (store.undoStack.length === 0) return store;
      const last = store.undoStack[store.undoStack.length - 1];
      return {
        undoStack: store.undoStack.slice(0, -1),
        redoStack: [last, ...store.redoStack].slice(-MAX_HISTORY),
      };
    }
    case "REDO": {
      if (store.redoStack.length === 0) return store;
      const next = store.redoStack[0];
      return {
        undoStack: [...store.undoStack, next].slice(-MAX_HISTORY),
        redoStack: store.redoStack.slice(1),
      };
    }
    default:
      return store;
  }
}

export const useCommandHistory = () => {
  const [store, dispatch] = useReducer(reducer, { undoStack: [], redoStack: [] });
  
  // Ref ka use flag management ke liye taake overlapping undo/redo se bachein
  const isProcessing = useRef(false);

  const push = useCallback((command) => dispatch({ type: "PUSH", command }), []);

  const undo = useCallback(async () => {
    if (isProcessing.current || store.undoStack.length === 0) return;
    isProcessing.current = true;
    
    const last = store.undoStack[store.undoStack.length - 1];
    try {
      await last.undo();
      dispatch({ type: "UNDO" });
    } catch (e) {
      console.error("Undo failed", e);
    } finally {
      isProcessing.current = false;
    }
  }, [store.undoStack]);

  const redo = useCallback(async () => {
    if (isProcessing.current || store.redoStack.length === 0) return;
    isProcessing.current = true;
    
    const next = store.redoStack[0];
    try {
      await next.redo();
      dispatch({ type: "REDO" });
    } catch (e) {
      console.error("Redo failed", e);
    } finally {
      isProcessing.current = false;
    }
  }, [store.redoStack]);

  return { 
    push, undo, redo, 
    canUndo: store.undoStack.length > 0, 
    canRedo: store.redoStack.length > 0 
  };
};