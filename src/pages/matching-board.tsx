import { ChevronLeftIcon, InstagramLogoIcon } from '@radix-ui/react-icons';
import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getAllPropfile,
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

export default function MatchingBoard() {
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const encryptedQuery = searchParams.get('studentId');
  const genderQuery = searchParams.get('studentGender');
  const [data, setData] = useState<ProfileWithCheckInsta[]>([]);
  const [page, setPage] = useState(0);
  const [userGender, setUserGender] = useState<string>('');
  const [studentId, setStudentId] = useState<number>(0);
  const [selectedProfile, setSelectedProfile] =
    useState<ProfileWithCheckInsta | null>(null);
  const [checkNum, setCheckNum] = useState<number>(0);

  useEffect(() => {
    if (encryptedQuery && genderQuery) {
      try {
        const studentId = atob(encryptedQuery);
        const gender = atob(genderQuery);
        setStudentId(Number(studentId));
        setUserGender(gender);
      } catch (error) {
        console.error('복호화 실패:', error);
      }
    }
  }, [encryptedQuery, genderQuery]);

  useEffect(() => {
    if (studentId) {
      checkNumGet({ id: studentId })
        .then((newCheckNum) => {
          setCheckNum(newCheckNum);
        })
        .catch((error) => console.error('checkNum 업데이트 실패:', error));

      const intervalId = setInterval(() => {
        checkNumGet({ id: studentId })
          .then((newCheckNum) => {
            setCheckNum(newCheckNum);
          })
          .catch((error) => console.error('checkNum 업데이트 실패:', error));
      }, 50000);
      return () => clearInterval(intervalId);
    }
  }, [studentId]);
  const observer = useRef<IntersectionObserver | null>(null);

  const getCheckedProfiles = () => {
    return JSON.parse(localStorage.getItem('checkedProfiles') || '[]');
  };

  const saveCheckedProfile = (userId: number) => {
    const checkedProfiles: number[] = getCheckedProfiles();
    if (!checkedProfiles.includes(userId)) {
      checkedProfiles.push(userId);
      localStorage.setItem('checkedProfiles', JSON.stringify(checkedProfiles));
    }
  };

  const fetchData = useCallback(async () => {
    try {
      const requestData = await getAllPropfile({
        startPage: page,
        endPage: page + 9,
        studentGender: userGender,
      });

      const checkedProfiles = getCheckedProfiles();
      const updatedData = requestData.map((profile) => ({
        ...profile,
        checkInsta: checkedProfiles.includes(profile.user_id),
      })) as ProfileWithCheckInsta[];

      setData((prev) => [...prev, ...updatedData]);
    } catch (error) {
      console.error(error);
    }
  }, [page, userGender]);

  useEffect(() => {
    if (userGender) {
      fetchData();
    }
  }, [fetchData, userGender]);

  const handleIntersection = useMemo(
    () =>
      throttle((entries: IntersectionObserverEntry[]) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 10);
        }
      }, 2000),
    []
  );

  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(handleIntersection);
      if (node) observer.current.observe(node);
    },
    [handleIntersection]
  );

  console.log('checkNum: ', checkNum);

  return (
    <div className="flex flex-col">
      <header className="flex flex-row w-full items-center justify-between py-4 px-4 shadow-md">
        <ChevronLeftIcon width={24} height={24} onClick={() => navigate('/')} />
        <div className="text-xl font-semibold flex flex-col items-center justify-center">
          소개팅보드
          <div className="text-[#64748B] text-xs">
            {userGender === 'male'
              ? '여자 사용자의 프로필입니다.'
              : '남자 사용자의 프로필입니다.'}
          </div>
        </div>
        <div className="w-6"></div>
      </header>

      <section>
        {data.map((value, idx) => (
          <Dialog key={idx}>
            <DialogTrigger asChild>
              <div
                ref={idx === data.length - 1 ? lastElementRef : null}
                className="flex flex-col w-full py-3 border border-[#CBD5E1] cursor-pointer"
                onClick={() => setSelectedProfile(value)}
              >
                <div className="grid grid-cols-2 px-4 pb-2">
                  <div className="font-semibold text-base">
                    {value.nickname}
                  </div>
                  <div className="font-semibold text-base text-right">
                    {value.mbti.toUpperCase()}
                  </div>
                </div>
                <div className="px-4 font-medium text-sm text-[#64748B]">
                  {value.description}
                </div>
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-sm p-7">
              <DialogHeader>
                <DialogTitle className="flex items-end gap-5">
                  <div className="text-xl font-semibold">
                    {selectedProfile?.nickname}
                  </div>
                  <div className=" text-sm font-medium text-blue-500">
                    {selectedProfile?.mbti}
                  </div>
                </DialogTitle>
                <DialogDescription className="flex">
                  {selectedProfile?.description}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex justify-end items-end">
                {!selectedProfile?.checkInsta ? (
                  <button
                    onClick={async () => {
                      if (checkNum >= 2) {
                        toast('참가횟수 마감', {
                          description:
                            '인스타를 확인할 수 있는 기회를 모두 소진하였습니다.',
                          action: {
                            label: '닫기',
                            onClick: () => console.log('Undo'),
                          },
                        });
                        return;
                      }
                      if (selectedProfile?.user_id !== undefined) {
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
                    className="border px-4 py-2 w-fit bg-[#0F172A] text-white rounded-md text-sm"
                  >
                    인스타 확인하기
                  </button>
                ) : (
                  <div className=" text-black flex flex-row items-center gap-3">
                    <InstagramLogoIcon
                      onClick={() => {
                        window.open(
                          `https://www.instagram.com/${selectedProfile.insta_profile}`
                        );
                      }}
                      height={24}
                      width={24}
                    />
                    @{selectedProfile?.insta_profile}
                  </div>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ))}
      </section>
    </div>
  );
}
