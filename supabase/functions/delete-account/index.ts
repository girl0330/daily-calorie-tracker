// 회원 탈퇴: 로그인한 사용자 본인의 계정을 지워요.
// - 로그인한 사용자만 부를 수 있고, 지우는 대상은 늘 토큰의 주인이에요(다른 사람 id를 받지 않아요).
// - 계정(auth.users)을 지우면 foods, user_goals, profiles, weekly_reports, ai_usage의 그 사람 줄도
//   DB가 함께 지워요(모두 on delete cascade). food_search_cache는 사용자 정보가 없는 공용 표라 그대로예요.
// - 계정 지우기는 서버 전용 키로만 할 수 있어서 이 함수에서 해요. 앱에는 그 키가 없어요.
// - 앱은 supabase.functions.invoke('delete-account')로 불러요.
import { getServiceClient, getUserClient } from '../_shared/auth.ts';
import { corsHeaders, json } from '../_shared/http.ts';

Deno.serve(async request => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (request.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);

  // 1) 로그인한 사용자인지 확인해요.
  const auth = await getUserClient(request);
  if ('response' in auth) return auth.response;

  // 2) 그 사용자의 계정을 지워요. 기록은 cascade로 함께 지워져요.
  const { error } = await getServiceClient().auth.admin.deleteUser(auth.user.id);
  if (error) {
    console.error('delete_user_error', error);
    return json({ error: 'delete_failed' }, 500);
  }

  return json({ ok: true });
});
