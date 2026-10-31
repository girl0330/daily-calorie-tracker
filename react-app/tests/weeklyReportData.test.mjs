// Node.js 24 이상. HTTP 응답만 대체하고 실제 Supabase SDK·QueryClient로 연결을 검증한다.
import { registerHooks } from 'node:module';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import assert from 'node:assert/strict';
import { createClient } from '@supabase/supabase-js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

let responses = [];
let requests = [];
globalThis.__weeklyReportTestClient = createClient('https://example.supabase.co', 'test-key', {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
  global: {
    fetch: async (url, options) => {
      requests.push({ url: new URL(url), options });
      assert.ok(responses.length > 0, '예상하지 않은 추가 요청');
      const { data, status = 200, count = Array.isArray(data) ? data.length : null } = responses.shift();
      return new Response(JSON.stringify(data), {
        status,
        headers: {
          'Content-Type': 'application/json',
          'Content-Range': `*/${count ?? '*'}`,
        },
      });
    },
  },
});

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.endsWith('/lib/supabase')) {
      return {
        url: 'data:text/javascript,export const supabase = globalThis.__weeklyReportTestClient;',
        shortCircuit: true,
      };
    }
    if (specifier.startsWith('.') && context.parentURL) {
      const url = new URL(`${specifier}.ts`, context.parentURL);
      if (existsSync(fileURLToPath(url))) return nextResolve(url.href, context);
    }
    return nextResolve(specifier, context);
  },
});

const { getFoodsByPeriodApi } = await import('../src/features/foods/services/FoodService.ts');
const { foodQueryKeys } = await import('../src/features/foods/queryKeys.ts');
const { useWeeklyReport } = await import('../src/features/tracker/hooks/useWeeklyReport.ts');
const { useCreateFood, useUpdateFood, useRemoveFood } = await import('../src/features/foods/hooks/useFoodMutations.ts');
const row = (overrides = {}) => ({
  id: 1,
  user_id: 'user-a',
  meal_type: 'breakfast',
  food_name: '예시',
  carbs: 10,
  protein: 5,
  fat: 2,
  record_date: '2026-10-19',
  created_at: '2026-10-19T12:00:00Z',
  ...overrides,
});
const reset = (values = []) => {
  responses = values;
  requests = [];
};
const renderHook = (client, hook) => {
  let result;
  function Probe() {
    result = hook();
    return null;
  }
  renderToStaticMarkup(React.createElement(QueryClientProvider, { client }, React.createElement(Probe)));
  return result;
};

test('사용자·양끝 날짜·null 날짜 대체 조건을 요청하고 DB 행을 변환한다', async () => {
  reset([{ data: [row()] }]);
  const foods = await getFoodsByPeriodApi('user-a', '2026-10-19', '2026-10-25');
  const params = requests[0].url.searchParams;
  assert.equal(params.get('user_id'), 'eq.user-a');
  assert.equal(params.get('order'), 'id.asc');
  const nextDay = new Date(2026, 9, 26).toISOString();
  assert.equal(
    params.get('or'),
    `(and(record_date.gte.2026-10-19,record_date.lte.2026-10-25),and(record_date.is.null,created_at.gte.${new Date(2026, 9, 19).toISOString()},created_at.lt.${nextDay}))`
  );
  assert.equal(foods[0].recordDate, '2026-10-19');
  assert.equal(foods[0].userId, 'user-a');
});

test('서버 반환 개수가 요청 크기보다 작아도 다음 페이지를 이어 조회한다', async () => {
  reset([
    { data: [row()], count: 2 },
    { data: [row({ id: 2 })], count: 2 },
  ]);
  const foods = await getFoodsByPeriodApi('user-a', '2026-10-19', '2026-10-25');
  assert.deepEqual(
    foods.map(food => food.id),
    [1, 2]
  );
  assert.equal(requests[0].url.searchParams.get('offset'), '0');
  assert.equal(requests[1].url.searchParams.get('offset'), '1');
});

test('null record_date는 기존 조회처럼 등록 시각의 로컬 날짜로 보정한다', async () => {
  const createdAt = new Date(2026, 9, 19, 0, 30).toISOString();
  reset([{ data: [row({ record_date: null, created_at: createdAt })] }]);
  const foods = await getFoodsByPeriodApi('user-a', '2026-10-19', '2026-10-25');
  assert.equal(foods[0].recordDate, '2026-10-19');
});

