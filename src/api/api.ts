import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY!;
export const supabase = createClient(supabaseUrl, supabaseKey);

// 1) 회원 여부 확인 (테이블 select → RPC로 변경)
export const getIsSignedUser = async (userId: string) => {
  const { data, error } = await supabase.rpc('get_is_signed_user', {
    p_id: Number(userId),
  });
  if (error) throw error;
  return Boolean(data);
};

// 2) 기본 회원가입 (users insert → RPC로 변경)
export const signUp = async ({
  id,
  name,
  gender,
}: {
  id: number;
  name: string;
  gender: string;
}) => {
  const { error } = await supabase.rpc('sign_up_user', {
    p_id: id,
    p_name: name,
    p_gender: gender,
  });
  if (error) throw error;
  // RPC는 성공 시 보통 data가 없어요. 필요하면 별도 select를 호출하세요.
};

// 3) 프로필 저장/수정 (profiles upsert → RPC로 변경)
//   ⚠️ DB 테이블명이 'profiles' 인지 확인! (단수 'profile'이면 DB 함수도 거기에 맞게 만들었는지 체크)
export const signUpProfile = async ({
  userId,
  nickname,
  mbti,
  description,
  instaProfile,
}: {
  userId: number;
  nickname: string;
  mbti: string;
  description: string;
  instaProfile: string;
}) => {
  const { error } = await supabase.rpc('sign_up_profile', {
    p_user_id: userId,
    p_nickname: nickname,
    p_mbti: mbti,
    p_description: description,
    p_insta: instaProfile,
  });
  if (error) throw error;
};

// -------------------------------
// 아래부터는 RLS 때문에 막히기 쉬운 애들입니다.
// 간단히 쓰고 싶으면 “읽기 전용 정책”을 열거나,
// 안전하게 가려면 RPC를 하나씩 만들어 쓰세요.
// -------------------------------

// A) 로그인: 지금은 users를 직접 select 하니 RLS에 막힐 수 있음.
//    ✅ 추천: login_user RPC 만들어 호출
export const login = async ({ id, name }: { id: number; name: string }) => {
  const { data, error } = await supabase.rpc('login_user', {
    p_id: id,
    p_name: name,
  });
  if (error) throw error;
  return data as {
    id: number;
    name: string;
    gender: string;
    check_num: number;
  }[];
};

export interface ProfileProps {
  nickname: string;
  mbti: string;
  description: string;
  insta_profile: string;
  user_id: number;
}

// B) 프로필 목록: view('profile_with_gender') select도 RLS에 막힐 수 있음.
//    ✅ 추천: get_profiles_page RPC 만들어 호출
export const getAllPropfile = async ({
  startPage,
  endPage,
  studentGender,
}: {
  startPage: number;
  endPage: number;
  studentGender: string;
}) => {
  const limit = endPage - startPage + 1;
  const { data, error } = await supabase.rpc('get_profiles_page', {
    p_gender: studentGender,
    p_offset: startPage,
    p_limit: limit,
  });
  if (error) throw error;
  return data as ProfileProps[];
};

// C) check_num 읽기: users select라서 RLS에 막힐 수 있음.
//    ✅ 추천: get_check_num RPC
export const checkNumGet = async ({ id }: { id: number }) => {
  const { data, error } = await supabase.rpc('get_check_num', { p_id: id });
  if (error) throw error;
  return (data as { check_num: number }).check_num;
};

// D) 매칭 생성 + 본인 check_num 증가: matching insert도 RLS 영향.
//    ✅ 추천: create_match_and_increment RPC로 한 방에 처리
export const matchingUpdate = async ({
  userId,
  targetId,
}: {
  userId: number;
  targetId: number;
}) => {
  const { data, error } = await supabase.rpc('create_match_and_increment', {
    p_user_id: userId,
    p_target_id: targetId,
  });
  if (error) throw error;
  return data; // 필요 시 RPC에서 적절한 반환 형식으로 구성
};

// E) 내가 매칭한 프로필들: join/select 다수 → RPC로 묶기 추천
export const getMatchesWithProfile = async (userId: number) => {
  const { data, error } = await supabase.rpc('get_matches_with_profile', {
    p_user_id: userId,
  });
  if (error) throw error;
  return data as ProfileProps[];
};
