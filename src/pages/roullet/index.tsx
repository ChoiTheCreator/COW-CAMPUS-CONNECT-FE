import { useEffect, useMemo, useState } from 'react';
import { ChevronLeftIcon } from '@radix-ui/react-icons';
import { useNavigate } from 'react-router-dom';

type PrizeKey = 'capri' | 'snack' | 'baemin' | 'lose';

type Prize = {
  key: PrizeKey;
  label: string;
  weight: number; // 기본 확률 가중치 (합 100)
  limited?: boolean; // 재고 제한 여부
  stock?: number; // 총 수량
};

const LS_KEYS = {
  capri: 'roulette_stock_capri', // 초기 20
  baemin: 'roulette_stock_baemin', // 초기 3
  spun: 'roulette_spun', // (선택) 1회 제한에 쓰고 싶을 때
};

const BASE_PRIZES: Prize[] = [
  { key: 'capri', label: '카프리선', weight: 10, limited: true, stock: 20 },
  { key: 'snack', label: '간식(초콜릿)', weight: 65 },
  {
    key: 'baemin',
    label: '배달의민족 1만원',
    weight: 3,
    limited: true,
    stock: 3,
  },
  { key: 'lose', label: '꽝', weight: 22 },
];

export default function RoulettePage() {
  const navigate = useNavigate();

  // 로컬 재고 상태 초기화(최초 진입 시 1회)
  useEffect(() => {
    if (localStorage.getItem(LS_KEYS.capri) == null) {
      localStorage.setItem(LS_KEYS.capri, String(20));
    }
    if (localStorage.getItem(LS_KEYS.baemin) == null) {
      localStorage.setItem(LS_KEYS.baemin, String(3));
    }
  }, []);

  // 현재 재고 조회
  const capriLeft = Number(localStorage.getItem(LS_KEYS.capri) ?? '0');
  const baeminLeft = Number(localStorage.getItem(LS_KEYS.baemin) ?? '0');

  // 재고를 반영한 현재 추첨 테이블(가중치 재분배용)
  const prizes = useMemo(() => {
    return BASE_PRIZES.map((p) => {
      if (p.key === 'capri' && p.limited) {
        return { ...p, weight: capriLeft > 0 ? p.weight : 0 };
      }
      if (p.key === 'baemin' && p.limited) {
        return { ...p, weight: baeminLeft > 0 ? p.weight : 0 };
      }
      return p;
    });
  }, [capriLeft, baeminLeft]);

  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<Prize | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 가중치 랜덤 선택 (0 가중치는 제외)
  const draw = (): Prize => {
    const available = prizes.filter((p) => p.weight > 0);
    const pool = available.length ? available : BASE_PRIZES;
    const total = pool.reduce((s, p) => s + p.weight, 0);
    let r = Math.random() * total;
    for (const p of pool) {
      if (r < p.weight) return p;
      r -= p.weight;
    }
    return pool[pool.length - 1];
  };

  const handleSpin = async () => {
    setError(null);
    setResult(null);
    setSpinning(true);

    // (선택) 1회 제한
    // if (localStorage.getItem(LS_KEYS.spun) === '1') {
    //   setError('이미 참여하셨습니다.');
    //   setSpinning(false);
    //   return;
    // }

    // 간단한 연출(실제 휠 UI 없이)
    await new Promise((res) => setTimeout(res, 900));

    let picked = draw();

    // 당첨 후 재고 차감 로직
    if (picked.key === 'capri') {
      if (capriLeft > 0) {
        localStorage.setItem(LS_KEYS.capri, String(capriLeft - 1));
      } else {
        picked = BASE_PRIZES.find((p) => p.key === 'lose')!;
      }
    } else if (picked.key === 'baemin') {
      if (baeminLeft > 0) {
        localStorage.setItem(LS_KEYS.baemin, String(baeminLeft - 1));
      } else {
        picked = BASE_PRIZES.find((p) => p.key === 'lose')!;
      }
    }

    // localStorage.setItem(LS_KEYS.spun, '1');

    setResult(picked);
    setSpinning(false);
  };

  // 결과 메시지
  const msg = useMemo(() => {
    if (!result) return '';
    switch (result.key) {
      case 'capri':
        return '축하합니다! 카프리선 당첨 🎉';
      case 'snack':
        return '축하합니다! 간식(초콜릿) 당첨 🎉';
      case 'baemin':
        return '축하합니다! 배달의민족 1만원권 당첨 🎉';
      default:
        return '아쉽지만 꽝… 다음 기회에!';
    }
  }, [result]);

  return (
    <div className="min-h-dvh w-dvw bg-[radial-gradient(1200px_800px_at_20%_-10%,#f1f5f9_0%,transparent_60%),radial-gradient(1200px_800px_at_120%_10%,#e0f2fe_0%,transparent_55%)]">
      <main className="px-4 sm:px-6 py-4 sm:py-6 min-h-dvh flex items-start sm:items-center justify-center">
        <div
          className="w-full max-w-[560px] rounded-3xl bg-white/80 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-black/5 p-4 sm:p-6 md:p-8"
          style={{
            // iOS 홈바 영역 고려
            paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 16px)',
          }}
        >
          {/* 헤더 */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg hover:bg-slate-100 active:scale-[0.99] transition"
              aria-label="뒤로 가기"
            >
              <ChevronLeftIcon width={22} height={22} />
            </button>
            <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-slate-900">
              COW 룰렛 이벤트
            </h1>
            <div className="w-6" />
          </div>

          <p className="mt-2 text-xs sm:text-sm text-slate-600">
            카프리선(10%, 선착순 20개) · 간식(65%) · 배민 1만원권(3장, 3%) ·
            나머지 꽝(22%)
          </p>

          {/* 재고 표시 (모바일: 1열, 태블릿↑: 2열) */}
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-700">
            <div className="rounded-xl border border-slate-200 bg-white p-3">
              <div className="font-medium">카프리선 잔여</div>
              <div className="mt-0.5 text-xl sm:text-2xl font-semibold tabular-nums">
                {capriLeft}
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-3">
              <div className="font-medium">배민 1만원권 잔여</div>
              <div className="mt-0.5 text-xl sm:text-2xl font-semibold tabular-nums">
                {baeminLeft}
              </div>
            </div>
          </div>

          {/* 결과 원 - 뷰포트 기준으로 자동 축소/확대 */}
          <div className="mt-6 grid place-items-center">
            {/* CSS 변수로 크기 제어: 모바일에서 82vw, 최대 420px */}
            <div
              className="rounded-full border-4 border-slate-200 grid place-items-center"
              style={{
                // clamp(min, preferred, max)
                // 모바일에서 가로폭의 82%를 기본으로, 최소 220px, 최대 420px
                width: 'clamp(220px, 82vw, 420px)',
                height: 'clamp(220px, 82vw, 420px)',
              }}
            >
              <div className="text-center px-3">
                <div className="text-[11px] sm:text-xs text-slate-500">
                  결과
                </div>
                <div className="mt-1 text-base sm:text-lg font-semibold text-slate-900">
                  {result ? result.label : '—'}
                </div>
              </div>
            </div>
          </div>

          {/* 버튼들 - 모바일에서는 가로 꽉 채움 */}
          <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-3">
            <button
              onClick={handleSpin}
              disabled={spinning}
              className="h-12 w-full sm:w-auto sm:px-6 rounded-2xl font-bold text-white bg-slate-900 disabled:opacity-60
                         shadow-[0_8px_20px_rgba(15,23,42,0.18)] active:scale-[0.99] transition"
            >
              {spinning ? '돌리는 중…' : '룰렛 돌리기'}
            </button>
            <button
              onClick={() => navigate('/')}
              className="h-12 w-full sm:w-auto sm:px-6 rounded-2xl font-bold bg-white text-slate-900 border border-slate-200
                         hover:bg-slate-50 active:scale-[0.99] transition"
            >
              메인으로
            </button>
          </div>

          {/* 메시지 */}
          {error && (
            <p className="mt-4 text-center text-sm text-rose-600">{error}</p>
          )}
          {result && !error && (
            <p className="mt-4 text-center text-sm sm:text-base font-medium text-slate-800">
              {msg}
            </p>
          )}

          <p className="mt-6 text-center text-[11px] sm:text-xs text-slate-500">
            ※ 현재 재고 관리와 추첨은 클라이언트에서 임시로 처리합니다. 운영
            환경에서는 서버에서 추첨/재고 차감을 수행해야 공정성이 보장됩니다.
          </p>
        </div>
      </main>
    </div>
  );
}
