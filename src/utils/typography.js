import Typography from "typography"

const typography = new Typography({
  baseFontSize: '16px',
  baseLineHeight: 1.8,
  headerFontFamily: ['Noto Sans JP', 'sans-serif'],
  bodyFontFamily: ['Noto Sans JP', 'sans-serif'],
  googleFonts: [
    {
      name: 'Noto Sans JP', styles: ['400'],
    },
  ]
})

typography.toString()

// Hot reload typography in development.
if (process.env.NODE_ENV !== `production`) {
  typography.injectStyles()
}


export default typography
export const rhythm = typography.rhythm
export const scale = typography.scale
