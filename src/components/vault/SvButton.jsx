



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