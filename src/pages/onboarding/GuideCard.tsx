import { igGradient } from './constants';

export default function GuideCards() {
  return (
    <div className="mt-5 grid gap-3 sm:grid-cols-3">
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="text-[12px] font-semibold text-slate-900">
          어떻게 보여요?
        </div>
        <div className="mt-1 text-[13px] text-slate-600">
          다른 성별의 <b>닉네임</b>, <b>MBTI</b>, <b>한 줄 소개</b>가 노출돼요.
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="text-[12px] font-semibold text-slate-900">
          인스타로 연결
        </div>
        <div className="mt-1 text-[13px] text-slate-600">
          카드에서{' '}
          <span
            className={`${igGradient} bg-clip-text text-transparent font-semibold`}
          >
            인스타 버튼
          </span>
          을 누르면 새 탭이 열려요.
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="text-[12px] font-semibold text-slate-900">
          매너가 최고!
        </div>
        <div className="mt-1 text-[13px] text-slate-600">
          첫 인사는 부드럽게, 상대를 존중하는 태도로 시작해요 😊
        </div>
      </div>
    </div>
  );
}
