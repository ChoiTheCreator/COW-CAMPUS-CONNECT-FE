import { ChevronLeftIcon, InstagramLogoIcon } from '@radix-ui/react-icons';
import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  getAllPropfile, // 서버 스펙에 맞춰 파라미터 이름 확인 필요
  matchingUpdate,
  checkNumGet,
  ProfileProps,
} from '../api/api';
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

type ProfileWithCheckInsta = ProfileProps & { checkInsta: boolean };

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
  const [checkNum, setCheckNum] = useState<number>(0);

  const [isFetching, setIsFetching] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const observer = useRef<IntersectionObserver | null>(null);

  // 안전한 atob
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

  // checkNum 주기적 갱신
  useEffect(() => {
    if (!studentId) return;
    let mounted = true;

    const pull = async () => {
      try {
        const newCheckNum = await checkNumGet({ id: studentId });
        if (mounted) setCheckNum(newCheckNum);
      } catch (e) {
        console.error('checkNum 업데이트 실패:', e);
      }
    };
    pull();
    const t = setInterval(pull, 50_000);
    return () => {
      mounted = false;
      clearInterval(t);
    };
  }, [studentId]);

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

      // ✅ 서버 스펙에 맞게 파라미터 이름/구조를 맞추세요.
      // 예시 A) offset/limit
      const requestData = await getAllPropfile({
        offset,
        limit: PAGE_SIZE,
        studentGender: targetGender,
      });

      // 예시 B) page/size (서버가 페이지 개념이면)
      // const requestData = await getAllPropfile({
      //   page: Math.floor(offset / PAGE_SIZE),
      //   size: PAGE_SIZE,
      //   studentGender: targetGender,
      // });

      const checked = getCheckedProfiles();
      const updated = (requestData || []).map((p: ProfileProps) => ({
        ...p,
        checkInsta: checked.includes(p.user_id),
      })) as ProfileWithCheckInsta[];

      setData((prev) => [...prev, ...updated]);
      if (!requestData || requestData.length < PAGE_SIZE) {
        setHasMore(false);
      }
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
    (node: HTMLDivElement | null) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(handleIntersection);
      if (node) observer.current.observe(node);
    },
    [handleIntersection]
  );

  const handleOpenInsta = (username?: string) => {
    if (!username) return;
    const url = `https://www.instagram.com/${username}`;
    window.open(url, '_blank', 'noopener,noreferrer');
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
            return (
              <Dialog key={value.user_id}>
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
                        <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium text-blue-600 border-blue-200 bg-blue-50">
                          {value.mbti?.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-[13px] text-slate-600 line-clamp-2">
                        {value.description}
                      </p>
                    </div>
                  </button>
                </DialogTrigger>

                <DialogContent className="max-w-sm p-6">
                  <DialogHeader>
                    <DialogTitle className="flex items-center justify-between gap-3">
                      <div className="text-base font-semibold">
                        {selectedProfile?.nickname}
                      </div>
                      <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium text-blue-600 border-blue-200 bg-blue-50">
                        {selectedProfile?.mbti?.toUpperCase()}
                      </span>
                    </DialogTitle>
                    <DialogDescription className="text-[13px] text-slate-700 whitespace-pre-wrap">
                      {selectedProfile?.description}
                    </DialogDescription>
                  </DialogHeader>

                  <DialogFooter className="flex justify-between items-center gap-3">
                    <div className="text-[11px] text-slate-500">
                      남은 인스타 확인 기회: {Math.max(0, 2 - checkNum)} / 2
                    </div>

                    {!selectedProfile?.checkInsta ? (
                      <button
                        onClick={async () => {
                          if (checkNum >= 2) {
                            toast('참가횟수 마감', {
                              description:
                                '인스타를 확인할 수 있는 기회를 모두 소진하였습니다.',
                              action: { label: '닫기', onClick: () => {} },
                            });
                            return;
                          }
                          if (selectedProfile?.user_id != null) {
                            try {
                              await matchingUpdate({
                                targetId: selectedProfile.user_id,
                                userId: studentId,
                              });
                              setCheckNum((prev) => prev + 1);
                              setSelectedProfile((prev) =>
                                prev ? { ...prev, checkInsta: true } : prev
                              );
                              saveCheckedProfile(selectedProfile.user_id);
                            } catch (error) {
                              console.error('매칭 업데이트 실패:', error);
                              toast.error(
                                '매칭 업데이트에 실패하였습니다. 다시 시도해주세요.'
                              );
                            }
                          }
                        }}
                        className="inline-flex items-center justify-center rounded-md bg-slate-900 text-white px-3 py-2 text-[13px] font-medium hover:bg-slate-800 active:bg-slate-900"
                      >
                        인스타 확인하기
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          handleOpenInsta(selectedProfile?.insta_profile)
                        }
                        className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-[13px] font-medium text-slate-800 hover:bg-slate-50"
                      >
                        <InstagramLogoIcon width={18} height={18} />@
                        {selectedProfile?.insta_profile}
                      </button>
                    )}
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
