import { describe, expect, it } from 'vitest'
import { formatKstDate, shiftDate, todayKst } from './date'

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

describe('todayKst', () => {
  it('UTC 날짜가 아니라 KST 날짜를 돌려준다', () => {
    expect(todayKst(new Date('2026-09-30T15:30:00Z'))).toBe('2026-10-01')
    expect(todayKst(new Date('2026-09-30T14:59:00Z'))).toBe('2026-09-30')
  })
})

describe('shiftDate', () => {
  it('월·연 경계를 넘는다', () => {
    expect(shiftDate('2026-10-01', -1)).toBe('2026-09-30')
    expect(shiftDate('2026-12-31', 1)).toBe('2027-01-01')
    expect(shiftDate('2028-02-28', 1)).toBe('2028-02-29')
  })
})
