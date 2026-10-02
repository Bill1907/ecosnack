import { describe, expect, it } from 'vitest'
import { formatKstDate } from './date'

describe('formatKstDate', () => {
  it('YYYY-MM-DD 를 KST 그날로 표시한다', () => {
    expect(
      formatKstDate('2026-09-30', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
      }),
    ).toBe('2026년 9월 30일 수요일')
  })

  it('UTC 로는 전날인 시각도 KST 날짜로 표시한다', () => {
    // 2026-09-30 15:30 UTC = 2026-10-01 00:30 KST
    expect(formatKstDate(new Date('2026-09-30T15:30:00Z'))).toBe('2026. 10. 1.')
  })
})
