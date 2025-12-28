export function Navigation() {
  return (
    <header className="border-b border-[#e5e5e5] bg-white ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6 sm:py-8 text-center ">
          <h1
            className="mb-1 sm:mb-2 text-[#1a1a1a] font-serif"
            style={{
              fontSize: 'clamp(24px, 5vw, 42px)',
              fontWeight: '700',
              letterSpacing: '-0.02em',
            }}
          >
            EcoSnack 🥜
          </h1>
          {/* <p
              className="text-[#666666] max-w-3xl mx-auto px-2 sm:px-4"
              style={{
                fontSize: 'clamp(11px, 2vw, 15px)',
                lineHeight: '1.6',
              }}
            >
              글로벌 & 한국 경제 뉴스를 '그래서 나한테 뭔 영향?'까지 쉽게
              설명해주는 서비스
            </p> */}
        </div>
      </div>
    </header>
  )
}
