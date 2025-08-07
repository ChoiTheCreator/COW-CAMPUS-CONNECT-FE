import { useState, ChangeEvent, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Input from "../components/input";
import { signUp, signUpProfile } from "../api/api";

export function SignUpProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const studentId = Number(searchParams.get("studentId"));
  const studentName = searchParams.get("studentName");
  const gender = searchParams.get("gender");

  useEffect(() => {
    if (!studentId || !studentName || !gender) {
      navigate("/signup");
    }
  }, [studentId, studentName, gender, navigate]);

  const [form, setForm] = useState({
    nickname: "",
    mbti: "",
    instagram: "",
    description: "",
  });

  const [errors, setErrors] = useState({
    nickname: "",
    mbti: "",
    instagram: "",
  });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleNextButtonClick = async () => {
    setErrors({ nickname: "", mbti: "", instagram: "" });
    let valid = true;

    if (!form.nickname) {
      setErrors((prev) => ({ ...prev, nickname: "닉네임을 입력해주세요." }));
      valid = false;
    }

    if (form.mbti && !/^[EINSeinsTFJPtfjp]{4}$/.test(form.mbti)) {
      setErrors((prev) => ({
        ...prev,
        mbti: "올바른 MBTI 형식을 입력해주세요.",
      }));
      valid = false;
    }

    if (form.instagram && !/^[a-zA-Z0-9_.]+$/.test(form.instagram)) {
      setErrors((prev) => ({
        ...prev,
        instagram: "올바른 인스타그램 아이디를 입력해주세요.",
      }));
      valid = false;
    }

    if (!valid || !studentId || !studentName || !gender) return;

    try {
      await signUp({
        id: studentId,
        name: studentName,
        gender: gender,
      });
      await signUpProfile({
        userId: studentId,
        nickname: form.nickname,
        mbti: form.mbti,
        description: form.description,
        instaProfile: form.instagram,
      });
      navigate(`/signup/success?gender=${gender}&nickName=${form.nickname}`);
    } catch {
      console.error();
    }
  };

  return (
    <div className="h-dvh w-dvw flex flex-col items-start px-4 py-6 font-sans">
      <div className="font-semibold text-xl">회원가입</div>
      <div className="text-sm py-5">
        다른 사람에게 보여질 정보를 입력합니다.
        <br />
        자신의 개성을 보여주세요!
      </div>
      <section className="flex flex-col w-full gap-8">
        <Input
          id="nickname"
          name="nickname"
          label="닉네임"
          type="text"
          value={form.nickname}
          onChange={handleInputChange}
          error={errors.nickname}
          placeholder="닉네임을 입력해주세요"
        />
        <Input
          id="mbti"
          name="mbti"
          label="MBTI"
          type="text"
          value={form.mbti}
          onChange={handleInputChange}
          error={errors.mbti}
          placeholder="MBTI를 입력해주세요 (예: INFP)"
        />
        <Input
          id="instagram"
          name="instagram"
          label="인스타그램 계정"
          type="text"
          value={form.instagram}
          onChange={handleInputChange}
          error={errors.instagram}
          placeholder="@ 제외하고 입력해주세요"
        />
        <div className="flex flex-col text-sm gap-1.5">
          <label htmlFor="description">한줄소개</label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleInputChange}
            className="border border-[#CBD5E1] rounded-md pl-3 py-2 resize-none"
            rows={2}
            maxLength={54}
            placeholder="자신을 한 줄로 소개해주세요!"
          />
        </div>
      </section>
      <section className="flex flex-row w-full justify-between pt-10">
        <button
          className="py-2 px-4 border border-[#E2E8F0] rounded-md text-sm"
          onClick={() => navigate(-1)}
        >
          뒤로가기
        </button>
        <button
          className="py-2 px-4 bg-[#0F172A] border text-white rounded-md text-sm"
          onClick={handleNextButtonClick}
        >
          다음으로
        </button>
      </section>
    </div>
  );
}
