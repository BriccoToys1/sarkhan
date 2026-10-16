"use client";

import { useCallback, useSyncExternalStore } from "react";

const EVENT = "sg-urlchange";

function subscribe(cb: () => void) {
  window.addEventListener("popstate", cb);
  window.addEventListener(EVENT, cb);
  return () => {
    window.removeEventListener("popstate", cb);
    window.removeEventListener(EVENT, cb);
  };
}

/**
 * Query-строка как источник истины для фильтров: обновляется без перезагрузки и без
 * роутера, а при SSR и гидратации отдаёт пустую строку (разметка совпадает с сервером).
 */
export function useUrlSearch() {
  const search = useSyncExternalStore(
    subscribe,
    () => window.location.search,
    () => "",
  );
  const setSearch = useCallback((params: URLSearchParams) => {
    const qs = params.toString();
    window.history.replaceState(window.history.state, "", qs ? `?${qs}` : window.location.pathname);
    window.dispatchEvent(new Event(EVENT));
  }, []);
  return [search, setSearch] as const;
}
