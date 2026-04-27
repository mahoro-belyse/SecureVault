import  { useMemo } from 'react';
import { Folder, FileText, Star, Clock } from 'lucide-react';
import { vaultData } from '../../data/vault';

function countNodes(nodes) {
  let folders = 0, files = 0;
  for (const node of nodes) {
    if (node.type === 'folder') { folders++; if (node.children) { const s = countNodes(node.children); folders += s.folders; files += s.files; } }
    else { files++; }
  }
  return { folders, files };
}

function StatCard({ icon: Icon, count, label, onClick, accentColor }) {
  return (
    <button
      onClick={onClick}
      className="flex-1 flex flex-col items-center justify-center py-2.5 px-1 transition-all duration-150 group"
      style={{ borderRight: '1px solid var(--sv-border)' }}
      onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--sv-bg-hover)'}
      onMouseLeave={e => e.currentTarget.style.backgroundColor = ''}
    >
      <span className="text-lg font-mono font-bold leading-none" style={{ color: accentColor || 'var(--sv-accent)' }}>
        {count}
      </span>
      <div className="flex items-center gap-1 mt-1">
        <Icon size={10} style={{ color: 'var(--sv-text-muted)' }} />
        <span className="text-[9px] font-inter uppercase tracking-wider" style={{ color: 'var(--sv-text-muted)' }}>{label}</span>
      </div>
    </button>
  );
}

export default function VaultStatsBar({ starredIds, recentIds, onExpandAll, onNavChange, vaultDataArg }) {
  const { folders, files } = useMemo(() => countNodes(vaultDataArg || vaultData), [vaultDataArg]);

  const handleFoldersClick = () => {
    const allIds = [];
    function collect(nodes) { for (const n of nodes) { if (n.type === 'folder') { allIds.push(n.id); if (n.children) collect(n.children); } } }
    collect(vaultData);
    onExpandAll(allIds);
  };

  return (
    <div
      className="shrink-0 flex border-b"
      style={{ backgroundColor: 'var(--sv-bg-surface)', borderColor: 'var(--sv-border)' }}
    >
      <StatCard icon={Folder} count={folders} label="Folders" onClick={handleFoldersClick} accentColor="var(--sv-warning)" />
      <StatCard icon={FileText} count={files} label="Files" onClick={() => {}} accentColor="var(--sv-info)" />
      <StatCard icon={Star} count={starredIds.length} label="Starred" onClick={() => onNavChange('starred')} accentColor="var(--sv-warning)" />
      <StatCard icon={Clock} count={recentIds.length} label="Recent" onClick={() => onNavChange('recent')} accentColor="var(--sv-accent)" style={{ borderRight: 'none' }} />
    </div>
  );
}