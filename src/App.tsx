import { useNavigate } from 'react-router-dom';
import CowSvg from './assets/cow-logo.svg?react';

function App() {
  const navigate = useNavigate();

  return (
    <div className="min-h-dvh w-dvw bg-[radial-gradient(1200px_800px_at_20%_-10%,#f1f5f9_0%,transparent_60%),radial-gradient(1200px_800px_at_120%_10%,#e0f2fe_0%,transparent_55%)]">
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(8px)} to { opacity: 1; transform: translateY(0)} }
        .fade-up { animation: fadeUp .6s cubic-bezier(.22,1,.36,1) both }
        .fade-up-delay-1 { animation-delay: .06s }
        .fade-up-delay-2 { animation-delay: .12s }
        .fade-up-delay-3 { animation-delay: .18s }
        .fade-up-delay-4 { animation-delay: .24s }
        .fade-up-delay-5 { animation-delay: .30s }
      `}</style>

      <main className="px-6 py-8 min-h-dvh flex items-start lg:items-center justify-center">
        <div className="fade-up max-w-[680px] w-full rounded-3xl bg-white/70 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-black/5 p-6 md:p-10">
          <div className="fade-up fade-up-delay-1 flex items-center gap-3 mb-4">
            <CowSvg className="h-9 w-9 shrink-0 transition-transform will-change-transform hover:-translate-y-0.5" />
            <div className="text-sm font-medium text-slate-500">
              COW — 명지대 개발 동아리
            </div>
          </div>

          <h1 className="fade-up fade-up-delay-2 text-4xl md:text-5xl font-semibold tracking-tight leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
              COW 6기 모집중
            </span>{' '}
            <span className="align-middle">🔍</span>
          </h1>

          <p className="fade-up fade-up-delay-3 mt-4 text-lg md:text-xl text-slate-700 leading-relaxed">
            우리와 함께 더 나은 명지를
            <br className="hidden md:block" />
            만들어갈 인재를 기다립니다.
          </p>

          <div className="fade-up fade-up-delay-3 mt-3 text-slate-600 font-medium">
            2025.08.24 ~ 2025.09.06
          </div>

          <section className="fade-up fade-up-delay-4 pt-8 md:pt-10 flex flex-col items-center gap-4 md:gap-5">
            <button
              onClick={() => navigate('/signup')}
              className="w-72 md:w-80 h-14 rounded-2xl font-bold text-lg md:text-xl bg-slate-900 text-white
                         shadow-[0_8px_20px_rgba(15,23,42,0.15)] transition-all
                         hover:shadow-[0_12px_24px_rgba(15,23,42,0.18)] hover:-translate-y-0.5 active:translate-y-0
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-900"
              aria-label="회원가입"
            >
              회원가입
            </button>

            <button
              onClick={() => navigate('/login?role=dashboard')}
              className="w-72 md:w-80 h-14 rounded-2xl font-bold text-lg md:text-xl bg-white text-slate-900
                         shadow-[0_6px_16px_rgba(0,0,0,0.08)] border border-slate-200 transition-all
                         hover:-translate-y-0.5 hover:shadow-[0_10px_22px_rgba(0,0,0,0.10)] active:translate-y-0
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-900"
            >
              다른 사람 카드 보러가기
            </button>

            <button
              onClick={() => navigate('/login?role=myPage')}
              className="w-72 md:w-80 h-14 rounded-2xl font-bold text-lg md:text-xl bg-white text-slate-900
                         shadow-[0_6px_16px_rgba(0,0,0,0.08)] border border-slate-200 transition-all
                         hover:-translate-y-0.5 hover:shadow-[0_10px_22px_rgba(0,0,0,0.10)] active:translate-y-0
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-900"
            >
              내가 뽑은 사람 확인하기
            </button>

            <button
              onClick={() =>
                window.open(
                  'https://ddingdong.mju.ac.kr/club/91',
                  '_blank',
                  'noopener,noreferrer'
                )
              }
              className="w-72 md:w-80 h-14 rounded-2xl font-bold text-lg md:text-xl
                         bg-gradient-to-r from-sky-500 to-blue-600 text-white
                         shadow-[0_10px_24px_rgba(2,132,199,0.35)] transition-all
                         hover:shadow-[0_14px_28px_rgba(2,132,199,0.45)] hover:-translate-y-0.5 active:translate-y-0
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-600"
            >
              COW 지원하기
            </button>

            <button
              onClick={() =>
                window.open(
                  'https://www.instagram.com/mju_cow/',
                  '_blank',
                  'noopener,noreferrer'
                )
              }
              className="w-72 md:w-80 h-14 rounded-2xl font-bold text-lg md:text-xl bg-white text-slate-900
                         shadow-[0_6px_16px_rgba(0,0,0,0.08)] border border-slate-200 transition-all
                         hover:-translate-y-0.5 hover:shadow-[0_10px_22px_rgba(0,0,0,0.10)] active:translate-y-0
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-900"
            >
              COW 인스타그램
            </button>
          </section>

          <p className="fade-up fade-up-delay-5 mt-6 text-center text-sm text-slate-500">
            프로그램 및 일정은 상황에 따라 일부 변경될 수 있습니다.
          </p>
        </div>
      </main>
    </div>
  );
}

export default App;
