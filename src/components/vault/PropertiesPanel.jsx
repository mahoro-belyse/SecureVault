import  { useState } from 'react';
import { FileText, FileSpreadsheet, Image, File, FileSearch, Star, Clock, Copy, Download, Trash2 } from 'lucide-react';
import Badge from './Badge';
import SvButton from './SvButton';
import FilePreview from './FilePreview';
import { findNodeById, getNodePath, getFileExtension, vaultData } from '../../data/vault';
import { toast } from 'sonner';

const EXT_META = {
  pdf:  { icon: FileText,        color: 'var(--sv-danger)',          label: 'Document' },
  xlsx: { icon: FileSpreadsheet, color: '#22c55e',                    label: 'Spreadsheet' },
  xls:  { icon: FileSpreadsheet, color: '#22c55e',                    label: 'Spreadsheet' },
  docx: { icon: FileText,        color: 'var(--sv-info)',             label: 'Document' },
  doc:  { icon: FileText,        color: 'var(--sv-info)',             label: 'Document' },
  png:  { icon: Image,           color: '#a855f7',                    label: 'Image' },
  svg:  { icon: Image,           color: '#a855f7',                    label: 'Image' },
  jpg:  { icon: Image,           color: '#a855f7',                    label: 'Image' },
  jpeg: { icon: Image,           color: '#a855f7',                    label: 'Image' },
  txt:  { icon: File,            color: 'var(--sv-text-secondary)',   label: 'Text' },
  yaml: { icon: File,            color: 'var(--sv-warning)',          label: 'Configuration' },
  yml:  { icon: File,            color: 'var(--sv-warning)',          label: 'Configuration' },
  ttf:  { icon: File,            color: '#a855f7',                    label: 'Font' },
};

function getExtMeta(fileName) {
  const ext = getFileExtension(fileName);
  return EXT_META[ext] || { icon: File, color: 'var(--sv-text-muted)', label: 'File' };
}

function DetailRow({ label, value, mono = false }) {
  return (
    <div className="flex items-start justify-between gap-3 py-2.5" style={{ borderBottom: '1px dotted var(--sv-border)' }}>
      <span className="text-[10px] font-mono uppercase tracking-wider shrink-0" style={{ color: 'var(--sv-text-muted)' }}>{label}</span>
      <span className={`text-[11px] text-right break-all ${mono ? 'font-mono' : 'font-inter'}`} style={{ color: 'var(--sv-text-primary)' }}>
        {value || '—'}
      </span>
    </div>
  );
}

function EmptySelection() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-16 px-4 text-center">
      <div className="mb-4 p-3 rounded-full" style={{ backgroundColor: 'var(--sv-accent-dim)' }}>
        <FileSearch size={32} style={{ color: 'var(--sv-accent)' }} strokeWidth={1.5} />
      </div>
      <h3 className="text-sm font-inter font-semibold mb-1.5" style={{ color: 'var(--sv-text-primary)' }}>No file selected</h3>
      <p className="text-xs font-inter leading-relaxed" style={{ color: 'var(--sv-text-secondary)' }}>
        Click any file in the explorer to inspect its details
      </p>
    </div>
  );
}

