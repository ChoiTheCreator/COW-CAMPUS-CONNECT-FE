import { useState, ChangeEvent, KeyboardEvent } from 'react';
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

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: '', global: '' }));
  };

  const onGender = (gender: 'male' | 'female') => {
    setForm((p) => ({ ...p, gender }));
  };

  const validate = () => {
    const next = { studentId: '', name: '', global: '' };
    let ok = true;
    if (!/^\d{8}$/.test(form.studentId || '')) {
      next.studentId = form.studentId
        ? '학번은 8자리 숫자여야 합니다.'
        : '학번을 입력해주세요.';
      ok = false;
    }
    if (!form.name) {
      next.name = '이름을 입력해주세요.';
      ok = false;
    }
    setErrors(next);
    return ok;
  };

  const submit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const isSigned = await getIsSignedUser(form.studentId);
      if (isSigned) {
        setErrors((p) => ({ ...p, studentId: '이미 등록된 학번입니다.' }));
        return;
      }
      navigate(
        `/signup/profile?studentId=${
          form.studentId
        }&studentName=${encodeURIComponent(form.name)}&gender=${form.gender}`
      );
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
      <div onKeyDown={onKeyDown}>
        <header className="mb-6">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900">
            회원가입
          </h1>
          <p className="mt-2 text-slate-600">
            학번과 이름은 공개되지 않습니다. 동아리 박람회 종료 후 개인정보는
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
          <div>
            <RadioSelector selectedGender={form.gender} onChange={onGender} />
          </div>
        </section>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
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
            className="h-12 w-full rounded-xl bg-slate-900 text-white text-sm font-semibold
                       shadow-[0_10px_24px_rgba(15,23,42,0.15)] transition-all
                       hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(15,23,42,0.18)]
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-900
                       disabled:opacity-60 disabled:cursor-not-allowed"
            onClick={submit}
            disabled={loading}
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
