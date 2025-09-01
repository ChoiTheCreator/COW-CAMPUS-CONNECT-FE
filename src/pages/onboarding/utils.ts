/** 안전한 atob */
export const safeAtob = (v?: string | null) => {
  if (!v) return '';
  try {
    return atob(v);
  } catch {
    return '';
  }
};

/** 현재 쿼리스트링을 그대로 다음 라우트로 넘기기 */
export const buildCarryQuery = (search: string) => {
  const entries = new URLSearchParams(search);
  const keep = new URLSearchParams();
  for (const [k, val] of entries.entries()) {
    if (val != null && val !== '') keep.set(k, val);
  }
  const qs = keep.toString();
  return qs ? `?${qs}` : '';
};

/** 성별 한글 라벨 */
export const toKoGender = (g?: string | null) =>
  g === 'male' ? '남자' : g === 'female' ? '여자' : '';
