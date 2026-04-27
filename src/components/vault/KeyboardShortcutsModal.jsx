import { useEffect } from 'react';
import { X, Keyboard } from 'lucide-react';

const shortcuts = [
  { keys: ['↑', '↓'], description: 'Navigate files' },
  { keys: ['→'], description: 'Expand folder' },
  { keys: ['←'], description: 'Collapse folder / go to parent' },
  { keys: ['Enter'], description: 'Select file / toggle folder' },
  { keys: ['Ctrl', 'K'], description: 'Focus search' },
  { keys: ['Esc'], description: 'Clear selection' },
  { keys: ['?'], description: 'Toggle this help' },
];

function KeyBadge({ label }) {
  return (
    <span
      className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-mono rounded"
      style={{
        border: '1px solid var(--sv-border)',
        backgroundColor: 'var(--sv-bg-base)',
        color: 'var(--sv-text-secondary)',
        minWidth: '20px',
      }}
    >
      {label}
    </span>
  );
}

export default function KeyboardShortcutsModal({ onClose }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-sm mx-4 rounded-sv-lg overflow-hidden shadow-2xl"
        style={{ backgroundColor: 'var(--sv-bg-elevated)', border: '1px solid var(--sv-border)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--sv-border)' }}>
          <div className="flex items-center gap-2.5">
            <Keyboard size={16} style={{ color: 'var(--sv-accent)' }} />
            <span className="text-sm font-inter font-semibold" style={{ color: 'var(--sv-text-primary)' }}>
              Keyboard Shortcuts
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close keyboard shortcuts"
            className="transition-colors rounded-sv-sm p-1"
            style={{ color: 'var(--sv-text-secondary)' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--sv-text-primary)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--sv-text-secondary)'}
          >
            <X size={16} />
          </button>
        </div>

        {/* Rows */}
        <div className="px-5 py-3 space-y-1">
          {shortcuts.map((s, i) => (
            <div key={i} className="flex items-center justify-between py-2" style={{ borderBottom: i < shortcuts.length - 1 ? '1px solid var(--sv-border)' : 'none' }}>
              <div className="flex items-center gap-1">
                {s.keys.map((k, ki) => <KeyBadge key={ki} label={k} />)}
              </div>
              <span className="text-[11px] font-inter" style={{ color: 'var(--sv-text-secondary)' }}>
                {s.description}
              </span>
            </div>
          ))}
        </div>

        <div className="px-5 py-3 border-t" style={{ borderColor: 'var(--sv-border)' }}>
          <p className="text-[10px] font-mono text-center" style={{ color: 'var(--sv-text-muted)' }}>
            Press <KeyBadge label="?" /> anywhere to toggle
          </p>
        </div>
      </div>
    </div>
  );
}