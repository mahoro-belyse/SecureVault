
import { getFileExtension } from '../../data/vault';

const extColorMap = {
  pdf: 'bg-red-500/15 text-red-400 border-red-500/20',
  xlsx: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  xls: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  docx: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  doc: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  png: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
  svg: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
  jpg: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
  jpeg: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
  ttf: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
};

const defaultColor = 'bg-slate-500/15 text-slate-400 border-slate-500/20';

export default function Badge({ fileName, className = '' }) {
  const ext = getFileExtension(fileName);
  if (!ext) return null;

  const colorClass = extColorMap[ext] || defaultColor;

  return (
    <span
      className={`
        inline-flex items-center px-2 py-0.5
        rounded-full border text-[10px] font-mono font-medium uppercase tracking-wider
        ${colorClass}
        ${className}
      `}
    >
      {ext}
    </span>
  );
}