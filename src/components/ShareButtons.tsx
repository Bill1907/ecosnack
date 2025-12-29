import { Share2 } from 'lucide-react'

interface ShareButtonsProps {
  sticky?: boolean
}

export function ShareButtons({ sticky = false }: ShareButtonsProps) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url: window.location.href,
        })
      } catch (err) {
        console.log('Error sharing', err)
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href)
      alert('링크가 복사되었습니다!')
    }
  }

  if (sticky) {
    return (
      <div className="md:hidden fixed bottom-4 right-4 z-40">
        <button
          onClick={handleShare}
          className="bg-[#1a1a1a] text-white p-4 rounded-full shadow-lg hover:bg-[#333333] transition-colors"
          aria-label="공유하기"
        >
          <Share2 className="w-5 h-5" />
        </button>
      </div>
    )
  }

  return (
    <div className="hidden md:flex items-center gap-3">
      <button
        onClick={handleShare}
        className="flex items-center gap-2 px-4 py-2 border border-[#e5e5e5] rounded hover:bg-[#f5f5f5] transition-colors"
        style={{ fontSize: '14px', fontWeight: '500' }}
      >
        <Share2 className="w-4 h-4" />
        <span>공유하기</span>
      </button>
    </div>
  )
}
