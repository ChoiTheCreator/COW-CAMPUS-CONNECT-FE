// src/pages/my-page.tsx
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // ★ location 훅 사용
import { getMatchesWithProfile } from '../api/api'; // ★ 타입은 api에서 가져오지 않음
import type { Profile as ProfileProps } from '../types';
import { ChevronLeftIcon, InstagramLogoIcon } from '@radix-ui/react-icons';

export function MyPage() {
  const navigate = useNavigate();
  const location = useLocation(); // ★ 전역 location 대신 훅 사용
  const searchParams = new URLSearchParams(location.search);
  const encryptedQuery = searchParams.get('studentId');

  const [studentId, setStudentId] = useState<number>();
  const [data, setData] = useState<ProfileProps[]>([]);

  // ★ 안전한 base64 decode 함수
  const safeAtob = (v: string) => {
    try {
      return atob(v);
    } catch {
      return '';
    }
  };

  useEffect(() => {
    if (encryptedQuery) {
      const decoded = safeAtob(encryptedQuery); // ★ try/catch → 헬퍼로 정리
      if (decoded) setStudentId(Number(decoded));
    }
  }, [encryptedQuery]);

  useEffect(() => {
    async function fetchData() {
      if (!studentId) return;
      const tempData = await getMatchesWithProfile(studentId); // ★ number 단독 인자
      setData(tempData);
    }
    fetchData();
  }, [studentId]);

  return (
    <div className="flex flex-col w-dvw">
      <header className="flex flex-row w-full items-center justify-between py-4 px-4 shadow-md">
        <button
          aria-label="뒤로 가기"
          onClick={() => navigate('/')}
          className="p-1 rounded-lg hover:bg-slate-100"
        >
          <ChevronLeftIcon width={24} height={24} />
        </button>
        <div className="text-xl font-semibold flex flex-col items-center justify-center">
          소개팅보드
        </div>
        <div className="w-6" />
      </header>

      <div>
        {data.map((value) => {
          return (
            <div
              key={value.user_id} // ★ key 추가
              className="flex flex-col w-full py-3 border border-[#CBD5E1] cursor-pointer"
            >
              <div className="grid grid-cols-2 px-4 pb-2">
                <div className="font-semibold text-base">{value.nickname}</div>
                <div className="font-semibold text-base text-right">
                  {(value.mbti ?? '').toUpperCase() /* ★ null-safe */}
                </div>
                <div className="font-medium text-sm text-[#64748B] pt-2 col-span-2">
                  {value.description}
                </div>
              </div>

              <div className="text-black flex flex-row px-4 pt-3 gap-3">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 hover:opacity-80"
                  onClick={() => {
                    if (!value.insta_profile) return;
                    // ★ 보안옵션 포함
                    window.open(
                      `https://www.instagram.com/${value.insta_profile}`,
                      '_blank',
                      'noopener,noreferrer'
                    );
                  }}
                >
                  <InstagramLogoIcon height={24} width={24} />@
                  {value?.insta_profile}
                </button>
              </div>
            </div>
          );
        })}

        {/* 비어있을 때 상태 메시지 (선택) */}
        {data.length === 0 && (
          <div className="p-6 text-sm text-slate-500">
            아직 확인한 인스타 프로필이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
