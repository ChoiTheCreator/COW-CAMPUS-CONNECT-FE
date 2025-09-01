import { ChevronRightIcon } from '@radix-ui/react-icons';
import { ReactNode } from 'react';

type Props = {
  icon: ReactNode;
  title: string;
  description: string;
  onClick: () => void;
};

export default function ActionCard({
  icon,
  title,
  description,
  onClick,
}: Props) {
  return (
    <button
      onClick={onClick}
      className="group p-6 text-left hover:bg-slate-50 transition w-full"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {icon}
          <div>
            <div className="font-semibold text-slate-900">{title}</div>
            <div className="text-[12px] text-slate-500">{description}</div>
          </div>
        </div>
        <ChevronRightIcon
          className="text-slate-400 group-hover:translate-x-0.5 transition"
          width={18}
          height={18}
        />
      </div>
    </button>
  );
}
