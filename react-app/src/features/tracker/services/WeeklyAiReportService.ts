import { supabase } from '../../../lib/supabase';
import type { UserId } from '../../../types/types';

/** AI가 정리한 한 주의 리포트 */
export type AiWeeklyReport = {
  /** 맨 위 한두 문장 요약 */
  lead: string;
  good: string[];
  bad: string[];
  next: string[];
  /** 만든 때(ISO 문자열) */
  createdAt: string;
  /** 리포트를 만들 때 기록한 날 수 */
  recordedDays: number;
  /** 만들 때의 기록·목표 서명값. 지금 값과 다르면 '바뀜 안내'를 보여 줘요. */
  signature: string;
};

const REPORT_SELECT_COLUMNS = 'lead, good, bad, next, created_at, recorded_days, signature';

// DB(snake_case) 한 줄. weekly-report 함수도 같은 모양으로 돌려줘요.
type ReportRow = {
  lead: string;
  good: string[];
  bad: string[];
  next: string[];
  created_at: string;
  recorded_days: number;
  signature: string;
};

const toReport = (row: ReportRow): AiWeeklyReport => ({
  lead: row.lead,
  good: row.good,
  bad: row.bad,
  next: row.next,
  createdAt: row.created_at,
  recordedDays: row.recorded_days,
  signature: row.signature,
});

/** 이 주(월요일 startDate)에 저장된 리포트. 없으면 null */
export const getWeeklyAiReportApi = async (userId: UserId, startDate: string): Promise<AiWeeklyReport | null> => {
  const { data, error } = await supabase
    .from('weekly_reports')
    .select(REPORT_SELECT_COLUMNS)
    .eq('user_id', userId)
    .eq('week_start', startDate)
    .maybeSingle();

  if (error) throw error;
  return data ? toReport(data as ReportRow) : null;
};

/**
 * 이 주의 리포트를 새로 만들어 저장해요. 이미 있으면 덮어써요.
 * Supabase Edge Function 'weekly-report'를 불러요(supabase/functions/weekly-report).
 * 기록과 목표는 함수가 DB에서 직접 읽어요. 앱은 어느 주인지와 서명값만 보내요.
 */
export const createWeeklyAiReportApi = async (startDate: string, signature: string): Promise<AiWeeklyReport> => {
  const { data, error } = await supabase.functions.invoke<ReportRow>('weekly-report', {
    body: { weekStart: startDate, signature },
  });

  if (error) throw error;
  if (!data) throw new Error('리포트를 받지 못했어요.');
  return toReport(data);
};
