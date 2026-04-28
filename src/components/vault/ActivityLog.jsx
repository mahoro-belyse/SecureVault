import { useState } from 'react';
import { ChevronDown, Eye, Star, Copy, Clock, Activity } from 'lucide-react';

const iconMap = { view: Eye, star: Star, copy: Copy, recent: Clock };

function relativeTime(ts) {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 10) return 'just now';
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

export default function ActivityLog({ entries }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="border-t" style={{ borderColor: 'var(--sv-border)' }}>
      <button
        className="w-full flex items-center justify-between px-3 py-2 transition-colors"
        onClick={() => setCollapsed(c => !c)}
        onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--sv-bg-hover)'}
        onMouseLeave={e => e.currentTarget.style.backgroundColor = ''}
      >
        <div className="flex items-center gap-1.5">
          <Activity size={10} style={{ color: 'var(--sv-text-muted)' }} />
          <span className="text-[10px] font-mono font-semibold uppercase tracking-widest" style={{ color: 'var(--sv-text-muted)' }}>
            Activity Log
          </span>
        </div>
        <ChevronDown
          size={12}
          style={{ color: 'var(--sv-text-muted)', transform: collapsed ? 'rotate(-90deg)' : 'rotate(0deg)', transition: 'transform 150ms ease' }}
        />
      </button>

      {!collapsed && (
        <div className="overflow-y-auto" style={{ maxHeight: '200px' }}>
          {entries.length === 0 ? (
            <p className="px-3 py-3 text-[10px] font-inter" style={{ color: 'var(--sv-text-muted)' }}>No activity yet</p>
          ) : (
            entries.slice(0, 8).map((entry, i) => {
              const Icon = iconMap[entry.type] || Eye;
              return (
                <div key={i} className="flex items-start gap-2 px-3 py-1.5 border-b" style={{ borderColor: 'var(--sv-border)' }}>
                  <Icon size={10} className="mt-0.5 shrink-0" style={{ color: 'var(--sv-text-muted)' }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-inter truncate" style={{ color: 'var(--sv-text-secondary)' }}>{entry.action}</p>
                    <p className="text-[9px] font-mono" style={{ color: 'var(--sv-text-muted)' }}>{relativeTime(entry.ts)}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}