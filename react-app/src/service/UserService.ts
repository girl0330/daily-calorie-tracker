import { supabase } from '../lib/supabase';

export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error('회원가입 통신 실패:', error.message);
    throw new Error(error.message);
  }

  console.log('회원가입 통신 성공:', data);
};

export const login = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('로그인 통신 성공 실패:', error.message);
    throw new Error(error.message);
  }

  if (!data.user) {
    throw new Error('로그인 사용자 정보를 가져오지 못했습니다.');
  }

  return data.user;
};

export const logout = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('로그아웃 실패:', error.message);
    throw new Error(error.message);
  }
};
