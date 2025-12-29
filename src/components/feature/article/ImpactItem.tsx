import type { ImpactAnalysis } from '../../../db/schema'

type ImpactType = 'investors' | 'workers' | 'consumers'

interface ImpactItemProps {
  type: ImpactType
  data: ImpactAnalysis[ImpactType]
}

const IMPACT_CONFIG = {
  investors: {
    title: '투자자에게 미치는 영향',
    icon: '💼',
    bgGradient: 'bg-gradient-to-br from-blue-50 to-indigo-50',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    accentColor: 'text-blue-600',
    tagBg: 'bg-blue-100',
    tagText: 'text-blue-700',
    sections: {
      list: { title: '대응 방안', key: 'action_items' as const },
      tags: { title: '영향받는 섹터', key: 'sectors_affected' as const },
    },
  },
  workers: {
    title: '직장인/노동자에게 미치는 영향',
    icon: '👷',
    bgGradient: 'bg-gradient-to-br from-amber-50 to-orange-50',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    accentColor: 'text-amber-600',
    tagBg: 'bg-amber-100',
    tagText: 'text-amber-700',
    sections: {
      tags: { title: '영향받는 산업군', key: 'industries_affected' as const },
      info: { title: '고용 전망', key: 'job_outlook' as const },
    },
  },
  consumers: {
    title: '소비자에게 미치는 영향',
    icon: '🛒',
    bgGradient: 'bg-gradient-to-br from-emerald-50 to-green-50',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    accentColor: 'text-emerald-600',
    tagBg: 'bg-emerald-100',
    tagText: 'text-emerald-700',
    sections: {
      info1: { title: '💰 물가/생활비 영향', key: 'price_impact' as const },
      info2: { title: '💡 소비 관련 조언', key: 'spending_advice' as const },
    },
  },
} as const

export function ImpactItem({ type, data }: ImpactItemProps) {
  const config = IMPACT_CONFIG[type]

  return (
    <div
      className={`${config.bgGradient} rounded-xl shadow-sm border border-white/60 overflow-hidden transition-all duration-300 hover:shadow-md`}
    >
      {/* Header with Icon */}
      <div className="p-6 pb-4">
        <div className="flex items-start gap-3 mb-4">
          <div
            className={`${config.iconBg} ${config.iconColor} w-10 h-10 rounded-lg flex items-center justify-center text-xl shrink-0`}
          >
            {config.icon}
          </div>
          <h4 className="font-semibold text-[#1a1a1a] text-lg pt-1.5">
            {config.title}
          </h4>
        </div>
        <p
          className="text-[#1a1a1a] leading-relaxed"
          style={{ fontSize: '15px', lineHeight: '1.7' }}
        >
          {data.summary}
        </p>
      </div>

      {/* Content Sections */}
      <div className="px-6 pb-6 space-y-4">
        {/* Render sections based on type */}
        {type === 'investors' && 'action_items' in data && (
          <>
            {data.action_items && data.action_items.length > 0 && (
              <div className="bg-white/70 rounded-lg p-4">
                <h5 className="text-sm font-semibold mb-3 text-[#1a1a1a] flex items-center gap-2">
                  <span className={config.iconColor}>✓</span>
                  대응 방안
                </h5>
                <ul className="space-y-2">
                  {data.action_items.map((item: string, i: number) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 text-[#666666]"
                      style={{ fontSize: '14px', lineHeight: '1.6' }}
                    >
                      <span
                        className={`${config.accentColor} font-bold mt-0.5`}
                      >
                        •
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {data.sectors_affected && data.sectors_affected.length > 0 && (
              <div>
                <h5 className="text-sm font-semibold mb-2.5 text-[#1a1a1a]">
                  영향받는 섹터
                </h5>
                <div className="flex flex-wrap gap-2">
                  {data.sectors_affected.map((sector: string, i: number) => (
                    <span
                      key={i}
                      className={`px-3 py-1.5 ${config.tagBg} ${config.tagText} rounded-lg text-sm font-medium transition-all hover:scale-105`}
                    >
                      {sector}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {type === 'workers' && 'industries_affected' in data && (
          <>
            {data.industries_affected &&
              data.industries_affected.length > 0 && (
                <div>
                  <h5 className="text-sm font-semibold mb-2.5 text-[#1a1a1a]">
                    영향받는 산업군
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {data.industries_affected.map(
                      (industry: string, i: number) => (
                        <span
                          key={i}
                          className={`px-3 py-1.5 ${config.tagBg} ${config.tagText} rounded-lg text-sm font-medium transition-all hover:scale-105`}
                        >
                          {industry}
                        </span>
                      ),
                    )}
                  </div>
                </div>
              )}

            {data.job_outlook && (
              <div className="bg-white/70 rounded-lg p-4">
                <h5 className="text-sm font-semibold mb-2 text-[#1a1a1a] flex items-center gap-2">
                  <span className={config.iconColor}>📈</span>
                  고용 전망
                </h5>
                <p
                  className="text-[#666666] leading-relaxed"
                  style={{ fontSize: '14px' }}
                >
                  {data.job_outlook}
                </p>
              </div>
            )}
          </>
        )}

        {type === 'consumers' && 'price_impact' in data && (
          <>
            {data.price_impact && (
              <div className="bg-white/70 rounded-lg p-4">
                <h5 className="text-sm font-semibold mb-2 text-[#1a1a1a] flex items-center gap-2">
                  <span className={config.iconColor}>💰</span>
                  물가/생활비 영향
                </h5>
                <p
                  className="text-[#666666] leading-relaxed"
                  style={{ fontSize: '14px' }}
                >
                  {data.price_impact}
                </p>
              </div>
            )}

            {data.spending_advice && (
              <div className="bg-white/70 rounded-lg p-4">
                <h5 className="text-sm font-semibold mb-2 text-[#1a1a1a] flex items-center gap-2">
                  <span className={config.iconColor}>💡</span>
                  소비 관련 조언
                </h5>
                <p
                  className="text-[#666666] leading-relaxed"
                  style={{ fontSize: '14px' }}
                >
                  {data.spending_advice}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
