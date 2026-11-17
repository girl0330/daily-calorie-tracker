// OpenAI에게 정해진 모양(JSON 스키마)으로 답하게 하는 도우미예요. (food-search, weekly-report)
// 키와 모델 이름은 Supabase Secrets(OPENAI_API_KEY, OPENAI_MODEL)에서만 읽어요.

/** 왜 실패했는지. 함수가 앱에 돌려줄 상태 코드를 고를 때 써요. */
export class OpenAiError extends Error {
  constructor(readonly code: 'not_configured' | 'upstream_failed' | 'bad_upstream_response') {
    super(code);
  }
}

/** 실패 이유에 맞는 상태 코드. 설정이 없으면 500, OpenAI 쪽 문제면 502예요. */
export const openAiErrorStatus = (error: OpenAiError) => (error.code === 'not_configured' ? 500 : 502);

/**
 * system 지시문과 user 내용을 보내고, 스키마에 맞춘 JSON 답을 객체로 돌려줘요.
 * 답의 값 하나하나를 믿을 수 있게 정리하는 건 부르는 함수가 해요.
 */
export const askOpenAiJson = async ({
  systemPrompt,
  userContent,
  schemaName,
  schema,
}: {
  systemPrompt: string;
  userContent: string;
  schemaName: string;
  schema: Record<string, unknown>;
}): Promise<unknown> => {
  const apiKey = Deno.env.get('OPENAI_API_KEY');
  const model = Deno.env.get('OPENAI_MODEL');
  if (!apiKey || !model) throw new OpenAiError('not_configured');

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userContent },
      ],
      response_format: { type: 'json_schema', json_schema: { name: schemaName, strict: true, schema } },
    }),
  });

  if (!response.ok) {
    // 키·결제 문제 등을 로그로 남겨요(대시보드의 함수 로그에서 볼 수 있어요). 앱에는 자세한 이유를 보내지 않아요.
    console.error('openai_error', response.status, await response.text());
    throw new OpenAiError('upstream_failed');
  }

  try {
    const completion = await response.json();
    return JSON.parse(completion?.choices?.[0]?.message?.content ?? '');
  } catch (error) {
    console.error('parse_error', error);
    throw new OpenAiError('bad_upstream_response');
  }
};
