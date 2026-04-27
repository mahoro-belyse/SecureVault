import { useCallback } from 'react';
import { ChevronRight, Folder, FolderOpen, FileText } from 'lucide-react';
import Badge from '../vault/Badge';

function HighlightedName({ name, query }) {
  if (!query) return <>{name}</>;
  const idx = name.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{name}</>;
  return (
    <>
      {name.slice(0, idx)}
      <mark style={{ backgroundColor: 'var(--sv-accent-dim)', color: 'var(--sv-text-accent)', borderRadius: '2px', padding: '0 1px' }}>
        {name.slice(idx, idx + query.length)}
      </mark>
      {name.slice(idx + query.length)}
    </>
  );
}

export default function FileTreeNode({
  node, depth, focusedId, onFocus,
  expandedFolders, selectedFileId,
  onToggleFolder, onSelectFile,
  searchQuery, compactView,
  onContextMenu,
}) {
  const isFolder = node.type === 'folder';
  const isExpanded = expandedFolders.includes(node.id);
  const isSelected = selectedFileId === node.id;
  const isFocused = focusedId === node.id;
  const hasChildren = isFolder && node.children?.length > 0;
  const isEmpty = isFolder && (!node.children || node.children.length === 0);
  const indentPx = depth * 16;
  const rowHeight = compactView ? 'py-[2px]' : 'py-[5px]';

  const handleClick = useCallback(() => {
    onFocus(node.id);
    if (isFolder) onToggleFolder(node.id);
    else onSelectFile(node.id, node.name);
  }, [node, isFolder, onFocus, onToggleFolder, onSelectFile]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick(); }
  }, [handleClick]);

  const handleContextMenu = useCallback((e) => {
    e.preventDefault();
    onContextMenu && onContextMenu(e, node);
  }, [node, onContextMenu]);

  return (
    <div role="treeitem" aria-expanded={isFolder ? isExpanded : undefined} aria-selected={isSelected}>
      <div
        tabIndex={0}
        onClick={handleClick}
        onFocus={() => onFocus(node.id)}
        onKeyDown={handleKeyDown}
        onContextMenu={handleContextMenu}
        aria-label={`${isFolder ? 'Folder' : 'File'}: ${node.name}`}
        className={`group relative flex items-center gap-2 ${rowHeight} pr-3 cursor-pointer select-none transition-all duration-[120ms] ease-in-out focus:outline-none`}
        style={{
          paddingLeft: `${indentPx + 10}px`,
          backgroundColor: isSelected ? 'var(--sv-accent-dim)' : isFocused ? 'var(--sv-bg-elevated)' : undefined,
          borderLeft: isSelected ? '2px solid var(--sv-accent)' : isFocused ? '2px solid rgba(0,255,136,0.35)' : '2px solid transparent',
          outline: isFocused ? '2px solid var(--sv-accent)' : undefined,
          outlineOffset: isFocused ? '-2px' : undefined,
        }}
      >
        {/* Hover overlay */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-[120ms] pointer-events-none" style={{ backgroundColor: 'var(--sv-bg-hover)' }} />

        {/* Depth connector line */}
        {depth > 0 && (
          <div className="absolute top-0 bottom-0 pointer-events-none" style={{ left: `${indentPx - 4}px`, width: '1px', backgroundColor: 'var(--sv-border)' }} />
        )}

        {/* Chevron */}
        <div className="relative z-10 flex items-center shrink-0 w-3.5">
          {isFolder && (
            <span className="text-sv-text-muted transition-transform duration-150" style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)', display: 'inline-flex' }}>
              <ChevronRight size={12} />
            </span>
          )}
        </div>

        {/* Icon */}
        <div className="relative z-10 shrink-0">
          {isFolder
            ? (isExpanded ? <FolderOpen size={14} style={{ color: 'var(--sv-warning)' }} /> : <Folder size={14} style={{ color: 'var(--sv-warning)' }} />)
            : <FileText size={14} className="text-sv-text-secondary" />
          }
        </div>

        {/* Name */}
        <span className="relative z-10 text-[12px] font-mono truncate flex-1 min-w-0" style={{ color: isSelected ? 'var(--sv-text-accent)' : 'var(--sv-text-primary)' }}>
          <HighlightedName name={node.name} query={searchQuery} />
        </span>

        {/* Empty badge */}
        {isEmpty && (
          <span className="relative z-10 shrink-0 px-1.5 py-0.5 rounded-full text-[9px] font-mono" style={{ color: 'var(--sv-text-muted)', backgroundColor: 'var(--sv-bg-elevated)', border: '1px solid var(--sv-border)' }}>
            empty
          </span>
        )}

        {/* File badge + size */}
        {!isFolder && (
          <div className="relative z-10 flex items-center gap-2 shrink-0 ml-auto">
            <Badge fileName={node.name} />
            {node.size && (
              <span className="text-[10px] font-mono hidden sm:block" style={{ color: 'var(--sv-text-muted)' }}>{node.size}</span>
            )}
          </div>
        )}
      </div>

      {/* Children */}
      {isFolder && hasChildren && (
        <div
          className="overflow-hidden"
          style={{ maxHeight: isExpanded ? '9999px' : '0px', opacity: isExpanded ? 1 : 0, transition: 'max-height 200ms ease, opacity 200ms ease' }}
          role="group"
        >
          {node.children.map(child => (
            <FileTreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              focusedId={focusedId}
              onFocus={onFocus}
              expandedFolders={expandedFolders}
              selectedFileId={selectedFileId}
              onToggleFolder={onToggleFolder}
              onSelectFile={onSelectFile}
              searchQuery={searchQuery}
              compactView={compactView}
              onContextMenu={onContextMenu}
            />
          ))}
        </div>
      )}
    </div>
  );
}