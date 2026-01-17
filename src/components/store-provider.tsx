"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const unsubFinishHydration = useAppStore.persist.onFinishHydration(() => {
      setIsHydrated(true);
    });

    if (useAppStore.persist.hasHydrated()) {
      setIsHydrated(true);
    }

    useAppStore.persist.rehydrate();

    return () => {
      unsubFinishHydration();
    };
  }, []);

  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return <>{children}</>;
}
