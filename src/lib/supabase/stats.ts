import { supabase } from './client';

//RPC (user Stat 파악 함수)
// (SQL에 정의된 함수를 supabase 클라이언트에서 호출 후 서버에서 로직 실행)

export const incrementMatchCount = async () => {
  const { error } = await supabase.rpc('increment_match_count');

  if (error) {
    console.log('유저 수 증가 파악 함수 내부 오류 발생', error);
    throw error;
  }
};

export const resetMatchCount = async () => {
  const { error } = await supabase
    .from('stats')
    .update({ match_count: 0 })
    .eq('id', 1);

  if (error) throw error;
};
