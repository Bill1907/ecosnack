export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontSize: {
        // 반응형 폰트 사이즈
        'responsive-xs': 'clamp(12px, 2vw, 13px)',
        'responsive-sm': 'clamp(14px, 2.5vw, 15px)',
        'responsive-base': 'clamp(16px, 3vw, 18px)',
        'responsive-lg': 'clamp(16px, 3vw, 20px)',
        'responsive-xl': 'clamp(20px, 4vw, 24px)',
        'responsive-2xl': 'clamp(24px, 5vw, 32px)',
        'responsive-3xl': 'clamp(28px, 5vw, 40px)',
      },
    },
  },
  plugins: [],
}
