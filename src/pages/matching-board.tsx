// src/pages/matching-board.tsx
import { useEffect, useMemo, useCallback, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeftIcon, InstagramLogoIcon } from '@radix-ui/react-icons';
import { toast } from 'sonner';

// 프로젝트 기존 API 시그니처 가정 (이전 대화 기준)
import { getAllProfile, matchingUpdate } from '../api/api';
import type { Profile as ProfileProps } from '../types';

// 유틸: 안전한 atob
const safeAtob = (v?: string | null) => {
  if (!v) return '';
  try {
    return atob(v);
  } catch {
    return '';
  }
};

// 유틸: 인스타 유저네임 추출
const extractInsta = (raw?: string | null): string => {
  if (!raw) return '';
  const s = String(raw).trim();
  if (!s) return '';
  let u = s.replace(/^https?:\/\/(www\.)?instagram\.com\//i, '');
  u = u.replace(/^@+/, '').replace(/^\/+/, '');
  u = u.split(/[\/?#]/)[0];
  return u;
};

// 유틸: 간단 throttle
function throttle<F extends (...args: any[]) => void>(fn: F, wait = 600) {
  let last = 0;
  let timer: any;
  return (...args: Parameters<F>) => {
    const now = Date.now();
    const remaining = wait - (now - last);
    if (remaining <= 0) {
      clearTimeout(timer);
      last = now;
      fn(...args);
    } else {
      clearTimeout(timer);
      timer = setTimeout(() => {
        last = Date.now();
        fn(...args);
      }, remaining);
    }
  };
}

export default function MatchingBoard() {
  const navigate = useNavigate();
  const location = useLocation();
  const sp = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );

  // 쿼리: Base64로 들어옴 (studentId, studentGender)
  const studentId = useMemo(
    () => Number(safeAtob(sp.get('studentId')) || 0),
    [sp]
  );
  const studentGender = useMemo(
    () => safeAtob(sp.get('studentGender')) || '',
    [sp]
  );
  // 보드가 보여줄 대상 성별: 보통 "내 성별 반대" 목록을 보여주므로
  const targetGender = useMemo(() => {
    if (studentGender === 'male') return 'female';
    if (studentGender === 'female') return 'male';
    return ''; // 모르면 전체
  }, [studentGender]);

  // UI 상태
  const [loading, setLoading] = useState(false);
  const [profiles, setProfiles] = useState<ProfileProps[]>([]);

  // 인스타 버튼
  const igGradient =
    'bg-gradient-to-r from-[#f58529] via-[#dd2a7b] to-[#8134af]';
  const openInstagram = useCallback((username?: string | null) => {
    const user = extractInsta(username);
    if (!user) {
      toast('인스타 계정이 없어요', {
        description: '프로필에 등록된 인스타그램 계정을 찾지 못했어요.',
      });
      return;
    }
    const url = `https://www.instagram.com/${user}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }, []);

  // 목록 불러오기
  const fetchProfiles = useCallback(async () => {
    setLoading(true);
    try {
      // getAllProfile의 시그니처가 (gender?: 'male'|'female') 였던 흐름
      const list = await getAllProfile(targetGender || undefined);
      setProfiles(Array.isArray(list) ? list : []);
    } catch (e: any) {
      toast.error('목록을 불러오지 못했습니다.', {
        description: e?.message || String(e),
      });
    } finally {
      setLoading(false);
    }
  }, [targetGender]);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  // 매칭 처리
  const onPick = useCallback(
    throttle(async (targetUserId: number) => {
      if (!studentId) {
        toast.error('학생 정보가 없습니다.');
        return;
      }
      try {
        await matchingUpdate({
          studentId, // 나(선택자)
          targetUserId, // 상대(선택 대상)
        });
        toast.success('선택 완료!', {
          description: '마이페이지에서 확인할 수 있어요.',
        });
      } catch (e: any) {
        toast.error('선택에 실패했어요.', {
          description: e?.message || String(e),
        });
      }
    }, 800),
    [studentId]
  );

  return (
    <div className="flex flex-col w-dvw min-h-dvh">
      {/* 헤더 */}
      <header className="flex flex-row w-full items-center justify-between py-4 px-4 shadow-md bg-white sticky top-0">
        <button
          aria-label="뒤로 가기"
          onClick={() => navigate('/')}
          className="p-1 rounded-lg hover:bg-slate-100"
        >
          <ChevronLeftIcon width={24} height={24} />
        </button>
        <div className="text-lg sm:text-xl font-semibold">소개팅 보드</div>
        <div className="text-xs text-slate-500 w-28 text-right truncate">
          {studentId ? `ID: ${studentId}` : ''}
        </div>
      </header>

      {/* 서브헤더 */}
      <div className="px-4 py-3 text-sm text-slate-600">
        {targetGender
          ? `현재 ${
              targetGender === 'female' ? '여학생' : '남학생'
            } 리스트를 보고 있어요.`
          : '전체 리스트를 보고 있어요.'}
      </div>

      {/* 목록 */}
      <div className="flex-1">
        {loading && (
          <div className="px-4 py-8 text-slate-500 text-sm">불러오는 중…</div>
        )}

        {!loading && profiles.length === 0 && (
          <div className="px-4 py-8 text-slate-500 text-sm">
            표시할 프로필이 없습니다.
          </div>
        )}

        {!loading &&
          profiles.map((p: any) => {
            const ig = extractInsta(p.instaProfile ?? p.insta_profile);
            const key = p.user_id ?? p.userId ?? p.id;

            return (
              <div
                key={key}
                className="mx-4 my-3 rounded-xl border border-slate-200 p-4 shadow-sm bg-white"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="font-semibold text-base">{p.nickname}</div>
                    <div className="text-sm text-slate-500 mt-0.5">
                      {(p.mbti ?? '').toUpperCase()}
                    </div>
                    <div className="text-sm text-slate-700 mt-2 whitespace-pre-wrap break-words">
                      {p.description}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 shrink-0">
                    {/* 인스타 */}
                    <button
                      type="button"
                      onClick={() => openInstagram(ig)}
                      disabled={!ig}
                      className={[
                        'inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-xs font-semibold text-white',
                        igGradient,
                        'shadow-[0_10px_24px_rgba(0,0,0,0.15)]',
                        'transition-all hover:translate-y-[-1px] active:translate-y-0',
                        'disabled:opacity-60 disabled:cursor-not-allowed',
                      ].join(' ')}
                      title={ig ? `@${ig}` : '인스타그램 계정 없음'}
                    >
                      <InstagramLogoIcon height={14} width={14} />
                      <span className="truncate">@{ig || 'unavailable'}</span>
                    </button>

                    {/* 선택 버튼 */}
                    <button
                      type="button"
                      onClick={() => onPick(p.user_id ?? p.userId ?? p.id)}
                      className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold hover:bg-slate-50 active:bg-slate-100"
                    >
                      선택하기
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      {/* 하단 내역 바로가기 */}
      <footer className="sticky bottom-0 bg-white border-t border-slate-200">
        <div className="p-3">
          <button
            onClick={() =>
              navigate(`/myPage?studentId=${btoa(String(studentId || ''))}`)
            }
            className="w-full rounded-xl bg-black text-white py-3 font-semibold hover:opacity-90"
          >
            내가 선택한 친구 보기
          </button>
        </div>
      </footer>
    </div>
  );
}
