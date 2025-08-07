import { ChangeEvent, useState } from "react";
import Input from "../components/input";
import { useNavigate } from "react-router-dom";
import { login } from "../api/api";

export default function Login() {
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const role = searchParams.get("role");

  const [form, setForm] = useState({
    studentId: "",
    name: "",
  });

  const [errors, setErrors] = useState({
    studentId: "",
    name: "",
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginButton = async () => {
    setErrors({ studentId: "", name: "" });
    let valid = true;

    if (form.studentId === "") {
      setErrors((prev) => ({
        ...prev,
        studentId: "학번을 입력하세요",
      }));
      valid = false;
    } else if (!/^\d{8}$/.test(form.studentId)) {
      setErrors((prev) => ({
        ...prev,
        studentId: "학번은 8자리 숫자여야 합니다.",
      }));
      valid = false;
    }
    if (form.name === "") {
      setErrors((prev) => ({
        ...prev,
        name: "이름을 입력하세요",
      }));
      valid = false;
    }

    if (!valid) return;

    try {
      const data = await login({ id: Number(form.studentId), name: form.name });
      const studentId = form.studentId;
      const studentGender = data[0].gender;

      const encryptedQuery = btoa(studentId);
      const genderQuery = btoa(studentGender);
      const url =
        role === "dashboard"
          ? `/dashboard?studentId=${encryptedQuery}&studentGender=${genderQuery}`
          : `/myPage?studentId=${encryptedQuery}`;
      navigate(url);
    } catch {
      setErrors((prev) => ({
        ...prev,
        studentId: "로그인에 실패하였습니다.",
      }));
    }
  };

  return (
    <div className="h-dvh w-dvw flex flex-col items-start px-4 py-6 font-sans">
      <div className="font-semibold text-xl">로그인</div>
      <div className="text-sm py-5">
        학번과 이름을 통해 로그인해주세요
        <br />
        로그인 후 상대 카드를 확인할 수 있습니다.
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
            onClick={handleLoginButton}
          >
            다음으로
          </button>
        </section>
      </div>
    </div>
  );
}
