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
  const { data, error } = await supabase
    .from('users') //supabase에서 설정한 table named "users"
    .insert([{ id, name, gender }]) //supabase의 table에 행을 삽입하는 메서드. (다건 삽입이 디폴트 . 배열 형태로 넘겨줘야한다.)
    .select(); // att를 가져오는 문, 만일 비었다면 select *
  if (error) {
    console.log('supabase signUp 에러 발생', error);
    throw error;
  }

  return data;
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
  const { data, error } = await supabase
    .from('users')
    .select('id')
    .eq('id', userId); //sql where이랑 비슷 (colname, value)
  //sql로 치면, select id from users where id = userId

  if (error) {
    console.log('supabase getSignedUser 에러 발생', error);
    throw error;
  }
  return data.length !== 0;
};

export const checkNumGet = async ({ id }: { id: number }) => {
  const { data, error } = await supabase
    .from('users')
    .select('check_num')
    .eq('id', id);

  if (error) {
    console.log('supabase getSignedUser 에러 발생', error);
    throw error;
  }
  return data[0].check_num;
};
