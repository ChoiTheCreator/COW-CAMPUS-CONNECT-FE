import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useMemo } from 'react';

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

  const onGoBoard = () => navigate(`/matching-board${carry}`);
  const onGoMine = () => navigate(`/my-page${carry}`);
  const onGoApply = () => {
    // 내부 경로가 있다면 navigate('/apply') 로 교체
    window.open(
      'https://ddingdong.mju.ac.kr/apply/347',
      '_blank',
      'noopener,noreferrer'
    );
  };

  useEffect(() => {
    console.log(carry);
  }, []);

  return (
    <div className="min-h-dvh w-dvw bg-slate-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-[720px]">
        {/* 헤더 카드 */}
        <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-100 shadow-[0_20px_60px_rgba(15,23,42,0.10)]">
          <HeaderHero nickName={nickName} genderKo={genderKo} />
          <ActionGrid
            onGoBoard={onGoBoard}
            onGoMine={onGoMine}
            onGoApply={onGoApply}
          />
        </div>

        <GuideCards />
        <MainCTAs onGoBoard={onGoBoard} onGoMine={onGoMine} />
        <FooterNote />
      </div>
    </div>
  );
}
