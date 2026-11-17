import { createClient, type SupabaseClient, type User } from 'npm:@supabase/supabase-js@2';
import { json } from './http.ts';

/**
 * 로그인한 사용자인지 확인하고, 그 사용자의 토큰을 붙인 Supabase 클라이언트를 돌려줘요.
 * 이 클라이언트로 읽고 쓰면 RLS가 적용돼서 본인 데이터만 다뤄요.
 * 로그인하지 않았으면 401 응답을 돌려줘요(함수는 그대로 return하면 돼요).
 */
export const getUserClient = async (
  request: Request,
): Promise<{ supabase: SupabaseClient; user: User } | { response: Response }> => {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '') ?? '';
  const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_ANON_KEY') ?? '', {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return { response: json({ error: 'unauthorized' }, 401) };

  return { supabase, user: data.user };
};

/**
 * 서버 전용 키(service-role)를 쓰는 Supabase 클라이언트. RLS를 건너뛰는 만능 열쇠예요.
 * 꼭 필요한 곳에만 써요: 검색 결과 저장 표(food-search), 계정 지우기(delete-account).
 * 사용자 기록을 읽고 쓰는 데는 쓰지 않아요(그건 getUserClient로 본인으로서 다뤄요).
 */
export const getServiceClient = () =>
  createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '', {
    auth: { persistSession: false },
  });
