import { supabase } from './client';

export interface ProfileProps {
  nickname: string;
  mbti: string;
  description: string;
  insta_profile: string;
  user_id: number;
}

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
  const { data, error } = await supabase
    .from('profile')
    .insert([
      {
        user_id: userId,
        nickname,
        mbti,
        description,
        insta_profile: instaProfile,
      },
    ])
    .select(); //all..

  if (error) throw error;
  return data;
};


//db 조회 함수
export const getAllPropfile = async ({
  startPage,
  endPage,
  studentGender,
}: {
  startPage: number;
  endPage: number;
  studentGender: string;
}) => {
  const { data, error } = await supabase
    .from('profile_with_gender')
    .select('nickname, mbti, description, insta_profile, user_id')
    .neq('gender', studentGender)
    .range(startPage, endPage); //페이징 처리 startPage 행부터 endPage 행까지 가져오겠다는 것.

  if (error) throw error;
  return data as ProfileProps[];
};


//현재까지 몇명의 사용자를 파악하는.