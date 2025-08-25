// src/pages/matching-board.tsx
import { ChevronLeftIcon, InstagramLogoIcon } from '@radix-ui/react-icons';
import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAllProfile, matchingUpdate } from '../api/api';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../components/ui/dialog';
import { throttle } from '../lib/utils';
import { toast } from 'sonner';

/** 인스타 계정 추출(유저명만): 링크/공백/@ 포함해도 안전하게 처리 */
const extractInsta = (raw?: string | null): string => {
  if (!raw) return '';
  const s = String(raw).trim();
  if (!s) return '';
  // URL 형태면 도메인 제거
  let u = s.replace(/^https?:\/\/(www\.)?instagram\.com\//i, '');
  // 앞의 @, / 제거
  u = u.replace(/^@+/, '').replace(/^\/+/, '');
  // 쿼리, 슬래시 등 이후 잘라내기
  u = u.split(/[\/?#]/)[0];
  return u;
};

/** 인스타 공식 그라데이션 팔레트 (배지/버튼 공통) */
const igGradient = 'bg-gradient-to-r from-[#f58529] via-[#dd2a7b] to-[#8134af]';

/** 인스타 그라데이션 버튼 (모달 내부용) */
const InstaButton: React.FC<{
  username?: string | null;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}> = ({ username, onClick, disabled, className }) => {
  const label = username ? `@${username}` : '인스타 열기';
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={[
        // 크기/타이포
        'inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-[14px] font-semibold text-white',
        // 그라데이션 + 그림자
        igGradient,
        'shadow-[0_14px_30px_rgba(0,0,0,0.18)]',
        // 상호작용
        'transition-all hover:translate-y-[-2px] hover:shadow-[0_18px_36px_rgba(0,0,0,0.22)] active:translate-y-0',
        // 접근성
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#dd2a7b]',
        // 비활성
        'disabled:opacity-60 disabled:cursor-not-allowed',
        className || '',
      ].join(' ')}
      aria-label="인스타그램 프로필 열기"
      title={label}
    >
      <span
        className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-white/20 backdrop-blur-sm"
        aria-hidden
      >
        <InstagramLogoIcon width={14} height={14} />
      </span>
      <span className="max-w-[180px] truncate">{label}</span>
    </button>
  );
};

/** 서버 응답이 camelCase/snake_case 어느 쪽이든 들어와도 프론트에서 camelCase로 통일 */
export type ProfileNormalized = {
  userId: number;
  nickname: string;
  mbti: string;
  description?: string | null;
  instaProfile?: string | null;
  createdAt?: string;
  checkInsta: boolean;
};

type ProfileWithCheckInsta = ProfileNormalized;

const PAGE_SIZE = 10;

export default function MatchingBoard() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const encryptedQuery = searchParams.get('studentId');
  const genderQuery = searchParams.get('studentGender');

  const [data, setData] = useState<ProfileWithCheckInsta[]>([]);
  const [offset, setOffset] = useState(0);
  const [userGender, setUserGender] = useState<string>(''); // 'male' | 'female'
  const [studentId, setStudentId] = useState<number>(0);
  const [selectedProfile, setSelectedProfile] =
    useState<ProfileWithCheckInsta | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const observer = useRef<IntersectionObserver | null>(null);

  const safeAtob = (v: string) => {
    try {
      return atob(v);
    } catch {
      return '';
    }
  };

  useEffect(() => {
    if (encryptedQuery && genderQuery) {
      const sid = safeAtob(encryptedQuery);
      const g = safeAtob(genderQuery) as 'male' | 'female' | '';
      if (sid) setStudentId(Number(sid));
      if (g) setUserGender(g);
    }
  }, [encryptedQuery, genderQuery]);

  // 로컬스토리지로 이미 열람한 인스타 표시
  const getCheckedProfiles = () => {
    return JSON.parse(
      localStorage.getItem('checkedProfiles') || '[]'
    ) as number[];
  };
  const saveCheckedProfile = (userId: number) => {
    const checked = getCheckedProfiles();
    if (!checked.includes(userId)) {
      localStorage.setItem(
        'checkedProfiles',
        JSON.stringify([...checked, userId])
      );
    }
  };

  const fetchData = useCallback(async () => {
    if (!userGender || isFetching || !hasMore) return;
    setIsFetching(true);
    setFetchError(null);
    try {
      const targetGender = userGender === 'male' ? 'female' : 'male';

      // 서버: offset/limit/studentGender 사용
      const requestData = await getAllProfile({
        offset,
        limit: PAGE_SIZE,
        studentGender: targetGender,
      });

      const checked = getCheckedProfiles();
      const normalized: ProfileWithCheckInsta[] = (requestData || []).map(
        (p: any) => {
          const userId = p.userId ?? p.user_id; // 둘 중 하나 존재
          return {
            userId,
            nickname: p.nickname,
            mbti: p.mbti,
            description: p.description ?? null,
            instaProfile: p.instaProfile ?? p.insta_profile ?? null,
            createdAt: p.createdAt ?? p.created_at,
            checkInsta: checked.includes(userId),
          };
        }
      );

      setData((prev) => [...prev, ...normalized]);
      if (!requestData || requestData.length < PAGE_SIZE) setHasMore(false);
    } catch (error: any) {
      console.error(error);
      setFetchError(error?.message ?? '데이터를 불러오지 못했습니다.');
    } finally {
      setIsFetching(false);
    }
  }, [userGender, offset, hasMore, isFetching]);

  useEffect(() => {
    if (userGender) fetchData();
  }, [fetchData, userGender]);

  const handleIntersection = useMemo(
    () =>
      throttle((entries: IntersectionObserverEntry[]) => {
        if (entries[0].isIntersecting && !isFetching && hasMore) {
          setOffset((prev) => prev + PAGE_SIZE);
        }
      }, 1200),
    [isFetching, hasMore]
  );

  const lastElementRef = useCallback(
    (node: HTMLButtonElement | null) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(handleIntersection);
      if (node) observer.current.observe(node);
    },
    [handleIntersection]
  );

  const handleOpenInsta = (username?: string | null) => {
    const user = extractInsta(username);
    if (!user) {
      toast('인스타 계정이 없어요', {
        description: '프로필에 등록된 인스타그램 계정을 찾지 못했어요.',
      });
      return;
    }
    const url = `https://www.instagram.com/${user}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleClickInsta = async (p: ProfileWithCheckInsta) => {
    // 1) 바로 인스타 이동
    const user = extractInsta(p.instaProfile);
    handleOpenInsta(user);

    // 2) (선택) 열람 기록 남기기 – 실패해도 사용자 흐름 막지 않음
    try {
      if (studentId && p.userId) {
        void matchingUpdate({ userId: studentId, targetId: p.userId });
      }
      saveCheckedProfile(p.userId);
      setSelectedProfile((prev) =>
        prev ? { ...prev, checkInsta: true } : prev
      );
    } catch (e) {
      console.warn('열람 기록 저장 실패', e);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-10 flex w-full items-center justify-between py-3 px-4 border-b bg-white/80 backdrop-blur">
        <button
          className="p-2 rounded-xl hover:bg-slate-100 transition"
          aria-label="뒤로 가기"
          onClick={() => navigate('/')}
        >
          <ChevronLeftIcon width={22} height={22} />
        </button>
        <div className="text-lg font-semibold text-slate-900">
          소개팅보드
          <div className="text-[11px] text-slate-500 font-normal">
            {userGender === 'male'
              ? '여자 사용자의 프로필입니다.'
              : '남자 사용자의 프로필입니다.'}
          </div>
        </div>
        <div className="w-[22px]" />
      </header>

      {/* Content */}
      <section className="flex-1">
        {/* 에러 상태 */}
        {fetchError && data.length === 0 && (
          <div className="p-6 text-sm text-red-600">{fetchError}</div>
        )}

        {/* 빈 상태 */}
        {!fetchError && !isFetching && data.length === 0 && (
          <div className="p-6 text-sm text-slate-500">
            표시할 프로필이 없습니다.
          </div>
        )}

        {/* 리스트 */}
        <div className="divide-y">
          {data.map((value, idx) => {
            const isLast = idx === data.length - 1;
            const ig = extractInsta(value.instaProfile);
            return (
              <Dialog key={value.userId}>
                <DialogTrigger asChild>
                  <button
                    ref={isLast ? lastElementRef : null}
                    className="w-full text-left bg-white hover:bg-slate-50 active:bg-slate-100 transition cursor-pointer"
                    onClick={() => setSelectedProfile(value)}
                  >
                    <div className="flex flex-col gap-2 p-4">
                      <div className="flex items-center justify-between">
                        <div className="font-semibold text-[15px] text-slate-900">
                          {value.nickname}
                        </div>

                        <div className="flex items-center gap-1">
                          {/* MBTI */}
                          <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium text-blue-600 border-blue-200 bg-blue-50">
                            {value.mbti?.toUpperCase()}
                          </span>
                          {/* IG 배지 — 인스타 그라데이션 */}
                          {ig ? (
                            <span
                              className={`ml-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium text-white/95 ${igGradient} shadow-sm`}
                            >
                              <InstagramLogoIcon width={12} height={12} />
                              IG
                            </span>
                          ) : null}
                        </div>
                      </div>

                      <p className="text-[13px] text-slate-600 line-clamp-2">
                        {value.description}
                      </p>
                    </div>
                  </button>
                </DialogTrigger>

                {/* 모달 */}
                <DialogContent className="w-[92vw] max-w-[420px] rounded-2xl p-5 sm:p-6">
                  <DialogHeader className="items-center text-center">
                    <DialogTitle className="text-lg font-semibold text-slate-900">
                      {selectedProfile?.nickname}
                    </DialogTitle>
                    <div className="mt-2 inline-flex items-center gap-2">
                      <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium text-blue-600 border-blue-200 bg-blue-50">
                        {selectedProfile?.mbti?.toUpperCase()}
                      </span>
                    </div>
                    {selectedProfile?.description ? (
                      <DialogDescription className="mt-3 text-[13px] text-slate-700 whitespace-pre-wrap">
                        {selectedProfile.description}
                      </DialogDescription>
                    ) : null}
                  </DialogHeader>

                  <DialogFooter className="mt-6 flex justify-center">
                    <InstaButton
                      username={extractInsta(selectedProfile?.instaProfile)}
                      onClick={() =>
                        selectedProfile && handleClickInsta(selectedProfile)
                      }
                      disabled={!extractInsta(selectedProfile?.instaProfile)}
                      className="mx-auto"
                    />
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            );
          })}

          {/* 스켈레톤 (로딩 중) */}
          {isFetching && (
            <div className="p-4 space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 w-28 bg-slate-200 rounded mb-2" />
                  <div className="h-3 w-full bg-slate-200 rounded" />
                </div>
              ))}
            </div>
          )}

          {/* 더 없음 표시 */}
          {!hasMore && data.length > 0 && (
            <div className="py-6 text-center text-[12px] text-slate-400">
              더 이상 불러올 프로필이 없습니다.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
