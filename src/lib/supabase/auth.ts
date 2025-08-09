import { supabase } from './client';

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
  if (error) {
    console.log('supabase signup 에러 발생', error);
    throw error;
  }
};

export const login = async ({ id, name }: { id: number; name: string }) => {
  const { data, error } = await supabase
    .from('users')
    .select('id, name,gender,check_num')
    .eq('id', id)
    .eq('name', name);
  if (error) {
    console.log('supabase login 에러 발생', error);
    throw error;
  }

  return data;
};

export const getIsSignedUser = async (userId: string) => {
  const { data, error } = await supabase.rpc('get_is_signed_user', {
    p_id: userId,
  });
  if (error) {
    console.log('supabase error ! getIsSignedUser api');
  }
  return data;
};

export const checkNumGet = async ({ id }: { id: number }) => {
  const { data, error } = await supabase.rpc('get_check_num', { p_id: id });
  if (error) throw error;
  return (data as { check_num: number }).check_num;
};
