import { useState, useCallback } from 'react';

/**
 * Build a flat list of all *visible* nodes given the current tree + expandedFolders.
 */
export function buildVisibleList(nodes, expandedFolders, depth = 0) {
  const list = [];
  for (const node of nodes) {
    list.push({ ...node, depth });
    if (node.type === 'folder' && expandedFolders.includes(node.id) && node.children?.length) {
      const childList = buildVisibleList(node.children, expandedFolders, depth + 1);
      list.push(...childList);
    }
  }
  return list;
}

/**
 * Given a node id, find its parent id by searching the tree.
 */
export function findParentId(nodes, targetId, parentId = null) {
  for (const node of nodes) {
    if (node.id === targetId) return parentId;
    if (node.children) {
      const found = findParentId(node.children, targetId, node.id);
      if (found !== undefined) return found;
    }
  }
  return undefined;
}

export default function useKeyboardNav({ visibleList, expandedFolders, toggleFolder, selectFile, vaultData }) {
  const [focusedId, setFocusedId] = useState(null);

  const handleKeyDown = useCallback((e) => {
    if (!visibleList.length) return;

    const currentIndex = focusedId ? visibleList.findIndex(n => n.id === focusedId) : -1;
    const current = currentIndex >= 0 ? visibleList[currentIndex] : null;

    switch (e.key) {
      case 'ArrowDown': {
        e.preventDefault();
        const nextIndex = Math.min(currentIndex + 1, visibleList.length - 1);
        if (currentIndex === -1) {
          setFocusedId(visibleList[0]?.id || null);
        } else {
          setFocusedId(visibleList[nextIndex].id);
        }
        break;
      }
      case 'ArrowUp': {
        e.preventDefault();
        if (currentIndex <= 0) {
          setFocusedId(visibleList[0]?.id || null);
        } else {
          setFocusedId(visibleList[currentIndex - 1].id);
        }
        break;
      }
      case 'ArrowRight': {
        e.preventDefault();
        if (current?.type === 'folder' && !expandedFolders.includes(current.id)) {
          toggleFolder(current.id);
        }
        break;
      }
      case 'ArrowLeft': {
        e.preventDefault();
        if (current?.type === 'folder' && expandedFolders.includes(current.id)) {
          toggleFolder(current.id);
        } else {
          // Move to parent
          const parentId = findParentId(vaultData, current?.id);
          if (parentId) setFocusedId(parentId);
        }
        break;
      }
      case 'Enter': {
        e.preventDefault();
        if (!current) break;
        if (current.type === 'file') {
          selectFile(current.id);
        } else {
          toggleFolder(current.id);
        }
        break;
      }
      default:
        break;
    }
  }, [focusedId, visibleList, expandedFolders, toggleFolder, selectFile, vaultData]);

  return { focusedId, setFocusedId, handleKeyDown };
}