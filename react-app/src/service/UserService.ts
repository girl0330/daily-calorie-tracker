import { supabase } from '../lib/supabase';

export const signUpApi = async (email: string, password: string) => {
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

export const loginApi = async (email: string, password: string) => {
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

  console.log('로그인 성공', data);
  return data;
};

// 재설정 이메일을 보내는 함수
export const sendPasswordResetEmailApi = async (email: string) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });

  if (error) {
    throw error;
  }

  return data;
};

// 현재 비밀번호 확인
export const reauthenticateApi = async (email: string, currentPassword: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: currentPassword,
  });

  if (error) {
    console.error('비밀번호 확인 실패:', error.message);
    throw new Error(error.message);
  }

  if (!data.user) {
    throw new Error('현재 비밀번호가 일치하지 않습니다.');
  }

  console.log('비밀번호 확인 성공', data);
  return data;
};

// 실제 비밀번호 변경
export const resetPasswordApi = async (password: string) => {
  const { data, error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    throw error;
  }

  return data;
};

export const logoutApi = async () => {
  await supabase.auth.signOut();
};

/**
 * 회원 탈퇴. Edge Function 'delete-account'가 로그인한 본인의 계정을 지워요(supabase/functions/delete-account).
 * 음식 기록·목표·리포트는 DB가 계정과 함께 지워요. 끝나면 부르는 쪽에서 로그아웃해요.
 */
export const deleteAccountApi = async () => {
  const { error } = await supabase.functions.invoke('delete-account', { method: 'POST' });
  if (error) throw error;
};
