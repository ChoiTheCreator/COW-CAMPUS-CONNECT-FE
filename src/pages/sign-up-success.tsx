import { CheckCircledIcon } from '@radix-ui/react-icons';
import { useLocation, useNavigate } from 'react-router-dom';

export function SignUpSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const gender = searchParams.get('gender');
  const nickName = searchParams.get('nickName');

  const genderKo =
    gender === 'male' ? '남자' : gender === 'female' ? '여자' : '미입력';

  return (
    <div className="min-h-dvh w-dvw bg-slate-50 flex items-center justify-center px-4 py-10">
      {/* 카드 */}
      <div className="w-full max-w-[520px] rounded-3xl bg-white shadow-[0_20px_60px_rgba(15,23,42,0.12)] border border-slate-100 p-8">
        {/* 헤더 */}
        <div className="flex flex-col items-center text-center">
          {/* 성공 아이콘 */}
          <div className="relative mb-6">
            {/* 그라데이션 링 */}
            <div className="absolute inset-0 -m-1 rounded-full bg-gradient-to-r from-[#f58529] via-[#dd2a7b] to-[#8134af] blur-[18px] opacity-60" />
            <div className="relative grid place-items-center h-28 w-28 rounded-full bg-slate-900 text-white shadow-lg">
              <CheckCircledIcon width={56} height={56} />
            </div>
          </div>

          <h1 className="text-2xl font-bold tracking-[-0.02em] text-slate-900">
            가입 완료!
          </h1>
          <p className="mt-2 text-slate-500 text-sm leading-relaxed">
            이제 소개팅 보드에서 다른 친구들의 프로필을 확인하고
            <br />
            인스타그램으로 바로 연결해보세요.
          </p>
        </div>

        {/* 정보 요약 */}
        <div className="mt-8 grid gap-3">
          <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <span className="text-sm text-slate-500">닉네임</span>
            <span className="text-sm font-semibold text-slate-900">
              {nickName || '미입력'}
            </span>
          </div>
          <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <span className="text-sm text-slate-500">성별</span>
            <span className="text-sm font-semibold text-slate-900">
              {genderKo}
            </span>
          </div>
        </div>

        {/* 가이드 */}
        <div className="mt-6 rounded-2xl border border-slate-200 p-4">
          <ul className="space-y-2 text-[13px] leading-6 text-slate-600">
            <li>• 보드에는 다른 성별의 닉네임, MBTI, 한 줄 소개가 보여요.</li>
            <li>
              • 인스타 버튼을 누르면 새 탭에서 바로 프로필을 열 수 있어요.
            </li>
            <li>• 매너 있게 대화 시작하기, 잊지 않기! 😊</li>
          </ul>
        </div>

        {/* CTA 영역 */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          {/* 메인 CTA: 소개팅 시작 */}
          <button
            onClick={() => navigate('/')}
            className={[
              'flex-1 inline-flex items-center justify-center rounded-2xl px-5 py-3',
              'text-[15px] font-semibold text-white',
              'bg-slate-900 hover:bg-slate-800 active:bg-slate-900',
              'shadow-[0_16px_36px_rgba(15,23,42,0.25)] transition-all',
              'hover:translate-y-[-1px] active:translate-y-0',
            ].join(' ')}
          >
            친구매칭 시작하기
          </button>
          <button
            onClick={() => navigate('/roulette')}
            className={[
              'flex-1 inline-flex items-center justify-center rounded-2xl px-5 py-3',
              'text-[15px] font-semibold text-white',
              'bg-gradient-to-r from-violet-500 to-fuchsia-600',
              'shadow-[0_16px_36px_rgba(139,92,246,0.35)] transition-all',
              'hover:translate-y-[-1px] active:translate-y-0',
            ].join(' ')}
          >
            룰렛 돌리기!
          </button>

          {/* 서브 CTA: 보드 소개(선택—라우팅 맞춰 쓰기) */}
          <button
            onClick={() => navigate('/how-to')}
            className={[
              'sm:w-[46%] inline-flex items-center justify-center rounded-2xl px-5 py-3',
              'text-[15px] font-semibold',
              'border border-slate-200 text-slate-700 bg-white',
              'hover:bg-slate-50 active:bg-white transition-all',
            ].join(' ')}
          >
            보드 사용 방법 보기
          </button>
        </div>

        {/* 푸터 */}
        <div className="mt-6 text-center text-[12px] text-slate-400">
          안전하고 즐거운 만남을 응원해요 !<div></div>
          가입하신 분들에 한하여, 랜덤추첨으로 선물을 증정합니다!
        </div>
      </div>
    </div>
  );
}
