interface KeyInsightBoxProps {
  insight: string
}

export function KeyInsightBox({ insight }: KeyInsightBoxProps) {
  return (
    <div className="bg-[#fffbeb] border-l-4 border-[#fbbf24] p-6 my-8 rounded-sm">
      <div className="flex items-start gap-3">
        <span className="text-2xl">💡</span>
        <div className="flex-1">
          <h3
            className="mb-2 text-[#1a1a1a] font-serif"
            style={{
              fontSize: 'clamp(18px, 3vw, 22px)',
              fontWeight: '700',
            }}
          >
            나한테 뭔 영향?
          </h3>
          <p
            className="text-[#666666]"
            style={{
              fontSize: 'clamp(15px, 2.5vw, 17px)',
              lineHeight: '1.7',
            }}
          >
            {insight}
          </p>
        </div>
      </div>
    </div>
  )
}
