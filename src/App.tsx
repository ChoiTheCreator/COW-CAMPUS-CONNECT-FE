import { useNavigate } from "react-router-dom";
import CowSvg from "./assets/cow-logo.svg?react";

function App() {
  const navigate = useNavigate();
  return (
    <div className='px-4 py-6 w-dvw h-dvh lg:items-center md:justify-center flex flex-col gap-1 font-sans'>
      <CowSvg className='fill-black' />
      <h1 className=' font-semibold text-3xl'>COW 5기 모집중 🔍</h1>
      <div className=' text-lg font-semibold'>
        우리와 함께 더 나은 명지를 <br />
        만들어갈 인재를 기다립니다.
      </div>
      <div className=' font-semibold'>2025.03.04 ~ 2025.03.12</div>
      <section className=' pt-5 flex flex-col items-center gap-6'>
        <button
          onClick={() => {
            navigate("/login?role=dashboard");
          }}
          className=' w-64 flex items-center justify-center py-5 font-bold text-2xl shadow-xl rounded-2xl'
        >
          다른 사람 카드 보러가기
        </button>
        <button
          onClick={() => {
            navigate("/login?role=myPage");
          }}
          className=' w-64 flex items-center justify-center py-5 font-bold text-2xl shadow-xl rounded-2xl'
        >
          내가 뽑은 사람 확인하기
        </button>
        <button
          onClick={() => {
            window.open("https://ddingdong.mju.ac.kr/club/91");
          }}
          className=' w-64 flex items-center justify-center py-5 font-bold text-2xl shadow-xl rounded-2xl'
        >
          COW 지원하기
        </button>
        <button
          onClick={() => {
            window.open("https://www.instagram.com/mju_cow/");
          }}
          className='w-64 flex items-center justify-center py-5 font-bold text-2xl shadow-xl rounded-2xl'
        >
          COW 인스타그램
        </button>
      </section>
    </div>
  );
}

export default App;
