// src/pages/Login.tsx
import { ChangeEvent, KeyboardEvent, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Input from '../components/input';
import { login } from '../api/api';
import PageShell from './shell/pageshell';

export default function Login() {
  const navigate = useNavigate();
  // const role = new URLSearchParams(location.search).get('role');
  const [searchParams, setSearchParams] = useSearchParams();
  const role = searchParams.get('role');
  const subtitle = useMemo(() => {
    if (role === 'dashboard') return '상대 카드를 보려면 로그인하세요.';
    if (role === 'myPage')
      return '내가 선택한 지원자 목록을 보려면 로그인하세요.';
    return '학번과 이름으로 로그인하세요.';
  }, [role]);

  const [form, setForm] = useState({ studentId: '', name: '' });
  const [errors, setErrors] = useState({ studentId: '', name: '', global: '' });
  const [loading, setLoading] = useState(false);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: '', global: '' }));
  };

  const validate = () => {
    const next = { studentId: '', name: '', global: '' };
    let ok = true;
    if (!/^\d{8}$/.test(form.studentId || '')) {
      next.studentId = form.studentId
        ? '학번은 8자리 숫자여야 합니다.'
        : '학번을 입력하세요.';
      ok = false;
    }
    if (!form.name) {
      next.name = '이름을 입력하세요.';
      ok = false;
    }
    setErrors(next);
    return ok;
  };

  const submit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const data = await login({ id: Number(form.studentId), name: form.name });
      const sid = btoa(form.studentId);
      const g = btoa(data?.[0]?.gender ?? '');
      const url =
        role === 'dashboard'
          ? `/dashboard?studentId=${sid}&studentGender=${g}`
          : `/myPage?studentId=${sid}`;
      navigate(url);
    } catch {
      setErrors((p) => ({
        ...p,
        global: '로그인에 실패했습니다. 다시 시도하세요.',
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
            로그인
          </h1>
          <p className="mt-2 text-slate-600">{subtitle}</p>
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
            placeholder="학번 8자리를 입력하세요"
          />
          <Input
            id="name"
            name="name"
            label="이름"
            type="text"
            value={form.name}
            onChange={onChange}
            error={errors.name}
            placeholder="이름을 입력하세요"
          />
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
          입력 정보는 행사 운영 목적 이외로 사용되지 않습니다.
        </p>
      </div>
    </PageShell>
  );
}
