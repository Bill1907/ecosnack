export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // 브랜드 색상
        primary: {
          DEFAULT: '#1a1a1a',
          foreground: '#ffffff',
        },
        // 텍스트 색상
        text: {
          primary: '#1a1a1a',
          secondary: '#666666',
          tertiary: '#999999',
        },
        // 배경 색상
        bg: {
          primary: '#ffffff',
          secondary: '#f5f5f5',
          tertiary: '#e5e5e5',
        },
        // 링크 색상
        link: {
          DEFAULT: '#0066cc',
          hover: '#0052a3',
        },
      },
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
