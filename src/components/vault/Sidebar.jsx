
import { Search, Lock, HardDrive, Star, Clock, Trash2, Scale, DollarSign, Shield, Users } from 'lucide-react';
import ActivityLog from './ActivityLog';

const navItems = [
  { id: 'all', icon: HardDrive, label: 'All Files' },
  { id: 'starred', icon: Star, label: 'Starred' },
  { id: 'recent', icon: Clock, label: 'Recent' },
  { id: 'trash', icon: Trash2, label: 'Trash' },
];

const departments = [
  { id: 'legal', icon: Scale, label: 'Legal' },
  { id: 'finance', icon: DollarSign, label: 'Finance' },
  { id: 'security', icon: Shield, label: 'IT Security' },
  { id: 'shared', icon: Users, label: 'Shared' },
];

export default function Sidebar({ activeNav, onNavChange, searchQuery, onSearchChange, activityLog, searchInputRef }) {
  return (
    <aside className="w-[220px] shrink-0 h-full flex flex-col border-r border-sv-border overflow-hidden" style={{ backgroundColor: 'var(--sv-bg-surface)' }}>
      {/* Search */}
      <div className="p-3">
        <div className="relative">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--sv-text-muted)' }} />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search vault..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search vault files"
            className="w-full h-8 pl-8 pr-10 rounded-sv-md text-xs font-inter transition-colors focus:outline-none"
            style={{
              backgroundColor: 'var(--sv-bg-elevated)',
              border: '1px solid var(--sv-border)',
              color: 'var(--sv-text-primary)',
            }}
            onFocus={e => { e.currentTarget.style.borderColor = 'var(--sv-accent)'; }}
            onBlur={e => { e.currentTarget.style.borderColor = 'var(--sv-border)'; }}
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[8px] font-mono px-1 py-0.5 rounded hidden md:block" style={{ color: 'var(--sv-text-muted)', border: '1px solid var(--sv-border)', backgroundColor: 'var(--sv-bg-base)' }}>
            ⌘K
          </span>
        </div>
      </div>

      {/* Vault nav */}
      <div className="px-3 mb-1">
        <div className="flex items-center gap-1.5 mb-2">
          <Lock size={10} style={{ color: 'var(--sv-text-muted)' }} />
          <span className="text-[10px] font-mono font-semibold uppercase tracking-widest" style={{ color: 'var(--sv-text-muted)' }}>Vault</span>
        </div>
        <div className="space-y-0.5">
          {navItems.map(item => {
            const isActive = activeNav === item.id;
            return (
              <button key={item.id} onClick={() => onNavChange(item.id)} aria-label={item.label}
                className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-sv-sm text-xs font-inter transition-all duration-100 ${isActive ? 'border-l-2' : 'border-l-2 border-transparent'}`}
                style={isActive ? { color: 'var(--sv-accent)', backgroundColor: 'var(--sv-accent-dim)', borderLeftColor: 'var(--sv-accent)' } : { color: 'var(--sv-text-secondary)' }}
                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.backgroundColor = 'var(--sv-bg-hover)'; e.currentTarget.style.color = 'var(--sv-text-primary)'; } }}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.color = 'var(--sv-text-secondary)'; } }}
              >
                <item.icon size={14} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Divider */}
      <div className="mx-3 my-2" style={{ borderTop: '1px solid var(--sv-border)' }} />

      {/* Departments */}
      <div className="px-3">
        <div className="flex items-center gap-1.5 mb-2">
          <span className="text-[10px] font-mono font-semibold uppercase tracking-widest" style={{ color: 'var(--sv-text-muted)' }}>Departments</span>
        </div>
        <div className="space-y-0.5">
          {departments.map(dept => {
            const isActive = activeNav === dept.id;
            return (
              <button key={dept.id} onClick={() => onNavChange(dept.id)} aria-label={dept.label}
                className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-sv-sm text-xs font-inter transition-all duration-100 border-l-2`}
                style={isActive ? { color: 'var(--sv-accent)', backgroundColor: 'var(--sv-accent-dim)', borderLeftColor: 'var(--sv-accent)' } : { color: 'var(--sv-text-secondary)', borderLeftColor: 'transparent' }}
                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.backgroundColor = 'var(--sv-bg-hover)'; e.currentTarget.style.color = 'var(--sv-text-primary)'; } }}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.color = 'var(--sv-text-secondary)'; } }}
              >
                <dept.icon size={14} />
                <span>{dept.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        {/* Activity log */}
        <ActivityLog entries={activityLog || []} />
      </div>

      {/* Storage widget */}
      <div className="p-3 border-t shrink-0" style={{ borderColor: 'var(--sv-border)' }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono font-semibold uppercase tracking-widest" style={{ color: 'var(--sv-text-muted)' }}>Vault Capacity</span>
          <span className="text-[10px] font-mono" style={{ color: 'var(--sv-text-secondary)' }}>28%</span>
        </div>
        <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--sv-bg-elevated)' }}>
          <div className="h-full rounded-full" style={{ width: '28.4%', backgroundColor: 'var(--sv-accent)', boxShadow: '0 0 8px rgba(0,255,136,0.3)' }} />
        </div>
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-[10px] font-inter" style={{ color: 'var(--sv-text-secondary)' }}>28.4 GB used</span>
          <span className="text-[10px] font-inter" style={{ color: 'var(--sv-text-muted)' }}>100 GB</span>
        </div>
      </div>
    </aside>
  );
}