test('빈 조회는 빈 목록이고 조회 실패·중간 페이지 실패는 오류로 전달한다', async () => {
  reset([{ data: [] }]);
  assert.deepEqual(await getFoodsByPeriodApi('user-a', '2026-10-19', '2026-10-25'), []);
  reset([{ status: 403, data: { message: '접근 거절', code: '42501' } }]);
  await assert.rejects(
    getFoodsByPeriodApi('user-a', '2026-10-19', '2026-10-25'),
    error => error.message === '접근 거절'
  );
  reset([
    { data: [row()], count: 2 },
    { status: 500, data: { message: '다음 페이지 실패' } },
  ]);
  await assert.rejects(getFoodsByPeriodApi('user-a', '2026-10-19', '2026-10-25'));
});

test('잘못된 날짜·역전 범위·사용자 누락은 요청 전에 거절한다', async () => {
  reset();
  for (const [userId, start, end] of [
    ['', '2026-10-19', '2026-10-25'],
    ['user-a', '2026-02-30', '2026-03-01'],
    ['user-a', '2026-10-25', '2026-10-19'],
    ['user-a', '2026-1-1', '2026-10-25'],
  ])
    await assert.rejects(getFoodsByPeriodApi(userId, start, end));
  assert.equal(requests.length, 0);
});

test('기간 캐시를 주간 집계로 변환하며 다른 주·다른 사용자 데이터가 섞이지 않는다', async () => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: Infinity } },
  });
  try {
    reset([
      {
        data: [
          row(),
          row({
            id: 2,
            meal_type: 'dinner',
            record_date: '2026-10-25',
            carbs: 20,
            protein: 10,
            fat: 4,
          }),
        ],
      },
    ]);
    const foods = await getFoodsByPeriodApi('user-a', '2026-10-19', '2026-10-25');
    const key = foodQueryKeys.period('user-a', '2026-10-19', '2026-10-25');
    client.setQueryData(key, foods);
    const result = renderHook(client, () => useWeeklyReport('user-a', new Date(2026, 9, 21)));
    assert.equal(result.data.totalCalories, 234);
    assert.equal(result.data.recordedDays, 2);
    assert.equal(result.data.nutrients.protein, 15);
    assert.equal(renderHook(client, () => useWeeklyReport('user-a', new Date(2026, 9, 26))).data, undefined);
    assert.equal(renderHook(client, () => useWeeklyReport('user-b', new Date(2026, 9, 21))).data, undefined);
    const disabled = renderHook(client, () => useWeeklyReport(undefined, new Date(2026, 9, 21)));
    assert.equal(disabled.fetchStatus, 'idle');
    assert.equal(disabled.data, undefined);
    assert.equal(requests.length, 1);
  } finally {
    client.clear();
  }
});

test('기존 추가·수정·삭제로 본인의 기간 캐시도 무효화된다', async () => {
  for (const hook of [useCreateFood, useUpdateFood, useRemoveFood]) {
    const client = new QueryClient({
      defaultOptions: {
        mutations: { gcTime: Infinity },
        queries: { gcTime: Infinity },
      },
    });
    try {
      const own = foodQueryKeys.period('user-a', '2026-10-19', '2026-10-25');
      const anotherWeek = foodQueryKeys.period('user-a', '2026-10-26', '2026-11-01');
      const otherUser = foodQueryKeys.period('user-b', '2026-10-19', '2026-10-25');
      for (const key of [own, anotherWeek, otherUser]) client.setQueryData(key, []);
      reset([{ data: row() }]);
      const mutation = renderHook(client, () => hook('user-a'));
      await mutation.mutateAsync(
        hook === useRemoveFood
          ? 1
          : {
              id: 1,
              userId: 'user-a',
              mealType: 'breakfast',
              foodName: '예시',
              carbs: 10,
              protein: 5,
              fat: 2,
              recordDate: '2026-10-19',
            }
      );
      assert.equal(client.getQueryState(own).isInvalidated, true);
      assert.equal(client.getQueryState(anotherWeek).isInvalidated, true);
      assert.equal(client.getQueryState(otherUser).isInvalidated, false);
    } finally {
      client.clear();
    }
  }
});
