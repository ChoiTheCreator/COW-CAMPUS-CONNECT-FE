import { ChevronRightIcon } from '@radix-ui/react-icons';

type Props = {
  onGoBoard: () => void;
};

export default function MainCTAs({ onGoBoard }: Props) {
  return (
    <div className="mt-6 flex flex-col sm:flex-row gap-3">
      <button
        onClick={onGoBoard}
        className={[
          'flex-1 inline-flex items-center justify-center rounded-2xl px-5 py-3',
          'text-[15px] font-semibold text-white',
          'bg-slate-900 hover:bg-slate-800 active:bg-slate-900',
          'shadow-[0_16px_36px_rgba(15,23,42,0.25)] transition-all',
          'hover:translate-y-[-1px] active:translate-y-0',
        ].join(' ')}
      >
        지금 바로 카드 보러가기
        <ChevronRightIcon className="ml-1" />
      </button>
    </div>
  );
}
