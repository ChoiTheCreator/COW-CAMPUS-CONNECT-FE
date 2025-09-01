import { igGradient } from './constants';

type Props = {
  nickName?: string;
  genderKo?: string;
};

export default function HeaderHero({ nickName = '', genderKo = '' }: Props) {
  return (
    <div className="p-8 sm:p-10">
      <div className="relative mb-4">
        <div className="absolute inset-0 -m-2 rounded-xl blur-2xl opacity-60 bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-rose-500" />
        <div className="relative inline-flex items-center gap-2 rounded-xl bg-slate-900 text-white px-4 py-2 shadow-lg">
          <span className="text-sm font-semibold">Welcome 🎉</span>
        </div>
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold tracking-[-0.02em] text-slate-900">
        이제 시작이야! 보드를 탐색하고 인연을 만들어봐 ✨
      </h1>

      <p className="mt-2 text-slate-500 text-sm sm:text-[15px] leading-relaxed">
        {nickName ? (
          <>
            <span className="font-medium text-slate-700">{nickName}</span>님
            {genderKo ? ` (${genderKo})` : ''}의 취향에 맞는 카드들을 확인하고,
            마음에 드는 사람의 <span className="font-medium">인스타그램</span>
            으로 바로 연결해보세요.
          </>
        ) : (
          <>
            다른 성별의 카드 목록을 보고, 마음에 드는 사람의{' '}
            <span className="font-medium">인스타그램</span>으로 바로
            연결해보세요.
          </>
        )}
      </p>

      <div className="mt-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs text-white shadow-sm select-none cursor-default">
        <span
          className={`${igGradient} inline-flex items-center gap-2 rounded-full px-3 py-1`}
        >
          인스타로 바로 연결
        </span>
      </div>
    </div>
  );
}
