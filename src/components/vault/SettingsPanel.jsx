
import { X} from 'lucide-react';

function Toggle({ label, description, value, onChange }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3" style={{ borderBottom: '1px solid var(--sv-border)' }}>
      <div>
        <p className="text-[12px] font-inter font-medium" style={{ color: 'var(--sv-text-primary)' }}>{label}</p>
        {description && <p className="text-[10px] font-inter mt-0.5" style={{ color: 'var(--sv-text-muted)' }}>{description}</p>}
      </div>
      <button
        onClick={() => onChange(!value)}
        aria-label={label}
        className="shrink-0 w-9 h-5 rounded-full transition-all duration-200 relative mt-0.5"
        style={{ backgroundColor: value ? 'var(--sv-accent)' : 'var(--sv-bg-base)', border: '1px solid var(--sv-border)' }}
      >
        <span
          className="absolute top-0.5 w-3.5 h-3.5 rounded-full transition-all duration-200"
          style={{
            left: value ? 'calc(100% - 16px)' : '2px',
            backgroundColor: value ? 'var(--sv-bg-base)' : 'var(--sv-text-muted)',
          }}
        />
      </button>
    </div>
  );
}

export default function SettingsPanel({ settings, onChange, onClose }) {
  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-[100]"
        style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
        onClick={onClose}
      />
      {/* Panel */}
      <div
        className="fixed top-12 right-0 bottom-0 z-[110] w-72 flex flex-col shadow-2xl"
        style={{
          backgroundColor: 'var(--sv-bg-surface)',
          borderLeft: '1px solid var(--sv-border)',
          transform: 'translateX(0)',
          transition: 'transform 250ms ease',
        }}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--sv-border)' }}>
          <span className="text-sm font-inter font-semibold" style={{ color: 'var(--sv-text-primary)' }}>
            Vault Settings
          </span>
          <button
            onClick={onClose}
            aria-label="Close settings"
            className="p-1 rounded-sv-sm transition-colors"
            style={{ color: 'var(--sv-text-secondary)' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--sv-text-primary)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--sv-text-secondary)'}
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-2">
          <Toggle
            label="Show hidden files"
            description="Display .gitignore and dot-files"
            value={settings.showHidden}
            onChange={v => onChange('showHidden', v)}
          />
          <Toggle
            label="Compact view"
            description="Reduce row height for denser display"
            value={settings.compactView}
            onChange={v => onChange('compactView', v)}
          />
          <Toggle
            label="Auto-expand on select"
            description="Expand parent folders when a file is selected"
            value={settings.autoExpand}
            onChange={v => onChange('autoExpand', v)}
          />
        </div>

        <div className="px-5 py-4 border-t" style={{ borderColor: 'var(--sv-border)' }}>
          <p className="text-[10px] font-mono" style={{ color: 'var(--sv-text-muted)' }}>
            Settings saved automatically
          </p>
        </div>
      </div>
    </>
  );
}