"use client";

import { useEffect } from "react";

interface UseKeyboardShortcutOptions {
  key: string;
  metaKey?: boolean;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  preventDefault?: boolean;
  enabled?: boolean;
}

export function useKeyboardShortcut(
  callback: () => void,
  options: UseKeyboardShortcutOptions
) {
  const {
    key,
    metaKey = false,
    ctrlKey = false,
    shiftKey = false,
    altKey = false,
    preventDefault = true,
    enabled = true,
  } = options;

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const isMetaMatch = metaKey ? event.metaKey : !event.metaKey;
      const isCtrlMatch = ctrlKey ? event.ctrlKey : !event.ctrlKey;
      const isShiftMatch = shiftKey ? event.shiftKey : !event.shiftKey;
      const isAltMatch = altKey ? event.altKey : !event.altKey;
      const isKeyMatch = event.key.toLowerCase() === key.toLowerCase();

      // For Cmd+K or Ctrl+K, we want either meta OR ctrl, not both
      if (key.toLowerCase() === "k" && (metaKey || ctrlKey)) {
        const hasModifier = event.metaKey || event.ctrlKey;
        const noOtherModifiers = !event.shiftKey && !event.altKey;
        
        if (hasModifier && noOtherModifiers && isKeyMatch) {
          if (preventDefault) {
            event.preventDefault();
          }
          callback();
        }
        return;
      }

      if (
        isKeyMatch &&
        isMetaMatch &&
        isCtrlMatch &&
        isShiftMatch &&
        isAltMatch
      ) {
        if (preventDefault) {
          event.preventDefault();
        }
        callback();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [callback, key, metaKey, ctrlKey, shiftKey, altKey, preventDefault, enabled]);
}
