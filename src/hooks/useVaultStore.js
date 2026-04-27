import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'securevault_store';

const defaultState = {
  expandedFolders: [],
  selectedFileId: null,
  starredIds: [],
  recentIds: [],
  activeNav: 'all',
  searchQuery: '',
  activityLog: [],
  settings: {
    showHidden: false,
    compactView: false,
    autoExpand: false,
  },
};

function loadFromStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return { ...defaultState, ...JSON.parse(stored) };
  } catch { /* ignore */ }
  return defaultState;
}

export default function useVaultStore() {
  const [state, setState] = useState(loadFromStorage);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addActivity = useCallback((type, action) => {
    setState(prev => {
      const entry = { type, action, ts: Date.now() };
      return { ...prev, activityLog: [entry, ...prev.activityLog].slice(0, 20) };
    });
  }, []);

  const toggleFolder = useCallback((folderId) => {
    setState(prev => {
      const expanded = prev.expandedFolders.includes(folderId)
        ? prev.expandedFolders.filter(id => id !== folderId)
        : [...prev.expandedFolders, folderId];
      return { ...prev, expandedFolders: expanded };
    });
  }, []);

  const expandAll = useCallback((allIds) => {
    setState(prev => ({ ...prev, expandedFolders: allIds }));
  }, []);

  const collapseAll = useCallback(() => {
    setState(prev => ({ ...prev, expandedFolders: [] }));
  }, []);

  const selectFile = useCallback((fileId, fileName) => {
    setState(prev => {
      const recentIds = [fileId, ...prev.recentIds.filter(id => id !== fileId)].slice(0, 10);
      const entry = { type: 'view', action: `Viewed ${fileName || fileId}`, ts: Date.now() };
      return { ...prev, selectedFileId: fileId, recentIds, activityLog: [entry, ...prev.activityLog].slice(0, 20) };
    });
  }, []);

  const addRecent = useCallback((fileId) => {
    setState(prev => {
      const recentIds = [fileId, ...prev.recentIds.filter(id => id !== fileId)].slice(0, 10);
      return { ...prev, recentIds };
    });
  }, []);

  const toggleStar = useCallback((fileId, fileName) => {
    setState(prev => {
      const isStarred = prev.starredIds.includes(fileId);
      const starredIds = isStarred
        ? prev.starredIds.filter(id => id !== fileId)
        : [...prev.starredIds, fileId];
      const entry = { type: 'star', action: `${isStarred ? 'Unstarred' : 'Starred'} ${fileName || fileId}`, ts: Date.now() };
      return { ...prev, starredIds, activityLog: [entry, ...prev.activityLog].slice(0, 20) };
    });
  }, []);

  const setActiveNav = useCallback((nav) => {
    setState(prev => ({ ...prev, activeNav: nav }));
  }, []);

  const setSearchQuery = useCallback((query) => {
    setState(prev => ({ ...prev, searchQuery: query }));
  }, []);

  const clearSelection = useCallback(() => {
    setState(prev => ({ ...prev, selectedFileId: null }));
  }, []);

  const updateSetting = useCallback((key, value) => {
    setState(prev => ({ ...prev, settings: { ...prev.settings, [key]: value } }));
  }, []);

  return {
    ...state,
    toggleFolder,
    expandAll,
    collapseAll,
    selectFile,
    addRecent,
    toggleStar,
    setActiveNav,
    setSearchQuery,
    clearSelection,
    updateSetting,
    addActivity,
  };
}