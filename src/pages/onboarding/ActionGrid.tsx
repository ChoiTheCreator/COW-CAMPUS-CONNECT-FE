// src/onboarding/ActionGrid.tsx
import { PersonIcon, HeartIcon, RocketIcon } from '@radix-ui/react-icons';
import ActionCard from './ActionCard';

type Props = {
  onGoApply: () => void;
};

export default function ActionGrid({ onGoApply }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
      {/* 1) 단순 박스 (클릭 불가) */}
      <div className="p-6 flex items-start gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
          <PersonIcon width={20} height={20} />
        </div>
        <div>
          <div className="font-semibold text-slate-900">
            다른사람 카드 보러가기
          </div>
          <div className="text-[12px] text-slate-500">
            닉네임·MBTI·한 줄 소개 확인
          </div>
        </div>
      </div>

      {/* 2) 단순 박스 (클릭 불가) */}
      <div className="p-6 flex items-start gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-rose-50 text-rose-600">
          <HeartIcon width={20} height={20} />
        </div>
        <div>
          <div className="font-semibold text-slate-900">
            내가 뽑은 사람 확인하기
          </div>
          <div className="text-[12px] text-slate-500">
            열람 기록 기반으로 빠르게 재방문
          </div>
        </div>
      </div>

      {/* 3) 버튼 유지 (지원하러가기) */}
      <ActionCard
        onClick={onGoApply}
        title="COW 지원하고 함께 만들기"
        description="동아리 합류해서 제품·서비스를 같이 키워요"
        icon={
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
            <RocketIcon width={20} height={20} />
          </div>
        }
      />
    </div>
  );
}
