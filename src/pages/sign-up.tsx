import { useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { getIsSignedUser } from "../api/api";
import Input from "../components/input";
import RadioSelector from "../components/ratio-selector";

export default function SignUp() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    studentId: "",
    name: "",
    gender: "male" as "male" | "female",
  });

  const [errors, setErrors] = useState({
    studentId: "",
    name: "",
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenderChange = (gender: "male" | "female") => {
    setForm((prev) => ({ ...prev, gender }));
  };

  const handleSignUpButtonClick = async () => {
    setErrors({ studentId: "", name: "" });
    let valid = true;

    if (!form.studentId) {
      setErrors((prev) => ({
        ...prev,
        studentId: "학번을 입력해주세요.",
      }));
      valid = false;
    } else if (!/^\d{8}$/.test(form.studentId)) {
      setErrors((prev) => ({
        ...prev,
        studentId: "학번은 8자리 숫자여야 합니다.",
      }));
      valid = false;
    }

    if (!form.name) {
      setErrors((prev) => ({
        ...prev,
        name: "이름을 입력해주세요.",
      }));
      valid = false;
    }

    if (!valid) return;

    try {
      const isSignedUser = await getIsSignedUser(form.studentId);
      console.log(isSignedUser);
      if (isSignedUser === true) {
        setErrors((prev) => ({
          ...prev,
          studentId: "이미 등록된 학번입니다.",
        }));
      } else {
        navigate(
          `/signup/profile?studentId=${form.studentId}&studentName=${form.name}&gender=${form.gender}`
        );
      }
    } catch (error: unknown) {
      console.error(error);
      setErrors((prev) => ({
        ...prev,
        studentId: "이미 등록된 학번입니다.",
      }));
    }
  };

  return (
    <div className="h-dvh w-dvw flex flex-col items-start px-4 py-6 font-sans">
      <div className="font-semibold text-xl">회원가입</div>
      <div className="text-sm py-5">
        다른사람들에겐 학번과 이름이 보이지 않아요.
        <br />
        개인정보는 동아리박람회 직후 정보 파기 예정입니다.
      </div>
      <section className="flex flex-col w-full gap-8">
        <Input
          id="studentId"
          name="studentId"
          label="학번"
          type="text"
          value={form.studentId}
          onChange={handleInputChange}
          error={errors.studentId}
          placeholder="학번 8자리를 입력해주세요"
        />
        <Input
          id="name"
          name="name"
          label="이름"
          type="text"
          value={form.name}
          onChange={handleInputChange}
          error={errors.name}
          placeholder="학우님의 이름을 입력해주세요"
        />
        <RadioSelector
          selectedGender={form.gender}
          onChange={handleGenderChange}
        />
      </section>
      <div className="flex flex-col pt-10 w-full">
        <section className="flex flex-row w-full justify-between">
          <button
            className="py-2 px-4 border border-[#E2E8F0] rounded-md text-sm"
            onClick={() => navigate("/")}
          >
            뒤로가기
          </button>
          <button
            className="py-2 px-4 bg-[#0F172A] border text-white rounded-md text-sm"
            onClick={handleSignUpButtonClick}
          >
            다음으로
          </button>
        </section>
      </div>
    </div>
  );
}
