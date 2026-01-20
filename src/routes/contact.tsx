import { createFileRoute } from '@tanstack/react-router'
import { getPageMeta, SITE_CONFIG } from '../lib/seo'

export const Route = createFileRoute('/contact')({
  component: ContactPage,
  head: () => ({
    meta: getPageMeta({
      title: '문의하기',
      description: 'HEY! Vona에 문의하세요. 서비스 관련 문의, 제안, 피드백을 환영합니다.',
      path: '/contact',
      keywords: ['문의', '연락처', 'Contact', '피드백'],
    }),
  }),
})

function ContactPage() {
  return (
    <main className="flex-1">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <h1 className="text-3xl font-bold text-foreground mb-8 font-serif">
          문의하기
        </h1>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
          <section className="space-y-4">
            <p className="text-lg text-muted-foreground leading-relaxed">
              {SITE_CONFIG.name}에 대한 문의, 제안, 피드백을 환영합니다.
              아래 연락처로 편하게 연락해 주세요.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-xl font-semibold text-foreground">연락 방법</h2>

            <div className="bg-secondary/30 p-6 rounded-lg">
              <h3 className="font-semibold text-foreground mb-4">이메일 문의</h3>
              <p className="text-muted-foreground mb-4">
                서비스 이용, 기술 지원, 제휴 문의 등 모든 문의는 이메일로 받고 있습니다.
              </p>
              <a
                href="mailto:boseong.romi@gmail.com"
                className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                boseong.romi@gmail.com
              </a>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">문의 유형</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="border border-border p-4 rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">서비스 이용 문의</h3>
                <p className="text-muted-foreground text-sm">
                  서비스 이용 방법, 기능 관련 질문
                </p>
              </div>
              <div className="border border-border p-4 rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">기술 지원</h3>
                <p className="text-muted-foreground text-sm">
                  오류 신고, 버그 리포트, 기술적 문제
                </p>
              </div>
              <div className="border border-border p-4 rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">제안 및 피드백</h3>
                <p className="text-muted-foreground text-sm">
                  서비스 개선 아이디어, 새로운 기능 제안
                </p>
              </div>
              <div className="border border-border p-4 rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">제휴 문의</h3>
                <p className="text-muted-foreground text-sm">
                  비즈니스 제휴, 협력 관련 문의
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">응답 안내</h2>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>모든 문의는 영업일 기준 1-3일 이내에 답변드립니다.</li>
              <li>긴급한 문의의 경우 이메일 제목에 [긴급]을 표기해 주세요.</li>
              <li>문의 시 구체적인 내용을 함께 기재해 주시면 더 정확한 답변을 드릴 수 있습니다.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">서비스 정보</h2>
            <div className="bg-secondary/50 p-4 rounded-lg">
              <p className="text-muted-foreground">
                <strong>서비스명:</strong> {SITE_CONFIG.name}<br />
                <strong>웹사이트:</strong>{' '}
                <a
                  href={SITE_CONFIG.url}
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {SITE_CONFIG.url}
                </a>
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
