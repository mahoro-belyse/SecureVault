

export default function IconButton({ icon: Icon, size = 18, tooltip, active, className = '', ...props }) {
  return (
    <button
      className={`
        relative group inline-flex items-center justify-center
        w-8 h-8 rounded-sv-md transition-all duration-150
        hover:bg-sv-hover hover:border-sv-border-active
        border border-transparent
        focus:outline-none focus:ring-1 focus:ring-sv-accent
        ${active ? 'bg-sv-accent-dim border-sv-border-active text-sv-accent' : 'text-sv-text-secondary'}
        ${className}
      `}
      title={tooltip}
      {...props}
    >
      <Icon size={size} />
      {tooltip && (
        <span className="
          absolute -bottom-8 left-1/2 -translate-x-1/2
          px-2 py-1 rounded-sv-sm
          bg-sv-elevated text-sv-text-primary text-[10px] font-inter
          border border-sv-border
          opacity-0 group-hover:opacity-100 transition-opacity duration-150
          pointer-events-none whitespace-nowrap z-50
        ">
          {tooltip}
        </span>
      )}
    </button>
  );
}