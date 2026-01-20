import { createFileRoute } from '@tanstack/react-router'
import { getPageMeta, SITE_CONFIG } from '../lib/seo'

export const Route = createFileRoute('/terms')({
  component: TermsOfServicePage,
  head: () => ({
    meta: getPageMeta({
      title: '이용약관',
      description: 'HEY! Vona 서비스 이용약관입니다. 서비스 이용에 관한 권리, 의무 및 책임사항을 안내합니다.',
      path: '/terms',
      keywords: ['이용약관', '서비스 약관', 'Terms of Service'],
    }),
  }),
})

function TermsOfServicePage() {
  return (
    <main className="flex-1">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <h1 className="text-3xl font-bold text-foreground mb-8 font-serif">
          이용약관
        </h1>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
          <p className="text-muted-foreground">
            <strong>시행일:</strong> 2025년 1월 1일
            <br />
            <strong>최종 수정일:</strong> 2025년 1월 20일
          </p>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">제1조 (목적)</h2>
            <p className="text-muted-foreground leading-relaxed">
              본 약관은 {SITE_CONFIG.name}(이하 "회사")가 제공하는 서비스의 이용조건 및 절차,
              회사와 회원 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">제2조 (정의)</h2>
            <p className="text-muted-foreground leading-relaxed">
              본 약관에서 사용하는 용어의 정의는 다음과 같습니다.
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li><strong>"서비스"</strong>란 회사가 제공하는 경제 뉴스 분석 및 큐레이션 서비스를 말합니다.</li>
              <li><strong>"회원"</strong>이란 본 약관에 따라 이용계약을 체결하고 서비스를 이용하는 자를 말합니다.</li>
              <li><strong>"콘텐츠"</strong>란 회사가 서비스를 통해 제공하는 뉴스, 분석, 해설 등의 정보를 말합니다.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">제3조 (약관의 효력 및 변경)</h2>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>본 약관은 서비스 화면에 게시하거나 기타의 방법으로 회원에게 공지함으로써 효력이 발생합니다.</li>
              <li>회사는 필요하다고 인정되는 경우 본 약관을 변경할 수 있으며,
                  변경된 약관은 제1항과 같은 방법으로 공지함으로써 효력이 발생합니다.</li>
              <li>회원은 변경된 약관에 동의하지 않을 경우 서비스 이용을 중단하고 탈퇴할 수 있습니다.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">제4조 (이용계약의 체결)</h2>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>이용계약은 회원이 되고자 하는 자가 약관의 내용에 대하여 동의를 한 다음
                  회원가입 신청을 하고 회사가 이를 승낙함으로써 체결됩니다.</li>
              <li>회사는 다음 각 호에 해당하는 신청에 대하여는 승낙을 하지 않거나
                  사후에 이용계약을 해지할 수 있습니다.
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>실명이 아니거나 타인의 명의를 이용한 경우</li>
                  <li>허위의 정보를 기재하거나, 회사가 요구하는 정보를 기재하지 않은 경우</li>
                  <li>기타 회원으로 등록하는 것이 회사의 기술상 현저히 지장이 있다고 판단되는 경우</li>
                </ul>
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">제5조 (서비스의 제공)</h2>
            <p className="text-muted-foreground leading-relaxed">
              회사가 제공하는 서비스는 다음과 같습니다.
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>경제 뉴스 큐레이션 서비스</li>
              <li>뉴스 분석 및 영향 분석 서비스</li>
              <li>북마크 및 저장 기능</li>
              <li>기타 회사가 정하는 서비스</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">제6조 (서비스 이용시간)</h2>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>서비스 이용은 회사의 업무상 또는 기술상 특별한 지장이 없는 한 연중무휴, 1일 24시간을 원칙으로 합니다.</li>
              <li>회사는 시스템 정기점검, 증설 및 교체를 위해 회사가 정한 날이나 시간에
                  서비스를 일시 중단할 수 있으며, 예정되어 있는 작업으로 인한 서비스 일시 중단은
                  서비스를 통해 사전에 공지합니다.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">제7조 (회원의 의무)</h2>
            <p className="text-muted-foreground leading-relaxed">
              회원은 다음 행위를 하여서는 안 됩니다.
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>신청 또는 변경 시 허위 내용의 등록</li>
              <li>타인의 정보 도용</li>
              <li>회사가 게시한 정보의 변경</li>
              <li>회사가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는 게시</li>
              <li>회사 기타 제3자의 저작권 등 지적재산권에 대한 침해</li>
              <li>회사 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위</li>
              <li>외설 또는 폭력적인 메시지, 화상, 음성, 기타 공서양속에 반하는 정보를
                  서비스에 공개 또는 게시하는 행위</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">제8조 (저작권의 귀속 및 이용제한)</h2>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>회사가 작성한 저작물에 대한 저작권 기타 지적재산권은 회사에 귀속합니다.</li>
              <li>회원은 서비스를 이용함으로써 얻은 정보를 회사의 사전 승낙 없이
                  복제, 송신, 출판, 배포, 방송 기타 방법에 의하여 영리목적으로 이용하거나
                  제3자에게 이용하게 하여서는 안 됩니다.</li>
              <li>서비스에서 제공하는 뉴스 콘텐츠의 원본 저작권은 해당 언론사에 귀속되며,
                  회사는 뉴스 분석 및 해설 서비스만을 제공합니다.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">제9조 (광고게재 및 광고주와의 거래)</h2>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>회사는 서비스의 운영과 관련하여 서비스 화면, 이메일 등에 광고를 게재할 수 있습니다.</li>
              <li>회사는 Google AdSense 등 제3자 광고 서비스를 이용할 수 있습니다.</li>
              <li>회원이 서비스상에 게재되어 있는 광고를 이용하거나 광고주의 판촉활동에 참여하는 등의 방법으로
                  교신 또는 거래를 하는 것은 전적으로 회원과 광고주 간의 문제입니다.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">제10조 (면책조항)</h2>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>회사는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는
                  서비스 제공에 관한 책임이 면제됩니다.</li>
              <li>회사는 회원의 귀책사유로 인한 서비스 이용의 장애에 대하여 책임을 지지 않습니다.</li>
              <li>회사는 서비스를 통해 제공되는 정보의 신뢰도, 정확성 등에 대하여 보증하지 않으며,
                  이에 따른 회원의 손해에 대하여 책임을 지지 않습니다.</li>
              <li>서비스에서 제공하는 정보는 투자 조언이 아니며, 회원의 투자 결정에 대한 책임은 회원에게 있습니다.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">제11조 (분쟁해결)</h2>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>회사와 회원 간 발생한 분쟁에 관한 소송은 대한민국 법원을 관할법원으로 합니다.</li>
              <li>회사와 회원 간에 발생한 분쟁에 대해서는 대한민국 법률을 적용합니다.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">제12조 (연락처)</h2>
            <p className="text-muted-foreground leading-relaxed">
              서비스 이용에 관한 문의는 아래 연락처로 문의해 주시기 바랍니다.
            </p>
            <div className="bg-secondary/50 p-4 rounded-lg">
              <p className="text-muted-foreground">
                <strong>서비스명:</strong> {SITE_CONFIG.name}<br />
                <strong>이메일:</strong> boseong.romi@gmail.com
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              <strong>부칙</strong><br />
              본 약관은 2025년 1월 1일부터 시행합니다.
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
