// 날짜 표시는 서버(Workers, UTC)와 브라우저(이용자 시간대)가 같은 글자를 내야 한다.
// 시간대를 지정하지 않은 toLocaleDateString 은 둘이 달라 하이드레이션 불일치(#418)와
// 날짜가 하루 밀리는 표시(예: 9월 30일 리포트가 미국에서 9월 29일)를 낸다.
// 서비스 기준 시간대인 KST 로 고정한다.

const TIME_ZONE = 'Asia/Seoul'
const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/

// 'YYYY-MM-DD'(DB date 컬럼)는 KST 그날 0시로 해석한다
function toDate(value: string | Date): Date {
  if (value instanceof Date) return value
  return new Date(DATE_ONLY.test(value) ? `${value}T00:00:00+09:00` : value)
}

export function formatKstDate(
  value: string | Date,
  options: Intl.DateTimeFormatOptions = {},
): string {
  return new Intl.DateTimeFormat('ko-KR', {
    timeZone: TIME_ZONE,
    ...options,
  }).format(toDate(value))
}
