import { describe, expect, it } from 'vitest'
import {
  MAX_ARTICLE_ID,
  isValidReportDate,
  parseArticleId,
  parseReportDate,
} from './route-params'

describe('parseArticleId', () => {
  it('양의 정수 문자열은 숫자로 변환한다', () => {
    expect(parseArticleId('1')).toBe(1)
    expect(parseArticleId('25632')).toBe(25632)
    expect(parseArticleId(String(MAX_ARTICLE_ID))).toBe(MAX_ARTICLE_ID)
  })

  it.each([
    'abc',
    '',
    '0',
    '-1',
    '+1',
    '1.5',
    '1e3',
    '25632abc',
    '00025632',
    ' 1',
    '0x10',
    'Infinity',
    'NaN',
    String(MAX_ARTICLE_ID + 1),
    '99999999999999999999',
  ])('잘못된 id %j 는 null', (raw) => {
    expect(parseArticleId(raw)).toBeNull()
  })
})

describe('isValidReportDate / parseReportDate', () => {
  it.each(['2026-09-30', '2020-01-01', '2024-02-29', '1999-12-31'])(
    '유효한 날짜 %s',
    (raw) => {
      expect(isValidReportDate(raw)).toBe(true)
      expect(parseReportDate(raw)).toBe(raw)
    },
  )

  it.each([
    'abc',
    '',
    '2026-13-45',
    '2026-02-30',
    '2025-02-29',
    '2026-00-10',
    '2026-04-31',
    '2026-09-00',
    '2026-9-30',
    '26-09-30',
    '2026/09/30',
    '2026-09-30T00:00:00Z',
    ' 2026-09-30',
  ])('잘못된 날짜 %j', (raw) => {
    expect(isValidReportDate(raw)).toBe(false)
    expect(parseReportDate(raw)).toBeNull()
  })
})
