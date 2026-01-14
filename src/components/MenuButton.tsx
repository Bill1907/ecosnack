import { Menu } from 'lucide-react'
import { useUIStore } from '@/stores/uiStore'

export function MenuButton() {
  const { toggleSidebar } = useUIStore()

  return (
    <button
      onClick={toggleSidebar}
      className="p-2 hover:bg-accent rounded-lg transition-colors"
      aria-label="메뉴 열기"
    >
      <Menu className="w-6 h-6" />
    </button>
  )
}