export default function PropertiesPanel({ selectedFileId, starredIds, onToggleStar, onAddRecent, addActivity }) {
  const [activeTab, setActiveTab] = useState('details');

  const node = selectedFileId ? findNodeById(vaultData, selectedFileId) : null;
  const isFile = node?.type === 'file';
  const pathNodes = selectedFileId ? getNodePath(vaultData, selectedFileId) : null;
  const isStarred = selectedFileId ? starredIds.includes(selectedFileId) : false;

  const folderPath = pathNodes ? pathNodes.slice(0, -1).map(n => n.name).join(' / ') : null;
  const fullPath = pathNodes ? pathNodes.map(n => n.name).join(' / ') : null;
  const ext = node ? getFileExtension(node.name) : '';
  const baseName = node ? (ext ? node.name.slice(0, -(ext.length + 1)) : node.name) : '';
  const meta = node && isFile ? getExtMeta(node.name) : null;
  const TypeIcon = meta?.icon || File;

  const handleCopyPath = () => {
    if (fullPath) {
      navigator.clipboard.writeText(fullPath).then(() => {
        toast.success('Path copied!', { description: fullPath });
        addActivity?.('copy', `Copied path: ${fullPath}`);
      });
    }
  };

  return (
    <aside className="w-[280px] shrink-0 h-full flex flex-col border-l border-sv-border overflow-hidden" style={{ backgroundColor: 'var(--sv-bg-surface)' }}>
      {/* Header + Tabs */}
      <div className="shrink-0 border-b border-sv-border">
        <div className="px-4 pt-3 pb-0">
          <span className="text-[10px] font-mono font-semibold uppercase tracking-widest" style={{ color: 'var(--sv-text-muted)' }}>
            File Details
          </span>
        </div>
        {node && isFile && (
          <div className="flex px-4 mt-2 gap-1">
            {['details', 'preview'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider transition-all duration-150 rounded-t-sm"
                style={{
                  color: activeTab === tab ? 'var(--sv-accent)' : 'var(--sv-text-muted)',
                  backgroundColor: activeTab === tab ? 'var(--sv-accent-dim)' : 'transparent',
                  borderBottom: activeTab === tab ? '2px solid var(--sv-accent)' : '2px solid transparent',
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {!node ? (
          <EmptySelection />
        ) : activeTab === 'preview' && isFile ? (
          <FilePreview node={node} />
        ) : (
          <>
            {/* File icon + name */}
            <div className="flex flex-col items-center px-4 py-5 border-b border-sv-border text-center gap-3">
              <div className="w-14 h-14 rounded-sv-lg flex items-center justify-center" style={{ backgroundColor: 'var(--sv-bg-elevated)', border: '1px solid var(--sv-border)' }}>
                <TypeIcon size={28} strokeWidth={1.5} style={{ color: meta?.color || 'var(--sv-text-secondary)' }} />
              </div>
              <div className="w-full">
                <p className="text-[12px] font-mono font-medium break-all leading-snug mb-2" style={{ color: 'var(--sv-text-primary)' }}>{node.name}</p>
                {isFile && <Badge fileName={node.name} />}
              </div>
            </div>

            {/* Details */}
            <div className="px-4 py-2">
              <DetailRow label="Name" value={baseName || node.name} mono />
              {isFile && <DetailRow label="Extension" value={ext ? `.${ext}` : '—'} mono />}
              <DetailRow label="Size" value={node.size || (node.type === 'folder' ? 'Folder' : '—')} mono />
              {isFile && <DetailRow label="Type" value={meta?.label} />}
              <DetailRow label="Path" value={folderPath || 'Root'} mono />
              <DetailRow label="Last Modified" value="Apr 22, 2026" />
              <DetailRow label="ID" value={node.id} mono />
            </div>

            {/* Actions */}
            <div className="px-4 py-4 border-t border-sv-border space-y-2">
              <SvButton variant="ghost" size="sm" className="w-full justify-start gap-2" onClick={() => onToggleStar(selectedFileId, node.name)} aria-label={isStarred ? 'Unstar file' : 'Star file'}>
                <Star size={13} style={isStarred ? { fill: 'var(--sv-warning)', color: 'var(--sv-warning)' } : {}} />
                {isStarred ? 'Unstar File' : 'Star File'}
              </SvButton>
              <SvButton variant="ghost" size="sm" className="w-full justify-start gap-2" onClick={() => { onAddRecent(selectedFileId); toast('Added to recent', { description: node.name }); }} aria-label="Add to recent">
                <Clock size={13} /> Add to Recent
              </SvButton>
              <SvButton variant="ghost" size="sm" className="w-full justify-start gap-2" onClick={handleCopyPath} aria-label="Copy path">
                <Copy size={13} /> Copy Path
              </SvButton>
              <SvButton variant="primary" size="sm" className="w-full justify-start gap-2" onClick={() => toast('Download initiated', { description: `Preparing ${node.name}…` })} aria-label="Download file">
                <Download size={13} /> Download
              </SvButton>
              <SvButton variant="danger" size="sm" className="w-full justify-start gap-2" onClick={() => toast.error('Moved to trash', { description: node.name })} aria-label="Move to trash">
                <Trash2 size={13} /> Move to Trash
              </SvButton>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}