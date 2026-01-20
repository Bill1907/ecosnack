import { createFileRoute } from '@tanstack/react-router'
import { getPageMeta, SITE_CONFIG } from '../lib/seo'

export const Route = createFileRoute('/privacy')({
  component: PrivacyPolicyPage,
  head: () => ({
    meta: getPageMeta({
      title: '개인정보처리방침',
      description: 'HEY! Vona의 개인정보처리방침입니다. 개인정보 수집, 이용, 보호에 관한 정책을 안내합니다.',
      path: '/privacy',
      keywords: ['개인정보처리방침', '개인정보보호', 'Privacy Policy'],
    }),
  }),
})

function PrivacyPolicyPage() {
  return (
    <main className="flex-1">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <h1 className="text-3xl font-bold text-foreground mb-8 font-serif">
          개인정보처리방침
        </h1>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
          <p className="text-muted-foreground">
            <strong>시행일:</strong> 2025년 1월 1일
            <br />
            <strong>최종 수정일:</strong> 2025년 1월 20일
          </p>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">1. 개인정보의 처리 목적</h2>
            <p className="text-muted-foreground leading-relaxed">
              {SITE_CONFIG.name}(이하 "회사")는 다음의 목적을 위하여 개인정보를 처리합니다.
              처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며
              이용 목적이 변경되는 경우에는 「개인정보 보호법」 제18조에 따라 별도의 동의를 받는 등
              필요한 조치를 이행할 예정입니다.
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>회원 가입 의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증</li>
              <li>회원자격 유지·관리, 서비스 부정이용 방지</li>
              <li>콘텐츠 제공, 맞춤 서비스 제공</li>
              <li>서비스 이용기록과 접속 빈도 분석, 서비스 이용에 대한 통계</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">2. 수집하는 개인정보 항목</h2>
            <p className="text-muted-foreground leading-relaxed">
              회사는 서비스 제공을 위해 다음과 같은 개인정보를 수집합니다.
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li><strong>필수항목:</strong> 이메일 주소, 이름(닉네임)</li>
              <li><strong>자동수집항목:</strong> 서비스 이용 기록, 접속 로그, 쿠키, 접속 IP 정보, 브라우저 정보</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">3. 개인정보의 처리 및 보유 기간</h2>
            <p className="text-muted-foreground leading-relaxed">
              회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에
              동의 받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li><strong>회원 정보:</strong> 회원 탈퇴 시까지 (단, 관계 법령에 따라 보존이 필요한 경우 해당 기간 동안 보관)</li>
              <li><strong>서비스 이용 기록:</strong> 3년</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">4. 개인정보의 제3자 제공</h2>
            <p className="text-muted-foreground leading-relaxed">
              회사는 원칙적으로 정보주체의 개인정보를 수집·이용 목적으로 명시한 범위 내에서 처리하며,
              정보주체의 사전 동의 없이는 본래의 목적 범위를 초과하여 처리하거나 제3자에게 제공하지 않습니다.
              다만, 다음의 경우에는 예외로 합니다.
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>정보주체로부터 별도의 동의를 받은 경우</li>
              <li>법률에 특별한 규정이 있거나 법령상 의무를 준수하기 위하여 불가피한 경우</li>
              <li>정보주체 또는 그 법정대리인이 의사표시를 할 수 없는 상태에 있거나 주소불명 등으로
                  사전 동의를 받을 수 없는 경우로서 명백히 정보주체 또는 제3자의 급박한 생명,
                  신체, 재산의 이익을 위하여 필요하다고 인정되는 경우</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">5. 쿠키(Cookie)의 사용</h2>
            <p className="text-muted-foreground leading-relaxed">
              회사는 이용자에게 개별적인 맞춤서비스를 제공하기 위해 쿠키(cookie)를 사용합니다.
              쿠키는 웹사이트가 이용자의 컴퓨터 브라우저로 보내는 소량의 정보입니다.
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li><strong>쿠키 사용 목적:</strong> 이용자의 접속 빈도나 방문 시간 등을 분석,
                  이용자의 관심분야를 파악, 서비스 개선에 활용</li>
              <li><strong>쿠키 설정 거부 방법:</strong> 이용자는 웹 브라우저에서 옵션을 설정하여
                  모든 쿠키를 허용하거나 거부할 수 있습니다. 단, 쿠키 저장을 거부할 경우
                  맞춤형 서비스 이용에 어려움이 있을 수 있습니다.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">6. 광고 서비스</h2>
            <p className="text-muted-foreground leading-relaxed">
              회사는 Google AdSense를 통해 광고를 게재할 수 있습니다.
              Google을 비롯한 제3자 광고 업체에서는 쿠키를 사용하여
              이용자의 이전 방문 기록을 기반으로 광고를 게재할 수 있습니다.
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Google의 광고 쿠키 사용에 대해서는{' '}
                <a
                  href="https://policies.google.com/technologies/ads"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Google 광고 개인정보보호
                </a>
                를 참조하시기 바랍니다.
              </li>
              <li>이용자는{' '}
                <a
                  href="https://www.google.com/settings/ads"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Google 광고 설정
                </a>
                에서 맞춤 광고를 선택 해제할 수 있습니다.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">7. 개인정보의 안전성 확보 조치</h2>
            <p className="text-muted-foreground leading-relaxed">
              회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다.
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>개인정보의 암호화</li>
              <li>해킹 등에 대비한 기술적 대책</li>
              <li>개인정보에 대한 접근 제한</li>
              <li>SSL/TLS를 통한 데이터 전송 암호화</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">8. 정보주체의 권리·의무 및 행사방법</h2>
            <p className="text-muted-foreground leading-relaxed">
              정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다.
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>개인정보 열람요구</li>
              <li>오류 등이 있을 경우 정정 요구</li>
              <li>삭제요구</li>
              <li>처리정지 요구</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">9. 개인정보 보호책임자</h2>
            <p className="text-muted-foreground leading-relaxed">
              회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고,
              개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여
              아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
            </p>
            <div className="bg-secondary/50 p-4 rounded-lg">
              <p className="text-muted-foreground">
                <strong>개인정보 보호책임자</strong><br />
                이메일: boseong.romi@gmail.com
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">10. 개인정보처리방침 변경</h2>
            <p className="text-muted-foreground leading-relaxed">
              이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 추가,
              삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
