

const variantStyles = {
  primary: 'bg-sv-accent text-sv-base font-semibold hover:brightness-110 active:brightness-90',
  ghost: 'bg-transparent border border-sv-border text-sv-text-secondary hover:bg-sv-hover hover:text-sv-text-primary hover:border-sv-border-active',
  danger: 'bg-transparent border border-sv-danger text-sv-danger hover:bg-sv-danger hover:text-white',
};

const sizeStyles = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
};

export default function SvButton({ variant = 'primary', size = 'md', children, className = '', ...props }) {
  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2
        rounded-sv-md font-inter transition-all duration-150
        focus:outline-none focus:ring-1 focus:ring-sv-accent focus:ring-offset-1 focus:ring-offset-sv-base
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}