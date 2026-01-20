import { createFileRoute } from '@tanstack/react-router'
import { getPageMeta, SITE_CONFIG, getOrganizationJsonLd } from '../lib/seo'

export const Route = createFileRoute('/about')({
  component: AboutPage,
  head: () => ({
    meta: getPageMeta({
      title: '소개',
      description: 'HEY! Vona는 글로벌 및 한국 경제 뉴스를 "그래서 나한테 뭔 영향?"까지 쉽게 설명해주는 서비스입니다.',
      path: '/about',
      keywords: ['소개', 'About', '경제뉴스', '뉴스분석'],
    }),
    scripts: [
      {
        type: 'application/ld+json',
        children: JSON.stringify(getOrganizationJsonLd()),
      },
    ],
  }),
})

function AboutPage() {
  return (
    <main className="flex-1">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <h1 className="text-3xl font-bold text-foreground mb-8 font-serif">
          {SITE_CONFIG.name} 소개
        </h1>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">오늘의 경제, 한 입에</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {SITE_CONFIG.name}는 복잡한 경제 뉴스를 쉽고 빠르게 이해할 수 있도록 도와주는 서비스입니다.
              글로벌 및 한국 경제 뉴스를 <strong>"그래서 나한테 뭔 영향?"</strong>까지
              쉽게 설명해 드립니다.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">우리가 하는 일</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="bg-secondary/30 p-6 rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">뉴스 큐레이션</h3>
                <p className="text-muted-foreground text-sm">
                  매일 쏟아지는 경제 뉴스 중 정말 중요한 뉴스만 선별하여 제공합니다.
                </p>
              </div>
              <div className="bg-secondary/30 p-6 rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">영향 분석</h3>
                <p className="text-muted-foreground text-sm">
                  투자자, 직장인, 소비자 관점에서 뉴스가 미치는 영향을 분석해 드립니다.
                </p>
              </div>
              <div className="bg-secondary/30 p-6 rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">쉬운 설명</h3>
                <p className="text-muted-foreground text-sm">
                  어려운 경제 용어와 복잡한 맥락을 누구나 이해할 수 있게 풀어서 설명합니다.
                </p>
              </div>
              <div className="bg-secondary/30 p-6 rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">맥락 제공</h3>
                <p className="text-muted-foreground text-sm">
                  관련 배경 지식과 앞으로 주목해야 할 포인트를 함께 제공합니다.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">카테고리</h2>
            <p className="text-muted-foreground leading-relaxed">
              다양한 경제 분야의 뉴스를 카테고리별로 제공합니다.
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li><strong>경제:</strong> 글로벌 및 한국 경제 동향과 주요 경제 지표 분석</li>
              <li><strong>금융:</strong> 금융 시장 동향, 투자 정보, 금융 정책 분석</li>
              <li><strong>비즈니스:</strong> 기업 뉴스, 산업 동향, 비즈니스 전략 분석</li>
              <li><strong>시장:</strong> 주식, 채권, 외환 등 금융 시장 분석</li>
              <li><strong>정책:</strong> 경제 정책, 규제, 정부 발표 분석</li>
              <li><strong>무역:</strong> 무역 동향, 국제 통상, 수출입 분석</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">비전</h2>
            <p className="text-muted-foreground leading-relaxed">
              경제 뉴스는 우리 모두의 일상에 영향을 미칩니다. 하지만 대부분의 경제 뉴스는
              전문 용어와 복잡한 맥락으로 가득 차 있어 일반인이 이해하기 어렵습니다.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              {SITE_CONFIG.name}는 <strong>누구나 경제 뉴스를 쉽게 이해하고,
              자신의 삶에 어떤 영향을 미치는지 파악할 수 있는 세상</strong>을 만들고자 합니다.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">면책 조항</h2>
            <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-lg">
              <p className="text-muted-foreground text-sm leading-relaxed">
                {SITE_CONFIG.name}에서 제공하는 정보는 일반적인 정보 제공 목적으로만 사용되며,
                투자 조언, 재무 상담 또는 기타 전문적인 조언으로 해석되어서는 안 됩니다.
                투자 결정은 개인의 판단과 책임 하에 이루어져야 하며,
                필요한 경우 전문가와 상담하시기 바랍니다.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">연락처</h2>
            <p className="text-muted-foreground leading-relaxed">
              {SITE_CONFIG.name}에 대한 문의, 제안, 피드백은 언제든 환영합니다.
            </p>
            <div className="bg-secondary/50 p-4 rounded-lg">
              <p className="text-muted-foreground">
                <strong>이메일:</strong> boseong.romi@gmail.com
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
