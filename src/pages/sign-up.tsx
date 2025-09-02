import { useState, ChangeEvent, KeyboardEvent, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getIsSignedUser } from '../api/api';
import Input from '../components/input';
import RadioSelector from '../components/ratio-selector';
import PageShell from './shell/pageshell';

export default function SignUp() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    studentId: '',
    name: '',
    gender: 'male' as 'male' | 'female',
  });
  const [errors, setErrors] = useState({ studentId: '', name: '', global: '' });
  const [loading, setLoading] = useState(false);

  // 모바일 가독성용 서브타이틀 (로그인과 톤 맞춤)
  const subtitle = useMemo(
    () => '학번·이름·성별을 입력해 가입을 시작하세요.',
    []
  );

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: '', global: '' }));
  };

  const onGender = (gender: 'male' | 'female') => {
    setForm((p) => ({ ...p, gender }));
  };

  const validate = () => {
    const sid = form.studentId.trim();
    const nm = form.name.trim();
    const next = { studentId: '', name: '', global: '' };
    let ok = true;

    if (!/^\d{8}$/.test(sid)) {
      next.studentId = sid
        ? '학번은 8자리 숫자여야 합니다.'
        : '학번을 입력해주세요.';
      ok = false;
    }
    if (!nm) {
      next.name = '이름을 입력해주세요.';
      ok = false;
    }

    setErrors(next);
    return ok;
  };

  const submit = async () => {
    if (loading) return;
    if (!validate()) return;

    setLoading(true);
    try {
      const sid = form.studentId.trim();
      const nm = form.name.trim();

      const isSigned = await getIsSignedUser(sid);
      if (isSigned) {
        setErrors((p) => ({ ...p, studentId: '이미 등록된 학번입니다.' }));
        return;
      }

      // 다음 단계로 이동 (로그인과 동일한 인코딩 톤)
      const url = `/signup/profile?studentId=${sid}&studentName=${encodeURIComponent(
        nm
      )}&gender=${form.gender}`;
      navigate(url);
    } catch {
      setErrors((p) => ({
        ...p,
        global: '처리 중 문제가 발생했습니다. 다시 시도해주세요.',
      }));
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') submit();
  };

  return (
    <PageShell>
      {/* 모바일 엔터 제출 대응 */}
      <div onKeyDown={onKeyDown} className="pb-6 md:pb-8">
        <header className="mb-6">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900">
            회원가입
          </h1>
          <p className="mt-2 text-slate-600">{subtitle}</p>
          <p className="mt-1 text-xs text-slate-500">
            학번과 이름은 공개되지 않으며, 동아리 박람회 종료 후 안전하게
            파기됩니다.
          </p>
        </header>

        {errors.global && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm">
            {errors.global}
          </div>
        )}

        <section className="space-y-6">
          <Input
            id="studentId"
            name="studentId"
            label="학번"
            type="text"
            // ⬇️ 모바일 숫자 키패드 유도 + 자동완성/대문자 방지

            value={form.studentId}
            onChange={onChange}
            error={errors.studentId}
            placeholder="학번 8자리를 입력해주세요"
          />
          <Input
            id="name"
            name="name"
            label="이름"
            type="text"
            value={form.name}
            onChange={onChange}
            error={errors.name}
            placeholder="학우님의 이름을 입력해주세요"
          />
          <div className="pt-1">
            <RadioSelector selectedGender={form.gender} onChange={onGender} />
          </div>
        </section>

        {/* 모바일 우선: 기본은 단일 열, md↑에서 2열 */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            className="h-12 w-full rounded-xl border border-slate-200 bg-white text-slate-900 text-sm font-medium
                       shadow-[0_6px_16px_rgba(0,0,0,0.06)] transition-all
                       hover:-translate-y-0.5 hover:shadow-[0_10px_22px_rgba(0,0,0,0.08)]
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-900"
            onClick={() => navigate('/')}
            disabled={loading}
          >
            뒤로가기
          </button>
          <button
            type="button"
            className="h-12 w-full rounded-xl bg-slate-900 text-white text-sm font-semibold
                       shadow-[0_10px_24px_rgba(15,23,42,0.15)] transition-all
                       hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(15,23,42,0.18)]
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-900
                       disabled:opacity-60 disabled:cursor-not-allowed"
            onClick={submit}
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? '처리 중...' : '다음으로'}
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          입력하신 정보는 행사 운영 목적에 한해 이용됩니다.
        </p>
      </div>
    </PageShell>
  );
}
