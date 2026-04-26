import  { useEffect, useRef } from 'react';
import { Eye, Star, Copy, Download, Trash2, FolderOpen, FilePlus } from 'lucide-react';

function MenuItem({ icon: Icon, label, onClick, danger }) {
  return (
    <button
      className="w-full flex items-center gap-2.5 px-3 py-1.5 text-[11px] font-inter transition-colors duration-100 rounded-sm"
      style={{ color: danger ? 'var(--sv-danger)' : 'var(--sv-text-secondary)' }}
      onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--sv-bg-hover)'; e.currentTarget.style.color = danger ? 'var(--sv-danger)' : 'var(--sv-accent)'; }}
      onMouseLeave={e => { e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.color = danger ? 'var(--sv-danger)' : 'var(--sv-text-secondary)'; }}
      onClick={onClick}
    >
      <Icon size={12} />
      {label}
    </button>
  );
}

export default function ContextMenu({ x, y, node, onClose, onPreview, onStar, onCopyPath, onDownload, onTrash, onToggleFolder, isStarred }) {
  const ref = useRef(null);

  // Bound to viewport
  const maxX = typeof window !== 'undefined' ? window.innerWidth - 180 : x;
  const maxY = typeof window !== 'undefined' ? window.innerHeight - 200 : y;
  const cx = Math.min(x, maxX);
  const cy = Math.min(y, maxY);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    const escHandler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('mousedown', handler);
    document.addEventListener('keydown', escHandler);
    return () => { document.removeEventListener('mousedown', handler); document.removeEventListener('keydown', escHandler); };
  }, [onClose]);

  const isFolder = node.type === 'folder';

  return (
    <div
      ref={ref}
      className="fixed z-[200] py-1.5 min-w-[170px] rounded-sv-md shadow-2xl"
      style={{
        left: cx,
        top: cy,
        backgroundColor: 'var(--sv-bg-elevated)',
        border: '1px solid var(--sv-border)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      }}
      onContextMenu={e => e.preventDefault()}
    >
      {isFolder ? (
        <>
          <MenuItem icon={FolderOpen} label="Open / Expand" onClick={() => { onToggleFolder(node.id); onClose(); }} />
          <MenuItem icon={Copy} label="Copy Path" onClick={() => { onCopyPath(); onClose(); }} />
          <MenuItem icon={FilePlus} label="New File (mock)" onClick={() => { import('sonner').then(m => m.toast('New file', { description: 'Feature available in enterprise tier' })); onClose(); }} />
          <div className="my-1 mx-2" style={{ borderTop: '1px solid var(--sv-border)' }} />
          <MenuItem icon={Trash2} label="Delete Folder" danger onClick={() => { onTrash(); onClose(); }} />
        </>
      ) : (
        <>
          <MenuItem icon={Eye} label="Preview" onClick={() => { onPreview(); onClose(); }} />
          <MenuItem icon={Star} label={isStarred ? 'Unstar' : 'Star'} onClick={() => { onStar(); onClose(); }} />
          <MenuItem icon={Copy} label="Copy Path" onClick={() => { onCopyPath(); onClose(); }} />
          <MenuItem icon={Download} label="Download" onClick={() => { onDownload(); onClose(); }} />
          <div className="my-1 mx-2" style={{ borderTop: '1px solid var(--sv-border)' }} />
          <MenuItem icon={Trash2} label="Move to Trash" danger onClick={() => { onTrash(); onClose(); }} />
        </>
      )}
    </div>
  );
}