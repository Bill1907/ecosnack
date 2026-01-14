// PostHog 전역 타입 선언
declare global {
  interface Window {
    posthog?: {
      capture: (eventName: string, properties?: Record<string, unknown>) => void
      identify: (userId: string, properties?: Record<string, unknown>) => void
      reset: () => void
    }
  }
}

export {}
