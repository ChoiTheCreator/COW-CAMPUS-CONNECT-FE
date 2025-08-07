import { CheckCircledIcon } from "@radix-ui/react-icons";
import { useLocation, useNavigate } from "react-router-dom";
export function SignUpSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const gender = searchParams.get("gender");
  const nickName = searchParams.get("nickName");

  return (
    <div className='h-dvh w-dvw flex flex-col px-4 py-6 font-sans mt-20 '>
      <div className='flex flex-col w-full items-center justify-center  '>
        <CheckCircledIcon width={250} height={250} fill='blue' />
        <div className=' flex flex-col mt-16 gap-1 font-medium'>
          <span>닉네임: {nickName}</span>
          <span>성별: {gender === "male" ? "남자" : "여자"}</span>
          <div className=' mt-2 flex gap-1 flex-col'>
            <span className='text-pretty'>
              소개팅 보드는 다른 성별의 인원이 닉네임과 MBTI, 한줄소개가
              보여집니다.
            </span>
            <span className='text-pretty'>
              한 사람당 2명의 인스타그램을 확인할 수 있습니다.
            </span>
            <span className='text-pretty'>
              인스타그램으로 연락하시고 연애와 친구 둘 다 잡으세요!
            </span>
          </div>
        </div>
      </div>
      <button
        className='py-2 px-4 bg-[#0F172A] border text-white rounded-md text-sm mt-5'
        onClick={() => navigate("/")}
      >
        소개팅 시작하기
      </button>
    </div>
  );
}
