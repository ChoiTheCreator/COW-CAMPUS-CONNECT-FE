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
    .range(startPage, endPage);

  if (error) throw error;
  return data as ProfileProps[];
};
