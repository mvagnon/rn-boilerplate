import { useIsFocused } from 'expo-router';
import { createContext, useContext } from 'react';

/** Signals that the initial screen is ready to reveal. */
export const StartupReadyContext = createContext<() => void>(() => {});

/** Returns an onLayout callback that only reveals the focused screen. */
export function useStartupReady() {
  const onReady = useContext(StartupReadyContext);
  const isFocused = useIsFocused();
  return () => {
    if (isFocused) onReady();
  };
}
