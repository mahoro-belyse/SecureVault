
import { Image, File } from 'lucide-react';
import { getFileExtension } from '../../data/vault';
import SvButton from './SvButton';
import { toast } from 'sonner';

function PdfPreview({ node }) {
  const sizeKB = parseFloat(node.size) * (node.size.includes('MB') ? 1024 : 1);
  const pages = Math.max(1, Math.round(sizeKB / 40));
  const lines = [85, 70, 90, 60, 80, 55, 75, 65, 88, 72];
  return (
    <div className="rounded-sv-md overflow-hidden shadow-xl" style={{ backgroundColor: 'var(--sv-bg-elevated)', border: '1px solid var(--sv-border)' }}>
      <div className="px-4 py-2.5 flex items-center justify-between" style={{ backgroundColor: 'var(--sv-danger)', opacity: 0.9 }}>
        <span className="text-[11px] font-mono font-semibold text-white truncate">{node.name}</span>
        <span className="text-[9px] font-mono text-white/70 shrink-0 ml-2">PDF</span>
      </div>
      <div className="p-4 space-y-2">
        {lines.map((w, i) => (
          <div key={i} className="h-2 rounded-full" style={{ width: `${w}%`, backgroundColor: i === 0 ? '#3a3a5c' : '#2a2a45' }} />
        ))}
        <div className="pt-2 flex items-center justify-between">
          <span className="text-[9px] font-mono" style={{ color: 'var(--sv-text-muted)' }}>PDF Document</span>
          <span className="text-[9px] font-mono" style={{ color: 'var(--sv-text-muted)' }}>Est. ~{pages} pages</span>
        </div>
      </div>
    </div>
  );
}

function XlsxPreview() {
  const headers = ['A', 'B', 'C', 'D', 'E'];
  const rows = Array.from({ length: 7 });
  const widths = [60, 80, 45, 70, 55, 90, 40, 75, 50, 65, 85, 35];
  return (
    <div className="rounded-sv-md overflow-hidden" style={{ border: '1px solid var(--sv-border)' }}>
      <div className="grid grid-cols-5" style={{ backgroundColor: 'var(--sv-accent-dim)' }}>
        {headers.map(h => (
          <div key={h} className="px-2 py-1.5 text-[9px] font-mono font-semibold text-center" style={{ color: 'var(--sv-accent)', borderRight: '1px solid var(--sv-border)' }}>{h}</div>
        ))}
      </div>
      {rows.map((_, ri) => (
        <div key={ri} className="grid grid-cols-5" style={{ backgroundColor: ri % 2 === 0 ? 'var(--sv-bg-elevated)' : 'var(--sv-bg-base)' }}>
          {headers.map((_, ci) => (
            <div key={ci} className="px-2 py-1.5 flex items-center" style={{ borderRight: '1px solid var(--sv-border)', borderTop: '1px solid var(--sv-border)' }}>
              <div className="h-1.5 rounded-full" style={{ width: `${widths[(ri * 5 + ci) % widths.length]}%`, backgroundColor: 'var(--sv-text-muted)', opacity: 0.5 }} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function ImagePreview({ node }) {
  return (
    <div
      className="rounded-sv-md flex flex-col items-center justify-center py-10 gap-3"
      style={{ border: '2px dashed var(--sv-border)', backgroundColor: 'var(--sv-bg-elevated)' }}
    >
      <Image size={48} style={{ color: 'var(--sv-text-muted)' }} strokeWidth={1} />
      <div className="text-center">
        <p className="text-[11px] font-inter font-medium" style={{ color: 'var(--sv-text-secondary)' }}>Image Preview</p>
        <p className="text-[10px] font-mono mt-0.5" style={{ color: 'var(--sv-text-muted)' }}>{node.name}</p>
        <p className="text-[9px] font-mono mt-1" style={{ color: 'var(--sv-text-muted)' }}>1920 × 1080 px (estimated)</p>
      </div>
    </div>
  );
}

function CodePreview({ node }) {
  const lines = Array.from({ length: 12 }, (_, i) => i + 1);
  const widths = [70, 45, 85, 30, 60, 90, 50, 75, 40, 80, 55, 65];
  const colors = { 2: '#00FF88', 4: '#4da6ff', 7: '#f5a623', 10: '#00FF88' };
  return (
    <div className="rounded-sv-md overflow-hidden" style={{ backgroundColor: 'var(--sv-bg-elevated)', border: '1px solid var(--sv-border)' }}>
      <div className="flex items-center gap-2 px-3 py-2 border-b" style={{ borderColor: 'var(--sv-border)' }}>
        <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
        <span className="text-[10px] font-mono ml-2" style={{ color: 'var(--sv-text-muted)' }}>{node.name}</span>
      </div>
      <div className="px-3 py-2">
        {lines.map(n => (
          <div key={n} className="flex items-center gap-3 py-0.5">
            <span className="text-[9px] font-mono w-4 text-right shrink-0" style={{ color: 'var(--sv-text-muted)' }}>{n}</span>
            <div className="flex items-center gap-1.5 flex-1">
              {colors[n] && <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: colors[n] }} />}
              <div className="h-1.5 rounded-full" style={{ width: `${widths[n - 1]}%`, backgroundColor: colors[n] ? colors[n] + '40' : '#2a2a35' }} />
            </div>
          </div>
        ))}
      </div>
      <div className="px-3 py-1.5 border-t flex items-center justify-between" style={{ borderColor: 'var(--sv-border)' }}>
        <span className="text-[9px] font-mono" style={{ color: 'var(--sv-text-muted)' }}>12 lines · UTF-8</span>
        <span className="text-[9px] font-mono" style={{ color: 'var(--sv-text-muted)' }}>{node.size}</span>
      </div>
    </div>
  );
}

function GenericPreview({ node, ext }) {
  return (
    <div
      className="rounded-sv-md flex flex-col items-center justify-center py-10 gap-3"
      style={{ border: '1px solid var(--sv-border)', backgroundColor: 'var(--sv-bg-elevated)' }}
    >
      <File size={48} style={{ color: 'var(--sv-text-muted)' }} strokeWidth={1} />
      <div className="text-center">
        <p className="text-[11px] font-inter font-medium" style={{ color: 'var(--sv-text-secondary)' }}>{ext.toUpperCase()} File</p>
        <p className="text-[10px] font-mono mt-1" style={{ color: 'var(--sv-text-muted)' }}>{node.size}</p>
      </div>
    </div>
  );
}

export default function FilePreview({ node }) {
  const ext = getFileExtension(node.name);

  const renderPreview = () => {
    if (ext === 'pdf') return <PdfPreview node={node} />;
    if (['xlsx', 'xls'].includes(ext)) return <XlsxPreview />;
    if (['png', 'svg', 'jpg', 'jpeg'].includes(ext)) return <ImagePreview node={node} />;
    if (['txt', 'yaml', 'yml', 'gitignore'].includes(ext) || node.name.startsWith('.')) return <CodePreview node={node} />;
    return <GenericPreview node={node} ext={ext || 'file'} />;
  };

  return (
    <div className="flex flex-col gap-3 p-4">
      {renderPreview()}
      <SvButton
        variant="ghost"
        size="sm"
        className="w-full"
        onClick={() => toast('Enterprise feature', { description: 'Full preview available in enterprise tier' })}
      >
        Open Full Preview
      </SvButton>
    </div>
  );
}