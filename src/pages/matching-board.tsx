import { useEffect, useState, useMemo, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getMatchesWithProfile } from '../api/api';
import type { Profile as ProfileProps } from '../types';
import { ChevronLeftIcon, InstagramLogoIcon } from '@radix-ui/react-icons';
import { toast } from 'sonner'; // (수정) 피드백 토스트

export function MyPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const encryptedQuery = searchParams.get('studentId');

  const [studentId, setStudentId] = useState<number>();
  const [data, setData] = useState<ProfileProps[]>([]);

  // (추가) 안전한 base64 decode
  const safeAtob = useCallback((v: string) => {
    try {
      return atob(v);
    } catch {
      return '';
    }
  }, []);

  // (추가) 인스타 유저네임 추출기
  const extractInsta = useCallback((raw?: string | null): string => {
    if (!raw) return '';
    const s = String(raw).trim();
    if (!s) return '';
    let u = s.replace(/^https?:\/\/(www\.)?instagram\.com\//i, '');
    u = u.replace(/^@+/, '').replace(/^\/+/, '');
    u = u.split(/[\/?#]/)[0];
    return u;
  }, []);

  // (추가) 인스타 공식스러운 그라데이션
  const igGradient = useMemo(
    () => 'bg-gradient-to-r from-[#f58529] via-[#dd2a7b] to-[#8134af]',
    []
  );

  // (추가) 인스타 새창 열기
  const openInstagram = useCallback(
    (username?: string | null) => {
      const user = extractInsta(username);
      if (!user) {
        toast('인스타 계정이 없어요', {
          description: '프로필에 등록된 인스타그램 계정을 찾지 못했어요.',
        });
        return;
      }
      const url = `https://www.instagram.com/${user}`; // ← (수정) 백틱 필수
      window.open(url, '_blank', 'noopener,noreferrer');
    },
    [extractInsta]
  );

  // studentId 복호화
  useEffect(() => {
    if (encryptedQuery) {
      const decoded = safeAtob(encryptedQuery);
      if (decoded) setStudentId(Number(decoded));
    }
  }, [encryptedQuery, safeAtob]);

  // 내 매칭 목록 불러오기
  useEffect(() => {
    async function fetchData() {
      if (!studentId) return;
      const tempData = await getMatchesWithProfile(studentId);
      setData(tempData ?? []);
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
          내가 선택한 친구
        </div>
        <div className="w-6" />
      </header>

      <div>
        {data.map((value) => {
          const ig = extractInsta(
            // (수정) 백엔드 케이스 모두 방어
            (value as any).instaProfile ?? (value as any).insta_profile
          );

          return (
            <div
              key={(value as any).user_id ?? (value as any).userId} // (수정) key 안전화
              className="flex flex-col w-full py-3 border border-[#CBD5E1]"
            >
              <div className="grid grid-cols-2 px-4 pb-2">
                <div className="font-semibold text-base">{value.nickname}</div>
                <div className="font-semibold text-base text-right">
                  {(value.mbti ?? '').toUpperCase()}
                </div>
                <div className="font-medium text-sm text-[#64748B] pt-2 col-span-2">
                  {value.description}
                </div>
              </div>

              {/* (추가) 인스타 버튼 – 클릭 시 새창 + 보안 옵션 */}
              <div className="text-black flex flex-row px-4 pt-3">
                <button
                  type="button"
                  className={[
                    'inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold text-white',
                    igGradient, // 그라데이션 적용
                    'shadow-[0_10px_24px_rgba(0,0,0,0.15)]',
                    'transition-all hover:translate-y-[-1px] active:translate-y-0',
                    'disabled:opacity-60 disabled:cursor-not-allowed',
                  ].join(' ')}
                  onClick={() => openInstagram(ig)}
                  disabled={!ig}
                  aria-label="인스타그램 프로필 열기"
                  title={ig ? `@${ig}` : '인스타그램 계정 없음'}
                >
                  <span
                    className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-white/20 backdrop-blur-sm"
                    aria-hidden
                  >
                    <InstagramLogoIcon height={14} width={14} />
                  </span>
                  <span className="truncate">@{ig || 'unavailable'}</span>
                </button>
              </div>
            </div>
          );
        })}

        {/* 빈 상태 */}
        {data.length === 0 && (
          <div className="p-6 text-sm text-slate-500">
            아직 선택/조회한 프로필이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
