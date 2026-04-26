
import SvButton from '../vault/SvButton';

function countNodes(nodes) {
  let folders = 0, files = 0;
  for (const node of nodes) {
    if (node.type === 'folder') {
      folders++;
      if (node.children) {
        const sub = countNodes(node.children);
        folders += sub.folders;
        files += sub.files;
      }
    } else {
      files++;
    }
  }
  return { folders, files };
}

const SORT_OPTIONS = [
  { value: 'name-asc', label: 'Name A–Z' },
  { value: 'name-desc', label: 'Name Z–A' },
  { value: 'size-asc', label: 'Size ↑' },
  { value: 'size-desc', label: 'Size ↓' },
  { value: 'type', label: 'Type' },
];

export default function FileExplorerHeader({ vaultData, onExpandAll, onCollapseAll, sortOrder, onSortChange }) {
  const { folders, files } = countNodes(vaultData);

  return (
    <div
      className="shrink-0 border-b border-sv-border"
      style={{ backgroundColor: 'var(--sv-bg-surface)' }}
    >
      {/* Title row */}
      <div className="flex items-center justify-between px-4 py-2.5">
        <span className="text-[10px] font-mono font-semibold uppercase tracking-widest text-sv-text-muted">
          Vault Explorer
        </span>
        <span className="text-[10px] font-mono text-sv-text-secondary">
          {folders} folders · {files} files
        </span>
      </div>

      {/* Toolbar row */}
      <div className="flex items-center justify-between px-4 pb-2.5 gap-3">
        <div className="flex items-center gap-2">
          <SvButton variant="ghost" size="sm" onClick={onExpandAll}>
            Expand All
          </SvButton>
          <SvButton variant="ghost" size="sm" onClick={onCollapseAll}>
            Collapse All
          </SvButton>
        </div>

        <select
          value={sortOrder}
          onChange={(e) => onSortChange(e.target.value)}
          className="
            text-[11px] font-mono rounded-sv-sm px-2 py-1
            border border-sv-border
            text-sv-text-secondary
            focus:outline-none focus:border-sv-border-active
            transition-colors cursor-pointer
          "
          style={{ backgroundColor: 'var(--sv-bg-elevated)' }}
        >
          {SORT_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value} style={{ backgroundColor: 'var(--sv-bg-elevated)' }}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}