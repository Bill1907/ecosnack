// 동적 라우트 파라미터 검증 (DB 조회 전에 잘못된 형식을 걸러 404 로 처리하기 위함)
// 서버 함수 inputValidator 와 라우트 loader 가 같은 규칙을 쓴다

// articles.id 는 Postgres serial(int4) 이므로 상한은 2^31 - 1
export const MAX_ARTICLE_ID = 2147483647

const ARTICLE_ID_PATTERN = /^[1-9]\d*$/
const REPORT_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/

// 기사 id 파라미터 → 양의 정수. 앞자리 0, 부호, 소수점, 숫자 외 문자, 범위 초과는 null
export function parseArticleId(raw: string): number | null {
  if (!ARTICLE_ID_PATTERN.test(raw)) {
    return null
  }

  const id = Number(raw)
  if (!Number.isSafeInteger(id) || id > MAX_ARTICLE_ID) {
    return null
  }

  return id
}

// 실제 달력에 존재하는 YYYY-MM-DD 인지 (2026-02-30, 2026-13-45 등은 false)
export function isValidReportDate(raw: string): boolean {
  const match = REPORT_DATE_PATTERN.exec(raw)
  if (!match) {
    return false
  }

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  if (month < 1 || month > 12 || day < 1) {
    return false
  }

  // UTC 기준으로 만들어 왕복 비교 (타임존 영향 없음)
  const date = new Date(Date.UTC(year, month - 1, day))
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  )
}

// 리포트 날짜 파라미터 → 유효하면 그대로, 아니면 null
export function parseReportDate(raw: string): string | null {
  return isValidReportDate(raw) ? raw : null
}
