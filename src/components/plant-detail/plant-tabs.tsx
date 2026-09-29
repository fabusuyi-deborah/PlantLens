"use client";

import { useRef, useSyncExternalStore } from "react";

export interface PlantTab {
  id: string;
  label: string;
  content: React.ReactNode;
}

function subscribe(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
}

/**
 * Tabs whose active state lives in the URL hash (#phytochemicals), so each tab can be linked to.
 * All panels are server-rendered; inactive ones are just hidden.
 */
export function PlantTabs({ tabs }: { tabs: PlantTab[] }) {
  const hash = useSyncExternalStore(
    subscribe,
    () => window.location.hash.slice(1),
    () => "",
  );
  const activeId = tabs.some((tab) => tab.id === hash) ? hash : tabs[0].id;
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function select(id: string) {
    const url = id === tabs[0].id ? window.location.pathname : `#${id}`;
    // replaceState avoids the scroll jump that assigning location.hash causes.
    window.history.replaceState(null, "", url);
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  }

  function onKeyDown(event: React.KeyboardEvent, index: number) {
    const step = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    const next = (index + step + tabs.length) % tabs.length;
    select(tabs[next].id);
    tabRefs.current[next]?.focus();
  }

  return (
    <div>
      <div role="tablist" aria-label="Plant information" className="flex gap-1 overflow-x-auto border-b border-border">
        {tabs.map((tab, index) => {
          const active = tab.id === activeId;
          return (
            <button
              key={tab.id}
              ref={(element) => {
                tabRefs.current[index] = element;
              }}
              type="button"
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={active}
              aria-controls={`panel-${tab.id}`}
              tabIndex={active ? 0 : -1}
              onClick={() => select(tab.id)}
              onKeyDown={(event) => onKeyDown(event, index)}
              className={`-mb-px shrink-0 rounded-t-sm border-b-2 px-5 py-3 text-[15px] transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent ${
                active
                  ? "border-accent font-semibold text-accent"
                  : "border-transparent text-ink-secondary hover:text-ink"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      {tabs.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`panel-${tab.id}`}
          aria-labelledby={`tab-${tab.id}`}
          hidden={tab.id !== activeId}
          className="pt-8"
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}
