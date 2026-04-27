

export default function EmptyState({ icon: Icon, message, subtext }) {
  return (
    <div className="flex flex-col items-center justify-center h-full py-20 select-none">
      {Icon && (
        <div className="mb-5 p-4 rounded-full bg-sv-accent-dim">
          <Icon size={40} className="text-sv-accent" strokeWidth={1.5} />
        </div>
      )}
      <h3 className="text-sv-text-primary text-base font-semibold font-inter mb-1.5">
        {message}
      </h3>
      {subtext && (
        <p className="text-sv-text-secondary text-sm font-inter max-w-xs text-center">
          {subtext}
        </p>
      )}
    </div>
  );
}