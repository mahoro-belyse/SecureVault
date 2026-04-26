import React from 'react';
import { useMemo, useState } from 'react';
import { ShieldCheck, Bell, Settings, ChevronRight, HelpCircle } from 'lucide-react';
import IconButton from './IconButton';
import UserDropdown from './UserDropdown';
import { vaultData, getNodePath } from '../../data/vault';


export default function TopNav({ selectedFileId, onSettingsClick, onHelpClick }) {
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const breadcrumbs = useMemo(() => {
    if (!selectedFileId) return [{ id: null, name: 'Root' }];
    const path = getNodePath(vaultData, selectedFileId);
    if (!path) return [{ id: null, name: 'Root' }];
    return [{ id: null, name: 'Root' }, ...path];
  }, [selectedFileId]);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 h-12 flex items-center justify-between px-4 border-b"
      style={{ backgroundColor: 'var(--sv-bg-surface)', backdropFilter: 'blur(8px)', borderColor: 'var(--sv-border)' }}
    >
      {/* Skip to main */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-3 focus:py-1.5 focus:rounded focus:text-xs focus:font-inter" style={{ backgroundColor: 'var(--sv-accent)', color: 'var(--sv-bg-base)' }}>
        Skip to main content
      </a>

      {/* Left: Logo */}
      <div className="flex items-center gap-2.5 shrink-0">
        <ShieldCheck size={22} style={{ color: 'var(--sv-accent)' }} />
        <span className="font-bold text-sm font-inter tracking-tight" style={{ color: 'var(--sv-text-primary)' }}>SecureVault</span>
        <span className="px-1.5 py-0.5 rounded-full text-[9px] font-mono font-semibold uppercase tracking-widest border" style={{ backgroundColor: 'var(--sv-accent-dim)', color: 'var(--sv-accent)', borderColor: 'rgba(0,255,136,0.2)' }}>
          VAULT
        </span>
      </div>

      {/* Center: Breadcrumbs */}
      <nav className="flex-1 flex items-center justify-center gap-1 min-w-0 mx-4 overflow-hidden" aria-label="File path breadcrumb">
        {breadcrumbs.map((crumb, i) => (
          <React.Fragment key={i}>
            {i > 0 && <ChevronRight size={12} style={{ color: 'var(--sv-text-muted)' }} className="shrink-0" />}
            <span className="text-[11px] font-inter truncate max-w-[120px]" style={{ color: i === breadcrumbs.length - 1 ? 'var(--sv-text-primary)' : 'var(--sv-text-secondary)', fontWeight: i === breadcrumbs.length - 1 ? 500 : 400 }}>
              {crumb.name}
            </span>
          </React.Fragment>
        ))}
      </nav>

      {/* Right: Actions */}
      <div className="flex items-center gap-1.5 shrink-0 relative">
        <IconButton icon={Bell} tooltip="Notifications" aria-label="Notifications" onClick={() => toast('No new security alerts', { description: 'All systems operational' })} />
        <IconButton icon={Settings} tooltip="Settings" aria-label="Open settings" onClick={onSettingsClick} />
        <IconButton icon={HelpCircle} tooltip="Keyboard shortcuts" aria-label="Keyboard shortcuts" onClick={onHelpClick} />
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center border cursor-pointer transition-colors text-[11px] font-mono font-bold relative"
          style={{ backgroundColor: 'var(--sv-accent-dim)', borderColor: 'rgba(0,255,136,0.2)', color: 'var(--sv-accent)' }}
          onClick={() => setShowUserDropdown(v => !v)}
          title="User profile"
          role="button"
          aria-label="User menu"
        >
          SV
          {showUserDropdown && <UserDropdown onClose={() => setShowUserDropdown(false)} />}
        </div>
      </div>
    </header>
  );
}