import Typography from "typography"

const typography = new Typography({
  baseFontSize: '18px',
  baseLineHeight: 1.666,
  headerFontFamily: ['Noto Sans JP', 'sans-serif'],
  bodyFontFamily: ['Noto Sans JP', 'sans-serif'],
  googleFonts: [
    {
      name: 'Noto Sans JP', styles: ['300'],
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
