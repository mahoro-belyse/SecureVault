import { useEffect, useRef } from 'react';
import { LogOut } from 'lucide-react';
import { toast } from 'sonner';

export default function UserDropdown({ onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute top-10 right-0 w-56 rounded-sv-md shadow-2xl z-[150] overflow-hidden"
      style={{ backgroundColor: 'var(--sv-bg-elevated)', border: '1px solid var(--sv-border)' }}
    >
      <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--sv-border)' }}>
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-mono font-bold shrink-0"
            style={{ backgroundColor: 'var(--sv-accent-dim)', color: 'var(--sv-accent)', border: '1px solid rgba(0,255,136,0.2)' }}
          >
            SV
          </div>
          <div>
            <p className="text-[12px] font-inter font-semibold" style={{ color: 'var(--sv-text-primary)' }}>SV User</p>
            <p className="text-[10px] font-mono" style={{ color: 'var(--sv-text-muted)' }}>security@securevault.io</p>
          </div>
        </div>
      </div>
      <div className="py-1">
        <button
          className="w-full flex items-center gap-2.5 px-4 py-2 text-[11px] font-inter transition-colors"
          style={{ color: 'var(--sv-danger)' }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--sv-bg-hover)'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = ''}
          onClick={() => { toast.error('Signed out', { description: 'See you next time' }); onClose(); }}
        >
          <LogOut size={12} />
          Sign Out
        </button>
      </div>
    </div>
  );
}