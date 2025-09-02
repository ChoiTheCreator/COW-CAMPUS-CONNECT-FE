import {
  useState,
  ChangeEvent,
  useEffect,
  KeyboardEvent,
  useMemo,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Input from '../components/input';
import { signUp, signUpProfile } from '../api/api';

const normalizeInstagram = (raw: string) => {
  let s = raw.trim();
  if (!s) return '';
  // Strip leading @ and instagram URL parts
  s = s.replace(/^@+/, '');
  s = s.replace(/^https?:\/\/(www\.)?instagram\.com\//i, '');
  // remove trailing slash or query
  s = s.replace(/[/?#].*$/, '');
  return s;
};

const isValidMbti = (v: string) => /^[eisntfjp]{4}$/i.test(v);

export function SignUpProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const studentId = Number(searchParams.get('studentId'));
  const studentName = searchParams.get('studentName') ?? '';
  const gender = searchParams.get('gender') ?? '';

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!studentId || !studentName || !gender) {
      navigate('/signup');
    }
  }, [studentId, studentName, gender, navigate]);

  const [form, setForm] = useState({
    nickname: '',
    mbti: '',
    instagram: '',
    description: '',
  });

  const [errors, setErrors] = useState({
    nickname: '',
    mbti: '',
    instagram: '',
    global: '',
  });

  const subtitle = useMemo(
    () => '다른 사람에게 보여질 정보를 입력하세요. 당신의 개성을 드러내주세요!',
    []
  );

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Field-specific normalization
    if (name === 'mbti') {
      const upper = value
        .toUpperCase()
        .replace(/[^EINSFTJP]/gi, '')
        .slice(0, 4);
      setForm((prev) => ({ ...prev, mbti: upper }));
      if (upper && !isValidMbti(upper)) {
        setErrors((p) => ({ ...p, mbti: '올바른 MBTI 형식을 입력해주세요.' }));
      } else {
        setErrors((p) => ({ ...p, mbti: '' }));
      }
      return;
    }

    if (name === 'instagram') {
      const cleaned = normalizeInstagram(value).slice(0, 30);
      setForm((prev) => ({ ...prev, instagram: cleaned }));
      if (cleaned && !/^[a-zA-Z0-9._]+$/.test(cleaned)) {
        setErrors((p) => ({
          ...p,
          instagram: '올바른 인스타그램 아이디를 입력해주세요.',
        }));
      } else {
        setErrors((p) => ({ ...p, instagram: '' }));
      }
      return;
    }

    if (name === 'nickname') {
      const nk = value.slice(0, 20);
      setForm((prev) => ({ ...prev, nickname: nk }));
      setErrors((p) => ({ ...p, nickname: '', global: '' }));
      return;
    }

    if (name === 'description') {
      const desc = value.slice(0, 54);
      setForm((prev) => ({ ...prev, description: desc }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const next = { nickname: '', mbti: '', instagram: '', global: '' };
    let ok = true;

    if (!form.nickname.trim()) {
      next.nickname = '닉네임을 입력해주세요.';
      ok = false;
    }
    if (form.mbti && !isValidMbti(form.mbti)) {
      next.mbti = '올바른 MBTI 형식을 입력해주세요.';
      ok = false;
    }
    if (form.instagram && !/^[a-zA-Z0-9._]+$/.test(form.instagram)) {
      next.instagram = '올바른 인스타그램 아이디를 입력해주세요.';
      ok = false;
    }

    setErrors(next);
    return ok;
  };

  const handleSubmit = async () => {
    if (loading) return;
    setErrors((p) => ({ ...p, global: '' }));

    const ok = validate();
    if (!ok || !studentId || !studentName || !gender) return;

    try {
      setLoading(true);

      await signUp({
        id: studentId,
        name: studentName,
        gender: gender,
      });

      await signUpProfile({
        userId: studentId,
        nickname: form.nickname.trim(),
        mbti: form.mbti.trim(),
        description: form.description.trim(),
        instaProfile: form.instagram.trim(),
      });

      navigate(
        `/signup/success?gender=${encodeURIComponent(
          gender
        )}&nickName=${encodeURIComponent(form.nickname.trim())}`
      );
    } catch (e) {
      setErrors((p) => ({
        ...p,
        global: '처리 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
      }));
      // eslint-disable-next-line no-console
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="min-h-dvh w-full flex justify-center">
      <div
        className="w-full max-w-md px-4 pt-6 pb-8 sm:px-6 font-sans"
        onKeyDown={onKeyDown}
      >
        <header className="mb-6">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900">
            회원가입
          </h1>
          <p className="mt-2 text-slate-600 text-sm">{subtitle}</p>
        </header>

        {errors.global && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm">
            {errors.global}
          </div>
        )}

        <section className="space-y-6">
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
            label="MBTI "
            type="text"
            value={form.mbti}
            onChange={handleInputChange}
            error={errors.mbti}
            placeholder="예: INFP"
          />

          <Input
            id="instagram"
            name="instagram"
            label="인스타그램 계정"
            type="text"
            value={form.instagram}
            onChange={handleInputChange}
            error={errors.instagram}
            placeholder="@ 제외하고 입력해주세요 "
          />

          <div className="flex flex-col text-sm gap-1.5">
            <label htmlFor="description" className="text-slate-900">
              한줄소개
            </label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleInputChange}
              className="border border-slate-300 rounded-xl px-3 py-2 resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-900"
              rows={2}
              maxLength={54}
              placeholder="자신을 한 줄로 소개해주세요! (최대 54자)"
            />
            <div className="text-right text-xs text-slate-500">
              {form.description.length}/54
            </div>
          </div>
        </section>

        {/* 모바일 우선 버튼: 기본 1열, sm 이상에서 2열 */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            className="h-12 w-full rounded-xl border border-slate-200 bg-white text-slate-900 text-sm font-medium
                       shadow-[0_6px_16px_rgba(0,0,0,0.06)] transition-all
                       hover:-translate-y-0.5 hover:shadow-[0_10px_22px_rgba(0,0,0,0.08)]
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-900"
            onClick={() => navigate(-1)}
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
            onClick={handleSubmit}
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
    </div>
  );
}
