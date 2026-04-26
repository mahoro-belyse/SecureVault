import { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { Clock,Trash2, FileSearch } from 'lucide-react';
import FileTreeNode from '../FileTree/FileTreeNode';
import FileExplorerHeader from './FileExplorerHeader';
import EmptyState from '../vault/EmptyState';
import VaultStatsBar from '../vault/VaultStatsBar';
import ContextMenu from '../vault/ContextMenu';
import useKeyboardNav, { buildVisibleList } from '../../hooks/useKeyboardNav';
import { vaultData, findNodeById, getNodePath } from '../../data/vault';
import { toast } from 'sonner';

function collectAllFolderIds(nodes) {
  const ids = [];
  for (const node of nodes) {
    if (node.type === 'folder') { ids.push(node.id); if (node.children) ids.push(...collectAllFolderIds(node.children)); }
  }
  return ids;
}

function sortNodes(nodes, sortOrder) {
  const sorted = [...nodes].sort((a, b) => {
    if (sortOrder === 'name-asc') return a.name.localeCompare(b.name);
    if (sortOrder === 'name-desc') return b.name.localeCompare(a.name);
    if (sortOrder === 'type') { if (a.type !== b.type) return a.type === 'folder' ? -1 : 1; return a.name.localeCompare(b.name); }
    if (sortOrder === 'size-asc' || sortOrder === 'size-desc') {
      const p = (s) => { if (!s) return 0; const n = parseFloat(s); if (s.includes('GB')) return n * 1e9; if (s.includes('MB')) return n * 1e6; if (s.includes('KB')) return n * 1e3; return n; };
      const diff = p(a.size) - p(b.size);
      return sortOrder === 'size-asc' ? diff : -diff;
    }
    return 0;
  });
  return sorted.map(n => n.children ? { ...n, children: sortNodes(n.children, sortOrder) } : n);
}

// Filter and auto-expand ancestors for search
function filterTreeWithAncestors(nodes, query) {
  if (!query) return { tree: nodes, expandIds: [] };
  const q = query.toLowerCase();
  const expandIds = [];
  function filter(nodes, ancestors) {
    const results = [];
    for (const node of nodes) {
      if (node.name.toLowerCase().includes(q)) {
        results.push(node);
        expandIds.push(...ancestors);
      } else if (node.children) {
        const children = filter(node.children, [...ancestors, node.id]);
        if (children.length > 0) {
          results.push({ ...node, children });
          expandIds.push(...ancestors, node.id);
        }
      }
    }
    return results;
  }
  return { tree: filter(nodes, []), expandIds: [...new Set(expandIds)] };
}

function filterStarred(nodes, starredIds) {
  const results = [];
  for (const node of nodes) {
    if (starredIds.includes(node.id)) { results.push(node); }
    else if (node.children) {
      const ch = filterStarred(node.children, starredIds);
      if (ch.length) results.push({ ...node, children: ch });
    }
  }
  return results;
}

function countResults(nodes) {
  let count = 0;
  for (const node of nodes) { count++; if (node.children) count += countResults(node.children); }
  return count;
}

export default function FileExplorer({
  expandedFolders, selectedFileId, starredIds, recentIds,
  activeNav, searchQuery, onToggleFolder, onSelectFile,
  onExpandAll, onCollapseAll, onNavChange, compactView,
   addActivity,
  onToggleStar,
}) {
  const containerRef = useRef(null);
  const [sortOrder, setSortOrder] = useState('name-asc');
  const [contextMenu, setContextMenu] = useState(null); // { x, y, node }
  const [searchExpandIds, setSearchExpandIds] = useState([]);

  useEffect(() => { containerRef.current?.focus(); }, []);

  const { tree: filteredSearchTree, expandIds } = useMemo(() => {
    if (searchQuery) return filterTreeWithAncestors(vaultData, searchQuery);
    return { tree: null, expandIds: [] };
  }, [searchQuery]);

  // Auto-expand search ancestors
 useEffect(() => {
  if (expandIds.length > 0) {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearchExpandIds(expandIds);
    onExpandAll([...new Set([...expandedFolders, ...expandIds])]);
  }
}, [expandIds.join(',')]);

  const displayTree = useMemo(() => {
    let tree = vaultData;
    if (searchQuery) { tree = filteredSearchTree || []; }
    else if (activeNav === 'starred') { tree = filterStarred(tree, starredIds); }
    else if (activeNav === 'legal') { tree = vaultData.filter(n => n.id === 'root_1'); }
    else if (activeNav === 'finance') { tree = vaultData.filter(n => n.id === 'root_2'); }
    else if (activeNav === 'security') { tree = vaultData.filter(n => n.id === 'root_3'); }
    else if (activeNav === 'shared') { tree = vaultData.filter(n => n.id === 'root_4'); }
    return sortNodes(tree, sortOrder);
  }, [activeNav, searchQuery, filteredSearchTree, starredIds, sortOrder]);

  const effectiveExpanded = useMemo(() => {
    if (searchQuery && searchExpandIds.length) return [...new Set([...expandedFolders, ...searchExpandIds])];
    return expandedFolders;
  }, [expandedFolders, searchExpandIds, searchQuery]);

  const visibleList = useMemo(() => buildVisibleList(displayTree, effectiveExpanded), [displayTree, effectiveExpanded]);

  const { focusedId, setFocusedId, handleKeyDown } = useKeyboardNav({
    visibleList, expandedFolders: effectiveExpanded, toggleFolder: onToggleFolder, selectFile: (id) => {
      const node = findNodeById(vaultData, id);
      onSelectFile(id, node?.name);
    }, vaultData,
  });

  const handleExpandAll = useCallback(() => { onExpandAll(collectAllFolderIds(vaultData)); }, [onExpandAll]);

  const handleContextMenu = useCallback((e, node) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, node });
  }, []);

  const handleContextCopyPath = useCallback(() => {
    if (!contextMenu) return;
    const path = getNodePath(vaultData, contextMenu.node.id);
    const pathStr = path ? path.map(n => n.name).join(' / ') : contextMenu.node.name;
    navigator.clipboard.writeText(pathStr);
    toast.success('Path copied!', { description: pathStr });
    addActivity?.('copy', `Copied path: ${pathStr}`);
  }, [contextMenu, addActivity]);

  const resultCount = searchQuery ? countResults(displayTree) : null;

  // Recent view
  if (activeNav === 'recent') {
    const recentNodes = recentIds.map(id => findNodeById(vaultData, id)).filter(Boolean);
    return (
      <div className="flex flex-col h-full" style={{ backgroundColor: 'var(--sv-bg-base)' }}>
        <VaultStatsBar starredIds={starredIds} recentIds={recentIds} onExpandAll={handleExpandAll} onNavChange={onNavChange} />
        <div className="shrink-0 border-b border-sv-border px-4 py-2.5" style={{ backgroundColor: 'var(--sv-bg-surface)' }}>
          <span className="text-[10px] font-mono font-semibold uppercase tracking-widest" style={{ color: 'var(--sv-text-muted)' }}>Recent Files</span>
        </div>
        <div className="flex-1 overflow-y-auto">
          {recentNodes.length === 0 ? <EmptyState icon={Clock} message="No recent files" subtext="Files you open will appear here" /> : (
            recentNodes.map(node => {
              const path = getNodePath(vaultData, node.id);
              const pathStr = path ? path.slice(0, -1).map(n => n.name).join(' / ') : '';
              return (
                <div key={node.id} onClick={() => onSelectFile(node.id, node.name)} className="flex items-center gap-3 px-4 py-2.5 cursor-pointer border-b border-sv-border transition-colors duration-[120ms]"
                  style={{ backgroundColor: selectedFileId === node.id ? 'var(--sv-accent-dim)' : undefined, borderLeft: selectedFileId === node.id ? '2px solid var(--sv-accent)' : '2px solid transparent' }}
                  onMouseEnter={e => { if (selectedFileId !== node.id) e.currentTarget.style.backgroundColor = 'var(--sv-bg-hover)'; }}
                  onMouseLeave={e => { if (selectedFileId !== node.id) e.currentTarget.style.backgroundColor = ''; }}>
                  <Clock size={13} style={{ color: 'var(--sv-text-muted)' }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] font-mono truncate" style={{ color: selectedFileId === node.id ? 'var(--sv-text-accent)' : 'var(--sv-text-primary)' }}>{node.name}</div>
                    {pathStr && <div className="text-[10px] font-mono truncate" style={{ color: 'var(--sv-text-muted)' }}>{pathStr}</div>}
                  </div>
                  <span className="text-[10px] font-mono shrink-0" style={{ color: 'var(--sv-text-muted)' }}>{node.size}</span>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  }

  if (activeNav === 'trash') {
    return (
      <div className="flex flex-col h-full" style={{ backgroundColor: 'var(--sv-bg-base)' }}>
        <VaultStatsBar starredIds={starredIds} recentIds={recentIds} onExpandAll={handleExpandAll} onNavChange={onNavChange} />
        <div className="shrink-0 border-b border-sv-border px-4 py-2.5" style={{ backgroundColor: 'var(--sv-bg-surface)' }}>
          <span className="text-[10px] font-mono font-semibold uppercase tracking-widest" style={{ color: 'var(--sv-text-muted)' }}>Trash</span>
        </div>
        <EmptyState icon={Trash2} message="Trash is empty" subtext="Files moved to trash will appear here" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full focus:outline-none" style={{ backgroundColor: 'var(--sv-bg-base)' }} ref={containerRef} tabIndex={-1} onKeyDown={handleKeyDown}>
      <VaultStatsBar starredIds={starredIds} recentIds={recentIds} onExpandAll={handleExpandAll} onNavChange={onNavChange} />
      <FileExplorerHeader vaultData={vaultData} onExpandAll={handleExpandAll} onCollapseAll={onCollapseAll} sortOrder={sortOrder} onSortChange={setSortOrder} />

      {/* Search results count */}
      {searchQuery && resultCount !== null && (
        <div className="shrink-0 px-4 py-1.5 border-b border-sv-border" style={{ backgroundColor: 'var(--sv-bg-surface)' }}>
          <span className="text-[10px] font-mono" style={{ color: 'var(--sv-text-secondary)' }}>
            {resultCount} result{resultCount !== 1 ? 's' : ''} for <span style={{ color: 'var(--sv-accent)' }}>'{searchQuery}'</span>
          </span>
        </div>
      )}

      <div className="flex-1 overflow-y-auto py-1" role="tree">
        {displayTree.length === 0 ? (
          <EmptyState icon={FileSearch}
            message={searchQuery ? 'No files match your search' : activeNav === 'starred' ? 'No starred files' : 'Empty vault'}
            subtext={searchQuery ? `Try a different search term` : 'Nothing to show here'}
          />
        ) : (
          displayTree.map(node => (
            <FileTreeNode key={node.id} node={node} depth={0} focusedId={focusedId} onFocus={setFocusedId}
              expandedFolders={effectiveExpanded} selectedFileId={selectedFileId}
              onToggleFolder={onToggleFolder} onSelectFile={onSelectFile}
              searchQuery={searchQuery} compactView={compactView}
              onContextMenu={handleContextMenu}
            />
          ))
        )}
      </div>

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x} y={contextMenu.y} node={contextMenu.node}
          onClose={() => setContextMenu(null)}
          isStarred={starredIds.includes(contextMenu.node.id)}
          onPreview={() => { onSelectFile(contextMenu.node.id, contextMenu.node.name); toast('Preview', { description: contextMenu.node.name }); }}
          onStar={() => { onToggleStar(contextMenu.node.id, contextMenu.node.name); }}
          onCopyPath={handleContextCopyPath}
          onDownload={() => { toast('Download initiated', { description: `Preparing ${contextMenu.node.name}…` }); }}
          onTrash={() => { toast.error('Moved to trash', { description: contextMenu.node.name }); }}
          onToggleFolder={onToggleFolder}
        />
      )}
    </div>
  );
}