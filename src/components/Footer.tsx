import { Link } from '@tanstack/react-router'

export function Footer() {
  return (
    <footer className="border-t bg-secondary/30 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3
              className="mb-4 text-foreground font-serif"
              style={{ fontSize: '18px', fontWeight: '700' }}
            >
              Hey! Vona
            </h3>
            <p
              className="text-muted-foreground mb-4"
              style={{ fontSize: '14px', lineHeight: '1.6' }}
            >
              오늘의 경제, 한 입에
              <br />
              글로벌 & 한국 경제 뉴스를 '그래서 나한테 뭔 영향?'까지 쉽게
              설명해주는 서비스
            </p>
          </div>

          {/* Links */}
          <div>
            <h4
              className="mb-4 text-foreground"
              style={{ fontSize: '16px', fontWeight: '600' }}
            >
              바로가기
            </h4>
            <nav className="flex flex-col gap-2">
              <Link
                to="/about"
                className="text-muted-foreground hover:text-foreground transition-colors"
                style={{ fontSize: '14px' }}
              >
                소개
              </Link>
              <Link
                to="/contact"
                className="text-muted-foreground hover:text-foreground transition-colors"
                style={{ fontSize: '14px' }}
              >
                문의하기
              </Link>
              <Link
                to="/privacy"
                className="text-muted-foreground hover:text-foreground transition-colors"
                style={{ fontSize: '14px' }}
              >
                개인정보처리방침
              </Link>
              <Link
                to="/terms"
                className="text-muted-foreground hover:text-foreground transition-colors"
                style={{ fontSize: '14px' }}
              >
                이용약관
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4
              className="mb-4 text-foreground"
              style={{ fontSize: '16px', fontWeight: '600' }}
            >
              문의
            </h4>
            <p
              className="text-muted-foreground"
              style={{ fontSize: '14px', lineHeight: '1.6' }}
            >
              이메일:{' '}
              <a
                href="mailto:boseong.romi@gmail.com"
                className="hover:text-foreground transition-colors"
              >
                boseong.romi@gmail.com
              </a>
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-border">
          <p
            className="text-muted-foreground text-center"
            style={{ fontSize: '13px' }}
          >
            © {new Date().getFullYear()} Hey! Vona. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
