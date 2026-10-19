export interface TabOption<TabId extends string> {
  id: TabId;
  label: string;
}

interface TabNavProps<TabId extends string> {
  tabs: readonly TabOption<TabId>[];
  activeTab: TabId;
  onSelect: (tab: TabId) => void;
}

export function TabNav<TabId extends string>({ tabs, activeTab, onSelect }: TabNavProps<TabId>) {
  return (
    <nav className="tabs" aria-label="Seções">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`tab ${tab.id === activeTab ? 'tab-active' : ''}`}
          aria-pressed={tab.id === activeTab}
          onClick={() => onSelect(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
