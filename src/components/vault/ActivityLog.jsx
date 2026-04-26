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

      