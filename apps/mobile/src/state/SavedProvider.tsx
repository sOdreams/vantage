import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from 'react';

type SavedContext = {
  saved: ReadonlySet<string>;
  isSaved: (id: string) => boolean;
  toggle: (id: string) => void;
};

const Ctx = createContext<SavedContext | null>(null);

/**
 * Saved spots for this session. Kept in memory for now; saved to the user's
 * account once sign-in exists (Day 9).
 */
export function SavedProvider({ children }: { children: ReactNode }) {
  const [saved, setSaved] = useState<ReadonlySet<string>>(() => new Set(['senhora-do-monte']));
  const toggle = useCallback((id: string) => {
    setSaved((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);
  const value = useMemo(() => ({ saved, isSaved: (id: string) => saved.has(id), toggle }), [saved, toggle]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSaved(): SavedContext {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useSaved must be used inside <SavedProvider>');
  return ctx;
}
