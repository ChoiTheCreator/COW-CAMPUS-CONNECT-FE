import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY!;
export const supabase = createClient(supabaseUrl, supabaseKey);

export const getIsSignedUser = async (userId: string) => {
  const { data, error } = await supabase.rpc('get_is_signed_user', {
    p_id: Number(userId),
  });
  if (error) throw error;
  return Boolean(data);
};

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
};

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

export const checkNumGet = async ({ id }: { id: number }) => {
  const { data, error } = await supabase.rpc('get_check_num', { p_id: id });
  if (error) throw error;
  return (data as { check_num: number }).check_num;
};

// D) 매칭 생성 + 본인 check_num 증가: matching insert도 RLS 영향.

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
