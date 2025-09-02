// src/onboarding/index.tsx
import { useLocation, useNavigate } from 'react-router-dom';
import { useMemo } from 'react';

import { buildCarryQuery, toKoGender } from './utils';
import HeaderHero from './HeaderHero';
import ActionGrid from './ActionGrid';
import GuideCards from './GuideCard';
import MainCTAs from './MainCTAs';
import FooterNote from './FooterNote';

export default function Onboarding() {
  const navigate = useNavigate();
  const { search } = useLocation();

  const carry = useMemo(() => buildCarryQuery(search), [search]);

  const params = new URLSearchParams(search);
  const nickName = params.get('nickName') || '';
  const genderKo = toKoGender(params.get('gender'));

  // ✅ 고친곳: 둘 다 /dashboard 로 이동 + 쿼리 유지
  const onGoBoard = () => navigate(`/dashboard${carry}`); // 고친곳

  const onGoApply = () => {
    window.open(
      'https://ddingdong.mju.ac.kr/apply/347',
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <div className="min-h-dvh w-dvw bg-slate-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-[720px]">
        <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-100 shadow-[0_20px_60px_rgba(15,23,42,0.10)]">
          <HeaderHero nickName={nickName} genderKo={genderKo} />
          <ActionGrid onGoApply={onGoApply} />
        </div>

        <GuideCards />
        <MainCTAs onGoBoard={onGoBoard} />
        <FooterNote />
      </div>
    </div>
  );
}
