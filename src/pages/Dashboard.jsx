import React from 'react';
import { useRef, useEffect, useCallback} from 'react';
import TopNav from '../components/vault/TopNav';
import Sidebar from '../components/vault/Sidebar';
import FileExplorer from '../components/FileExplorer/FileExplorer';
import PropertiesPanel from '../components/vault/PropertiesPanel';
import SettingsPanel from '../components/vault/SettingsPanel';
import KeyboardShortcutsModal from '../components/vault/KeyboardShortcutsModal';
import useVaultStore from '../hooks/useVaultStore';


export default function Dashboard() {
  const store = useVaultStore();
  const [showSettings, setShowSettings] = React.useState(false);
  const [showHelp, setShowHelp] = React.useState(false);
  const searchInputRef = useRef(null);

  // Global keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      // Cmd+K / Ctrl+K → focus search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        return;
      }
      // ? → toggle help (not in input)
      if (e.key === '?' && document.activeElement.tagName !== 'INPUT') {
        setShowHelp(v => !v);
        return;
      }
      // Escape → clear selection or close modals
      if (e.key === 'Escape') {
        if (showHelp) { setShowHelp(false); return; }
        if (showSettings) { setShowSettings(false); return; }
        store.clearSelection();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [showHelp, showSettings, store.clearSelection]);

  const handleToggleStar = useCallback((fileId, fileName) => {
    store.toggleStar(fileId, fileName);
  }, [store.toggleStar]);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden" style={{ backgroundColor: 'var(--sv-bg-base)' }} id="main-content">
      <TopNav
        selectedFileId={store.selectedFileId}
        onSettingsClick={() => setShowSettings(v => !v)}
        onHelpClick={() => setShowHelp(true)}
      />

      <div className="flex flex-1 min-h-0 pt-12">
        {/* Sidebar */}
        <div className="hidden md:flex">
          <Sidebar
            activeNav={store.activeNav}
            onNavChange={store.setActiveNav}
            searchQuery={store.searchQuery}
            onSearchChange={store.setSearchQuery}
            activityLog={store.activityLog}
            searchInputRef={searchInputRef}
          />
        </div>

        {/* Center: File Explorer */}
        <div className="flex-1 min-w-0 h-full overflow-hidden">
          <FileExplorer
            expandedFolders={store.expandedFolders}
            selectedFileId={store.selectedFileId}
            starredIds={store.starredIds}
            recentIds={store.recentIds}
            activeNav={store.activeNav}
            searchQuery={store.searchQuery}
            onToggleFolder={store.toggleFolder}
            onSelectFile={store.selectFile}
            onExpandAll={store.expandAll}
            onCollapseAll={store.collapseAll}
            onNavChange={store.setActiveNav}
            compactView={store.settings?.compactView}
            onToggleStar={handleToggleStar}
            addActivity={store.addActivity}
          />
        </div>

        {/* Properties Panel */}
        <div className="hidden lg:flex">
          <PropertiesPanel
            selectedFileId={store.selectedFileId}
            starredIds={store.starredIds}
            onToggleStar={handleToggleStar}
            onAddRecent={store.addRecent}
            addActivity={store.addActivity}
          />
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <SettingsPanel
          settings={store.settings || { showHidden: false, compactView: false, autoExpand: false }}
          onChange={store.updateSetting}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* Keyboard Shortcuts Modal */}
      {showHelp && <KeyboardShortcutsModal onClose={() => setShowHelp(false)} />}
    </div>
  );
}