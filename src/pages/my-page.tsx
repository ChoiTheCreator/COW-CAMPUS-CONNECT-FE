import { useEffect, useState } from "react";
import { getMatchesWithProfile, ProfileProps } from "../api/api";
import { ChevronLeftIcon, InstagramLogoIcon } from "@radix-ui/react-icons";
import { useNavigate } from "react-router-dom";

export function MyPage() {
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const encryptedQuery = searchParams.get("studentId");
  const [studentId, setStudentId] = useState<number>();
  const [data, setData] = useState<ProfileProps[]>([]);

  useEffect(() => {
    if (encryptedQuery) {
      try {
        const studentId = atob(encryptedQuery);
        setStudentId(Number(studentId));
      } catch (error) {
        console.error("복호화 실패:", error);
      }
    }
  }, [encryptedQuery]);

  useEffect(() => {
    async function fetchData() {
      if (studentId) {
        const tempData = await getMatchesWithProfile(studentId);
        setData(tempData);
      }
    }
    fetchData();
  }, [studentId]);

  return (
    <div className=" flex flex-col w-dvw">
      <header className="flex flex-row w-full items-center justify-between py-4 px-4 shadow-md">
        <ChevronLeftIcon width={24} height={24} onClick={() => navigate("/")} />
        <div className="text-xl font-semibold flex flex-col items-center justify-center">
          소개팅보드
        </div>
        <div className="w-6"></div>
      </header>
      <div>
        {data.map((value) => {
          return (
            <div className="flex flex-col w-full py-3 border border-[#CBD5E1] cursor-pointer">
              <div className="grid grid-cols-2 px-4 pb-2">
                <div className="font-semibold text-base">{value.nickname}</div>
                <div className="font-semibold text-base text-right">
                  {value.mbti.toUpperCase()}
                </div>
                <div className="font-medium text-sm text-[#64748B] pt-2">
                  {value.description}
                </div>
              </div>
              <div className=" text-black flex flex-row px-4 pt-3 gap-3 ">
                <InstagramLogoIcon
                  onClick={() => {
                    window.open(
                      `https://www.instagram.com/${value.insta_profile}`
                    );
                  }}
                  height={24}
                  width={24}
                />
                @{value?.insta_profile}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
