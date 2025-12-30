export function Footer() {
  return (
    <footer className="border-t border-[#e5e5e5] bg-[#fafafa] mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* About */}
          <div>
            <h3
              className="mb-4 text-[#1a1a1a] font-serif"
              style={{ fontSize: '18px', fontWeight: '700' }}
            >
              Hey! Vona
            </h3>
            <p
              className="text-[#666666] mb-4"
              style={{ fontSize: '14px', lineHeight: '1.6' }}
            >
              오늘의 경제, 한 입에 🥜
              <br />
              글로벌 & 한국 경제 뉴스를 '그래서 나한테 뭔 영향?'까지 쉽게
              설명해주는 서비스
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4
              className="mb-4 text-[#1a1a1a]"
              style={{ fontSize: '16px', fontWeight: '600' }}
            >
              문의
            </h4>
            <p
              className="text-[#666666]"
              style={{ fontSize: '14px', lineHeight: '1.6' }}
            >
              이메일: contact@ecosnack.com
              <br />© 2025 Ecosnack. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
