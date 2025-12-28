import { useNavigate } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

export function BackButton() {
  const navigate = useNavigate()

  return (
    <button
      onClick={() => navigate({ to: '/' })}
      className="flex items-center gap-2 text-[#666666] hover:text-[#1a1a1a] transition-colors mb-6"
      style={{ fontSize: '14px', fontWeight: '500' }}
    >
      <ArrowLeft className="w-4 h-4" />
      <span>뒤로 가기</span>
    </button>
  )
}
